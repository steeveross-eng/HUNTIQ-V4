"""
HUNTIQ V3 - Server Orchestrator
================================

PHASE 7 COMPLETE: This file is now a PURE ORCHESTRATOR.
All business logic has been extracted to /modules/*

Architecture:
- 38 modules total
- Central router registration via modules/routers.py
- Legacy monolith endpoints preserved for backward compatibility
- All new development goes to modules

Version: 2.0.0 (Post-Decoupling)
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==============================================
# MODULE IMPORTS
# ==============================================
from modules.routers import (
    CORE_ROUTERS,
    MODULE_STATUS
)

# Legacy monolith imports for backward compatibility
from server_monolith_backup import (
    api_router as legacy_router,
    startup_territory_module,
    shutdown_territory_module
)

# ==============================================
# APPLICATION LIFECYCLE
# ==============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown"""
    logger.info("=" * 60)
    logger.info("HUNTIQ V3 - Server Starting")
    logger.info("=" * 60)
    logger.info(f"Architecture: Modular v2.0 (Pure Orchestrator)")
    logger.info(f"Total Modules: {MODULE_STATUS['total_modules']}")
    
    # Start territory module (legacy)
    try:
        await startup_territory_module()
    except Exception as e:
        logger.warning(f"Territory module startup failed: {e}")
    
    logger.info("=" * 60)
    logger.info("All modules loaded successfully")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Server shutting down...")
    try:
        await shutdown_territory_module()
    except:
        pass

# ==============================================
# FASTAPI APPLICATION
# ==============================================
app = FastAPI(
    title="HUNTIQ V3 - Chasse Bionic™ API",
    description="""
## API Modulaire de Chasse Intelligente

HUNTIQ V3 est une plateforme de chasse intelligente utilisant l'IA pour optimiser 
les stratégies de chasse, analyser les attractants et fournir des recommandations personnalisées.

### Architecture Modulaire (38 modules)
- **Phase 2**: Core Engines (7 modules)
- **Phase 3**: Business Engines (8 modules)  
- **Phase 4**: Master Plan Engines (10 modules)
- **Phase 5**: Data Layers (5 modules)
- **Phase 6**: Live Heading View (1 module)
- **Phase 7**: Decoupled from Monolith (7 modules)

### Authentification
Certains endpoints nécessitent une authentification via JWT Bearer token.
    """,
    version="3.7.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# ==============================================
# CORS MIDDLEWARE
# ==============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================
# ORCHESTRATOR ROUTER
# ==============================================
orchestrator_router = APIRouter(prefix="/api")

@orchestrator_router.get("/")
async def root():
    """API Root - Health check"""
    return {
        "message": "Chasse Bionic™ - HUNTIQ V3",
        "status": "operational",
        "version": "3.7.0",
        "architecture": "modular_v2.0"
    }

@orchestrator_router.get("/modules/status")
async def modules_status():
    """Get status of all loaded modules"""
    return {
        "total_modules": MODULE_STATUS["total_modules"],
        "architecture_version": MODULE_STATUS["architecture_version"],
        "modules": [
            {
                "name": meta["name"],
                "version": meta["version"],
                "phase": meta.get("phase", 0),
                "description": meta.get("description", ""),
                "prefix": router.prefix
            }
            for router, meta in CORE_ROUTERS
        ],
        "status": "operational"
    }

@orchestrator_router.get("/modules/health")
async def modules_health():
    """Quick health check for all modules"""
    return {
        "status": "healthy",
        "total_modules": MODULE_STATUS["total_modules"],
        "phases": {
            "phase_2": MODULE_STATUS.get("phase_2_modules", 0),
            "phase_3": MODULE_STATUS.get("phase_3_modules", 0),
            "phase_4": MODULE_STATUS.get("phase_4_modules", 0),
            "phase_5": MODULE_STATUS.get("phase_5_modules", 0),
            "phase_6": MODULE_STATUS.get("phase_6_modules", 0),
            "phase_7": MODULE_STATUS.get("phase_7_modules", 0),
        }
    }

# ==============================================
# REGISTER ROUTERS
# ==============================================

# 1. Register orchestrator endpoints
app.include_router(orchestrator_router)

# 2. Register all modular routers
for router, meta in CORE_ROUTERS:
    app.include_router(router)
    logger.info(f"✓ Loaded: {meta['name']} v{meta['version']} [{router.prefix}]")

# 3. Register legacy monolith router (for backward compatibility)
app.include_router(legacy_router)
logger.info("✓ Loaded: Legacy monolith router [/api/*]")

# ==============================================
# CUSTOM OPENAPI SCHEMA
# ==============================================
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="HUNTIQ V3 - Chasse Bionic™ API",
        version="3.7.0",
        description="API modulaire de chasse intelligente",
        routes=app.routes,
    )
    
    # Group by tags
    openapi_schema["tags"] = [
        {"name": "Orchestrator", "description": "System status and health"},
        {"name": "Core Engines", "description": "Phase 2 - Nutrition, Scoring, AI, Weather, Geospatial"},
        {"name": "Business Engines", "description": "Phase 3 - User, Admin, Notifications, Territory"},
        {"name": "Master Plan", "description": "Phase 4 - Recommendations, Collaborative, 3D, Wildlife"},
        {"name": "Data Layers", "description": "Phase 5 - Ecoforestry, Behavioral, Simulation, 3D"},
        {"name": "Live Heading", "description": "Phase 6 - Immersive navigation"},
        {"name": "Decoupled", "description": "Phase 7 - Products, Orders, Suppliers, Cart, Affiliate, Alerts"},
        {"name": "Legacy", "description": "Backward compatibility endpoints"},
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# ==============================================
# MAIN
# ==============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
