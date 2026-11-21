"""Feature engineering utilities."""

import pandas as pd


def add_features(X: pd.DataFrame, engineer: bool = True, drop: tuple = ()) -> pd.DataFrame:
    """
    Add engineered features to the dataframe.

    New features:
      - Wall_Surface_Ratio = Wall_Area / Surface_Area
      - Glazing_x_Height   = Glazing_Area * Overall_Height

    Parameters
    ----------
    X : DataFrame with the original 8 features.
    engineer : If True, create the two new features.
    drop : Column names to drop after engineering.

    Returns
    -------
    DataFrame with (optionally) added features and dropped columns.
    """
    X = X.copy()
    if engineer:
        X["Wall_Surface_Ratio"] = X["Wall_Area"] / X["Surface_Area"]
        X["Glazing_x_Height"] = X["Glazing_Area"] * X["Overall_Height"]
    return X.drop(columns=list(drop))
