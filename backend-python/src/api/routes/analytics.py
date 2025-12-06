# src/api/routes/analytics.py

from fastapi import APIRouter, Depends, HTTPException, Query
from src.services.analytics_service import get_sales_trend
from src.api.dependencies import get_current_user
from src.models.schemas import SalesQuery

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)


@router.get("/sales-trend")
async def sales_trend_endpoint(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns sales trend analytics between start_date and end_date.

    DEV MODE:
        - No JWT required
        - Mock sales data used in analytics_service

    PROD MODE:
        - Requires valid Java-issued JWT
        - Token validated via JavaJWTValidator
        - Token forwarded to Java backend for real sales data
    """

    # ---------------------------------------------
    # 1️⃣ Validate the dates via SalesQuery DTO
    # ---------------------------------------------
    try:
        query = SalesQuery(start_date=start_date, end_date=end_date)
    except Exception as e:
        raise HTTPException(400, f"Invalid date input: {str(e)}")

    # Extract unified token (DEV or PROD)
    token = current_user["token"]

    # ---------------------------------------------
    # 2️⃣ Fetch analytics from Python service
    # ---------------------------------------------
    try:
        analytics = await get_sales_trend(
            auth_token=token,
            start_date=query.start_date,
            end_date=query.end_date
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            500,
            f"Analytics processing failed: {str(e)}"
        )

    # ---------------------------------------------
    # 3️⃣ Structured API Response
    # ---------------------------------------------
    return {
        "status": "success",
        "mode": current_user["mode"],
        "user": {
            "username": current_user["username"],
            "roles": current_user["roles"],
        },
        "analytics": analytics
    }
