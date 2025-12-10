from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Optional

from src.api.dependencies import get_current_user
from src.services.ml_service import forecast_sales, detect_anomalies

from src.models.ml_schemas import (
    ForecastRequest,
    ForecastResult,
    AnomalyRequest,
    AnomalyResponse,
)

router = APIRouter(prefix="/api/v1/ml", tags=["Machine Learning"])


def _extract_token(current_user: Any) -> Optional[str]:
    if isinstance(current_user, dict):
        return (
            current_user.get("token")
            or current_user.get("access_token")
            or current_user.get("raw_token")
            or current_user.get("jwt")
        )
    return None


# -----------------------------------------------------------
# FORECAST ENDPOINT
# -----------------------------------------------------------
@router.post("/forecast", response_model=ForecastResult)
async def forecast_endpoint(
    payload: ForecastRequest,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)
    print("=== RAW PAYLOAD RECEIVED BY BACKEND ===")
    print(payload)
    print("=======================================")
    try:
        data = await forecast_sales(
            product_id=payload.product_id,      # NOW SUPPORTS GLOBAL
            history_days=payload.history_days,
            forecast_days=payload.forecast_days,
            period=payload.period,
            token=token,
        )
        return data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Forecasting failed: {str(e)}")


# -----------------------------------------------------------
# ANOMALIES ENDPOINT
# -----------------------------------------------------------
@router.post("/anomalies", response_model=AnomalyResponse)
async def anomalies_endpoint(
    payload: AnomalyRequest,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)

    try:
        data = await detect_anomalies(
            product_id=payload.product_id,      # GLOBAL OR PRODUCT
            history_days=payload.history_days,
            period=payload.period,
            token=token,
        )
        return data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Anomaly detection failed: {str(e)}")
