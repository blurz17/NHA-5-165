# Stage 2: Literature Review
**ML Diploma Graduation Project | Deliverable Template v1.0**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Submission Date:** November 2026  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Research Questions

This literature review investigates foundational research questions (RQs) that define the scientific methodology, algorithmic choices, and domain significance of the **Building Energy Efficiency** project:

* **RQ1 (Thermodynamic Non-Linearity vs. Linear Regression):** Why do linear regression models struggle to accurately predict heating and cooling loads in residential structures, and how do tree-based ensemble methods effectively model the non-linear thermodynamic interactions between building geometry and envelope components?
* **RQ2 (Multicollinearity in Architectural Features):** How does geometric coupling (e.g., strong collinearity among `Surface_Area`, `Roof_Area`, `Relative_Compactness`, and `Overall_Height`) affect model stability, parameter interpretability, and generalization across regression architectures?
* **RQ3 (Comparative Model Performance):** Which machine learning algorithm family—linear models, single decision trees, bagging (Random Forest), or boosting (Gradient Boosting, XGBoost)—achieves the optimal balance between predictive accuracy ($R^2$, MAE, RMSE) and computational efficiency when trained on simulated building envelope datasets?
* **RQ4 (Feature Importance and Physical Attribution):** Which architectural design parameters physically and statistically drive heating load versus cooling load, and does feature importance extracted from tree ensembles align with first-principles building thermodynamics?
* **RQ5 (Surrogate Modeling for Architectural Decision Support):** How can validated ML models be packaged into interactive simulation tools to enable rapid design exploration and energy optimization during early-stage architectural workflows?

---

## 2. Search Method & Literature Corpus

A systematic literature review was conducted across prominent academic databases including **ScienceDirect (Elsevier)**, **IEEE Xplore**, **SpringerLink**, and **Google Scholar**, focusing on peer-reviewed journals in the fields of building simulation and applied machine learning:
* *Energy and Buildings*
* *Applied Energy*
* *Building and Environment*
* *Renewable and Sustainable Energy Reviews*
* *Journal of Building Engineering*

### Search Queries Executed:
1. `("building energy efficiency" OR "heating load" OR "cooling load") AND ("machine learning" OR "XGBoost" OR "Random Forest") AND ("Tsanas")`
2. `("architectural design" OR "building envelope") AND ("surrogate model" OR "energy simulator") AND ("regression")`
3. `("relative compactness" OR "glazing area" OR "roof area") AND ("thermal load prediction")`

### Key Inclusion Criteria:
* Studies using the benchmark 768-sample Tsanas & Xifara dataset or equivalent simulated residential building archetypes.
* Papers providing clear comparative evaluations with standard metrics ($R^2$, MAE, RMSE).
* Research addressing feature engineering, hyperparameter tuning, and model interpretability in building thermal performance.

---

## 3. Related Work & Theoretical Foundations

### 3.1 The Seminal Tsanas & Xifara Study (2012)
The foundation of modern statistical machine learning in residential building thermal load prediction was established by **Athanasios Tsanas and Angeliki Xifara (2012)** in their landmark paper:
> *Tsanas, A., & Xifara, A. (2012). Accurate quantitative estimation of energy performance of residential buildings using statistical machine learning tools. Energy and Buildings, 49, 560–567.*

Tsanas and Xifara simulated 768 building designs using the industry-standard **EnergyPlus** simulation engine. The buildings comprised 12 distinct building forms, each simulated across:
* 4 orientations (North, East, South, West)
* 4 glazing area ratios (0%, 10%, 25%, 40% of floor area)
* 5 glazing area distributions (uniform, north, south, east, west)

The authors evaluated classical Ordinary Least Squares (OLS) linear regression and Random Forest ensembles. Their findings confirmed that building geometry and glazing parameters have a pronounced non-linear relationship with thermal loads, where Random Forests substantially outperformed linear baselines ($R^2 > 0.97$ vs $R^2 \approx 0.89$ for cooling).

### 3.2 Thermodynamics of Building Heating and Cooling Loads
Building thermal loads are defined by the rate of thermal energy that must be supplied to (heating) or removed from (cooling) a conditioned space to maintain indoor thermal comfort:
* **Conduction Heat Transfer ($Q_{\text{cond}}$):** Governed by Fourier's law:
  $$Q_{\text{cond}} = U \cdot A \cdot \Delta T$$
  where $U$ is the overall thermal transmittance, $A$ is the envelope surface area (`Wall_Area`, `Roof_Area`), and $\Delta T$ is the indoor-outdoor temperature gradient.
* **Solar Radiation Gain ($Q_{\text{solar}}$):** Heat entering via windows:
  $$Q_{\text{solar}} = A_{\text{glazing}} \cdot \text{SHGC} \cdot I_{\text{solar}}$$
  proportional to `Glazing_Area` and modulated by `Orientation` and `Glazing_Area_Distribution`.
* **Compactness Ratio:** Defined by the surface-to-volume ratio ($S/V$). Buildings with high `Relative_Compactness` minimize exposed envelope area per unit volume, dramatically lowering conduction losses and heating loads.

