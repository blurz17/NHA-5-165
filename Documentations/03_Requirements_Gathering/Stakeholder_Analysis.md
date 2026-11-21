# Stage 3: Stakeholder Analysis
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Executive Summary

Stakeholder analysis identifies the key individuals, professional user classes, and academic evaluators impacted by or possessing influence over the **Building Energy Efficiency Simulator**. By analyzing their operational requirements, pain points, and expectations, we ensure the system delivers immediate clinical and technical utility in sustainable architectural design workflows.

---

## 2. Stakeholder Power / Interest Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STAKEHOLDER POWER / INTEREST GRID               │
├───────────────────────────────────┬────────────────────────────────────┤
│ High Power / Low Interest (Keep   │ High Power / High Interest (Manage │
│ Satisfied):                       │ Closely):                          │
│ • SH-04: DEPI Academic & Industry │ • SH-01: Sustainable Architect /   │
│   Evaluator                       │   Building Designer                │
│                                   │ • SH-02: MEP / HVAC Energy         │
│                                   │   Consultant                       │
├───────────────────────────────────┼────────────────────────────────────┤
│ Low Power / Low Interest (Monitor)│ Low Power / High Interest (Keep    │
│ • Building Code Regulatory Bodies │ Informed):                         │
│ • General Public / Homeowners     │ • SH-03: Cloud & MLOps Engineer    │
│                                   │ • SH-05: Green Building Auditor    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 3. Detailed Stakeholder Profiles

### SH-01: Sustainable Architect & Building Designer
* **Description:** Architectural practitioners responsible for building massing, geometry, orientation, and window placement during preliminary project phases.
* **Core Objectives:**
  * Test different building shapes and glazing ratios early in the design cycle before engineering drawings are locked.
  * Receive immediate thermal load feedback (Heating & Cooling in $\text{kWh/m}^2$) without operating complex physics simulation software.
* **Key Pain Points:**
  * Whole-building simulation tools (EnergyPlus, OpenStudio) take hours to run and require complex CAD/IDF setups.
  * Disconnect between architectural aesthetics (large windows) and severe heating/cooling energy penalties.
* **System Requirement:** An intuitive web simulator with geometry presets, instant load calculation, and sensitivity charts.

### SH-02: MEP / HVAC Energy Consultant
* **Description:** Mechanical and HVAC engineers tasked with sizing heating and cooling systems and ensuring energy code compliance.
* **Core Objectives:**
  * Obtain high-fidelity baseline loads ($R^2 > 0.99$) to guide HVAC equipment capacity selection.
  * Explore envelope optimization combinations that minimize peak thermal demand.
* **Key Pain Points:**
  * Over-sizing HVAC equipment due to lack of early envelope thermal estimates, driving up capital costs.
  * Lack of transparent benchmark comparisons against dataset averages.
* **System Requirement:** Clear energy rating metrics (Grades A to E), dataset benchmark comparisons, and access to underlying model accuracy tables.

### SH-03: Cloud & MLOps Engineer
* **Description:** Technical engineers responsible for reproducible training, artifact storage, and model deployment on AWS.
* **Core Objectives:**
  * Ensure clean, leak-free preprocessing pipelines with versioned artifact serialization (`.joblib`).
  * Maintain efficient cloud storage on Amazon S3 and reproducible execution in SageMaker.
* **Key Pain Points:**
  * Incompatible Python package versions breaking model deserialization across local and cloud environments.
* **System Requirement:** Pinned dependencies (`requirements.txt`), modular `src/preprocessing.py`, and cloud sync scripts.

### SH-04: DEPI Academic & Industry Evaluator
* **Description:** Instructors and industry examiners evaluating the technical rigor, reproducibility, and business value of the graduation project.
* **Core Objectives:**
  * Verify that standard machine learning workflows are rigorously followed (EDA, preprocessing, cross-validation, hyperparameter tuning).
  * Validate that model evaluation is honest, leak-free, and supported by full documentation.
* **Key Pain Points:**
  * Over-complicated or fabricated project scopes that lack running code or tangible results.
* **System Requirement:** Clear code structure, runnable notebooks, verified test set metrics (MAE, RMSE, $R^2$), and comprehensive IEEE-format documentation.

### SH-05: Green Building Auditor & Rating Specialist
* **Description:** LEED and national green building certification professionals assessing building efficiency categories.
* **Core Objectives:**
  * Quickly benchmark a proposed design against standardized energy quintiles (Grades A to E).
  * Identify the top 5 most efficient designs across all parameter combinations.
* **System Requirement:** Automated design optimizer and benchmark comparison against dataset minimums.
