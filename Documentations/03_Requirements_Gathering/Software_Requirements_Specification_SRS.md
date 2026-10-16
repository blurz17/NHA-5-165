# Software Requirements Specification (SRS)
**Standard:** IEEE Std 830-1998 Format  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Submission Date:** October 2026  
**Document Version:** 1.0  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document details the complete functional and non-functional requirements for the **CloudXAi** platform. It provides the authoritative engineering specification for developers, machine learning engineers, quality assurance testers, and academic evaluators within the Digital Egypt Pioneers Initiative (DEPI).

### 1.2 Scope of the System
**CloudXAi** is a data-driven, machine-learning-powered decision support platform that evaluates architectural designs, forecasts operational time-series building energy consumption, explains physical drivers through XAI, and discovers constrained multi-objective Pareto-optimal design configurations. The platform operates under a **Dual-Mode Architecture** running both locally on developer workstations (DuckDB + Parquet Lakehouse + FastAPI + Streamlit) and in the AWS Cloud (S3 + Glue + Athena + SageMaker/ECS).

### 1.3 Definitions, Acronyms, and Abbreviations
* **BEM:** Building Energy Modeling
* **DoD:** Definition of Done
* **DOE:** United States Department of Energy
* **Dual-Mode:** Architecture capable of running either locally with zero cloud dependencies or fully on AWS Cloud.
* **HDD / CDD:** Heating Degree Days / Cooling Degree Days
* **IDF:** Input Data File (EnergyPlus simulation model format)
* **KPI:** Key Performance Indicator
* **NSGA-II:** Non-dominated Sorting Genetic Algorithm II
* **NMBE:** Normalized Mean Bias Error (ASHRAE Guideline 14 metric)
* **CV(RMSE):** Coefficient of Variation of the Root Mean Square Error
* **RTM:** Requirements Traceability Matrix
* **SHAP:** SHapley Additive exPlanations
* **WWR:** Window-to-Wall Ratio (envelope glazing percentage)

---

## 2. Overall Description

### 2.1 Product Perspective & Context
CloudXAi serves as a bridge between early-stage architectural drafting (CAD/BIM) and slow, detailed physics-based thermodynamic simulation (EnergyPlus). It is not a replacement for legal engineering certifications; rather, it is an exploratory sandbox that allows architects and energy consultants to evaluate thousands of candidate configurations in seconds and optimize designs before construction.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLOUDXAI SYSTEM CONTEXT                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ↓                               ↓                               ↓
[Architectural Design]    [Smart Meter Telemetry]         [Weather Data]
• Relative Compactness    • Electricity (kWh)             • Temperature
• Glazing Ratio (WWR)     • Chilled Water                 • Solar Radiation
• Orientation & Surface   • Steam / Hot Water             • Humidity & Wind
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │     DUAL-MODE DATA LAKEHOUSE         │
                 │  • Local: Parquet + DuckDB           │
                 │  • Cloud: AWS S3 + Glue + Athena     │
                 └──────────────────┬───────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │       ANALYTICS & ML ENGINES         │
                 │  • ML Surrogate (Thermal Loads)      │
                 │  • Time-Series Operational Forecaster│
                 │  • NSGA-II Multi-Objective Optimizer │
                 │  • SHAP TreeExplainer Diagnostic     │
                 └──────────────────┬───────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │          PRESENTATION TIER           │
                 │  • FastAPI REST Endpoints            │
                 │  • Interactive Streamlit Dashboard   │
                 │  • Automated PDF Diagnostic Reports  │
                 └──────────────────────────────────────┘
