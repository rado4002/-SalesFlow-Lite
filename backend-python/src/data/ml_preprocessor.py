# src/data/ml_preprocessor.py

from __future__ import annotations

from typing import Tuple

import numpy as np
import pandas as pd


def clean_numeric(df: pd.DataFrame, col: str = "quantity") -> pd.DataFrame:
    """
    Ensure quantity is numeric, drop NaNs/negatives.
    """
    df = df.copy()

    df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=[col])

    # optional: remove negatives
    df = df[df[col] >= 0]

    return df


def fill_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Fill missing dates with quantity = 0.
    Assumes 'date' column exists.
    """
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    full_index = pd.date_range(df["date"].min(), df["date"].max(), freq="D")
    df = df.set_index("date").reindex(full_index)

    # rename index back to date
    df.index.name = "date"
    df = df.reset_index()

    if "quantity" in df.columns:
        df["quantity"] = df["quantity"].fillna(0)

    return df


def prepare_regression_features(
    df: pd.DataFrame,
) -> Tuple[np.ndarray, np.ndarray, pd.DataFrame]:
    """
    Prepare X, y and processed df for Linear Regression.

    Input df columns:
      - date
      - quantity
    Output:
      - X: day_index column as 2D
      - y: quantity values
      - df with 'date', 'quantity', 'day_index'
    """
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    df["day_index"] = np.arange(len(df))

    X = df["day_index"].values.reshape(-1, 1)
    y = df["quantity"].astype(float).values

    return X, y, df
