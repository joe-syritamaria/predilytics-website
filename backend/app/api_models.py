from __future__ import annotations
from .schemas.mold_prediction import MoldPredictionRequest, MoldPredictionResponse
import json
import hmac
import hashlib
import os
import logging
from pydantic import BaseModel
from urllib.parse import urlparse
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Tuple
from datetime import datetime
import joblib
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from app.auth import require_api_user
from app.enterprise_supabase import (
    get_org_clerk_id,
    get_org_id_for_user,
    get_org_stripe_customer_id,
    get_org_subscription,
)
from app.pricing import compute_overhaul_price, expected_cost_in_window

router = APIRouter()
logger = logging.getLogger(__name__)

# --------- CONFIG ---------
import sys
from pathlib import Path


def runtime_base_dir() -> Path:
    # Prefer Electron-provided base if present
    env = os.environ.get("APP_BASE_DIR")
    if env:
        # Guard against accidentally setting a URL (e.g., https://...)
        if "://" in env:
            logger.warning("Ignoring APP_BASE_DIR that looks like a URL: %s", env)
        else:
            return Path(env)

    # PyInstaller (onedir/onefile): base = folder containing the exe
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent

    # Dev: api_models.py is backend/app/api_models.py -> backend/
    return Path(__file__).resolve().parents[1]


BASE_DIR = runtime_base_dir()

MODEL_CACHE_DIR = os.environ.get("MODEL_CACHE_DIR", "/tmp/models").strip()
R2_BUCKET = os.environ.get("R2_BUCKET", "").strip()
R2_ENDPOINT = os.environ.get("R2_ENDPOINT", "").strip()
R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
R2_REGION = os.environ.get("R2_REGION", "auto").strip() or "auto"
CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY", "").strip()
CLERK_API_BASE = os.environ.get("CLERK_API_BASE", "https://api.clerk.com/v1").strip()
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "").strip()
# TODO: remove dev bypass before production launch
DEV_BYPASS_SUBSCRIPTION = os.environ.get("DEV_BYPASS_SUBSCRIPTION", "").strip().lower() in ("1", "true", "yes")
DEV_BYPASS_EMAILS = {
    e.strip().lower()
    for e in os.environ.get("DEV_BYPASS_EMAILS", "").split(",")
    if e.strip()
}


def _r2_enabled() -> bool:
    return bool(R2_BUCKET and R2_ENDPOINT and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY)


def _require_clerk_secret() -> None:
    if not CLERK_SECRET_KEY:
        raise HTTPException(status_code=500, detail="CLERK_SECRET_KEY not configured.")


def _clerk_headers() -> Dict[str, str]:
    _require_clerk_secret()
    return {
        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
        "Content-Type": "application/json",
    }


def _require_stripe_secret() -> None:
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY not configured.")


def _is_dev_bypass_user(user: dict) -> bool:
    if not DEV_BYPASS_SUBSCRIPTION:
        return False
    email = (user.get("email") or "").strip().lower()
    if not email:
        return False
    return email in DEV_BYPASS_EMAILS


def _sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def _get_signature_key(key: str, date_stamp: str, region: str, service: str) -> bytes:
    k_date = _sign(("AWS4" + key).encode("utf-8"), date_stamp)
    k_region = _sign(k_date, region)
    k_service = _sign(k_region, service)
    return _sign(k_service, "aws4_request")


