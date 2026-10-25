"""
Synthetic hospital queue dataset generator for QueueCare AI.

Produces 1,200 hypothetical outpatient visit records. Waiting time is built
from a transparent, domain-motivated process:

    wait = base_service_time(dept) * patients_ahead / effective_staff
           + arrival_hour_surge(hour)
           + dept_overhead(dept)
           + noise

so the relationships (more patients -> longer wait, more staff -> shorter wait,
morning/evening surges -> longer wait) are real, learnable patterns.

All data is synthetic. It must NOT be used for clinical decisions.
"""
import numpy as np
import pandas as pd

SEED = 42
N_RECORDS = 1200

# Average consultation minutes per patient and fixed overhead (registration,
# triage, vitals) per department.
DEPARTMENTS = {
    "Emergency & Trauma": {"service": 9.0,  "overhead": 4.0, "weight": 0.18, "staff_mu": 6},
    "General Medicine":   {"service": 7.5,  "overhead": 3.0, "weight": 0.20, "staff_mu": 5},
    "Cardiology":         {"service": 11.0, "overhead": 5.0, "weight": 0.11, "staff_mu": 3},
    "Orthopedics":        {"service": 9.5,  "overhead": 4.0, "weight": 0.12, "staff_mu": 3},
    "Pediatrics":         {"service": 8.0,  "overhead": 3.5, "weight": 0.13, "staff_mu": 4},
    "Dermatology":        {"service": 6.0,  "overhead": 2.0, "weight": 0.09, "staff_mu": 2},
    "ENT":                {"service": 6.5,  "overhead": 2.5, "weight": 0.08, "staff_mu": 2},
    "Radiology":          {"service": 10.0, "overhead": 6.0, "weight": 0.09, "staff_mu": 3},
}

# Relative arrival probability by hour (peaks 09-11 and 16-18).
HOUR_WEIGHTS = np.array([
    0.4, 0.3, 0.3, 0.3, 0.4, 0.6, 1.0, 2.0,   # 00-07
    4.0, 7.0, 8.0, 6.5, 4.5, 4.0, 4.5, 5.0,   # 08-15
    7.0, 7.5, 6.0, 3.5, 2.5, 1.5, 0.9, 0.6,   # 16-23
])
HOUR_WEIGHTS = HOUR_WEIGHTS / HOUR_WEIGHTS.sum()


def surge_minutes(hour: int) -> float:
    """Extra delay from congestion at peak hours (minutes)."""
    morning = 4.5 * np.exp(-((hour - 10) ** 2) / (2 * 1.3 ** 2))
    evening = 4.0 * np.exp(-((hour - 17) ** 2) / (2 * 1.3 ** 2))
    return morning + evening


def generate(n: int = N_RECORDS, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    names = list(DEPARTMENTS)
    weights = np.array([DEPARTMENTS[d]["weight"] for d in names])
    weights = weights / weights.sum()

    depts = rng.choice(names, size=n, p=weights)
    hours = rng.choice(24, size=n, p=HOUR_WEIGHTS)

    rows = []
    for d, h in zip(depts, hours):
        cfg = DEPARTMENTS[d]
        peak = surge_minutes(h)

        # Queue length grows at peak hours and in busy departments.
        lam = 2.5 + 0.9 * peak + 0.25 * cfg["service"]
        patients_ahead = int(min(rng.poisson(lam), 30))

        # Staff on duty: department baseline, fewer at night.
        night = h < 7 or h >= 21
        mu = max(1.0, cfg["staff_mu"] - (1.5 if night else 0.0))
        staff = int(np.clip(rng.poisson(mu), 1, 12))

        # Staff give diminishing returns (coordination overhead).
        effective_staff = staff ** 0.85

        base = cfg["service"] * patients_ahead / effective_staff
        wait = base + peak + cfg["overhead"]
        wait += rng.normal(0, 4.8)                       # irregular delays
        wait *= rng.lognormal(0, 0.09)                   # multiplicative variability
        wait = max(1.0, wait)

        rows.append({
            "department": d,
            "arrival_hour": int(h),
            "patients_ahead": patients_ahead,
            "staff_available": staff,
            "waiting_time_min": round(float(wait), 1),
        })

    df = pd.DataFrame(rows)
    df.insert(0, "visit_id", [f"V{str(i + 1).zfill(4)}" for i in range(len(df))])
    return df


if __name__ == "__main__":
    df = generate()
    df.to_csv("hospital_queue_data.csv", index=False)
    print(f"Saved {len(df)} records to hospital_queue_data.csv")
    print(df.describe(include="all").T[["count", "mean", "min", "max"]])
