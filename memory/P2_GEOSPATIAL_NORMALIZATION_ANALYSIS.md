# 📊 RAPPORT D'ANALYSE P2 - NORMALISATION GÉOSPATIALE
## HUNTIQ V3 / BIONIC™

**Date:** 11 Février 2026  
**Phase:** P2 - Analyse Préalable (Aucune modification de code)  
**Auteur:** Agent E1  
**Validation requise:** Steeve Ross

---

## 1. RÉSUMÉ EXÉCUTIF

### 🎯 Objectif
Analyser l'ensemble des objets géospatiaux existants dans l'application HUNTIQ V3 pour proposer une normalisation complète et préparer la phase P3 (WebSocket, scoring météo-faune, admin global).

### 📋 Constat Principal
L'architecture géospatiale actuelle présente **5 modules distincts** qui gèrent des données géospatiales avec des schémas partiellement différents. Une normalisation est nécessaire pour garantir l'intégrité des données et faciliter l'évolution vers les phases P3+.

### ✅ Point Positif
La Phase P6 a déjà établi une **source de vérité principale** (`geo_entities`) avec un schéma unifié (`GeoEntity`). La normalisation P2 doit principalement aligner les modules satellites sur ce modèle.

---

## 2. INVENTAIRE DES OBJETS GÉOSPATIAUX

### 2.1 Modules Backend Identifiés

| Module | Préfixe API | Collection MongoDB | Schéma |
|--------|-------------|-------------------|--------|
| **geo_engine** | `/api/v1/geo` | `geo_entities` | `GeoEntity` (Pydantic) |
| **territory.py** | `/api/territory` | `territory_waypoints`, `territory_tracks`, `territory_events` | Modèles legacy |
| **territory_engine** | `/api/v1/territory` | `territories`, `land_rentals` | `Territory`, `LandRental` |
| **geolocation_engine** | `/api/v1/geolocation` | `geolocation_history`, `tracking_sessions` | `LocationUpdate`, `TrackingSession` |
| **geospatial_engine** | `/api/v1/geospatial` | N/A (calculs uniquement) | `Coordinates`, `TerrainAnalysis` |
| **geospatial_data.py** | N/A (service) | N/A | `WeatherData`, `TerrainData`, `VegetationData` |

### 2.2 Collections MongoDB Géospatiales

| Collection | Module Source | Index Géospatial | Documents Typiques |
|------------|---------------|------------------|-------------------|
| `geo_entities` | geo_engine | ✅ 2dsphere | waypoints, zones, hotspots, corridors |
| `territory_waypoints` | territory.py | ❌ | waypoints legacy |
| `territory_events` | territory.py | ❌ | observations, photos |
| `territory_tracks` | territory.py | ❌ | parcours GPS |
| `territories` | territory_engine | ❌ | ZEC, pourvoiries |
| `land_rentals` | territory_engine | ❌ | locations terrain |
| `geolocation_history` | geolocation_engine | ❌ | positions GPS |
| `tracking_sessions` | geolocation_engine | ❌ | sessions chasse |
| `hunting_groups` | geo_engine | ❌ | groupes chasse |

---

## 3. ANALYSE DES SCHÉMAS ACTUELS

### 3.1 Schéma Unifié Principal (geo_entity.py) ✅

**Localisation:** `/app/backend/models/geo_entity.py`

```python
class GeoEntityResponse(BaseModel):
    id: str
    user_id: str
    group_id: Optional[str]
    name: str
    entity_type: str  # waypoint, zone, hotspot, corridor, etc.
    subtype: Optional[str]
    
    # Coordonnées (format dual)
    latitude: Optional[float]
    longitude: Optional[float]
    location: Optional[Dict]  # GeoJSON Point
    
    # Géométrie
    geometry: Optional[Dict]  # GeoJSON Polygon
    radius: Optional[float]
    
    # Visuels
    color: Optional[str]
    icon: Optional[str]
    active: bool
    visible: bool
    
    # Métadonnées enrichies
    metadata: Optional[Dict]
    description: Optional[str]
    
    created_at: datetime
    updated_at: datetime
```

**Avantages:**
- Format GeoJSON standard (`Point`, `Polygon`)
- Métadonnées extensibles (habitat, densité, score)
- Support index 2dsphere MongoDB
- Types d'entités énumérés (`GeoEntityType`)

### 3.2 Schéma Legacy territory.py ⚠️

**Localisation:** `/app/backend/territory.py`

```python
class WaypointCreate(BaseModel):
    latitude: float
    longitude: float
    name: str
    description: Optional[str]
    waypoint_type: Literal[...]
    icon: Optional[str]
    active: Optional[bool]
    color: Optional[str]
    notes: Optional[str]
```

