"""Model evaluation utilities."""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline


def evaluate_model(y_true, y_pred, target_name: str, model_name: str) -> dict:
    """
    Compute MAE, RMSE, and R² for a single target.

    Returns a dict with keys: Model, Target, MAE, RMSE, R².
    """
    return {
        "Model": model_name,
        "Target": target_name,
        "MAE": round(mean_absolute_error(y_true, y_pred), 4),
        "RMSE": round(np.sqrt(mean_squared_error(y_true, y_pred)), 4),
        "R²": round(r2_score(y_true, y_pred), 4),
    }


def cross_validate_model(model, preprocessor, X_train, y_train_col,
                         target_name: str, model_name: str, cv: int = 5) -> dict:
    """
    Run cross-validation and return mean/std R².
    """
    pipe = Pipeline([("prep", preprocessor), ("model", model)])
    scores = cross_val_score(pipe, X_train, y_train_col, cv=cv, scoring="r2")
    return {
        "Model": model_name,
        "Target": target_name,
        "CV R² mean": round(scores.mean(), 4),
        "CV R² std": round(scores.std(), 4),
    }
