"""
Auth Engine - API Router
Hybrid Authentication: JWT (email/password) + Google OAuth
Phase P4 Security Update
"""
from fastapi import APIRouter, HTTPException, Request, Depends, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import logging

from .models import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    GoogleAuthCallback, PasswordReset
)
from .service import AuthService

# Database dependency
def get_db():
    from database import Database
    return Database.get_database()

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# Optional bearer token - don't make it required
security = HTTPBearer(auto_error=False)


def get_client_ip(request: Request) -> str:
    """Get client IP address"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[UserResponse]:
    """Get current authenticated user from token"""
    db = get_db()
    service = AuthService(db)
    
    # Try Authorization header first
    token = None
    if credentials:
        token = credentials.credentials
    
    # Fall back to cookie
    if not token:
        token = request.cookies.get("session_token")
    
    # Fall back to query param (for legacy support)
    if not token:
        token = request.query_params.get("token")
    
    if not token:
        return None
    
    return await service.verify_session(token)


async def require_auth(
    user: Optional[UserResponse] = Depends(get_current_user)
) -> UserResponse:
    """Require authenticated user"""
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    return user


# ==========================================
# Registration & Login
# ==========================================

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, request: Request, response: Response):
    """Register a new user with email/password"""
    db = get_db()
    service = AuthService(db)
    
    success, token_response, error = await service.register(user_data)
    
    if not success:
        raise HTTPException(status_code=400, detail=error)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token_response.token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/"
    )
    
    return token_response


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, request: Request, response: Response):
    """Login with email/password"""
    db = get_db()
    service = AuthService(db)
    
    ip_address = get_client_ip(request)
    user_agent = request.headers.get("User-Agent")
    
    success, token_response, error = await service.login(
        login_data, ip_address, user_agent
    )
    
    if not success:
        raise HTTPException(status_code=401, detail=error)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token_response.token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        path="/"
    )
    
    return token_response


# ==========================================
# Google OAuth
# ==========================================

@router.post("/google/callback", response_model=TokenResponse)
async def google_callback(callback_data: GoogleAuthCallback, response: Response):
    """
    Handle Google OAuth callback from Emergent Auth
    REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    """
    db = get_db()
    service = AuthService(db)
    
    success, token_response, error = await service.google_auth_callback(
        callback_data.session_id
    )
    
    if not success:
        raise HTTPException(status_code=401, detail=error)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token_response.token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        path="/"
    )
    
    return token_response


# ==========================================
# Session Management
# ==========================================

@router.get("/me", response_model=UserResponse)
async def get_me(user: UserResponse = Depends(require_auth)):
    """Get current user info"""
    return user


@router.get("/verify")
async def verify_token(token: str):
    """Verify if a token is valid"""
    db = get_db()
    service = AuthService(db)
    
    user = await service.verify_session(token)
    
    return {
        "valid": user is not None,
        "user": user
    }


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Logout and invalidate session"""
    db = get_db()
    service = AuthService(db)
    
    # Get token from various sources
    token = None
    if credentials:
        token = credentials.credentials
    if not token:
        token = request.cookies.get("session_token")
    if not token:
        token = request.query_params.get("token")
    
    if token:
        await service.logout(token)
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    
    return {"success": True, "message": "Déconnexion réussie"}


# ==========================================
# Auto-Login & Device Trust
# ==========================================

@router.get("/auto-login")
async def auto_login(request: Request, response: Response):
    """Attempt auto-login from trusted device"""
    db = get_db()
    service = AuthService(db)
    
    ip_address = get_client_ip(request)
    success, token_response, error = await service.auto_login(ip_address)
    
    if not success:
        return {"success": False, "auto_login": False, "message": error}
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token_response.token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        path="/"
    )
    
    return {
        "success": True,
        "auto_login": True,
        "token": token_response.token,
        "user": token_response.user
    }


@router.get("/ip-info")
async def ip_info(request: Request):
    """Get information about client IP"""
    db = get_db()
    service = AuthService(db)
    
    ip_address = get_client_ip(request)
    return await service.get_ip_info(ip_address)


# ==========================================
# Password Reset (placeholder)
# ==========================================

@router.post("/forgot-password")
async def forgot_password(reset_data: PasswordReset):
    """Request password reset email (placeholder - requires email service)"""
    # TODO: Implement email sending
    return {
        "success": True,
        "message": "Si un compte existe, un email a été envoyé"
    }


# ==========================================
# Health Check
# ==========================================

@router.get("/")
async def auth_info():
    """Get auth engine info"""
    return {
        "module": "auth_engine",
        "version": "1.0.0",
        "phase": "P4",
        "description": "Hybrid Authentication (JWT + Google OAuth)",
        "features": [
            "Email/password registration and login",
            "Google OAuth via Emergent Auth",
            "JWT access tokens (24h expiry)",
            "Trusted device auto-login",
            "Session management"
        ],
        "endpoints": {
            "POST /register": "Create account with email/password",
            "POST /login": "Login with email/password",
            "POST /google/callback": "Google OAuth callback",
            "GET /me": "Get current user",
            "GET /verify": "Verify token",
            "POST /logout": "Logout",
            "GET /auto-login": "Auto-login from trusted device",
            "GET /ip-info": "Get IP trust info"
        }
    }