**Problèmes:**
- Pas de format GeoJSON (lat/lng séparés)
- Pas d'index géospatial
- Redondance avec `geo_entities`
- Collection `territory_waypoints` vs `geo_entities`

### 3.3 Schéma territory.py - Events

```python
class EventCreate(BaseModel):
    event_type: Literal['gps_track', 'cache', 'camera_photo', ...]
    latitude: float
    longitude: float
    species: Optional[str]
    species_confidence: Optional[float]
    captured_at: Optional[datetime]
    metadata: Optional[dict]
```

**Problèmes:**
- Schéma séparé des `geo_entities`
- Pas de lien avec les waypoints
- Pas d'index géospatial

### 3.4 Schéma geolocation_engine

```python
class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float]
    altitude: Optional[float]
    speed: Optional[float]
    heading: Optional[float]
    timestamp: Optional[datetime]
```

**Observation:**
- Données de tracking GPS (différent des waypoints)
- Temporaire par nature (historique positions)
- Collection séparée justifiée (haute fréquence)

### 3.5 Schéma territory_engine

```python
class Territory(BaseModel):
    id: str
    name: str
    type: TerritoryType  # zec, pourvoirie, public...
    region: str
    area_km2: float
    coordinates: List[Dict[str, float]]  # Polygon legacy
    species: List[str]
```

**Problèmes:**
- Format polygon non-GeoJSON
- Pas d'index géospatial
- Distinct de `geo_entities` zones

---

## 4. SOURCES DE VÉRITÉ ACTUELLES

### 4.1 État Actuel (Post-P6)

| Type de Donnée | Source de Vérité | Remarque |
|----------------|------------------|----------|
| Waypoints utilisateur | `geo_entities` | ✅ Normalisé P6 |
| Hotspots | `geo_entities` | ✅ Normalisé P6 |
| Corridors | `geo_entities` | ✅ Normalisé P6 |
| Zones de chasse | `geo_entities` | ✅ Normalisé P6 |
| Groupes de chasse | `hunting_groups` | ✅ Normalisé P6 |
| Waypoints legacy | `territory_waypoints` | ⚠️ À MIGRER/SUPPRIMER |
| Events/Observations | `territory_events` | ⚠️ À NORMALISER |
| Tracks GPS | `territory_tracks` | ⚠️ À NORMALISER |
| Territoires admin | `territories` | ⚠️ À NORMALISER |
| Locations tracking | `geolocation_history` | ✅ Distinct (OK) |
| Sessions tracking | `tracking_sessions` | ✅ Distinct (OK) |

### 4.2 Duplications Identifiées

1. **Waypoints:** `territory_waypoints` ET `geo_entities` 
   - Action: Supprimer `territory_waypoints`, utiliser uniquement `geo_entities`

2. **Events/Observations:** `territory_events` distinct
   - Action: Intégrer comme `entity_type: "observation"` dans `geo_entities`

3. **Territoires:** `territories` vs `geo_entities` (type zone)
   - Action: Unifier avec `entity_type: "territory"` ou conserver séparé (données admin statiques)

---

## 5. PROPOSITION DE MODÈLE UNIFIÉ P2

### 5.1 Schéma Cible Normalisé

**Collection principale:** `geo_entities` (existante, à enrichir)

