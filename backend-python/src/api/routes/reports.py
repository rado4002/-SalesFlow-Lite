# src/api/routes/reports.py
from __future__ import annotations

import io
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.api.dependencies import get_current_user
from src.models.dto.analytics_dto import AnalyticsPeriod
from src.services.report_service import generate_report

router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports"],
)


ReportFormat = Literal["pdf", "excel"]
ReportType = Literal["sales", "stock", "combined"]


class ReportRequestPayload(BaseModel):
    report_type: ReportType
    format: ReportFormat
    period: AnalyticsPeriod = AnalyticsPeriod.monthly


def _extract_token(current_user: dict) -> Optional[str]:
    if not current_user:
        return None
    return (
        current_user.get("token")
        or current_user.get("access_token")
        or current_user.get("raw_token")
    )


@router.post("/generate")
async def generate_report_endpoint(
    payload: ReportRequestPayload,
    current_user=Depends(get_current_user),
):
    token = _extract_token(current_user)
    if not token:
        raise HTTPException(401, "Missing JWT token for report generation")

    content, filename, media_type = await generate_report(
        report_type=payload.report_type,
        fmt=payload.format,
        period=payload.period,
        token=token,
    )

    return StreamingResponse(
        io.BytesIO(content),
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )
