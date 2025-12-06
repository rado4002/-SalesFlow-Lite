# src/api/dependencies.py

from fastapi import Header, HTTPException
from typing import Dict, Any, List, Optional
from src.api.settings import DEV_MODE

# Only import validator in PROD
if not DEV_MODE:
    from src.integration.jwt_validator import jwt_validator


def get_current_user(
    authorization: str = Header(None),
    required_roles: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    DEV_MODE = True:
        - No token required
        - Always returns a fake user
        - Used for frontend development without Java backend
    
    DEV_MODE = False:
        - Require Authorization: Bearer <token>
        - Validate Java JWT
        - Forward token to Java API
        - Check permissions
    """

    # ---------------------------------------------------------
    # DEV MODE → BYPASS JWT and RETURN FAKE USER
    # ---------------------------------------------------------
    if DEV_MODE:
        return {
            "user_id": "dev-user",
            "username": "dev",
            "roles": ["admin"],
            "token": "dev-token",
            "mode": "DEV"
        }

    # ---------------------------------------------------------
    # PROD MODE → JWT REQUIRED
    # ---------------------------------------------------------
    if not authorization:
        raise HTTPException(401, "Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Invalid Authorization header format")

    # Extract raw token
    token = authorization.replace("Bearer ", "").strip()

    # Validate token via JavaJWTValidator
    payload = jwt_validator.validate(token)

    user = {
        "user_id": payload.get("sub"),
        "username": payload.get("username"),
        "roles": payload.get("roles", []),
        "token": token,
        "mode": "PROD"
    }

    # ---------------------------------------------------------
    # Role checking
    # ---------------------------------------------------------
    if required_roles:
        if not any(role in user["roles"] for role in required_roles):
            raise HTTPException(403, "Insufficient permissions")

    return user
