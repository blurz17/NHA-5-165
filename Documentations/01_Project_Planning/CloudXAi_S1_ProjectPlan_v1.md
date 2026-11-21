# Stage 1: Project Planning & Management
**ML Diploma Graduation Project | Deliverable Template v1.0**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Submission Date:** November 2026  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Project Summary

The **Building Energy Efficiency: Heating & Cooling Load Prediction** project is an applied machine learning initiative developed under the **DEPI – AWS Machine Learning Track**. 

In conventional architectural design, the thermal performance of a proposed building is evaluated only after detailed blueprints are finalized, often leading to excessive operational energy usage and costly retrofitting. Whole-building thermodynamic simulation software (such as EnergyPlus) is computationally intensive, requiring detailed 3D building modeling and hours of simulation runtime.

CloudXAi resolves this challenge by developing a machine learning surrogate system trained on 768 simulated residential building archetypes (the landmark **Tsanas & Xifara dataset** from the UCI Machine Learning Repository). The system accurately maps 8 architectural envelope parameters—including geometric compactness, wall and roof surface areas, overall height, building orientation, glazing area ratio, and glazing distribution—to continuous **Heating Load ($Y_1$)** and **Cooling Load ($Y_2$)** demands ($\text{kWh/m}^2$).

By delivering instant inference ($< 50\text{ ms}$) with outstanding accuracy ($R^2 > 0.99$), the system serves as an interactive simulator allowing architects and engineers to test design variations before construction. The platform includes a clean scikit-learn preprocessing and feature engineering pipeline, rigorous baseline and advanced ensemble models (Gradient Boosting and tuned XGBoost), an interactive **Gradio Simulator** (`app.py`), and integration with **AWS S3** and **Amazon SageMaker**.

---

## 2. Team and Roles

The project responsibilities are divided among the 5 team members according to the DEPI project milestones:

| Member Name | Project Role | Core Responsibilities |
| :--- | :--- | :--- |
| **Ahmed AbdElrahman Ahmed** | **Team Leader & Deployment Engineer** | • Overall project coordination, milestone scheduling, and GitHub repository management.<br>• Development of the interactive Gradio simulator (`app.py`) with A–E ratings and design optimizer.<br>• Integration with AWS S3 and SageMaker deployment workflows. |
| **Manar Mahmoud Ahmed** | **Data & EDA Specialist** | • Ingestion and data quality audit of the 768-sample dataset.<br>• Exploratory data analysis (distributions, boxplots, correlation matrices, feature vs. target plots).<br>• Identification of multicollinearity among geometry features and summary reporting. |
| **Ali Ahmed Ali Elmeleegy** | **Preprocessing & Feature Engineer** | • Design of leak-free 80/20 train/test split (`random_state=42`).<br>• Feature engineering: `Wall_Surface_Ratio` and `Glazing_x_Height`.<br>• Development and serialization of modular `src/preprocessing.py` and fitted preprocessor pipelines (`.joblib`). |
| **Ahmed Mohamed Sayed Shehata** | **Basic Modeling Engineer** | • Implementation and benchmarking of baseline regression models (Linear Regression, Decision Tree, Random Forest).<br>• Evaluation via 5-fold cross-validation and holdout metrics (MAE, RMSE, $R^2$).<br>• Baseline performance reporting and error analysis. |
| **Eman Abo Al Qassem Abo Al Hjajj Omar** | **Advanced Modeling Engineer** | • Implementation of advanced gradient-boosted ensembles (Gradient Boosting, XGBoost).<br>• Systematic hyperparameter tuning via `RandomizedSearchCV` with 5-fold CV.<br>• Feature importance analysis and model serialization (`xgb_heating_load.joblib`, `xgb_cooling_load.joblib`). |

---

## 3. Objectives and Success Criteria

Each project objective is mapped to specific, measurable Key Performance Indicators (KPIs):

