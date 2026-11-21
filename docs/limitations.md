# Project Limitations & Boundary Conditions

## 1. Domain Applicability & Scope
- **Residential Prototypes:** The models are trained on simulated rectangular residential forms (768 archetypes). Complex architectural geometries (curvilinear facades, internal atriums, multi-tower connections) deviate from the training distribution.
- **Climate Context:** The underlying thermodynamic simulations presume temperate climate meteorological boundary conditions (Athens, Greece climate profile). Applying predictions to extreme sub-arctic or equatorial humid zones requires microclimate calibration.

## 2. Parameter Boundaries
Inputs outside the training distributions will trigger Pydantic schema validation errors:
- $X_1$ (Relative Compactness): $[0.60, 1.00]$
- $X_2$ (Surface Area): $[500.0, 850.0]\ \text{m}^2$
- $X_3$ (Wall Area): $[240.0, 420.0]\ \text{m}^2$
- $X_4$ (Roof Area): $[100.0, 230.0]\ \text{m}^2$
- $X_5$ (Overall Height): $[3.0, 8.0]\ \text{m}$
- $X_7$ (Glazing Area): $[0.00, 0.50]$

## 3. HVAC & Operational Assumptions
- Operational schedules, occupant density variations, internal equipment loads, and natural ventilation air change rates are standardized based on ISO 13790 / EN 832 assumptions.
- Models predict building envelope thermal demand, not mechanical plant electrical COP/EER efficiencies.
