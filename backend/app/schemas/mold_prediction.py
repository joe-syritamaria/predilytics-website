from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

MoldComplexity = Literal["simple", "medium", "complex", "very_complex"]
MoldSize = Literal["small", "medium", "large"]
SideActions = Literal["none", "simple", "complex", "very_complex"]
RunnerType = Literal["hot_runner", "cold_runner"]


class ProductionInput(BaseModel):
    cycle_time_seconds: float = Field(..., gt=0)
    hours_per_day: float = Field(..., ge=0, le=24)
    maintenance_interval_days: int = Field(..., ge=0)
    minor_repairs_count: int = Field(0, ge=0)
    avg_pressure_psi: Optional[float] = Field(None, ge=0)
    avg_temp_c: Optional[float] = Field(None)
    utilization_ratio: Optional[float] = Field(None, ge=0, le=1)
    scrap_rate_window: Optional[float] = Field(None, ge=0, le=1)

class MoldDetailsInput(BaseModel):
    complexity: int = Field(..., ge=1, le=5)
    size: Literal["small", "medium", "large"]
    plastic_type: str = "unknown"
    side_actions: int = Field(0, ge=0)
    runner_type: Literal["hot", "cold"]

    # Strongly recommended for survival model + pricing
    spi_class: Literal["101", "102", "103", "104", "105"] = "104"
    cavitation: int = Field(1, ge=1)

    # Required to anchor PH curves at “now”
    cycles_since_last_major: int = Field(0, ge=0)

class RawFeaturesPT(BaseModel):
    cycles_since_last_major: int = Field(..., ge=0)

    spi_class: Literal["101", "102", "103", "104", "105"]
    size_class: Literal["small", "medium", "large"]
    runner_type: Literal["hot", "cold"]
    plastic_type: str = "unknown"

    cavitation: int = Field(..., ge=1)
    side_actions: int = Field(0, ge=0)

    # recommended operational signals
    avg_pressure_psi: Optional[float] = Field(None, ge=0)
    avg_cycle_time_sec: Optional[float] = Field(None, gt=0)
    utilization_ratio: Optional[float] = Field(None, ge=0, le=1)
    scrap_rate_window: Optional[float] = Field(None, ge=0, le=1)
    minor_repairs_count: Optional[int] = Field(0, ge=0)

class MoldPredictionRequest(BaseModel):
    model_id: Optional[str] = None
    mold_id: str

    production: ProductionInput
    mold_details: MoldDetailsInput

    # If present AND the selected model is PT, backend should use this directly
    raw_features: Optional[Dict[str, Any]] = None

class PricingBreakdown(BaseModel):
    base_price: float
    f_size: float
    f_runner: float
    f_cavitation: float
    f_side_actions: float
    multiplier_total: float
    price_usd: float


class RiskCurvePoint(BaseModel):
    cycles: float
    survival: float


class MoldPredictionResponse(BaseModel):
    model_id: str
    mold_id: str
    prediction_generated_at: datetime

    estimated_time_to_repair_days: int
    estimated_time_to_repair_months: float
    estimated_time_to_repair_years: float

    estimated_repair_date: date

    # Keep existing field for backward compatibility:
    # now it should represent your deterministic overhaul estimate.
    estimated_repair_cost_usd: float

    # Always return these (cost engine)
    overhaul_price_estimate_usd: float
    expected_cost_next_30k_usd: float
    expected_cost_next_100k_usd: float
    price_breakdown: Optional[PricingBreakdown] = None

    # Always return risk window + RUL when PT model is used
    fail_prob_next_30k: Optional[float] = None
    fail_prob_next_100k: Optional[float] = None
    rul_p50_cycles: Optional[float] = None
    rul_p10_cycles: Optional[float] = None
    rul_p90_cycles: Optional[float] = None
    risk_curve: Optional[List[RiskCurvePoint]] = None
