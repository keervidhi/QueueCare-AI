"""
QueueCare AI reference backend (FastAPI).

Run:  uvicorn app:app --reload --port 8000
Base URL expected by the frontend: http://localhost:8000/api
"""
"""import json

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import predictor

app = FastAPI(title="QueueCare AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
api = APIRouter(prefix="/api")


class PredictRequest(BaseModel):
    department: str
    arrival_hour: int = Field(ge=0, le=23)
    patients_ahead: int = Field(ge=0, le=200)
    staff_available: int = Field(ge=1, le=50)


@api.get("/health")
def health():
    try:
        _, metrics = predictor.load()
        return {"status": "ok", "model": metrics["best_model"]}
    except FileNotFoundError:
        raise HTTPException(503, "Model not trained yet. Run generate_dataset.py then train_model.py.")


@api.post("/predict")
def predict(req: PredictRequest):
    if req.department not in predictor.DEPARTMENTS:
        raise HTTPException(422, f"Unknown department. Choose from: {predictor.DEPARTMENTS}")
    try:
        return predictor.predict(**req.model_dump())
    except FileNotFoundError:
        raise HTTPException(503, "Model not trained yet. Run generate_dataset.py then train_model.py.")


@api.get("/metrics")
def metrics():
    _, m = predictor.load()
    return m


@api.get("/analytics")
def analytics():
    with open(predictor.BASE / "analytics.json") as f:
        return json.load(f)


app.include_router(api)
"""


import json

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import predictor


# Create FastAPI application
app = FastAPI(
    title="QueueCare AI API",
    version="1.0.0"
)


# Allow React + Vite frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# All backend endpoints begin with /api
api = APIRouter(prefix="/api")


# Patient input structure
class PredictRequest(BaseModel):
    department: str
    arrival_hour: int = Field(ge=0, le=23)
    patients_ahead: int = Field(ge=0, le=200)
    staff_available: int = Field(ge=1, le=50)


# Check backend and trained model
@api.get("/health")
def health():
    try:
        _, metrics = predictor.load()

        return {
            "status": "ok",
            "model": metrics["best_model"]
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model not trained yet. Run generate_dataset.py and train_model.py."
        )


# Predict waiting time using trained ML model
@api.post("/predict")
def predict(req: PredictRequest):

    if req.department not in predictor.DEPARTMENTS:
        raise HTTPException(
            status_code=422,
            detail=f"Unknown department. Choose from: {predictor.DEPARTMENTS}"
        )

    try:
        result = predictor.predict(
            department=req.department,
            arrival_hour=req.arrival_hour,
            patients_ahead=req.patients_ahead,
            staff_available=req.staff_available
        )

        return result

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Trained model not found. Run train_model.py."
        )


# Get actual trained model performance
@api.get("/metrics")
def metrics():
    try:
        _, model_metrics = predictor.load()
        return model_metrics

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model metrics not available. Train the model first."
        )


# Get analytics data
@api.get("/analytics")
def analytics():
    analytics_path = predictor.BASE / "analytics.json"

    try:
        with open(analytics_path, "r", encoding="utf-8") as file:
            return json.load(file)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Analytics data not found. Run train_model.py."
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Analytics JSON file is invalid."
        )


# Register API routes
app.include_router(api)
