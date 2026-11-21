"""
Unit tests for feature engineering logic.
"""

import pandas as pd
from src.energy_efficiency.feature_engineering import add_features


def test_add_features_new_columns():
    """Verify engineered columns are correctly calculated."""
    df = pd.DataFrame({
        "Wall_Area": [300.0, 400.0],
        "Surface_Area": [600.0, 500.0],
        "Glazing_Area": [0.1, 0.4],
        "Overall_Height": [7.0, 3.5],
    })

    result = add_features(df, engineer=True)

    assert "Wall_Surface_Ratio" in result.columns
    assert "Glazing_x_Height" in result.columns

    # Test calculations
    assert result.loc[0, "Wall_Surface_Ratio"] == 300.0 / 600.0
    assert result.loc[0, "Glazing_x_Height"] == 0.1 * 7.0
    assert result.loc[1, "Wall_Surface_Ratio"] == 400.0 / 500.0
    assert result.loc[1, "Glazing_x_Height"] == 0.4 * 3.5


def test_add_features_drop_columns():
    """Verify specified columns are dropped."""
    df = pd.DataFrame({
        "Wall_Area": [300.0],
        "Surface_Area": [600.0],
        "Roof_Area": [150.0],
        "Glazing_Area": [0.1],
        "Overall_Height": [7.0],
    })

    result = add_features(df, engineer=True, drop=("Surface_Area", "Roof_Area"))

    assert "Surface_Area" not in result.columns
    assert "Roof_Area" not in result.columns
    assert "Wall_Surface_Ratio" in result.columns
