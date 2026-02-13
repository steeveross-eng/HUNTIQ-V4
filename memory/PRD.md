# HUNTIQ V3 - BIONIC Hunting Platform

## Project Overview
HUNTIQ V3 is a professional hunting intelligence platform following the "BIONIC TACTICAL" design standard. The application provides scientific analysis of attractants, territory mapping, weather integration, and collaborative features for hunters.

## Core Requirements
- **Design System:** Strict BIONIC TACTICAL design - professional, scientific aesthetic
- **No Emojis:** All UI elements must use lucide-react icons or professional images
- **Species Display:** Use real wildlife photos via SpeciesIcon component
- **Workflow:** "Supra-sécuritaire" - explicit validation required for all tasks

## What's Been Implemented

### Date: 2026-02-12 - Phase 9 (Roles & Permissions Corrections) + Phase 1 Cameras

#### Phase 9 Status: PREPARED AND ACTIVATED ✅

**Correctifs appliqués:**
1. **Emojis supprimés** dans `/app/backend/modules/roles_engine/v1/models.py`
   - `🎯 Chasseur` → `Chasseur`
   - `🧭 Guide` → `Guide`  
   - `🏪 Business` → `Business`
   - `⚙️ Administrateur` → `Administrateur`

2. **JWT_SECRET_KEY sécurisé** dans `/app/backend/modules/roles_engine/v1/dependencies.py`
   - Supprimé la valeur par défaut hardcodée
   - Fail-fast si variable d'environnement non configurée

3. **DB_NAME corrigé** dans `/app/backend/modules/roles_engine/v1/dependencies.py`
   - Supprimé le fallback `hunttrack`
   - Fail-fast si variable d'environnement non configurée

#### Phase 1 Caméras Status: ✅ VALIDÉ ET CLOS (2026-02-12)

#### Phase 2 Caméras Status: IMPLÉMENTÉ - En attente validation

**Services implémentés:**
1. **AdvancedExifService** - Extraction EXIF complète
   - Timestamps (original, digitized, modified)
   - GPS complet (lat, lon, altitude, direction)
   - Orientation et rotation nécessaire
   - Device info (make, model, software)
   - Paramètres de capture (ISO, aperture, shutter, focal)

2. **ImageValidationService** - Détection images invalides
   - Classification: VALID / INVALID
   - Critères: empty, too_small, too_large, corrupted, unreadable, non_photographic, no_exif

3. **MetadataNormalizationService** - Normalisation métadonnées
   - Timestamps ISO 8601
   - GPS en decimal degrees (6 décimales)
   - Device info nettoyé
   - Score de qualité (0-100)

**Tests automatisés:** 24/24 passent
**Documentation:** `/app/backend/docs/camera_phase2_technical.md`

**Fichiers créés:**
- `/app/backend/modules/camera_engine/v1/phase2_services.py`
- `/app/backend/tests/test_camera_engine_phase2.py`
- `/app/backend/docs/camera_phase2_technical.md`

**Module créé:** `/app/backend/modules/camera_engine/`

**Fonctionnalités implémentées:**
- Création et gestion des caméras (CRUD)
- Génération automatique d'email_alias unique par caméra
- Ingestion de photos par email via POST `/api/v1/camera/email-ingest`
- Extraction EXIF minimale (timestamp, GPS si disponible)
- Stockage chiffré des images (Fernet encryption)
- Création automatique d'événements `camera_events`
- Logs d'ingestion complets (succès, échecs, quarantaine)

**Validations obligatoires (RÈGLES FONDAMENTALES):**
- ✅ Interdiction ABSOLUE de créer une caméra sans waypoint
- ✅ Interdiction ABSOLUE d'ingérer une photo si la caméra n'a pas de waypoint
- ✅ Isolation stricte par utilisateur

**Endpoints API:**
- `POST /api/v1/camera/cameras` - Créer une caméra (waypoint_id OBLIGATOIRE)
- `GET /api/v1/camera/cameras` - Lister les caméras de l'utilisateur
- `GET /api/v1/camera/cameras/{id}` - Détails d'une caméra
- `PATCH /api/v1/camera/cameras/{id}` - Modifier une caméra
- `DELETE /api/v1/camera/cameras/{id}` - Supprimer une caméra
- `POST /api/v1/camera/email-ingest` - Ingestion de photo par email
- `GET /api/v1/camera/events` - Lister les événements
- `GET /api/v1/camera/events/{id}` - Détails d'un événement
- `GET /api/v1/camera/ingestion-logs` - Logs d'ingestion

