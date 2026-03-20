from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class CycleEvent(BaseModel):
    machine_id: str
    event_type: Literal["cycle_complete", "shock_event"]
    cycle_count: int
    timestamp: datetime
    shock_score: Optional[float] = None


class BindRequest(BaseModel):
    machine_id: str
    tool_id: str
    bound_by: str


class UnbindRequest(BaseModel):
    machine_id: str
    ended_by: Optional[str] = None


class HeartbeatRequest(BaseModel):
    machine_id: str


class SessionResponse(BaseModel):
    machine_id: str
    tool_id: str
    bound_by: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    is_active: bool


class ToolStateResponse(BaseModel):
    tool_id: str
    cycle_count: int
    baseline_rul: int
    adjusted_rul: int
    shock_probability: float
    status: Literal["NORMAL", "WATCH", "CRITICAL"]
    recommended_action: str
    last_event_type: Optional[str] = None
    last_event_cycle: Optional[int] = None
    rul_series: list
    shock_series: list
    event_log: list
