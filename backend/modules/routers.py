"""Modules Router Integration

Central router integration for all HUNTIQ modules.
This file is the single point of import for server.py

Version: 2.0.0 - Phase 6 Complete (Pure Orchestrator)

Architecture:
- All routers centralized here
- No manual router registration in server.py
- Legacy monolith isolated
"""

from fastapi import APIRouter
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)

# ==============================================
# CORE ENGINE ROUTERS (Phase 2)
# ==============================================
from modules.nutrition_engine.v1 import router as nutrition_router
from modules.scoring_engine.v1 import router as scoring_router
from modules.ai_engine.v1 import router as ai_router
from modules.weather_engine.v1 import router as weather_router
from modules.geospatial_engine.v1 import router as geospatial_router
from modules.wms_engine.v1 import router as wms_router
from modules.strategy_engine.v1 import router as strategy_router

# ==============================================
# BUSINESS ENGINE ROUTERS (Phase 3)
# ==============================================
from modules.user_engine.v1 import router as user_router
from modules.admin_engine.v1 import router as admin_router
from modules.notification_engine.v1 import router as notification_router
from modules.referral_engine.v1 import router as referral_router
from modules.territory_engine.v1 import router as territory_router
from modules.tracking_engine.v1 import router as tracking_router
from modules.marketplace_engine.v1 import router as marketplace_router
from modules.plugins_engine.v1 import router as plugins_router

# ==============================================
# MASTER PLAN ENGINE ROUTERS (Phase 4)
# ==============================================
from modules.recommendation_engine.v1 import router as recommendation_router
from modules.collaborative_engine.v1 import router as collaborative_router
from modules.ecoforestry_engine.v1 import router as ecoforestry_router
from modules.engine_3d.v1 import router as engine_3d_router
from modules.wildlife_behavior_engine.v1 import router as wildlife_router
from modules.weather_fauna_simulation_engine.v1 import router as simulation_router
from modules.adaptive_strategy_engine.v1 import router as adaptive_router
from modules.advanced_geospatial_engine.v1 import router as advanced_geo_router
from modules.progression_engine.v1 import router as progression_router
from modules.networking_engine.v1 import router as networking_router

# ==============================================
# DATA LAYER ROUTERS (Phase 5)
# ==============================================
from modules.data_layers.ecoforestry_layers import router as ecoforestry_data_router
from modules.data_layers.behavioral_layers import router as behavioral_data_router
from modules.data_layers.simulation_layers import router as simulation_data_router
from modules.data_layers.layers_3d import router as layers_3d_data_router
from modules.data_layers.advanced_geospatial_layers import router as advanced_geo_data_router

# ==============================================
# SPECIAL MODULES (Phase 6)
# ==============================================
from modules.live_heading_engine import router as live_heading_router

# ==============================================
# DECOUPLED MODULES (Phase 7 - Extracted from server.py)
# ==============================================
from modules.products_engine import router as products_router
from modules.orders_engine import router as orders_router
from modules.suppliers_engine import router as suppliers_router
from modules.customers_engine import router as customers_router
from modules.cart_engine import router as cart_router
from modules.affiliate_engine import router as affiliate_router
from modules.alerts_engine import router as alerts_router

# ==============================================
# PHASE 8 - LEGAL TIME & PREDICTIVE ENGINES
# ==============================================
from modules.legal_time_engine import router as legal_time_router
from modules.predictive_engine import router as predictive_router

# ==============================================
# PHASE P3 - ANALYTICS ENGINE
# ==============================================
from modules.analytics_engine import router as analytics_router

# ==============================================
# PHASE P3 - WAYPOINT SCORING ENGINE
# ==============================================
from modules.waypoint_scoring_engine import router as waypoint_scoring_router

# ==============================================
# PHASE P4 - GEOLOCATION ENGINE
# ==============================================
from modules.geolocation_engine.v1 import router as geolocation_router

# ==============================================
# PHASE P4 - AUTH ENGINE (Hybrid JWT + Google OAuth)
# ==============================================
from modules.auth_engine import router as auth_router

# ==============================================
# PHASE P4+ - HUNTING TRIP LOGGER (Real Data)
# ==============================================
from modules.hunting_trip_logger import router as hunting_trip_logger_router

# ==============================================
# PHASE P5 - ROLES ENGINE (User Roles & Permissions)
# ==============================================
from modules.roles_engine.v1 import router as roles_router

# ==============================================
# PHASE 1 CAMERAS - CAMERA ENGINE (Photo Ingestion)
# ==============================================
from modules.camera_engine.v1 import camera_router


