from __future__ import annotations

from typing import Dict, List

import numpy as np
import pandas as pd
import torch
import torch.nn as nn


TARGET_TIME_COL = "time_to_event_cycles"
EVENT_COL = "event_major_repair"


def ensure_transforms(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    if "cav_log2" not in out.columns:
        if "cavitation" not in out.columns:
            raise ValueError("Missing cav_log2 and cavitation; need one.")
        out["cavitation"] = out["cavitation"].clip(lower=1)
        out["cav_log2"] = np.log2(out["cavitation"]).round(4)
    return out


def apply_preprocessor(df: pd.DataFrame, prep: Dict, scaler: Dict) -> pd.DataFrame:
    work = df.copy()
    work = ensure_transforms(work)

    for col in [TARGET_TIME_COL, EVENT_COL]:
        if col in work.columns:
            work = work.drop(columns=[col])

    drop_cols = prep["drop_cols"]
    work = work.drop(columns=[c for c in drop_cols if c in work.columns], errors="ignore")

    cat_cols = prep["categorical_cols"]
    for c in cat_cols:
        if c in work.columns:
            work[c] = work[c].astype(str)
        else:
            work[c] = "missing"

    X = pd.get_dummies(work, columns=cat_cols, drop_first=False)

    for col in prep["feature_columns"]:
        if col not in X.columns:
            X[col] = 0.0
    X = X[prep["feature_columns"]]

    mu = np.array(scaler["mean"], dtype=np.float32)
    sd = np.array(scaler["std"], dtype=np.float32)
    sd = np.where(sd < 1e-8, 1.0, sd)

    Xn = (X.to_numpy(dtype=np.float32) - mu) / sd
    return pd.DataFrame(Xn, columns=prep["feature_columns"])


class PHWeibullHybrid(nn.Module):
    def __init__(self, n_features: int, hidden: List[int], dropout: float):
        super().__init__()

        layers: List[nn.Module] = []
        in_dim = n_features
        for h in hidden:
            layers += [
                nn.Linear(in_dim, h),
                nn.ReLU(),
                nn.Dropout(dropout),
            ]
            in_dim = h
        layers += [nn.Linear(in_dim, 1)]
        self.net = nn.Sequential(*layers)

        self._alpha_raw = nn.Parameter(torch.tensor(0.0))
        self._beta_raw = nn.Parameter(torch.tensor(0.0))

    def forward_eta(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x).squeeze(-1)

    def alpha(self) -> torch.Tensor:
        return torch.nn.functional.softplus(self._alpha_raw) + 1e-8

    def beta(self) -> torch.Tensor:
        return 1.01 + torch.nn.functional.softplus(self._beta_raw)


def log_survival_S(t: np.ndarray, alpha: float, beta: float, eta: float) -> np.ndarray:
    t = np.asarray(t, dtype=np.float64)
    t = np.clip(t, 1e-12, None)
    eta = np.asarray(eta, dtype=np.float64)
    eta = np.clip(eta, -8.0, 8.0)
    H = (alpha / beta) * np.power(t, beta) * np.exp(eta)
    return -H


def survival_S(t: np.ndarray, alpha: float, beta: float, eta: float) -> np.ndarray:
    return np.exp(log_survival_S(t, alpha, beta, eta))


def conditional_fail_prob(alpha: float, beta: float, eta, t0, delta) -> float:
    eta = np.asarray(eta, dtype=np.float64)
    t0 = np.asarray(t0, dtype=np.float64)
    delta = float(delta)

    logS0 = float(log_survival_S(np.array([t0]), alpha, beta, eta)[0])
    logS1 = float(log_survival_S(np.array([t0 + delta]), alpha, beta, eta)[0])

    ratio = float(np.exp(logS1 - logS0))
    return float(1.0 - ratio)


def rul_quantile_conditional(alpha: float, beta: float, eta: float, t0: float, q_fail: float) -> float:
    q_fail = float(np.clip(q_fail, 1e-12, 1 - 1e-12))
    p = 1.0 - q_fail

    logS0 = float(log_survival_S(np.array([t0]), alpha, beta, eta)[0])
    logS_target = logS0 + np.log(p)

    eta = float(np.clip(eta, -8.0, 8.0))
    val = (-logS_target) * (beta / alpha) * np.exp(-eta)
    t_star = float(np.power(max(val, 0.0), 1.0 / beta))
    return max(0.0, t_star - float(t0))
