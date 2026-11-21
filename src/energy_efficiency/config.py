"""Project-wide constants and paths."""

import os

# ── Feature & Target definitions ──
FEATURES = [
    "Relative_Compactness", "Surface_Area", "Wall_Area", "Roof_Area",
    "Overall_Height", "Orientation", "Glazing_Area", "Glazing_Area_Distribution",
]
TARGETS = ["Heating_Load", "Cooling_Load"]
CAT_COLS = ["Orientation", "Glazing_Area_Distribution"]

# ── Reproducibility ──
RANDOM_STATE = 42
TEST_SIZE = 0.2

# ── Paths (relative to project root) ──
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW_DATA_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "energy_efficiency_data.csv")
PROCESSED_DIR = os.path.join(PROJECT_ROOT, "data", "processed")
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, "artifacts")
CANDIDATES_DIR = os.path.join(ARTIFACTS_DIR, "candidates")
PRODUCTION_DIR = os.path.join(ARTIFACTS_DIR, "production")
REPORTS_DIR = os.path.join(PROJECT_ROOT, "reports")
