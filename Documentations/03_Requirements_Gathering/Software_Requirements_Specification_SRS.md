# Software Requirements Specification (SRS)
**Standard:** IEEE Std 830-1998 Format  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Submission Date:** November 2026  
**Document Version:** 2.0 (Reconstructed)  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the authoritative engineering requirements for the **Building Energy Efficiency Platform**. It specifies the functional behaviors, performance thresholds, architectural constraints, and interfaces governing data ingestion, preprocessing, machine learning model benchmarking, hyperparameter tuning, web-based simulator deployment, and AWS cloud storage.

### 1.2 Scope of the System
The platform serves as an intelligent decision-support surrogate simulator for sustainable architects and HVAC consultants. It predicts **Heating Load ($Y_1$)** and **Cooling Load ($Y_2$)** in $\text{kWh/m}^2$ directly from building envelope specifications before construction commences. By replacing slow whole-building physics simulations (e.g., EnergyPlus) with high-fidelity gradient-boosted decision trees (XGBoost), the system reduces evaluation latency from hours to milliseconds while retaining over 99% accuracy ($R^2 > 0.99$).

### 1.3 Definitions, Acronyms, and Abbreviations
* **BEM:** Building Energy Modeling
* **CV:** Cross-Validation (specifically 5-fold CV)
* **DEPI:** Digital Egypt Pioneers Initiative
* **DoD:** Definition of Done
* **EDA:** Exploratory Data Analysis
* **Gradio:** Open-source Python library for rapid machine learning web application development
* **IQR:** Interquartile Range
* **MAE:** Mean Absolute Error
* **MEP:** Mechanical, Electrical, and Plumbing engineering
* **ML:** Machine Learning
* **OLS:** Ordinary Least Squares
* **$R^2$:** Coefficient of Determination
* **RMSE:** Root Mean Squared Error
* **S3:** Amazon Simple Storage Service
* **SRS:** Software Requirements Specification
* **WWR:** Window-to-Wall Ratio (Glazing Area Ratio)
* **XGBoost:** eXtreme Gradient Boosting

### 1.4 References
1. Tsanas, A., & Xifara, A. (2012). *Accurate quantitative estimation of energy performance of residential buildings using statistical machine learning tools.* Energy and Buildings, 49, 560–567.
2. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications.*
3. DEPI Graduation Project Deliverable Guidelines (AWS Machine Learning Track, 2026).

---

## 2. Overall Description

### 2.1 Product Perspective & Context
The platform operates as a standalone surrogate simulator and early-stage design optimizer. Rather than running exhaustive 3D finite-element thermodynamic calculations during initial design meetings, architects input high-level envelope parameters to receive instantaneous heating and cooling estimates, efficiency ratings (A–E), sensitivity trends, and optimal design configurations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM CONTEXT DIAGRAM                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ↓                               ↓                               ↓
[Architectural Features]  [Preprocessing Pipeline]    [Machine Learning Models]
• Relative Compactness    • 80/20 Train/Test Split    • Linear Regression (Baseline)
• Surface Area (m²)       • Wall_Surface_Ratio        • Decision Tree Regressor
• Wall Area (m²)          • Glazing_x_Height          • Random Forest Regressor
• Roof Area (m²)          • StandardScaler (Numeric)  • Gradient Boosting
• Overall Height (m)      • OneHotEncoder (Categoric) • Tuned XGBoost (Primary)
• Orientation (2-5)       └─────────────┬─────────────┘
• Glazing Area (0-0.4)                  │
• Glazing Distribution                  ▼
                          ┌───────────────────────────┐
                          │  Gradio Web Simulator     │
                          │  - Live Thermal KPIs      │
                          │  - A-E Efficiency Grade   │
                          │  - Glazing Sensitivity    │
                          │  - 768-Design Optimizer   │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          [ AWS Cloud Infrastructure ]
                          • Amazon S3 Artifacts Bucket
                          • Amazon SageMaker Notebook
```

### 2.2 Product Functions
1. **Automated Data Quality Audit:** Validates raw dataset against nulls, duplicates, and statistical bounds.
2. **Leak-Free Preprocessing:** Executes train/test splitting and builds modular sklearn transformers (`src/preprocessing.py`).
3. **Surrogate Model Inference:** Predicts Heating and Cooling loads in $< 50\text{ ms}$.
4. **Energy Efficiency Rating:** Categorizes total load into 5 color-coded quintile ratings (A = lowest energy, E = highest energy).
5. **Dynamic Sensitivity Profiling:** Plots continuous load impact across varying glazing percentages.
6. **Combinatorial Design Optimization:** Evaluates all 768 archetypes to discover top-5 energy-efficient configurations.

### 2.3 User Classes and Characteristics
* **Sustainable Building Architects:** Require an intuitive visual UI, pre-populated geometry dimensions, and rapid What-If scenario feedback.
* **MEP / Energy Consultants:** Require precise numerical outputs (MAE, RMSE), comparative benchmark bars against dataset averages, and optimizer filtering.
* **MLOps / Cloud Engineers:** Require reproducible notebooks, serialized joblib pipelines, and versioned S3 storage.
* **Academic Evaluators:** Require complete documentation, transparent cross-validation, and rigorous code organization.

### 2.4 Operating Environment
* **Local Developer Environment:** Python 3.11+, Windows 10/11, macOS, or Linux.
* **Web UI Runtime:** Gradio 6.x executing locally on `http://127.0.0.1:7860` or hosted remotely.
* **Cloud Platform:** Amazon Web Services (AWS) using Amazon S3 for artifact storage and Amazon SageMaker Notebook Instances for model training.

### 2.5 Design and Implementation Constraints
* Models must be trained strictly on the 768 validated residential buildings from the Tsanas & Xifara dataset.
* Dependencies must strictly align with `requirements.txt` to avoid serialization mismatches.
* Preprocessor transformers must be fitted exclusively on the 80% training partition.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
* **User Interface:** Web application rendered by Gradio containing 4 tabs: "🎛️ Simulator", "🎯 Design Optimizer", "📊 Model Performance", and "ℹ️ About".
* **Software Interfaces:**
  * Python standard library (`os`, `json`, `warnings`, `shutil`).
  * Core ML libraries: `pandas`, `numpy`, `scikit-learn`, `xgboost`, `joblib`, `matplotlib`, `seaborn`, `gradio`.
  * AWS interfaces: AWS CLI / Boto3 for S3 bucket synchronization.

### 3.2 Functional Requirements

#### 3.2.1 Data Management & Feature Engineering
* **REQ-DATA-1:** Ingest 768 rows with 8 features (`Relative_Compactness`, `Surface_Area`, `Wall_Area`, `Roof_Area`, `Overall_Height`, `Orientation`, `Glazing_Area`, `Glazing_Area_Distribution`) and 2 targets (`Heating_Load`, `Cooling_Load`).
* **REQ-DATA-2:** Compute $\text{Wall\_Surface\_Ratio} = \frac{\text{Wall\_Area}}{\text{Surface\_Area}}$ and $\text{Glazing\_x\_Height} = \text{Glazing\_Area} \times \text{Overall\_Height}$.
* **REQ-DATA-3:** Partition data into 80% training (614 rows) and 20% test (154 rows) using fixed `random_state=42`.
* **REQ-DATA-4:** Provide `build_preprocessor(scale, onehot, engineer)` in `src/preprocessing.py`.

#### 3.2.2 Model Training and Benchmarking
* **REQ-MOD-1:** Train baseline models (Linear Regression, Decision Tree, Random Forest) evaluated via 5-fold cross-validation.
* **REQ-MOD-2:** Train advanced models (Gradient Boosting, XGBoost) with hyperparameter tuning via `RandomizedSearchCV`.
* **REQ-MOD-3:** Verify holdout test set performance meets or exceeds target KPIs:
  * Decision Tree: Heating $R^2 \ge 0.996$, Cooling $R^2 \ge 0.944$.
  * Random Forest: Heating $R^2 \ge 0.997$, Cooling $R^2 \ge 0.960$.
  * Tuned XGBoost: Heating $R^2 \ge 0.998$, Cooling $R^2 \ge 0.994$.
* **REQ-MOD-4:** Serialize trained models to `models/xgb_heating_load.joblib` and `models/xgb_cooling_load.joblib`.

#### 3.2.3 Simulator Web Application
* **REQ-UI-1:** The simulator must auto-fill geometry features based on the chosen canonical building shape.
* **REQ-UI-2:** Render 4 KPI cards: Heating Load, Cooling Load, Total Load, and Efficiency Rating (A–E).
* **REQ-UI-3:** Generate dynamic comparison bar chart and glazing sensitivity plot.
* **REQ-UI-4:** Provide an automated Design Optimizer filtering across objective, maximum glazing, and building height.

### 3.3 Performance & Non-Functional Requirements
* **REQ-PERF-1:** Single-query inference latency $< 50\text{ ms}$.
* **REQ-PERF-2:** Optimizer evaluation of all 768 designs $< 500\text{ ms}$.
* **REQ-REL-1:** 100% deterministic reproducibility when seeded with `random_state=42`.
* **REQ-PORT-1:** Pinned dependencies in `requirements.txt` ensuring zero environment mismatch.

---

## 4. Requirements Traceability Matrix (RTM)

| Requirement ID | Description | Source Objective | Implementation File | Verification Method |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-DATA-1** | Ingest & validate 768-sample dataset | O-01 | `notebooks/Energy_project.ipynb` | Automated null & duplicate check |
| **REQ-DATA-2** | Compute engineered interaction terms | O-02 | `src/preprocessing.py` | Unit test / transformation shape check |
| **REQ-DATA-3** | 80/20 train/test split (`random_state=42`) | O-02 | `notebooks/Energy_project.ipynb` | Row count verification (614 / 154) |
| **REQ-DATA-4** | Reusable Sklearn Pipeline | O-02 | `src/preprocessing.py` | Pipeline `.fit_transform()` test |
| **REQ-MOD-1** | Baseline model 5-fold CV | O-03 | `notebooks/Energy_project.ipynb` | `eda_outputs/basic_models_results.csv` |
| **REQ-MOD-2** | Tuned XGBoost optimization | O-04 | `notebooks/Energy_project.ipynb` | `eda_outputs/tuned_xgb_results.csv` |
| **REQ-MOD-4** | Model serialization | O-04 | `models/xgb_*.joblib` | `joblib.load()` integrity test |
| **REQ-UI-1** | Shape auto-fill & parameter input | O-05 | `app.py` | Functional UI testing |
| **REQ-UI-2** | Thermal KPIs & A–E Rating | O-05 | `app.py` | Output calculation verification |
| **REQ-UI-4** | Combinatorial Design Optimizer | O-05 | `app.py` | 768-row search result test |
