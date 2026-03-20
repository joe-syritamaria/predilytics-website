import os
from pathlib import Path

from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


SENTRY_DSN = os.environ.get("SENTRY_DSN", "").strip()
if SENTRY_DSN:
    try:
        import importlib

        sentry_sdk = importlib.import_module("sentry_sdk")

        sentry_sdk.init(
            dsn=SENTRY_DSN,
            traces_sample_rate=0.0,
            send_default_pii=False,
        )
    except Exception:
        # Sentry is optional; never fail app startup
        pass

def _load_env_file(path: Path, override: bool = False) -> None:
    if path.exists():
        load_dotenv(path, override=override)


def _apply_prod_keys(path: Path) -> None:
    if not path.exists():
        return
    values = dotenv_values(path)
    if not values:
        return

    allowed = {
        "CLERK_ISSUER",
        "CLERK_JWKS_URL",
        "CLERK_AUDIENCE",
        "CLERK_SECRET_KEY",
        "CLERK_API_BASE",
        "CLERK_FRONTEND_API_URL",
        "CLERK_OAUTH_CLIENT_ID",
        "CLERK_OAUTH_CLIENT_SECRET",
        "APP_JWT_SECRET",
        "APP_JWT_ISSUER",
        "APP_JWT_AUDIENCE",
        "AUTH_JWT_TTL_SECONDS",
    }
    for key in allowed:
        val = values.get(key)
        if val is not None:
            os.environ[key] = val


# Load backend/.env before importing modules that read os.environ at import time.
_env_dir = Path(__file__).resolve().parent.parent
_load_env_file(_env_dir / ".env")
_load_env_file(_env_dir / ".env.local", override=True)

app_env = os.environ.get("APP_ENV", "").strip()
if app_env:
    _load_env_file(_env_dir / f".env.{app_env}", override=True)

use_prod_keys = os.environ.get("USE_PROD_KEYS", "").strip().lower()
if use_prod_keys in {"1", "true", "yes"}:
    prod_keys_file = os.environ.get("PROD_KEYS_ENV_FILE", "").strip()
    prod_keys_path = Path(prod_keys_file) if prod_keys_file else (_env_dir / ".env.prodkeys.local")
    _apply_prod_keys(prod_keys_path)

from app.api_models import router as api_router
from app.native_oauth import router as native_oauth_router
from app.clerk_webhooks import router as clerk_webhooks_router
from app.simulation import router as simulation_router
from app.sim_monitor import router as sim_monitor_router


app = FastAPI()

cors_raw = os.environ.get("CORS_ALLOW_ORIGINS", "").strip()
if cors_raw:
    cors_origins = [o.strip() for o in cors_raw.split(",") if o.strip()]
else:
    cors_origins = ["*"]

# Electron file:// and opaque origins show up as "null"
if cors_origins != ["*"]:
    if "null" not in cors_origins:
        cors_origins.append("null")
    if "file://" not in cors_origins:
        cors_origins.append("file://")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False if cors_origins == ["*"] else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)
app.include_router(native_oauth_router)
app.include_router(clerk_webhooks_router)
app.include_router(simulation_router)
app.include_router(sim_monitor_router)

@app.get("/health")
def health():
    return {"ok": True}


@app.get("/healthz")
def healthz():
    return {"ok": True}
