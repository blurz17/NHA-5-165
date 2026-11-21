# Stage 3: Non-Functional Requirements Specification
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Overview

Non-Functional Requirements (NFRs) specify the quality attributes, performance benchmarks, security guidelines, and architectural constraints that the **Building Energy Efficiency Platform** must satisfy.

---

## 2. Non-Functional Requirements Breakdown

### NFR-01: Performance & Latency
* **NFR-01.1 (Inference Speed):** The model inference pipeline (`preprocessor.transform()` + `model.predict()`) shall execute in $< 50\text{ ms}$ per single-design query on standard modern CPU hardware.
* **NFR-01.2 (UI Interactivity):** In the Gradio simulator, dynamic UI updates (KPI cards, bar chart, and sensitivity plot generation) shall complete in $< 200\text{ ms}$ upon user input changes.
* **NFR-01.3 (Optimizer Execution):** The Design Optimizer evaluating all 768 candidate designs shall complete the batch prediction, filtering, and sorting in $< 500\text{ ms}$.

### NFR-02: Predictive Accuracy & Model Quality
* **NFR-02.1 (Heating Load Accuracy):** The final tuned model must achieve a Coefficient of Determination $R^2 \ge 0.995$ and Mean Absolute Error $\text{MAE} \le 0.35\text{ kWh/m}^2$ on the holdout test set.
* **NFR-02.2 (Cooling Load Accuracy):** The final tuned model must achieve $R^2 \ge 0.990$ and $\text{MAE} \le 0.50\text{ kWh/m}^2$ on the holdout test set.
* **NFR-02.3 (Generalization & Cross-Validation Stability):** The standard deviation of $R^2$ across 5-fold cross-validation folds on the training set must not exceed $\pm 0.015$, confirming model stability without fold-specific overfitting.

### NFR-03: Reliability, Robustness & Integrity
* **NFR-03.1 (Zero Data Leakage):** Preprocessing transformers (`StandardScaler`, `OneHotEncoder`) must strictly learn statistical parameters (mean, standard deviation, categorical encodings) from the training set only.
* **NFR-03.2 (Input Domain Validation):** The Gradio application shall prevent nonsensical or out-of-distribution inputs by locking continuous geometry variables to the 12 verified architectural shapes.
* **NFR-03.3 (Deterministic Reproducibility):** All training partitions and stochastic algorithms (Random Forest, XGBoost, RandomizedSearchCV) must fix pseudo-random seeds (`random_state=42`) to guarantee 100% reproducible results across runs.

### NFR-04: Portability & Maintainability
* **NFR-04.1 (Environment Portability):** The entire codebase shall run seamlessly on Windows, Linux, and macOS environments, as well as Amazon SageMaker Linux notebook instances.
* **NFR-04.2 (Pinned Dependencies):** All third-party library versions shall be explicitly pinned in `requirements.txt` to avoid binary deserialization mismatches with `joblib`.
* **NFR-04.3 (Code Modularity):** Preprocessing logic must reside in a dedicated, reusable Python module (`src/preprocessing.py`), allowing identical import in both notebooks and web applications (`from src.preprocessing import build_preprocessor`).

### NFR-05: Usability & User Experience
* **NFR-05.1 (Intuitive Visualization):** Energy ratings shall use industry-standard intuitive color coding (Green for Class A, Red for Class E).
* **NFR-05.2 (Responsive Web Design):** The Gradio simulator shall render correctly on standard desktop resolutions ($\ge 1280 \times 720$) and responsive tablet screens.
* **NFR-05.3 (Clear Documentation):** The repository shall include a comprehensive README.md detailing setup, usage, model results, team roles, and citation references.
