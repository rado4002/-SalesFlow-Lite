# src/api/routes/excel.py

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from src.data.file_processor import process_file
from src.api.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/excel",
    tags=["Excel Import"]
)


@router.post("/upload")
async def upload_excel_file(
    upload_file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload and process an Excel/CSV file.
    Protected by unified JWT authentication.
    Returns preview, column types, and validation details.
    """

    try:
        # File type validation
        if not (
            upload_file.filename.lower().endswith(".csv")
            or upload_file.filename.lower().endswith(".xlsx")
            or upload_file.filename.lower().endswith(".xls")
        ):
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Only .csv and .xlsx/.xls are allowed."
            )

        # Call processor
        from src.models.excel_schemas import REQUIRED_SALES_SCHEMA
        result = process_file(upload_file, REQUIRED_SALES_SCHEMA)
        return result

    except HTTPException as e:
        # Relay explicit validation / file errors
        raise e

    except Exception as e:
        # Safety net: prevent router from crashing
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during file processing: {str(e)}"
        )
