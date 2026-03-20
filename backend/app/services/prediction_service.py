from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
import json
import os
from pathlib import Path
import sys
from typing import Any, Dict, List, Literal, Tuple, Optional

import joblib
import numpy as np

from app.schemas.mold_prediction import MoldPredictionRequest, MoldPredictionResponse


def _runtime_base_dir() -> Path:
    env = os.environ.get("APP_BASE_DIR")
    if env:
        return Path(env)
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parents[2]


BASE_DIR = _runtime_base_dir()


def _resolve_packaged_path(rel_path: str) -> Path:
    p1 = (BASE_DIR / rel_path).resolve()
    if p1.exists():
        return p1
    return (BASE_DIR / "_internal" / rel_path).resolve()


REGISTRY_PATH = _resolve_packaged_path("app/model_registry.json")


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
    if not REGISTRY_PATH.exists():
        raise RuntimeError(f"Missing registry file: {REGISTRY_PATH}")
    if not REGISTRY_PATH.is_file():
        raise RuntimeError(f"Registry path is not a file: {REGISTRY_PATH}")

    data = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
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


_MODEL_CACHE: Dict[str, Any] = {}


def _get_model_meta(model_id: str) -> ModelMeta:
    default_id, models = _read_registry()
    for m in models:
        if m.id == model_id:
            return m
    raise ValueError(f"Unknown model_id: {model_id}. Available default: {default_id}")


def _load_model(model_id: str) -> Any:
    if model_id in _MODEL_CACHE:
        return _MODEL_CACHE[model_id]

    meta = _get_model_meta(model_id)
    artifact_abs = _resolve_packaged_path(meta.artifact_path)
    if not artifact_abs.exists():
        raise RuntimeError(f"Model artifact missing on server: {artifact_abs}")

    if meta.type == "pt":
        from app.models.continuum1o import PHWeibullHybrid
        import torch

        if not meta.preprocessor_path:
            raise RuntimeError(f"Missing preprocessor_path for PT model '{meta.id}'")

        prep_path = _resolve_packaged_path(meta.preprocessor_path)
        if not prep_path.exists():
            raise RuntimeError(f"Preprocessor missing on server: {prep_path}")

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
            metrics_path = _resolve_packaged_path(meta.metrics_path)
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


def _build_features(req: MoldPredictionRequest, meta: ModelMeta) -> Dict[str, Any]:
    cycles_per_day = (
        3600.0 * req.production.hours_per_day / req.production.cycle_time_seconds
        if req.production.cycle_time_seconds
        else 0.0
    )
    mold_age_days = (
        req.production.total_cycles / cycles_per_day if cycles_per_day > 0 else 0.0
    )
    if meta.type == "pt":
        if not req.raw_features:
            raise ValueError("PT model requires raw_features payload.")
        return req.raw_features

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
    import pandas as pd

    if meta.type == "pt":
        from app.models.continuum1o import apply_preprocessor, conditional_fail_prob, rul_quantile_conditional
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
        rul_p50_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.5) * time_scale
        rul_p10_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.1) * time_scale
        rul_p90_cycles = rul_quantile_conditional(alpha, beta, eta_cal, t0, 0.9) * time_scale

        cycles_per_day = (
            3600.0 * req.production.hours_per_day / req.production.cycle_time_seconds
            if req.production.cycle_time_seconds
            else 0.0
        )
        days = rul_p50_cycles / cycles_per_day if cycles_per_day > 0 else 0.0

        extra = {
            "fail_prob_next_30k": float(fail_prob_30k),
            "rul_p50_cycles": float(rul_p50_cycles),
            "rul_p10_cycles": float(rul_p10_cycles),
            "rul_p90_cycles": float(rul_p90_cycles),
        }
        return float(days), extra

    X = pd.DataFrame([features])
    if hasattr(model, "predict"):
        y = model.predict(X)
        return float(y[0]), {}
    raise RuntimeError("Loaded model has no .predict() method.")


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
        raise ValueError(
            f"Model '{model_id}' feature mismatch. Missing: {missing}. Extra: {extra}."
        )


def _estimate_cost(payload: MoldPredictionRequest) -> float:
    base_cost = 1000.0
    cost = base_cost
    if payload.mold_details.size=="small":
        cost *= 0.8
    if payload.mold_details.size == "medium":
        cost *= 1.3
    elif payload.mold_details.size == "large":
        cost *= 1.6

    if payload.mold_details.complexity == "complex":
        cost *= 1.4
    if payload.mold_details.complexity == "very_complex":
        cost *= 1.8
    
    if payload.mold_details.side_actions == "simple":
        cost *= 0.9
    if payload.mold_details.side_actions == "complex":
        cost *= 1.3
    if payload.mold_details.side_actions == "very_complex":
        cost *= 1.8
    
    if payload.mold_details.runner_type == "hot_runner":
        cost *= 1.5
    if payload.mold_details.runner_type == "cold_runner":
        cost *= 0.5
    return cost


def predict_for_mold(payload: MoldPredictionRequest) -> MoldPredictionResponse:
    now = datetime.utcnow()

    default_id, _ = _read_registry()
    model_id = (payload.model_id or "").strip() or default_id
    model = _load_model(model_id)

    meta = _get_model_meta(model_id)
    feats = _build_features(payload, meta)
    _validate_feature_compat(model, feats, model_id)
    days, extra = _predict_days(model, meta, feats, payload)
    days = max(0.0, days)

    estimated_days = int(round(days))
    estimated_months = days / 30.0
    estimated_years = days / 365.0

    repair_date = (now + timedelta(days=estimated_days)).date()
    cost = _estimate_cost(payload)

    return MoldPredictionResponse(
        mold_id=payload.mold_id,
        prediction_generated_at=now,
        estimated_time_to_repair_days=estimated_days,
        estimated_time_to_repair_months=estimated_months,
        estimated_time_to_repair_years=estimated_years,
        estimated_repair_date=repair_date,
        estimated_repair_cost_usd=round(cost, 2),
        model_id=model_id,
        **extra,
    )
