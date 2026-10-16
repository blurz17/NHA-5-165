# Stage 3: Functional Requirements Specification
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. Overview

This document specifies the complete functional requirements (FRs) for the **CloudXAi** platform. Each requirement is assigned a unique identifier, priority level (**Critical**, **High**, **Medium**), input parameters, expected processing behavior, output guarantees, and verification methods.

---

## 2. Module 1: Data Engineering & Lakehouse Pipeline (FR-ENG)

### FR-ENG-01: Multi-Source Raw Data Ingestion
* **Description:** The system shall ingest raw architectural datasets (Tsanas & Xifara), large-scale operational hourly smart meter telemetry (ASHRAE GEPIII), and coincident meteorological weather records.
* **Priority:** **Critical**
* **Inputs:** Raw CSV/TSV/JSON files placed in `data/raw/` (Local Mode) or `s3://building-energy-project/raw/` (Cloud Mode).
* **Processing:** Read stream/batch data into memory using Apache Arrow / Polars; detect encoding and header schemas.
* **Outputs:** Ingested in-memory data frames with ingestion timestamp metadata.
* **Verification:** Automated unit test asserting non-empty ingestion and valid row counts.

### FR-ENG-02: Automated Data Validation & Schema Quarantine
* **Description:** The system shall validate ingested data against pre-defined physical and schema rules. Invalid or corrupt records shall be quarantined with detailed error logs without crashing the pipeline.
* **Priority:** **Critical**
* **Validation Rules:**
  * Area and dimensions $> 0$; Floor count $\ge 1$.
  * Relative Compactness $\in [0.5, 1.1]$.
  * Relative Humidity $\in [0\%, 100\%]$; Wind speed $\ge 0\text{ m/s}$.
  * Hourly energy consumption $\text{kWh} \ge 0$.
  * Zero duplicate `(building_id, timestamp)` primary key tuples.
* **Outputs:** Clean validated dataset; quarantine CSV log saved to `logs/validation/quarantined_records.csv`.
* **Verification:** PyTest pipeline test with synthetic corrupt data verifying quarantine routing.

### FR-ENG-03: Dual-Mode ETL & Columnar Parquet Standardization
* **Description:** The system shall standardize all tabular datasets into partitioned, snappy-compressed Parquet files organized according to a dimensional Star Schema.
* **Priority:** **Critical**
* **Processing:** 
  * In Local Mode: Execute transformations using DuckDB and Polars, saving to `data/curated/`.
  * In Cloud Mode: Trigger PySpark scripts via AWS Glue, writing to S3 processed/curated prefixes and registering tables in AWS Glue Data Catalog.
* **Outputs:** Partitioned Parquet tables: `dim_building`, `dim_weather`, `dim_design_envelope`, `fact_energy_meter`, `fact_simulation_benchmark`.
* **Verification:** SQL query execution on both DuckDB and Athena returning identical summary statistics.

### FR-ENG-04: Automated Unit & Coordinate Harmonization
* **Description:** The system shall detect and convert all incoming measurements to standardized SI units (Square meters $\text{m}^2$, Celsius $^\circ\text{C}$, $\text{m/s}$, $\text{kWh/m}^2$, and $\text{kWh}$).
* **Priority:** **High**
* **Inputs:** Mixed raw records containing Imperial units (Btu, sq ft, °F).
* **Outputs:** Harmonized SI metric tables with standard column suffixes (`_m2`, `_celsius`, `_kwh`).
* **Verification:** Assertion tests on unit conversion coefficients.

### FR-ENG-05: Temporal & Weather Feature Engineering
* **Description:** The ETL pipeline shall compute dynamic temporal and meteorological features for time-series modeling.
* **Priority:** **High**
* **Engineered Features:**
  * Cyclical encodings: $\sin / \cos$ transformations for hour-of-day ($[0, 23]$) and month ($[1, 12]$).
  * Binary flags: `is_weekend`, `is_holiday`.
  * Weather aggregations: 24-hour rolling mean temperature, rolling 7-day temperature standard deviation.
  * Thermal metrics: Daily Heating Degree Days (HDD) and Cooling Degree Days (CDD) with $18.3^\circ\text{C}$ baseline.
* **Outputs:** Enriched feature matrix `fact_features_hourly`.
* **Verification:** Automated feature variance and correlation checks in pipeline test.

---

## 3. Module 2: Machine Learning & Surrogate Modeling (FR-ML)

