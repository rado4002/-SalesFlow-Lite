"""
Schema definitions for Excel/CSV uploads.

This file contains ONLY dictionary schemas used by file_processor.py
for validating Excel / CSV uploads before sending to Java.

No logic. Only static schema definitions.
"""

# ============================================================
# SALES IMPORT SCHEMA (aligned with Java CreateSaleRequest)
# ============================================================

REQUIRED_SALES_SCHEMA = {
    "product_id": {
        "type": "int",
        "required": True,
        "description": "Matches Java field CreateSaleRequest.items[].productId"
    },
    "quantity": {
        "type": "float",
        "required": True,
        "rules": [">0"],
        "description": "Quantity sold → must be > 0"
    },
    "unit_price": {
        "type": "float",
        "required": False,
        "rules": [">=0"],
        "description": "Override unitPrice if needed (optional)"
    },
    "sale_date": {
        "type": "date",
        "required": True,
        "format": "%Y-%m-%d",
        "description": "Matches Java Sale.saleDate"
    },
    "sku": {
        "type": "str",
        "required": False,
        "description": "Optional but helps match products"
    }
}


# ============================================================
# INVENTORY IMPORT SCHEMA (for bulk updates or initial load)
# ============================================================

REQUIRED_INVENTORY_SCHEMA = {
    "product_id": {
        "type": "int",
        "required": True,
        "description": "Java Product.id"
    },
    "stock_quantity": {
        "type": "float",
        "required": True,
        "rules": [">=0"],
        "description": "Matches Java Product.stockQuantity"
    },
    "low_stock_threshold": {
        "type": "float",
        "required": False,
        "rules": [">=0"],
        "description": "Java Product.lowStockThreshold (optional)"
    },
    "cost": {
        "type": "float",
        "required": False,
        "rules": [">=0"],
        "description": "Purchase price (for financial analytics)"
    }
}


# ============================================================
# PRODUCT CATALOG IMPORT (optional future feature)
# ============================================================

REQUIRED_PRODUCT_SCHEMA = {
    "name": {
        "type": "str",
        "required": True
    },
    "sku": {
        "type": "str",
        "required": True
    },
    "price": {
        "type": "float",
        "required": True,
        "rules": [">=0"]
    },
    "stock_quantity": {
        "type": "float",
        "required": True,
        "rules": [">=0"]
    },
    "description": {
        "type": "str",
        "required": False
    },
    "category": {
        "type": "str",
        "required": False
    },
    "low_stock_threshold": {
        "type": "float",
        "required": False,
        "rules": [">=0"]
    }
}
