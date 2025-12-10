# ============================================================
#  ml_service.py — FINAL GLOBAL VERSION (PRODUCT + GLOBAL)
# ============================================================

from __future__ import annotations

import os
import json
from datetime import timedelta
from typing import Dict, Any, List, Optional

import numpy as np
import pandas as pd
from fastapi import HTTPException
from sklearn.linear_model import LinearRegression

from src.data.cache_manager import get_cache, set_cache, TTL_ANALYTICS

# Java + Mock
from src.clients.java_sales_client import JavaSalesClient
from src.mock.sales_mock import load_mock_sales
# Preprocessing
from src.data.ml_preprocessor import (
    clean_numeric,
    fill_missing_values,
    prepare_regression_features,
)

from src.models.dto.analytics_dto import AnalyticsPeriod


ML_ENV = os.getenv("ML_ENV", "dev").lower()


# ============================================================
# LOAD SALES HISTORY (PRODUCT OR GLOBAL)
# ============================================================
async def _load_sales_history(
    product_id: Optional[int],
    history_days: int,
    token: Optional[str],
) -> pd.DataFrame:

    # DEV MODE → generate mock global or product-based
    if ML_ENV == "dev":
       df = load_mock_sales(product_id, history_days)

    else:
        client = JavaSalesClient(token)
        try:
            if product_id is None:
                # GLOBAL HISTORY
                raw = await client.get_sales_history_global(days=history_days)
            else:
                raw = await client.get_sales_history_product(product_id, days=history_days)
        finally:
            await client.close()

        if not raw:
            target = "GLOBAL" if product_id is None else f"product {product_id}"
            raise HTTPException(404, f"No sales found for {target}")

        df = pd.DataFrame([item.model_dump() for item in raw])

    if "date" not in df.columns or "quantity" not in df.columns:
        raise HTTPException(500, "Dataset must include 'date' and 'quantity'")

    # Clean & standardize
    df = clean_numeric(df, "quantity")
    df = fill_missing_values(df)

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    return df


# ============================================================
# TREND ANALYSIS
# ============================================================
def _compute_trend(pred: List[float]) -> str:
    if len(pred) < 2:
        return "stable"

    start, end = pred[0], pred[-1]

    if end > start * 1.05:
        return "upward"
    if end < start * 0.95:
        return "downward"
    return "stable"


# ============================================================
# SUMMARY (Shopify-style)
# ============================================================
def _shopify_summary(
    pred: List[float],
    dates: List[str],
    period_label: str,      # 👈 ajouté ici
) -> Dict[str, Any]:

    if not pred:
        return {
            "total": 0.0,
            "daily_average": 0.0,
            "peak_value": 0.0,
            "peak_day": None,
            "trend": "stable",
            "period_label": period_label,   # 👈 ajouté ici aussi
        }


    arr = np.array(pred, dtype=float)
    peak_idx = int(arr.argmax())

    return {
        "total": float(arr.sum()),
        "daily_average": float(arr.mean()),
        "peak_value": float(arr[peak_idx]),
        "peak_day": dates[peak_idx],
        "trend": _compute_trend(pred),\
        "period_label": period_label,
    }


# ============================================================
# FORECAST (PRODUCT OR GLOBAL)
# ============================================================
async def forecast_sales(
    product_id: Optional[int],
    history_days: int,
    forecast_days: int,
    period: AnalyticsPeriod,
    token: Optional[str],
) -> Dict[str, Any]:

    cache_key = f"ml:forecast:{product_id}:{history_days}:{forecast_days}:{ML_ENV}"
    cached = get_cache(cache_key)
    if cached:
        return json.loads(cached) 

    if forecast_days <= 0:
        raise HTTPException(400, "forecast_days must be > 0")

    df = await _load_sales_history(product_id, history_days, token)

    # Prepare regression inputs
    X, y, df_proc = prepare_regression_features(df)
    if len(X) < 2:
        raise HTTPException(400, "Not enough historical data to train model")

    model = LinearRegression()
    model.fit(X, y)

    # Predict next N days
    last_idx = int(df_proc["day_index"].iloc[-1])
    future_idx = np.arange(last_idx + 1, last_idx + 1 + forecast_days).reshape(-1, 1)

    predictions = np.round(model.predict(future_idx).astype(float), 2).tolist()

    last_date = df_proc["date"].iloc[-1]
    future_dates = [
        (last_date + timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(1, forecast_days + 1)
    ]

    summary = _shopify_summary(
    predictions,
    future_dates,
    period.value
)

    result = {
        "product_id": product_id,
        "dates": future_dates,
        "predictions": predictions,
        "summary": summary,
    }

    json_str = json.dumps(result, default=str)
    set_cache(cache_key, json_str, TTL_ANALYTICS)

    return result

# ============================================================
# ANOMALY DETECTION (PRODUCT OR GLOBAL)
# ============================================================
def _zscore_anomalies(df: pd.DataFrame) -> List[Dict[str, Any]]:
    values = df["quantity"].astype(float)
    mean, std = values.mean(), values.std()

    if std == 0 or np.isnan(std):
        return []

    anomalies = []
    zscores = (values - mean) / std

    for idx, z in zscores.items():
        if abs(z) < 3:
            continue

        raw_date = df["date"].iloc[idx]
        date = raw_date.strftime("%Y-%m-%d")

        value = float(values.iloc[idx])

        if value == 0:
            atype = "ZERO_DROP"
        elif z > 0:
            atype = "HIGH_SPIKE"
        else:
            atype = "VARIANCE_SHIFT"

        explanation = {
            "HIGH_SPIKE": "Unusually high sales spike.",
            "ZERO_DROP": "Sales dropped to zero unexpectedly.",
            "VARIANCE_SHIFT": "Unusual decrease in sales pattern.",
        }[atype]

        anomalies.append({
            "date": date,
            "value": value,
            "score": round(float(z), 3),
            "severity": "high" if abs(z) >= 4 else "medium",
            "type": atype,
            "explanation": explanation,
        })

    return anomalies


# ============================================================
# PUBLIC — ANOMALY DETECTION
# ============================================================
async def detect_anomalies(
    product_id: Optional[int],
    history_days: int,
    period: AnalyticsPeriod,
    token: Optional[str],
) -> Dict[str, Any]:

    cache_key = f"ml:anomalies:{product_id}:{history_days}:{period.value}:{ML_ENV}"
    cached = get_cache(cache_key)
    if cached:
        return json.loads(cached) 
    df = await _load_sales_history(product_id, history_days, token)
    anomalies = _zscore_anomalies(df)

    result = {
        "product_id": product_id,
        "period": period.value,
        "count": len(anomalies),
        "anomalies": anomalies,
    }

    json_str = json.dumps(result, default=str)
    set_cache(cache_key, json_str, TTL_ANALYTICS)

    return result
