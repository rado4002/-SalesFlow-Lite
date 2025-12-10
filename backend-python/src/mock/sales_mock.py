from __future__ import annotations

from datetime import datetime, timedelta
import pandas as pd

# ============================================================
# MOCK SALES — GLOBAL FORECAST
# ============================================================
MOCK_GLOBAL_SALES = [
    {"date": "2025-01-01", "quantity": 12},
    {"date": "2025-01-02", "quantity": 15},
    {"date": "2025-01-03", "quantity": 14},
    {"date": "2025-01-04", "quantity": 16},
    {"date": "2025-01-05", "quantity": 18},
    {"date": "2025-01-06", "quantity": 17},
    {"date": "2025-01-07", "quantity": 20},
    {"date": "2025-01-08", "quantity": 19},
    {"date": "2025-01-09", "quantity": 21},
    {"date": "2025-01-10", "quantity": 23},
]

# ============================================================
# MOCK SALES — PRODUCT 1
# ============================================================
MOCK_SALES_PRODUCT_1 = [
    {"date": "2025-01-01", "quantity": 5},
    {"date": "2025-01-02", "quantity": 7},
    {"date": "2025-01-03", "quantity": 6},
    {"date": "2025-01-04", "quantity": 9},
    {"date": "2025-01-05", "quantity": 8},
    {"date": "2025-01-06", "quantity": 10},
]

# ============================================================
# MOCK SALES — PRODUCT 2
# ============================================================
MOCK_SALES_PRODUCT_2 = [
    {"date": "2025-01-01", "quantity": 14},
    {"date": "2025-01-02", "quantity": 12},
    {"date": "2025-01-03", "quantity": 13},
    {"date": "2025-01-04", "quantity": 15},
    {"date": "2025-01-05", "quantity": 16},
    {"date": "2025-01-06", "quantity": 18},
]

# ============================================================
# CONVERT TO DATAFRAME
# ============================================================
def df_from_mock(mock_list):
    df = pd.DataFrame(mock_list)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    return df.reset_index(drop=True)


def load_mock_sales(product_id: int | None, history_days: int = 90) -> pd.DataFrame:
    """
    Returns a clean Pandas DataFrame for DEV MODE.

    product_id=None → global sales  
    product_id=1 → MOCK_SALES_PRODUCT_1  
    product_id=2 → MOCK_SALES_PRODUCT_2  
    """
    if product_id is None:
        data = MOCK_GLOBAL_SALES
    elif product_id == 1:
        data = MOCK_SALES_PRODUCT_1
    elif product_id == 2:
        data = MOCK_SALES_PRODUCT_2
    else:
        # Default mock template
        today = datetime.today().date()
        data = []
        for i in range(min(history_days, 30)):
            d = today - timedelta(days=i)
            data.append({"date": d.strftime("%Y-%m-%d"), "quantity": 10 + i % 5})

    return df_from_mock(data)
