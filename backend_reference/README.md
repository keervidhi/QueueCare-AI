# QueueCare AI — Backend ML API Reference

This directory contains the Python FastAPI companion server implementation matching the QueueCare AI frontend contract.

## API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check and backend model status |
| `/api/predict` | `POST` | Generates waiting-time prediction from inputs |
| `/api/analytics/hourly` | `GET` | 24-hour waiting time distribution |
| `/api/analytics/departments` | `GET` | Specialty department waiting times & staffing |
| `/api/analytics/models` | `GET` | Reported model evaluation benchmarks |

## Request Body for `/api/predict`

```json
{
  "department": "Emergency",
  "arrival_hour": 10,
  "queue_length": 5,
  "staff_availability": 4
}
```

## Response Schema for `/api/predict`

```json
{
  "predicted_wait_time": 28.5,
  "predicted_wait_minutes": 28.5,
  "confidence_range": {
    "lower": 23.3,
    "upper": 33.7
  },
  "service_rate_minutes": 6.0,
  "peak_hour_factor": "High Traffic Peak",
  "model_used": "Gradient Boosting Regressor",
  "department": "Emergency"
}
```

## Running the Reference Backend

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Launch the server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

4. The server runs at `http://localhost:8000`. The frontend communicates with it via the `VITE_API_BASE_URL` defined in `.env`.