**Tests validés:**
| Test | Description | Résultat |
|------|-------------|----------|
| 1 | Caméra sans waypoint → REJET | ✅ |
| 2 | Caméra waypoint inexistant → REJET | ✅ |
| 3 | Caméra waypoint valide → SUCCÈS | ✅ |
| 4 | Ingestion sans caméra → REJET | ✅ |
| 5 | Ingestion caméra valide → événement créé | ✅ |

**Fichiers créés:**
- `/app/backend/modules/camera_engine/__init__.py`
- `/app/backend/modules/camera_engine/dependencies.py`
- `/app/backend/modules/camera_engine/v1/__init__.py`
- `/app/backend/modules/camera_engine/v1/models.py`
- `/app/backend/modules/camera_engine/v1/services.py`
- `/app/backend/modules/camera_engine/v1/router.py`
- `/app/backend/tests/test_camera_engine_phase1.py`

### Previous Phases Completed
- Phase 6 (Session Heatmap): VALIDATED
- Phase 7 (QA & Stabilization): VALIDATED  
- Phase 8 (Permissions Audit): VALIDATED
- BIONIC Design System Audit: VALIDATED

## Architecture

```
/app/
├── backend/
│   ├── server.py
│   └── modules/
│       ├── camera_engine/     # Phase 1 Cameras - NEW
│       │   ├── v1/
│       │   │   ├── models.py
│       │   │   ├── services.py
│       │   │   └── router.py
│       │   └── dependencies.py
│       ├── roles_engine/      # Phase 9 - CORRECTED
│       │   └── v1/
│       │       ├── models.py (emojis removed)
│       │       └── dependencies.py (fail-fast)
│       └── groupe/
├── frontend/
│   └── src/
│       ├── modules/
│       │   └── groupe/
│       └── pages/
│           └── MonTerritoireBionicPage.jsx
└── memory/
    └── PRD.md
```

## Data Models

### Camera
```
{
  id: string,
  user_id: string,
  email_alias: string (unique),
  waypoint_id: string (REQUIRED),
  manufacturer: enum,
  model: string,
  serial: string,
  name: string,
  gps_lat: float,
  gps_lon: float,
  status: enum (active/inactive/maintenance/offline),
  photo_count: int,
  last_photo_at: datetime,
  created_at: datetime,
  updated_at: datetime
}
```

### CameraEvent
```
{
  id: string,
  user_id: string,
  camera_id: string,
  waypoint_id: string,
  timestamp: datetime,
  species: string,
  direction: enum,
  activity: enum,
  individual_id: string,
  raw_image_url: string (encrypted path),
  thumbnail_url: string,
  exif_data: object,
  is_quarantined: bool,
  created_at: datetime
}
```

## Pending Tasks

### P0 - Completed
- [x] Phase 9 (Roles Corrections) - ACTIVÉ
- [x] Phase 1 Caméras - ✅ VALIDÉ ET CLOS
- [x] Phase 2 Caméras - ✅ VALIDÉ ET CLOS
- [x] Phase 6 Backend - ✅ DÉCOUPLAGE ORCHESTRATEUR PUR

### Phase 6 Backend - Découplage (COMPLÉTÉ)
**Objectifs atteints:**
1. ✅ `server.py` est maintenant un orchestrateur pur
2. ✅ Fonction `register_all_routers()` centralisée
3. ✅ Fonction `_register_special_routers()` pour routers racine
4. ✅ 47 modules chargés et opérationnels
5. ✅ Legacy monolith isolé et marqué DEPRECATED
6. ✅ Tests de non-régression validés

**Endpoints orchestrateur:**
- `/api/health` - Health check simple
- `/api/status` - Status détaillé
- `/api/modules/status` - Liste tous les modules
- `/api/modules/health` - Santé des modules par phase

**Architecture Phase 6:**
```
server.py (orchestrateur pur)
├── register_all_routers()
│   ├── orchestrator_router
│   ├── CORE_ROUTERS (47 modules)
│   ├── legacy_router (DEPRECATED)
│   └── _register_special_routers()
│       ├── site_access
│       ├── territory
│       ├── admin_geo
│       ├── websocket_geo
│       ├── bathymetry
│       └── advanced_zones
└── custom_openapi()
```

### Phase 7-8 Frontend Modulaire - COMPLÉTÉ

