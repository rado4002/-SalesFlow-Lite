# src/api/routes/analytics.py

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Optional

from src.api.dependencies import get_current_user
from src.models.dto.analytics_dto import AnalyticsPeriod
from src.services.analytics_service import (
    compute_stock_analytics,
    compute_sales_analytics,
)

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"],
)


# -----------------------------------------------------------
# TOKEN EXTRACTOR — version stable et unifiée
# -----------------------------------------------------------
def _extract_token(current_user: Any) -> Optional[str]:
    """
    Robust extractor compatible with:
    {
        "token": "...",
        "access_token": "...",
        "raw_token": "...",
        ...
    }
    """
    if isinstance(current_user, dict):
        return (
            current_user.get("token")
            or current_user.get("access_token")
            or current_user.get("raw_token")
            or current_user.get("jwt")
        )
    return None


# -----------------------------------------------------------
# STOCK ANALYTICS
# -----------------------------------------------------------
@router.get("/stock")
async def stock_analytics(
    period: AnalyticsPeriod = AnalyticsPeriod.daily,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    return await compute_stock_analytics(
        period=period,
        token=token,
    )


# -----------------------------------------------------------
# SALES ANALYTICS
# -----------------------------------------------------------
@router.get("/sales")
async def sales_analytics(
    period: AnalyticsPeriod = AnalyticsPeriod.daily,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    return await compute_sales_analytics(
        period=period,
        token=token,
    )