# List of all available routers with their metadata
CORE_ROUTERS: List[Tuple[APIRouter, dict]] = [
    # ==========================================
    # Phase P4 - Auth Engine (Priority - First)
    # ==========================================
    (auth_router, {
        "name": "auth_engine",
        "version": "1.0.0",
        "phase": "P4",
        "description": "Hybrid Authentication (JWT + Google OAuth)"
    }),
    
    # ==========================================
    # Phase 2 - Core Engines (7 modules)
    # ==========================================
    (nutrition_router, {
        "name": "nutrition_engine",
        "version": "1.0.0",
        "phase": 2,
        "description": "Nutritional analysis for hunting attractants"
    }),
    (scoring_router, {
        "name": "scoring_engine", 
        "version": "1.0.0",
        "phase": 2,
        "description": "Scientific scoring (13 weighted criteria)"
    }),
    (ai_router, {
        "name": "ai_engine",
        "version": "1.0.0",
        "phase": 2, 
        "description": "AI-powered product analysis using GPT-5.2"
    }),
    (weather_router, {
        "name": "weather_engine",
        "version": "1.0.0",
        "phase": 2,
        "description": "Weather-based hunting condition analysis"
    }),
    (geospatial_router, {
        "name": "geospatial_engine",
        "version": "1.0.0",
        "phase": 2,
        "description": "Geospatial analysis for territory management"
    }),
    (wms_router, {
        "name": "wms_engine",
        "version": "1.0.0",
        "phase": 2,
        "description": "WMS layer management for hunting maps"
    }),
    (strategy_router, {
        "name": "strategy_engine",
        "version": "1.0.0",
        "phase": 2,
        "description": "Hunting strategy generation"
    }),
    
    # ==========================================
    # Phase 3 - Business Engines (8 modules)
    # ==========================================
    (user_router, {
        "name": "user_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "User management and authentication"
    }),
    (admin_router, {
        "name": "admin_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "Administration and site management"
    }),
    (notification_router, {
        "name": "notification_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "Multi-channel notification system"
    }),
    (referral_router, {
        "name": "referral_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "Referral and affiliate system"
    }),
    (territory_router, {
        "name": "territory_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "Territory and land management"
    }),
    (tracking_router, {
        "name": "tracking_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "GPS tracking and location sharing"
    }),
    (marketplace_router, {
        "name": "marketplace_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "C2C marketplace for hunting equipment"
    }),
    (plugins_router, {
        "name": "plugins_engine",
        "version": "1.0.0",
        "phase": 3,
        "description": "Feature flags and plugin management"
    }),
    
    # ==========================================
    # Phase 4 - Master Plan Engines (10 modules)
    # ==========================================
    (recommendation_router, {
        "name": "recommendation_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Intelligent product and strategy recommendations"
    }),
    (collaborative_router, {
        "name": "collaborative_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Hunter collaboration and group management"
    }),
    (ecoforestry_router, {
        "name": "ecoforestry_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Ecoforestry data and habitat analysis"
    }),
    (engine_3d_router, {
        "name": "engine_3d",
        "version": "1.0.0",
        "phase": 4,
        "description": "3D terrain visualization and analysis"
    }),
    (wildlife_router, {
        "name": "wildlife_behavior_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Wildlife behavior modeling and prediction"
    }),
    (simulation_router, {
        "name": "weather_fauna_simulation_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Weather-wildlife correlation simulation"
    }),
    (adaptive_router, {
        "name": "adaptive_strategy_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Adaptive real-time hunting strategies"
    }),
    (advanced_geo_router, {
        "name": "advanced_geospatial_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Advanced geospatial analysis and corridors"
    }),
    (progression_router, {
        "name": "progression_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Gamification and user progression"
    }),
    (networking_router, {
        "name": "networking_engine",
        "version": "1.0.0",
        "phase": 4,
        "description": "Hunter social network"
    }),
    
    # ==========================================
    # Phase 5 - Data Layers (5 modules)
    # ==========================================
    (ecoforestry_data_router, {
        "name": "ecoforestry_data_layer",
        "version": "1.0.0",
        "phase": 5,
        "description": "Data provider for SIEF forest inventory and habitat"
    }),
    (behavioral_data_router, {
        "name": "behavioral_data_layer",
        "version": "1.0.0",
        "phase": 5,
        "description": "Data provider for wildlife behavior patterns"
    }),
    (simulation_data_router, {
        "name": "simulation_data_layer",
        "version": "1.0.0",
        "phase": 5,
        "description": "Data provider for weather-fauna simulations"
    }),
    (layers_3d_data_router, {
        "name": "3d_data_layer",
        "version": "1.0.0",
        "phase": 5,
        "description": "Data provider for terrain elevation and 3D analysis"
    }),
    (advanced_geo_data_router, {
        "name": "advanced_geospatial_data_layer",
        "version": "1.0.0",
        "phase": 5,
        "description": "Data provider for corridors and connectivity"
    }),
    
    # ==========================================
    # Phase 6 - Special Modules (1 module)
    # ==========================================
    (live_heading_router, {
        "name": "live_heading_engine",
        "version": "1.0.0",
        "phase": 6,
        "description": "Immersive live heading view for hunting navigation"
    }),
    
    # ==========================================
    # Phase 7 - Decoupled from server.py (5 modules)
    # ==========================================
    (products_router, {
        "name": "products_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Product management (extracted from monolith)"
    }),
    (orders_router, {
        "name": "orders_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Order management with hybrid dropshipping/affiliation"
    }),
    (suppliers_router, {
        "name": "suppliers_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Supplier/partner management"
    }),
    (customers_router, {
        "name": "customers_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Customer management and tracking"
    }),
    (cart_router, {
        "name": "cart_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Shopping cart management"
    }),
    (affiliate_router, {
        "name": "affiliate_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "Affiliate click tracking and commissions"
    }),
    (alerts_router, {
        "name": "alerts_engine",
        "version": "1.0.0",
        "phase": 7,
        "description": "System alerts and site settings"
    }),
    
    # ==========================================
    # Phase 8 - Legal Time & Predictive Engines (2 modules)
    # ==========================================
    (legal_time_router, {
        "name": "legal_time_engine",
        "version": "1.0.0",
        "phase": 8,
        "description": "Legal hunting hours based on sunrise/sunset (Quebec regulations)"
    }),
    (predictive_router, {
        "name": "predictive_engine",
        "version": "1.0.0",
        "phase": 8,
        "description": "Hunting success predictions and activity forecasts"
    }),
    
    # ==========================================
    # Phase P3 - Analytics Engine (1 module)
    # ==========================================
    (analytics_router, {
        "name": "analytics_engine",
        "version": "1.0.0",
        "phase": "P3",
        "description": "Hunting analytics dashboard with KPIs and statistics"
    }),
    
    # ==========================================
    # Phase P3 - Waypoint Scoring Engine
    # ==========================================
    (waypoint_scoring_router, {
        "name": "waypoint_scoring_engine",
        "version": "1.0.0",
        "phase": "P3",
        "description": "WQS, Success Forecast, and AI recommendations"
    }),
    
    # ==========================================
    # Phase P4 - Geolocation Engine
    # ==========================================
    (geolocation_router, {
        "name": "geolocation_engine",
        "version": "1.0.0",
        "phase": "P4",
        "description": "Background geolocation tracking and proximity alerts"
    }),
    
    # ==========================================
    # Phase P4+ - Hunting Trip Logger (Real Data)
    # ==========================================
    (hunting_trip_logger_router, {
        "name": "hunting_trip_logger",
        "version": "1.0.0",
        "phase": "P4+",
        "description": "Real data logging for hunting trips, waypoint visits, and observations"
    }),
    
    # ==========================================
    # Phase P5 - Roles Engine (User Roles & Permissions)
    # ==========================================
    (roles_router, {
        "name": "roles_engine",
        "version": "1.0.0",
        "phase": "P5",
        "description": "Role-based access control (hunter, guide, admin) and permissions management"
    }),
    
    # ==========================================
    # Phase 1 Cameras - Camera Engine (Photo Ingestion)
    # ==========================================
    (camera_router, {
        "name": "camera_engine",
        "version": "1.0.0",
        "phase": "P1-CAM",
        "description": "Camera management, email ingestion, and photo processing with mandatory waypoint"
    }),
]


