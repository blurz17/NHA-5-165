# Stage 3: Non-Functional Requirements Specification
**ML Diploma Graduation Project | Requirements Engineering**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. Overview

Non-Functional Requirements (NFRs) specify the qualitative attributes, performance thresholds, operational constraints, and architectural standards that the **CloudXAi** platform must satisfy.

---

## 2. Detailed Non-Functional Requirements

### NFR-01: Portability & Dual-Mode Parity (Critical)
* **Requirement:** The system shall operate with complete functional parity in two distinct execution environments:
  1. **Local Mode:** Operating entirely on a standard developer workstation (Windows 10/11, macOS, Linux) without requiring active cloud credentials, external internet connections, or paid cloud services. Storage is managed via local Parquet files; queries run via DuckDB/Polars.
  2. **AWS Cloud Mode:** Operating in AWS using Amazon S3 for lakehouse storage, AWS Glue for ETL, Amazon Athena for SQL queries, and containerized deployment via ECS / App Runner.
* **Metric:** 100% of integration test suites pass in both environments simply by toggling `EXECUTION_MODE=local` or `EXECUTION_MODE=aws`.

### NFR-02: Prediction & Optimization Latency (Critical)
* **Requirement:** The system shall deliver near-instantaneous feedback to maintain an interactive user experience during design workshops.
* **Thresholds:**
  * Single-instance thermal load prediction: $p_{95} \text{ latency} < 250\text{ ms}$; $p_{99} < 500\text{ ms}$.
  * Local SHAP feature attribution calculation: $p_{95} \text{ latency} < 300\text{ ms}$.
  * 50-point NSGA-II multi-objective Pareto frontier generation: Total runtime $< 3.0\text{ seconds}$.
  * 7-day hourly operational energy forecasting: Total execution time $< 1.5\text{ seconds}$.
* **Measurement:** Benchmark tests executed under standard CPU specifications (4 cores, 8 GB RAM).

### NFR-03: Model Accuracy & ASHRAE Compliance (Critical)
* **Requirement:** Machine learning models must satisfy recognized international engineering standards:
  * **Thermal Load Regression (Benchmark Dataset):**
    * Coefficient of Determination ($R^2$) $\ge 0.95$ on holdout test set.
    * Mean Absolute Error ($\text{MAE}$) $\le 1.25\text{ kWh/m}^2$.
  * **Operational Energy Forecasting (ASHRAE GEPIII):**
    * Conformance to **ASHRAE Guideline 14-2014** hourly criteria:
      * Coefficient of Variation of Root Mean Square Error ($\text{CV(RMSE)}$) $\le 15.0\%$.
      * Normalized Mean Bias Error ($\text{NMBE}$) $\le \pm 5.0\%$.

### NFR-04: Scalability & Storage Optimization (High)
* **Requirement:** Tabular datasets must be stored in optimized formats to minimize disk I/O and query latency.
* **Implementation:**
  * Raw and processed tables stored as columnar Apache Parquet with Snappy compression, reducing disk footprint by $> 75\%$ compared to uncompressed CSV.
  * Partitioning applied on `site_id`, `building_type`, and `year` to enable partition pruning during SQL queries.
  * System shall efficiently handle time-series meter tables containing over $10,000,000$ rows locally using memory-mapped DuckDB queries without out-of-memory (OOM) crashes.

### NFR-05: Reproducibility & Experiment Lineage (High)
* **Requirement:** All analytical pipelines, data splits, and model training routines must be fully deterministic and reproducible.
* **Implementation:**
  * Explicit random seeds (`seed=42`) pinned across all data partitions, train/val/test splits, and stochastic optimization algorithms (NSGA-II).
  * Strict temporal splitting for time-series data (e.g., Year 1 & 2 Train, Year 3 Test) to eliminate future look-ahead data leakage.
  * Full experiment tracking logged into MLflow, capturing hyperparameters, metrics, git commit hashes, and serialized model artifacts.

