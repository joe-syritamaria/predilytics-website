def compute_prediction(total_cycles, wear_score, shock_event_probability, shock_event_severity, recent_abnormal_windows):
    design_life_cycles = 50000

    wear_consumed = total_cycles / design_life_cycles
    health_penalty = 0.5 * wear_score + 0.5 * wear_consumed

    baseline_remaining_fraction = max(0.0, 1.0 - health_penalty)
    baseline_rul_cycles = round(design_life_cycles * baseline_remaining_fraction)

    damage_increment = shock_event_probability * shock_event_severity * (0.05 + wear_score * 0.2)

    adjusted_rul_cycles = max(
        0,
        round(baseline_rul_cycles * (1.0 - damage_increment))
    )

    post_event_persistence_score = min(1.0, recent_abnormal_windows / 5.0)

    failure_risk_score = min(
        1.0,
        0.5 * wear_score +
        0.3 * shock_event_probability +
        0.2 * post_event_persistence_score
    )

    return {
        "baseline_rul_cycles": baseline_rul_cycles,
        "damage_increment": damage_increment,
        "adjusted_rul_cycles": adjusted_rul_cycles,
        "post_event_persistence_score": post_event_persistence_score,
        "failure_risk_score": failure_risk_score,
    }