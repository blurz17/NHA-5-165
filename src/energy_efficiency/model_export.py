"""Model save / load / bundle utilities."""

import os
import joblib
from .config import CANDIDATES_DIR, PRODUCTION_DIR


def save_model(model, name: str, directory: str = None) -> str:
    """Save a model to a .joblib file. Returns the saved path."""
    directory = directory or CANDIDATES_DIR
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f"{name}.joblib")
    joblib.dump(model, path)
    return path


def load_model(name: str, directory: str = None):
    """Load a model from a .joblib file."""
    directory = directory or CANDIDATES_DIR
    return joblib.load(os.path.join(directory, f"{name}.joblib"))


def create_model_bundle(models: dict, preprocessors: dict,
                        metadata: dict = None) -> str:
    """
    Bundle models and preprocessors into a single production artifact.

    Parameters
    ----------
    models : dict mapping model name to fitted model object.
    preprocessors : dict mapping name to fitted preprocessor pipeline.
    metadata : optional extra info (feature names, performance, etc.).

    Returns
    -------
    Path to the saved model_bundle.joblib.
    """
    os.makedirs(PRODUCTION_DIR, exist_ok=True)
    bundle = {
        "models": models,
        "preprocessors": preprocessors,
        "metadata": metadata or {},
    }
    path = os.path.join(PRODUCTION_DIR, "model_bundle.joblib")
    joblib.dump(bundle, path)
    return path


def load_model_bundle(path: str = None) -> dict:
    """Load the production model bundle."""
    path = path or os.path.join(PRODUCTION_DIR, "model_bundle.joblib")
    return joblib.load(path)
