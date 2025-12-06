# src/models/excel_schemas.py

"""
Schema definitions for Excel/CSV uploads.
This file contains ONLY dictionary definitions.
No logic, no imports besides typing if needed.
"""

# Schema for validating sales import files
REQUIRED_SALES_SCHEMA = {
    "product_id": {
        "type": "int",
        "required": True
    },
    "quantity": {
        "type": "float",
        "required": True,
        "rules": [">=0"]
    },
    "price": {
        "type": "float",
        "required": True,
        "rules": [">=0"]
    },
    "sale_date": {
        "type": "date",
        "required": True,
        "format": "%Y-%m-%d"
    },
    "category": {
        "type": "str",
        "required": False
    }
}