| Objective ID | Objective Description | Target Metric / KPI | Threshold of Success |
| :--- | :--- | :--- | :--- |
| **O-01** | Data Quality & Integrity Validation | Completeness, Uniqueness, Outlier Verification | • 0 missing values, 0 duplicate rows across all 768 samples.<br>• Statistical distribution verification via IQR rule.<br>• Comprehensive EDA report generated with 7+ visualization artifacts. |
| **O-02** | Reusable Preprocessing Pipeline | Data Leakage Prevention & Modularity | • Preprocessor fitted strictly on training data (80% split).<br>• Feature transformers (`StandardScaler`, `OneHotEncoder`, `FunctionTransformer`) packaged in `src/preprocessing.py`.<br>• Serialized pipelines saved to `processed/`. |
| **O-03** | Baseline Model Benchmarking | Cross-Validated Performance (5-fold CV) | • Linear Regression $R^2 \ge 0.88$ (Cooling) and $\ge 0.92$ (Heating).<br>• Random Forest $R^2 \ge 0.96$ on both targets.<br>• Evaluation tables saved to `eda_outputs/basic_models_results.csv`. |
| **O-04** | Advanced Model Optimization | Holdout Test Set Accuracy & Tuning Gains | • Tuned XGBoost Heating Load $R^2 \ge 0.998$, $\text{MAE} \le 0.30\text{ kWh/m}^2$.<br>• Tuned XGBoost Cooling Load $R^2 \ge 0.994$, $\text{MAE} \le 0.45\text{ kWh/m}^2$.<br>• Measurable gain over baseline models (Cooling $R^2$ improvement from 0.960 to 0.994). |
| **O-05** | Interactive Simulator Deployment | Usability, Latency & Feature Completeness | • Real-time inference latency $< 100\text{ ms}$ on user input change.<br>• Full feature set: 12 building shapes, orientation/glazing selectors, A–E rating, sensitivity curves, and automated top-5 design optimizer. |
| **O-06** | AWS Cloud Artifact Management | Reproducibility & Cloud Storage | • Storage of raw data, processed splits, and trained models in Amazon S3.<br>• Execution of modeling notebooks within Amazon SageMaker Notebook Instances. |

---

## 4. Scope Boundaries

### In-Scope:
* Ingestion and validation of the 768 residential building designs from Tsanas & Xifara.
* Dual continuous target regression (`Heating_Load` and `Cooling_Load`).
* Feature engineering: `Wall_Surface_Ratio = Wall_Area / Surface_Area`, `Glazing_x_Height = Glazing_Area * Overall_Height`.
* Comparison of 5 model architectures: Linear Regression, Decision Tree, Random Forest, Gradient Boosting, and XGBoost.
* Hyperparameter optimization for XGBoost using `RandomizedSearchCV` across estimators, max_depth, learning_rate, and subsample.
* Gradio-based web application (`app.py`) for live prediction and optimization.
* Comprehensive technical documentation across all 4 DEPI stages in Markdown and DOCX.

### Out-of-Scope:
* Dynamic time-series weather feeds (hourly solar irradiance, wind pressure sensors).
* Operational meter readings from smart utility meters.
* Physics engine co-simulation (live EnergyPlus socket connections during inference).
* Commercial skyscraper architectures exceeding residential dimensional parameters.

---

## 5. Work Breakdown Structure (WBS)

```
1.0 Project Management & Planning
    1.1 Team formation, role definition, and repository setup
    1.2 Project proposal and scope sign-off
    1.3 Project schedule, WBS, and risk assessment

2.0 Data Ingestion & Exploratory Data Analysis (EDA)
    2.1 Raw dataset acquisition (UCI Energy Efficiency dataset)
    2.2 Data quality checks (nulls, duplicates, data types, IQR outliers)
    2.3 Univariate and bivariate analysis (histograms, boxplots, pairplots)
    2.4 Correlation analysis and multicollinearity detection
    2.5 Generation of EDA artifacts and summary documentation

3.0 Preprocessing & Feature Engineering
    3.1 Train/Test split strategy (80/20 with random_state=42)
    3.2 Domain-specific feature engineering (Wall_Surface_Ratio, Glazing_x_Height)
    3.3 Modular Scikit-Learn Pipeline construction (StandardScaler, OneHotEncoder)
    3.4 Serialization of processed datasets and transformer pipelines

4.0 Model Development, Benchmarking & Hyperparameter Tuning
    4.1 Baseline modeling: Linear Regression, Decision Tree, Random Forest
    4.2 5-fold cross-validation and holdout evaluation (MAE, RMSE, R²)
    4.3 Advanced modeling: Gradient Boosting and XGBoost
    4.4 Hyperparameter tuning with RandomizedSearchCV
    4.5 Feature importance evaluation and error residual analysis
    4.6 Final model serialization (joblib)

5.0 Deployment, Gradio Simulator & Cloud Integration
    5.1 Interactive Gradio web application (app.py) development
    5.2 Implementation of A–E energy efficiency classification and comparative charts
    5.3 Design Optimizer module (exhaustive search over 768 archetypes)
    5.4 Amazon S3 artifact storage and SageMaker notebook deployment
    5.5 Final documentation generation (Markdown and DOCX deliverables)
```

