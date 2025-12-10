# src/mock/mock_sales.py

from datetime import datetime, timedelta

# -------------------------------
# SALES TODAY
# -------------------------------
MOCK_TODAY_SALES = {
    "date": "2025-01-01",
    "total": 245.50,
    "count": 12,
    "items": [
        {"productId": 1, "quantity": 3, "price": 10.0},
        {"productId": 2, "quantity": 1, "price": 20.0},
    ]
}

# -------------------------------
# SALES HISTORY — 90 days
# Required for:
#  - dead stock
#  - avg daily sales
# -------------------------------
MOCK_SALES_HISTORY = [
    {"productId": 1, "date": "2024-12-20", "quantity": 5},
    {"productId": 1, "date": "2024-12-25", "quantity": 3},
    {"productId": 2, "date": "2024-12-12", "quantity": 2},
    {"productId": 2, "date": "2024-12-18", "quantity": 1},
    {"productId": 3, "date": "2024-09-01", "quantity": 1},  # dead stock
]

# -------------------------------
# RECENT SALES LIST
# Used for dashboard recent sales
# -------------------------------
MOCK_RECENT_SALES = [
    {
        "id": 101,
        "saleDate": "2024-12-25",
        "totalAmount": 50.0,
        "items": [
            {"productId": 1, "quantity": 2, "price": 10.0}
        ]
    },
    {
        "id": 102,
        "saleDate": "2024-12-24",
        "totalAmount": 32.0,
        "items": [
            {"productId": 2, "quantity": 1, "price": 20.0}
        ]
    }
]

# -------------------------------
# PERIOD SALES for /sales/period
# -------------------------------
MOCK_SALES_PERIOD = [
    {
        "id": 999,
        "saleDate": "2024-12-20",
        "totalAmount": 82.0,
        "items": [
            {"productId": 1, "quantity": 2, "price": 10.0},
            {"productId": 3, "quantity": 1, "price": 30.0},
        ],
    },
    {
        "id": 1000,
        "saleDate": "2024-12-21",
        "totalAmount": 120.0,
        "items": [
            {"productId": 2, "quantity": 4, "price": 20.0},
        ],
    },
]
