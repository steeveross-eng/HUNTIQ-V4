# 🗺️ Architecture Géospatiale V3 - HUNTIQ

## Date: 10 Février 2026
## Phase: P6.2 (Normalisation) + P6.3 (Optimisation) + P6.4 (WebSocket) + P6.5 (Admin)

---

## 1. RÉSUMÉ EXÉCUTIF

L'architecture géospatiale de HUNTIQ V3 a été entièrement refactorisée pour fournir:
- **Une source de vérité unique** via la collection `geo_entities`
- **Un schéma unifié** pour tous les types d'entités géospatiales
- **Une indexation optimisée** avec 2dsphere pour les requêtes spatiales
- **Une synchronisation temps réel** via WebSocket
- **Un espace admin global** pour la visualisation et l'analyse

---

## 2. SCHÉMA UNIFIÉ

### Collection: `geo_entities`

```json
{
  "_id": "UUID (string)",
  "user_id": "string",
  "group_id": "string | null",
  "name": "string",
  "entity_type": "waypoint|zone|sector|cache|camera|poi|hotspot|corridor|trail|stand|feeder|water_source|observation",
  "subtype": "string | null",
  
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  
  "geometry": "GeoJSON Polygon (pour zones)",
  "radius": "float (mètres, pour zones circulaires)",
  
  "color": "#RRGGBB",
  "icon": "string",
  "active": true,
  "visible": true,
  
  "metadata": {
    "habitat": "forest_mixed|forest_coniferous|forest_deciduous|clearing|wetland|field|edge|ridge|valley|stream",
    "density": 0.0-1.0,
    "altitude": "float (mètres)",
    "slope": 0-90,
    "exposure": "N|S|E|W|NE|NW|SE|SW|FLAT",
    "corridors": ["corridor_id_1", "corridor_id_2"],
    "nearby_zones": ["zone_id_1"],
    "nearby_water": "float (mètres)",
    "activity_score": 0-100,
    "best_time": "morning|evening|night",
    "seasonal_rating": {"spring": 0.8, "fall": 0.9},
    "tags": ["tag1", "tag2"],
    "notes": "string",
    
    // Hotspots spécifiques
    "is_auto_generated": false,
    "generation_source": "environmental|behavioral|user",
    "confidence": 0.0-1.0,
    "is_premium": false,
    "is_claimed": false,
    "claimed_by": "user_id",
    "wqs_score": 0-100,
    "success_rate": 0-100,
    
    // Corridors spécifiques
    "start_point_id": "string",
    "end_point_id": "string",
    "length_meters": "float",
    "traffic_score": 0-100
  },
  
  "description": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Collection: `hunting_groups`

```json
{
  "_id": "UUID",
  "name": "string",
  "owner_id": "user_id",
  "description": "string",
  "territory_id": "string | null",
  "members": [
    {"user_id": "string", "role": "owner|admin|member", "joined_at": "datetime"}
  ],
  "settings": {},
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 3. INDEX MONGODB

```javascript
// Index géospatial 2dsphere
db.geo_entities.createIndex({ "location": "2dsphere" })

// Index composites pour filtres fréquents
db.geo_entities.createIndex({ "user_id": 1, "entity_type": 1 })
db.geo_entities.createIndex({ "group_id": 1, "entity_type": 1 })
db.geo_entities.createIndex({ "entity_type": 1, "active": 1 })
db.geo_entities.createIndex({ "metadata.habitat": 1 })
db.geo_entities.createIndex({ "metadata.is_auto_generated": 1 })
db.geo_entities.createIndex({ "created_at": -1 })

// Index groupes de chasse
db.hunting_groups.createIndex({ "owner_id": 1 })
db.hunting_groups.createIndex({ "members.user_id": 1 })
```

---

## 4. API ENDPOINTS

### Geo Engine (`/api/v1/geo/`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Info module |
| POST | `/entities` | Créer une entité |
| GET | `/entities` | Lister les entités (filtres) |
| GET | `/entities/{id}` | Obtenir une entité |
| PUT | `/entities/{id}` | Mettre à jour |
| DELETE | `/entities/{id}` | Supprimer |
| GET | `/nearby` | Recherche par proximité (2dsphere) |
| GET | `/within-bbox` | Recherche dans un rectangle |
| GET | `/clusters` | Clustering pour la carte |
| POST | `/groups` | Créer un groupe de chasse |
| GET | `/groups` | Lister les groupes |
| POST | `/groups/{id}/members` | Ajouter un membre |
| DELETE | `/groups/{id}/members/{member_id}` | Retirer un membre |
| POST | `/hotspots/generate` | Auto-générer des hotspots |
| GET | `/stats` | Statistiques utilisateur |
| POST | `/migrate/from-territory-waypoints` | Migration legacy |

### Admin Geo Engine (`/api/admin/geo/`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Info module admin |
| GET | `/all` | Toutes les entités (admin) |
| GET | `/hotspots` | Tous les hotspots |
| GET | `/corridors` | Tous les corridors |
| GET | `/analytics/overview` | Analytics globales |
| GET | `/analytics/heatmap` | Données heatmap |
| GET | `/analytics/density-map` | Carte de densité |
| GET | `/monetization/available-hotspots` | Hotspots disponibles |
| POST | `/monetization/claim-hotspot/{id}` | Réclamer un hotspot |
| GET | `/export/geojson` | Export GeoJSON |

### WebSocket Geo Sync (`/ws/geo-sync`)

| Paramètre | Description |
|-----------|-------------|
| `token` | JWT ou user:user_id |
| `group_id` | ID du groupe de chasse |

**Messages entrants:**
- `geo.created` - Diffuser création
- `geo.updated` - Diffuser mise à jour
- `geo.deleted` - Diffuser suppression
- `location.update` - Position membre
- `ping` - Keep-alive

**Messages sortants:**
- `geo.created/updated/deleted` - Événements d'autres membres
- `member.joined/left` - Notifications membres
- `pong` - Réponse keep-alive
- `error` - Erreurs

---

## 5. FRONTEND COMPONENTS

### Pages
- `/admin/geo` → `AdminGeoPage.jsx` - Dashboard admin global

### Components
- `GeoSyncToggle.jsx` - Toggle synchronisation temps réel
  - Props: `groupId`, `userId`, `onEntityReceived`, `onMemberJoined`, `onMemberLeft`
  - Hook: `useGeoSync(groupId, userId)` pour intégration custom

---

## 6. HOTSPOT AUTO-GENERATION

L'algorithme de génération automatique utilise:

1. **Distribution spatiale** - Golden angle pour couverture uniforme
2. **Scoring habitat** - Score basé sur lisières et terrain
3. **Scoring corridor** - Score basé sur connectivité
4. **Scoring densité** - Basé sur patterns terrain

**Formule de confiance:**
```
confidence = habitat_score * 0.4 + corridor_score * 0.35 + density_score * 0.25
```

**Classification:**
- `confidence > 0.7` → Premium (rouge)
- `confidence > 0.5` → Bon (orange)
- `confidence > 0.3` → Standard (jaune)
- `confidence < 0.3` → Rejeté

---

## 7. MIGRATION DEPUIS LEGACY

### Collections migrées:
- `territory_waypoints` → `geo_entities` (entity_type: "waypoint")
- `user_waypoints` → Déprécié (routes marquées deprecated)

### Mapping des champs:
```
latitude → location.coordinates[1]
longitude → location.coordinates[0]
waypoint_type → subtype
notes → metadata.notes + description
active → active
color → color
```

---

## 8. FICHIERS DE RÉFÉRENCE

### Backend
- `/app/backend/models/geo_entity.py` - Modèles Pydantic unifiés
- `/app/backend/modules/geo_engine/v1/__init__.py` - API principale
- `/app/backend/modules/geo_engine/admin.py` - API admin
- `/app/backend/websocket/geo_sync.py` - WebSocket manager

### Frontend
- `/app/frontend/src/pages/AdminGeoPage.jsx` - Dashboard admin
- `/app/frontend/src/components/GeoSyncToggle.jsx` - Toggle WebSocket

### Documentation
- `/app/memory/GEOSPATIAL_V3_ARCHITECTURE.md` - Ce document
- `/app/memory/DIAGNOSTIC_MAP_TERRITORY_SYNC.md` - Diagnostic initial
- `/app/memory/UNIFIED_GEOSPATIAL_ARCHITECTURE.md` - Architecture unifiée

---

## 9. PERFORMANCE

### Requêtes spatiales
- Index 2dsphere permet des requêtes `$near` en O(log n)
- Clustering réduit le nombre de markers à afficher
- Lazy loading avec pagination (limit/skip)

### WebSocket
- Keep-alive toutes les 30 secondes
- Reconnexion automatique après déconnexion
- Isolation par groupe (pas de broadcast global)

### Cache
- LRU cache pour requêtes fréquentes (200 items, 60s TTL)
- Projections MongoDB pour champs essentiels uniquement

---

## 10. SÉCURITÉ

- **Authentification WebSocket** - Token JWT requis
- **Isolation utilisateur** - Entités filtrées par user_id
- **Isolation groupe** - Broadcast limité au groupe
- **Admin** - Endpoints /api/admin/* protégés (à sécuriser avec @require_admin)

---

*Document généré Phase P6 - Chantier Géospatial Intégré*
*HUNTIQ V3 - Architecture Modulaire v2.0*
