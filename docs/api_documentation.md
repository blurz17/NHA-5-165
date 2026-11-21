# FastAPI Backend API Documentation

## Overview
The backend is a high-performance RESTful API constructed with FastAPI, bundled for deployment on **Heroku**, and configured with CORS for integration with the **Vercel** frontend.

- **Base URL (Local):** `http://localhost:8000`
- **Swagger Documentation:** `/docs`
- **ReDoc:** `/redoc`

---

## Endpoints

### 1. Health Check
`GET /api/health`

Returns service health, version, model bundle status, and supported algorithms.

**Response:**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "models_loaded": true,
  "algorithms_available": [
    "Linear Regression",
    "Decision Tree",
    "Random Forest",
    "Gradient Boosting",
    "XGBoost"
  ]
}
```

---

### 2. Predict Thermal Loads
`POST /api/predict`

Calculates heating, cooling, and total thermal load for a building design.

**Request Body:**
```json
{
  "features": {
    "Relative_Compactness": 0.98,
    "Surface_Area": 514.5,
    "Wall_Area": 294.0,
    "Roof_Area": 110.25,
    "Overall_Height": 7.0,
    "Orientation": 2,
    "Glazing_Area": 0.10,
    "Glazing_Area_Distribution": 1
  },
  "algorithm": "Random Forest"
}
```

**Response Body:**
```json
{
  "success": true,
  "prediction": {
    "heating_load_kwh": 15.55,
    "cooling_load_kwh": 21.33,
    "total_load_kwh": 36.88,
    "algorithm_used": "Random Forest"
  },
  "input_received": { ... },
  "engineered_features": {
    "Wall_Surface_Ratio": 0.5714,
    "Glazing_x_Height": 0.7000
  }
}
```

---

### 3. Passive Design Optimizer
`POST /api/optimize`

Evaluates a parameter sweep over a chosen feature to find the design with minimal energy demand.

**Request Body:**
```json
{
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
```

**Response Body:**
```json
{
  "parameter_optimized": "Glazing_Area",
  "optimal_value": 0.0,
  "lowest_total_load": 48.24,
  "evaluations": [
    { "param_value": 0.0, "heating_load": 21.20, "cooling_load": 27.04, "total_load": 48.24 },
    { "param_value": 0.1, "heating_load": 22.80, "cooling_load": 28.90, "total_load": 51.70 },
    { "param_value": 0.25, "heating_load": 24.90, "cooling_load": 31.40, "total_load": 56.30 },
    { "param_value": 0.4, "heating_load": 26.80, "cooling_load": 33.70, "total_load": 60.50 }
  ]
}
```

---

### 4. Model Registry & Benchmarks
`GET /api/models`

Returns performance metrics for all 10 trained models.
