import csv
from io import StringIO
from typing import List
from app.schemas.simulation import CycleRecord


def parse_bool(value):
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "yes"}


def parse_float(value):
    if value in (None, "", "null"):
        return None
    return float(value)


def parse_csv_text(csv_text: str) -> List[CycleRecord]:
    reader = csv.DictReader(StringIO(csv_text))
    records = []

    for row in reader:
        record = CycleRecord(
            cycle_number=int(row["cycle_number"]),
            timestamp=row["timestamp"],
            tool_id=row["tool_id"],
            machine_id=row["machine_id"],
            cycle_time_s=parse_float(row.get("cycle_time_s")),
            pack_pressure_bar=parse_float(row.get("pack_pressure_bar")),
            hold_time_s=parse_float(row.get("hold_time_s")),
            mold_temp_c=parse_float(row.get("mold_temp_c")),
            reject_flag=parse_bool(row.get("reject_flag")),
            alarm_code=row.get("alarm_code") or None,
            ejector_anomaly_flag=parse_bool(row.get("ejector_anomaly_flag")),
            operator_intervention_flag=parse_bool(row.get("operator_intervention_flag")),
            event_label=row.get("event_label") or None,
        )
        records.append(record)

    records.sort(key=lambda x: x.cycle_number)
    return records