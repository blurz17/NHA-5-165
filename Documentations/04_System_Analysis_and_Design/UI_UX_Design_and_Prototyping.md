# Stage 4: UI/UX Design & Prototyping Specification
**ML Diploma Graduation Project | System Analysis & Design**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** AI-Based Building Energy Performance Evaluation & Design Optimization  
**Document Version:** v1.0  

---

## 1. UI/UX Design System & Principles

The user interface of **CloudXAi** is built as an interactive **Digital Twin Decision Support Platform**. It addresses a critical problem identified in our literature review: architectural performance tools are often too rigid, text-heavy, or slow.

### Core Design Principles:
1. **Zero Waiting Latency:** Every user interaction (sliding a glazing slider, changing orientation) yields instant visual updates through reactive client-side bindings.
2. **Explainable by Design:** Black-box numbers are strictly accompanied by physical visual explanations (SHAP waterfall charts, baseline comparisons).
3. **High-Density Information Hierarchy:** Visual emphasis is placed on decision KPIs (Energy Savings %, Pareto Ranks, Peak Demand Hours) using prominent metric callout cards and 2D/3D Plotly visualizers.

---

## 2. Design System Tokens

### 2.1 Color Palette
* **Brand Primary (Energy Emerald):** `#10B981` (High efficiency, optimal Pareto frontier points, positive savings).
* **Thermal Heating (Amber Gold):** `#F59E0B` (Heating load, solar heat gain, temperature increases).
* **Thermal Cooling (Cyan Frost):** `#06B6D4` (Cooling load, chilled water demand, HVAC cooling).
* **Anomaly / Warning (Crimson Red):** `#EF4444` (Budget constraint violations, operational residuals $> 2.5\sigma$).
* **Background Dark (Deep Slate):** `#0F172A` (Professional high-contrast dark dashboard mode).
* **Surface Card Dark:** `#1E293B` (Elevated card containers, borders `#334155`).
* **Text Primary:** `#F8FAFC` (100% readable white-slate text).
* **Text Muted:** `#94A3B8` (Descriptions, labels, units).

### 2.2 Typography
* **Primary Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
* **Monospace / Numerical Readouts:** `JetBrains Mono`, `Fira Code`, `monospace` (used for coordinates, kWh values, and confidence intervals).

### 2.3 Accessibility (WCAG 2.1 AA Compliance)
* All text-to-background contrast ratios strictly exceed $4.5:1$ for normal text and $3.0:1$ for large headings.
* Visual charts never rely on color alone; points use distinct glyph shapes (circles, diamonds, squares) and clear hover tooltips.

---

## 3. Screen Wireframes & Functional Layouts

### Screen 1: Executive Overview Dashboard
Provides a macro-level summary of active building designs, baseline energy ratings, and system execution status.

```
+-----------------------------------------------------------------------------------------+
| [CloudXAi] Building Energy Decision Support Platform              [Profile: Local Mode] |
+-----------------------------------------------------------------------------------------+
| [Overview]  [What-If Sandbox]  [Pareto Explorer]  [Hourly Forecast]  [XAI Diagnostics]  |
+-----------------------------------------------------------------------------------------+
| ACTIVE BUILDING: Commercial Office (BLD_0142) | Site: Chicago (Zone 5A) | Area: 5,120 m²|
+-----------------------------------------------------------------------------------------+
|  +--------------------+  +--------------------+  +--------------------+  +------------+ |
|  | ANNUAL HEATING     |  | ANNUAL COOLING     |  | TOTAL OPERATIONAL  |  | ASHRAE 90.1| |
|  | 24.8 kWh/m²        |  | 38.4 kWh/m²        |  | 142,500 kWh/yr     |  | COMPLIANT  | |
|  | -12.4% vs Baseline |  | +4.2% vs Baseline  |  | Est. $18,525/yr    |  | Tier A     | |
|  +--------------------+  +--------------------+  +--------------------+  +------------+ |
|                                                                                         |
|  +--------------------------------------------+  +------------------------------------+ |
|  | 3D Building Massing & Geometry Preview     |  | Energy Breakdown by End-Use        | |
|  |                                            |  |                                    | |
|  |                 [ 3D Render ]              |  |   [### Cooling: 48%              ] |
|  |               (Rotatable Box)              |  |   [## Heating: 26%               ] |
|  |               Compactness: 0.78            |  |   [# Lighting & Equipment: 26%   ] |
|  |               Window-to-Wall: 32%          |  |                                    | |
|  +--------------------------------------------+  +------------------------------------+ |
|                                                                                         |
|  [ Download Executive PDF Audit Report ]                   [ Switch to What-If Sandbox ]|
+-----------------------------------------------------------------------------------------+
```

