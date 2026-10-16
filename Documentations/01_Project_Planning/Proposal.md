# Project Proposal: AI-Based Building Energy Performance Evaluation & Design Optimization

**Track:** Data Engineering + Machine Learning + AWS Cloud  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Submission Date:** October 2026  
**Document Version:** v1.0  

---

## 👥 Team Members

| Name | Role | Track |
| :--- | :--- | :--- |
| **Ahmed AbdElrahman Ahmed** | Team Leader | AI / Machine Learning |
| **Ahmed Mohamed Sayed Shehata** | Team Member | AI / Machine Learning |
| **Eman Abo Al Qassem Abo Al Hjajj Omar** | Team Member | AI / Machine Learning |
| **Manar Mahmoud Ahmed** | Team Member | AI / Machine Learning |
| **Ali Ahmed Ali Elmeleegy** | Team Member | AI / Machine Learning |

---

## 1. Executive Summary

The building and construction sector accounts for nearly **36% of global final energy consumption** and approximately **39% of energy- and process-related carbon dioxide ($CO_2$) emissions** globally. Decisions made during the earliest architectural conceptualization—such as building geometry, orientation, surface-to-volume ratio, envelope glazing distribution, wall insulation, and HVAC system types—permanently determine up to **80% of a building's lifetime operational energy footprint**. 

Traditional building energy performance assessment relies on whole-building physics simulation engines like the U.S. Department of Energy's (DOE) **EnergyPlus**. While physics engines are highly accurate, executing parametric sweeps across thousands of design permutations requires prohibitive computational runtime (hours or days per building complex), making real-time iterative optimization impractical during early architectural workshops. Conversely, naive machine learning attempts often oversimplify the problem: treating early-stage thermal load regression (heating and cooling loads) as identical to actual operational meter electricity consumption, or failing to incorporate dynamic micro-climate weather conditions.

**CloudXAi** delivers an end-to-end, decision-support platform that bridges early-stage architectural design with operational time-series data and physics-based validation. The platform enables architects and energy consultants to:
1. Predict early-stage heating and cooling loads instantly ($< 500\text{ ms}$) using high-precision ML surrogate models.
2. Forecast operational hourly weather-aware electricity consumption leveraging the industry-standard ASHRAE Great Energy Predictor III benchmark.
3. Diagnose the physical drivers of energy behavior using Explainable AI (SHAP TreeExplainer).
4. Rapidly discover optimal design trade-offs through multi-objective evolutionary optimization (NSGA-II) across competing goals (energy minimization, thermal comfort, envelope cost).
5. Seamlessly operate in a **Dual-Mode Architecture**: running locally on developer workstations (DuckDB + Local Lakehouse + MLflow + FastAPI + Streamlit) and deploying natively to AWS Cloud (S3 + Glue + Athena + SageMaker/ECS).

---

## 2. Problem Statement

Modern architectural engineering projects face three interconnected challenges:

1. **Computational Bottleneck of Physics Simulators:** Detailed EnergyPlus simulations require extensive manual building energy modeling (BEM) setups and run sluggishly, precluding real-time interactive design explorations.
2. **The Domain Gap Between Thermal Loads and Measured Energy:** Many existing data science projects confuse architectural thermal heating/cooling loads (kWh/m² of thermal demand) with metered operational utility electricity consumption (kWh metered over time). This misleads stakeholders and invalidates predictive guarantees.
3. **Black-Box Skepticism and Vendor Lock-in:** Architects and structural engineers reject black-box ML predictions without interpretable physical justifications (e.g., explaining why a 35% south-facing glazing ratio outperforms a 20% ratio). Furthermore, cloud-only systems fail when consultants need to evaluate proprietary designs on local workstations without cloud bills or external internet dependencies.

---

## 3. Project Objectives (Specific & Measurable)

