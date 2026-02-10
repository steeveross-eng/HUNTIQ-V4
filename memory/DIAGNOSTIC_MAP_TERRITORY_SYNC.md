# 🔍 DIAGNOSTIC COMPLET: Synchronisation Map ↔ Territory

## Date: 10 Février 2026
## Version: 1.0.0 - Analyse P0

---

## 1. RÉSUMÉ EXÉCUTIF

### 🚨 PROBLÈME IDENTIFIÉ: **DUPLICATION DE SOURCES DE DONNÉES**

L'analyse révèle qu'il existe **DEUX systèmes distincts et non synchronisés** pour gérer les données géospatiales (waypoints):

| Module | Collection MongoDB | Prefix API | Statut |
|--------|-------------------|------------|--------|
| `user_waypoints.py` (Legacy) | `user_waypoints` | `/api/user-data/waypoints/` | ⚠️ ACTIF |
| `territory.py` (Modern) | `territory_waypoints` | `/api/territory/waypoints` | ⚠️ ACTIF |

**Impact**: Les waypoints créés dans un module ne sont PAS visibles dans l'autre.

---

## 2. CARTOGRAPHIE DU FLUX DE DONNÉES

### 2.1 Module Legacy: `user_waypoints.py`

```
Frontend (WaypointMap.jsx, mapService)
    ↓
API: /api/user-data/waypoints/{user_id}
    ↓
Collection: db['user_waypoints']
```

**Structure de données (user_waypoints):**
```json
{
  "_id": ObjectId,
  "user_id": "string",
  "name": "string",
  "lat": float,
  "lng": float,
  "type": "string",
  "active": boolean,
  "notes": "string",
  "icon": "string",
  "color": "string",
  "created_at": "ISO string",
  "updated_at": "ISO string"
}
```

**Routes exposées:**
- `GET /api/user-data/waypoints/{user_id}`
- `POST /api/user-data/waypoints/{user_id}`
- `PUT /api/user-data/waypoints/{user_id}/{waypoint_id}`
- `DELETE /api/user-data/waypoints/{user_id}/{waypoint_id}`
- `PATCH /api/user-data/waypoints/{user_id}/{waypoint_id}/toggle`
- Routes simplifiées: `/api/user-data/waypoints` (sans user_id)
- Routes legacy: `/api/user/waypoints`

---

### 2.2 Module Modern: `territory.py`

```
Frontend (TerritoryMap.jsx)
    ↓
API: /api/territory/waypoints?user_id={user_id}
    ↓
Collection: db['territory_waypoints']
```

**Structure de données (territory_waypoints):**
```json
{
  "_id": "UUID string",
  "user_id": "string",
  "latitude": float,
  "longitude": float,
  "name": "string",
  "description": "string",
  "waypoint_type": "observation|camera|cache|stand|water|trail_start|custom",
  "icon": "string",
  "created_at": datetime
}
```

**Routes exposées:**
- `GET /api/territory/waypoints?user_id={user_id}`
- `POST /api/territory/waypoints?user_id={user_id}`
- `DELETE /api/territory/waypoints/{waypoint_id}?user_id={user_id}`

---

### 2.3 Module Engine: `territory_engine/v1/`

```
API: /api/v1/territory/
    ↓
Collection: db['territories'] (zones de chasse, pas waypoints)
```

**Note**: Ce module gère les **territoires de chasse** (ZEC, pourvoiries, réserves), PAS les waypoints utilisateur. Pas de conflit ici.

---

## 3. ANALYSE DES DIVERGENCES

### 3.1 Différences de schéma

| Champ | user_waypoints | territory_waypoints |
|-------|----------------|---------------------|
| ID | `_id` (ObjectId) | `_id` (UUID string) |
| Coordonnées | `lat`, `lng` | `latitude`, `longitude` |
| Type | `type` (libre) | `waypoint_type` (enum) |
| État actif | `active` (boolean) | ❌ Non présent |
| Description | `notes` | `description` |
| Couleur | `color` | ❌ Non présent |
| Mise à jour | `updated_at` | ❌ Non présent |

### 3.2 Flux frontend actuels

| Page/Component | Module utilisé | Collection touchée |
|----------------|----------------|-------------------|
| `MapPage.jsx` → `WaypointMap` | user_waypoints | `user_waypoints` |
| `TerritoryMap.jsx` | territory.py | `territory_waypoints` |
| `BackgroundTracker.jsx` | Pas de persistance | Aucune |

### 3.3 Comportement actuel

1. **Création d'un waypoint dans MapPage (WaypointMap)**:
   - Enregistré dans `user_waypoints`
   - ❌ NON visible dans TerritoryMap

2. **Création d'un waypoint dans TerritoryMap**:
   - Enregistré dans `territory_waypoints`
   - ❌ NON visible dans MapPage/WaypointMap

---

## 4. DIAGNOSTIC: ABSENCE DE SOURCE UNIQUE

### 🔴 État actuel: DEUX sources de vérité parallèles