---

### Screen 2: Real-Time What-If Design Sandbox
Allows architects to manipulate physical design levers and see dynamic differential feedback ($\Delta\text{kWh/m}^2$).

```
+-----------------------------------------------------------------------------------------+
| WHAT-IF SCENARIO SANDBOX                                                                |
+-----------------------------------------------------------------------------------------+
| PARAMETER CONTROLLERS (SLIDERS)               | DYNAMIC DIFFERENTIAL FEEDBACK           |
|                                               |                                         |
| Relative Compactness (0.60 - 1.00):           | Base Heating:  24.8  --> New: 21.2 kWh  |
| [==================O===========] 0.76         | Delta Heating: -3.6 kWh/m² (-14.5%)     |
|                                               |                                         |
| South Glazing Ratio (0% - 50%):               | Base Cooling:  38.4  --> New: 35.1 kWh  |
| [=============O================] 28%          | Delta Cooling: -3.3 kWh/m² (-8.6%)      |
|                                               |                                         |
| Building Orientation Azimuth (0° - 360°):     | Total Annual Saved:  $1,420 / year      |
| [===========O==================] 135° (SE)    | Payback Period:      1.8 Years          |
|                                               |                                         |
| Wall Insulation U-Value (0.15 - 0.60 W/m²K):  | +-------------------------------------+ |
| [======O=======================] 0.22         | | Real-Time Delta Comparison Chart    | |
|                                               | | Baseline  [████████████████████]    | |
| Glazing Type Selection:                       | | Scenario  [███████████████     ]    | |
| ( ) Single Clear  ( ) Double Low-E  (*) Triple| | Savings   [█████ -18.2%        ]    | |
|                                               | +-------------------------------------+ |
|                                                                                         |
| [ Reset to Baseline ]   [ Save as Scenario B ]   [ Optimize This Design via NSGA-II ]   |
+-----------------------------------------------------------------------------------------+
```

---

### Screen 3: Multi-Objective Pareto Frontier Explorer
Visualizes non-dominated trade-offs between Energy Demand, Thermal Comfort, and Envelope Construction Cost.

```
+-----------------------------------------------------------------------------------------+
| MULTI-OBJECTIVE DESIGN OPTIMIZATION (NSGA-II)                                           |
+-----------------------------------------------------------------------------------------+
| OPTIMIZATION CONTROLS                         | 3D INTERACTIVE PARETO FRONTIER          |
|                                               |                                         |
| Population Size: [ 100 ]                      |      Cost ($/m²)                        |
| Generations:     [  50 ]                      |       ^                                 |
| Objectives:                                   |       |       * Design C (High-End)     |
| [*] Minimize Heating Load                     |       |      *                          |
| [*] Minimize Cooling Load                     |       |     *   * Design B (Balanced)   |
| [*] Minimize Envelope Cost                    |       |    *  *                         |
|                                               |       |   * * Design A (Budget)         |
| Constraints:                                  |       +------------------------>        |
| Max Budget:  [ $160 / m² ]                    |            Total Energy Load (kWh/m²)   |
| Min Daylight: WWR >= 20%                      |                                         |
|                                               | (Rotate / Zoom 3D Plotly Surface)       |
| [ Run NSGA-II Engine (Est. 2.4s) ]            |                                         |
+-----------------------------------------------------------------------------------------+
| SELECTED CANDIDATE: Design B (Pareto Rank 1)                                            |
| Compactness: 0.82 | Orientation: 180° (South) | WWR: 30% | Cost: $118/m² | Energy: -22.4%|
| [ Export Parameters to EnergyPlus IDF ]           [ View SHAP Attribution for Design B ]|
+-----------------------------------------------------------------------------------------+
```

