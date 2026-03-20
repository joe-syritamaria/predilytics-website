import os
import random
import time
from datetime import datetime, timezone

import requests


API_BASE = os.environ.get("SIM_MONITOR_BASE_URL", "http://localhost:8000").rstrip("/")
MACHINE_ID = os.environ.get("SIM_MONITOR_MACHINE_ID", "SIM-MACHINE-01")


def emit_event(event_type: str, cycle_count: int, shock_score: float | None = None) -> None:
    payload = {
        "machine_id": MACHINE_ID,
        "event_type": event_type,
        "cycle_count": cycle_count,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if shock_score is not None:
        payload["shock_score"] = shock_score

    requests.post(f"{API_BASE}/sim-monitor/events", json=payload, timeout=5)


def run() -> None:
    cycle = 0
    while True:
        cycle += 1
        emit_event("cycle_complete", cycle)
        if random.random() < 0.08:
            emit_event("shock_event", cycle, shock_score=random.uniform(0.2, 1.0))
        time.sleep(0.5)


if __name__ == "__main__":
    run()
