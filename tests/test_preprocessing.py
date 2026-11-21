"""
Unit tests for data preprocessing and pipelines.
"""

import pytest
import pandas as pd
import numpy as np

from src.energy_efficiency.config import FEATURES, CAT_COLS
from src.energy_efficiency.preprocessing import build_preprocessor


@pytest.fixture
def sample_df():
    """Create a minimal representative sample DataFrame."""
    return pd.DataFrame({
        "Relative_Compactness": [0.98, 0.90, 0.82],
        "Surface_Area": [514.5, 563.5, 612.5],
        "Wall_Area": [294.0, 318.5, 318.5],
        "Roof_Area": [110.25, 122.50, 147.0],
        "Overall_Height": [7.0, 7.0, 3.5],
        "Orientation": [2, 3, 4],
        "Glazing_Area": [0.0, 0.10, 0.25],
        "Glazing_Area_Distribution": [0, 1, 2],
    })


def test_build_preprocessor_linear(sample_df):
    """Test standard scaling and one-hot encoding for linear models."""
    prep = build_preprocessor(scale=True, onehot=True, engineer=True)
    prep.fit(sample_df)
    transformed = prep.transform(sample_df)

    assert isinstance(transformed, np.ndarray)
    assert transformed.shape[0] == len(sample_df)
    # Numerical features (8) + One-hot columns
    assert transformed.shape[1] > len(FEATURES)


def test_build_preprocessor_tree(sample_df):
    """Test tree-based preprocessor (passthrough scaling and encoding)."""
    prep = build_preprocessor(scale=False, onehot=False, engineer=True)
    prep.fit(sample_df)
    transformed = prep.transform(sample_df)

    assert isinstance(transformed, np.ndarray)
    # Original 8 features + 2 engineered = 10 features
    assert transformed.shape == (3, 10)


def test_no_data_leakage(sample_df):
    """Verify that transformation doesn't alter source dataframe."""
    orig_copy = sample_df.copy()
    prep = build_preprocessor(scale=True, onehot=True, engineer=True)
    prep.fit_transform(sample_df)

    pd.testing.assert_frame_equal(sample_df, orig_copy)
