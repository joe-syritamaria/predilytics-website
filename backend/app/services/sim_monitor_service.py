from collections import defaultdict
from datetime import datetime
from typing import Optional
import json
import os

try:
    import redis
except Exception:  # pragma: no cover - optional dependency
    redis = None

# in-memory state for MVP only
TOOL_STATES = defaultdict(lambda: {
    "cycle_count": 0,
    "baseline_rul": 100000,
    "adjusted_rul": 100000,
    "shock_probability": 0.0,
    "status": "NORMAL",
    "recommended_action": "Continue normal operation",
    "last_event_type": None,
    "last_event_cycle": None,
    "rul_series": [],
    "shock_series": [],
    "event_log": [],
    "recent_shocks": 0,
})

SESSION_HISTORY = defaultdict(list)
ACTIVE_SESSIONS = {}

ACTIVE_TTL_SECONDS = int(os.environ.get("SIM_MONITOR_ACTIVE_TTL_SECONDS", "120"))
TOOL_STATE_TTL_SECONDS = int(os.environ.get("SIM_MONITOR_TOOL_STATE_TTL_SECONDS", "14400"))


def _redis_client():
    url = os.environ.get("REDIS_URL", "").strip()
    if not url or redis is None:
        return None
    return redis.Redis.from_url(url, decode_responses=True)


def _active_key(machine_id: str) -> str:
    return f"sim_monitor:active:{machine_id}"


def _tool_state_key(tool_id: str) -> str:
    return f"sim_monitor:tool_state:{tool_id}"


def _serialize_session(session: dict) -> dict:
    payload = dict(session)
    started_at = payload.get("started_at")
    ended_at = payload.get("ended_at")
    if isinstance(started_at, datetime):
        payload["started_at"] = started_at.isoformat()
    if isinstance(ended_at, datetime):
        payload["ended_at"] = ended_at.isoformat()
    return payload


def _redis_set_json(key: str, payload: dict, ttl_seconds: Optional[int] = None) -> None:
    client = _redis_client()
    if not client:
        return
    data = json.dumps(payload)
    if ttl_seconds:
        client.setex(key, ttl_seconds, data)
    else:
        client.set(key, data)


def _redis_get_json(key: str) -> Optional[dict]:
    client = _redis_client()
    if not client:
        return None
    data = client.get(key)
    if not data:
        return None
    try:
        return json.loads(data)
    except Exception:
        return None


def _redis_delete(key: str) -> None:
    client = _redis_client()
    if not client:
        return
    client.delete(key)
def _status_and_action(adjusted_rul: int, baseline_rul: int, shock_prob: float):
    drop_pct = 0 if baseline_rul == 0 else (baseline_rul - adjusted_rul) / baseline_rul

    if adjusted_rul <= 0 or shock_prob >= 0.9 or drop_pct >= 0.5:
        return "CRITICAL", "Pause at next safe stop and notify maintenance immediately"
    if shock_prob >= 0.4 or drop_pct >= 0.1:
        return "WATCH", "Continue with caution and inspect setup at next safe pause"
    return "NORMAL", "Continue normal operation"

def handle_cycle_event(event, tool_id: str):
    state = TOOL_STATES[tool_id]

    if event.event_type == "cycle_complete":
        state["cycle_count"] = event.cycle_count

        # baseline wear-down: 1 cycle consumes 1 unit of baseline life
        state["baseline_rul"] = max(0, 100000 - event.cycle_count)

        # if no shock, adjusted trends slowly toward baseline
        if state["adjusted_rul"] > state["baseline_rul"]:
            state["adjusted_rul"] = state["baseline_rul"]
        else:
            # keep adjusted at or below baseline
            state["adjusted_rul"] = max(0, min(state["adjusted_rul"], state["baseline_rul"]))

        state["shock_probability"] = max(0.0, state["shock_probability"] * 0.92)

    elif event.event_type == "shock_event":
        severity = max(0.0, min(1.0, event.shock_score or 0.0))
        state["cycle_count"] = event.cycle_count

        # shock probability shown in UI
        state["shock_probability"] = severity

        if severity >= 0.95:
            state["adjusted_rul"] = 0
        else:
            # nonlinear penalty: bigger shocks hurt more
            penalty_fraction = 0.45 * (severity ** 2)
            state["adjusted_rul"] = max(
                0,
                int(state["adjusted_rul"] * (1 - penalty_fraction))
            )

        state["recent_shocks"] += 1

    state["last_event_type"] = event.event_type
    state["last_event_cycle"] = event.cycle_count

    status, action = _status_and_action(
        state["adjusted_rul"],
        state["baseline_rul"],
        state["shock_probability"]
    )
    state["status"] = status
    state["recommended_action"] = action

    # time series for charts
    state["rul_series"].append({
        "cycle": event.cycle_count,
        "baseline_rul": state["baseline_rul"],
        "adjusted_rul": state["adjusted_rul"],
    })
    state["shock_series"].append({
        "cycle": event.cycle_count,
        "shock_probability": state["shock_probability"],
    })

    # keep last 200 points
    state["rul_series"] = state["rul_series"][-200:]
    state["shock_series"] = state["shock_series"][-200:]

    state["event_log"].append({
        "timestamp": event.timestamp.isoformat(),
        "cycle": event.cycle_count,
        "event_type": event.event_type,
        "shock_score": event.shock_score,
        "status": state["status"],
        "adjusted_rul": state["adjusted_rul"],
        "recommended_action": state["recommended_action"],
    })
    state["event_log"] = state["event_log"][-50:]

    _redis_set_json(_tool_state_key(tool_id), _build_tool_state_payload(tool_id, state), TOOL_STATE_TTL_SECONDS)
    return state


