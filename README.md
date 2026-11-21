# 🏢 Building Energy Efficiency: Heating & Cooling Load Prediction

> Machine Learning project built during the **DEPI – AWS Machine Learning track**.
> Predict a building's heating and cooling energy load from its architectural design, *before* it is built.

<!-- Add a screenshot of the app here: ![App demo](assets/demo.png) -->

🔗 **Live demo:** _add your Hugging Face Space / Gradio link here_

---

## 📌 Problem Statement

Architects often discover that a building consumes too much energy for heating and cooling only **after** it has been designed and built. This project trains a machine learning model on 768 simulated building designs to learn the relationship between **building shape / glazing** and **energy load**.

An engineer can then try different designs on the model, acting as a simulator, and instantly see whether a design is energy-efficient, before anything is built.

**Problem type:** Supervised **Regression** (multi-output): the targets are continuous values (kWh/m²), not classes.

| Target | Description |
|---|---|
| `Heating_Load` (Y1) | Heating load of the building (kWh/m²) |
| `Cooling_Load` (Y2) | Cooling load of the building (kWh/m²) |

---

## 📊 Dataset

768 building designs (12 building shapes × orientations × glazing options), based on the public **Energy Efficiency dataset** (Tsanas & Xifara, UCI Machine Learning Repository).

| Feature | Description |
|---|---|
| `Relative_Compactness` | How compact the shape is |
| `Surface_Area` | Total surface area (m²) |
| `Wall_Area` | Wall area (m²) |
| `Roof_Area` | Roof area (m²) |
| `Overall_Height` | Building height (3.5 m or 7 m) |
| `Orientation` | Orientation (2–5) |
| `Glazing_Area` | Glazing ratio (0, 0.10, 0.25, 0.40) |
| `Glazing_Area_Distribution` | Distribution of glazing (0–5) |

**Data quality:** no missing values, no duplicate rows, no outliers (IQR rule).

---

## 🔍 Key EDA Findings

- `Surface_Area`, `Roof_Area`, `Relative_Compactness` and `Overall_Height` are **strongly correlated** with each other (multicollinearity). This matters for Linear Regression; tree-based models handle it well.
- `Overall_Height` and `Roof_Area` have the strongest relationship with both loads.
- `Orientation` and `Glazing_Area_Distribution` are categorical-like with very weak correlation to the targets.
- Heating and Cooling loads are highly correlated with each other.

---

## 🧱 Project Pipeline

```
Raw data ──► EDA ──► Preprocessing & Feature Engineering ──► Baseline models
                                                              │
                                   Advanced models + tuning ◄─┘
                                                              │
                                              Simulator app (Gradio)
```

1. **Data & EDA:** quality checks, distributions, correlations, feature-vs-target analysis.
2. **Preprocessing:** 80/20 train/test split (`random_state=42`), reusable scikit-learn pipeline (`src/preprocessing.py`) with scaling, one-hot encoding and engineered features (`Wall_Surface_Ratio`, `Glazing_x_Height`). The preprocessor is fitted on the training set only to avoid data leakage.
3. **Baseline models:** Linear Regression, Decision Tree, Random Forest, evaluated with MAE, RMSE, R² and 5-fold cross-validation.
4. **Advanced models:** Gradient Boosting and XGBoost, with hyperparameter tuning (`RandomizedSearchCV`, 5-fold CV on the training set only) and feature importance.
5. **Deployment:** an interactive simulator built with Gradio.

---

## 🏆 Results (hold-out test set)

| Model | Target | MAE | RMSE | R² |
|---|---|---|---|---|
| Decision Tree | Heating | 0.4071 | 0.5873 | 0.9967 |
| Decision Tree | Cooling | 1.3253 | 2.2609 | 0.9448 |
| Random Forest | Heating | 0.3446 | 0.4919 | 0.9977 |
| Random Forest | Cooling | 1.1659 | 1.9043 | 0.9609 |
| Gradient Boosting | Heating | 0.3890 | 0.5212 | 0.9974 |
| Gradient Boosting | Cooling | 1.0075 | 1.4619 | 0.9769 |
| XGBoost (default) | Heating | 0.2731 | 0.4226 | 0.9983 |
| XGBoost (default) | Cooling | 0.4962 | 1.0150 | 0.9889 |
| **XGBoost (tuned)** | **Heating** | **0.2757** | **0.4177** | **0.9983** |
| **XGBoost (tuned)** | **Cooling** | **0.4124** | **0.7319** | **0.9942** |