```javascript
// Schéma MongoDB normalisé P2
{
  "_id": "UUID (string)",
  "user_id": "string",
  "group_id": "string | null",
  "name": "string",
  
  // Type principal + sous-type
  "entity_type": "waypoint|zone|hotspot|corridor|territory|observation|track|camera|feeder|stand|water_source|poi",
  "subtype": "string | null",
  
  // Localisation GeoJSON standard
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  
  // Géométrie (pour zones, territoires, tracks)
  "geometry": {
    "type": "Polygon|LineString",
    "coordinates": [...]
  },
  
  // Rayon (zones circulaires)
  "radius": "float (mètres)",
  
  // État
  "active": true,
  "visible": true,
  
  // Visuels
  "color": "#RRGGBB",
  "icon": "string",
  
  // Métadonnées extensibles
  "metadata": {
    // Environnement
    "habitat": "forest_mixed|clearing|wetland|...",
    "density": 0.0-1.0,
    "altitude": "float",
    "slope": 0-90,
    "exposure": "N|S|E|W|...",
    
    // Faune
    "species": "orignal|chevreuil|ours|autre",
    "species_confidence": 0.0-1.0,
    "count_estimate": "int",
    
    // Scores
    "wqs_score": 0-100,
    "activity_score": 0-100,
    "success_rate": 0-100,
    
    // Hotspots
    "is_auto_generated": false,
    "generation_source": "environmental|behavioral|user",
    "confidence": 0.0-1.0,
    "is_premium": false,
    "is_claimed": false,
    
    // Corridors
    "start_point_id": "string",
    "end_point_id": "string",
    "length_meters": "float",
    "traffic_score": 0-100,
    
    // Territoires
    "territory_type": "zec|pourvoirie|public|reserve|private",
    "region": "string",
    "area_km2": "float",
    "features": ["cabin", "guide", ...],
    
    // Observations
    "observation_type": "camera_photo|gps_track|manual|...",
    "captured_at": "datetime",
    "source": "app|camera|import|manual",
    
    // Tracks (LineString)
    "distance_km": "float",
    "duration_minutes": "float",
    "points_count": "int",
    
    // Legacy
    "legacy_id": "string",
    "migrated_from": "string",
    
    // Custom
    "tags": ["tag1", ...],
    "notes": "string",
    "custom": {}
  },
  
  "description": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 5.2 Index MongoDB Requis

```javascript
// Index existants (geo_engine)
db.geo_entities.createIndex({ "location": "2dsphere" })
db.geo_entities.createIndex({ "user_id": 1, "entity_type": 1 })
db.geo_entities.createIndex({ "group_id": 1, "entity_type": 1 })
db.geo_entities.createIndex({ "entity_type": 1, "active": 1 })