def get_all_routers() -> List[APIRouter]:
    """Get all router instances"""
    return [router for router, _ in CORE_ROUTERS]


def get_router_info() -> List[dict]:
    """Get information about all available routers"""
    return [
        {
            **meta,
            "prefix": router.prefix
        }
        for router, meta in CORE_ROUTERS
    ]


def get_routers_by_phase(phase: int) -> List[dict]:
    """Get routers for a specific phase"""
    return [
        {**meta, "prefix": router.prefix}
        for router, meta in CORE_ROUTERS
        if meta.get("phase") == phase
    ]


def register_routers(app):
    """
    Register all module routers with a FastAPI app.
    
    Usage in server.py:
        from modules.routers import register_routers
        register_routers(app)
    """
    for router, meta in CORE_ROUTERS:
        app.include_router(router)
        print(f"✓ Registered module: {meta['name']} v{meta['version']} (Phase {meta.get('phase', '?')})")


# Module status endpoint data
MODULE_STATUS = {
    "total_modules": len(CORE_ROUTERS),
    "phase_2_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 2]),
    "phase_3_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 3]),
    "phase_4_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 4]),
    "phase_5_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 5]),
    "phase_6_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 6]),
    "phase_7_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 7]),
    "phase_8_modules": len([r for r, m in CORE_ROUTERS if m.get("phase") == 8]),
    "modules": [meta["name"] for _, meta in CORE_ROUTERS],
    "status": "operational",
    "architecture_version": "modular_v2.0"
}
