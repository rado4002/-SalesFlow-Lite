# src/services/analytics_service.py

from typing import List, Dict, Any
from collections import defaultdict
from datetime import datetime, timedelta

from src.api.settings import DEV_MODE
from src.models.schemas import ProductStock, StockAlert
from src.clients.java_auth_client import java_api_client


# ---------------------------------------------------------------------
# DEV MODE MOCK DATA
# ---------------------------------------------------------------------
FAKE_PRODUCTS = [
    {"id": 1, "name": "Milk", "currentStock": 3, "minStock": 10},
    {"id": 2, "name": "Bread", "currentStock": 12, "minStock": 5},
    {"id": 3, "name": "Sugar", "currentStock": 1, "minStock": 8},
    {"id": 4, "name": "Rice", "currentStock": 6, "minStock": 6},
]

FAKE_SALES = [
    # Daily sales x price
    {"date": "2025-01-01", "quantity": 3, "price": 5},
    {"date": "2025-01-01", "quantity": 1, "price": 3},
    {"date": "2025-01-02", "quantity": 5, "price": 2},
    {"date": "2025-01-03", "quantity": 2, "price": 7},
    {"date": "2025-01-04", "quantity": 10, "price": 1},
]


# ---------------------------------------------------------------------
# 1️⃣ LOW STOCK ALERTS (DEV + PROD)
# ---------------------------------------------------------------------
async def get_low_stock_alerts(auth_token: str = None) -> List[StockAlert]:
    """
    DEV MODE:
        Uses mock FAKE_PRODUCTS list.

    PROD MODE:
        Fetches real product stock data from Java API.
    """

    if DEV_MODE:
        products = FAKE_PRODUCTS
    else:
        products = await java_api_client.get(
            endpoint="products",
            token=auth_token
        )

    alerts = []
    for item in products:
        current = item["currentStock"]
        minimum = item["minStock"]

        if current < minimum:
            severity = get_severity_level(current, minimum)
            alerts.append(
                StockAlert(
                    product_id=item["id"],
                    message=f"{item['name']} is below minimum stock",
                    severity=severity
                )
            )

    return alerts


def get_severity_level(current: int, minimum: int) -> str:
    ratio = current / minimum

    if ratio <= 0.25:
        return "high"
    elif ratio <= 0.50:
        return "medium"
    return "low"


# ---------------------------------------------------------------------
# 2️⃣ SALES TREND (DEV + PROD)
# ---------------------------------------------------------------------
async def get_sales_trend(
    auth_token: str,
    start_date: str,
    end_date: str
) -> Dict[str, Any]:
    """
    DEV MODE:
        Uses FAKE_SALES filtered by date.

    PROD MODE:
        Uses java_auth_client to fetch real sales.
    """

    # -----------------------------
    # DEV MODE → use FAKE data
    # -----------------------------
    if DEV_MODE:
        # Filter fake sales by date range
        filtered = [
            s for s in FAKE_SALES
            if start_date <= s["date"] <= end_date
        ]
        raw_sales = filtered

    # -----------------------------
    # PROD MODE → call Java API
    # -----------------------------
    else:
        raw_sales = await java_api_client.fetch_sales_data(
            token=auth_token,
            start_date=start_date,
            end_date=end_date
        )

    # If empty
    if not raw_sales:
        return {
            "daily_totals": [],
            "total_revenue": 0,
            "trend_direction": "stable",
            "percent_change": 0
        }

    # -----------------------------------
    # Aggregate totals per day
    # -----------------------------------
    daily_map = defaultdict(float)

    for sale in raw_sales:
        date = sale["date"]
        amount = sale["quantity"] * sale["price"]
        daily_map[date] += amount

    # Sort + convert to list
    daily_totals = [
        {"date": d, "total": round(v, 2)}
        for d, v in sorted(daily_map.items(), key=lambda x: x[0])
    ]

    # -----------------------------------
    # Total revenue
    # -----------------------------------
    total_revenue = sum(x["total"] for x in daily_totals)

    # -----------------------------------
    # Trend analysis
    # -----------------------------------
    if len(daily_totals) >= 2:
        first = daily_totals[0]["total"]
        last = daily_totals[-1]["total"]

        if first == 0:
            percent_change = 100 if last > 0 else 0
        else:
            percent_change = ((last - first) / first) * 100

        if last > first:
            trend_direction = "up"
        elif last < first:
            trend_direction = "down"
        else:
            trend_direction = "stable"
    else:
        trend_direction = "stable"
        percent_change = 0

    return {
        "daily_totals": daily_totals,
        "total_revenue": round(total_revenue, 2),
        "trend_direction": trend_direction,
        "percent_change": round(percent_change, 2)
    }