Linear Regression reached roughly 0.93 (Heating) and 0.89 (Cooling) cross-validated R², clearly lower than the tree-based models, which indicates a **non-linear** relationship between design and energy load. _(Add the exact Linear Regression test numbers from `eda_outputs/basic_models_results.csv`.)_

**Best model: tuned XGBoost.** The biggest gain from tuning was on Cooling (R² 0.961 → 0.994 compared with Random Forest).

### Feature importance

`Surface_Area`, `Roof_Area` and `Relative_Compactness` dominate the XGBoost importance. `Overall_Height` shows near-zero importance because it is almost fully determined by the other correlated geometry features, so importance here reflects what the model *used*, not necessarily what physically drives the load.

---

## 🖥️ Simulator App

The Gradio app lets you:

- pick a building shape, orientation and glazing options and get instant **Heating / Cooling / Total** predictions,
- see an **A–E efficiency rating** and a comparison against the dataset average and the best possible design,
- explore how **glazing area** changes the load,
- use the **Design Optimizer** to find the 5 most efficient designs across all 768 combinations.

Run it locally:

```bash
pip install -r requirements.txt
python app.py
```

---

## ☁️ AWS

_Fill in what your team actually used, for example:_

- **Amazon S3**: stores the raw data and the processed train/test sets (`s3://<bucket>/energy-project/`).
- **Amazon SageMaker Notebook Instance**: used to run the modeling notebooks.
- _(Optional)_ **SageMaker Training / Tuning Job** and **Endpoint** for the best model.

<!-- Add screenshots under assets/ and link them here -->

---

## 📁 Repository Structure

```
.
├── notebooks/            # EDA, preprocessing, modeling notebooks
├── src/
│   ├── __init__.py
│   └── preprocessing.py  # reusable preprocessing pipeline
├── processed/            # train.csv, test.csv, fitted preprocessors (.joblib)
├── models/               # trained models (.joblib)
├── eda_outputs/          # figures and result tables
├── app.py                # Gradio simulator
├── requirements.txt
└── README.md
```

---

## 🚀 How to Reproduce

```bash
git clone <repo-url>
cd <repo-name>
pip install -r requirements.txt
```

Then run the notebooks in `notebooks/` in order (EDA → preprocessing → modeling → tuning). To reuse the preprocessing pipeline:

```python
from src.preprocessing import build_preprocessor, FEATURES, TARGETS

prep_tree = build_preprocessor(scale=False, onehot=False)   # for tree-based models
prep_linear = build_preprocessor(scale=True, onehot=True)   # for linear models / NN
```

> **Note:** the saved `.joblib` files depend on the scikit-learn / XGBoost versions listed in `requirements.txt`. Use the same versions to load them.

---

## 👥 Team

| Member | Role |
|---|---|
| Ahmed AbdElrahman Ahmed (Team Leader) | Deployment, simulator & GitHub repository |
| Manar Mahmoud Ahmed | Data & EDA |
| Ali Ahmed Ali Elmeleegy | Preprocessing & Feature Engineering |
| Ahmed Mohamed Sayed Shehata | Basic Modeling |
| Eman Abo Al Qassem Abo Al Hjajj Omar | Advanced Models & Hyperparameter Tuning |

---

## 🛠️ Tech Stack

Python · pandas · NumPy · scikit-learn · XGBoost · matplotlib · seaborn · Gradio · AWS (S3, SageMaker) · Git/GitHub

---

## 📚 Reference

A. Tsanas, A. Xifara: *Accurate quantitative estimation of energy performance of residential buildings using statistical machine learning tools*, Energy and Buildings, 49, 560–567, 2012.
