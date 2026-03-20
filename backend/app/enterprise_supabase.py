import os
import logging
from typing import Optional
import httpx
from fastapi import HTTPException

ENTERPRISE_SUPABASE_URL = os.environ.get("ENTERPRISE_SUPABASE_URL", "").rstrip("/")
ENTERPRISE_SUPABASE_SERVICE_ROLE_KEY = os.environ.get("ENTERPRISE_SUPABASE_SERVICE_ROLE_KEY", "")

logger = logging.getLogger(__name__)


def _require_enterprise_env():
    if not ENTERPRISE_SUPABASE_URL or not ENTERPRISE_SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="Enterprise Supabase env not configured.")


def _headers():
    return {
        "apikey": ENTERPRISE_SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {ENTERPRISE_SUPABASE_SERVICE_ROLE_KEY}",
    }


async def get_org_id_for_user(user_id: str) -> Optional[str]:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/org_members"
    params = {
        "select": "org_id",
        "user_id": f"eq.{user_id}",
        "limit": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org lookup unavailable.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Failed to query org_members.")
    data = resp.json()
    if not data:
        return None
    return data[0].get("org_id")


async def get_org_subscription(org_id: str) -> Optional[dict]:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/org_subscriptions"
    params = {
        "select": "org_id,plan,status,current_period_end",
        "org_id": f"eq.{org_id}",
        "limit": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Subscription lookup unavailable.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Failed to query org_subscriptions.")
    data = resp.json()
    if not data:
        return None
    return data[0]


async def get_org_stripe_customer_id(org_id: str) -> Optional[str]:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/orgs"
    params = {
        "select": "stripe_customer_id",
        "id": f"eq.{org_id}",
        "limit": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org lookup unavailable.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Failed to query orgs.")
    data = resp.json()
    if not data:
        return None
    return data[0].get("stripe_customer_id")


async def get_org_clerk_id(org_id: str) -> Optional[str]:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/orgs"
    params = {
        "select": "clerk_org_id",
        "id": f"eq.{org_id}",
        "limit": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org lookup unavailable.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Failed to query orgs.")
    data = resp.json()
    if not data:
        return None
    return data[0].get("clerk_org_id")


async def get_org_id_by_clerk_org_id(clerk_org_id: str) -> Optional[str]:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/orgs"
    params = {
        "select": "id",
        "clerk_org_id": f"eq.{clerk_org_id}",
        "limit": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org lookup unavailable.")

    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Failed to query orgs.")
    data = resp.json()
    if not data:
        return None
    return data[0].get("id")


async def upsert_org_member(org_id: str, user_id: str, role: Optional[str]) -> None:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/org_members"
    params = {"on_conflict": "org_id,user_id"}
    headers = {
        **_headers(),
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }
    payload = {
        "org_id": org_id,
        "user_id": user_id,
        "role": role or "org:member",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, headers=headers, params=params, json=payload)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org member upsert unavailable.")

    if resp.status_code >= 400:
        logger.error(
            "Org member upsert failed status=%s body=%s",
            resp.status_code,
            resp.text,
        )
        raise HTTPException(status_code=502, detail="Failed to upsert org member.")


async def delete_org_member(org_id: str, user_id: str) -> None:
    _require_enterprise_env()
    url = f"{ENTERPRISE_SUPABASE_URL}/rest/v1/org_members"
    params = {
        "org_id": f"eq.{org_id}",
        "user_id": f"eq.{user_id}",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.delete(url, headers=_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Org member delete unavailable.")

    if resp.status_code >= 400:
        logger.error(
            "Org member delete failed status=%s body=%s",
            resp.status_code,
            resp.text,
        )
        raise HTTPException(status_code=502, detail="Failed to delete org member.")
