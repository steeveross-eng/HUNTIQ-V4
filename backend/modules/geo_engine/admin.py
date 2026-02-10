"""
Admin Geo Engine - Global Geospatial Administration
Phase P6.5 - Admin Dashboard Backend

Provides administrative access to all geospatial data:
- View all waypoints, hotspots, corridors (registered and auto-generated)
- Advanced filtering (density, habitat, season, group, user)
- Analytics and statistics
- Hotspot monetization preparation
"""

from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import logging

from models.geo_entity import GeoEntityResponse, GeoStatsResponse, HabitatType
from database import Database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/geo", tags=["Admin Geo (Global View)"])

GEO_COLLECTION = "geo_entities"


async def get_db():
    """Get database instance"""
    return Database.get_database()


# ===========================================
# GLOBAL VIEW ENDPOINTS
# ===========================================

@router.get("/all", response_model=List[GeoEntityResponse])
async def get_all_entities(
    entity_type: Optional[str] = None,
    habitat: Optional[str] = None,
    min_density: Optional[float] = Query(None, ge=0, le=1),
    max_density: Optional[float] = Query(None, ge=0, le=1),
    is_auto_generated: Optional[bool] = None,
    is_premium: Optional[bool] = None,
    is_claimed: Optional[bool] = None,
    user_id: Optional[str] = None,
    group_id: Optional[str] = None,
    active: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    # Admin auth
    admin_token: str = Query(None)  # Simplified auth for now
):
    """
    Get ALL geo entities across all users (admin only).
    Supports advanced filtering for analysis.
    """
    db = await get_db()
    
    # Build query
    query: Dict[str, Any] = {}
    
    if entity_type:
        query["entity_type"] = entity_type
    
    if habitat:
        query["metadata.habitat"] = habitat
    
    if min_density is not None:
        query.setdefault("metadata.density", {})["$gte"] = min_density
    
    if max_density is not None:
        query.setdefault("metadata.density", {})["$lte"] = max_density
    
    if is_auto_generated is not None:
        query["metadata.is_auto_generated"] = is_auto_generated
    
    if is_premium is not None:
        query["metadata.is_premium"] = is_premium
    
    if is_claimed is not None:
        query["metadata.is_claimed"] = is_claimed
    
    if user_id:
        query["user_id"] = user_id
    
    if group_id:
        query["group_id"] = group_id
    
    if active is not None:
        query["active"] = active
    
    cursor = db[GEO_COLLECTION].find(query).sort("created_at", -1).skip(skip).limit(limit)
    entities = await cursor.to_list(limit)
    
    return [GeoEntityResponse.from_document(doc) for doc in entities]