```

### 2.2 User Characteristics
The system caters to technical domain specialists (Architects, MEP Engineers, Facility Managers) and software evaluators. The user interface prioritizes clarity, intuitive parameter sliders, interactive 2D/3D visualizations, and plain-English physical explanations.

### 2.3 General Constraints
* The system shall execute locally without internet access or mandatory cloud costs when `EXECUTION_MODE=local`.
* Machine learning surrogate models must run on standard commodity CPU hardware without requiring dedicated enterprise GPU clusters.
* All tabular data must be stored in Apache Parquet format to guarantee high query throughput.

---

## 3. Specific Requirements Reference

The detailed specific requirements are cataloged in our dedicated modular specifications:
* **Stakeholder Analysis:** Refer to [Stakeholder_Analysis.md](file:///e:/MY-PROJECTS/AWS.ML.Project/Documentations/03_Requirements_Gathering/Stakeholder_Analysis.md) for SH-01 through SH-05.
* **User Stories & Use Cases:** Refer to [User_Stories_and_Use_Cases.md](file:///e:/MY-PROJECTS/AWS.ML.Project/Documentations/03_Requirements_Gathering/User_Stories_and_Use_Cases.md) for US-01 through US-14 and UC-01 through UC-12.
* **Functional Requirements:** Refer to [Functional_Requirements.md](file:///e:/MY-PROJECTS/AWS.ML.Project/Documentations/03_Requirements_Gathering/Functional_Requirements.md) for FR-ENG-01–05, FR-ML-01–05, FR-OPT-01–04, FR-XAI-01–03, and FR-SYS-01–05.
* **Non-Functional Requirements:** Refer to [Non_Functional_Requirements.md](file:///e:/MY-PROJECTS/AWS.ML.Project/Documentations/03_Requirements_Gathering/Non_Functional_Requirements.md) for NFR-01 through NFR-10.

---

## 4. Requirements Traceability Matrix (RTM)

The Requirements Traceability Matrix guarantees complete end-to-end alignment from high-level project objectives to granular code implementations and verification test cases:

| Objective ID | Stakeholder ID | User Story ID | Use Case ID | Functional Req ID | Non-Functional Req | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **O-01** (Data Lakehouse) | SH-04 (Cloud Eng) | US-12, US-13 | UC-09, UC-11 | FR-ENG-01, FR-ENG-02, FR-ENG-03, FR-ENG-04 | NFR-01, NFR-04, NFR-06 | PyTest Data Validation & Schema Quarantine Suite |
| **O-01** (Feature Pipeline) | SH-03, SH-04 | US-08, US-13 | UC-09 | FR-ENG-05 | NFR-04, NFR-05 | Feature Variance & Lag Computation Assertions |
| **O-02** (Surrogate Modeling) | SH-01, SH-02 | US-01, US-03 | UC-01 | FR-ML-01, FR-ML-03, FR-ML-04 | NFR-02, NFR-03, NFR-05 | ML Benchmark ($R^2 \ge 0.95$, Latency $< 250\text{ ms}$) |
| **O-03** (Weather Forecasting) | SH-02, SH-03 | US-07, US-09 | UC-07, UC-08 | FR-ML-02, FR-ML-05 | NFR-03, NFR-05 | ASHRAE Guideline 14 ($\text{CV(RMSE)} \le 15\%$) Backtest |
| **O-04** (Pareto Optimization) | SH-01, SH-02 | US-04, US-05, US-06 | UC-03, UC-05 | FR-OPT-01, FR-OPT-02, FR-OPT-04 | NFR-02, NFR-06 | NSGA-II Hypervolume & Boundary Constraint Tests |
| **O-05** (What-If & XAI) | SH-01, SH-02 | US-02, US-10, US-11 | UC-02, UC-04 | FR-OPT-03, FR-XAI-01, FR-XAI-02, FR-XAI-03 | NFR-02, NFR-08 | Exact SHAP Additivity Test & UI Delta Checks |
| **O-06** (API & Web App) | All Stakeholders | US-12, US-14 | UC-06, UC-12 | FR-SYS-01, FR-SYS-02, FR-SYS-03, FR-SYS-04, FR-SYS-05 | NFR-01, NFR-07, NFR-09, NFR-10 | OpenAPI Contract Tests & Docker Smoke Test |

---

## 5. Verification & Acceptance Criteria Sign-Off

The software system specified in this SRS shall be formally validated during Stage 6 (Testing & QA) against the following hard gates:
1. **Automated Pipeline Gate:** 100% of integration test suites pass on GitHub Actions CI.
2. **Physics Grounding Gate:** Surrogate models validated within a $\le 6\%$ variance window of DOE Reference Building simulations.
3. **Execution Mode Parity Gate:** Full end-to-end user journey succeeds in local offline mode without network connectivity.
4. **Deliverable Gate:** Full documentation package and presentation slide deck approved by DEPI instructors.
