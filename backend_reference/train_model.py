"""
Train and compare four regression models for QueueCare AI.

Reads hospital_queue_data.csv (see generate_dataset.py), evaluates
Linear Regression, Decision Tree, Random Forest and Gradient Boosting on a
held-out 20% test split, then saves:

    model.joblib       - best pipeline (by RMSE) ready for inference
    metrics.json       - per-model MAE / RMSE / R2 (+ 5-fold CV RMSE)
    analytics.json     - aggregates used by the dashboard charts
"""
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.tree import DecisionTreeRegressor

SEED = 42
CATEGORICAL = ["department"]
NUMERIC = ["arrival_hour", "patients_ahead", "staff_available"]
FEATURES = CATEGORICAL + NUMERIC
TARGET = "waiting_time_min"


def add_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineered features shared by training and inference."""
    out = df.copy()
    out["load_per_staff"] = out["patients_ahead"] / out["staff_available"]
    out["is_peak"] = out["arrival_hour"].isin([9, 10, 11, 16, 17, 18]).astype(int)
    return out


ENGINEERED = ["load_per_staff", "is_peak"]
ALL_NUMERIC = NUMERIC + ENGINEERED


def build_pipeline(model) -> Pipeline:
    pre = ColumnTransformer([
        ("dept", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("num", "passthrough", ALL_NUMERIC),
    ])
    return Pipeline([("pre", pre), ("model", model)])


def main():
    df = pd.read_csv("hospital_queue_data.csv")
    X = add_features(df[FEATURES])
    y = df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )

    candidates = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=6, min_samples_leaf=10, random_state=SEED),
        "Random Forest": RandomForestRegressor(
            n_estimators=300, max_depth=8, min_samples_leaf=5, random_state=SEED, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=250, learning_rate=0.05, max_depth=3,
            subsample=0.8, random_state=SEED
        ),
    }

    results, fitted = [], {}
    for name, model in candidates.items():
        pipe = build_pipeline(model).fit(X_train, y_train)
        pred = pipe.predict(X_test)
        rmse = float(np.sqrt(mean_squared_error(y_test, pred)))
        cv_rmse = float(-cross_val_score(
            build_pipeline(model), X, y, cv=5,
            scoring="neg_root_mean_squared_error"
        ).mean())
        results.append({
            "model": name,
            "mae": round(float(mean_absolute_error(y_test, pred)), 3),
            "rmse": round(rmse, 3),
            "r2": round(float(r2_score(y_test, pred)), 3),
            "cv_rmse": round(cv_rmse, 3),
        })
        fitted[name] = pipe
        print(f"{name:20s} MAE={results[-1]['mae']:.3f} RMSE={rmse:.3f} "
              f"R2={results[-1]['r2']:.3f} CV-RMSE={cv_rmse:.3f}")

    best = min(results, key=lambda r: r["rmse"])
    print(f"\nBest model by test RMSE: {best['model']}")

    joblib.dump(fitted[best["model"]], "model.joblib")
    with open("metrics.json", "w") as f:
        json.dump({"best_model": best["model"], "n_records": len(df),
                   "n_train": len(X_train), "n_test": len(X_test),
                   "models": results}, f, indent=2)

    # Dashboard aggregates
    analytics = {
        "by_hour": (df.groupby("arrival_hour")[TARGET].mean().round(1)
                      .reset_index().rename(columns={TARGET: "avg_wait"}).to_dict("records")),
        "by_department": (df.groupby("department")
                            .agg(avg_wait=(TARGET, "mean"), avg_staff=("staff_available", "mean"),
                                 visits=(TARGET, "size"))
                            .round(1).reset_index().to_dict("records")),
        "queue_vs_wait": (df.groupby("patients_ahead")[TARGET].mean().round(1)
                            .reset_index().rename(columns={TARGET: "avg_wait"}).to_dict("records")),
    }
    with open("analytics.json", "w") as f:
        json.dump(analytics, f, indent=2)

    # Feature importance of the winning model (if available)
    model = fitted[best["model"]].named_steps["model"]
    if hasattr(model, "feature_importances_"):
        names = list(fitted[best["model"]].named_steps["pre"].get_feature_names_out())
        imp = sorted(zip(names, model.feature_importances_), key=lambda t: -t[1])[:6]
        print("\nTop features:")
        for n, v in imp:
            print(f"  {n:35s} {v:.3f}")


if __name__ == "__main__":
    main()
