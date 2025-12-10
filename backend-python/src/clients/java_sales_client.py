# src/clients/java_sales_client.py
from __future__ import annotations

import os
import logging
from typing import Any, Dict, List, Optional

import httpx
from fastapi import HTTPException

from src.api.settings import DEV_MODE
from src.mock.mock_sales import (
    MOCK_TODAY_SALES,
    MOCK_SALES_PERIOD,
    MOCK_SALES_HISTORY,
    MOCK_RECENT_SALES,
)
from src.models.dto.java_raw_dto import JavaSaleDto, JavaSalesHistoryDto

JAVA_API_URL = os.getenv("JAVA_API_URL", "http://localhost:8080/api/v1").rstrip("/")
logger = logging.getLogger(__name__)


class JavaSalesClient:
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.client = httpx.AsyncClient(timeout=20.0)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    def _normalize_response(self, raw: Any) -> List[dict] | dict:
        """
        Java peut renvoyer :
        - un dict (ex: une seule vente)
        - une liste de dicts (liste de ventes)
        - {"data": [...]}, {"sales": [...]}, etc.
        On normalise tout ça proprement.
        """
        if isinstance(raw, list):
            return raw
        if isinstance(raw, dict):
            # Cherche une clé qui contient une liste
            for key in ["data", "sales", "content", "items", "result", "value"]:
                if key in raw and isinstance(raw[key], list):
                    return raw[key]
            # Sinon c'est probablement l'objet seul
            return raw
        return raw  # fallback

    # ------------------------------------------------------------------
    # Mocks (DEV_MODE)
    # ------------------------------------------------------------------
    def _mock(self, endpoint: str) -> Any:
        if endpoint.startswith("/sales/today"):
            return MOCK_TODAY_SALES
        if "start_date" in endpoint or "end_date" in endpoint:
            return MOCK_SALES_PERIOD
        if endpoint.startswith("/sales/recent"):
            return MOCK_RECENT_SALES
        if endpoint.startswith("/sales/history"):
            return MOCK_SALES_HISTORY
        return {"error": "mock not found"}

    # ------------------------------------------------------------------
    # Requêtes réelles
    # ------------------------------------------------------------------
    async def _get(self, endpoint: str) -> Any:
        url = f"{JAVA_API_URL}{endpoint}"
        logger.info(f"[SalesClient] GET {url} (DEV_MODE={DEV_MODE})")

        if DEV_MODE:
            return self._mock(endpoint)

        try:
            resp = await self.client.get(url, headers=self._headers())
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Java Sales API error {e.response.status_code}: {e.response.text}")
            raise HTTPException(status_code=502, detail=f"Java Sales API error: {e.response.status_code}")
        except Exception as e:
            logger.exception("Cannot reach Java Sales API")
            raise HTTPException(status_code=502, detail=f"Cannot reach Java Sales API: {str(e)}")

    async def _post(self, endpoint: str, payload: Dict[str, Any]) -> Any:
        url = f"{JAVA_API_URL}{endpoint}"
        if DEV_MODE:
            return {"dev_mode": True, "payload": payload}

        resp = await self.client.post(url, json=payload, headers=self._headers())
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # PUBLIC API – CORRIGÉE À 1000%
    # ------------------------------------------------------------------
    async def get_sales_today(self) -> JavaSaleDto:
        raw = await self._get("/sales/today")
        data = self._normalize_response(raw)
        # /sales/today renvoie généralement un seul objet
        return JavaSaleDto.model_validate(data)

    async def get_sales_period(self, start_date: str, end_date: str) -> List[JavaSaleDto]:
        raw = await self._get(f"/sales?start_date={start_date}&end_date={end_date}")
        data = self._normalize_response(raw)
        if not isinstance(data, list):
            data = [data]  # au cas où Java renvoie un seul objet
        return [JavaSaleDto.model_validate(item) for item in data if isinstance(item, dict)]

    async def get_recent_sales(self, limit: int = 100) -> List[JavaSaleDto]:
        raw = await self._get(f"/sales/recent?limit={limit}")
        data = self._normalize_response(raw)
        return [JavaSaleDto.model_validate(item) for item in data if isinstance(item, dict)]

    async def get_sales_history_global(self, days: int = 90) -> List[JavaSalesHistoryDto]:
        raw = await self._get(f"/sales/history?days={days}")
        data = self._normalize_response(raw)
        return [JavaSalesHistoryDto.model_validate(item) for item in data if isinstance(item, dict)]

    async def get_sales_history_product(self, product_id: int, days: int = 30) -> List[JavaSalesHistoryDto]:
        raw = await self._get(f"/sales/history/{product_id}?days={days}")
        data = self._normalize_response(raw)
        return [JavaSalesHistoryDto.model_validate(item) for item in data if isinstance(item, dict)]

    # POST
    async def create_sale(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/sales", payload)

    async def bulk_sales(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/sales/bulk", payload)

    # ------------------------------------------------------------------
    async def close(self):
        await self.client.aclose()


# ----------------------------------------------------------------------
# Convenience wrappers (utilisés dans les services)
# ----------------------------------------------------------------------
async def get_today_sales(token: Optional[str] = None) -> JavaSaleDto:
    client = JavaSalesClient(token)
    try:
        return await client.get_sales_today()
    finally:
        await client.close()


async def get_sales_period(start: str, end: str, token: Optional[str] = None) -> List[JavaSaleDto]:
    client = JavaSalesClient(token)
    try:
        return await client.get_sales_period(start, end)
    finally:
        await client.close()