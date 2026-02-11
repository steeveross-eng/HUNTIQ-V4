# 📋 PLAN D'IMPLÉMENTATION P2 - NORMALISATION GÉOSPATIALE
## HUNTIQ V3 / BIONIC™

**Date:** 11 Février 2026  
**Phase:** P2 - Implémentation  
**Statut:** EN ATTENTE DE VALIDATION  
**Auteur:** Agent E1  
**Référence:** `/app/memory/P2_GEOSPATIAL_NORMALIZATION_ANALYSIS.md`

---

## 1. OBJECTIF

Normaliser toutes les données géospatiales vers la collection unifiée `geo_entities` en suivant une approche réversible et progressive, préparant ainsi les phases P3 (WebSocket, scoring météo-faune).

---

## 2. SCHÉMA FINAL UNIFIÉ

### 2.1 Collection Cible: `geo_entities`

```javascript
// Schéma MongoDB normalisé final
{
  // Identifiants
  "_id": "string (UUID)",
  "user_id": "string",
  "group_id": "string | null",
  
  // Identification
  "name": "string",
  "entity_type": "waypoint|zone|hotspot|corridor|observation|track|territory|camera|feeder|stand|water_source|poi",
  "subtype": "string | null",
  
  // Localisation GeoJSON
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  
  // Géométrie (zones, territoires, tracks)
  "geometry": {
    "type": "Polygon|LineString",
    "coordinates": [...]
  },
  "radius": "float | null",
  
  // État
  "active": true,
  "visible": true,
  
  // Visuels
  "color": "#RRGGBB | null",
  "icon": "string | null",
  
  // Métadonnées enrichies
  "metadata": {
    // === Environnement (tous types) ===
    "habitat": "forest_mixed|clearing|wetland|...",
    "density": 0.0-1.0,
    "altitude": "float",
    "slope": 0-90,
    "exposure": "N|S|E|W|...",
    
    // === Faune (observations) ===
    "species": "orignal|chevreuil|ours|autre",
    "species_confidence": 0.0-1.0,
    "count_estimate": "int",
    
    // === Scoring (waypoints, hotspots) ===
    "wqs_score": 0-100,
    "activity_score": 0-100,
    "success_rate": 0-100,
    
    // === Hotspots ===
    "is_auto_generated": false,
    "generation_source": "environmental|behavioral|user",
    "confidence": 0.0-1.0,
    "is_premium": false,
    "is_claimed": false,
    "claimed_by": "string | null",
    
    // === Corridors ===
    "start_point_id": "string",
    "end_point_id": "string",
    "length_meters": "float",
    "traffic_score": 0-100,
    
    // === Territoires ===
    "territory_type": "zec|pourvoirie|public|reserve|private",
    "region": "string",
    "area_km2": "float",
    "features": ["cabin", "guide", ...],
    "contact_info": {},
    
    // === Observations (events migrés) ===
    "event_type": "gps_track|cache|camera_photo|tir|observation|saline|attractant",
    "captured_at": "datetime",
    "source": "app|camera|import|manual",
    "photo_id": "string | null",
    
    // === Tracks (LineString) ===
    "distance_km": "float",
    "duration_minutes": "float",
    "points_count": "int",
    "points": [{"lat": x, "lng": y, "timestamp": z}, ...],
    "started_at": "datetime",
    "ended_at": "datetime | null",
    "is_recording": false,
    
    // === Migration ===
    "legacy_id": "string | null",
    "migrated_from": "territory_events|territory_tracks|territories",
    "migration_date": "datetime",
    
    // === Custom ===
    "tags": [],
    "notes": "string",
    "custom": {}
  },
  
  "description": "string | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 2.2 Nouveaux entity_type

| entity_type | Description | Source Migration |
|-------------|-------------|------------------|
| `observation` | Observation faune (event migré) | `territory_events` |
| `track` | Parcours GPS complet | `territory_tracks` |
| `territory` | ZEC, pourvoirie, réserve | `territories` (optionnel) |

### 2.3 Index MongoDB Additionnels

```javascript
// Index pour nouveaux types
db.geo_entities.createIndex({ "metadata.species": 1 })
db.geo_entities.createIndex({ "metadata.event_type": 1 })
db.geo_entities.createIndex({ "metadata.captured_at": -1 })
db.geo_entities.createIndex({ "metadata.territory_type": 1 })
db.geo_entities.createIndex({ "geometry": "2dsphere" })

