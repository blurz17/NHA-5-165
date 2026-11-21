"""Preprocessing pipeline builder."""

from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from .config import FEATURES, CAT_COLS
from .feature_engineering import add_features


def build_preprocessor(scale: bool = True, onehot: bool = True,
                       engineer: bool = True, drop: tuple = ()) -> Pipeline:
    """
    Build a scikit-learn preprocessing Pipeline.

    Parameters
    ----------
    scale   : StandardScale numeric columns (use True for linear models).
    onehot  : One-hot encode categorical columns (use True for linear models).
    engineer: Create engineered features (Wall_Surface_Ratio, Glazing_x_Height).
    drop    : Feature column names to drop before transforming.

    Returns
    -------
    sklearn Pipeline with two steps: 'features' and 'transform'.
    """
    num_cols = [c for c in FEATURES if c not in CAT_COLS and c not in drop]
    if engineer:
        num_cols += ["Wall_Surface_Ratio", "Glazing_x_Height"]

    num_tf = StandardScaler() if scale else "passthrough"
    cat_tf = (
        OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        if onehot else "passthrough"
    )

    ct = ColumnTransformer([
        ("num", num_tf, num_cols),
        ("cat", cat_tf, CAT_COLS),
    ])

    return Pipeline([
        ("features", FunctionTransformer(
            add_features,
            kw_args={"engineer": engineer, "drop": drop},
        )),
        ("transform", ct),
    ])
