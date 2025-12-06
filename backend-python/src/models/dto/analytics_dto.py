# src/models/dto/analytics_dto.py

from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


# ---------------------------------------------------------
# 1. SalesRecordDTO
# ---------------------------------------------------------
class SalesRecordDTO(BaseModel):
    """
    Represents a single sales event transformed for analytics processing.
    - date: ISO date string (YYYY-MM-DD)
    - amount: quantity * price
    - product_id: reference to the product sold
    """
    date: str
    amount: float
    product_id: int


# ---------------------------------------------------------
# 2. SalesTrendDTO
# ---------------------------------------------------------
class SalesTrendDTO(BaseModel):
    """
    Represents a trend analysis over a given time period.
    - period: e.g., "2025-01", "2025-W03", "2025-Q1"
    - total_sales: total revenue for the period
    - growth_rate: % change compared to previous period
    """
    period: str
    total_sales: float
    growth_rate: float  # expressed as percentage, e.g., 12.5


# ---------------------------------------------------------
# 3. AnalyticsResultDTO
# ---------------------------------------------------------
class AnalyticsResultDTO(BaseModel):
    """
    Main analytics payload returned to the frontend.
    - metrics: computed KPIs (dict)
    - trends: list of SalesTrendDTO
    - timestamp: moment of analysis generation
    """
    metrics: Dict[str, Any]
    trends: List[SalesTrendDTO]
    timestamp: datetime
