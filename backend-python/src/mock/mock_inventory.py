# src/mock/mock_inventory_stock.py

from src.mock.mock_products import MOCK_PRODUCTS

MOCK_INVENTORY = [
    {
        "productId": p["id"],
        "currentStock": p.get("stockQuantity", 0),
        "minStock": p.get("lowStockThreshold", 0),
    }
    for p in MOCK_PRODUCTS
]
