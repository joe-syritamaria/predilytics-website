from fastapi import APIRouter, HTTPException, Query

from app.schemas.sim_monitor import (
    BindRequest,
    CycleEvent,
    HeartbeatRequest,
    SessionResponse,
    ToolStateResponse,
    UnbindRequest,
)
from app.services.sim_monitor_service import (
    bind_machine,
    get_active_session,
    get_latest_session,
    get_tool_state,
    handle_cycle_event,
    refresh_active_session,
    unbind_machine,
)

router = APIRouter(prefix="/sim-monitor", tags=["sim-monitor"])


@router.post("/events", response_model=ToolStateResponse)
def ingest_event(event: CycleEvent):
    session = get_active_session(event.machine_id)
    if not session:
        raise HTTPException(status_code=400, detail="No active mold binding for machine")

    handle_cycle_event(event, session["tool_id"])
    refresh_active_session(event.machine_id)
    return get_tool_state(session["tool_id"])


@router.post("/bind", response_model=SessionResponse)
def bind_session(payload: BindRequest, replace: bool = Query(False)):
    try:
        session = bind_machine(
            payload.machine_id,
            payload.tool_id,
            payload.bound_by,
            replace=replace,
        )
        return session
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@router.post("/unbind", response_model=SessionResponse)
def unbind_session(payload: UnbindRequest):
    try:
        return unbind_machine(payload.machine_id, payload.ended_by)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/session/{machine_id}", response_model=SessionResponse)
def fetch_session(machine_id: str):
    session = get_latest_session(machine_id)
    if not session:
        raise HTTPException(status_code=404, detail="No session found for machine")
    return session


@router.post("/heartbeat", response_model=SessionResponse)
def heartbeat(payload: HeartbeatRequest):
    session = get_active_session(payload.machine_id)
    if not session:
        raise HTTPException(status_code=400, detail="No active mold binding for machine")
    refresh_active_session(payload.machine_id)
    return session


@router.get("/tools/{tool_id}", response_model=ToolStateResponse)
def fetch_tool_state(tool_id: str):
    return get_tool_state(tool_id)
