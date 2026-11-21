"""Backward-compatibility re-export."""

from .energy_efficiency.config import (
    FEATURES,
    TARGETS,
    CAT_COLS,
)
from .energy_efficiency.preprocessing import build_preprocessor
from .energy_efficiency.feature_engineering import add_features

__all__ = ["build_preprocessor", "add_features", "FEATURES", "TARGETS", "CAT_COLS"]