### 3.3 Comparative Analysis of Regression Architectures

| Algorithm | Paradigm | Strengths in Building Energy | Limitations in Building Energy |
| :--- | :--- | :--- | :--- |
| **Linear Regression** | Parametric Linear | Fast training, high interpretability of coefficients | Fails to capture non-linear heat transfer interactions; vulnerable to extreme multicollinearity |
| **Decision Tree (CART)** | Non-parametric Hierarchical | Captures non-linear thresholds and step changes | High variance, prone to overfitting, produces discontinuous predictions |
| **Random Forest** | Bagging Ensemble | Reduces variance via bootstrap aggregation; robust to outliers and collinearity | Computationally heavier; can struggle to extrapolate beyond training bounds |
| **Gradient Boosting** | Sequential Boosting | Optimizes residual errors sequentially with gradient descent; high precision | Sensitive to learning rate and tree depth; prone to overfitting without regularization |
| **XGBoost** | Regularized Gradient Boosting | Second-order Taylor expansion, $L_1$/$L_2$ leaf regularization, optimal tree splits | Requires careful hyperparameter tuning (`max_depth`, `learning_rate`, `subsample`) |

### 3.4 Multicollinearity and Feature Dependencies
A central challenge in building geometry analysis is the mathematical inter-dependence of shape variables:
* Surface area is directly derived from dimensions:
  $$\text{Surface\_Area} = 2 \cdot \text{Roof\_Area} + \text{Wall\_Area}$$
* In the Tsanas dataset, residential buildings with identical height ($3.5\text{ m}$ vs $7.0\text{ m}$) have deterministic relationships between height, compactness, and roof surface.
* Literature (Tsanas 2012; Castelli et al. 2015) notes that while multicollinearity introduces variance inflation and coefficient instability in Linear Regression, tree-based ensemble algorithms select features greedily at each split, remaining mathematically stable.

---

## 4. Synthesis of Published Results vs. Project Findings

A comprehensive review of literature benchmarking the 768-sample dataset demonstrates consistent model ranking:

| Study | Model Architecture | Heating Load $R^2$ | Cooling Load $R^2$ | Heating MAE | Cooling MAE |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Tsanas & Xifara (2012)** | Classical OLS | 0.916 | 0.887 | 2.14 | 2.21 |
| **Tsanas & Xifara (2012)** | Random Forest | 0.998 | 0.963 | 0.51 | 1.42 |
| **Castelli et al. (2015)** | Genetic Programming / SVR | 0.995 | 0.960 | 0.48 | 1.35 |
| **Chou & Bui (2014)** | Ensembled SVR + ANN | 0.996 | 0.970 | 0.42 | 1.10 |
| **CloudXAi (Our Project)** | **XGBoost (Tuned)** | **0.9983** | **0.9942** | **0.2757** | **0.4124** |

### Critical Takeaways:
1. **Cooling Load is Inherently Harder to Predict than Heating Load:** Across all published literature, cooling load exhibits lower $R^2$ and higher MAE. This occurs because cooling is heavily influenced by internal heat gains and subtle solar radiation interactions through windows, whereas heating is primarily driven by bulk conduction through exterior walls and roof.
2. **Hyperparameter Tuning Closes the Cooling Gap:** Our tuned XGBoost model achieves an exceptional $R^2 = 0.9942$ and $\text{MAE} = 0.4124$ on Cooling Load, representing a major improvement over standard Random Forest ($R^2 = 0.9609, \text{MAE} = 1.1659$).
3. **Feature Importance Consensus:** In both literature and our project findings, `Surface_Area`, `Roof_Area`, and `Relative_Compactness` dominate feature importance. `Overall_Height` shows minimal direct split importance in tuned XGBoost because height information is already completely encoded by the roof and surface area combinations.

---

## 5. Identified Research Gaps & Project Contribution

While previous academic research thoroughly proved the predictive superiority of machine learning on this dataset, three significant implementation gaps remained:

1. **Lack of Reusable, Leak-Free Pipelines:** Many published implementations fit scaling transformers over the full 768 rows before cross-validation, introducing subtle data leakage. Our project introduces a strictly isolated scikit-learn pipeline (`src/preprocessing.py`) fitted exclusively on the 80% training partition.
2. **Absence of Domain Feature Engineering:** Prior works frequently fed raw columns directly without examining physical interaction terms. We engineered two domain features:
   - $\text{Wall\_Surface\_Ratio} = \frac{\text{Wall\_Area}}{\text{Surface\_Area}}$
   - $\text{Glazing\_x\_Height} = \text{Glazing\_Area} \times \text{Overall\_Height}$
3. **The "Academic Code" Usability Gap:** Most studies end with table metrics in a Jupyter notebook without creating a practical tool for designers. Our project delivers an interactive web-based simulator (`app.py` in Gradio) featuring energy efficiency letter grading (A–E), real-time parametric sensitivity plots, and an automated combinatorial optimizer evaluating all 768 building permutations in milliseconds.
