from app.services.rolling_window import RollingWindow
from app.services.feature_engine import build_feature_snapshot
from app.services.shock_detector import detect_shock_event
from app.services.rul_engine import compute_prediction


def run_simulation(
    cycles,
    prediction_interval=100,
    event_threshold=0.6,
    short_window_size=20,
    long_window_size=100,
):
    short_window = RollingWindow(short_window_size)
    long_window = RollingWindow(long_window_size)

    results = []
    recent_abnormal_windows = 0

    for cycle in cycles:
        short_window.add(cycle)
        long_window.add(cycle)

        features = build_feature_snapshot(cycle, short_window, long_window)
        shock = detect_shock_event(cycle, features)

        if shock["shock_event_probability"] > 0.5:
            recent_abnormal_windows += 1

        periodic_trigger = cycle.cycle_number % prediction_interval == 0
        event_trigger = shock["shock_event_probability"] >= event_threshold

        prediction = None
        if periodic_trigger or event_trigger:
            prediction = compute_prediction(
                total_cycles=cycle.cycle_number,
                wear_score=features["wear_score"],
                shock_event_probability=shock["shock_event_probability"],
                shock_event_severity=shock["shock_event_severity"],
                recent_abnormal_windows=recent_abnormal_windows,
            )

        results.append({
            "cycle_number": cycle.cycle_number,
            "timestamp": cycle.timestamp,
            "wear_score": features["wear_score"],
            "anomaly_score": shock["anomaly_score"],
            "shock_event_probability": shock["shock_event_probability"],
            "shock_event_type": shock["shock_event_type"],
            "baseline_rul_cycles": prediction["baseline_rul_cycles"] if prediction else None,
            "adjusted_rul_cycles": prediction["adjusted_rul_cycles"] if prediction else None,
            "failure_risk_score": prediction["failure_risk_score"] if prediction else None,
            "prediction_triggered": bool(prediction),
        })

    return results
    