@router.get("/hotspots")
async def get_all_hotspots(
    status: Optional[str] = Query(None, description="claimed|unclaimed|premium|auto"),
    min_confidence: Optional[float] = Query(None, ge=0, le=1),
    habitat: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500)
):
    """
    Get all hotspots with detailed scoring and status.
    Useful for monetization analysis.
    """
    db = await get_db()
    
    query: Dict[str, Any] = {"entity_type": "hotspot"}
    
    if status == "claimed":
        query["metadata.is_claimed"] = True
    elif status == "unclaimed":
        query["metadata.is_claimed"] = False
    elif status == "premium":
        query["metadata.is_premium"] = True
    elif status == "auto":
        query["metadata.is_auto_generated"] = True
    
    if min_confidence is not None:
        query["metadata.confidence"] = {"$gte": min_confidence}
    
    if habitat:
        query["metadata.habitat"] = habitat
    
    pipeline = [
        {"$match": query},
        {"$sort": {"metadata.confidence": -1, "created_at": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {"$project": {
            "_id": 1,
            "name": 1,
            "location": 1,
            "user_id": 1,
            "metadata": 1,
            "created_at": 1,
            "active": 1,
            "confidence": "$metadata.confidence",
            "is_premium": "$metadata.is_premium",
            "is_claimed": "$metadata.is_claimed",
            "habitat": "$metadata.habitat",
            "density": "$metadata.density"
        }}
    ]
    
    hotspots = await db[GEO_COLLECTION].aggregate(pipeline).to_list(limit)
    
    # Calculate monetization potential
    premium_unclaimed = sum(1 for h in hotspots if h.get("is_premium") and not h.get("is_claimed"))
    
    return {
        "hotspots": [
            {
                "id": str(h["_id"]),
                "name": h.get("name"),
                "latitude": h["location"]["coordinates"][1] if h.get("location") else None,
                "longitude": h["location"]["coordinates"][0] if h.get("location") else None,
                "confidence": h.get("confidence"),
                "is_premium": h.get("is_premium", False),
                "is_claimed": h.get("is_claimed", False),
                "habitat": h.get("habitat"),
                "density": h.get("density"),
                "created_at": h.get("created_at")
            }
            for h in hotspots
        ],
        "summary": {
            "total": len(hotspots),
            "premium_unclaimed": premium_unclaimed,
            "monetization_potential": premium_unclaimed  # Simple metric
        }
    }


@router.get("/corridors")
async def get_all_corridors(
    min_traffic: Optional[float] = Query(None, ge=0, le=100),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500)
):
    """
    Get all detected wildlife corridors.
    """
    db = await get_db()
    
    query: Dict[str, Any] = {"entity_type": "corridor"}
    
    if min_traffic is not None:
        query["metadata.traffic_score"] = {"$gte": min_traffic}
    
    cursor = db[GEO_COLLECTION].find(query).sort("metadata.traffic_score", -1).skip(skip).limit(limit)
    corridors = await cursor.to_list(limit)
    
    return {
        "corridors": [GeoEntityResponse.from_document(c) for c in corridors],
        "total": len(corridors)
    }


# ===========================================
# ANALYTICS ENDPOINTS
# ===========================================

@router.get("/analytics/overview")
async def get_analytics_overview():
    """
    Get comprehensive analytics overview for all geo data.
    """
    db = await get_db()
    
    pipeline = [
        {"$facet": {
            "total": [{"$count": "count"}],
            "by_type": [
                {"$group": {"_id": "$entity_type", "count": {"$sum": 1}}}
            ],
            "by_habitat": [
                {"$match": {"metadata.habitat": {"$exists": True, "$ne": None}}},
                {"$group": {"_id": "$metadata.habitat", "count": {"$sum": 1}}}
            ],
            "by_user": [
                {"$group": {"_id": "$user_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ],
            "by_group": [
                {"$match": {"group_id": {"$exists": True, "$ne": None}}},
                {"$group": {"_id": "$group_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ],
            "auto_generated": [
                {"$match": {"metadata.is_auto_generated": True}},
                {"$count": "count"}
            ],
            "premium_hotspots": [
                {"$match": {"entity_type": "hotspot", "metadata.is_premium": True}},
                {"$count": "count"}
            ],
            "claimed_hotspots": [
                {"$match": {"entity_type": "hotspot", "metadata.is_claimed": True}},
                {"$count": "count"}
            ],
            "avg_confidence": [
                {"$match": {"metadata.confidence": {"$exists": True}}},
                {"$group": {"_id": None, "avg": {"$avg": "$metadata.confidence"}}}
            ],
            "avg_density": [
                {"$match": {"metadata.density": {"$exists": True}}},
                {"$group": {"_id": None, "avg": {"$avg": "$metadata.density"}}}
            ],
            "recent_activity": [
                {"$sort": {"created_at": -1}},
                {"$limit": 5},
                {"$project": {"_id": 1, "name": 1, "entity_type": 1, "created_at": 1}}
            ]
        }}
    ]
    
    result = await db[GEO_COLLECTION].aggregate(pipeline).to_list(1)
    
    if not result:
        return {
            "total_entities": 0,
            "by_type": {},
            "by_habitat": {},
            "top_users": [],
            "top_groups": [],
            "auto_generated_count": 0,
            "premium_hotspots": 0,
            "claimed_hotspots": 0,
            "avg_confidence": 0,
            "avg_density": 0,
            "recent_activity": []
        }
    
    data = result[0]
    
    # Safely extract counts with defaults
    def safe_count(facet_result):
        if facet_result and len(facet_result) > 0:
            return facet_result[0].get("count", 0)
        return 0
    
    def safe_avg(facet_result):
        if facet_result and len(facet_result) > 0:
            return facet_result[0].get("avg", 0) or 0
        return 0
    
    return {
        "total_entities": safe_count(data.get("total", [])),
        "by_type": {item["_id"]: item["count"] for item in data.get("by_type", []) if item.get("_id")},
        "by_habitat": {item["_id"]: item["count"] for item in data.get("by_habitat", []) if item.get("_id")},
        "top_users": [
            {"user_id": item["_id"], "count": item["count"]}
            for item in data.get("by_user", []) if item.get("_id")
        ],
        "top_groups": [
            {"group_id": item["_id"], "count": item["count"]}
            for item in data.get("by_group", []) if item.get("_id")
        ],
        "auto_generated_count": safe_count(data.get("auto_generated", [])),
        "premium_hotspots": safe_count(data.get("premium_hotspots", [])),
        "claimed_hotspots": safe_count(data.get("claimed_hotspots", [])),
        "avg_confidence": round(safe_avg(data.get("avg_confidence", [])), 3),
        "avg_density": round(safe_avg(data.get("avg_density", [])), 3),
        "recent_activity": [
            {
                "id": str(item["_id"]),
                "name": item.get("name"),
                "type": item.get("entity_type"),
                "created_at": item.get("created_at").isoformat() if item.get("created_at") else None
            }
            for item in data.get("recent_activity", [])
        ]
    }


@router.get("/analytics/heatmap")
async def get_heatmap_data(
    entity_type: Optional[str] = None,
    resolution: int = Query(20, ge=5, le=100, description="Grid resolution")
):
    """
    Get heatmap data for visualization.
    Returns aggregated points for efficient rendering.
    """
    db = await get_db()
    
    match_stage = {"location": {"$exists": True}}
    if entity_type:
        match_stage["entity_type"] = entity_type
    
    # Calculate grid size (approximate degrees)
    grid_size = 1.0 / resolution
    
    pipeline = [
        {"$match": match_stage},
        {"$project": {
            "entity_type": 1,
            "lat": {"$arrayElemAt": ["$location.coordinates", 1]},
            "lng": {"$arrayElemAt": ["$location.coordinates", 0]},
            "density": "$metadata.density",
            "confidence": "$metadata.confidence"
        }},
        {"$group": {
            "_id": {
                "lat_grid": {"$floor": {"$divide": ["$lat", grid_size]}},
                "lng_grid": {"$floor": {"$divide": ["$lng", grid_size]}}
            },
            "count": {"$sum": 1},
            "avg_lat": {"$avg": "$lat"},
            "avg_lng": {"$avg": "$lng"},
            "avg_density": {"$avg": "$density"},
            "avg_confidence": {"$avg": "$confidence"},
            "types": {"$addToSet": "$entity_type"}
        }},
        {"$project": {
            "_id": 0,
            "latitude": "$avg_lat",
            "longitude": "$avg_lng",
            "intensity": "$count",
            "density": "$avg_density",
            "confidence": "$avg_confidence",
            "types": 1
        }}
    ]
    
    heatmap_points = await db[GEO_COLLECTION].aggregate(pipeline).to_list(1000)
    
    return {
        "resolution": resolution,
        "points": heatmap_points,
        "total_points": len(heatmap_points)
    }


@router.get("/analytics/density-map")
async def get_density_map(
    bbox_sw_lat: float = Query(...),
    bbox_sw_lng: float = Query(...),
    bbox_ne_lat: float = Query(...),
    bbox_ne_lng: float = Query(...)
):
    """
    Get density data within a bounding box for detailed analysis.
    """
    db = await get_db()
    
    pipeline = [
        {"$match": {
            "location": {
                "$geoWithin": {
                    "$box": [
                        [bbox_sw_lng, bbox_sw_lat],
                        [bbox_ne_lng, bbox_ne_lat]
                    ]
                }
            }
        }},
        {"$group": {
            "_id": "$entity_type",
            "count": {"$sum": 1},
            "avg_density": {"$avg": "$metadata.density"},
            "points": {
                "$push": {
                    "lat": {"$arrayElemAt": ["$location.coordinates", 1]},
                    "lng": {"$arrayElemAt": ["$location.coordinates", 0]},
                    "density": "$metadata.density"
                }
            }
        }}
    ]
    
    result = await db[GEO_COLLECTION].aggregate(pipeline).to_list(20)
    
    return {
        "bbox": {
            "sw": {"lat": bbox_sw_lat, "lng": bbox_sw_lng},
            "ne": {"lat": bbox_ne_lat, "lng": bbox_ne_lng}
        },
        "data": result
    }


# ===========================================
# MONETIZATION ENDPOINTS
# ===========================================

@router.get("/monetization/available-hotspots")
async def get_available_hotspots(
    min_confidence: float = Query(0.5, ge=0, le=1),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Get unclaimed premium hotspots available for monetization.
    """
    db = await get_db()
    
    pipeline = [
        {"$match": {
            "entity_type": "hotspot",
            "metadata.is_premium": True,
            "metadata.is_claimed": {"$ne": True},
            "metadata.confidence": {"$gte": min_confidence}
        }},
        {"$sort": {"metadata.confidence": -1}},
        {"$limit": limit},
        {"$project": {
            "_id": 1,
            "name": 1,
            "location": 1,
            "metadata": 1,
            "created_at": 1
        }}
    ]
    
    hotspots = await db[GEO_COLLECTION].aggregate(pipeline).to_list(limit)
    
    return {
        "available_hotspots": [
            {
                "id": str(h["_id"]),
                "name": h.get("name"),
                "latitude": h["location"]["coordinates"][1] if h.get("location") else None,
                "longitude": h["location"]["coordinates"][0] if h.get("location") else None,
                "confidence": h.get("metadata", {}).get("confidence"),
                "habitat": h.get("metadata", {}).get("habitat"),
                "density": h.get("metadata", {}).get("density"),
                "estimated_value": _calculate_hotspot_value(h.get("metadata", {}))
            }
            for h in hotspots
        ],
        "total_available": len(hotspots)
    }


@router.post("/monetization/claim-hotspot/{hotspot_id}")
async def claim_hotspot(hotspot_id: str, user_id: str = Query(...)):
    """
    Claim a premium hotspot for a user.
    """
    db = await get_db()
    
    result = await db[GEO_COLLECTION].find_one_and_update(
        {
            "_id": hotspot_id,
            "entity_type": "hotspot",
            "metadata.is_premium": True,
            "metadata.is_claimed": {"$ne": True}
        },
        {
            "$set": {
                "metadata.is_claimed": True,
                "metadata.claimed_by": user_id,
                "metadata.claimed_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
        },
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Hotspot not found or already claimed")
    
    return {
        "status": "claimed",
        "hotspot_id": hotspot_id,
        "claimed_by": user_id
    }


def _calculate_hotspot_value(metadata: dict) -> float:
    """Calculate estimated value of a hotspot for monetization"""
    confidence = metadata.get("confidence", 0.5)
    density = metadata.get("density", 0.5)
    
    # Simple value calculation (can be made more sophisticated)
    base_value = 10.0
    confidence_multiplier = 1 + (confidence * 2)
    density_multiplier = 1 + (density * 1.5)
    
    return round(base_value * confidence_multiplier * density_multiplier, 2)


# ===========================================
# EXPORT ENDPOINTS
# ===========================================

@router.get("/export/geojson")
async def export_geojson(
    entity_type: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = Query(1000, ge=1, le=10000)
):
    """
    Export geo entities as GeoJSON FeatureCollection.
    """
    db = await get_db()
    
    query: Dict[str, Any] = {"location": {"$exists": True}}
    
    if entity_type:
        query["entity_type"] = entity_type
    if user_id:
        query["user_id"] = user_id
    
    cursor = db[GEO_COLLECTION].find(query).limit(limit)
    entities = await cursor.to_list(limit)
    
    features = []
    for e in entities:
        feature = {
            "type": "Feature",
            "geometry": e.get("location"),
            "properties": {
                "id": str(e["_id"]),
                "name": e.get("name"),
                "entity_type": e.get("entity_type"),
                "subtype": e.get("subtype"),
                "user_id": e.get("user_id"),
                "active": e.get("active"),
                "metadata": e.get("metadata", {}),
                "created_at": e.get("created_at", "").isoformat() if e.get("created_at") else None
            }
        }
        features.append(feature)
    
    return {
        "type": "FeatureCollection",
        "features": features,
        "properties": {
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "total_features": len(features)
        }
    }


# ===========================================
# MODULE INFO
# ===========================================

@router.get("/")
async def admin_module_info():
    """Get admin module information"""
    return {
        "module": "admin_geo_engine",
        "version": "1.0.0",
        "description": "Global Geospatial Administration for HUNTIQ V3",
        "phase": "P6.5 - Admin Dashboard",
        "features": [
            "Global view of all geo entities",
            "Advanced filtering (habitat, density, user, group)",
            "Hotspot monetization tools",
            "Analytics and heatmap generation",
            "GeoJSON export"
        ],
        "endpoints": {
            "all": "/api/admin/geo/all",
            "hotspots": "/api/admin/geo/hotspots",
            "corridors": "/api/admin/geo/corridors",
            "analytics": "/api/admin/geo/analytics/overview",
            "heatmap": "/api/admin/geo/analytics/heatmap",
            "monetization": "/api/admin/geo/monetization/available-hotspots",
            "export": "/api/admin/geo/export/geojson"
        }
    }
