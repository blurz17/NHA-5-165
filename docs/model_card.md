# Model Card: Energy Efficiency Thermal Load Predictors

## Model Summary
- **Model Name:** Building Energy Efficiency Multi-Model Suite
- **Version:** 2.0.0
- **Model Type:** Supervised Regression (10 models: Linear Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost across 2 targets)
- **Primary Use:** Rapid architectural decision support, building performance simulation surrogate, HVAC sizing preliminary estimates.
- **Developers:** DEPI Graduation Project Team CloudXAi (NHA-5-165).

---

## Benchmark Performance (Independent 20% Test Set)

| Algorithm | Target Variable | MAE ($\text{kWh/m}^2$) | RMSE ($\text{kWh/m}^2$) | $R^2$ Score | 5-Fold CV Mean $R^2$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | Heating Load | 1.8728 | 2.8002 | 0.9248 | 0.9275 |
| **Linear Regression** | Cooling Load | 2.1165 | 3.0471 | 0.8998 | 0.8890 |
| **Decision Tree** | Heating Load | 0.4071 | 0.5873 | 0.9967 | 0.9970 |
| **Decision Tree** | Cooling Load | 1.3253 | 2.2609 | 0.9448 | 0.9595 |
| **Random Forest** | Heating Load | 0.3446 | 0.4919 | 0.9977 | 0.9974 |
| **Random Forest** | Cooling Load | 1.1659 | 1.9043 | 0.9609 | 0.9686 |
| **Gradient Boosting** | Heating Load | 0.3600 | 0.5100 | 0.9974 | 0.9970 |
| **Gradient Boosting** | Cooling Load | 1.0500 | 1.7300 | 0.9769 | 0.9740 |
| **XGBoost (Tuned)** | Heating Load | **0.2800** | **0.4100** | **0.9983** | **0.9981** |
| **XGBoost (Tuned)** | Cooling Load | **0.6500** | **1.0200** | **0.9942** | **0.9935** |

---

## Feature Importance (XGBoost Insights)
1. **Overall Height ($X_5$):** ~50% importance weight; dominates thermal envelope volume and air stratification.
2. **Roof Area ($X_4$):** Highly influential on heat dissipation.
3. **Glazing $\times$ Height:** Captures solar radiation gain scaled across building height.
4. **Orientation ($X_6$):** Modest direct effect on total annual loads, but shifts peak load timing across diurnal cycles.
