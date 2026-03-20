# pricing.py
from __future__ import annotations

from dataclasses import dataclass
from math import log2
from typing import Dict, Optional, Tuple


@dataclass(frozen=True)
class PricingConfig:
    # Baseline overhaul price by SPI class
    base_price_by_spi: Dict[str, float]

    # Multipliers
    size_factor: Dict[str, float]
    runner_factor: Dict[str, float]

    # Cavitation model: factor = 1 + cav_k * log2(cavitation)
    cav_k: float

    # Side actions model: factor = 1 + side_k * side_actions, then clipped
    side_k: float
    side_cap: float  # max factor from side-actions

    # Overall cap to prevent extreme outputs
    total_cap: float


def default_pricing_config() -> PricingConfig:
    return PricingConfig(
        base_price_by_spi={
            "101": 6000.0,
            "102": 4500.0,
            "103": 3500.0,
            "104": 2500.0,
            "105": 1500.0,
        },
        size_factor={
            "small": 1.00,
            "medium": 1.25,
            "large": 1.60,
        },
        runner_factor={
            "cold": 1.00,
            "hot": 1.35,
        },
        cav_k=0.15,
        side_k=0.10,
        side_cap=1.80,   # cap side-action multiplier
        total_cap=4.00,  # cap final multiplier relative to base
    )


def _safe_norm_str(x: Optional[str]) -> str:
    return (x or "").strip().lower()


def cavitation_factor(cavitation: int, cav_k: float) -> float:
    cav = max(int(cavitation), 1)
    return 1.0 + float(cav_k) * log2(cav)


def side_actions_factor(side_actions: int, side_k: float, side_cap: float) -> float:
    sa = max(int(side_actions), 0)
    f = 1.0 + float(side_k) * sa
    return min(f, float(side_cap))


def compute_overhaul_price(
    spi_class: str,
    size_class: str,
    runner_type: str,
    cavitation: int,
    side_actions: int = 0,
    cfg: Optional[PricingConfig] = None,
) -> Tuple[float, Dict[str, float]]:
    """
    Returns:
      price_usd, breakdown_factors

    price = base(spi) * f_size * f_runner * f_cav * f_side
    """
    cfg = cfg or default_pricing_config()

    spi = _safe_norm_str(spi_class)
    size = _safe_norm_str(size_class)
    runner = _safe_norm_str(runner_type)

    base = cfg.base_price_by_spi.get(spi)
    if base is None:
        # fallback: treat unknown as class 104
        base = cfg.base_price_by_spi["104"]

    f_size = cfg.size_factor.get(size, 1.00)
    f_runner = cfg.runner_factor.get(runner, 1.00)
    f_cav = cavitation_factor(cavitation, cfg.cav_k)
    f_side = side_actions_factor(side_actions, cfg.side_k, cfg.side_cap)

    mult = f_size * f_runner * f_cav * f_side
    mult = min(mult, cfg.total_cap)

    price = float(base) * float(mult)

    breakdown = {
        "base_price": float(base),
        "f_size": float(f_size),
        "f_runner": float(f_runner),
        "f_cavitation": float(f_cav),
        "f_side_actions": float(f_side),
        "multiplier_total": float(mult),
        "price_usd": float(price),
    }
    return price, breakdown


def expected_cost_in_window(
    fail_prob_in_window: float,
    overhaul_price_usd: float,
) -> float:
    p = float(max(min(fail_prob_in_window, 1.0), 0.0))
    return p * float(overhaul_price_usd)
