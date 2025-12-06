# backend-python/src/clients/java_sales_client.py
from __future__ import annotations

from typing import Any, Dict, List, Optional
import os
import logging

import httpx
from fastapi import HTTPException

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
JAVA_API_URL = os.getenv("JAVA_API_URL", "http://localhost:8080/api/v1").rstrip("/")
logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------- #
# DTO matching Java SalesHistoryDto
# --------------------------------------------------------------------------- #
class SalesHistoryDto:
    date: str          # "yyyy-MM-dd"
    quantity: int

    def __init__(self, date: str, quantity: int):
        self.date = date
        self.quantity = quantity

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "SalesHistoryDto":
        return cls(date=data["date"], quantity=data["quantity"])

    def dict(self) -> Dict[str, Any]:
        return {"date": self.date, "quantity": self.quantity}


# --------------------------------------------------------------------------- #
# Core client – one function per Java endpoint we need
# --------------------------------------------------------------------------- #
class JavaSalesClient:
    def __init__(self, token: Optional[str] = None):
        """
        token : JWT obtenu via /auth/login ou service-to-service token
        """
        self.token = token
        self.client = httpx.AsyncClient(timeout=15.0)

    # ------------------------------------------------------------------- #
    # Private helper – ajoute le header JWT si présent
    # ------------------------------------------------------------------- #
    async def _get(self, endpoint: str) -> Any:
        url = f"{JAVA_API_URL}{endpoint}"
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        logger.debug("GET %s (token=%s)", url, bool(self.token))
        response = await self.client.get(url, headers=headers)
        if response.status_code != 200:
            logger.error("Java returned %s: %s", response.status_code, response.text)
            raise HTTPException(
                status_code=502,
                detail=f"Java API error {response.status_code}: {response.text}",
            )
        return response.json()

    # ------------------------------------------------------------------- #
    # 1. History per product – EXACTLY what the Python side expects
    # ------------------------------------------------------------------- #
    async def get_product_sales_history(
        self,
        product_id: int,
        days: int = 30,
    ) -> List[SalesHistoryDto]:
        """
        Calls:
            GET /api/v1/sales/history/{productId}?days={days}
        Returns a list of SalesHistoryDto exactly matching Java SalesHistoryDto.
        """
        endpoint = f"/sales/history/{product_id}?days={days}"
        raw_data = await self._get(endpoint)

        if not isinstance(raw_data, list):
            raise HTTPException(
                status_code=502,
                detail="Java sales/history endpoint did not return a list",
            )

        return [
            SalesHistoryDto.from_dict(item) for item in raw_data
        ]

    # ------------------------------------------------------------------- #
    # Optional helpers (you already have them elsewhere, keep for completeness)
    # ------------------------------------------------------------------- #
    async def get_sales_today(self) -> List[Dict[str, Any]]:
        return await self._get("/sales/today")

    async def get_sales_history_all(self, days: int = 90) -> List[Dict[str, Any]]:
        return await self._get(f"/sales/history?days={days}")

    async def get_recent_sales(self, limit: int = 100) -> List[Dict[str, Any]]:
        return await self._get(f"/sales/recent?limit={limit}")

    # ------------------------------------------------------------------- #
    # Graceful shutdown
    # ------------------------------------------------------------------- #
    async def close(self):
        await self.client.aclose()


# --------------------------------------------------------------------------- #
# Convenience function (you can import it directly in services)
# --------------------------------------------------------------------------- #
async def get_sales_history(
    product_id: int,
    days: int = 30,
    token: Optional[str] = None,
) -> List[SalesHistoryDto]:
    """
    Simple wrapper used by most services.
    """
    client = JavaSalesClient(token=token)
    try:
        return await client.get_product_sales_history(product_id, days)
    finally:
        await client.close()