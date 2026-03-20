import os
import secrets
import time
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlencode

import httpx
import base64
import jwt
import logging
from cachetools import TTLCache
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

from app.auth import APP_JWT_AUDIENCE, APP_JWT_ISSUER, APP_JWT_SECRET, require_clerk_user
from app.enterprise_supabase import get_org_id_for_user, get_org_subscription

router = APIRouter()
logger = logging.getLogger(__name__)

CLERK_FRONTEND_API_URL = os.environ.get("CLERK_FRONTEND_API_URL", "").strip().rstrip("/")
CLERK_OAUTH_CLIENT_ID = os.environ.get("CLERK_OAUTH_CLIENT_ID", "").strip()
CLERK_OAUTH_CLIENT_SECRET = os.environ.get("CLERK_OAUTH_CLIENT_SECRET", "").strip()
CLERK_API_BASE = os.environ.get("CLERK_API_BASE", "https://api.clerk.com/v1").strip()
CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY", "").strip()
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "").strip()
MAGIC_LINK_BASE_URL = os.environ.get("MAGIC_LINK_BASE_URL", "").strip().rstrip("/")
# TODO: remove dev bypass before production launch
DEV_BYPASS_SUBSCRIPTION = os.environ.get("DEV_BYPASS_SUBSCRIPTION", "").strip().lower() in ("1", "true", "yes")
DEV_BYPASS_EMAILS = {
    e.strip().lower()
    for e in os.environ.get("DEV_BYPASS_EMAILS", "").split(",")
    if e.strip()
}

AUTH_JWT_TTL_SECONDS = int(os.environ.get("AUTH_JWT_TTL_SECONDS", "3600").strip() or "3600")

_state_cache = TTLCache(maxsize=2048, ttl=600)
_meta_cache = TTLCache(maxsize=4, ttl=600)
_rate_cache = TTLCache(maxsize=4096, ttl=60)

RATE_LIMIT_PER_MINUTE = int(os.environ.get("AUTH_RATE_LIMIT_PER_MIN", "10").strip() or "10")


def _require_clerk_oauth_env():
    if not CLERK_FRONTEND_API_URL:
        raise HTTPException(status_code=500, detail="CLERK_FRONTEND_API_URL not configured.")
    if not CLERK_OAUTH_CLIENT_ID:
        raise HTTPException(status_code=500, detail="CLERK_OAUTH_CLIENT_ID not configured.")


def _require_app_jwt_secret():
    if not APP_JWT_SECRET:
        raise HTTPException(status_code=500, detail="APP_JWT_SECRET not configured.")


def _require_clerk_secret():
    if not CLERK_SECRET_KEY:
        raise HTTPException(status_code=500, detail="CLERK_SECRET_KEY not configured.")


def _require_resend():
    if not RESEND_API_KEY or not RESEND_FROM_EMAIL:
        raise HTTPException(status_code=500, detail="RESEND_API_KEY or RESEND_FROM_EMAIL not configured.")
    if not MAGIC_LINK_BASE_URL:
        raise HTTPException(status_code=500, detail="MAGIC_LINK_BASE_URL not configured.")


def _is_dev_bypass_user_email(email: Optional[str]) -> bool:
    if not DEV_BYPASS_SUBSCRIPTION:
        return False
    e = (email or "").strip().lower()
    if not e:
        return False
    return e in DEV_BYPASS_EMAILS


def _base64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _pkce_verifier() -> str:
    return secrets.token_urlsafe(64)


def _pkce_challenge(verifier: str) -> str:
    import hashlib

    digest = hashlib.sha256(verifier.encode("utf-8")).digest()
    return _base64url(digest)


async def _oauth_metadata():
    _require_clerk_oauth_env()
    cached = _meta_cache.get(CLERK_FRONTEND_API_URL)
    if cached:
        return cached
    url = f"{CLERK_FRONTEND_API_URL}/.well-known/oauth-authorization-server"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        raise HTTPException(status_code=503, detail="OAuth metadata unavailable.")
    _meta_cache[CLERK_FRONTEND_API_URL] = data
    return data


def _build_authorize_url(meta: dict, redirect_uri: str, provider: Optional[str]):
    verifier = _pkce_verifier()
    challenge = _pkce_challenge(verifier)
    state = secrets.token_urlsafe(32)

    _state_cache[state] = {
        "verifier": verifier,
        "redirect_uri": redirect_uri,
        "provider": provider,
        "created_at": time.time(),
    }

    params = {
        "client_id": CLERK_OAUTH_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid profile email",
        "state": state,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
    }

    if provider:
        params["provider"] = provider
        params["strategy"] = f"oauth_{provider}"

    return f"{meta['authorization_endpoint']}?{urlencode(params)}"


