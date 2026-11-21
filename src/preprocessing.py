import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

FEATURES = [
    "Relative_Compactness", "Surface_Area", "Wall_Area", "Roof_Area",
    "Overall_Height", "Orientation", "Glazing_Area", "Glazing_Area_Distribution",
]
TARGETS = ["Heating_Load", "Cooling_Load"]
CAT_COLS = ["Orientation", "Glazing_Area_Distribution"]

def add_features(X, engineer=True, drop=()):
    X = X.copy()
    if engineer:
        X["Wall_Surface_Ratio"] = X["Wall_Area"] / X["Surface_Area"]
        X["Glazing_x_Height"] = X["Glazing_Area"] * X["Overall_Height"]
    return X.drop(columns=list(drop))

def build_preprocessor(scale=True, onehot=True, engineer=True, drop=()):
    num_cols = [c for c in FEATURES if c not in CAT_COLS and c not in drop]
    if engineer:
        num_cols += ["Wall_Surface_Ratio", "Glazing_x_Height"]
    num_tf = StandardScaler() if scale else "passthrough"
    cat_tf = OneHotEncoder(handle_unknown="ignore", sparse_output=False) if onehot else "passthrough"
    ct = ColumnTransformer([("num", num_tf, num_cols), ("cat", cat_tf, CAT_COLS)])
    return Pipeline([
        ("features", FunctionTransformer(add_features, kw_args={"engineer": engineer, "drop": drop})),
        ("transform", ct),
    ])
