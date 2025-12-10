# src/services/ml_enrichment_service.py

from __future__ import annotations
from typing import Dict, Any, Optional

from src.models.dto.java_raw_dto import JavaProductDto


def enrich_ml_result(
    result: Dict[str, Any],
    product: Optional[JavaProductDto],
) -> Dict[str, Any]:
    """
    Ajoute au résultat ML les infos produit venant du backend Java :
    - name
    - sku
    - price
    - category (si un jour tu l'ajoutes)
    """

    if product:
        result["product"] = {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "price": product.price,
            "description": product.description,
            "imageUrl": product.imageUrl,
            "lowStockThreshold": product.lowStockThreshold,
        }
    else:
        # Forecast global ou produit introuvable
        result["product"] = None

    return result