def _r2_signed_headers(method: str, canonical_uri: str, host: str, amz_date: str):
    date_stamp = amz_date[:8]
    service = "s3"
    payload_hash = "UNSIGNED-PAYLOAD"

    canonical_headers = (
        f"host:{host}\n"
        f"x-amz-content-sha256:{payload_hash}\n"
        f"x-amz-date:{amz_date}\n"
    )
    signed_headers = "host;x-amz-content-sha256;x-amz-date"
    canonical_request = "\n".join(
        [
            method,
            canonical_uri,
            "",
            canonical_headers,
            signed_headers,
            payload_hash,
        ]
    )

    algorithm = "AWS4-HMAC-SHA256"
    credential_scope = f"{date_stamp}/{R2_REGION}/{service}/aws4_request"
    string_to_sign = "\n".join(
        [
            algorithm,
            amz_date,
            credential_scope,
            hashlib.sha256(canonical_request.encode("utf-8")).hexdigest(),
        ]
    )

    signing_key = _get_signature_key(R2_SECRET_ACCESS_KEY, date_stamp, R2_REGION, service)
    signature = hmac.new(signing_key, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()

    authorization_header = (
        f"{algorithm} Credential={R2_ACCESS_KEY_ID}/{credential_scope}, "
        f"SignedHeaders={signed_headers}, Signature={signature}"
    )

    return {
        "host": host,
        "x-amz-date": amz_date,
        "x-amz-content-sha256": payload_hash,
        "Authorization": authorization_header,
    }


def _r2_download_object(key: str, dest: Path) -> None:
    if not _r2_enabled():
        return

    parsed = urlparse(R2_ENDPOINT)
    host = parsed.netloc or parsed.path
    if not host:
        raise HTTPException(status_code=500, detail="Invalid R2 endpoint.")

    base = R2_ENDPOINT.rstrip("/")
    url = f"{base}/{R2_BUCKET}/{key}"
    amz_date = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    headers = _r2_signed_headers("GET", f"/{R2_BUCKET}/{key}", host, amz_date)

    logger.info("R2 download start key=%s dest=%s", key, str(dest))

    try:
        import httpx

        with httpx.Client(timeout=30) as client:
            resp = client.get(url, headers=headers)
    except Exception:
        raise HTTPException(status_code=503, detail="Model download unavailable.")

    if resp.status_code >= 400:
        logger.warning("R2 download failed status=%s url=%s", resp.status_code, url)
        raise HTTPException(status_code=502, detail=f"Failed to download model: {key}")

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(resp.content)
    logger.info("R2 download complete key=%s bytes=%s", key, len(resp.content))


def resolve_packaged_path(rel_path: str) -> Path:
    """
    Finds a relative path in:
      1) BASE_DIR/<rel_path>
      2) BASE_DIR/_internal/<rel_path>   (PyInstaller onedir often places datas here)
    """
    p1 = (BASE_DIR / rel_path).resolve()
    if p1.exists():
        return p1
    p2 = (BASE_DIR / "_internal" / rel_path).resolve()
    if p2.exists():
        return p2

    if _r2_enabled() and MODEL_CACHE_DIR:
        cache_dir = Path(MODEL_CACHE_DIR)
        rel_key = rel_path.replace("\\", "/").lstrip("/")
        cached = (cache_dir / rel_key).resolve()
        if cached.exists():
            return cached
        logger.info("R2 cache miss rel_path=%s cached=%s", rel_path, str(cached))
        _r2_download_object(rel_key, cached)
        if cached.exists():
            return cached
    return p2


REGISTRY_PATH = resolve_packaged_path("app/model_registry.json")



# --------- Registry + Model loading ---------
@dataclass(frozen=True)
class ModelMeta:
    id: str
    name: str
    type: Literal["xgb", "ngb", "pt"]
    status: str
    artifact_path: str
    preprocessor_path: Optional[str] = None
    metrics_path: Optional[str] = None



def _read_registry() -> Tuple[str, List[ModelMeta]]:
    # hard guards (prevents hangs on weird paths)
    if not REGISTRY_PATH.exists():
        raise RuntimeError(f"Missing registry file: {REGISTRY_PATH}")
    if not REGISTRY_PATH.is_file():
        raise RuntimeError(f"Registry path is not a file: {REGISTRY_PATH}")

    txt = REGISTRY_PATH.read_text(encoding="utf-8")
    data = json.loads(txt)

    default_id = data.get("default_model_id")
    models_raw = data.get("models", [])

    models: List[ModelMeta] = [
        ModelMeta(
            id=m["id"],
            name=m.get("name", m["id"]),
            type=m["type"],
            status=m.get("status", "stable"),
            artifact_path=m["artifact_path"],
            preprocessor_path=m.get("preprocessor_path"),
            metrics_path=m.get("metrics_path"),
        )
        for m in models_raw
    ]

    if not default_id:
        raise RuntimeError("Registry must include default_model_id")

    return default_id, models


# simple in-memory cache (per process)
_MODEL_CACHE: Dict[str, Any] = {}
_PREFETCHED = False


def _prefetch_artifacts() -> None:
    global _PREFETCHED
    if _PREFETCHED or not _r2_enabled():
        return
    try:
        _, models = _read_registry()
        for m in models:
            resolve_packaged_path(m.artifact_path)
            if m.preprocessor_path:
                resolve_packaged_path(m.preprocessor_path)
            if m.metrics_path:
                resolve_packaged_path(m.metrics_path)
    except Exception:
        pass
    _PREFETCHED = True


_prefetch_artifacts()



def _get_model_meta(model_id: str) -> ModelMeta:
    default_id, models = _read_registry()
    for m in models:
        if m.id == model_id:
            return m
    raise HTTPException(status_code=404, detail=f"Unknown model_id: {model_id}. Available default: {default_id}")



def _load_model(model_id: str) -> Any:
    if model_id in _MODEL_CACHE:
        return _MODEL_CACHE[model_id]

    meta = _get_model_meta(model_id)
    artifact_abs = resolve_packaged_path(meta.artifact_path)

    if not artifact_abs.exists():
        raise HTTPException(status_code=500, detail=f"Model artifact missing on server: {artifact_abs}")

    if meta.type == "pt":
        from app.models.continuum1o import PHWeibullHybrid
        import torch

        if not meta.preprocessor_path:
            raise HTTPException(status_code=500, detail=f"Missing preprocessor_path for PT model '{meta.id}'")

        prep_path = resolve_packaged_path(meta.preprocessor_path)
        if not prep_path.exists():
            raise HTTPException(status_code=500, detail=f"Preprocessor missing on server: {prep_path}")

        state = torch.load(artifact_abs, map_location="cpu")
        model = PHWeibullHybrid(
            n_features=int(state["n_features"]),
            hidden=list(state["hidden"]),
            dropout=float(state["dropout"]),
        )
        model.load_state_dict(state["state_dict"])
        model.eval()

        prep_blob = json.loads(prep_path.read_text(encoding="utf-8"))
        tau = 1.0
        if meta.metrics_path:
            metrics_path = resolve_packaged_path(meta.metrics_path)
            if metrics_path.exists():
                metrics_blob = json.loads(metrics_path.read_text(encoding="utf-8"))
                tau = float(metrics_blob.get("eta_temperature_tau", 1.0))
        bundle = {
            "model": model,
            "prep": prep_blob["prep"],
            "scaler": prep_blob["scaler"],
            "time_scale": float(prep_blob.get("time_scale", state.get("time_scale", 100000.0))),
            "eta_temperature_tau": tau,
        }

        _MODEL_CACHE[model_id] = bundle
        return bundle

    model = joblib.load(artifact_abs)
    _MODEL_CACHE[model_id] = model
    return model


# --------- Feature building (YOU should align this with training) ---------

def _build_features(req: MoldPredictionRequest, meta: ModelMeta) -> Dict[str, Any]:
    """
    IMPORTANT: this must match the exact feature engineering used in training.
    If your training expects one-hot encoding, label encoding, etc., do it here.
    For now: return a dict you can later convert as needed.
    """
    if meta.type == "pt":
        # If raw_features provided, use them, else synthesize from req.production + req.mold_details
        f: Dict[str, Any] = dict(req.raw_features or {})

        md = req.mold_details
        pr = req.production

        # ---- Build from UI inputs if missing
        f.setdefault("cycles_since_last_major", getattr(md, "cycles_since_last_major", 0))
        f.setdefault("spi_class", getattr(md, "spi_class", "104"))
        f.setdefault("size_class", getattr(md, "size", "medium"))      # map UI size -> size_class
        f.setdefault("runner_type", getattr(md, "runner_type", "cold"))
        f.setdefault("plastic_type", getattr(md, "plastic_type", "unknown"))
        f.setdefault("cavitation", getattr(md, "cavitation", 1))
        f.setdefault("side_actions", getattr(md, "side_actions", 0))

        # ---- Operational signals (names aligned to training)
        f.setdefault("avg_cycle_time_sec", getattr(pr, "cycle_time_seconds", None))
        f.setdefault("avg_pressure_psi", getattr(pr, "avg_pressure_psi", None))
        f.setdefault("avg_temp_c", getattr(pr, "avg_temp_c", None))
        f.setdefault("utilization_ratio", getattr(pr, "utilization_ratio", 0.5))
        f.setdefault("scrap_rate_window", getattr(pr, "scrap_rate_window", 0.02))
        f.setdefault("minor_repairs_count", getattr(pr, "minor_repairs_count", 0))

        # ---- Backwards-compatible aliases if UI sent old names
        if "avg_cycle_time_seconds" in f and "avg_cycle_time_sec" not in f:
            f["avg_cycle_time_sec"] = f.pop("avg_cycle_time_seconds")

        # ---- Sanity checks
        if f.get("cycles_since_last_major") is None:
            raise HTTPException(status_code=400, detail="cycles_since_last_major is required for PT model.")
        if f.get("cavitation") is None:
            raise HTTPException(status_code=400, detail="cavitation is required for PT model.")
        if f.get("spi_class") is None:
            raise HTTPException(status_code=400, detail="spi_class is required for PT model.")
        if f.get("size_class") is None:
            raise HTTPException(status_code=400, detail="size_class is required for PT model.")
        if f.get("runner_type") is None:
            raise HTTPException(status_code=400, detail="runner_type is required for PT model.")

        return f

    cycles_per_day = (
        3600.0 * req.production.hours_per_day / req.production.cycle_time_seconds
        if req.production.cycle_time_seconds
        else 0.0
    )
    mold_age_days = (
        req.production.total_cycles / cycles_per_day if cycles_per_day > 0 else 0.0
    )
    return {
        "avg_cycle_time_seconds": req.production.cycle_time_seconds,
        "avg_hours_per_day": req.production.hours_per_day,
        "maintenance_interval_days": req.production.maintenance_interval_days,
        "minor_repairs_in_period": req.production.minor_repairs_count,
        "mold_age_days": mold_age_days,
        "complexity": req.mold_details.complexity,
        "size": req.mold_details.size,
        "plastic_type": req.mold_details.plastic_type,
        "side_actions": req.mold_details.side_actions,
        "runner_type": req.mold_details.runner_type,
    }



def _predict_days(model: Any, meta: ModelMeta, features: Dict[str, Any], req: MoldPredictionRequest) -> Tuple[float, Dict[str, float]]:
    """
    Adapt this to your real model input type.
    - Many sklearn/XGBoost pipelines accept a pandas DataFrame.
    - If you trained with a Pipeline, you can pass the dict as DataFrame with 1 row.
    """
    import pandas as pd

    if meta.type == "pt":
        from app.models.continuum1o import (
            apply_preprocessor,
            conditional_fail_prob,
            rul_quantile_conditional,
            survival_S,
        )
        import torch

        bundle = model
        df = pd.DataFrame([features])
        X = apply_preprocessor(df, bundle["prep"], bundle["scaler"]).to_numpy(dtype="float32")

        with torch.no_grad():
            eta = float(bundle["model"].forward_eta(torch.tensor(X, dtype=torch.float32)).detach().cpu().item())
            alpha = float(bundle["model"].alpha().detach().cpu().item())
            beta = float(bundle["model"].beta().detach().cpu().item())

        time_scale = float(bundle["time_scale"])
        tau = float(bundle.get("eta_temperature_tau", 1.0))
        eta_cal = float(np.clip(eta / max(tau, 1e-6), -8.0, 8.0))
        t0_cycles = float(features.get("cycles_since_last_major", 0.0))
        t0 = t0_cycles / time_scale

        fail_prob_30k = conditional_fail_prob(alpha, beta, eta_cal, t0, 30_000 / time_scale)
        fail_prob_100k = conditional_fail_prob(alpha, beta, eta_cal, t0, 100_000 / time_scale)
        rul_p50_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.5) * time_scale
        rul_p10_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.1) * time_scale
        rul_p90_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.9) * time_scale

        grid_cycles = np.linspace(t0_cycles, t0_cycles + 150_000, 60)
        grid = grid_cycles / time_scale
        surv = survival_S(grid, alpha, beta, eta_cal)
        risk_curve = [
            {"cycles": float(tc), "survival": float(s)}
            for tc, s in zip(grid_cycles, surv)
        ]

        cycles_per_day = (
            3600.0 * req.production.hours_per_day / req.production.cycle_time_seconds
            if req.production.cycle_time_seconds
            else 0.0
        )
        days = rul_p50_cycles / cycles_per_day if cycles_per_day > 0 else 0.0

        extra = {
            "fail_prob_next_30k": float(fail_prob_30k),
            "fail_prob_next_100k": float(fail_prob_100k),
            "rul_p50_cycles": float(rul_p50_cycles),
            "rul_p10_cycles": float(rul_p10_cycles),
            "rul_p90_cycles": float(rul_p90_cycles),
            "risk_curve": risk_curve,
        }
        return float(days), extra

    X = pd.DataFrame([features])

    # common sklearn-ish interface:
    if hasattr(model, "predict"):
        y = model.predict(X)
        # y might be array([value])
        return float(y[0]), {}

    raise HTTPException(status_code=500, detail=f"Loaded model '{meta.id}' has no .predict() method.")



