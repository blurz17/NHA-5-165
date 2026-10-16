# Stage 4: API Specification & Testing Plan
**ML Diploma Graduation Project | System Analysis & Design**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. REST API Architecture & Conventions

The **CloudXAi** backend exposes a modern, asynchronous RESTful API implemented in **FastAPI** with **Pydantic v2** schema validation.

### Global API Standards:
* **Base URL:** `http://localhost:8000/api/v1` (Local) or `https://api.cloudxai.org/api/v1` (Cloud)
* **Data Format:** JSON (`application/json`) with UTF-8 character encoding.
* **Standard Status Codes:**
  * `200 OK`: Request succeeded.
  * `400 Bad Request`: Invalid request structure.
  * `422 Unprocessable Entity`: Input parameters out of physical boundary ranges.
  * `500 Internal Server Error`: Unexpected backend or model exception.
* **CORS Policy:** Permissive for local dashboard integration (`*` on local port 8501).

---

## 2. API Endpoint Specifications

### 2.1 Thermal Load Prediction Endpoint
* **Endpoint:** `POST /api/v1/predict/thermal-load`
* **Description:** Evaluates building geometric and envelope parameters to predict annual Heating Load and Cooling Load ($\text{kWh/m}^2$).
* **Request Schema:**
```json
{
  "relative_compactness": 0.76,
  "surface_area_m2": 661.5,
  "wall_area_m2": 318.5,
  "roof_area_m2": 147.0,
  "overall_height_m": 7.0,
  "orientation_azimuth_deg": 180.0,
  "glazing_ratio_wwr": 0.25,
  "glazing_distribution": "South_Biased"
}
```
* **Response Schema (`200 OK`):**
```json
{
  "status": "success",
  "prediction": {
    "heating_load_kwh_m2": 21.42,
    "heating_load_confidence_interval": [20.15, 22.69],
    "cooling_load_kwh_m2": 34.85,
    "cooling_load_confidence_interval": [33.20, 36.50],
    "total_thermal_demand_kwh_m2": 56.27
  },
  "benchmark_comparison": {
    "baseline_heating_delta_pct": -14.2,
    "baseline_cooling_delta_pct": +2.1,
    "energy_star_rating": "Tier_A"
  },
  "inference_latency_ms": 18.4
}
```

---

### 2.2 Operational Weather-Aware Energy Forecasting Endpoint
* **Endpoint:** `POST /api/v1/predict/energy-forecast`
* **Description:** Generates multi-horizon operational building electricity consumption forecasts given an hourly meteorological forecast.
* **Request Schema:**
```json
{
  "building_id": "BLD_0142",
  "forecast_horizon_hours": 168,
  "weather_forecast": [
    {
      "timestamp_utc": "2026-10-17T00:00:00Z",
      "air_temperature_celsius": 14.2,
      "relative_humidity_pct": 65.0,
      "wind_speed_mps": 3.8,
      "solar_radiation_wm2": 0.0
    }
  ]
}
```
* **Response Schema (`200 OK`):**
```json
{
  "status": "success",
  "building_id": "BLD_0142",
  "hourly_forecast": [
    {
      "timestamp_utc": "2026-10-17T00:00:00Z",
      "forecast_kwh": 342.5,
      "lower_bound_kwh": 315.0,
      "upper_bound_kwh": 370.0,
      "is_peak_hour": false
    }
  ],
  "aggregate_metrics": {
    "total_period_energy_kwh": 58420.0,
    "peak_demand_kwh": 892.4,
    "peak_timestamp": "2026-10-19T14:00:00Z"
  },
  "execution_time_ms": 142.1
}
```

---

### 2.3 Multi-Objective Pareto Optimization Endpoint
* **Endpoint:** `POST /api/v1/optimize/pareto`
* **Description:** Triggers the NSGA-II evolutionary algorithm to generate non-dominated trade-off designs.
* **Request Schema:**
```json
{
  "population_size": 100,
  "generations": 50,
  "objectives": ["heating_load", "cooling_load", "envelope_cost"],
  "parameter_bounds": {
    "compactness_min": 0.65,
    "compactness_max": 0.95,
    "glazing_ratio_min": 0.15,
    "glazing_ratio_max": 0.45
  },
  "constraints": {
    "max_envelope_cost_usd_m2": 150.0,
    "min_daylight_ratio": 0.20
  }
}
```
* **Response Schema (`200 OK`):**
```json
{
  "status": "success",
  "run_id": "OPT_20261016_001",
  "pareto_frontier_count": 50,
  "hypervolume_indicator": 0.884,
  "convergence_generations": 42,
  "candidates": [
    {
      "candidate_id": "C_014",
      "pareto_rank": 1,
      "parameters": {
        "compactness": 0.82,
        "orientation_deg": 180.0,
        "glazing_ratio": 0.28,
        "wall_u_value": 0.24
      },
      "performance": {
        "heating_load_kwh_m2": 18.2,
        "cooling_load_kwh_m2": 32.1,
        "envelope_cost_usd_m2": 118.50
      }
    }
  ],
  "runtime_seconds": 2.45
}
```

---

