from pydantic import BaseModel, Field, field_validator
from typing import Optional


# ---------------------------------------------
# 🟡 StockAlert
# ---------------------------------------------
class StockAlert(BaseModel):
    product_id: int = Field(..., description="Unique ID of the product")
    message: str = Field(..., description="Alert message describing the issue")
    severity: str = Field(
        ...,
        pattern="^(low|medium|high)$",
        description="Severity level"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "product_id": 42,
                "message": "Stock level below minimum threshold",
                "severity": "high"
            }
        }
    }


# ---------------------------------------------
# 🟡 SalesQuery
# ---------------------------------------------
class SalesQuery(BaseModel):
    start_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Start date in YYYY-MM-DD format"
    )
    end_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="End date in YYYY-MM-DD format"
    )

    @field_validator("end_date")
    def validate_date_order(cls, v, info):
        start = info.data.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be after or equal to start_date")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "start_date": "2025-01-01",
                "end_date": "2025-01-31"
            }
        }
    }


# ---------------------------------------------
# 🟡 ProductStock
# ---------------------------------------------
class ProductStock(BaseModel):
    id: int = Field(..., description="Unique product ID")
    name: str = Field(..., description="Name of the product")
    current_stock: int = Field(..., ge=0, description="Current available stock")
    min_stock: int = Field(..., ge=0, description="Minimum required stock")

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 10,
                "name": "Orange Juice",
                "current_stock": 5,
                "min_stock": 12
            }
        }
    }
