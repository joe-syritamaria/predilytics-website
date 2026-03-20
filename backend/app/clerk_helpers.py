import inspect
import os
from typing import Any

from cachetools import TTLCache
from fastapi import HTTPException

CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY", "").strip()
CLERK_API_BASE = os.environ.get("CLERK_API_BASE", "https://api.clerk.com/v1").strip()

_user_cache = TTLCache(maxsize=1024, ttl=60)
_org_cache = TTLCache(maxsize=256, ttl=60)


def _require_secret():
    if not CLERK_SECRET_KEY:
        raise HTTPException(status_code=500, detail="CLERK_SECRET_KEY not configured.")


def _load_sdk_client():
    try:
        import clerk_backend_api as clerk_mod  # type: ignore
    except Exception as exc:  # pragma: no cover - only evaluated at runtime
        raise HTTPException(status_code=500, detail="Clerk SDK not installed.") from exc

    for cls_name in ("Clerk", "Client", "ClerkBackendAPI"):
        cls = getattr(clerk_mod, cls_name, None)
        if cls:
            return cls

    raise HTTPException(status_code=500, detail="Unsupported Clerk SDK version.")


def _init_sdk():
    _require_secret()
    cls = _load_sdk_client()
    params = inspect.signature(cls).parameters
    kwargs = {}
    if "api_key" in params:
        kwargs["api_key"] = CLERK_SECRET_KEY
    elif "secret_key" in params:
        kwargs["secret_key"] = CLERK_SECRET_KEY
    elif "bearer_auth" in params:
        kwargs["bearer_auth"] = CLERK_SECRET_KEY
    if "base_url" in params:
        kwargs["base_url"] = CLERK_API_BASE
    return cls(**kwargs)


def _call_first(obj: Any, names: list[str], *args, **kwargs):
    for name in names:
        fn = getattr(obj, name, None)
        if callable(fn):
            return fn(*args, **kwargs)
    raise HTTPException(status_code=500, detail="Clerk SDK method not found.")


def get_clerk_user(user_id: str):
    client = _init_sdk()
    users = getattr(client, "users", client)
    return _call_first(
        users,
        ["get", "get_user", "retrieve"],
        user_id,
    )


def get_clerk_user_cached(user_id: str):
    cached = _user_cache.get(user_id)
    if cached is not None:
        return cached
    user = get_clerk_user(user_id)
    _user_cache[user_id] = user
    return user


def get_clerk_org(org_id: str):
    client = _init_sdk()
    orgs = getattr(client, "organizations", client)
    return _call_first(
        orgs,
        ["get", "get_organization", "retrieve"],
        org_id,
    )


def get_clerk_org_cached(org_id: str):
    cached = _org_cache.get(org_id)
    if cached is not None:
        return cached
    org = get_clerk_org(org_id)
    _org_cache[org_id] = org
    return org


def list_clerk_org_members(org_id: str, limit: int = 50):
    client = _init_sdk()
    orgs = getattr(client, "organizations", client)
    return _call_first(
        orgs,
        ["list_members", "get_members", "list_organization_members"],
        org_id,
        limit=limit,
    )
