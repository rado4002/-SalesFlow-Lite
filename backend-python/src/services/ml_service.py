# src/services/ml_service.py

from __future__ import annotations

from datetime import timedelta
from typing import Dict, Any, List, Optional
import os

import numpy as np
import pandas as pd
from fastapi import HTTPException
from sklearn.linear_model import LinearRegression

from src.clients.java_sales_client import get_sales_history
from src.mock.sales_mock import generate_mock_sales
from src.data.ml_preprocessor import (
    clean_numeric,
    fill_missing_values,
    prepare_regression_features,
)

# ENV: dev / prod
ML_ENV = os.getenv("ML_ENV", "dev").lower()


# -------------------------------------------------------
# INTERNAL HELPERS
# -------------------------------------------------------

async def _load_sales_history(
    product_id: int,
    history_days: int,
    token: Optional[str],
) -> pd.DataFrame:
    """
    Load historical sales:
    - DEV → mock data
    - PROD → Java API
    Expects columns: date, quantity
    """
    if ML_ENV == "dev":
        df = generate_mock_sales(history_days)
    else:
        records = await get_sales_history(product_id, history_days, token)
        if not records:
            raise HTTPException(
                status_code=404,
                detail=f"No historical sales found for product_id={product_id}",
            )
        df = pd.DataFrame(records)

    if "date" not in df.columns or "quantity" not in df.columns:
        raise HTTPException(
            status_code=500,
            detail="Sales dataset must contain 'date' and 'quantity' columns.",
        )

    # Clean
    df = clean_numeric(df, col="quantity")
    df = fill_missing_values(df)

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    return df


def _compute_trend(pred: List[float]) -> str:
    """Return upward / downward / stable."""
    if len(pred) < 2:
        return "stable"

    start, end = pred[0], pred[-1]

    if end > start * 1.05:
        return "upward"
    if end < start * 0.95:
        return "downward"
    return "stable"


def _shopify_summary(pred: List[float], future_dates: List[str]) -> Dict[str, Any]:
    """Compute total, daily_average, peak_value, peak_day."""
    if not pred:
        return {
            "total": 0.0,
            "daily_average": 0.0,
            "peak_value": 0.0,
            "peak_day": None,
        }

    arr = np.array(pred, dtype=float)
    total = float(arr.sum())
    avg = float(arr.mean())
    peak_idx = int(arr.argmax())
    peak_value = float(arr[peak_idx])
    peak_day = future_dates[peak_idx] if future_dates else None

    return {
        "total": round(total, 2),
        "daily_average": round(avg, 2),
        "peak_value": round(peak_value, 2),
        "peak_day": peak_day,
    }


def _zscore_anomalies(df: pd.DataFrame, col: str = "quantity") -> List[Dict[str, Any]]:
    """
    Simple anomaly detection using Z-score.
    Detects:
      - HIGH_SPIKE
      - ZERO_DROP
      - VARIANCE_SHIFT
    """
    values = df[col].astype(float)
    mean = values.mean()
    std = values.std()

    if std == 0 or np.isnan(std):
        return []

    zscores = (values - mean) / std
    anomalies: List[Dict[str, Any]] = []

    for idx, z in zscores.items():
        if abs(z) < 3:  # seuil
            continue

        val = float(values.iloc[idx])
        date = df["date"].iloc[idx]

        if val == 0:
            atype = "ZERO_DROP"
        elif z > 0:
            atype = "HIGH_SPIKE"
        else:
            atype = "VARIANCE_SHIFT"

        severity = "high" if abs(z) >= 4 else "medium"

        explanation = {
            "HIGH_SPIKE": "Unusually high sales compared to normal.",
            "ZERO_DROP": "Sales unexpectedly dropped to zero.",
            "VARIANCE_SHIFT": "Unusual decrease in sales behavior.",
        }[atype]

        anomalies.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "value": val,
                "score": float(round(z, 3)),
                "severity": severity,
                "type": atype,
                "explanation": explanation,
            }
        )

    return anomalies


# -------------------------------------------------------
# PUBLIC — FORECAST (Linear Regression)
# -------------------------------------------------------

async def forecast_sales(
    product_id: int,
    history_days: int,
    forecast_days: int,
    token: Optional[str],
) -> Dict[str, Any]:
    """
    Shopify-style forecasting:
      - Linear Regression
      - N next days
      - summary (total, avg, peak)
      - trend (up/down/stable)
    """
    if forecast_days <= 0:
        raise HTTPException(status_code=400, detail="forecast_days must be > 0")

    df = await _load_sales_history(product_id, history_days, token)

    X, y, df_proc = prepare_regression_features(df)

    if len(X) < 2:
        raise HTTPException(
            status_code=400,
            detail="Not enough data points to train forecast model.",
        )

    model = LinearRegression()
    model.fit(X, y)

    last_index = int(df_proc["day_index"].iloc[-1])
    future_idx = np.arange(last_index + 1, last_index + 1 + forecast_days).reshape(
        -1, 1
    )

    y_pred = model.predict(future_idx)
    predictions = np.round(y_pred.astype(float), 2).tolist()

    last_date = df_proc["date"].iloc[-1]
    future_dates = [
        (last_date + timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(1, forecast_days + 1)
    ]

    summary = _shopify_summary(predictions, future_dates)
    trend = _compute_trend(predictions)

    return {
        "product_id": product_id,
        "dates": future_dates,
        "predictions": predictions,
        "trend": trend,
        "summary": summary,
    }


# -------------------------------------------------------
# PUBLIC — ANOMALIES (Z-Score)
# -------------------------------------------------------

async def detect_anomalies(
    product_id: int,
    history_days: int,
    token: Optional[str],
) -> Dict[str, Any]:
    """
    Underground anomaly detection using Z-score.
    """
    df = await _load_sales_history(product_id, history_days, token)
    anomalies = _zscore_anomalies(df)

    return {
        "product_id": product_id,
        "count": len(anomalies),
        "anomalies": anomalies,
    }