* **O-01 (Data Engineering & Dual-Mode Lakehouse):** Build an automated ETL pipeline that validates, standardizes, and joins heterogeneous architectural, time-series meter, and weather data into a Curated Parquet Lakehouse, accessible locally via DuckDB/Polars and in the cloud via AWS S3 and Athena.
* **O-02 (High-Fidelity Surrogate Modeling):** Train supervised regression ensembles (XGBoost, LightGBM, Random Forest, MLP) predicting Heating Load and Cooling Load with $R^2 \ge 0.95$ and $\text{MAE} \le 1.5\text{ kWh/m}^2$, reducing simulation inference latency from minutes to under 500 ms.
* **O-03 (Weather-Aware Operational Energy Forecasting):** Develop an operational time-series forecasting model on the ASHRAE GEPIII dataset incorporating calendar and rolling weather features (temperature, solar radiation, humidity, wind speed), achieving $\text{CV(RMSE)} \le 15\%$ and $\text{NMBE} \le \pm 5\%$ in accordance with ASHRAE Guideline 14 standards.
* **O-04 (Multi-Objective Design Optimization):** Implement an NSGA-II evolutionary algorithm with Pareto frontier exploration, allowing designers to navigate optimal trade-offs between minimizing energy demand, maximizing spatial compactness, and reducing envelope glazing costs.
* **O-05 (Explainable AI & Interactive Decision Support):** Deploy an interactive Streamlit Digital Twin Dashboard powered by a FastAPI backend, featuring SHAP waterfall/force attribution plots, real-time What-If parameter sliders, and automated PDF executive diagnostic reporting.

---

## 4. Project Scope

### In-Scope:
* Dual-mode data processing pipeline supporting local files (`data/raw`, `data/processed`, `data/curated`) and AWS S3 object storage.
* Benchmark architectural dataset modeling (Tsanas & Xifara, 768 samples) and ASHRAE GEPIII time-series meter dataset integration.
* Comprehensive feature engineering: building compactness ($C$), surface-to-volume ratio ($S/V$), wall-to-window ratio ($WWR$), orientation azimuth, degree-days, and rolling weather statistics.
* Supervised ML regression, time-series forecasting, and residual anomaly diagnostics.
* Explainable AI (SHAP) feature importance and local instance attributions.
* Multi-objective genetic optimization (Pareto front generation via NSGA-II).
* Interactive Web UI (Streamlit) and REST API (FastAPI) containerized with Docker.

### Out-of-Scope (To Prevent Scope Creep):
* Real-time IoT sensor hardware installation or edge micro-controller deployment.
* Structural seismic or mechanical stress analysis of building materials.
* Commercial billing and utility tariff rate negotiations.
* Complex computational fluid dynamics (CFD) airflow simulations.

---

## 5. Technology Stack & Tooling

```
Data Ingestion & Storage:   Local Filesystem / AWS S3, Parquet Columnar Format
ETL & Query Engine:         DuckDB, Polars, PySpark / AWS Glue, Amazon Athena
Machine Learning / XAI:     Scikit-learn, XGBoost, LightGBM, PyTorch, SHAP, PyMoo
Experiment Tracking:        MLflow (Local tracking server & Model Registry)
Backend API:                FastAPI, Pydantic v2, Uvicorn
Frontend Dashboard:         Streamlit, Plotly Interactive Visualizations
DevOps & Infrastructure:    Docker, Docker-Compose, GitHub Actions, LocalStack / AWS
```

---

## 6. Expected Deliverables & Impact

1. **Production-Ready GitHub Repository:** Clean, modular, linted Python codebase with CI/CD workflows and high unit-test coverage.
2. **Dual-Mode Data Lake & Pipeline:** Verified ETL transforming multi-gigabyte raw datasets into query-optimized Parquet tables.
3. **Serialized ML Models & MLflow Registry:** Versioned model artifacts with reproducibility benchmarks.
4. **Interactive Digital Twin Web Platform:** Accessible decision-support tool enabling intuitive what-if explorations and Pareto trade-off analysis.
5. **Academic & Technical Documentation:** Complete set of DEPI-compliant engineering reports (Project Plan, Literature Review, SRS, SAD).
