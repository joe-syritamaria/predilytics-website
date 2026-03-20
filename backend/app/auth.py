import os
from cachetools import TTLCache
import httpx
import json
import jwt
from fastapi import HTTPException, Header

CLERK_ISSUER = os.environ.get("CLERK_ISSUER", "").rstrip("/")
CLERK_JWKS_URL = os.environ.get("CLERK_JWKS_URL", "").strip()
CLERK_AUDIENCE = os.environ.get("CLERK_AUDIENCE", "").strip() or None
APP_JWT_SECRET = os.environ.get("APP_JWT_SECRET", "").strip()
APP_JWT_ISSUER = os.environ.get("APP_JWT_ISSUER", "moldpredict-api").strip()
APP_JWT_AUDIENCE = os.environ.get("APP_JWT_AUDIENCE", "moldpredict-desktop").strip()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

_jwks_cache = TTLCache(maxsize=2, ttl=600)


def _resolve_jwks_url():
    if CLERK_JWKS_URL:
        return CLERK_JWKS_URL
    if CLERK_ISSUER:
        return f"{CLERK_ISSUER}/.well-known/jwks.json"
    return ""


async def _get_jwks():
    url = _resolve_jwks_url()
    if not url:
        raise HTTPException(status_code=500, detail="Clerk JWKS URL not configured.")

    cached = _jwks_cache.get(url)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        raise HTTPException(status_code=503, detail="Auth service unavailable.")

    _jwks_cache[url] = data
    return data


def _decode_app_token(token: str):
    if not APP_JWT_SECRET:
        return None
    try:
        claims = jwt.decode(
            token,
            key=APP_JWT_SECRET,
            algorithms=["HS256"],
            audience=APP_JWT_AUDIENCE or None,
            issuer=APP_JWT_ISSUER or None,
        )
    except jwt.PyJWTError:
        return None
    if claims.get("typ") != "app":
        return None
    return claims


async def _decode_clerk_token(token: str):

    try:
        header = jwt.get_unverified_header(token)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

    jwks = await _get_jwks()
    key = None
    for k in jwks.get("keys", []):
        if k.get("kid") == header.get("kid"):
            key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(k))
            break
    if not key:
        raise HTTPException(status_code=401, detail="Invalid token.")

    options = {"verify_aud": bool(CLERK_AUDIENCE)}
    try:
        claims = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            audience=CLERK_AUDIENCE,
            issuer=CLERK_ISSUER or None,
            options=options,
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

    return claims


async def require_clerk_user(authorization: str = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token.")
    token = authorization.split(" ", 1)[1].strip()
    return await _decode_clerk_token(token)


async def require_api_user(authorization: str = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token.")
    token = authorization.split(" ", 1)[1].strip()
    app_claims = _decode_app_token(token)
    if app_claims:
        return app_claims
    return await _decode_clerk_token(token)


async def require_clerk_org_user(authorization: str = Header(default=None)):
    claims = await require_api_user(authorization)
    org_id = claims.get("org_id")
    org_role = claims.get("org_role")
    if not org_id or not org_role:
        raise HTTPException(status_code=403, detail="Organization required.")
    return claims

