# Stage 3: User Stories and Use Cases
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. User Stories

User stories follow the agile standard format:  
*“As a [Role], I want to [Capability], so that [Business Benefit].”*

| Story ID | Stakeholder Role | User Story Statement | Acceptance Criteria | Priority |
| :---: | :--- | :--- | :--- | :---: |
| **US-01** | Sustainable Architect | As an architect, I want to select a building shape preset and orientation so that I can immediately see the predicted heating and cooling loads without running a 3D simulation. | The simulator updates Heating, Cooling, and Total loads within $< 100\text{ ms}$ of input adjustment. | High (Must Have) |
| **US-02** | Sustainable Architect | As an architect, I want to see an Energy Efficiency letter grade (A–E) for my building design so that I know how it ranks compared to standard residential archetypes. | Display clear letter grade (A–E) with color indicators based on total energy quintiles. | High (Must Have) |
| **US-03** | HVAC Consultant | As an energy consultant, I want to see a side-by-side bar chart comparing my design against the dataset average and best possible design so that I can evaluate energy savings potential. | Responsive bar chart dynamically displaying Heating and Cooling breakdown for user design, average, and optimal. | High (Must Have) |
| **US-04** | Building Designer | As a designer, I want to inspect a sensitivity curve showing how varying glazing area (0% to 40%) affects loads so that I can make informed window sizing decisions. | Interactive plot showing Heating and Cooling curves across all 4 glazing ratios for the selected shape. | Medium (Should Have) |
| **US-05** | Energy Auditor | As an auditor, I want to run the Design Optimizer to find the 5 most energy-efficient designs given maximum glazing and height constraints so that I can recommend optimal configurations. | A filterable table displaying the top 5 designs sorted by minimal total, heating, or cooling load. | High (Must Have) |
| **US-06** | MLOps Engineer | As an ML engineer, I want to load a modular, leak-free preprocessing pipeline from `src/preprocessing.py` so that data transformations are identical during training and deployment. | Preprocessor handles both raw features and engineered features (`Wall_Surface_Ratio`, `Glazing_x_Height`) deterministically. | High (Must Have) |
| **US-07** | Academic Evaluator | As an evaluator, I want to inspect model benchmarking tables and holdout test set metrics so that I can verify the predictive superiority of tuned XGBoost. | Tables displaying MAE, RMSE, and $R^2$ across all baseline and advanced models saved in `eda_outputs/` and documented in README. | High (Must Have) |

---

## 2. Core Use Cases

### Use Case UC-01: Interactive Building Load Simulation
* **Primary Actor:** Architect / Building Designer
* **Preconditions:** The Gradio application is launched (`python app.py`) and models are loaded into memory.
* **Main Success Scenario:**
  1. User selects a canonical building shape from the dropdown (e.g., Shape 5 · compactness 0.76 · Tall 7 m).
  2. The system auto-populates geometric dimensions: Surface Area, Wall Area, Roof Area, and Height.
  3. User selects Orientation (North: 2, East: 3, South: 4, West: 5).
  4. User adjusts Glazing Area ratio (0.0, 0.10, 0.25, 0.40) and Glazing Distribution.
  5. User clicks "Predict energy load" (or allows auto-trigger).
  6. The system executes feature engineering, runs `preprocessor_tree.transform()`, and computes `xgb_heating_load.predict()` and `xgb_cooling_load.predict()`.
  7. The UI displays 4 KPI cards: Heating Load, Cooling Load, Total Load, and Efficiency Grade (A–E).
  8. The UI updates the comparison bar chart and glazing sensitivity plot.
* **Postconditions:** User reviews thermal metrics and adjusts parameters iteratively.

---

### Use Case UC-02: Automated Envelope Design Optimization
* **Primary Actor:** Energy Consultant / Auditor
* **Preconditions:** The 768 pre-computed building permutations are indexed in memory.
* **Main Success Scenario:**
  1. User navigates to the "🎯 Design Optimizer" tab.
  2. User selects optimization target: "Total energy", "Heating only", or "Cooling only".
  3. User sets maximum allowed glazing area (e.g., 0.25) and building height filter ("Any", "3.5", "7.0").
  4. User clicks "Find best designs".
  5. The system filters candidate configurations and sorts by the selected objective.
  6. A structured data table displays the top 5 candidate designs with full geometric specifications and predicted loads.
* **Postconditions:** Consultant exports or records optimal design parameters for engineering blueprints.

---

### Use Case UC-03: Model Training, Cross-Validation & Artifact Export
* **Primary Actor:** Machine Learning Engineer
* **Preconditions:** Raw `energy_efficiency_data.csv` is available in `data/` or root directory.
* **Main Success Scenario:**
  1. Engineer runs the preprocessing script or notebook partition.
  2. Dataset is split into 80% train and 20% test using `random_state=42`.
  3. Preprocessing pipelines (`prep_tree`, `prep_linear`) are fitted strictly on `X_train` and saved to `processed/`.
  4. Baseline models (Linear Regression, Decision Tree, Random Forest) are trained and evaluated with 5-fold CV.
  5. Advanced models (Gradient Boosting, XGBoost) undergo randomized hyperparameter search.
  6. Best models are serialized to `models/xgb_heating_load.joblib` and `models/xgb_cooling_load.joblib`.
  7. Performance tables and feature importance charts are written to `eda_outputs/`.
* **Postconditions:** Deployment artifacts are fully synchronized and ready for inference serving.
