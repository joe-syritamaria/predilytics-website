def build_feature_snapshot(current_cycle, short_window, long_window):
    short_avg_ct = short_window.avg("cycle_time_s")
    long_avg_ct = long_window.avg("cycle_time_s")
    pressure_std = short_window.std("pack_pressure_bar") or 0.0
    reject_rate = short_window.rate_true("reject_flag")
    intervention_rate = max(
        short_window.rate_true("operator_intervention_flag"),
        short_window.rate_true("ejector_anomaly_flag")
    )

    if short_avg_ct is not None and long_avg_ct not in (None, 0):
        cycle_time_drift_index = max(0.0, (short_avg_ct - long_avg_ct) / long_avg_ct)
    else:
        cycle_time_drift_index = 0.0

    pressure_instability_index = min(1.0, pressure_std / 100.0)
    scrap_signal_index = min(1.0, reject_rate)
    intervention_signal_index = min(1.0, intervention_rate)

    cumulative_stress_index = min(
        1.0,
        0.4 * cycle_time_drift_index +
        0.3 * pressure_instability_index +
        0.2 * scrap_signal_index +
        0.1 * intervention_signal_index
    )

    wear_score = cumulative_stress_index

    return {
        "cycle_time_drift_index": cycle_time_drift_index,
        "pressure_instability_index": pressure_instability_index,
        "scrap_signal_index": scrap_signal_index,
        "intervention_signal_index": intervention_signal_index,
        "cumulative_stress_index": cumulative_stress_index,
        "wear_score": wear_score,
    }
    