// Index pour migration (temporaire)
db.geo_entities.createIndex({ "metadata.legacy_id": 1 })
db.geo_entities.createIndex({ "metadata.migrated_from": 1 })
```

---

## 3. PLAN DE MIGRATION DÉTAILLÉ

### 3.1 Phase P2.1 - Migration territory_events → geo_entities

**Objectif:** Migrer toutes les observations/events vers `geo_entities` avec `entity_type: "observation"`

**Mapping des champs:**

| Champ Source (territory_events) | Champ Cible (geo_entities) |
|--------------------------------|---------------------------|
| `_id` | `metadata.legacy_id` |
| `user_id` | `user_id` |
| `event_type` | `metadata.event_type` |
| `latitude` | `location.coordinates[1]` |
| `longitude` | `location.coordinates[0]` |
| `species` | `metadata.species` |
| `species_confidence` | `metadata.species_confidence` |
| `count_estimate` | `metadata.count_estimate` |
| `captured_at` | `metadata.captured_at` |
| `source` | `metadata.source` |
| `metadata` | Fusionné dans `metadata` |
| `created_at` | `created_at` |

**Script:** `/app/backend/migrations/p2_migrate_events.py`

**Validation:**
- [ ] Comptage documents avant/après
- [ ] Vérification coordonnées GeoJSON
- [ ] Test requête spatiale $near
- [ ] Validation métadonnées espèces

### 3.2 Phase P2.2 - Migration territory_tracks → geo_entities

**Objectif:** Migrer tous les parcours GPS vers `geo_entities` avec `entity_type: "track"`

**Mapping des champs:**

| Champ Source (territory_tracks) | Champ Cible (geo_entities) |
|--------------------------------|---------------------------|
| `_id` | `metadata.legacy_id` |
| `user_id` | `user_id` |
| `name` | `name` |
| `description` | `description` |
| `points` | `metadata.points` + `geometry` (LineString) |
| `distance_km` | `metadata.distance_km` |
| `started_at` | `metadata.started_at` |
| `ended_at` | `metadata.ended_at` |
| `is_active` | `metadata.is_recording` |
| `created_at` | `created_at` |

**Particularité:** Le premier point devient `location`, tous les points deviennent `geometry.coordinates` (LineString)

**Script:** `/app/backend/migrations/p2_migrate_tracks.py`

**Validation:**
- [ ] Comptage documents avant/après
- [ ] Vérification LineString valide
- [ ] Test calcul distance depuis geometry
- [ ] Validation points array

### 3.3 Phase P2.3 - Migration territories (OPTIONNEL)

**Objectif:** Migrer les territoires (ZEC, pourvoiries) vers `geo_entities` avec `entity_type: "territory"`

**Note:** Cette migration est optionnelle car les territoires sont des données administratives statiques qui peuvent rester dans une collection séparée.

**Recommandation:** Reporter à P3 si non critique.

### 3.4 Phase P2.4 - Mise à jour endpoints territory.py

**Fichier:** `/app/backend/territory.py`

**Modifications:**

1. **Endpoints Events:**
   - `GET /api/territory/events/recent` → Requête `geo_entities` avec `entity_type: "observation"`
   - `GET /api/territory/events/species/{species}` → Filtre `metadata.species`
   - `POST /api/territory/events` → Crée dans `geo_entities`
   - `DELETE /api/territory/events/{id}` → Supprime de `geo_entities`

2. **Endpoints Tracks:**
   - `GET /api/territory/tracks` → Requête `geo_entities` avec `entity_type: "track"`
   - `POST /api/territory/tracks` → Crée dans `geo_entities`
   - `POST /api/territory/tracks/{id}/points` → Update `metadata.points`
   - `POST /api/territory/tracks/{id}/stop` → Update `metadata.is_recording: false`
   - `GET /api/territory/tracks/{id}` → Requête `geo_entities`

3. **Endpoints Waypoints:** (déjà migrés P6)
   - Vérifier utilisation de `geo_entities` via `geo_engine`

### 3.5 Phase P2.5 - Nettoyage collections legacy

**Actions:**
1. Créer backup des collections
2. Supprimer `territory_events` (après validation P2.1)
3. Supprimer `territory_tracks` (après validation P2.2)
4. Mettre à jour documentation

### 3.6 Phase P2.6 - Tests et validation finale

**Tests Backend:**
- [ ] API events CRUD
- [ ] API tracks CRUD
- [ ] Requêtes spatiales $near avec observations
- [ ] Requêtes spatiales avec tracks (LineString)
- [ ] Performance avec index 2dsphere

**Tests Frontend:**
- [ ] TerritoryMap affiche observations
- [ ] TerritoryMap affiche tracks
- [ ] WaypointManager compatible nouveaux types

---

## 4. ENDPOINTS À MODIFIER

### 4.1 Backend - territory.py

| Endpoint Actuel | Modification | Collection |
|-----------------|--------------|------------|
| `GET /api/territory/events/recent` | Requête `geo_entities` | `geo_entities` |
| `GET /api/territory/events/species/{species}` | Filtre `metadata.species` | `geo_entities` |
| `POST /api/territory/events` | Insert `geo_entities` | `geo_entities` |
| `DELETE /api/territory/events/{event_id}` | Delete `geo_entities` | `geo_entities` |
| `GET /api/territory/tracks` | Requête `geo_entities` | `geo_entities` |
| `POST /api/territory/tracks` | Insert `geo_entities` | `geo_entities` |
| `POST /api/territory/tracks/{id}/points` | Update `geo_entities` | `geo_entities` |
| `POST /api/territory/tracks/{id}/stop` | Update `geo_entities` | `geo_entities` |
| `GET /api/territory/tracks/{id}` | Requête `geo_entities` | `geo_entities` |
| `DELETE /api/territory/tracks/{id}` | Delete `geo_entities` | `geo_entities` |
| `GET /api/territory/layers/heatmap_activite` | Agrégation `geo_entities` | `geo_entities` |

### 4.2 Backend - geo_engine/v1/__init__.py

| Modification | Description |
|--------------|-------------|
| Ajouter `observation` à `GeoEntityType` | Nouveau type d'entité |
| Ajouter `track` à `GeoEntityType` | Nouveau type d'entité |
| Ajouter filtre `metadata.species` | Pour requêtes observations |
| Ajouter support `geometry: LineString` | Pour tracks |

### 4.3 Backend - geo_engine/admin.py

| Modification | Description |
|--------------|-------------|
| Ajouter filtre `entity_type: observation` | Vue admin observations |
| Ajouter filtre `entity_type: track` | Vue admin tracks |
| Ajouter analytics observations | Statistiques espèces |

### 4.4 Frontend - Services

| Service | Modification |
|---------|--------------|
| `TerritoryService.js` | Adapter pour nouveaux types |
| `GeoService.js` (si existant) | Unifier appels |

---

## 5. IMPACTS BACKEND/FRONTEND

### 5.1 Impacts Backend

| Module | Impact | Effort |
|--------|--------|--------|
| `territory.py` | Refactoring majeur des endpoints events/tracks | **ÉLEVÉ** |
| `geo_engine/v1` | Ajout types, filtres | **FAIBLE** |
| `geo_engine/admin.py` | Ajout vues observations/tracks | **FAIBLE** |
| `models/geo_entity.py` | Ajout enums, métadonnées | **FAIBLE** |
| `websocket/geo_sync.py` | Support nouveaux types (P3) | DIFFÉRÉ |

### 5.2 Impacts Frontend

| Composant | Impact | Effort |
|-----------|--------|--------|
| `TerritoryMap.jsx` | Vérifier compatibilité | **FAIBLE** |
| `WaypointManager.jsx` | Adapter pour observations | **MOYEN** |
| `TerritoryService.js` | Adapter endpoints | **MOYEN** |
| Services métier | Potentielle unification | **FAIBLE** |

### 5.3 Impacts Base de Données

| Collection | Action | Risque |
|------------|--------|--------|
| `geo_entities` | Enrichissement | **FAIBLE** |
| `territory_events` | Migration puis suppression | **MOYEN** |
| `territory_tracks` | Migration puis suppression | **MOYEN** |
| Index | Création nouveaux index | **FAIBLE** |

---

## 6. COMPATIBILITÉ P3

### 6.1 WebSocket Sync

La normalisation P2 prépare directement le WebSocket:

```javascript
// Messages WebSocket unifiés pour tous types
{
  "type": "geo.created|geo.updated|geo.deleted",
  "entity_type": "waypoint|observation|track|hotspot|...",
  "entity": { ... }  // Schéma unifié
}
```

**Avantages:**
- Un seul handler pour tous les types
- Filtrage côté client par `entity_type`
- Cohérence des données synchronisées

### 6.2 Scoring Météo-Faune

Le schéma unifié permet:

```javascript
// Calcul de score utilisant métadonnées unifiées
score = calculateScore({
  habitat: entity.metadata.habitat,
  density: entity.metadata.density,
  species: entity.metadata.species,
  weather: currentWeather,  // Du weather_engine
  activity_score: entity.metadata.activity_score
});
```

**Avantages:**
- Accès uniforme aux métadonnées
- Jointure simplifiée avec données météo
- Calculs de probabilité cohérents

### 6.3 Dashboard Admin Global

La vue admin unifiée pourra:

```javascript
// Requête admin globale
db.geo_entities.aggregate([
  { $match: { entity_type: { $in: ["observation", "waypoint", "hotspot"] } } },
  { $group: { _id: "$entity_type", count: { $sum: 1 } } }
]);
```

**Avantages:**
- Vue consolidée de toutes les entités
- Filtres par type, espèce, utilisateur
- Analytics cross-types

---

## 7. SCRIPT DE MIGRATION RÉVERSIBLE

### 7.1 Architecture du Script

```
/app/backend/migrations/
├── p2_migration_main.py      # Script principal
├── p2_migrate_events.py      # Migration events
├── p2_migrate_tracks.py      # Migration tracks
├── p2_rollback.py            # Rollback complet
└── p2_backup.py              # Backup avant migration
```

### 7.2 Fonctionnalités

1. **Backup automatique** avant migration
2. **Migration incrémentale** (batch de 100 documents)
3. **Validation après chaque batch**
4. **Rollback automatique** en cas d'erreur
5. **Rapport détaillé** de migration
6. **Dry-run mode** pour test sans modification

### 7.3 Commandes

```bash
# Backup
python migrations/p2_backup.py

