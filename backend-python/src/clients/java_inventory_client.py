# src/clients/java_inventory_client.py
from __future__ import annotations

import os
import logging
from typing import Any, Dict, List, Optional

import httpx
from fastapi import HTTPException

from src.api.settings import DEV_MODE
from src.mock.mock_inventory import MOCK_INVENTORY
from src.models.dto.java_raw_dto import JavaInventoryItemDto

JAVA_API_URL = os.getenv("JAVA_API_URL", "http://localhost:8080/api/v1").rstrip("/")
logger = logging.getLogger(__name__)


class JavaInventoryClient:
    """
    Client aligné sur InventoryController Java.

    Endpoints :
      - GET /inventory
      - GET /inventory/{id}
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
        logger.info(f"[JavaInventoryClient] GET {url} (DEV_MODE={DEV_MODE})")

        if DEV_MODE:
            return self._mock(endpoint)

        try:
            resp = await self.client.get(url, headers=self._headers())
        except Exception as e:
            raise HTTPException(502, f"Cannot reach Java Inventory API: {str(e)}")

        if resp.status_code != 200:
            raise HTTPException(
                502,
                f"Java Inventory API error {resp.status_code}: {resp.text}"
            )

        return resp.json()

    # ------------------------------------------------------
    # Mocks DEV_MODE
    # ------------------------------------------------------
    def _mock(self, endpoint: str) -> Any:
        if endpoint == "/inventory":
            return MOCK_INVENTORY

        if endpoint.startswith("/inventory/"):
            try:
                wanted = int(endpoint.split("/")[-1])
                for item in MOCK_INVENTORY:
                    if item["id"] == wanted:
                        return item
            except Exception:
                pass
            raise HTTPException(404, f"Inventory item {wanted} not found (DEV MODE)")

        return MOCK_INVENTORY

    # ------------------------------------------------------
    # Public API
    # ------------------------------------------------------
    async def get_inventory(self) -> List[JavaInventoryItemDto]:
        """
        GET /inventory
        """
        raw = await self._get("/inventory")
        return [JavaInventoryItemDto(**item) for item in raw]

    async def get_inventory_item(self, item_id: int) -> JavaInventoryItemDto:
        """
        GET /inventory/{id}
        """
        raw = await self._get(f"/inventory/{item_id}")
        return JavaInventoryItemDto(**raw)

    async def close(self):
        await self.client.aclose()


# Convenience wrapper
async def get_inventory(token: Optional[str] = None) -> List[JavaInventoryItemDto]:
    c = JavaInventoryClient(token)
    try:
        return await c.get_inventory()
    finally:
        await c.close()
