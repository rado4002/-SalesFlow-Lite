# src/api/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import logging
import os

from dotenv import load_dotenv

# Routers
from src.api.routes.health import router as health_router
from src.api.routes.stock import router as stock_router
from src.api.routes.analytics import router as analytics_router
from src.api.routes.excel import router as excel_router
from src.api.routes.ml import router as ml_router
from src.api.routes.ml import router as ml_router

# Exception handlers
from src.utils.exceptions import (
    http_exception_handler,
    generic_exception_handler
)

# Load .env environment variables
load_dotenv()


# ---------------------------------------------------------
# FastAPI APP CONFIG
# ---------------------------------------------------------
app = FastAPI(
    title="SalesFlow API",
    version="0.1.0",
    description="Analytics / ML Microservice for SalesFlow with unified Java JWT validation."
)


# ---------------------------------------------------------
# CORS (Frontend React)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",  # React (Vite)
        "http://localhost:8081",  # FastAPI
        "http://localhost:8080",  # Spring Boot
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# STARTUP EVENT
# ---------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    logging.basicConfig(level=logging.INFO)
    logging.info("🚀 FastAPI (Analytics/ML) server started")
    logging.info(f"JAVA_JWT_SECRET loaded: {bool(os.getenv('JAVA_JWT_SECRET'))}")


# ---------------------------------------------------------
# ROUTERS
# ---------------------------------------------------------
app.include_router(health_router)
app.include_router(stock_router)
app.include_router(analytics_router)
app.include_router(excel_router)   # NEW: Excel upload router
app.include_router(ml_router)      # NEW: Machine Learning router


# ---------------------------------------------------------
# EXCEPTION HANDLERS
# ---------------------------------------------------------
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# ---------------------------------------------------------
# CUSTOM OPENAPI SCHEMA — ADDS JWT LOCK 🔒
# ---------------------------------------------------------
def custom_openapi():
    """
    Customize Swagger Documentation:
    - Adds BearerAuth (JWT)
    - Applies it to all endpoints except /health
    """
    if app.openapi_schema:
        return app.openapi_schema

    # Base schema
    openapi_schema = get_openapi(
        title="SalesFlow API",
        version="0.1.0",
        description="Unified SalesFlow API with Java JWT validation",
        routes=app.routes,
    )

    # 🔐 Add BearerAuth to securitySchemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # 🔐 Apply BearerAuth to all endpoints except /health
    for path, methods in openapi_schema.get("paths", {}).items():
        for method, details in methods.items():
            if "/health" not in path:  # leave health endpoint public
                details.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# Override OpenAPI generator
app.openapi = custom_openapi
