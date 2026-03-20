import json
import logging
import os
from fastapi import APIRouter, HTTPException, Request
from svix import Webhook, WebhookVerificationError

from app.enterprise_supabase import (
    delete_org_member,
    get_org_id_by_clerk_org_id,
    upsert_org_member,
)

logger = logging.getLogger(__name__)

router = APIRouter()

CLERK_WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET", "").strip()


def _require_webhook_secret():
    if not CLERK_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="CLERK_WEBHOOK_SECRET not configured.")


def _normalize_role(role: str | None) -> str | None:
    if not role:
        return None
    if role.startswith("org:"):
        role = role.split("org:", 1)[1]
    return role or None


def _extract_ids(data: dict) -> tuple[str | None, str | None, str | None]:
    clerk_org_id = data.get("organization_id") or (data.get("organization") or {}).get("id")
    user_id = data.get("user_id") or (data.get("public_user_data") or {}).get("user_id")
    role = _normalize_role(data.get("role"))
    return clerk_org_id, user_id, role


@router.post("/webhooks/clerk")
async def clerk_webhook(request: Request):
    _require_webhook_secret()

    payload = await request.body()
    headers = request.headers
    svix_id = headers.get("svix-id")
    svix_ts = headers.get("svix-timestamp")
    svix_sig = headers.get("svix-signature")

    if not svix_id or not svix_ts or not svix_sig:
        raise HTTPException(status_code=400, detail="Missing Svix headers.")

    try:
        wh = Webhook(CLERK_WEBHOOK_SECRET)
        event = wh.verify(
            payload,
            {
                "svix-id": svix_id,
                "svix-timestamp": svix_ts,
                "svix-signature": svix_sig,
            },
        )
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    if isinstance(event, str):
        try:
            event = json.loads(event)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid webhook payload.")

    event_type = event.get("type")
    data = event.get("data") or {}

    if event_type in {"organizationMembership.created", "organizationMembership.updated"}:
        clerk_org_id, user_id, role = _extract_ids(data)
        if not clerk_org_id or not user_id:
            raise HTTPException(status_code=400, detail="Missing organization_id or user_id.")

        org_id = await get_org_id_by_clerk_org_id(clerk_org_id)
        if not org_id:
            logger.warning("Webhook org not found for clerk_org_id=%s", clerk_org_id)
            return {"ok": True, "skipped": "org_not_found"}

        await upsert_org_member(org_id=org_id, user_id=user_id, role=role)
        return {"ok": True}

    if event_type == "organizationMembership.deleted":
        clerk_org_id, user_id, _role = _extract_ids(data)
        if not clerk_org_id or not user_id:
            raise HTTPException(status_code=400, detail="Missing organization_id or user_id.")

        org_id = await get_org_id_by_clerk_org_id(clerk_org_id)
        if not org_id:
            logger.warning("Webhook org not found for clerk_org_id=%s", clerk_org_id)
            return {"ok": True, "skipped": "org_not_found"}

        await delete_org_member(org_id=org_id, user_id=user_id)
        return {"ok": True}

    return {"ok": True, "ignored": event_type}
