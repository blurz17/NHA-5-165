"""Tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Building Energy Efficiency" in data["app"]


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert len(data["algorithms_available"]) == 5


def test_models_endpoint():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert data["total_models"] == 10
    assert len(data["benchmarks"]) == 10


def test_predict_endpoint_valid():
    payload = {
        "features": {
            "Relative_Compactness": 0.98,
            "Surface_Area": 514.5,
            "Wall_Area": 294.0,
            "Roof_Area": 110.25,
            "Overall_Height": 7.0,
            "Orientation": 2,
            "Glazing_Area": 0.0,
            "Glazing_Area_Distribution": 0
        },
        "algorithm": "Random Forest"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "prediction" in data
    assert data["prediction"]["heating_load_kwh"] > 0
    assert data["prediction"]["cooling_load_kwh"] > 0
    assert data["prediction"]["total_load_kwh"] > 0


def test_predict_endpoint_invalid_bounds():
    payload = {
        "features": {
            "Relative_Compactness": 2.5,  # Out of range (max 1.0)
            "Surface_Area": 514.5,
            "Wall_Area": 294.0,
            "Roof_Area": 110.25,
            "Overall_Height": 7.0,
            "Orientation": 2,
            "Glazing_Area": 0.0,
            "Glazing_Area_Distribution": 0
        }
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_optimize_endpoint():
    payload = {
        "base_features": {
            "Relative_Compactness": 0.82,
            "Surface_Area": 612.5,
            "Wall_Area": 318.5,
            "Roof_Area": 147.0,
            "Overall_Height": 7.0,
            "Orientation": 2,
            "Glazing_Area": 0.25,
            "Glazing_Area_Distribution": 2
        },
        "optimize_param": "Glazing_Area"
    }
    response = client.post("/api/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["parameter_optimized"] == "Glazing_Area"
    assert len(data["evaluations"]) > 0
    assert data["lowest_total_load"] > 0