### FR-ML-01: Multi-Target Thermal Load Regression
* **Description:** The system shall train and serve supervised machine learning surrogate models predicting both Heating Load ($Y_1$) and Cooling Load ($Y_2$) from architectural geometric inputs.
* **Priority:** **Critical**
* **Candidate Algorithms:** LightGBM Regressor, XGBoost Regressor, Random Forest, and Multi-Layer Perceptron (MLP).
* **Inputs:** Vector of 8 geometric features (Relative Compactness, Surface Area, Wall Area, Roof Area, Height, Orientation, Glazing Area, Glazing Distribution).
* **Outputs:** Predicted Heating Load and Cooling Load ($\text{kWh/m}^2$) along with $95\%$ prediction intervals.
* **Performance Benchmark:** Holdout $R^2 \ge 0.95$ and $\text{MAE} \le 1.25\text{ kWh/m}^2$.
* **Verification:** Automated regression test suite against benchmark holdout dataset.

### FR-ML-02: Weather-Aware Operational Energy Forecasting
* **Description:** The system shall forecast multi-horizon operational building electricity consumption ($\text{kWh}$) on the ASHRAE GEPIII dataset.
* **Priority:** **Critical**
* **Inputs:** Building metadata (square footage, primary use, floor count), historical lag consumption, and prospective hourly weather forecasts (temperature, humidity, wind, solar).
* **Outputs:** Chronological hourly energy forecast vector across 24-hour to 168-hour future windows.
* **Compliance Threshold:** Conformance to ASHRAE Guideline 14 standards: $\text{CV(RMSE)} \le 15.0\%$ and $\text{NMBE} \le \pm 5.0\%$.
* **Verification:** Temporal backtesting across an unseen out-of-sample chronological test period.

### FR-ML-03: Automated Experiment Tracking & Model Registry
* **Description:** All model training runs, hyperparameters, metrics ($R^2$, $\text{RMSE}$, $\text{MAE}$, $\text{CV(RMSE)}$), and serialized model binaries shall be logged to MLflow.
* **Priority:** **High**
* **Outputs:** Local MLflow tracking database (`mlruns/`) and tagged production artifacts in the Model Registry.
* **Verification:** Assertion that top-performing models are automatically promoted to `Production` status.

### FR-ML-04: Sub-Second Vectorized Inference Engine
* **Description:** The machine learning inference engine shall process single-instance and batch prediction requests in under 250 milliseconds.
* **Priority:** **Critical**
* **Processing:** Utilize optimized C-based inference libraries (LightGBM/ONNX runtime) with vectorized NumPy arrays.
* **Verification:** Latency benchmark test asserting $p_{99} \text{ latency} < 250\text{ ms}$.

### FR-ML-05: Operational Residual Anomaly Diagnostic
* **Description:** The system shall calculate the residual difference between actual smart meter readings and the predicted baseline ($\text{Residual} = Y_{\text{actual}} - \hat{Y}_{\text{pred}}$) to flag operational irregularities.
* **Priority:** **Medium**
* **Outputs:** Normalized anomaly score ($Z$-score) and visual flag when $|Z| > 2.5$.
* **Verification:** Synthetic anomaly injection test confirming detection sensitivity.

---

## 4. Module 3: What-If Simulation & Optimization Engine (FR-OPT)

### FR-OPT-01: Multi-Objective Evolutionary Optimization (NSGA-II)
* **Description:** The system shall execute the Non-dominated Sorting Genetic Algorithm II (NSGA-II) to discover Pareto-optimal architectural design trade-offs.
* **Priority:** **Critical**
* **Objectives:**
  1. Minimize Annual Heating Load ($\text{kWh/m}^2$).
  2. Minimize Annual Cooling Load ($\text{kWh/m}^2$).
  3. Minimize Envelope Construction Cost ($\$/\text{m}^2$ based on glazing and insulation material cost).
* **Decision Variables:** Relative Compactness, Window-to-Wall Ratio ($WWR$), Orientation Azimuth ($0^\circ–360^\circ$), Glazing Type.
* **Outputs:** 50-point non-dominated Pareto Frontier (Rank 1 solutions).
* **Runtime Target:** Execution convergence in $< 3.0\text{ seconds}$ using the ML surrogate model.
* **Verification:** Convergence hypervolume check and constraint validation.

### FR-OPT-02: Architectural Boundary & Budget Constraint Enforcement
* **Description:** The optimization engine shall enforce rigid geometric, structural, and budgetary boundary constraints.
* **Priority:** **High**
* **Constraints:**
  * Glazing ratio restricted to valid daylighting minimums ($WWR \ge 15\%$) and solar heat gain maximums ($WWR \le 50\%$).
  * Maximum allowable envelope construction budget ceiling.
* **Processing:** Penalty functions and constraint-handling mechanisms in PyMoo.
* **Outputs:** Strictly feasible candidate designs.
* **Verification:** Assertion that zero output designs violate specified bounds.

### FR-OPT-03: Real-Time What-If Scenario Sandbox
* **Description:** The platform shall calculate real-time differential performance when any design parameter is modified in the user interface.
* **Priority:** **Critical**
* **Inputs:** Baseline design vector and user-modified parameter delta.
* **Outputs:** Instant calculation of $\Delta\text{Heating Load}$, $\Delta\text{Cooling Load}$, and percentage energy change.
* **Verification:** Interactive parameter sweep asserting real-time UI updates without page reloads.

