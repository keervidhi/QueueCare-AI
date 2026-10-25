# QueueCare AI — Backend Reference

Synthetic dataset, ML training pipeline and FastAPI server for the QueueCare AI frontend.

> Academic prototype. Data is synthetic; predictions are not for clinical use.

## Setup

```bash
cd backend_reference
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

python generate_dataset.py    # -> hospital_queue_data.csv (1,200 records)
python train_model.py         # -> model.joblib, metrics.json, analytics.json
uvicorn app:app --reload --port 8000
```

Then set the frontend to Live mode (`VITE_API_BASE_URL=http://localhost:8000/api`).

## Dataset

| Column | Description |
|---|---|
| visit_id | Record id |
| department | One of 8 departments |
| arrival_hour | 0-23 |
| patients_ahead | Queue length at arrival |
| staff_available | Clinical staff on duty |
| waiting_time_min | Target (minutes) |

Waiting time = (service time x patients ahead / staff^0.85) + peak-hour surge
+ department overhead + noise. Peaks at 09-11 and 16-18.

## Models compared

Linear Regression, Decision Tree, Random Forest, Gradient Boosting (80/20 split,
plus 5-fold CV). Engineered features: `load_per_staff`, `is_peak`.

## API

- `GET  /api/health`
- `POST /api/predict` body: `{department, arrival_hour, patients_ahead, staff_available}`
- `GET  /api/metrics`
- `GET  /api/analytics`
