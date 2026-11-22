"""
Model loading and prediction service layer.
Directly uses the bundled models from artifacts/production/model_bundle.joblib.
"""

import os
import joblib
import pandas as pd
from typing import Dict, Any, List

from .config import MODEL_BUNDLE_PATH
from .schemas import (
    BuildingFeatures, PredictionRequest, PredictionResponse, LoadPrediction,
    OptimizationRequest, OptimizationResponse, OptimizationResult
)


class ModelService:
    """Loads model_bundle.joblib and runs inference for Heating and Cooling loads."""

    def __init__(self):
        # Load the production bundle (contains all 10 models + 2 preprocessors + metadata)
        if not os.path.exists(MODEL_BUNDLE_PATH):
            raise FileNotFoundError(f"Production model bundle not found at {MODEL_BUNDLE_PATH}")
        self.bundle = joblib.load(MODEL_BUNDLE_PATH)
        self.is_loaded = True
        print(f"[ModelService] Successfully loaded model bundle from {MODEL_BUNDLE_PATH}")

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        """
        1. Select appropriate preprocessor ('linear' or 'tree')
        2. Retrieve target models ('heating' and 'cooling') for the chosen algorithm
        3. Transform inputs and compute predictions
        """
        algo = request.algorithm or "Random Forest"

        # Linear regression uses scaled/one-hot pipeline; tree models use unscaled pipeline
        prep_key = "linear" if algo == "Linear Regression" else "tree"
        preprocessor = self.bundle["preprocessors"][prep_key]

        # Retrieve the individual target models for the selected algorithm
        model_heating = self.bundle["models"]["heating"][algo]
        model_cooling = self.bundle["models"]["cooling"][algo]

        # Convert input dictionary to 1-row DataFrame and transform
        df_in = pd.DataFrame([request.features.model_dump()])
        X_trans = preprocessor.transform(df_in)

        # Run predictions
        heat_pred = round(float(model_heating.predict(X_trans)[0]), 2)
        cool_pred = round(float(model_cooling.predict(X_trans)[0]), 2)
        total_pred = round(heat_pred + cool_pred, 2)

        # Compute engineered feature values for UI display
        wall_ratio = round(request.features.Wall_Area / request.features.Surface_Area, 4)
        glazing_h = round(request.features.Glazing_Area * request.features.Overall_Height, 4)

        return PredictionResponse(
            success=True,
            prediction=LoadPrediction(
                heating_load_kwh=heat_pred,
                cooling_load_kwh=cool_pred,
                total_load_kwh=total_pred,
                algorithm_used=algo
            ),
            input_received=request.features.model_dump(),
            engineered_features={
                "Wall_Surface_Ratio": wall_ratio,
                "Glazing_x_Height": glazing_h
            }
        )

    def optimize(self, request: OptimizationRequest) -> OptimizationResponse:
        """Evaluate parameter sweep across candidate values to find minimum energy design."""
        param = request.optimize_param
        base = request.base_features.model_dump()

        if param == "Glazing_Area":
            candidates = [0.0, 0.10, 0.25, 0.40]
        elif param == "Orientation":
            candidates = [2, 3, 4, 5]
        elif param == "Relative_Compactness":
            candidates = [0.64, 0.74, 0.82, 0.90, 0.98]
        else:
            candidates = [base.get(param, 0.0)]

        evaluations: List[OptimizationResult] = []
        best_load = float("inf")
        best_val = candidates[0]

        for val in candidates:
            current_dict = dict(base)
            current_dict[param] = val
            pred_res = self.predict(
                PredictionRequest(features=BuildingFeatures(**current_dict), algorithm="Random Forest")
            )
            heat = pred_res.prediction.heating_load_kwh
            cool = pred_res.prediction.cooling_load_kwh
            total = pred_res.prediction.total_load_kwh

            if total < best_load:
                best_load = total
                best_val = val

            evaluations.append(OptimizationResult(
                param_value=val,
                heating_load=heat,
                cooling_load=cool,
                total_load=total
            ))

        return OptimizationResponse(
            parameter_optimized=param,
            optimal_value=best_val,
            lowest_total_load=best_load,
            evaluations=evaluations
        )

    def get_models_metadata(self) -> List[Dict[str, Any]]:
        """Return benchmark performance of all 10 models."""
        return [
            {"algorithm": "Linear Regression", "target": "Heating_Load", "mae": 1.8728, "rmse": 2.8002, "r2": 0.9248},
            {"algorithm": "Linear Regression", "target": "Cooling_Load", "mae": 2.1165, "rmse": 3.0471, "r2": 0.8998},
            {"algorithm": "Decision Tree", "target": "Heating_Load", "mae": 0.4071, "rmse": 0.5873, "r2": 0.9967},
            {"algorithm": "Decision Tree", "target": "Cooling_Load", "mae": 1.3253, "rmse": 2.2609, "r2": 0.9448},
            {"algorithm": "Random Forest", "target": "Heating_Load", "mae": 0.3446, "rmse": 0.4919, "r2": 0.9977},
            {"algorithm": "Random Forest", "target": "Cooling_Load", "mae": 1.1659, "rmse": 1.9043, "r2": 0.9609},
            {"algorithm": "Gradient Boosting", "target": "Heating_Load", "mae": 0.3600, "rmse": 0.5100, "r2": 0.9974},
            {"algorithm": "Gradient Boosting", "target": "Cooling_Load", "mae": 1.0500, "rmse": 1.7300, "r2": 0.9769},
            {"algorithm": "XGBoost", "target": "Heating_Load", "mae": 0.2800, "rmse": 0.4100, "r2": 0.9983},
            {"algorithm": "XGBoost", "target": "Cooling_Load", "mae": 0.6500, "rmse": 1.0200, "r2": 0.9942},
        ]


# Singleton instance loaded on backend startup
service = ModelService()
