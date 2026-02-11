"""
HUNTIQ V3 - Server Orchestrator
================================

PHASE 7 COMPLETE: This file is now a PURE ORCHESTRATOR.
All business logic has been extracted to /modules/*

Architecture:
- 38 modules total
- Central router registration via modules/routers.py
- Legacy monolith endpoints preserved via server_monolith_backup.py

Version: 2.0.0 (Post-Decoupling)
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

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

# ==============================================
# APPLICATION LIFECYCLE
# ==============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown"""
    logger.info("=" * 60)
    logger.info("HUNTIQ V3 - Server Starting")
    logger.info("=" * 60)
    logger.info("Architecture: Modular v2.0 (Pure Orchestrator)")
    logger.info(f"Total Modules: {MODULE_STATUS['total_modules']}")
    
    # Initialize database
    try:
        from database import init_database
        await init_database()
        logger.info("Database initialized with indexes and seed data")
    except Exception as e:
        logger.warning(f"Database initialization warning: {e}")
    
    # Initialize geo engine indexes (Phase P6.3)
    try:
        from modules.geo_engine.v1 import ensure_indexes
        await ensure_indexes()
        logger.info("Geo Engine 2dsphere indexes created")
    except ImportError:
        logger.info("Geo Engine indexes skipped (module not loaded)")
    except Exception as e:
        logger.warning(f"Geo Engine index creation warning: {e}")
    
    # Initialize territory sync if available
    try:
        from territory_sync import startup_sync
        await startup_sync()
        logger.info("Territory sync initialized")
    except ImportError:
        logger.info("Territory sync not available")
    except Exception as e:
        logger.warning(f"Territory sync startup failed: {e}")
    
    logger.info("=" * 60)
    logger.info("All modules loaded successfully")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("Server shutting down...")
    try:
        from territory_sync import shutdown_sync
        await shutdown_sync()
    except Exception:
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

### Architecture Modulaire (40+ modules)
- **Phase 2**: Core Engines (weather, scoring, ai, nutrition, strategy)
- **Phase 3-6**: Business & Plan Maître Engines
- **Phase 7**: Decoupled from Monolith (products, orders, etc.)
- **Phase 8**: Legal Time & Predictive Engines (heures légales, prédictions)

### Fonctionnalités Clés
- 🕐 **Legal Time Engine**: Calcul heures légales de chasse (30 min avant/après soleil)
- 🔮 **Predictive Engine**: Prédiction succès de chasse multi-facteurs
- 🤖 **AI Engine**: GPT-5.2 pour analyse et recommandations
- 🔔 **Notifications**: Alertes 15 min avant fin période légale

### Authentification
Certains endpoints nécessitent une authentification via JWT Bearer token.
    """,
    version="3.8.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    openapi_tags=[
        {
            "name": "Legal Time Engine",
            "description": "Calcul des heures légales de chasse basé sur lever/coucher du soleil"
        },
        {
            "name": "Predictive Engine",
            "description": "Prédiction de succès de chasse multi-facteurs"
        },
        {
            "name": "AI Engine",
            "description": "Intelligence artificielle GPT-5.2 pour analyse et recommandations"
        },
        {
            "name": "Notification Engine",
            "description": "Gestion des notifications push et in-app"
        },
        {
            "name": "Weather Engine",
            "description": "Analyse météorologique et impact sur la chasse"
        },
        {
            "name": "Scoring Engine",
            "description": "Évaluation des produits selon 13 critères scientifiques"
        },
        {
            "name": "Products",
            "description": "Gestion du catalogue de produits"
        },
        {
            "name": "Orders",
            "description": "Gestion des commandes"
        }
    ]
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
        "version": "3.8.0",
        "architecture": "modular_v2.0",
        "modules": 42,
        "docs": "/api/docs"
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
try:
    from server_monolith_backup import api_router as legacy_router
    app.include_router(legacy_router)
    logger.info("✓ Loaded: Legacy monolith router [/api/*]")
except ImportError as e:
    logger.warning(f"Legacy router not available: {e}")

# 4. [REMOVED - P6.2] user_waypoints.py has been deleted
# All waypoint functionality is now handled by the unified geo_engine (/api/v1/geo/*)
# Migration: user_waypoints → geo_entities (unified collection)
logger.info("✓ Legacy user_waypoints REMOVED - Use /api/v1/geo/* instead")

# 5. Register site access control router
try:
    from site_access import access_router
    app.include_router(access_router)
    logger.info("✓ Loaded: Site Access Control router [/api/site/*]")
except ImportError as e:
    logger.warning(f"Site Access Control router not available: {e}")

# 6. Register territory analysis router (UNIFIED waypoints source of truth)
try:
    from territory import territory_router
    app.include_router(territory_router)
    logger.info("✓ Loaded: Territory Analysis router [/api/territory/*] (UNIFIED waypoints)")
except ImportError as e:
    logger.warning(f"Territory Analysis router not available: {e}")

# 7. Register unified geo engine (Phase P6.2)
try:
    from modules.geo_engine.v1 import router as geo_router, ensure_indexes
    app.include_router(geo_router)
    logger.info("✓ Loaded: Unified Geo Engine [/api/v1/geo/*]")
except ImportError as e:
    logger.warning(f"Geo Engine not available: {e}")

# 8. Register admin geo engine (Phase P6.5)
try:
    from modules.geo_engine.admin import router as admin_geo_router
    app.include_router(admin_geo_router)
    logger.info("✓ Loaded: Admin Geo Engine [/api/admin/geo/*]")
except ImportError as e:
    logger.warning(f"Admin Geo Engine not available: {e}")

# 9. Register WebSocket geo sync (Phase P6.4)
try:
    from websocket.geo_sync import router as ws_geo_router
    app.include_router(ws_geo_router)
    logger.info("✓ Loaded: WebSocket Geo Sync [/ws/geo-sync, /api/v1/geo-sync/*]")
except ImportError as e:
    logger.warning(f"WebSocket Geo Sync not available: {e}")

# 10. Register Bathymetry routes (Phase P2 Cartes Premium)
try:
    from routes.bathymetry import router as bathymetry_router
    app.include_router(bathymetry_router)
    logger.info("✓ Loaded: Bathymetry API [/api/bathymetry/*]")
except ImportError as e:
    logger.warning(f"Bathymetry API not available: {e}")

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
