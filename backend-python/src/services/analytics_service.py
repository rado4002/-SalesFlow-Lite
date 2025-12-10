# src/services/analytics_service.py
from __future__ import annotations

from typing import Dict, List, Optional, Tuple
from datetime import date, datetime, timedelta
from collections import defaultdict

from src.models.dto.analytics_dto import (
    AnalyticsPeriod,
    StockAnalyticsResponse,
    StockKPI,
    ProductStockSnapshot,
    SalesAnalyticsResponse,
    SalesKPI,
    DailySalesPoint,
    TopProductSales,
)

from src.clients.java_products_client import JavaProductsClient
from src.clients.java_sales_client import JavaSalesClient

from src.services.enrichment_service import (
    build_last_sale_map,
    enrich_inventory_with_products_and_sales,
)

from src.data.cache_manager import get_cache, cache_analytics


# ============================================================
# Tools
# ============================================================
def to_dict(obj) -> dict:
    if hasattr(obj, "model_dump"):
        return obj.model_dump(by_alias=True)
    if isinstance(obj, dict):
        return obj
    if hasattr(obj, "__dict__"):
        return obj.__dict__
    return {}


def parse_date(value) -> Optional[date]:
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    try:
        return datetime.fromisoformat(str(value).split("Z")[0]).date()
    except Exception:
        return None


def compute_period_dates(period: AnalyticsPeriod) -> Tuple[date, date]:
    today = date.today()
    if period == AnalyticsPeriod.daily:
        return today, today
    if period == AnalyticsPeriod.weekly:
        return today - timedelta(days=6), today
    if period == AnalyticsPeriod.monthly:
        return today.replace(day=1), today
    if period == AnalyticsPeriod.quarterly:
        return today - timedelta(days=89), today
    return today, today


def stock_cache_key(period: AnalyticsPeriod) -> str:
    return f"analytics:stock:{period.value}"


def sales_cache_key(period: AnalyticsPeriod, start: date, end: date) -> str:
    return f"analytics:sales:{period.value}:{start}_{end}"


# ============================================================
# 1. STOCK ANALYTICS
# ============================================================
async def compute_stock_analytics(
    period: AnalyticsPeriod,
    token: Optional[str],
) -> StockAnalyticsResponse:

    today = date.today()
    key = stock_cache_key(period)

    cached = get_cache(key)
    if cached:
        try:
            return StockAnalyticsResponse(**cached)
        except Exception:
            pass

    prod = JavaProductsClient(token)
    sales = JavaSalesClient(token)

    try:
        # Products → base du stock
        products_raw = await prod.get_all_products()
        products: List[Dict] = [to_dict(p) for p in products_raw]

        # Sales history → lastSale + avgDaily
        history_raw = await sales.get_sales_history_global(days=90)
        history: List[Dict] = [to_dict(h) for h in history_raw]

    finally:
        await prod.close()
        await sales.close()

    # Group by product for analytics
    by_product = defaultdict(list)
    for row in history:
        pid = row.get("productId")
        if pid:
            by_product[int(pid)].append(row)

    last_sale_by_product = build_last_sale_map(by_product)

    # Compute avg daily sales per product
    avg_daily_sales: Dict[int, float] = {}
    for pid, hist in by_product.items():
        if not hist:
            avg_daily_sales[pid] = 0.0
            continue

        total_qty = sum(float(h.get("quantity", 0)) for h in hist)
        dates = {parse_date(h.get("date")) for h in hist if parse_date(h.get("date"))}

        if not dates:
            avg_daily_sales[pid] = 0.0
            continue

        span_days = (max(dates) - min(dates)).days + 1
        avg_daily_sales[pid] = total_qty / max(span_days, 1)

    # Convert products → inventory_rows for enrich function
    inventory_rows = [
        {
            "productId": p["id"],
            "currentStock": p.get("stockQuantity", 0),
            "minStock": p.get("lowStockThreshold", 0),
        }
        for p in products
    ]

    enriched = enrich_inventory_with_products_and_sales(
        inventory_rows=inventory_rows,
        products=products,
        last_sale_by_product=last_sale_by_product,
        avg_daily_sales_by_product=avg_daily_sales,
    )

    snapshots = [ProductStockSnapshot(**e) for e in enriched]

    # KPIs
    total_stock_value = sum(s.stock_value for s in snapshots)
    out_of_stock = sum(1 for s in snapshots if s.current_stock <= 0)
    low_stock = sum(1 for s in snapshots if s.status == "LOW_STOCK")
    urgent = sum(
        1
        for s in snapshots
        if s.coverage_days is not None and s.coverage_days < 7
    )
    dead = sum(1 for s in snapshots if s.status == "DEAD_STOCK")

    total_products = len(snapshots) or 1
    low_ratio = (low_stock / total_products) * 100

    coverage_vals = [
        s.coverage_days for s in snapshots if s.coverage_days is not None
    ]
    avg_coverage = (
        sum(coverage_vals) / len(coverage_vals) if coverage_vals else None
    )

    kpi = StockKPI(
        total_stock_value=round(total_stock_value, 2),
        out_of_stock_count=out_of_stock,
        low_stock_count=low_stock,
        low_stock_ratio=round(low_ratio, 1),
        urgent_reorder_count=urgent,
        dead_stock_count=dead,
        rotation_per_year=0.0,  # à calculer plus tard si besoin
        avg_coverage_days=round(avg_coverage, 1) if avg_coverage is not None else None,
    )

    period_label = {
        AnalyticsPeriod.daily: "Aujourd'hui",
        AnalyticsPeriod.weekly: "7 derniers jours",
        AnalyticsPeriod.monthly: "Mois en cours",
        AnalyticsPeriod.quarterly: "90 derniers jours",
    }.get(period, "")

    response = StockAnalyticsResponse(
        period=period,
        period_label=period_label,
        as_of=today,
        kpis=kpi,
        critical_products=[s for s in snapshots if s.status != "OK"],
    )

    cache_analytics(key, response)
    return response


