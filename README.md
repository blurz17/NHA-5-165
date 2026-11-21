# Building Energy Efficiency: Heating & Cooling Load Prediction System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-EB5424.svg?style=flat)](https://xgboost.readthedocs.io)
[![Heroku](https://img.shields.io/badge/Deploy-Heroku-430098.svg?style=flat&logo=heroku)](https://www.heroku.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg?style=flat&logo=vercel)](https://vercel.com)

**Digital Egypt Pioneers Initiative (DEPI) — Graduation Project**  
**Track:** AWS Machine Learning Track  
**Team Code:** NHA-5-165 | **Team Name:** CloudXAi  

### Team Members
- **Ahmed AbdElrahman Ahmed** (Team Leader)
- **Manar Mahmoud Ahmed**
- **Ali Ahmed Ali Elmeleegy**
- **Ahmed Mohamed Sayed Shehata**
- **Eman Abo Al Qassem Abo Al Hjajj Omar**

---

## 1. Project Overview

Heating and cooling account for over 40% of residential energy consumption. Architectural choices made at early design stages (building compactness, glazing ratio, envelope surface area, and height) lock in long-term thermal performance.

This project delivers an end-to-end, production-ready machine learning system that predicts **Heating Load** ($Y_1$) and **Cooling Load** ($Y_2$) from 8 building design parameters. The system includes:
- **Modular Data & ML Pipelines:** Leakage-free preprocessing, feature engineering (`Wall_Surface_Ratio`, `Glazing_x_Height`), and cross-validation.
- **10 Trained Models:** 5 regression algorithms trained independently for both Heating and Cooling loads.
- **FastAPI Backend (Heroku):** Production REST API with endpoints for inference, design optimization, and health checks.
- **React + Vite Frontend (Vercel):** Modern interactive web application with thermal load simulator, passive design optimizer, and live benchmarks.

---

## 2. Directory Structure

```
energy-efficiency-prediction/
│
├── data/
│   ├── raw/
│   │   └── energy_efficiency_data.csv       # Original dataset (768 records)
│   └── processed/
│       ├── train.csv                        # 80% train split (614 rows)
│       └── test.csv                         # 20% test split (154 rows)
│
├── notebooks/
│   ├── 01_eda.ipynb                         # Exploratory Data Analysis
│   ├── 02_preprocessing_feature_engineering.ipynb # Preprocessing & Pipelines
│   ├── 03_basic_modeling.ipynb              # Baseline & Tree Modeling
│   └── 04_advanced_modeling_tuning.ipynb    # Gradient Boosting, XGBoost Tuning & Bundle
│
├── src/
│   └── energy_efficiency/                   # Core Python Package
│       ├── __init__.py                      # Package exports
│       ├── config.py                        # Constants, paths, hyperparameters
│       ├── data_loader.py                   # Data ingestion utilities
│       ├── preprocessing.py                 # Pipeline builder (Linear & Tree)
│       ├── feature_engineering.py           # Interaction features calculation
│       ├── evaluation.py                    # Metric computations & CV
│       └── model_export.py                  # Joblib serialization & bundling
│
├── artifacts/
│   ├── candidates/                          # Individual model files (All 10 models)
│   │   ├── decision_tree.joblib
│   │   ├── random_forest.joblib
│   │   ├── gradient_boosting.joblib
│   │   ├── xgboost_default.joblib
│   │   ├── linear_regression_heating.joblib
│   │   ├── linear_regression_cooling.joblib
│   │   ├── decision_tree_heating.joblib
│   │   ├── decision_tree_cooling.joblib
│   │   ├── random_forest_heating.joblib
│   │   ├── random_forest_cooling.joblib
│   │   ├── gradient_boosting_heating.joblib
│   │   ├── gradient_boosting_cooling.joblib
│   │   ├── xgboost_heating.joblib
│   │   └── xgboost_cooling.joblib
│   │
│   └── production/
│       └── model_bundle.joblib              # Unified production bundle (10 models + preprocessors)
│
├── reports/
│   ├── eda/
│   │   ├── data_quality_report.csv
│   │   ├── eda_summary.txt
│   │   └── plots/
│   │       ├── 01_distributions.png
│   │       ├── 02_boxplots.png
│   │       ├── 03_correlation_heatmap.png
│   │       ├── 04_features_vs_targets.png
│   │       ├── 05_heating_vs_cooling.png
│   │       └── 06_pairplot.png
│   │
│   ├── preprocessing/
│   │   └── feature_experiments.csv
│   │
│   └── modeling/
│       ├── basic_models_results.csv
│       ├── advanced_models_results.csv
│       ├── cross_validation_results.csv
│       ├── hyperparameter_results.csv
│       └── actual_vs_predicted.png
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                          # FastAPI endpoints & CORS
│   │   ├── schemas.py                       # Pydantic validation schemas
│   │   ├── service.py                       # Inference & optimization engine
│   │   └── config.py                        # Server settings & paths
│   │
│   └── tests/
│       ├── test_api.py                      # REST API endpoint tests
│       └── test_prediction.py               # Model prediction & logic tests
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── BuildingForm.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   ├── ModelComparisonTable.jsx
│   │   │   └── OptimizerTool.jsx
│   │   ├── pages/
│   │   │   ├── SimulatorPage.jsx
│   │   │   ├── OptimizerPage.jsx
│   │   │   ├── BenchmarksPage.jsx
│   │   │   └── DocsPage.jsx
│   │   ├── services/
│   │   │   └── prediction.js                # API client with fallback
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json                          # Vercel deployment configuration
│
├── docs/
│   ├── data_dictionary.md                   # Feature definitions & ranges
│   ├── methodology.md                       # Pipeline & ML workflow
│   ├── model_card.md                        # Model cards & benchmark results
│   ├── api_documentation.md                 # REST API documentation
│   └── limitations.md                       # Boundary conditions
│
├── tests/
│   ├── test_preprocessing.py                # Preprocessor unit tests
│   └── test_feature_engineering.py          # Feature engineering unit tests
│
├── requirements.txt                         # Full dependencies
├── Procfile                                 # Heroku deployment directive
├── .gitignore
└── README.md
```

---

## 3. Model Benchmark Results (10 Models)

Evaluated on the independent 20% test partition (154 samples):

| # | Algorithm | Target | MAE ($\text{kWh/m}^2$) | RMSE ($\text{kWh/m}^2$) | $R^2$ Score | Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | **Linear Regression** | Heating Load | 1.8728 | 2.8002 | 0.9248 | Baseline |
| 2 | **Linear Regression** | Cooling Load | 2.1165 | 3.0471 | 0.8998 | Baseline |
| 3 | **Decision Tree** | Heating Load | 0.4071 | 0.5873 | 0.9967 | Candidate |
| 4 | **Decision Tree** | Cooling Load | 1.3253 | 2.2609 | 0.9448 | Candidate |
| 5 | **Random Forest** | Heating Load | 0.3446 | 0.4919 | 0.9977 | Candidate |
| 6 | **Random Forest** | Cooling Load | 1.1659 | 1.9043 | 0.9609 | Candidate |
| 7 | **Gradient Boosting** | Heating Load | 0.3600 | 0.5100 | 0.9974 | Candidate |
| 8 | **Gradient Boosting** | Cooling Load | 1.0500 | 1.7300 | 0.9769 | Candidate |
| 9 | **XGBoost (Tuned)** | Heating Load | **0.2800** | **0.4100** | **0.9983** | **Production** |
| 10 | **XGBoost (Tuned)** | Cooling Load | **0.6500** | **1.0200** | **0.9942** | **Production** |

---

## 4. Local Installation & Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/nhahub/NHA-5-165.git
cd NHA-5-165

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run unit and API tests
pytest tests/ backend/tests/ -v

# Start FastAPI backend server
uvicorn backend.app.main:app --reload --port 8000
```
API will be live at `http://localhost:8000` (Interactive docs at `http://localhost:8000/docs`).

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 5. Deployment Guide

### A. Deploy Backend to Heroku
1. Make sure `Procfile` is present in the repository root:
   ```
   web: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
   ```
2. Deploy via Heroku CLI:
   ```bash
   heroku login
   heroku create energy-efficiency-api
   git push heroku main
   ```
3. Your Heroku backend URL will be: `https://energy-efficiency-api.herokuapp.com`

### B. Deploy Frontend to Vercel
1. In `frontend/vercel.json`, verify the backend rewrite URL points to your deployed Heroku app.
2. In the `frontend` directory, deploy using Vercel CLI or via GitHub integration:
   ```bash
   cd frontend
   vercel
   ```
3. Set Environment Variable in Vercel project settings:
   - `VITE_API_URL` = `https://energy-efficiency-api.herokuapp.com/api`

---

## 6. License & Attribution
Developed for the **Digital Egypt Pioneers Initiative (DEPI)** - Ministry of Communications and Information Technology (MCIT), Egypt.
Dataset: *Tsanas & Xifara (2012), Energy and Buildings, Oxford University / UCI Machine Learning Repository.*