def get_active_session(machine_id: str) -> Optional[dict]:
    cached = _redis_get_json(_active_key(machine_id))
    if cached:
        return cached
    return ACTIVE_SESSIONS.get(machine_id)


def get_latest_session(machine_id: str) -> Optional[dict]:
    cached = _redis_get_json(_active_key(machine_id))
    if cached:
        return cached
    if machine_id in ACTIVE_SESSIONS:
        return ACTIVE_SESSIONS[machine_id]
    history = SESSION_HISTORY.get(machine_id, [])
    return history[-1] if history else None


def bind_machine(machine_id: str, tool_id: str, bound_by: str, replace: bool = False) -> dict:
    existing = ACTIVE_SESSIONS.get(machine_id)
    cached = _redis_get_json(_active_key(machine_id))
    if cached:
        existing = cached
    if existing and not replace:
        raise ValueError("Machine already has an active binding")

    if existing and replace:
        existing["ended_at"] = datetime.utcnow().isoformat()
        existing["is_active"] = False
        SESSION_HISTORY[machine_id].append(existing)

    session = {
        "machine_id": machine_id,
        "tool_id": tool_id,
        "bound_by": bound_by,
        "started_at": datetime.utcnow(),
        "ended_at": None,
        "is_active": True,
    }
    ACTIVE_SESSIONS[machine_id] = session
    _redis_set_json(_active_key(machine_id), _serialize_session(session), ACTIVE_TTL_SECONDS)
    return session


def unbind_machine(machine_id: str, ended_by: Optional[str] = None) -> dict:
    existing = ACTIVE_SESSIONS.get(machine_id)
    cached = _redis_get_json(_active_key(machine_id))
    if cached:
        existing = cached
    if not existing:
        raise KeyError("No active binding for machine")

    existing["ended_at"] = datetime.utcnow().isoformat()
    existing["is_active"] = False
    if ended_by:
        existing["ended_by"] = ended_by
    SESSION_HISTORY[machine_id].append(existing)
    ACTIVE_SESSIONS.pop(machine_id, None)
    _redis_delete(_active_key(machine_id))
    return existing


def refresh_active_session(machine_id: str) -> None:
    session = get_active_session(machine_id)
    if not session:
        return
    _redis_set_json(_active_key(machine_id), _serialize_session(session), ACTIVE_TTL_SECONDS)


def _build_tool_state_payload(tool_id: str, state: dict) -> dict:
    return {
        "tool_id": tool_id,
        "cycle_count": state["cycle_count"],
        "baseline_rul": state["baseline_rul"],
        "adjusted_rul": state["adjusted_rul"],
        "shock_probability": state["shock_probability"],
        "status": state["status"],
        "recommended_action": state["recommended_action"],
        "last_event_type": state["last_event_type"],
        "last_event_cycle": state["last_event_cycle"],
        "rul_series": state["rul_series"],
        "shock_series": state["shock_series"],
        "event_log": state["event_log"],
    }


def get_tool_state(tool_id: str):
    cached = _redis_get_json(_tool_state_key(tool_id))
    if cached:
        return cached
    state = TOOL_STATES[tool_id]
    payload = _build_tool_state_payload(tool_id, state)
    _redis_set_json(_tool_state_key(tool_id), payload, TOOL_STATE_TTL_SECONDS)
    return payload