def _validate_feature_compat(model: Any, features: Dict[str, Any], model_id: str) -> None:
    pre = getattr(model, "named_steps", {}).get("pre")
    expected = getattr(pre, "feature_names_in_", None)
    if expected is None:
        return

    expected_set = set(map(str, expected))
    provided_set = set(map(str, features.keys()))
    if expected_set != provided_set:
        missing = sorted(expected_set - provided_set)
        extra = sorted(provided_set - expected_set)
        detail = {
            "model_id": model_id,
            "missing_features": missing,
            "extra_features": extra,
        }
        raise HTTPException(status_code=400, detail=detail)



def _estimate_cost(days: float) -> float:
    # placeholder logic — keep or replace with your real cost model
    # e.g. $400 base + $120/day
    return float(400 + 120 * max(days, 0))


# --------- Routes ---------
@router.get("/api/models")
def list_models():
    default_id, models = _read_registry()
    return {
        "default_model_id": default_id,
        "models": [{"id": m.id, "name": m.name, "type": m.type, "status": m.status} for m in models],
    }


@router.get("/me/subscription")
async def me_subscription(user=Depends(require_api_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")

    # TODO: remove dev bypass before production launch
    if _is_dev_bypass_user(user):
        logger.info("Dev subscription bypass used for user_id=%s", user_id)
        return {
            "org_id": "dev-bypass",
            "active": True,
            "status": "active",
            "plan": "dev-bypass",
            "current_period_end": None,
        }

    org_id = await get_org_id_for_user(user_id)
    if not org_id:
        raise HTTPException(status_code=409, detail="Organization required.")

    sub = await get_org_subscription(org_id)
    if not sub:
        return {
            "org_id": org_id,
            "active": False,
            "status": None,
            "plan": None,
            "current_period_end": None,
        }

    status = sub.get("status")
    active = status in ("active", "trialing")
    return {
        "org_id": org_id,
        "active": active,
        "status": status,
        "plan": sub.get("plan"),
        "current_period_end": sub.get("current_period_end"),
    }


@router.post("/api/molds/predict", response_model=MoldPredictionResponse)
async def predict(req: MoldPredictionRequest, user=Depends(require_api_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")

    if not _is_dev_bypass_user(user):
        org_id = await get_org_id_for_user(user_id)
        if not org_id:
            raise HTTPException(status_code=409, detail="Organization required.")

        sub = await get_org_subscription(org_id)
        status = sub.get("status") if sub else None
        if status not in ("active", "trialing"):
            raise HTTPException(status_code=402, detail="Active subscription required.")
    else:
        logger.info("Dev subscription bypass used for user_id=%s", user_id)

    default_id, _ = _read_registry()
    model_id = (req.model_id or "").strip() or default_id

    meta = _get_model_meta(model_id)
    model = _load_model(model_id)

    feats = _build_features(req, meta)

    if meta.type != "pt":
        _validate_feature_compat(model, feats, model_id)

    days, extra = _predict_days(model, meta, feats, req)

    est_days_int = int(round(days))
    repair_date = (date.today() + timedelta(days=est_days_int))
    fail_prob_30k = float(extra.get("fail_prob_next_30k", 0.0))
    fail_prob_100k = float(extra.get("fail_prob_next_100k", 0.0))

    spi_class = str(feats.get("spi_class", getattr(req.mold_details, "spi_class", "104")))
    size_class = str(feats.get("size_class", getattr(req.mold_details, "size", "medium")))
    runner_type = str(feats.get("runner_type", getattr(req.mold_details, "runner_type", "cold")))
    cavitation = int(feats.get("cavitation", getattr(req.mold_details, "cavitation", 1)))
    side_actions = int(feats.get("side_actions", getattr(req.mold_details, "side_actions", 0)))

    overhaul_price, price_breakdown = compute_overhaul_price(
        spi_class=spi_class,
        size_class=size_class,
        runner_type=runner_type,
        cavitation=cavitation,
        side_actions=side_actions,
    )

    expected_cost_30k = float(expected_cost_in_window(fail_prob_30k, overhaul_price))
    expected_cost_100k = float(expected_cost_in_window(fail_prob_100k, overhaul_price))

    # Keep backward-compatible "estimated_repair_cost_usd"
    cost = float(overhaul_price)

    return MoldPredictionResponse(
        model_id=model_id,
        mold_id=req.mold_id,
        prediction_generated_at=datetime.utcnow(),

        estimated_time_to_repair_days=est_days_int,
        estimated_time_to_repair_months=days / 30.0,
        estimated_time_to_repair_years=days / 365.0,

        estimated_repair_date=repair_date,

        # old field (now overhaul estimate)
        estimated_repair_cost_usd=cost,

        # new fields
        overhaul_price_estimate_usd=float(overhaul_price),
        expected_cost_next_30k_usd=float(expected_cost_30k),
        expected_cost_next_100k_usd=float(expected_cost_100k),
        price_breakdown=price_breakdown,

        **extra,
    )


class OrgInvitePayload(BaseModel):
    email: str


def _pick_email(data: dict) -> str:
    return (
        data.get("email_address")
        or data.get("email")
        or data.get("primary_email_address")
        or ""
    )


def _member_summary(member: dict) -> Dict[str, Any]:
    public = member.get("public_user_data") or {}
    return {
        "user_id": public.get("user_id") or member.get("user_id"),
        "email": _pick_email(public),
        "first_name": public.get("first_name") or "",
        "last_name": public.get("last_name") or "",
        "role": member.get("role"),
        "created_at": member.get("created_at"),
    }


def _invite_summary(invite: dict) -> Dict[str, Any]:
    return {
        "id": invite.get("id"),
        "email": _pick_email(invite),
        "role": invite.get("role"),
        "status": invite.get("status"),
        "created_at": invite.get("created_at"),
    }


async def _clerk_get(path: str, params: Optional[dict] = None) -> dict:
    import httpx

    url = f"{CLERK_API_BASE.rstrip('/')}{path}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers=_clerk_headers(), params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Clerk API unavailable.")
    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Clerk API error.")
    return resp.json()


async def _clerk_post(path: str, payload: dict) -> dict:
    import httpx

    url = f"{CLERK_API_BASE.rstrip('/')}{path}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, headers=_clerk_headers(), json=payload)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Clerk API unavailable.")
    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Clerk API error.")
    return resp.json()


async def _fetch_org_members(org_id: str) -> list[dict]:
    data = await _clerk_get(f"/organizations/{org_id}/memberships", params={"limit": 200})
    raw = data.get("data") or []
    return [_member_summary(m) for m in raw]


async def _fetch_org_invites(org_id: str) -> list[dict]:
    data = await _clerk_get(
        f"/organizations/{org_id}/invitations",
        params={"limit": 200, "status": "pending"},
    )
    raw = data.get("data") or []
    return [_invite_summary(i) for i in raw]


def _find_member_role(members: list[dict], user_id: str) -> Optional[str]:
    for m in members:
        if m.get("user_id") == user_id:
            return m.get("role")
    return None


@router.get("/api/org/overview")
async def org_overview(user=Depends(require_api_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")
    org_id = user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=409, detail="Organization required.")

    clerk_org_id = await get_org_clerk_id(org_id)
    if not clerk_org_id:
        raise HTTPException(status_code=404, detail="Clerk organization not linked.")

    org = await _clerk_get(f"/organizations/{clerk_org_id}")
    members = await _fetch_org_members(clerk_org_id)
    invites = await _fetch_org_invites(clerk_org_id)
    role = _find_member_role(members, user_id) or "org:member"

    return {
        "organization": {
            "id": org.get("id"),
            "name": org.get("name"),
            "slug": org.get("slug"),
            "image_url": org.get("image_url"),
            "created_at": org.get("created_at"),
        },
        "role": role,
        "members": members,
        "invitations": invites,
    }


@router.post("/api/org/invitations")
async def org_invite(payload: OrgInvitePayload, user=Depends(require_api_user)):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")
    org_id = user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=409, detail="Organization required.")

    clerk_org_id = await get_org_clerk_id(org_id)
    if not clerk_org_id:
        raise HTTPException(status_code=404, detail="Clerk organization not linked.")

    members = await _fetch_org_members(clerk_org_id)
    role = _find_member_role(members, user_id)
    if role != "org:admin":
        raise HTTPException(status_code=403, detail="Admin role required.")

    email = (payload.email or "").strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email.")

    invite = await _clerk_post(
        f"/organizations/{clerk_org_id}/invitations",
        {"email_address": email, "role": "org:member"},
    )
    return _invite_summary(invite)


@router.post("/api/billing/portal")
async def billing_portal(user=Depends(require_api_user)):
    _require_stripe_secret()
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")
    org_id = user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=409, detail="Organization required.")

    stripe_customer_id = await get_org_stripe_customer_id(org_id)
    if not stripe_customer_id:
        raise HTTPException(
            status_code=404,
            detail="No billing profile found for this organization.",
        )

    try:
        import stripe
    except Exception:
        raise HTTPException(status_code=500, detail="Stripe SDK not installed.")

    stripe.api_key = STRIPE_SECRET_KEY
    session = stripe.billing_portal.Session.create(
        customer=stripe_customer_id,
        return_url="https://predilyticsinc.com/billing-portal",
    )
    return {"url": session.url}
