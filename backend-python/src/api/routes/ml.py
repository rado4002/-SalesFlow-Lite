# src/api/routes/ml.py

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
    """
    Helper to extract raw JWT from get_current_user() output.
    Adapte cette fonction à ta structure réelle.
    """
    if isinstance(current_user, dict):
        # Essaie plusieurs clés possibles
        return (
            current_user.get("token")
            or current_user.get("access_token")
            or current_user.get("raw_token")
        )
    return None


@router.post("/forecast", response_model=ForecastResult)
async def forecast_endpoint(
    payload: ForecastRequest,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)

    try:
        result = await forecast_sales(
            product_id=payload.product_id,
            history_days=payload.history_days,
            forecast_days=payload.forecast_days,
            token=token,
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Forecasting failed: {e}",
        )


@router.post("/anomalies", response_model=AnomalyResponse)
async def anomalies_endpoint(
    payload: AnomalyRequest,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)

    try:
        result = await detect_anomalies(
            product_id=payload.product_id,
            history_days=payload.history_days,
            token=token,
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Anomaly detection failed: {e}",
        )