**Phase 7 (Core) - VALIDÉ:**
1. ✅ Configuration centrale des routes (`/src/config/routes.js`)
2. ✅ Navigation modulaire (`ModularNavigation.jsx`)
3. ✅ Registre des modules (`/src/config/modules.js`)
4. ✅ Fix hook React (SessionHeatmap.jsx)

**Phase 8 (Métier) - VALIDÉ:**
1. ✅ BionicHeader modulaire extrait (`/src/components/layout/BionicHeader.jsx`)
2. ✅ Système de popups centralisé (`/src/contexts/PopupContext.jsx`)
3. ✅ Composants MapPopup standardisés (`/src/components/map/MapPopup.jsx`)
4. ✅ Styles popups BIONIC (`/src/components/map/MapPopup.css`)
5. ✅ Build validé
6. ✅ Tests de non-régression passés

**Livrables Phase 7-8:**
- `/app/frontend/src/config/routes.js` - 16 routes, 6 catégories
- `/app/frontend/src/config/modules.js` - 23 modules enregistrés
- `/app/frontend/src/components/navigation/ModularNavigation.jsx`
- `/app/frontend/src/components/layout/BionicHeader.jsx`
- `/app/frontend/src/contexts/PopupContext.jsx`
- `/app/frontend/src/components/map/MapPopup.jsx`
- `/app/frontend/src/components/map/MapPopup.css`

**Architecture Frontend Phase 8:**
```
/app/frontend/src/
├── config/
│   ├── routes.js      # Configuration routes centralisée
│   └── modules.js     # Registre modules
├── components/
│   ├── navigation/
│   │   └── ModularNavigation.jsx
│   ├── layout/
│   │   └── BionicHeader.jsx
│   └── map/
│       ├── MapPopup.jsx
│       └── MapPopup.css
├── contexts/
│   └── PopupContext.jsx
└── modules/           # 40 modules métier
```

### P0 - Next (En attente directive utilisateur)
- [ ] Phase 10 Onboarding - EN COURS

### Phase 10 Onboarding Engine - EN COURS

**Objectifs atteints:**
1. ✅ UI Onboarding modulaire créée
2. ✅ Flux de profilage utilisateur (4 étapes)
3. ✅ Stockage préférences localStorage
4. ✅ Intégration route `/onboarding`
5. ✅ Build validé
6. ✅ Tests visuels validés

**Composants créés:**
- `OnboardingFlow.jsx` - Orchestrateur principal
- `OnboardingStep.jsx` - Composant étape de base
- `ProfileSelector.jsx` - Sélecteur générique
- `TerritorySelector.jsx` - Sélection territoire
- `ExperienceSelector.jsx` - Sélection expérience
- `ObjectivesSelector.jsx` - Sélection objectifs (multi)

**Hooks créés:**
- `useOnboarding.js` - Gestion navigation flux
- `useUserProfile.js` - Gestion préférences utilisateur

**Flux Onboarding:**
1. Welcome → Introduction BIONIC
2. Territory → Type de territoire (5 options)
3. Experience → Niveau d'expérience (4 options)
4. Objectives → Objectifs de chasse (5 options, multi-select)
5. Complete → Résumé et redirection

**Fichiers créés:**
- `/app/frontend/src/modules/onboarding/` (module complet)
- `/app/frontend/src/pages/OnboardingPage.jsx`

**Architecture Phase 10:**
```
/app/frontend/src/modules/onboarding/
├── index.js
├── constants.js
├── components/
│   ├── OnboardingFlow.jsx
│   ├── OnboardingStep.jsx
│   ├── ProfileSelector.jsx
│   ├── TerritorySelector.jsx
│   ├── ExperienceSelector.jsx
│   └── ObjectivesSelector.jsx
└── hooks/
    ├── useOnboarding.js
    └── useUserProfile.js
```

### P1 - Future
- [ ] Phase 11: Stabilisation module Analytics
- [ ] Phase 12: Nettoyage UX final
- [ ] Phase 13: QA finale + préparation déploiement

### P2 - Backlog
- [ ] Module Immobilier (Phases 11-15)
- [ ] Mode Offline & Navigation Live
- [ ] Bathymétrie
- [ ] WebSocket Sync & Advanced Scoring

## Credentials
- **Admin:** steeve.ross@gmail.com / Saturn5858*

## 3rd Party Integrations
- OpenAI GPT-5.2 (Emergent LLM Key)
- Google OAuth
- Resend (User API Key)
- MongoDB
- OpenWeatherMap (User API Key)
- Cryptography (Fernet) - Image encryption
- Pillow - EXIF extraction