def _validate_redirect_uri(redirect_uri: str):
    if not redirect_uri or not redirect_uri.startswith("moldpredict://"):
        raise HTTPException(status_code=400, detail="Invalid redirect URI.")


class FinishPayload(BaseModel):
    code: str
    state: str
    redirect: str


class MagicStartPayload(BaseModel):
    email: str


class PasswordPayload(BaseModel):
    email: str
    password: str


def _issue_app_jwt(user_id: str, userinfo: dict):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=AUTH_JWT_TTL_SECONDS)
    org_id = userinfo.get("org_id")
    claims = {
        "sub": user_id,
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
        "given_name": userinfo.get("given_name"),
        "family_name": userinfo.get("family_name"),
        "org_id": org_id,
        "iss": APP_JWT_ISSUER,
        "aud": APP_JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "typ": "app",
    }
    return jwt.encode(claims, APP_JWT_SECRET, algorithm="HS256"), exp


def _rate_key(prefix: str, email: str, request: Request):
    ip = request.client.host if request.client else "unknown"
    return f"{prefix}:{ip}:{email}"


def _check_rate_limit(key: str):
    count = _rate_cache.get(key, 0) + 1
    _rate_cache[key] = count
    if count > RATE_LIMIT_PER_MINUTE:
        raise HTTPException(status_code=429, detail="Too many attempts. Please try again later.")


def _extract_email(user: dict) -> str:
    primary_id = user.get("primary_email_address_id")
    emails = user.get("email_addresses") or []
    if primary_id:
        for e in emails:
            if e.get("id") == primary_id:
                return e.get("email_address") or ""
    if emails:
        return emails[0].get("email_address") or ""
    return user.get("email") or ""


@router.get("/auth/start")
async def auth_start(provider: Optional[str] = None, redirect: str = ""):
    _validate_redirect_uri(redirect)
    meta = await _oauth_metadata()
    url = _build_authorize_url(meta, redirect, provider)
    return {"authorize_url": url}


@router.post("/auth/finish")
async def auth_finish(payload: FinishPayload):
    _require_app_jwt_secret()
    _validate_redirect_uri(payload.redirect)

    entry = _state_cache.get(payload.state)
    if not entry:
        raise HTTPException(status_code=400, detail="Invalid or expired state.")
    if entry.get("redirect_uri") != payload.redirect:
        raise HTTPException(status_code=400, detail="Redirect mismatch.")
    _state_cache.pop(payload.state, None)

    meta = await _oauth_metadata()
    token_url = meta.get("token_endpoint")
    userinfo_url = meta.get("userinfo_endpoint")
    if not token_url:
        raise HTTPException(status_code=500, detail="OAuth token endpoint unavailable.")

    form = {
        "grant_type": "authorization_code",
        "code": payload.code,
        "redirect_uri": payload.redirect,
        "client_id": CLERK_OAUTH_CLIENT_ID,
        "code_verifier": entry["verifier"],
    }

    auth = None
    if CLERK_OAUTH_CLIENT_SECRET:
        auth = (CLERK_OAUTH_CLIENT_ID, CLERK_OAUTH_CLIENT_SECRET)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(token_url, data=form, auth=auth)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="OAuth token exchange failed.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="OAuth token exchange rejected.")

    token_data = resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=502, detail="Missing access token.")

    userinfo = {}
    if userinfo_url:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                uresp = await client.get(
                    userinfo_url,
                    headers={"Authorization": f"Bearer {access_token}"},
                )
                if uresp.status_code < 400:
                    userinfo = uresp.json()
        except httpx.RequestError:
            userinfo = {}

    user_id = userinfo.get("sub")
    if not user_id:
        raise HTTPException(status_code=502, detail="Userinfo missing subject.")

    email = userinfo.get("email")
    if _is_dev_bypass_user_email(email):
        org_id = "dev-bypass"
        subscription = {"status": "active"}
        logger.info("Dev subscription bypass used for email=%s", email)
    else:
        org_id = await get_org_id_for_user(user_id)
        subscription = await get_org_subscription(org_id) if org_id else None

    userinfo["org_id"] = org_id
    app_token, exp = _issue_app_jwt(user_id, userinfo)

    return {
        "access_token": app_token,
        "token_type": "bearer",
        "expires_at": int(exp.timestamp()),
        "user": {
            "id": user_id,
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "given_name": userinfo.get("given_name"),
            "family_name": userinfo.get("family_name"),
            "org_id": org_id,
            "subscription_status": subscription.get("status") if subscription else None,
        },
    }


