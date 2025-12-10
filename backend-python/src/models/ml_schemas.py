from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel
from src.models.dto.analytics_dto import AnalyticsPeriod


# ============================================================
# FORECAST REQUEST
# ============================================================
class ForecastRequest(BaseModel):
    product_id: Optional[int] = None
    history_days: int = 90
    forecast_days: int = 7
    period: AnalyticsPeriod = AnalyticsPeriod.daily


# ============================================================
# FORECAST SUMMARY
# ============================================================
class ForecastSummary(BaseModel):
    total: float
    daily_average: float
    peak_value: float
    peak_day: Optional[str]
    trend: str
    period_label: Optional[str]


# ============================================================
# FORECAST RESULT
# ============================================================
class ForecastResult(BaseModel):
    product_id: Optional[int]
    dates: List[str]
    predictions: List[float]
    summary: ForecastSummary


# ============================================================
# ANOMALY REQUEST
# ============================================================
class AnomalyRequest(BaseModel):
    product_id: Optional[int] = None
    history_days: int = 90
    period: AnalyticsPeriod = AnalyticsPeriod.daily


# ============================================================
# ANOMALY RESULT
# ============================================================
class AnomalyResult(BaseModel):
    date: str
    value: float
    score: float
    severity: str
    type: str
    explanation: str


# ============================================================
# ANOMALY RESPONSE
# ============================================================
class AnomalyResponse(BaseModel):
    product_id: Optional[int]
    period: AnalyticsPeriod
    count: int
    anomalies: List[AnomalyResult]
