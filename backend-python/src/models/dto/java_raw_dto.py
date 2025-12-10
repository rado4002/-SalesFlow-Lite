# src/models/dto/java_raw_dto.py
from __future__ import annotations

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# ====================================================
# 1. PRODUITS – Java ProductDto (utile partout)
# ====================================================
class JavaProductDto(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    stockQuantity: Optional[int] = 0
    lowStockThreshold: Optional[int] = 0
    description: Optional[str] = None
    imageUrl: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


# ====================================================
# 2. HISTORIQUE DE VENTE – essentiel pour ML & analytics
# ====================================================
class JavaSalesHistoryDto(BaseModel):
    productId: Optional[int] = None
    date: datetime
    quantity: float


# ====================================================
# 3. ITEM D'UNE VENTE – requis pour ventes & rapports
# ====================================================
class JavaSaleItemDto(BaseModel):
    productId: int
    quantity: float
    price: float  # prix unitaire

    model_config = ConfigDict(populate_by_name=True)


# ====================================================
# 4. VENTE COMPLÈTE – Analyse de ventes / PDF reports
# ====================================================
class JavaSaleDto(BaseModel):
    id: int
    saleDate: datetime = Field(..., alias="saleDate")
    totalAmount: float = Field(..., alias="totalAmount")
    items: List[JavaSaleItemDto]

    model_config = ConfigDict(populate_by_name=True)


# ====================================================
# 5. STOCK ANALYTICS (FUTUR ENDPOINT JAVA)
# ====================================================
class JavaStockLevelDto(BaseModel):
    productId: int
    currentStock: float
    minStock: float

    model_config = ConfigDict(populate_by_name=True)
