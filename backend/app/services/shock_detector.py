def detect_shock_event(cycle, features):
    score = 0.0
    shock_type = None

    if (cycle.pack_pressure_bar or 0) > 1000:
        score += 0.30
    if (cycle.hold_time_s or 0) > 5:
        score += 0.20
    if cycle.reject_flag:
        score += 0.10
    if cycle.ejector_anomaly_flag:
        score += 0.20
    if cycle.operator_intervention_flag:
        score += 0.15
    if cycle.alarm_code == "PART_STUCK":
        score += 0.35
        shock_type = "stuck_part_overpack"
    elif cycle.ejector_anomaly_flag:
        shock_type = "ejector_abnormality"

    score += min(0.20, features["pressure_instability_index"])
    score = min(1.0, score)

    if score > 0.7:
        severity = 0.8
    elif score > 0.4:
        severity = 0.5
    else:
        severity = 0.2

    return {
        "anomaly_score": score,
        "shock_event_probability": score,
        "shock_event_type": shock_type,
        "shock_event_severity": severity,
    }
    