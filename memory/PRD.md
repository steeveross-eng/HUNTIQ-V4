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

### P0 - Validation Required
- [x] Phase 9 (Roles Corrections) - ACTIVÉ
- [x] Phase 1 Caméras - ✅ VALIDÉ ET CLOS

### P0 - Next (En attente directive utilisateur)
- [ ] Phase 2 Caméras: Traitement avancé des images (INTERDIT - non ouvert)
- [ ] Phase 10: Activation contrôlée des correctifs + QA

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
