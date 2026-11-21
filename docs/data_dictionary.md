# Building Energy Efficiency Data Dictionary

## Overview
The dataset contains 768 simulated residential building configurations generated using EnergyPlus simulation software. Each record represents a distinct architectural design evaluated across two energy performance metrics: Heating Load ($Y_1$) and Cooling Load ($Y_2$).

---

## 1. Feature Specifications

| Feature Name | Symbol | Description | Data Type | Physical Unit | Domain Range | Distinct Values |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Relative_Compactness** | $X_1$ | Ratio of building surface area to volume relative to a reference cube | Float | Dimensionless | 0.62 – 0.98 | 12 |
| **Surface_Area** | $X_2$ | Total envelope exterior surface area | Float | $\text{m}^2$ | 514.5 – 808.5 | 12 |
| **Wall_Area** | $X_3$ | Exterior vertical surface wall area | Float | $\text{m}^2$ | 245.0 – 416.5 | 7 |
| **Roof_Area** | $X_4$ | Horizontal roof boundary area | Float | $\text{m}^2$ | 110.25 – 220.50 | 4 |
| **Overall_Height** | $X_5$ | Total vertical building height | Float | Meters (m) | 3.5, 7.0 | 2 |
| **Orientation** | $X_6$ | Cardinal orientation | Integer | Discrete Code | 2, 3, 4, 5 | 4 |
| **Glazing_Area** | $X_7$ | Ratio of window area to exterior wall area | Float | Dimensionless | 0.0, 0.10, 0.25, 0.40 | 4 |
| **Glazing_Area_Distribution** | $X_8$ | Spatial distribution symmetry of glazing | Integer | Discrete Code | 0 – 5 | 6 |

### Orientation Codes
- `2`: North
- `3`: East
- `4`: South
- `5`: West

### Glazing Distribution Codes
- `0`: None (No glazing / 0.0 ratio)
- `1`: Uniform (equal distribution across all facades)
- `2`: North-dominant
- `3`: East-dominant
- `4`: South-dominant
- `5`: West-dominant

---

## 2. Target Variables

| Target Variable | Symbol | Description | Physical Unit | Mean &plusmn; Std | Min – Max |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heating_Load** | $Y_1$ | Energy required to maintain indoor heating setpoint | $\text{kWh/m}^2$ | 22.31 &plusmn; 10.09 | 6.01 – 43.10 |
| **Cooling_Load** | $Y_2$ | Energy required to maintain indoor cooling setpoint | $\text{kWh/m}^2$ | 24.59 &plusmn; 9.51 | 10.90 – 48.03 |

---

## 3. Engineered Features (Pipeline Transformers)

| Feature Name | Formula | Engineering Rationale |
| :--- | :--- | :--- |
| **Wall_Surface_Ratio** | $\frac{\text{Wall\_Area}}{\text{Surface\_Area}}$ | Normalizes vertical facade area against overall envelope size, capturing convective heat loss geometry. |
| **Glazing_x_Height** | $\text{Glazing\_Area} \times \text{Overall\_Height}$ | Models solar aperture exposure scaled by vertical building geometry. |
