# Project Proposal: Building Energy Efficiency — Heating & Cooling Load Prediction

**Track:** AWS Machine Learning Track (DEPI Graduation Project)  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Submission Date:** November 2026  
**Document Version:** v2.0 (Reconstructed)  

---

## 👥 Team Members & Responsibilities

| Name | Role | Responsibilities | Track |
| :--- | :--- | :--- | :--- |
| **Ahmed AbdElrahman Ahmed** | **Team Leader** | End-to-End System Deployment, Interactive Gradio Simulator, Repository Architecture & AWS Integration | AWS Machine Learning |
| **Manar Mahmoud Ahmed** | **Data & EDA Specialist** | Exploratory Data Analysis, Statistical Distributions, Multicollinearity Detection & Data Quality Validation | AWS Machine Learning |
| **Ali Ahmed Ali Elmeleegy** | **Preprocessing Engineer** | Data Splitting Strategy, Feature Engineering (`Wall_Surface_Ratio`, `Glazing_x_Height`) & Reusable Sklearn Pipeline | AWS Machine Learning |
| **Ahmed Mohamed Sayed Shehata** | **Basic Modeling Engineer** | Baseline Regression Modeling (Linear Regression, Decision Tree, Random Forest) & 5-Fold Cross-Validation | AWS Machine Learning |
| **Eman Abo Al Qassem Abo Al Hjajj Omar** | **Advanced Modeling Engineer** | Advanced Tree Ensembles (Gradient Boosting, XGBoost), Hyperparameter Tuning (`RandomizedSearchCV`) & Feature Importance | AWS Machine Learning |

---

## 1. Executive Summary

Building heating and cooling loads account for roughly **40% of total energy consumption** in residential and commercial infrastructure. In contemporary architectural workflows, engineers discover that a building consumes excessive heating and cooling energy only **after** design finalization and physical construction. Remedying thermal inefficiencies post-construction is exorbitantly expensive or physically impossible.

This project delivers an interactive, machine learning-driven decision-support simulator that predicts a residential building's thermal performance—specifically **Heating Load ($Y_1$)** and **Cooling Load ($Y_2$)** in $\text{kWh/m}^2$—directly from early architectural shape and envelope specifications *before* ground is broken.

Using the landmark **Tsanas & Xifara (UCI Machine Learning Repository)** dataset comprising 768 simulated residential building designs, the team builds, evaluates, and deploys an end-to-end ML solution. The system demonstrates near-perfect predictive accuracy ($R^2 > 0.99$ for heating and $R^2 > 0.99$ for cooling using tuned XGBoost), reducing evaluation time from hours (physics simulation software) to milliseconds. The platform is deployed as an interactive Gradio web simulator and integrated with AWS cloud infrastructure (Amazon S3 and Amazon SageMaker).

---

## 2. Problem Statement

Architects and structural engineers face three critical bottlenecks during early building design:

1. **Slow Feedback Loops in Physics Engines:** Traditional whole-building energy modeling tools (e.g., EnergyPlus, DOE-2) require intensive 3D CAD modeling, material property entry, and lengthy thermal simulation runtimes (minutes to hours per building variation), making iterative design brainstorming impractical.
2. **Post-Construction Remediation Costs:** Decisions regarding building geometry (relative compactness, roof area, overall height) and envelope glazing (glazing ratio and orientation) are irreversible once construction commences. Suboptimal designs permanently inflate utility bills and carbon footprints.
3. **Lack of Accessible Interactive Design Tools:** Design teams need a rapid, lightweight surrogate simulator where they can adjust architectural parameters via simple controls, immediately inspect predicted heating and cooling loads, compare against energy rating benchmarks (A–E), and discover optimal building configurations.

---

## 3. Project Objectives (Specific & Measurable)