---

### Screen 4: Explainable AI (SHAP Diagnostics) Panel
Deconstructs predictions into physical feature contributions using interactive Waterfall and Force plots.

```
+-----------------------------------------------------------------------------------------+
| EXPLAINABLE AI (XAI) DIAGNOSTIC PANEL                                                   |
+-----------------------------------------------------------------------------------------+
| Target: Cooling Load (Predicted: 35.1 kWh/m² | Baseline Average: 28.5 kWh/m²)           |
+-----------------------------------------------------------------------------------------+
| LOCAL INSTANCE WATERFALL PLOT: How each parameter pushed the prediction:                |
|                                                                                         |
| Base Value E[f(X)]: 28.5 kWh/m²                                                         |
|                                                                                         |
| + Glazing Ratio South (28%)  | [====== +4.2 kWh/m² ======] --> Increased solar heat gain|
| - Compactness (0.82)         | [=== -2.8 kWh/m² ===]       --> Compact shape retains cool|
| + Wall Area (318 m²)         | [= +1.1 kWh/m² =]           --> Conduction load          |
| - Triple Low-E Glass (SHGC)  | [==== -3.4 kWh/m² ====]     --> High solar block coating |
| - Roof U-Value (0.18)        | [= -0.8 kWh/m² =]           --> Excellent insulation     |
| ======================================================================================= |
| FINAL PREDICTED COOLING LOAD: 35.1 kWh/m²                                               |
+-----------------------------------------------------------------------------------------+
| AI ENGINEERING RECOMMENDATION:                                                          |
| "The predicted cooling load is 23% above the city average. The primary driver is solar   |
| radiation through the south-facing glazing (+4.2 kWh/m²). Adding external shading louvers|
| or reducing south glazing to 22% will reduce cooling demand by ~11% without daylight loss"|
+-----------------------------------------------------------------------------------------+
```

---

### Screen 5: Operational Hourly Energy Forecasting & Anomaly Check
Visualizes weather-aware multi-horizon forecasts with peak-demand alerts and residual anomaly tracking.

```
+-----------------------------------------------------------------------------------------+
| OPERATIONAL WEATHER-AWARE ENERGY FORECAST (ASHRAE GEPIII BENCHMARK)                     |
+-----------------------------------------------------------------------------------------+
| Site: Site_01 | Meter: Electricity (kWh) | Forecast Window: Next 168 Hours (7 Days)     |
+-----------------------------------------------------------------------------------------+
|  ENERGY CONSUMPTION (kWh) vs COINCIDENT OUTDOOR TEMPERATURE (°C)                        |
|                                                                                         |
|  2500 |                                                 * Peak Demand Alert!             |
|       |                     /\                         / \                              |
|  1800 |     /\             /  \     /\                /   \     /\                      |
|       |    /  \   /\      /    \   /  \   /\         /     \   /  \                     |
|  1000 |---/----\-/--\----/------\-/-*--\-/-*--------/-------\-/----\------------------  |
|       |  Mon    Tue     Wed       Thu (Anomaly)     Fri (Peak)  Sat                     |
|                                                                                         |
|  [===] Forecasted kWh      [---] Historical Baseline      [*] Residual Anomaly (>2.5s) |
+-----------------------------------------------------------------------------------------+
| PERFORMANCE METRICS: CV(RMSE): 11.2% (Pass) | NMBE: +1.8% (Pass) | ASHRAE 14 COMPLIANT  |
+-----------------------------------------------------------------------------------------+
```