---

## 6. Schedule & Milestone Timeline

The project timeline spans 6 weeks, structured into sequential yet overlapping sprints:

| Week | Milestone / Focus Area | Primary Deliverables | Lead |
| :---: | :--- | :--- | :--- |
| **W1** | **Sprint 1: Planning & EDA** | Project Proposal, Stage 1 Plan, Data Quality Report, EDA Plots (01–07) | Manar / Ahmed A. |
| **W2** | **Sprint 2: Preprocessing Pipeline** | `src/preprocessing.py`, `train.csv`, `test.csv`, `preprocessor_*.joblib` | Ali |
| **W3** | **Sprint 3: Baseline Modeling** | Linear Regression, Decision Tree, Random Forest models, 5-fold CV report | Ahmed S. |
| **W4** | **Sprint 4: Advanced Models & Tuning** | Gradient Boosting, Tuned XGBoost (`xgb_*.joblib`), Feature Importance plot | Eman |
| **W5** | **Sprint 5: Simulator Development** | Gradio App (`app.py`), KPI cards, Glazing sensitivity, Design optimizer | Ahmed A. |
| **W6** | **Sprint 6: AWS & Final Reporting** | S3 bucket sync, SageMaker documentation, Final SRS, SAD, DOCX compilation | All Members |

---

## 7. Risk Management Register

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy |
| :---: | :--- | :---: | :---: | :--- |
| **R-01** | **Severe Multicollinearity:** `Surface_Area`, `Roof_Area`, `Relative_Compactness`, and `Overall_Height` are mathematically interdependent. | High | High | Acknowledge multicollinearity impact on Linear Regression; leverage tree-based ensembles (Random Forest, XGBoost) which naturally handle correlated regressors without matrix instability. |
| **R-02** | **Data Leakage in Feature Scaling:** Fitting transformers on the full dataset before splitting biases test metrics. | High | Low | Enforce strict isolation: split data into 80% train / 20% test before any transformation. Fit `ColumnTransformer` strictly on `X_train`. |
| **R-03** | **Overfitting on Small Dataset:** With 768 rows, complex models may memorize training samples. | Medium | Medium | Use 5-fold cross-validation during tuning; constrain `max_depth` (3–6) and apply tree subsampling and learning rate shrinkage in XGBoost. |
| **R-04** | **Inference Dependency Conflicts:** Serialization incompatibility between scikit-learn and XGBoost versions across environments. | Medium | Low | Pin exact dependency versions in `requirements.txt`; ensure same Python runtime (3.11/3.12) across local workstations and AWS SageMaker. |
| **R-05** | **Cloud Resource Cost / Latency:** Over-provisioning AWS SageMaker instances leading to unnecessary credit exhaustion. | Low | Low | Utilize lightweight `ml.t3.medium` instances for notebook editing; run training locally or on transient on-demand CPU instances. |
| **R-06** | **Discrepancy between Model Predictions and Physical Feasibility:** User selecting arbitrary incompatible geometry combinations. | Medium | Low | Pre-constrain the Gradio UI inputs to the 12 canonical building geometries verified in the dataset, auto-populating geometric dimensions when shape is selected. |

---

## 8. Definition of Done (DoD)

A milestone or feature is considered **Done** only when:
1. Code adheres to PEP 8 standards and is committed to the project Git repository.
2. The preprocessing pipeline runs deterministically without data leakage.
3. Model evaluation reports cross-validated and holdout test metrics ($R^2$, MAE, RMSE).
4. Serialized artifacts (`.joblib`, `.csv`) are versioned and loadable without errors.
5. The Gradio simulator executes locally via `python app.py` without throwing runtime exceptions.
6. Documentation is synchronized across both Markdown (`.md`) and Microsoft Word (`.docx`) formats.
