# Stage 4: Data Flow & System Behavior Specification
**ML Diploma Graduation Project | System Analysis & Design**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. Data Flow Diagrams (DFD)

### 1.1 Context Level 0 DFD
The Level 0 context diagram defines the high-level boundary of the **Building Energy Efficiency System** and its interactions with human users and external cloud services:

```mermaid
graph TD
    User["Architect / Energy Consultant"]
    CloudS3["Amazon S3 Storage"]
    RawData["Tsanas & Xifara Dataset (768 Rows)"]
    System(("Building Energy Efficiency Platform"))

    User -->|1. Geometry selection, orientation, glazing parameters| System
    RawData -->|2. Ingest CSV dataset| System
    System <-->|3. Synchronize datasets, preprocessors, and models| CloudS3
    System -->|4. Thermal loads, A-E efficiency grade, sensitivity plots, top-5 designs| User
```

---

### 1.2 DFD Level 1: Subsystem Process Decomposition
The Level 1 diagram decomposes the system into six sequential and operational processes:

```mermaid
graph TD
    RawCSV["Raw energy_efficiency_data.csv"]
    User["User / Architect"]

    subgraph Stores["Persistent & In-Memory Stores"]
        S_Raw[("D1: Raw Data Store")]
        S_Proc[("D2: Processed Splits (train/test)")]
        S_Pipe[("D3: Serialized Preprocessors (.joblib)")]
        S_Models[("D4: Serialized Models (.joblib)")]
        S_Cache[("D5: In-Memory 768 Pre-calculated Designs")]
    end

    P1["1.0 Data Ingestion & Quality Audit"]
    P2["2.0 Splitting & Feature Engineering"]
    P3["3.0 Model Training & Hyperparameter Tuning"]
    P4["4.0 Artifact Export & AWS S3 Sync"]
    P5["5.0 Interactive Gradio Simulation Engine"]
    P6["6.0 Combinatorial Design Optimization Engine"]

    RawCSV --> P1
    P1 --> S_Raw
    S_Raw --> P2
    P2 --> S_Proc
    P2 --> S_Pipe
    S_Proc & S_Pipe --> P3
    P3 --> S_Models
    S_Models & S_Pipe --> P4
    S_Models & S_Pipe --> S_Cache

    User -->|Selects Shape, Orientation, Glazing| P5
    S_Cache & S_Models --> P5
    P5 -->|KPI Cards, Grade A-E, Matplotlib Charts| User

    User -->|Selects Objective, Max Glazing, Height| P6
    S_Cache --> P6
    P6 -->|Top 5 Most Efficient Configurations| User
```

---

## 2. System Behavior: Sequence Diagrams

### 2.1 Sequence Diagram: Live Building Thermal Load Simulation
This sequence illustrates what occurs when an architect adjusts building design parameters in the Gradio web UI:

```mermaid
sequenceDiagram
    autonumber
    actor User as Architect / User
    participant UI as Gradio Frontend (app.py)
    participant Sim as Simulation Engine
    participant Pre as Preprocessor Pipeline (joblib)
    participant ModH as Heating Model (XGBoost)
    participant ModC as Cooling Model (XGBoost)
    participant Chart as Plotting Engine (Matplotlib)

    User->>UI: Selects Building Shape (e.g., Shape 5, Compactness 0.76)
    UI->>UI: Auto-fills Surface Area, Wall Area, Roof Area, Height
    User->>UI: Adjusts Orientation & Glazing Area Ratio
    User->>UI: Triggers Simulation (click or on-change)
    UI->>Sim: simulate(shape_i, ori, ga, gd)
    Sim->>Pre: transform(input_dataframe)
    Pre-->>Sim: Processed feature vector X
    Sim->>ModH: predict(X)
    ModH-->>Sim: Heating Load (Y1)
    Sim->>ModC: predict(X)
    ModC-->>Sim: Cooling Load (Y2)
    Sim->>Sim: Total = Y1 + Y2; Grade = grade(Total)
    Sim->>Chart: bar_fig(Y1, Y2, benchmarks)
    Chart-->>Sim: Stacked comparison bar chart
    Sim->>Chart: sens_fig(shape, ori, ga, gd)
    Chart-->>Sim: Glazing sensitivity curve
    Sim-->>UI: Render KPI Cards (Y1, Y2, Total, Grade), HTML Geo, Plots
    UI-->>User: Visual feedback displayed in browser (< 100 ms)
```

---

### 2.2 Sequence Diagram: Automated 768-Design Optimization
This sequence illustrates how the Design Optimizer instantly extracts the top-5 designs meeting user constraints:

```mermaid
sequenceDiagram
    autonumber
    actor Consultant as Energy Consultant
    participant UI as Gradio Frontend (app.py)
    participant Opt as Optimizer Engine
    participant Cache as In-Memory 768 Design DataFrame

    Consultant->>UI: Navigates to "🎯 Design Optimizer" tab
    Consultant->>UI: Selects Objective ("Total energy", "Heating only", "Cooling only")
    Consultant->>UI: Selects Constraints (Max Glazing = 0.25, Height = "Any")
    Consultant->>UI: Clicks "Find best designs"
    UI->>Opt: optimize(objective, max_glazing, height_filter)
    Opt->>Cache: Query filtered rows: (Glazing_Area <= max_glazing) & (Height == filter)
    Cache-->>Opt: Filtered subset of candidate designs
    Opt->>Opt: Sort ascending by selected objective
    Opt->>Opt: Extract top 5 rows & format columns
    Opt-->>UI: Return formatted Dataframe table
    UI-->>Consultant: Display Top-5 optimal designs with energy scores
```

---

## 3. State Machine Diagram: Architectural Design Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Unconfigured: Application Startup
    Unconfigured --> ShapeSelected: User selects 1 of 12 Shapes
    ShapeSelected --> GeometryAutoFilled: Surface, Wall, Roof, Height populated
    GeometryAutoFilled --> EnvelopeAdjusted: Orientation & Glazing set
    EnvelopeAdjusted --> Simulating: Input changed / button clicked
    Simulating --> Evaluated: Load predicted & Grade A-E assigned
    Evaluated --> EnvelopeAdjusted: Iterative what-if tuning
    Evaluated --> Optimizing: User switches to Optimizer Tab
    Optimizing --> Optimized: Top 5 designs extracted
    Optimized --> Evaluated: User tests recommended parameters
```
