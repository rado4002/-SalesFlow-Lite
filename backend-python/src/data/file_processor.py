# src/data/file_processor.py

import pandas as pd
from fastapi import HTTPException, UploadFile
from io import BytesIO

from src.utils.validators import validate_schema


def process_file(upload_file: UploadFile, required_schema: dict):
    """
    Process an uploaded CSV or Excel file into a validated pandas DataFrame.

    Args:
        upload_file (UploadFile): The uploaded file object.
        required_schema (dict): Schema describing required columns and validation rules.

    Returns:
        dict: metadata, preview, validation results.
    """

    filename = upload_file.filename.lower()

    # --------------------------------------------------------
    # 1. Detect file type
    # --------------------------------------------------------
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(upload_file.file)

        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            # read bytes first (important because file-like object gets consumed)
            content = upload_file.file.read()
            df = pd.read_excel(BytesIO(content))

        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Only .csv and .xlsx/.xls are allowed."
            )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading file '{filename}': {str(e)}"
        )

    # --------------------------------------------------------
    # 2. Normalize column names
    # --------------------------------------------------------
    df.columns = [col.strip() for col in df.columns]

    # --------------------------------------------------------
    # 3. Schema validation
    # --------------------------------------------------------
    validation_errors = None

    try:
        validate_schema(df, required_schema)
    except HTTPException as exc:
        # capture validator errors but do not crash
        validation_errors = exc.detail

    # --------------------------------------------------------
    # 4. Build preview (top 10 rows)
    # --------------------------------------------------------
    try:
        preview = (
            df.head(10)
            .fillna("")
            .astype(str)
            .to_dict(orient="records")
        )
    except Exception:
        preview = []

    # --------------------------------------------------------
    # 5. Build column types
    # --------------------------------------------------------
    column_types = {col: str(dtype) for col, dtype in df.dtypes.items()}

    # --------------------------------------------------------
    # 6. Response object
    # --------------------------------------------------------
    return {
        "filename": filename,
        "row_count": len(df),
        "columns": list(df.columns),
        "column_types": column_types,
        "preview": preview,
        "validation": {
            "status": "ok" if validation_errors is None else "failed",
            "errors": validation_errors or [],
        },
    }
