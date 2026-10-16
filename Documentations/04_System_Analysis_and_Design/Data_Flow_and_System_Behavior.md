# Stage 4: Data Flow & System Behavior Specification
**ML Diploma Graduation Project | System Analysis & Design**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. Data Flow Diagrams (DFD)

### 1.1 Context Level 0 DFD

The Level 0 context diagram defines the interactions between the **CloudXAi System Boundary** and all external entities:

```mermaid
graph TD
    User["Architect / Energy Consultant"]
    WeatherService["Meteorological Data Provider"]
    PhysicsEngine["DOE / EnergyPlus Simulation Ground Truth"]
    CloudLakehouse["AWS S3 / Local Parquet Lakehouse"]
    System(("CloudXAi Decision Support Platform"))

    User -->|1. Geometric parameters, budget constraints, what-if queries| System
    WeatherService -->|2. Coincident hourly weather observations & forecasts| System
    PhysicsEngine -->|3. Pre-simulated reference building benchmarks| System
    CloudLakehouse <-->|4. Read/write raw, processed, and curated Parquet tables| System

    System -->|5. Instant thermal loads, Pareto frontiers, SHAP plots, PDF reports| User
```

---

### 1.2 DFD Level 1: Subsystem Decomposition

The Level 1 DFD decomposes the system into six interconnected processes and persistent data stores:

```mermaid
graph TD
    User["Architect / Consultant"]
    RawSources["Raw Data Ingestion Files"]
    
    subgraph DataStores["Persistent Lakehouse Stores"]
        DS_Raw[("D1: Raw Zone")]
        DS_Curated[("D2: Curated Star Schema")]
        DS_Models[("D3: MLflow Model Registry")]
        DS_Cache[("D4: Pareto Cache Store")]
    end

    P1["1.0 Data Ingestion & Schema Quarantine"]
    P2["2.0 Transformation & Feature Engineering"]
    P3["3.0 Model Training & Experiment Tracking"]
    P4["4.0 Vectorized Inference & Forecasting"]
    P5["5.0 NSGA-II Multi-Objective Optimizer"]
    P6["6.0 XAI Attribution & Presentation Engine"]

    RawSources --> P1
    P1 -->|Validated Clean Records| DS_Raw
    P1 -->|Log Quarantined Rows| P1
    DS_Raw --> P2
    P2 -->|Harmonized Parquet Tables| DS_Curated
    DS_Curated --> P3
    P3 -->|Trained Surrogate & Forecaster Artifacts| DS_Models

    User -->|Design Parameters & Weather Request| P6
    P6 -->|Query Baseline Features| DS_Curated
    P6 -->|Predict Thermal Loads| P4
    DS_Models --> P4
    P4 -->|Predictions & Prediction Intervals| P6

    User -->|Trigger Optimization| P5
    P5 -->|Vectorized Surrogate Calls| P4
    P5 -->|Cache Optimal Frontier| DS_Cache
    P5 -->|Return Pareto Set| P6

    P6 -->|Explain Factors via SHAP| P4
    P6 -->|Interactive Visualizations & PDF Reports| User
```

---

## 2. Sequence Diagrams

### 2.1 SD-01: End-to-End Design Optimization & Pareto Exploration
Illustrates the chronological interaction flow when an architect executes a multi-objective optimization run:

```mermaid
sequenceDiagram
    autonumber
    actor Architect as Sustainable Architect
    participant UI as Streamlit Web Dashboard
    participant API as FastAPI REST Gateway
    participant OptService as Optimization Worker (PyMoo)
    participant Surrogate as ML Surrogate Model
    participant Repo as Data Lake Repository

    Architect->>UI: Select optimization bounds & constraints (WWR, Compactness, Cost)
    Architect->>UI: Click "Discover Optimal Pareto Designs"
    UI->>API: POST /api/v1/optimize/pareto {bounds, constraints, population=100}
    API->>OptService: run_nsga2(objectives, constraints, generations=50)
    
    loop 50 Generations
        OptService->>OptService: Generate candidate parameter population (Crossover & Mutation)
        OptService->>Surrogate: predict_batch(candidates_matrix)
        Surrogate-->>OptService: Vector of (Heating Load, Cooling Load)
        OptService->>OptService: Evaluate Envelope Cost & Filter Constraints
        OptService->>OptService: Perform Non-Dominated Sorting & Crowding Distance
    end

    OptService->>Repo: persist_pareto_run(run_id, pareto_frontier)
    OptService-->>API: Return Rank 1 Pareto candidates (50 points)
    API-->>UI: HTTP 200 OK {pareto_points, hypervolume_score}
    UI->>UI: Render interactive 3D Plotly surface chart
    Architect->>UI: Click on specific candidate P-14
    UI-->>Architect: Display exact parameter breakdown and BIM export options
```

---

### 2.2 SD-02: Weather-Aware Operational Energy Forecasting
Illustrates how coincident weather feeds drive multi-horizon operational building energy prediction:

```mermaid
sequenceDiagram
    autonumber
    actor Facility as Facility Manager
    participant UI as Streamlit Dashboard
    participant API as FastAPI REST Service
    participant FE as Feature Engineering Engine
    participant Forecaster as LightGBM Forecaster
    participant DB as Curated Parquet (DuckDB/S3)

    Facility->>UI: Select Building BLD_0142 & Date Range
    Facility->>UI: Upload / Confirm 7-Day Weather Forecast
    UI->>API: POST /api/v1/predict/energy-forecast {building_id, weather_vector}
    API->>DB: query_building_metadata_and_historical_lags(building_id)
    DB-->>API: Metadata (Area, Floors, Primary Use, Lag24h, Lag168h)
    API->>FE: transform_temporal_and_degree_days(weather_vector, metadata)
    FE-->>API: Enriched Feature Matrix (cyclical hour, rolling temp, HDD, CDD)
    API->>Forecaster: predict_hourly_kwh(feature_matrix)
    Forecaster-->>API: Hourly forecasted consumption [kWh] & confidence bands
    API->>API: calculate_residual_anomalies(forecast, historical_actuals)
    API-->>UI: HTTP 200 OK {hourly_forecast, peak_hours, anomaly_flags}
    UI-->>Facility: Render time-series line chart with peak-demand alerts
```

---

### 2.3 SD-03: SHAP Feature Attribution Diagnostics
Illustrates how the system calculates and delivers local explainability for an evaluated design:

```mermaid
sequenceDiagram
    autonumber
    actor Consultant as MEP Energy Consultant
    participant UI as Streamlit UI
    participant API as FastAPI Service
    participant XAI as SHAP TreeExplainer
    participant LLM as Narrative Generator

    Consultant->>UI: Click "Explain Physical Drivers (SHAP)"
    UI->>API: POST /api/v1/explain/shap {design_vector}
    API->>XAI: calculate_shap_values(design_vector)
    XAI-->>API: Base value E[f(x)], Shapley values phi_i for all 8 features
    API->>LLM: synthesize_narrative(design_vector, phi_i)
    LLM-->>API: Plain-English summary ("High south glazing added +4.2 kWh/m²...")
    API-->>UI: HTTP 200 OK {base_value, shap_values, narrative}
    UI->>UI: Render interactive SHAP Waterfall plot
    UI-->>Consultant: Display visual attribution and engineering recommendation
```

---

## 3. Activity Diagrams

### 3.1 AD-01: Dual-Mode ETL & Lakehouse Processing Pipeline

```mermaid
flowchart TD
    Start([Start ETL Pipeline]) --> CheckMode{Check EXECUTION_MODE}
    CheckMode -->|local| InitLocal[Initialize DuckDB & Local File Paths]
    CheckMode -->|aws| InitCloud[Initialize boto3 & AWS S3 / Glue Sessions]

    InitLocal & InitCloud --> ReadRaw[Ingest Raw CSV / JSON Files]
    ReadRaw --> ValidateSchema{Validate Schema & Physical Bounds}

    ValidateSchema -->|Invalid Rows| Quarantine[Route to logs/validation/quarantined.log]
    ValidateSchema -->|Valid Rows| Harmonize[Harmonize Units to SI Metric]

    Quarantine --> LogAlert[Update Ingestion Alert Metric]
    Harmonize --> EngineerFeatures[Compute Temporal Encodings, Lags & Degree Days]

    EngineerFeatures --> WriteParquet[Write Partitioned Snappy Parquet Tables]
    WriteParquet --> UpdateCatalog{Execution Mode?}

    UpdateCatalog -->|local| RegisterDuckDB[Register Views in DuckDB Session]
    UpdateCatalog -->|aws| TriggerCrawler[Trigger AWS Glue Catalog Crawler]

    RegisterDuckDB & TriggerCrawler --> End([End ETL Pipeline: Lakehouse Ready])
```

---

### 3.2 AD-02: NSGA-II Multi-Objective Optimization Loop