```
         ┌─────────────────┐
         │   Frontend      │
         └────────┬────────┘
                  │
     ┌────────────┴────────────┐
     │                         │
     ▼                         ▼
┌─────────────┐         ┌──────────────┐
│ MapPage.jsx │         │TerritoryMap  │
│ (WaypointMap)│         │   .jsx       │
└──────┬──────┘         └──────┬───────┘
       │                       │
       ▼                       ▼
┌──────────────┐        ┌───────────────┐
│user_waypoints│        │territory.py   │
│    .py       │        │               │
└──────┬───────┘        └───────┬───────┘
       │                        │
       ▼                        ▼
┌──────────────┐        ┌───────────────┐
│  Collection  │        │  Collection   │
│user_waypoints│        │territory_     │
│              │        │waypoints      │
└──────────────┘        └───────────────┘

          ❌ AUCUNE SYNCHRONISATION
```

---

## 5. INCOHÉRENCES DÉTECTÉES

### 5.1 Collections MongoDB distinctes
- `user_waypoints` (utilisé par user_waypoints.py)
- `territory_waypoints` (utilisé par territory.py)
- `user_places` (utilisé par user_waypoints.py - lieux sauvegardés)
- `territories` (utilisé par territory_engine - zones de chasse)

### 5.2 Schémas incompatibles
- Noms de champs différents (`lat/lng` vs `latitude/longitude`)
- Types d'ID différents (ObjectId vs UUID string)
- Fonctionnalités différentes (toggle active, couleur, etc.)

### 5.3 Routes API parallèles
- `/api/user-data/waypoints/` (legacy)
- `/api/territory/waypoints` (modern)
- `/api/v1/territory/` (engine - zones de chasse)

---

## 6. RECOMMANDATIONS DE CORRECTION

### Option A: Unification vers `territory_waypoints` (RECOMMANDÉ)

**Avantages:**
- Schéma plus riche (types enum, description)
- Intégré avec l'analyse de territoire
- Architecture moderne

**Actions requises:**
1. Migrer les données de `user_waypoints` vers `territory_waypoints`
2. Adapter `WaypointMap.jsx` pour utiliser l'API `/api/territory/waypoints`
3. Ajouter les champs manquants (`active`, `color`) à `territory.py`
4. Déprécier `user_waypoints.py`

### Option B: Créer une couche de synchronisation

**Avantages:**
- Pas de migration de données
- Rétrocompatibilité totale

**Actions requises:**
1. Créer un service `waypoint_sync.py`
2. Synchroniser bidirectionnellement les deux collections
3. Unifier les schémas via des adaptateurs

### Option C: Fusionner les modules (Long terme)

**Avantages:**
- Solution définitive
- Une seule base de code

**Actions requises:**
1. Analyser tous les cas d'usage
2. Créer un module `unified_waypoints_engine`
3. Migration progressive

---

## 7. PLAN D'ACTION RECOMMANDÉ (P0)

### Phase 1: Correction immédiate (URGENT)
1. ✅ Documenter le problème (ce document)
2. 🔄 Créer un service de synchronisation bidirectionnelle
3. 🔄 Unifier les appels frontend vers une seule API

### Phase 2: Refactoring (Court terme)
1. Enrichir le schéma `territory_waypoints` avec les champs manquants
2. Migrer `WaypointMap.jsx` vers l'API territory
3. Déprécier `user_waypoints.py`

### Phase 3: Nettoyage (Moyen terme)
1. Fusionner les collections MongoDB
2. Supprimer le code legacy
3. Documentation finale

---

## 8. CONCLUSION

### 🚨 Verdict: SYNCHRONISATION ABSENTE - CORRECTION REQUISE

L'application possède **deux systèmes de gestion de waypoints indépendants** qui ne communiquent pas entre eux. Cela crée une expérience utilisateur incohérente où les waypoints créés dans une vue ne sont pas visibles dans l'autre.

**Action immédiate recommandée**: Implémenter l'**Option A** (unification vers `territory_waypoints`) car:
- C'est le module le plus complet fonctionnellement
- Il est déjà intégré avec l'analyse de territoire BIONIC
- La migration est réalisable sans perte de données

---

## ANNEXE: Collections MongoDB existantes

```
├── user_waypoints          # Legacy waypoints (user_waypoints.py)
├── user_places             # Legacy places (user_waypoints.py)
├── territory_waypoints     # Modern waypoints (territory.py)
├── territory_events        # Observations/events (territory.py)
├── territory_cameras       # Trail cameras (territory.py)
├── territory_photos        # Camera photos (territory.py)
├── territory_tracks        # GPS tracks (territory.py)
├── territory_users         # Territory users (territory.py)
├── territories             # Hunting territories (territory_engine)
├── land_rentals            # Land rentals (territory_engine)
└── action_plans            # Generated action plans
```

---

*Document généré par l'analyse de synchronisation Map ↔ Territory*
*HUNTIQ/BIONIC Platform - Phase P6*
