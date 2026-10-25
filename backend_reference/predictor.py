"""Framework-independent inference logic (used by app.py and testable alone)."""
import json
from pathlib import Path

import joblib
import pandas as pd

from train_model import add_features

BASE = Path(__file__).parent
DEPARTMENTS = [
    "Emergency & Trauma", "General Medicine", "Cardiology", "Orthopedics",
    "Pediatrics", "Dermatology", "ENT", "Radiology",
]

_model = None
_metrics = None


def load():
    global _model, _metrics
    if _model is None:
        _model = joblib.load(BASE / "model.joblib")
        _metrics = json.loads((BASE / "metrics.json").read_text())
    return _model, _metrics


def severity(minutes: float) -> str:
    if minutes < 20:
        return "short"
    if minutes <= 45:
        return "moderate"
    return "extended"


def predict(department: str, arrival_hour: int, patients_ahead: int, staff_available: int) -> dict:
    model, metrics = load()
    row = pd.DataFrame([{
        "department": department,
        "arrival_hour": arrival_hour,
        "patients_ahead": patients_ahead,
        "staff_available": staff_available,
    }])
    minutes = max(0.0, float(model.predict(add_features(row))[0]))
    best = next(m for m in metrics["models"] if m["model"] == metrics["best_model"])
    rmse = best["rmse"]
    return {
        "predicted_wait_minutes": round(minutes, 1),
        "predicted_wait_hours": round(minutes / 60, 2),
        "confidence_interval": {
            "lower": round(max(0.0, minutes - rmse), 1),
            "upper": round(minutes + rmse, 1),
            "margin": rmse,
        },
        "severity": severity(minutes),
        "model": metrics["best_model"],
        "inputs": {
            "department": department,
            "arrival_hour": arrival_hour,
            "patients_ahead": patients_ahead,
            "staff_available": staff_available,
        },
        "disclaimer": "Academic prototype trained on synthetic data. Not for clinical use.",
    }
