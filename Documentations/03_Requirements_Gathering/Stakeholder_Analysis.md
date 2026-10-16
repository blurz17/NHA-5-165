# Stage 3: Stakeholder Analysis
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. Executive Summary

Stakeholder analysis identifies the key individuals, groups, and organizations impacted by or possessing influence over the **CloudXAi** platform. By categorizing their needs, pain points, expectations, and operational constraints, the system ensures high user adoption, clear functional alignment, and academic/industry compliance.

---

## 2. Identified Stakeholders

We have categorized five core stakeholder profiles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STAKEHOLDER POWER / INTEREST GRID               │
├───────────────────────────────────┬────────────────────────────────────┤
│ High Power / Low Interest (Keep   │ High Power / High Interest (Manage │
│ Satisfied):                       │ Closely):                          │
│ • SH-05: DEPI Academic & Industry │ • SH-01: Sustainable Architect     │
│   Evaluator                       │ • SH-02: MEP / HVAC Energy         │
│                                   │   Consultant                       │
├───────────────────────────────────┼────────────────────────────────────┤
│ Low Power / Low Interest (Monitor)│ Low Power / High Interest (Keep    │
│ • Commercial Building Occupants   │ Informed):                         │
│ • Utility Grid Providers          │ • SH-03: Facility Operations       │
│                                   │   Manager                          │
│                                   │ • SH-04: Cloud & MLOps Engineer    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 3. Detailed Stakeholder Profiles

### SH-01: Sustainable Building Architect (Lead Designer)
* **Description:** Architectural practitioners responsible for initial spatial, geometric, and envelope conceptualization (massing, orientation, window placement, surface materials).
* **Key Goals:**
  * Rapidly assess energy implications during preliminary design workshops without waiting days for external engineering reports.
  * Understand the trade-off between natural daylighting (glazing ratio) and thermal heating/cooling loads.
* **Pain Points:**
  * Complex physics simulation tools (like EnergyPlus) disrupt creative workflows due to difficult IDF input formats and long execution times.
  * Lack of intuitive "What-If" sliders to see dynamic energy feedback when modifying envelope parameters.
* **Success Metric:** Sub-second surrogate model feedback for design adjustments.

### SH-02: MEP & Building Energy Consultant
* **Description:** Mechanical, Electrical, and Plumbing engineers charged with sizing HVAC equipment and verifying compliance with energy conservation codes (e.g., ASHRAE 90.1, LEED, local building codes).
* **Key Goals:**
  * Obtain rigorous, statistically reliable thermal load estimates ($R^2 \ge 0.95$, error margin $< 1.5\text{ kWh/m}^2$).
  * Receive explainable justifications for design modifications to present to building owners and code officials.
* **Pain Points:**
  * Machine learning models are often "black boxes" that cannot be justified to regulatory boards or clients.
  * Misleading claims in data science projects that equate thermal load estimates with utility electricity bills.
* **Success Metric:** Transparent SHAP feature attribution charts and adherence to ASHRAE Guideline 14 standards.

### SH-03: Facility & Building Operations Manager
* **Description:** Operational personnel responsible for managing commercial HVAC schedules, monitoring smart meter electricity telemetry, and controlling utility operational expenses (OpEx).
* **Key Goals:**
  * Accurately forecast hourly energy consumption 24–168 hours in advance using weather forecasts to optimize peak-shaving strategies.
  * Identify unexplained deviations between predicted baseline energy and actual metered consumption.
* **Pain Points:**
  * Unpredictable weather shifts lead to expensive utility peak-demand surcharges.
  * Difficulty analyzing multi-year time-series smart meter datasets without complex data engineering setups.
* **Success Metric:** Operational forecast accuracy with hourly $\text{CV(RMSE)} \le 15\%$.

### SH-04: Cloud & MLOps Platform Engineer
* **Description:** Software and data engineers responsible for maintaining data pipelines, model registries, containerized deployments, and cost efficiency across local and cloud environments.
* **Key Goals:**
  * Ensure the system runs cleanly on local workstations without mandatory cloud bills, while maintaining ready deployability to AWS.
  * Automate data ingestion, schema validation, experiment tracking, and unit test coverage.
* **Pain Points:**
  * Cloud vendor lock-in preventing offline demonstrations or local unit testing.
  * Undocumented data schema drifts or silent pipeline failures.
* **Success Metric:** Seamless Dual-Mode execution (DuckDB/Local Parquet vs. AWS S3/Glue/Athena) with $\ge 85\%$ test coverage.

### SH-05: Academic & Industry Evaluator (DEPI Reviewer)
* **Description:** Technical mentors, academic professors, and industry leaders evaluating the graduation project against official DEPI grading rubrics.
* **Key Goals:**
  * Verify end-to-end engineering excellence across Data Engineering, Machine Learning, Cloud Architecture, and Software Best Practices.
  * Ensure comprehensive documentation, rigorous methodology, and complete traceability.
* **Pain Points:**
  * Superficial projects that only run a simple CSV through XGBoost without data lake architecture, validation, or physics-grounded validation.
* **Success Metric:** 100% compliance with DEPI deliverable guidelines and professional code quality.

---

## 4. Stakeholder Matrix Summary

| Stakeholder ID | Role | Power | Interest | Primary Deliverable Needed | Engagement Cadence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SH-01** | Sustainable Architect | High | High | Interactive What-If Sandbox & 3D Pareto Explorer | Weekly design reviews |
| **SH-02** | MEP Energy Consultant | High | High | SHAP XAI Diagnostics & Thermal Load Benchmarks | Bi-weekly engineering audits |
| **SH-03** | Facility Operations Manager | Medium | High | Weather-Aware Hourly Energy Forecasting Module | Milestone demonstrations |
| **SH-04** | Cloud & MLOps Engineer | Medium | High | Dual-Mode Data Lake, FastAPI, Docker, and CI/CD | Daily development commits |
| **SH-05** | DEPI Academic Evaluator | High | High | Formal Deliverable Reports (S1–S4), Tests, and Slides | Scheduled DEPI gate reviews |
