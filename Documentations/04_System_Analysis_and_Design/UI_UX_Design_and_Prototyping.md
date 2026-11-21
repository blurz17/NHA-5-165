# Stage 4: UI/UX Design & Prototyping Specification
**ML Diploma Graduation Project | System Analysis & Design**  
**Team Name:** CloudXAi  
**Team Code:** NHA-5-165  
**Project Title:** Building Energy Efficiency: Heating & Cooling Load Prediction  
**Document Version:** v2.0 (Reconstructed)  

---

## 1. UI/UX Design Philosophy & Objectives

The user interface of the **Building Energy Efficiency Simulator** (`app.py`) is engineered to provide architects, HVAC engineers, and evaluators with an immediate, responsive, and visually intuitive simulation experience.

### Core Usability Principles:
1. **Zero-Latency Reactive Feedback:** Adjusting any architectural parameter (building shape, orientation, glazing ratio) instantly recalculates thermal loads and updates charts without requiring full page reloads.
2. **Contextualized Thermal Metrics:** Rather than presenting isolated raw numbers, predicted loads are contextualized with:
   - Percentage delta compared to the dataset average ($\Delta\%$ vs. average).
   - Absolute gap compared to the best possible design in the dataset.
   - Standardized Energy Efficiency Letter Rating (**A–E**).
3. **Physical Feasibility by Construction:** To prevent users from testing non-physical geometry combinations, the UI provides a curated dropdown of the 12 verified canonical building shapes, auto-populating corresponding dimensional metrics.

---

## 2. Design System Tokens & Styling

The interface is built using **Gradio Blocks** styled with `gr.themes.Soft(primary_hue="teal")` and augmented with custom CSS classes:

### 2.1 Color Palette & Visual Coding

| Role | Hex Code | Visual Swatch | Applied Component |
| :--- | :---: | :---: | :--- |
| **Hero Gradient Start** | `#0f766e` | Deep Teal | Hero header background |
| **Hero Gradient End** | `#0ea5e9` | Sky Blue | Hero header background |
| **Grade A (Best Efficiency)** | `#16a34a` | Forest Green | Rating A border & text |
| **Grade B (High Efficiency)** | `#65a30d` | Lime Green | Rating B border & text |
| **Grade C (Average Efficiency)**| `#ca8a04`| Amber | Rating C border & text |
| **Grade D (Low Efficiency)** | `#ea580c` | Orange | Rating D border & text |
| **Grade E (Least Efficient)** | `#dc2626` | Crimson Red | Rating E border & text |
| **Heating Load Series** | `#f97316` | Orange Flame | Bar chart & sensitivity plot (Heating) |
| **Cooling Load Series** | `#0ea5e9` | Cool Blue | Bar chart & sensitivity plot (Cooling) |