// Index additionnels P2
db.geo_entities.createIndex({ "metadata.species": 1 })
db.geo_entities.createIndex({ "metadata.territory_type": 1 })
db.geo_entities.createIndex({ "metadata.captured_at": -1 })
db.geo_entities.createIndex({ "geometry": "2dsphere" })  // Pour LineString/Polygon
```

### 5.3 Nouveaux Types d'Entités

| entity_type | Description | Migration Depuis |
|-------------|-------------|------------------|
| `observation` | Observation faune | `territory_events` |
| `track` | Parcours GPS | `territory_tracks` |
| `territory` | ZEC, pourvoirie... | `territories` |
| `camera_photo` | Photo caméra trail | `territory_photos` |

---

## 6. PLAN DE MIGRATION P2

### 6.1 Collections à Migrer

| Collection Source | Collection Cible | entity_type | Priorité |
|-------------------|------------------|-------------|----------|
| `territory_waypoints` | `geo_entities` | waypoint | ✅ DÉJÀ FAIT (P6) |
| `territory_events` | `geo_entities` | observation | 🔴 P2.1 |
| `territory_tracks` | `geo_entities` | track | 🔴 P2.2 |
| `territories` | `geo_entities` | territory | 🟡 P2.3 (optionnel) |
| `territory_photos` | Lien via metadata | - | 🟡 P2.4 |

### 6.2 Collections à Conserver (Distinctes)

| Collection | Raison |
|------------|--------|
| `geolocation_history` | Données haute fréquence, temporaires |
| `tracking_sessions` | Métadonnées de session, pas des entités géo |
| `hunting_groups` | Gestion groupes, pas des entités géo |
| `territory_cameras` | Configuration caméras, pas des entités géo |

### 6.3 Collections à Supprimer (Post-Migration)

| Collection | Après Migration |
|------------|-----------------|
| `territory_waypoints` | Supprimer (déjà migré P6) |
| `territory_events` | Supprimer après P2.1 |
| `territory_tracks` | Supprimer après P2.2 |

---

## 7. IMPACT SUR L'ARCHITECTURE

### 7.1 Modules Backend à Modifier

| Module | Modification | Effort |
|--------|--------------|--------|
| `territory.py` | Utiliser `geo_entities` au lieu de `territory_waypoints` | Moyen |
| `territory.py` | Migrer events vers `geo_entities` | Moyen |
| `territory.py` | Migrer tracks vers `geo_entities` | Moyen |
| `territory_engine/v1` | Optionnel: aligner sur `geo_entities` | Faible |
| `geo_engine/v1` | Ajouter support entity_type: observation, track | Faible |
| `geo_engine/admin.py` | Ajouter filtres pour nouveaux types | Faible |

### 7.2 Modules Frontend à Modifier

| Composant | Modification | Effort |
|-----------|--------------|--------|
| `WaypointMap.jsx` | Déjà unifié (P6) | Aucun |
| `TerritoryMap.jsx` | Vérifier utilisation `geo_entities` | Faible |
| `WaypointManager.jsx` | Adapter pour nouveaux types | Faible |
| Services | Unifier appels vers `/api/v1/geo` | Moyen |

### 7.3 Préparation P3 (WebSocket, Scoring)

L'unification P2 prépare directement:

1. **WebSocket Sync:** Tous les types d'entités utilisent le même schéma
2. **Scoring Météo-Faune:** Métadonnées uniformes pour calcul de scores
3. **Admin Global:** Vue unifiée de toutes les entités géospatiales

---

## 8. ESTIMATION ET SÉQUENCEMENT

### 8.1 Phases d'Implémentation

| Phase | Tâche | Dépendances |
|-------|-------|-------------|
| **P2.1** | Migration `territory_events` → `geo_entities` | Aucune |
| **P2.2** | Migration `territory_tracks` → `geo_entities` | P2.1 |
| **P2.3** | (Optionnel) Migration `territories` | P2.2 |
| **P2.4** | Nettoyage collections legacy | P2.1-P2.3 |
| **P2.5** | Mise à jour frontend | P2.1-P2.2 |
| **P2.6** | Tests et validation | P2.5 |

### 8.2 Risques et Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Perte de données migration | Élevé | Script de rollback, backup préalable |
| Régression API | Moyen | Tests E2E, endpoints legacy temporaires |
| Performance requêtes | Faible | Index 2dsphere existant |

---

## 9. RECOMMANDATIONS

### 9.1 Actions Immédiates (P2)

1. ✅ **Valider ce rapport** avant toute modification
2. 🔴 **Créer script de migration** `territory_events` → `geo_entities`
3. 🔴 **Créer script de migration** `territory_tracks` → `geo_entities`
4. 🔴 **Mettre à jour endpoints** `territory.py` pour utiliser `geo_entities`
5. 🔴 **Ajouter index MongoDB** pour nouveaux types

### 9.2 Actions Différées (P3+)

1. 🟡 **Intégrer WebSocket** pour sync temps réel de tous types
2. 🟡 **Scoring météo-faune** utilisant métadonnées unifiées
3. 🟡 **Dashboard Admin** avec filtres par entity_type

### 9.3 Recommandations Architecturales

1. **Conserver séparation** `geolocation_history` (données haute fréquence)
2. **Conserver séparation** `hunting_groups` (gestion groupes ≠ entités géo)
3. **Éviter sur-normalisation** `territories` si données admin statiques
4. **Documenter migration** dans CHANGELOG.md

---

## 10. CONCLUSION

L'analyse révèle que l'architecture géospatiale de HUNTIQ V3 est **partiellement normalisée** grâce aux travaux de la Phase P6. La collection `geo_entities` constitue déjà une excellente base.

**Travail restant:**
- Migrer 2 collections (`territory_events`, `territory_tracks`)
- Aligner les endpoints `territory.py`
- Supprimer les collections legacy

**Bénéfices attendus:**
- Source de vérité unique pour toutes les entités géospatiales
- Requêtes spatiales optimisées (2dsphere)
- Préparation directe pour P3 (WebSocket, scoring)
- Simplification de la maintenance

---

## 📎 ANNEXES

### A. Fichiers de Référence

```
/app/backend/models/geo_entity.py          # Modèle unifié principal
/app/backend/modules/geo_engine/v1/        # API principale
/app/backend/modules/geo_engine/admin.py   # API admin
/app/backend/territory.py                  # Module legacy à migrer
/app/backend/modules/territory_engine/v1/  # Territoires (optionnel)
/app/backend/modules/geolocation_engine/v1/ # Tracking GPS (distinct)
/app/backend/modules/geospatial_engine/v1/ # Calculs (pas de collection)
/app/memory/GEOSPATIAL_V3_ARCHITECTURE.md  # Documentation existante
/app/memory/UNIFIED_GEOSPATIAL_ARCHITECTURE.md
```

### B. Collections MongoDB Actuelles

```javascript
// Collections géospatiales
db.geo_entities.stats()       // Collection principale
db.territory_waypoints.stats() // Legacy - à supprimer
db.territory_events.stats()    // À migrer vers geo_entities
db.territory_tracks.stats()    // À migrer vers geo_entities
db.territories.stats()         // Optionnel - à migrer
db.geolocation_history.stats() // Conserver distinct
db.tracking_sessions.stats()   // Conserver distinct
db.hunting_groups.stats()      // Conserver distinct
```

---

**⏳ EN ATTENTE DE VALIDATION**

Ce rapport est soumis pour validation par Steeve Ross avant toute implémentation.  
Aucune modification de code ne sera effectuée sans approbation explicite.

---

*Document généré le 11 Février 2026*  
*HUNTIQ V3 / BIONIC™ - Phase P2 Analyse Géospatiale*