# Migration dry-run (test)
python migrations/p2_migration_main.py --dry-run

# Migration réelle
python migrations/p2_migration_main.py --execute

# Rollback
python migrations/p2_rollback.py --confirm
```

---

## 8. SÉQUENCEMENT D'EXÉCUTION

### Jour 1 - Préparation

| Heure | Tâche | Validation |
|-------|-------|------------|
| H+0 | Backup collections | ✓ Fichiers créés |
| H+1 | Création script migration events | ✓ Dry-run OK |
| H+2 | Création script migration tracks | ✓ Dry-run OK |
| H+3 | Création script rollback | ✓ Test rollback |

### Jour 2 - Migration

| Heure | Tâche | Validation |
|-------|-------|------------|
| H+0 | Mise à jour `models/geo_entity.py` | ✓ Nouveaux types |
| H+1 | Exécution migration events | ✓ Comptage OK |
| H+2 | Exécution migration tracks | ✓ Comptage OK |
| H+3 | Création index additionnels | ✓ Index créés |
| H+4 | Mise à jour endpoints territory.py | ✓ Tests API |

### Jour 3 - Validation

| Heure | Tâche | Validation |
|-------|-------|------------|
| H+0 | Tests backend complets | ✓ 100% pass |
| H+1 | Tests frontend | ✓ Affichage OK |
| H+2 | Suppression collections legacy | ✓ Cleanup |
| H+3 | Documentation finale | ✓ PRD mis à jour |

---

## 9. RISQUES ET MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Perte de données | Faible | Élevé | Backup + Rollback automatique |
| Régression API | Moyen | Moyen | Tests E2E, endpoints legacy temporaires |
| Performance dégradée | Faible | Faible | Index 2dsphere, batch migration |
| Incompatibilité frontend | Moyen | Moyen | Adaptation services progressive |

---

## 10. CRITÈRES DE SUCCÈS

### Migration réussie si:

- [ ] 100% des documents `territory_events` migrés vers `geo_entities`
- [ ] 100% des documents `territory_tracks` migrés vers `geo_entities`
- [ ] Requêtes spatiales fonctionnelles sur nouveaux types
- [ ] Endpoints territory.py utilisent `geo_entities`
- [ ] Tests backend 100% passés
- [ ] Tests frontend 100% passés
- [ ] Aucune régression sur fonctionnalités existantes
- [ ] Documentation à jour

### Rollback si:

- [ ] Erreur de migration > 5% des documents
- [ ] Temps de migration > 30 minutes
- [ ] Régression bloquante détectée
- [ ] Demande explicite utilisateur

---

## 11. LIVRABLES

| Livrable | Statut |
|----------|--------|
| Rapport d'analyse P2 | ✅ VALIDÉ |
| Plan d'implémentation P2 | 📋 CE DOCUMENT |
| Script migration events | ⏳ À CRÉER |
| Script migration tracks | ⏳ À CRÉER |
| Script rollback | ⏳ À CRÉER |
| Mise à jour models/geo_entity.py | ⏳ À FAIRE |
| Mise à jour territory.py | ⏳ À FAIRE |
| Tests E2E migration | ⏳ À FAIRE |
| Documentation finale | ⏳ À FAIRE |

---

## ⏳ EN ATTENTE DE VALIDATION

Ce plan d'implémentation est soumis pour validation par Steeve Ross.

**Questions de validation:**
1. Le séquencement proposé convient-il?
2. Faut-il inclure la migration `territories` (P2.3) dans cette phase?
3. Y a-t-il des contraintes de timing à respecter?
4. Souhaitez-vous une démonstration en dry-run avant la migration réelle?

---

*Document généré le 11 Février 2026*  
*HUNTIQ V3 / BIONIC™ - Phase P2 Plan d'Implémentation*