* **O-01 (Data Quality & Exploratory Analysis):** Ingest and audit the 768-sample Tsanas & Xifara dataset, verifying zero missing values, zero duplicates, and evaluating multicollinearity among geometric features (`Surface_Area`, `Roof_Area`, `Relative_Compactness`, `Overall_Height`).
* **O-02 (Robust Preprocessing Pipeline):** Implement a modular, leak-free scikit-learn preprocessing pipeline with 80/20 train/test splitting (`random_state=42`), feature scaling, one-hot encoding for categorical variables (`Orientation`, `Glazing_Area_Distribution`), and domain-specific feature engineering (`Wall_Surface_Ratio`, `Glazing_x_Height`).
* **O-03 (Baseline Modeling):** Train and benchmark baseline regressors (Linear Regression, Decision Tree, Random Forest) using 5-fold cross-validation on the training set, establishing baseline metrics ($R^2$, MAE, RMSE).
* **O-04 (Advanced Modeling & Hyperparameter Optimization):** Train advanced gradient-boosted ensembles (Gradient Boosting, XGBoost), applying `RandomizedSearchCV` over tree depth, learning rate, and subsample ratios to achieve $R^2 \ge 0.99$ and $\text{MAE} < 0.45\text{ kWh/m}^2$ on both targets.
* **O-05 (Interactive Simulator Deployment):** Develop and launch an interactive Gradio simulator (`app.py`) featuring building shape selection, orientation/glazing adjustments, instant load predictions, A–E energy efficiency classification, glazing sensitivity plots, and an automated 768-design optimizer.
* **O-06 (AWS Cloud Integration):** Leverage Amazon S3 for centralized artifact storage (raw datasets, processed splits, serialized joblib models) and Amazon SageMaker Notebook Instances for reproducible model development and training.

---

## 4. Project Scope

### In-Scope:
* Regression modeling for dual continuous targets: `Heating_Load` and `Cooling_Load`.
* Parametric envelope features: 12 building geometries, 4 orientations, 4 glazing area ratios, and 5 glazing distributions.
* Feature engineering: `Wall_Surface_Ratio` and `Glazing_x_Height`.
* Comprehensive evaluation: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Coefficient of Determination ($R^2$) across hold-out test data.
* Web-based Gradio application providing instantaneous inference, comparative bar charts, sensitivity plots, and automated design ranking.
* Cloud pipeline utilizing Amazon S3 storage and AWS SageMaker environments.

### Out-of-Scope:
* Hourly microclimate time-series telemetry (hourly weather station feeds).
* Real-time commercial utility billing integration or electric smart meter hardware telemetry.
* Non-residential mega-structures (skyscrapers, hospitals) outside the Tsanas & Xifara parametric bounds.

---

## 5. High-Level Technical Architecture

```
[ Raw Architectural Dataset (768 Samples) ]
                     │
                     ▼
       [ 1. Data Ingestion & Quality Audit ]
       (Zero nulls, zero duplicates, IQR checks)
                     │
                     ▼
       [ 2. Exploratory Data Analysis (EDA) ]
       (Distributions, heatmaps, multicollinearity analysis)
                     │
                     ▼
       [ 3. Preprocessing & Feature Engineering ]
       (Train/Test 80/20 split, Wall_Surface_Ratio, Glazing_x_Height,
        StandardScaler / OneHotEncoder ColumnTransformer)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
[ 4. Baseline Models ]   [ 5. Advanced Models & Tuning ]
- Linear Regression      - Gradient Boosting
- Decision Tree          - XGBoost (Default)
- Random Forest          - XGBoost (Tuned via RandomizedSearchCV)
         └───────────┬───────────┘
                     ▼
         [ 6. Evaluation & Selection ]
         (Best Model: Tuned XGBoost, Test R² > 0.994)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
[ 7. Gradio Simulator ]   [ 8. AWS Infrastructure ]
- Interactive UI (app.py) - Amazon S3 (Artifacts & Data)
- A-E Energy Rating       - SageMaker (Notebook Instance)
- Design Optimizer        - Reproducible Pipeline
```

---

## 6. Deliverables & Milestones

| Deliverable | Description | Owner | Target Date |
| :--- | :--- | :--- | :--- |
| **D1: Cleaned Data & EDA Outputs** | Quality report, distribution charts, correlation heatmap, feature vs. target plots | Manar Mahmoud Ahmed | Week 1 |
| **D2: Preprocessing Pipeline** | Modular `src/preprocessing.py`, `train.csv`, `test.csv`, serialized preprocessor `.joblib` | Ali Ahmed Ali Elmeleegy | Week 2 |
| **D3: Baseline Benchmark** | Evaluation of Linear Regression, Decision Tree, Random Forest with 5-fold CV | Ahmed Mohamed Sayed Shehata | Week 3 |
| **D4: Tuned XGBoost Model** | Hyperparameter-tuned XGBoost models (`xgb_heating_load.joblib`, `xgb_cooling_load.joblib`), feature importance analysis | Eman Abo Al Qassem Abo Al Hjajj Omar | Week 4 |
| **D5: Gradio Web Simulator** | Interactive simulator (`app.py`) with A-E rating, sensitivity explorer, and design optimizer | Ahmed AbdElrahman Ahmed | Week 5 |
| **D6: Final Technical Documentation** | Complete SRS, SAD, Literature Review, and Project Plan reports in Markdown & DOCX | All Team Members | Week 6 |
