from apscheduler.schedulers.asyncio import AsyncIOScheduler
from src.api.routes.reports import generate_report
from src.models.report import ReportRequest
import logging

def start_scheduler():

    scheduler = AsyncIOScheduler()

    # Exemple : génère un rapport sales PDF tous les jours à minuit
    scheduler.add_job(
        lambda: generate_report(ReportRequest(report_type="sales", format="pdf")),
        "cron",
        hour=0,
        minute=0,
        id="daily_sales_report"
    )

    scheduler.start()
    logging.info("⏰ Scheduler started successfully")