# ============================================================
# 2. SALES ANALYTICS
# ============================================================
async def compute_sales_analytics(
    period: AnalyticsPeriod,
    token: Optional[str],
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> SalesAnalyticsResponse:

    if not start_date or not end_date:
        start_date, end_date = compute_period_dates(period)

    key = sales_cache_key(period, start_date, end_date)

    cached = get_cache(key)
    if cached:
        try:
            return SalesAnalyticsResponse(**cached)
        except Exception:
            pass

    prod = JavaProductsClient(token)
    sales = JavaSalesClient(token)

    try:
        products_raw = await prod.get_all_products()
        products: List[Dict] = [to_dict(p) for p in products_raw]

        sales_raw = await sales.get_sales_period(
            start_date.isoformat(),
            end_date.isoformat(),
        )
        raw_sales: List[Dict] = [to_dict(s) for s in sales_raw]

    finally:
        await prod.close()
        await sales.close()

    product_map = {p["id"]: p for p in products if "id" in p}

    daily: Dict[date, Dict[str, float]] = defaultdict(
        lambda: {"rev": 0.0, "qty": 0.0, "tx": 0}
    )
    agg_prod: Dict[int, Dict[str, float]] = defaultdict(
        lambda: {"rev": 0.0, "qty": 0.0}
    )

    for sale in raw_sales:
        d = parse_date(sale.get("saleDate"))
        if not d:
            continue

        total = float(sale.get("totalAmount", 0.0))
        daily[d]["rev"] += total
        daily[d]["tx"] += 1

        for item in sale.get("items", []):
            pid = item.get("productId")
            if pid is None:
                continue
            qty = float(item.get("quantity", 0.0))
            price = float(
                item.get("price") or product_map.get(pid, {}).get("price", 0.0)
            )
            revenue = qty * price

            daily[d]["qty"] += qty
            agg_prod[pid]["rev"] += revenue
            agg_prod[pid]["qty"] += qty

    # Série quotidienne
    daily_points: List[DailySalesPoint] = []
    total_rev = total_qty = total_tx = 0.0

    for dt in sorted(daily.keys()):
        p = daily[dt]
        daily_points.append(
            DailySalesPoint(
                date=dt,
                total_revenue=p["rev"],
                total_quantity=p["qty"],
                total_transactions=p["tx"],
            )
        )
        total_rev += p["rev"]
        total_qty += p["qty"]
        total_tx += p["tx"]

    avg_ticket = total_rev / total_tx if total_tx > 0 else 0.0

    # Top 5 produits
    top: List[TopProductSales] = []
    for pid, agg in agg_prod.items():
        product = product_map.get(pid)
        if not product:
            continue
        top.append(
            TopProductSales(
                product_id=pid,
                name=product.get("name", "Inconnu"),
                total_quantity=agg["qty"],
                revenue=agg["rev"],
                share_of_revenue=(
                    (agg["rev"] / total_rev * 100) if total_rev > 0 else 0.0
                ),
            )
        )

    top.sort(key=lambda x: x.revenue, reverse=True)
    top = top[:5]

    # Tendance
    seasonal: Optional[str] = None
    if len(daily_points) >= 4:
        mid = len(daily_points) // 2
        first = sum(p.total_revenue for p in daily_points[:mid])
        second = sum(p.total_revenue for p in daily_points[mid:])
        if second > first * 1.1:
            seasonal = "Upward trend"
        elif second < first * 0.9:
            seasonal = "Downward trend"
        else:
            seasonal = "Stable"

    kpi = SalesKPI(
        total_revenue=round(total_rev, 2),
        total_quantity=int(total_qty),
        total_transactions=int(total_tx),
        average_ticket=round(avg_ticket, 2),
        top_products=top,
        seasonal_hint=seasonal,
    )

    period_label = {
    AnalyticsPeriod.daily: "Today",
    AnalyticsPeriod.weekly: "Last 7 days", 
    AnalyticsPeriod.monthly: "Current month",
    AnalyticsPeriod.quarterly: "Last 90 days"
}.get(period, "")

    response = SalesAnalyticsResponse(
    period=period,
    period_label=period_label,
    start_date=start_date,
    end_date=end_date,
    kpis=kpi,
    daily=daily_points,
)


    cache_analytics(key, response)
    return response
