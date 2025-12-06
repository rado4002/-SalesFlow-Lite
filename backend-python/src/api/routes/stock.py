# src/api/routes/stock.py

from fastapi import APIRouter, Depends, HTTPException
from src.api.dependencies import get_current_user
from src.services.analytics_service import get_low_stock_alerts

router = APIRouter(
    prefix="/api/v1/stock",
    tags=["Stock"]
)


@router.get("/alerts")
async def stock_alerts(current_user: dict = Depends(get_current_user)):
    """
    Returns low-stock alerts.
    In DEV mode → uses mock data.
    In PROD mode → will call Java later if needed.
    """

    try:
        # No token needed for mock version
        alerts = await get_low_stock_alerts()
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch stock alerts: {str(e)}")

    return {
        "status": "success",
        "mode": current_user["mode"],
        "alerts": alerts
    }
