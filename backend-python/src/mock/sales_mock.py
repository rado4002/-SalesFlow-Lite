# src/mock/sales_mock.py

from __future__ import annotations

from datetime import datetime, timedelta
import random

import pandas as pd


def generate_mock_sales(days: int = 90) -> pd.DataFrame:
    """
    Simple mock time series for DEV mode.
    """
    today = datetime.today().date()
    dates = [today - timedelta(days=i) for i in range(days)]
    dates.sort()

    base = 10
    data = []
    for d in dates:
        # légère tendance + bruit
        trend = (d - dates[0]).days * 0.05
        value = max(
            0,
            int(random.gauss(mu=base + trend, sigma=2.5))
        )
        data.append({"date": d.strftime("%Y-%m-%d"), "quantity": value})

    return pd.DataFrame(data)
