# src/models/ml_schemas.py

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class ForecastRequest(BaseModel):
    product_id: int
    history_days: int = 90
    forecast_days: int = 7


class ForecastSummary(BaseModel):
    total: float
    daily_average: float
    peak_value: float
    peak_day: Optional[str]


class ForecastResult(BaseModel):
    product_id: int
    dates: List[str]
    predictions: List[float]
    trend: str
    summary: ForecastSummary


class AnomalyRequest(BaseModel):
    product_id: int
    history_days: int = 90


class AnomalyResult(BaseModel):
    date: str
    value: float
    score: float
    severity: str
    type: str
    explanation: str


class AnomalyResponse(BaseModel):
    product_id: int
    count: int
    anomalies: List[AnomalyResult]
