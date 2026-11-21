"""Data loading utilities."""

import os
import pandas as pd
from sklearn.model_selection import train_test_split

from .config import (
    RAW_DATA_PATH, PROCESSED_DIR,
    FEATURES, TARGETS, RANDOM_STATE, TEST_SIZE,
)


def load_raw_data(path: str = None) -> pd.DataFrame:
    """Load the raw energy efficiency CSV."""
    path = path or RAW_DATA_PATH
    return pd.read_csv(path)


def load_processed_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load the saved train/test CSV files."""
    train = pd.read_csv(os.path.join(PROCESSED_DIR, "train.csv"))
    test = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))
    return train, test


def get_train_test_split(df: pd.DataFrame = None):
    """
    Split raw data into X_train, X_test, y_train, y_test.
    Returns (X_train, X_test, y_train, y_test).
    """
    if df is None:
        df = load_raw_data()
    X = df[FEATURES]
    y = df[TARGETS]
    return train_test_split(X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)