### NFR-06: Robustness & Fault Tolerance (High)
* **Requirement:** The system shall gracefully handle unexpected user inputs, corrupted data rows, and network disruptions without crashing or displaying raw stack traces.
* **Implementation:**
  * Pydantic v2 schemas validating all REST API inputs; HTTP 422 Unprocessable Entity returned with descriptive error messages.
  * Automated data quarantine routing malformed CSV records to `logs/validation/quarantined.log` while allowing valid records to proceed.
  * Circuit breakers and fallback defaults ensuring the UI displays user-friendly alert banners if the inference service encounters an exception.

### NFR-07: Security & Credential Isolation (High)
* **Requirement:** The system shall prevent sensitive data exposure and adhere to the principle of least privilege.
* **Implementation:**
  * Zero hardcoded credentials, API keys, or AWS secret keys in the codebase. All credentials loaded exclusively via `.env` files (excluded via `.gitignore`).
  * AWS IAM policies configured strictly with least-privilege permissions (read/write access restricted to the designated project S3 bucket).
  * Sanitization of all file upload paths to prevent path-traversal vulnerabilities.

### NFR-08: Usability & Accessibility (Medium)
* **Requirement:** The web interface shall provide an intuitive, responsive user experience accessible to non-programming building designers.
* **Implementation:**
  * Dashboard built using Streamlit and Plotly with interactive tooltips, responsive layout, and distinct visual hierarchy.
  * Adherence to WCAG 2.1 Level AA color contrast standards for charts and callout cards.
  * One-click PDF export functionality producing a self-contained executive summary.

### NFR-09: Code Quality & Maintainability (High)
* **Requirement:** The codebase shall follow industry-grade Python engineering best practices.
* **Implementation:**
  * Strict compliance with **PEP 8** style guidelines, enforced by `flake8` and automated formatting via `black`.
  * Comprehensive Python type hinting (`typing` module) across all core function and class definitions.
  * Modular package structure with high cohesion and loose coupling.
  * Automated test coverage with `pytest` maintaining $\ge 85\%$ coverage on core modules.

### NFR-10: Availability & Deployment Reliability (Medium)
* **Requirement:** The deployed service shall maintain high availability during evaluation and production demonstrations.
* **Implementation:**
  * System uptime $\ge 99.0\%$ during operational testing.
  * Dockerized deployment enabling zero-dependency startup via `docker-compose up --build`.
  * Automated container health-check probes (`GET /api/v1/health`) ensuring automatic container restarts upon failure.

---

## 3. NFR Summary Table

| ID | Category | Target Metric | Verification Method |
| :--- | :--- | :--- | :--- |
| **NFR-01** | Portability | 100% test pass rate in Local & AWS modes | Automated CI matrix |
| **NFR-02** | Latency | Single inference $< 250\text{ ms}$; Pareto $< 3.0\text{ s}$ | Benchmark profiling script |
| **NFR-03** | Accuracy | $R^2 \ge 0.95$, $\text{CV(RMSE)} \le 15.0\%$, $\text{NMBE} \le \pm 5\%$ | MLflow evaluation run |
| **NFR-04** | Scalability | Parquet compression $> 75\%$; 10M+ rows handled | Disk storage & RAM profiling |
| **NFR-05** | Reproducibility | 100% deterministic runs; MLflow tracking | Verification of pinned seeds |
| **NFR-06** | Robustness | 0 unhandled exceptions; input quarantine active | PyTest edge-case tests |
| **NFR-07** | Security | 0 exposed secrets; `.env` isolation | Secret scanner (Gitleaks / Flake8) |
| **NFR-08** | Usability | Sub-3-second PDF export; WCAG 2.1 AA | UI acceptance testing |
| **NFR-09** | Maintainability | PEP 8 compliant; $\ge 85\%$ test coverage | PyTest-cov & Flake8 linter |
| **NFR-10** | Reliability | Dockerized one-command launch; health checks | Container deployment test |
