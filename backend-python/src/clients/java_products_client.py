# src/clients/java_products_client.py
from __future__ import annotations

import os
import logging
from typing import Any, Dict, List, Optional

import httpx
from fastapi import HTTPException

from src.api.settings import DEV_MODE
from src.mock.mock_products import MOCK_PRODUCTS
from src.models.dto.java_raw_dto import JavaProductDto

JAVA_API_URL = os.getenv("JAVA_API_URL", "http://localhost:8080/api/v1").rstrip("/")
logger = logging.getLogger(__name__)


class JavaProductsClient:
    """
    Client aligné sur ProductController Java.

    Endpoints :
      - GET /products
      - GET /products/{id}
      - GET /products/low-stock
    """

    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.client = httpx.AsyncClient(timeout=10.0)

    # ------------------------------------------------------
    # Helpers internes
    # ------------------------------------------------------
    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    async def _get(self, endpoint: str) -> Any:
        url = f"{JAVA_API_URL}{endpoint}"
        logger.info(f"[JavaProductsClient] GET {url} (DEV_MODE={DEV_MODE})")

        if DEV_MODE:
            return self._mock(endpoint)

        try:
            resp = await self.client.get(url, headers=self._headers())
        except Exception as e:
            raise HTTPException(502, f"Cannot reach Java Product API: {str(e)}")

        if resp.status_code != 200:
            raise HTTPException(
                502,
                f"Java Product API error {resp.status_code}: {resp.text}"
            )

        return resp.json()

    # ------------------------------------------------------
    # Mocks DEV_MODE
    # ------------------------------------------------------
    def _mock(self, endpoint: str) -> Any:
        # Always return full mock list ; filtering is done in Python
        return MOCK_PRODUCTS

    # ------------------------------------------------------
    # Public API
    # ------------------------------------------------------
    async def get_all_products(self) -> List[JavaProductDto]:
        """
        GET /products
        """
        raw = await self._get("/products")
        return [JavaProductDto(**p) for p in raw]

    async def get_product(self, product_id: int) -> JavaProductDto:
        """
        GET /products/{id}
        """
        raw = await self._get("/products")

        for p in raw:
            if p.get("id") == product_id:
                return JavaProductDto(**p)

        raise HTTPException(404, f"Product {product_id} not found (DEV MODE)")

    async def get_low_stock_products(self) -> List[JavaProductDto]:
        """
        GET /products/low-stock
        DEV_MODE: simulate threshold logic
        """
        if DEV_MODE:
            raw = await self._get("/products")
            low_stock = [
                p
                for p in raw
                if p.get("stockQuantity", 0) <= p.get("lowStockThreshold", 0)
            ]
            return [JavaProductDto(**p) for p in low_stock]

        raw = await self._get("/products/low-stock")
        return [JavaProductDto(**p) for p in raw]

    async def close(self):
        await self.client.aclose()


# Convenience wrapper
async def get_all_products(token: Optional[str] = None) -> List[JavaProductDto]:
    c = JavaProductsClient(token)
    try:
        return await c.get_all_products()
    finally:
        await c.close()