### 2.4 Explainable AI (SHAP Attribution) Endpoint
* **Endpoint:** `POST /api/v1/explain/shap`
* **Description:** Computes exact local Shapley feature attributions for a given design configuration.
* **Request Schema:**
```json
{
  "target": "cooling_load",
  "features": {
    "relative_compactness": 0.76,
    "surface_area_m2": 661.5,
    "wall_area_m2": 318.5,
    "roof_area_m2": 147.0,
    "overall_height_m": 7.0,
    "orientation_azimuth_deg": 180.0,
    "glazing_ratio_wwr": 0.35
  }
}
```
* **Response Schema (`200 OK`):**
```json
{
  "status": "success",
  "base_value": 28.50,
  "final_prediction": 35.10,
  "feature_attributions": [
    {
      "feature_name": "glazing_ratio_wwr",
      "feature_value": 0.35,
      "shap_value": +4.20,
      "direction": "increases_load"
    },
    {
      "feature_name": "relative_compactness",
      "feature_value": 0.76,
      "shap_value": -2.80,
      "direction": "decreases_load"
    }
  ],
  "ai_narrative": "Predicted cooling load is primarily driven by high south glazing (+4.20 kWh/m²). Increasing shading will yield immediate thermal savings."
}
```

---

### 2.5 System Health & Execution Mode Endpoint
* **Endpoint:** `GET /api/v1/health`
* **Description:** Returns service status, loaded model versions, and active execution mode.
* **Response Schema (`200 OK`):**
```json
{
  "status": "healthy",
  "service": "CloudXAi-Core-API",
  "version": "1.0.0",
  "execution_mode": "local",
  "lakehouse_connected": true,
  "models_loaded": {
    "thermal_surrogate": "LightGBM_v1.2",
    "energy_forecaster": "XGBoost_ASHRAE_v2.0"
  },
  "timestamp_utc": "2026-10-16T22:45:00Z"
}
```

---

## 3. Comprehensive Testing & Quality Assurance Plan

The testing strategy guarantees code reliability, mathematical correctness, and operational performance across four testing tiers:

```
┌────────────────────────────────────────────────────────┐
│                   TESTING PYRAMID                      │
├────────────────────────────────────────────────────────┤
│           [Tier 4: System & UAT Tests]                 │
│      End-to-End User Journey, Docker Health            │
├────────────────────────────────────────────────────────┤
│         [Tier 3: Model & Physics Benchmarks]           │
│     ASHRAE 14 CV(RMSE) <= 15%, DOE Reference Check     │
├────────────────────────────────────────────────────────┤
│       [Tier 2: Integration & API Contract Tests]       │
│    FastAPI HTTPX Endpoints, DuckDB Parquet Queries     │
├────────────────────────────────────────────────────────┤
│        [Tier 1: Unit Tests (85%+ Coverage)]            │
│  Schema Validation, Unit Harmonization, Pydantic DTOs  │
└────────────────────────────────────────────────────────┘
```

### 3.1 Tier 1: Unit Testing (`pytest tests/unit/`)
* **Data Validation Test:** Verifies that out-of-bounds inputs (e.g., negative floor area, humidity $> 100\%$) trigger validation errors and route to quarantine logs.
* **Unit Harmonization Test:** Asserts that Imperial conversions ($\text{sq ft} \to \text{m}^2$, $^\circ\text{F} \to ^\circ\text{C}$) are mathematically exact.
* **Feature Engineering Test:** Verifies $\sin/\cos$ cyclical hour encoding and rolling 24h temperature aggregations.

### 3.2 Tier 2: Integration & Contract Testing (`pytest tests/integration/`)
* **API Route Testing:** Uses `httpx.AsyncClient` to test all REST endpoints against happy and error paths.
* **Dual-Mode Parity Test:** Runs identical analytical queries against DuckDB (Local) and verifies schema consistency against Glue Catalog definitions.
* **SHAP Additivity Test:** Mathematically asserts that $f(x) = E[f(x)] + \sum \phi_i$ to ensure zero explainability leakage.

### 3.3 Tier 3: Model & Physics Benchmark Testing (`pytest tests/ml/`)
* **Accuracy Threshold Test:** Asserts holdout $R^2 \ge 0.95$ and $\text{MAE} \le 1.25\text{ kWh/m}^2$ for the thermal surrogate.
* **ASHRAE Guideline 14 Compliance Test:** Calculates $\text{CV(RMSE)}$ and $\text{NMBE}$ on the test partition, failing the build if $\text{CV(RMSE)} > 15.0\%$ or $|\text{NMBE}| > 5.0\%$.
* **DOE Reference Validation Test:** Compares surrogate outputs against pre-simulated DOE EnergyPlus runs across 4 climate zones, verifying error margin $\le 6\%$.

### 3.4 Tier 4: Performance & Load Testing
* **Latency Profiling:** Executes 1,000 randomized inference queries; asserts $p_{95} \text{ latency} < 250\text{ ms}$.
* **NSGA-II Runtime Benchmark:** Confirms 50-generation optimization converges within $< 3.0\text{ seconds}$.
* **Docker Smoke Test:** Verifies `docker-compose up` launches all services in healthy state within 45 seconds.

---

## 4. Test Automation in CI/CD (GitHub Actions)

Every Pull Request to `main` triggers an automated GitHub Actions pipeline executing:
1. `black --check .` and `flake8 .` (Code style and linting).
2. `pytest --cov=src --cov-report=term-missing --cov-fail-under=85` (Test execution with $85\%$ minimum coverage gate).
3. Automated Docker build and container health probe.
