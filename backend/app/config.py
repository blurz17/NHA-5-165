"""Backend configuration and environment settings."""

import os
import sys

# Root directory of the repository
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Model bundle path (production)
MODEL_BUNDLE_PATH = os.path.join(BASE_DIR, "artifacts", "production", "model_bundle.joblib")
CANDIDATES_DIR = os.path.join(BASE_DIR, "artifacts", "candidates")

# Server settings
APP_NAME = "Building Energy Efficiency Prediction API"
APP_VERSION = "2.0.0"
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# CORS allowed origins (configured for Vercel frontend and local development)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://*.vercel.app",
    "*",
]
