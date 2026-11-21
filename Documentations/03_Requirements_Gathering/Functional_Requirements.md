# Stage 3: Functional Requirements Specification
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Overview

This document specifies the complete functional capabilities of the **Building Energy Efficiency Platform**, organized across data handling, feature engineering, model training/inference, simulator interactivity, and cloud integration.

---

## 2. Functional Requirements Breakdown

### FR-01: Data Ingestion and Quality Verification
* **FR-01.1:** The system shall ingest the 768-record Tsanas & Xifara energy efficiency dataset from CSV format (`energy_efficiency_data.csv`).
* **FR-01.2:** The system shall perform automated null-value detection and verify that missing values equal 0 across all 10 columns.
* **FR-01.3:** The system shall perform duplicate row detection and confirm 0 duplicate records.
* **FR-01.4:** The system shall perform univariate statistical validation (min, max, mean, standard deviation, IQR outlier bounds) for all 8 features and 2 targets, saving a data quality report (`eda_outputs/data_quality_report.csv`).

### FR-02: Preprocessing and Feature Engineering
* **FR-02.1:** The system shall execute a stratified or random 80/20 train/test partition using a fixed seed (`random_state=42`), producing 614 training samples and 154 test samples.
* **FR-02.2:** The system shall compute two engineered features:
  - $\text{Wall\_Surface\_Ratio} = \frac{\text{Wall\_Area}}{\text{Surface\_Area}}$
  - $\text{Glazing\_x\_Height} = \text{Glazing\_Area} \times \text{Overall\_Height}$
* **FR-02.3:** The system shall provide two distinct preprocessor pipeline configurations in `src/preprocessing.py`:
  - `prep_tree`: Passthrough scaling, passthrough encoding, with feature engineering (for tree models).
  - `prep_linear`: `StandardScaler` for numeric columns, `OneHotEncoder` for categorical columns (`Orientation`, `Glazing_Area_Distribution`), with feature engineering.
* **FR-02.4:** The preprocessor pipelines must be fitted exclusively on training data (`X_train`) to strictly prevent data leakage, and serialized to `processed/preprocessor_tree.joblib` and `processed/preprocessor_linear.joblib`.

### FR-03: Model Training and Benchmarking
* **FR-03.1:** The system shall train and evaluate baseline regression models:
  - Ordinary Least Squares Linear Regression
  - Decision Tree Regressor (`max_depth=8`, `random_state=42`)
  - Random Forest Regressor (`n_estimators=300`, `random_state=42`)
* **FR-03.2:** The system shall evaluate baseline models using 5-fold cross-validation on the training set, computing mean and standard deviation of $R^2$, MAE, and RMSE.
* **FR-03.3:** The system shall train advanced ensemble models:
  - Gradient Boosting Regressor
  - XGBoost Regressor (default and tuned)
* **FR-03.4:** The system shall perform hyperparameter tuning for XGBoost using `RandomizedSearchCV` (5-fold CV) exploring tree depth (`max_depth`), learning rate (`learning_rate`), number of estimators (`n_estimators`), and subsample ratios.
* **FR-03.5:** The system shall serialize the final trained models to `models/xgb_heating_load.joblib` and `models/xgb_cooling_load.joblib`.
* **FR-03.6:** The system shall export feature importance attribution charts to `eda_outputs/09_feature_importance.png`.

### FR-04: Interactive Simulator Application (Gradio)
* **FR-04.1:** The system shall render a web-based user interface using Gradio (`app.py`), organized into four functional tabs: "🎛️ Simulator", "🎯 Design Optimizer", "📊 Model Performance", and "ℹ️ About".
* **FR-04.2:** In the Simulator tab, the system shall provide dropdown selection for the 12 verified building shapes, radio buttons for Orientation (2, 3, 4, 5), Glazing Area (0.0, 0.10, 0.25, 0.40), and Glazing Distribution (1–5).
* **FR-04.3:** Selecting a building shape shall automatically display the physical building geometry (Surface Area, Wall Area, Roof Area, Height).
* **FR-04.4:** The system shall display four KPI cards:
  - Heating Load ($\text{kWh/m}^2$) with percentage delta versus dataset average.
  - Cooling Load ($\text{kWh/m}^2$) with percentage delta versus dataset average.
  - Total Load ($\text{kWh/m}^2$) with absolute difference versus best possible design.
  - Energy Efficiency Rating (Letter grades A, B, C, D, E) color-coded based on total energy quintiles.
* **FR-04.5:** The system shall render a stacked bar chart comparing the current design against the dataset average and optimal design.
* **FR-04.6:** The system shall render a sensitivity line plot showing heating and cooling load trajectories as glazing area varies from 0.0 to 0.40.
* **FR-04.7:** In the Design Optimizer tab, the system shall evaluate all 768 building permutations and return the top 5 most energy-efficient designs based on user-selected optimization objective ("Total energy", "Heating only", "Cooling only") and envelope constraints (max glazing, height filter).

### FR-05: AWS Cloud Integration
* **FR-05.1:** The system shall support storing raw datasets, processed splits (`train.csv`, `test.csv`), and serialized models in Amazon S3 (`s3://<bucket>/energy-project/`).
* **FR-05.2:** The modeling notebooks and training pipeline shall be fully executable within an Amazon SageMaker Notebook Instance.