@router.post("/auth/exchange")
async def auth_exchange(user=Depends(require_clerk_user)):
    _require_app_jwt_secret()
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")
    email = user.get("email") or user.get("email_address")
    if _is_dev_bypass_user_email(email):
        org_id = "dev-bypass"
        subscription = {"status": "active"}
        logger.info("Dev subscription bypass used for email=%s", email)
    else:
        org_id = await get_org_id_for_user(user_id)
        subscription = await get_org_subscription(org_id) if org_id else None
    userinfo = {
        "email": email,
        "name": user.get("name"),
        "given_name": user.get("given_name"),
        "family_name": user.get("family_name"),
        "org_id": org_id,
    }
    app_token, exp = _issue_app_jwt(user_id, userinfo)
    return {
        "access_token": app_token,
        "token_type": "bearer",
        "expires_at": int(exp.timestamp()),
        "user": {
            "id": user_id,
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "given_name": userinfo.get("given_name"),
            "family_name": userinfo.get("family_name"),
            "org_id": org_id,
            "subscription_status": subscription.get("status") if subscription else None,
        },
    }


@router.post("/auth/magic/start")
async def magic_start(payload: MagicStartPayload, request: Request):
    _require_clerk_secret()
    _require_resend()

    email = (payload.email or "").strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email.")
    _check_rate_limit(_rate_key("magic", email, request))

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{CLERK_API_BASE}/users",
                params={"email_address": email, "limit": 1},
                headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="User lookup failed.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="User lookup rejected.")

    users = resp.json()
    if not users:
        raise HTTPException(status_code=404, detail="No user found for that email.")

    user_id = users[0].get("id")
    if not user_id:
        raise HTTPException(status_code=502, detail="User lookup invalid.")

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            token_resp = await client.post(
                f"{CLERK_API_BASE}/sign_in_tokens",
                headers={
                    "Authorization": f"Bearer {CLERK_SECRET_KEY}",
                    "Content-Type": "application/json",
                },
                json={"user_id": user_id},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Token creation failed.")

    if token_resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Token creation rejected.")

    token_data = token_resp.json()
    token = token_data.get("token")
    if not token:
        raise HTTPException(status_code=502, detail="Missing sign-in token.")

    magic_link = f"{MAGIC_LINK_BASE_URL}?token={token}"

    email_payload = {
        "from": RESEND_FROM_EMAIL,
        "to": email,
        "subject": "Your MoldPredict magic link",
        "text": f"Click to sign in: {magic_link}",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resend_resp = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=email_payload,
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Email delivery failed.")

    if resend_resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Email delivery rejected.")

    return {"ok": True}


@router.post("/auth/password")
async def auth_password(payload: PasswordPayload, request: Request):
    _require_clerk_secret()
    _require_app_jwt_secret()

    email = (payload.email or "").strip().lower()
    password = payload.password or ""
    if "@" not in email or not password:
        raise HTTPException(status_code=400, detail="Invalid credentials.")
    _check_rate_limit(_rate_key("password", email, request))

    # Lookup user by email
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{CLERK_API_BASE}/users",
                params={"email_address": email, "limit": 1},
                headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth service unavailable.")

    if resp.status_code >= 400:
        logger.warning(
            "Clerk users lookup failed status=%s body=%s",
            resp.status_code,
            resp.text,
        )
        raise HTTPException(status_code=502, detail="Auth service unavailable.")

    users = resp.json()
    if not users:
        logger.info("Clerk users lookup empty for email=%s", email)
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    user = users[0]
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    # Verify password with Clerk
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            verify_resp = await client.post(
                f"{CLERK_API_BASE}/users/{user_id}/verify_password",
                headers={
                    "Authorization": f"Bearer {CLERK_SECRET_KEY}",
                    "Content-Type": "application/json",
                },
                json={"password": password},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth service unavailable.")

    if verify_resp.status_code >= 400:
        logger.warning(
            "Clerk verify_password failed status=%s body=%s",
            verify_resp.status_code,
            verify_resp.text,
        )
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    verify_data = verify_resp.json()
    if not verify_data.get("verified"):
        logger.info("Clerk verify_password returned verified=false for email=%s", email)
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    org_id = await get_org_id_for_user(user_id)
    subscription = await get_org_subscription(org_id) if org_id else None

    userinfo = {
        "email": _extract_email(user),
        "name": " ".join(
            [p for p in [user.get("first_name"), user.get("last_name")] if p]
        ).strip()
        or None,
        "given_name": user.get("first_name"),
        "family_name": user.get("last_name"),
        "org_id": org_id,
    }

    app_token, exp = _issue_app_jwt(user_id, userinfo)

    return {
        "access_token": app_token,
        "token_type": "bearer",
        "expires_at": int(exp.timestamp()),
        "user": {
            "id": user_id,
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "given_name": userinfo.get("given_name"),
            "family_name": userinfo.get("family_name"),
            "org_id": org_id,
            "subscription_status": subscription.get("status") if subscription else None,
        },
    }