### FR-OPT-04: Physics Ground-Truth Verification (DOE Reference Benchmark)
* **Description:** The system shall allow users to compare any selected Pareto design candidate against pre-simulated DOE Commercial Reference Buildings in identical climate zones.
* **Priority:** **High**
* **Outputs:** Comparative variance report showing surrogate prediction vs. EnergyPlus ground-truth benchmark.
* **Verification:** Error margin between surrogate and DOE reference verified within $\le 6\%$.

---

## 5. Module 4: Explainable AI & Diagnostic Analysis (FR-XAI)

### FR-XAI-01: Global Feature Importance Analysis
* **Description:** The system shall compute and visualize global feature attributions across the entire dataset using the SHAP (Shapley Additive exPlanations) framework.
* **Priority:** **High**
* **Outputs:** SHAP summary plot and feature importance ranking highlighting dominant physical drivers.
* **Verification:** Automated unit test checking that SHAP values sum to the model's total variance.

### FR-XAI-02: Local Design Attribution (Waterfall & Force Plots)
* **Description:** For any evaluated building design, the system shall compute exact local Shapley values showing how each individual parameter pushed the prediction higher or lower than the dataset average baseline.
* **Priority:** **Critical**
* **Outputs:** Interactive SHAP waterfall plot and JSON payload of feature contributions ($\phi_i$).
* **Computation Time:** Latency $< 300\text{ ms}$ using TreeExplainer.
* **Verification:** Exact numerical assertion that $f(x) = E[f(x)] + \sum_{i=1}^{M} \phi_i$.

### FR-XAI-03: Automated Natural-Language Diagnostic Narrative
* **Description:** The system shall synthesize a human-readable diagnostic paragraph translating SHAP attribution values into architectural engineering recommendations.
* **Priority:** **Medium**
* **Example Output:** *"The predicted cooling load of 34.2 kWh/m² is primarily driven by high south-facing glazing (+4.1 kWh/m²) and low compactness (+2.8 kWh/m²). Reducing south glazing by 10% will yield an estimated 8.5% energy reduction."*
* **Verification:** Template validation test for dynamic narrative generation.

---

## 6. Module 5: API, Web Platform & Reporting (FR-SYS)

### FR-SYS-01: Modular FastAPI REST Service
* **Description:** The system shall expose a documented, asynchronous REST API using FastAPI and Pydantic v2.
* **Priority:** **Critical**
* **Core Endpoints:**
  * `POST /api/v1/predict/thermal-load`: Evaluates architectural parameters.
  * `POST /api/v1/predict/energy-forecast`: Generates weather-aware hourly forecast.
  * `POST /api/v1/optimize/pareto`: Executes NSGA-II optimization.
  * `POST /api/v1/explain/shap`: Computes local SHAP attributions.
  * `GET /api/v1/health`: Returns service health and active execution mode.
* **Verification:** Automated API contract testing with `httpx` and `pytest`.

### FR-SYS-02: Interactive Streamlit Digital Twin Dashboard
* **Description:** The system shall provide an intuitive, responsive web user interface structured into distinct analytical workflows: Overview, What-If Sandbox, Pareto Explorer, Hourly Forecaster, and XAI Diagnostics.
* **Priority:** **Critical**
* **Outputs:** Interactive Plotly 2D/3D visualizations, metric KPI callouts, and slider controllers.
* **Verification:** End-to-end user journey test verifying responsive rendering.

### FR-SYS-03: Automated Executive PDF Report Generator
* **Description:** The system shall compile evaluated design parameters, predicted loads, SHAP waterfall charts, and Pareto recommendations into a formatted PDF document.
* **Priority:** **High**
* **Outputs:** Downloadable PDF report (`Building_Performance_Report_<timestamp>.pdf`).
* **Verification:** PDF generation test verifying page formatting, chart rendering, and non-empty file size.

### FR-SYS-04: Execution Environment Portability Configuration
* **Description:** The application shall seamlessly switch between local workstation execution and AWS cloud deployment via environment variables (`EXECUTION_MODE=local` vs. `EXECUTION_MODE=aws`).
* **Priority:** **Critical**
* **Verification:** Pipeline test run with simulated offline network asserting zero AWS API calls in local mode.

### FR-SYS-05: Docker & Containerized Packaging
* **Description:** The entire application (FastAPI backend and Streamlit frontend) shall be packaged using Docker and orchestrated via `docker-compose.yml`.
* **Priority:** **High**
* **Outputs:** Multi-stage Docker images running on standard CPU hardware without proprietary GPU dependencies.
* **Verification:** Automated container build and health-check script in CI workflow.