```mermaid
flowchart TD
    StartOpt([Start Optimization Run]) --> InitPop[Initialize Random Population of 100 Designs]
    InitPop --> EvalSurrogate[Evaluate Objectives via Vectorized ML Surrogate]
    EvalSurrogate --> CheckConstraints[Evaluate Architectural & Budget Constraints]
    CheckConstraints --> AssignRank[Compute Non-Dominated Fronts: Fast Non-Dominated Sort]
    AssignRank --> AssignDistance[Calculate Crowding Distance within Fronts]

    AssignDistance --> CheckTermination{Generation >= 50 or Converged?}
    CheckTermination -->|No| Selection[Tournament Selection based on Rank & Crowding]
    Selection --> Crossover[Simulated Binary Crossover SBX]
    Crossover --> Mutation[Polynomial Mutation]
    Mutation --> BoundFix[Enforce Physical Parameter Boundaries]
    BoundFix --> EvalSurrogate

    CheckTermination -->|Yes| ExtractPareto[Extract Rank 1 Pareto Optimal Set]
    ExtractPareto --> CacheResults[Cache Frontier in Storage]
    CacheResults --> ReturnFrontier([Deliver 3D Pareto Frontier to UI])
```

---

## 4. State Machine Diagram

### SMD-01: Building Design Configuration Lifecycle

The lifecycle of an architectural design candidate within the system progresses through six defined states:

```mermaid
stateDiagram-v2
    [*] --> Draft : User creates initial parameter vector
    Draft --> Validated : Automated boundary validation passes
    Draft --> Rejected : Out-of-bounds parameter error
    Rejected --> Draft : User corrects values

    Validated --> Inferred : ML surrogate computes thermal loads
    Inferred --> InScenario : Added to What-If comparison matrix
    InScenario --> Modified : Slider adjusted by user
    Modified --> Inferred : Recalculate deltas

    Inferred --> Candidate : Injected into NSGA-II population pool
    Candidate --> NonDominated : Ranked in Pareto Rank 1
    Candidate --> Dominated : Superseded by more efficient candidate
    
    NonDominated --> PhysicsVerified : Calibrated against DOE Reference Model
    PhysicsVerified --> FinalApproved : Exported to PDF / CAD format
    FinalApproved --> [*]
```

---

## 5. Class Diagram (Domain Model & Software Architecture)

```mermaid
classDiagram
    class StorageRepository {
        <<Interface>>
        +read_table(name: str) DataFrame
        +write_table(df: DataFrame, name: str, partition_cols: list) void
        +query_sql(sql: str) DataFrame
    }
    class DuckDBRepository {
        -db_path: str
        +read_table(name: str) DataFrame
        +write_table(df: DataFrame, name: str, partition_cols: list) void
        +query_sql(sql: str) DataFrame
    }
    class S3AthenaRepository {
        -s3_bucket: str
        -athena_database: str
        +read_table(name: str) DataFrame
        +write_table(df: DataFrame, name: str, partition_cols: list) void
        +query_sql(sql: str) DataFrame
    }

    class Building {
        +building_id: str
        +primary_use: str
        +floor_area_m2: float
        +relative_compactness: float
        +surface_area_m2: float
        +wall_area_m2: float
        +roof_area_m2: float
        +overall_height_m: float
        +get_surface_to_volume_ratio() float
    }

    class DesignEnvelope {
        +envelope_id: str
        +glazing_ratio_wwr: float
        +orientation_azimuth_deg: float
        +wall_u_value: float
        +roof_u_value: float
        +calculate_estimated_cost() float
    }

    class MLSurrogateEstimator {
        -model_heating: Any
        -model_cooling: Any
        +load_models(model_dir: str) void
        +predict_thermal_loads(features: ndarray) PredictionResult
        +predict_batch(matrix: ndarray) ndarray
    }

    class NSGA2OptimizationEngine {
        -surrogate: MLSurrogateEstimator
        -population_size: int
        -generations: int
        +solve(bounds: list, constraints: list) ParetoResult
    }

    class XAIExplanationEngine {
        -explainer: TreeExplainer
        +get_local_shap(features: ndarray) SHAPResult
        +get_global_importance() DataFrame
    }

    StorageRepository <|.. DuckDBRepository
    StorageRepository <|.. S3AthenaRepository
    NSGA2OptimizationEngine --> MLSurrogateEstimator : uses
    XAIExplanationEngine --> MLSurrogateEstimator : explains
    Building "1" *-- "1..*" DesignEnvelope : evaluated_with
```
