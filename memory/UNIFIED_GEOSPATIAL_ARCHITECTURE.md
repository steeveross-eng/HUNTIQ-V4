# 🗺️ Architecture Géospatiale Unifiée - HUNTIQ V3

## Date: 10 Février 2026
## Version: 2.0.0 - Post-Unification P6

---

## 1. RÉSUMÉ

L'architecture géospatiale de HUNTIQ a été unifiée en Phase P6. 
**Source de vérité unique**: `territory_waypoints` (collection MongoDB)

---

## 2. ARCHITECTURE AVANT/APRÈS

### ❌ AVANT (Duplication)
```
MapPage.jsx → /api/user/waypoints → user_waypoints (collection)
TerritoryMap.jsx → /api/territory/waypoints → territory_waypoints (collection)
```

### ✅ APRÈS (Unifié)
```
MapPage.jsx ─────────┐
                     │
WaypointMap.jsx ─────┼──→ /api/territory/waypoints → territory_waypoints
                     │
TerritoryMap.jsx ────┘
```

---

## 3. API UNIFIÉE

### Endpoints
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/territory/waypoints?user_id={id}` | Liste tous les waypoints |
| POST | `/api/territory/waypoints?user_id={id}` | Créer un waypoint |
| DELETE | `/api/territory/waypoints/{waypoint_id}?user_id={id}` | Supprimer un waypoint |

### Schéma Waypoint
```json
{
  "id": "UUID",
  "user_id": "string",
  "latitude": float,
  "longitude": float,
  "name": "string",
  "description": "string",
  "waypoint_type": "observation|camera|cache|stand|water|trail_start|custom|hunting|feeder|sighting|parking",
  "icon": "string",
  "active": boolean,
  "color": "string",
  "notes": "string",
  "created_at": "datetime"
}
```

---

## 4. FICHIERS MODIFIÉS

### Backend
- `/app/backend/territory.py` - Modèles enrichis (active, color, notes)
- `/app/backend/server.py` - Ajout du router territory
- `/app/backend/user_waypoints.py` - **DÉPRÉCIÉ** (avertissement ajouté)

### Frontend
- `/app/frontend/src/modules/territory/components/WaypointMap.jsx`
  - Utilise maintenant `/api/territory/waypoints`
  - Fonction `normalizeWaypoint()` pour compatibilité
  - Fonction `getDefaultUserId()` pour authentification

### Documentation
- `/app/memory/DIAGNOSTIC_MAP_TERRITORY_SYNC.md` - Diagnostic initial
- `/app/memory/UNIFIED_GEOSPATIAL_ARCHITECTURE.md` - Ce document

---

## 5. MIGRATION EFFECTUÉE

```
Collection source: user_waypoints (2 documents)
Collection cible: territory_waypoints (2 documents migrés)

Mapping des champs:
  lat → latitude
  lng → longitude
  type → waypoint_type
  notes → description + notes
  _id (ObjectId) → id (UUID)
```

---

## 6. MODULES DÉPRÉCIES

### user_waypoints.py
```
⚠️ DEPRECATED - Phase P6 (Février 2026)
Routes: /api/user-data/waypoints/*, /api/user/waypoints
Collection: user_waypoints
Remplacement: /api/territory/waypoints
```

---

## 7. VISIBILITÉ BIDIRECTIONNELLE

| Source | Cible | Statut |
|--------|-------|--------|
| MapPage (WaypointMap) | TerritoryMap | ✅ Visible |
| TerritoryMap | MapPage (WaypointMap) | ✅ Visible |
| Nouvelle création Map | Territory | ✅ Sync |
| Nouvelle création Territory | Map | ✅ Sync |

---

## 8. PROCHAINES ÉTAPES

1. **Phase P7**: Supprimer complètement `user_waypoints.py`
2. **Phase P7**: Nettoyer la collection `user_waypoints` (optionnel - archivage)
3. **Phase P8**: Ajouter synchronisation temps réel (WebSocket)

---

*Document généré après unification Map ↔ Territory*
*HUNTIQ/BIONIC Platform - Phase P6*
