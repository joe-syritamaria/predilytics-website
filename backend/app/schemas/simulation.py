from pydantic import BaseModel
from typing import Optional


class CycleRecord(BaseModel):
    cycle_number: int
    timestamp: str
    tool_id: str
    machine_id: str

    cycle_time_s: Optional[float] = None
    pack_pressure_bar: Optional[float] = None
    hold_time_s: Optional[float] = None
    mold_temp_c: Optional[float] = None

    reject_flag: bool = False
    alarm_code: Optional[str] = None
    ejector_anomaly_flag: bool = False
    operator_intervention_flag: bool = False
    event_label: Optional[str] = None

class SimulationStepResult(BaseModel):
    cycle_number: int
    timestamp: str
    wear_score: float
    anomaly_score: float
    shock_event_probability: float
    shock_event_type: Optional[str] = None
    baseline_rul_cycles: Optional[int] = None
    adjusted_rul_cycles: Optional[int] = None
    failure_risk_score: Optional[float] = None
    prediction_triggered: bool