### 2.2 Typography & Layout Tokens
* **Card Grid Layout:** CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(170px, 1fr))`, `gap: 14px`.
* **KPI Metric Styling:** Card container with rounded corners (`border-radius: 16px`), large bold metric values (`font-size: 2.1rem; font-weight: 800`), and subtle background translucency.
* **Geometry Banner:** Container (`.geo`) with `border-radius: 12px`, background `rgba(100,116,139,.12)` providing clear dimensional readouts.

---

## 3. Screen Layouts & Wireframes

### 3.1 Tab 1: Interactive Simulator ("🎛️ Simulator")

```
+---------------------------------------------------------------------------------------------------+
|  [Hero Banner: 🏢 Building Energy Efficiency Simulator]                                          |
|  Machine-learning model (XGBoost) predicting heating & cooling loads from architectural design.    |
+---------------------------------------------------------------------------------------------------+
| [🎛️ Simulator]  [🎯 Design Optimizer]  [📊 Model Performance]  [ℹ️ About]                       |
+------------------------------------+--------------------------------------------------------------+
| CONTROLS COLUMN (Scale: 1)         | RESULTS & VISUALIZATION COLUMN (Scale: 2)                    |
|                                    |                                                              |
| [Dropdown: Building shape]         | +----------------------------------------------------------+ |
| Shape 5 · comp. 0.76 · Tall 7 m    | | [🔥 Heating]     [❄️ Cooling]     [⚡ Total]     [Rating]  | |
|                                    | |   21.42 kWh/m²    25.10 kWh/m²    46.52 kWh/m²     [ C ]   | |
| [Radio: Orientation]               | |   -4% vs avg      +2% vs avg      +18 kWh vs opt   Amber   | |
| ( ) 2  (•) 3  ( ) 4  ( ) 5         | +----------------------------------------------------------+ |
|                                    |                                                              |
| [Radio: Glazing area]              | [🏗️ Geometry: Surface: 661.5 m² | Wall: 318.5 m² | Roof: 147 m²] |
| ( ) 0.0  ( ) 0.1  (•) 0.25  ( ) 0.4|                                                              |
|                                    | +----------------------------+ +---------------------------+ |
| [Radio: Glazing distribution]      | | [Comparison Bar Chart]     | | [Glazing Sensitivity]     | |
| ( ) 1  ( ) 2  (•) 3  ( ) 4  ( ) 5  | | Design vs Average vs Best  | | Load vs Glazing (0 - 0.4)| |
|                                    | +----------------------------+ +---------------------------+ |
| [Button: Predict energy load]      |                                                              |
+------------------------------------+--------------------------------------------------------------+
```

---

### 3.2 Tab 2: Combinatorial Design Optimizer ("🎯 Design Optimizer")

```
+---------------------------------------------------------------------------------------------------+
| 🎯 Search all 768 designs and find the 5 most energy-efficient configurations                     |
+---------------------------------------------------------------------------------------------------+
| Minimize: (•) Total energy   ( ) Heating only   ( ) Cooling only                                  |
| Max Glazing Area: ( ) 0.0   ( ) 0.10   ( ) 0.25   (•) 0.40                                        |
| Building Height (m): (•) Any   ( ) 3.5   ( ) 7.0                                                  |
|                                                                                                   |
| [Button: Find best designs]                                                                       |
+---------------------------------------------------------------------------------------------------+
| TOP 5 OPTIMAL DESIGNS TABLE:                                                                      |
| Shape | Compactness | Surface Area | Wall Area | Roof Area | Height | Glazing | Heating | Cooling |
|-------+-------------+--------------+-----------+-----------+--------+---------+---------+---------|
| 1     | 0.98        | 514.5        | 294.0     | 110.25    | 7.0    | 0.00    | 15.55   | 21.33   |
| 1     | 0.98        | 514.5        | 294.0     | 110.25    | 7.0    | 0.10    | 17.50   | 22.10   |
| ...   | ...         | ...          | ...       | ...       | ...    | ...     | ...     | ...     |
+---------------------------------------------------------------------------------------------------+
```

---

### 3.3 Tab 3: Model Performance Benchmark ("📊 Model Performance")
Presents the verified holdout test set metrics table comparing Decision Tree, Random Forest, Gradient Boosting, XGBoost (default), and tuned XGBoost, along with insights into tree feature importance.

### 3.4 Tab 4: About & References ("ℹ️ About")
Provides an architectural overview of the Tsanas & Xifara dataset, supervised regression problem formulation, technology stack, and academic citation.

---

## 4. User Interaction State Transitions

```
User Action: Selects new Shape from Dropdown
  ├── 1. Trigger `shape_in.change()` event
  ├── 2. Auto-fill geometry metrics (Surface, Wall, Roof, Height) in HTML banner
  ├── 3. Execute `simulate()` batch query
  ├── 4. Update KPI cards with new kWh/m² values and Grade letter
  ├── 5. Re-render stacked bar chart comparison
  └── 6. Re-calculate sensitivity curve across 4 glazing ratios
Total Latency: < 150 ms (seamless, imperceptible delay)
```
