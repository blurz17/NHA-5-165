# End-to-End Methodology

## 1. Problem Formulation & Architecture
Building heating and cooling loads are non-linear thermodynamic phenomena influenced by geometric form, exterior surface envelope, and solar gain. This project designs a modular, production-ready machine learning system that maps early-stage architectural parameters directly to annual heating and cooling load demands.

```
+------------------+      +-------------------+      +----------------------+
|  Raw Data Ingest | ---> | Modular Pipeline  | ---> | Multi-Model Registry |
|  768 Samples     |      | Preprocessing & FE|      | 10 Trained Models    |
+------------------+      +-------------------+      +----------------------+
                                                                |
                                                                v
                                                     +----------------------+
                                                     | FastAPI (Heroku)     |
                                                     | React Vite (Vercel)  |
                                                     +----------------------+
```

---

## 2. Data Partitioning & Leakage Prevention
To ensure robust, unbiased generalization:
- **Partition Ratio:** 80% Training set (614 samples), 20% Held-Out Testing set (154 samples).
- **Stratification & Reproducibility:** Fixed random seed `42`.
- **Leakage Prevention:** Preprocessing statistics (means, standard deviations, categorical encoders) are fit strictly on `X_train` and then applied to `X_test` via scikit-learn `Pipeline`.

---

## 3. Preprocessing & Feature Engineering
Two parallel pipelines are maintained for model compatibility:
1. **Linear Pipeline (`prep_linear`):**
   - Engineered interaction terms (`Wall_Surface_Ratio`, `Glazing_x_Height`).
   - `StandardScaler` applied to all continuous numerical features.
   - `OneHotEncoder(handle_unknown='ignore', sparse_output=False)` applied to discrete categorical columns (`Orientation`, `Glazing_Area_Distribution`).
2. **Tree Pipeline (`prep_tree`):**
   - Engineered interaction terms.
   - Passthrough scaling and encoding to preserve natural tree partitioning boundaries.

---

## 4. Modeling Strategy & All 10 Models
We train and evaluate 5 algorithms across both thermal targets (totaling 10 models):

1. **Linear Regression:** Baseline parametric reference model.
2. **Decision Tree Regressor:** Non-linear single-tree baseline (`max_depth=8`).
3. **Random Forest Regressor:** Bagging ensemble of 300 estimators reducing variance.
4. **Gradient Boosting Regressor:** Sequential boosting optimizing residual errors.
5. **XGBoost (Tuned):** Gradient boosted trees optimized via 5-fold `RandomizedSearchCV` over learning rates, depths, subsamples, and column ratios.

---

## 5. Production Packaging
All 10 models, along with both fitted preprocessing pipelines and complete evaluation metadata, are packaged into a single serialized bundle:
- **Location:** `artifacts/production/model_bundle.joblib`
- **Candidate Models:** Saved independently in `artifacts/candidates/` for auditability and individual model serving.
