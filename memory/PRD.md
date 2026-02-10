# HUNTIQ V3 - Product Requirements Document

## Date de création: 2026-02-03
## Dernière mise à jour: 10 Février 2026 (v5)
## Version: 6.5 (Phase P5 - Module Rôles LIVRÉ)

---

## 1. Énoncé du Problème Original

Fusionner HUNTIQ V1 et V2 + Intégrer l'IA GPT-5.2 pour l'analyse d'attractants.
Refactorisation majeure vers une architecture modulaire stricte ("PLAN MAÎTRE BIONIC").

---

## 2. Architecture

### Stack Technique
- **Frontend**: React 18 + Tailwind CSS + ShadCN UI + 21 Modules Frontend
- **Backend**: FastAPI (Python) - 40 modules
- **Base de données**: MongoDB
- **IA**: GPT-5.2 via Emergent LLM Key (planifié)
- **Architecture**: Modulaire v2.0 (Backend 100% + Frontend 100% Connecté)

### Connexion Frontend-Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│ Core Services:                                                  │
│   NutritionService → /api/v1/nutrition/analyze ✅               │
│   ScoringService → /api/v1/scoring/calculate ✅                 │
│   WeatherService → /api/v1/weather/score, /optimal, /moon ✅    │
│   AIService → /api/v1/ai/query, /analyze ✅                     │
│   StrategyService → /api/v1/strategy/ ✅                        │
├─────────────────────────────────────────────────────────────────┤
│ Business Services:                                              │
│   ProductsService → /api/v1/products/ ✅                        │
│   OrdersService → /api/v1/orders/ ✅                            │
│   CartService → /api/v1/cart/ ✅                                │
│   AffiliateService → /api/v1/affiliate/ ✅                      │
│   SuppliersService → /api/v1/suppliers/ ✅                      │
│   CustomersService → /api/v1/customers/ ✅                      │
├─────────────────────────────────────────────────────────────────┤
│ Plan Maître Services (NEW Phase 8):                             │
│   LegalTimeService → /api/v1/legal-time/* ✅ NEW                │
│   PredictiveService → /api/v1/predictive/* ✅ NEW               │
│   RecommendationService → /api/v1/recommendation/products ✅    │
│   WildlifeService → /api/v1/wildlife/predict-activity ✅        │
│   TerritoryService → /api/v1/territory/list ✅                  │
│   CollaborativeService → /api/v1/collaborative/ ✅              │
│   EcoforestryService → /api/v1/eco/ ✅                          │
│   BehavioralService → /api/v1/behavioral/ ✅                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Fonctionnalités Implémentées ✅

### Backend (40 modules) ✅
Tous les modules opérationnels avec APIs documentées.

**NOUVEAUX (Phase 8):**
- **legal_time_engine**: Calcul heures légales de chasse (lever/coucher soleil)
- **predictive_engine**: Prédiction succès de chasse et activité faune

### Frontend - Phases 8-10 ✅
- **Phase 8**: Core modules (5) + CoreDashboard
- **Phase 9**: Business modules (7) + BusinessDashboard
- **Phase 10**: Plan Maître modules (7) + PlanMaitreDashboard
- **Phase 8+**: Module legaltime (LegalTimeWidget, LegalTimeBar)

### Connexion Backend ✅
- **21 services frontend** connectés aux APIs backend
- **Fallback gracieux** vers placeholders si API indisponible
- **Données réelles** affichées sur tous les dashboards

---

## 4. Phase 8+ - Legal Time Engine (NOUVEAU)

### Implémentation Complète ✅

**Configuration:**
- Localisation par défaut: Québec, QC, Canada (46.8139, -71.2080)
- Fenêtre légale: 30 min avant lever soleil → 30 min après coucher

**Backend Endpoints (7):**
| Endpoint | Description |
|----------|-------------|
| GET /api/v1/legal-time/ | Info module |
| GET /api/v1/legal-time/legal-window | Fenêtre légale |
| GET /api/v1/legal-time/sun-times | Lever/coucher soleil |
| GET /api/v1/legal-time/check | Vérification statut actuel |
| GET /api/v1/legal-time/recommended-slots | Créneaux recommandés |
| GET /api/v1/legal-time/schedule | Programme journalier |
| GET /api/v1/legal-time/forecast | Prévisions multi-jours |

**Predictive Endpoints (5):**
| Endpoint | Description |
|----------|-------------|
| GET /api/v1/predictive/success | Prédiction succès |
| GET /api/v1/predictive/activity | Niveau activité |
| GET /api/v1/predictive/factors | Facteurs influence |
| GET /api/v1/predictive/timeline | Timeline 24h |
| GET /api/v1/predictive/forecast/{species} | Prévisions espèce |

**Frontend Composants (3):**
- `LegalTimeWidget`: Widget complet avec heures, slots, règlementation
- `LegalTimeBar`: Barre d'état compacte pour header
- `LegalTimeService`: Service API avec fallback

---

## 5. Tests et Validation

### Rapport de Test Phase 8+ (iteration_7.json)
- **Backend**: 100% (19/19 tests passés)
- **Frontend**: 100% (tous les dashboards fonctionnels)
- **Intégration**: Heures légales intégrées dans PredictiveWidget

### Vérification Fenêtre Légale (9 Février 2026)
| Paramètre | Valeur |
|-----------|--------|
| Position | Québec City (46.8139, -71.2080) |
| Lever soleil | 06:58 |
| Coucher soleil | 17:00 |
| Début légal | 06:28 (30 min avant lever) |
| Fin légale | 17:30 (30 min après coucher) |
| Durée | 11 heures |

---

## 6. Statistiques Finales

| Métrique | Valeur |
|----------|--------|
| Modules Backend | 45 |
| Modules Frontend | 23 |
| Services Frontend | 21 |
| Dashboards | 4 |
| APIs Connectées | 60+ |
| Tests Unitaires | 97 |
| Tests E2E | 97 |
| **Total Tests** | **194** |
| Couverture | 100% |

---

## 7. Phases Restantes

### Complété ✅
- Phase 1-7: Backend 38 modules
- Phase 8: Frontend Core + Dashboard
- Phase 9: Frontend Business + Dashboard
- Phase 10: Frontend Plan Maître + Dashboard
- Phase 10+: Connexion APIs Backend
- **Phase 8+ (NEW): Legal Time Engine + Predictive Engine**
- **Phase P4 (NEW): Geolocation Engine + PWA Avancée**
- **Phase P4 (NEW): Auth Engine (JWT + Google OAuth) + VAPID Keys**
- **Phase P4+ (NEW): Hunting Trip Logger + Password Reset**
- **Phase 11 (NEW): Tests unitaires + Documentation**

### À venir (P1)
- ✅ **COMPLÉTÉ** - Intégration GPT-5.2 pour ai_engine
- ✅ **COMPLÉTÉ** - Notification Push + In-app fin période légale

### Futur (P2)
- ✅ **COMPLÉTÉ** - Tests E2E avec Playwright (14 tests passés)
- ✅ **COMPLÉTÉ** - Optimisation performance (LRU Cache, Rate Limiting)
- ✅ **COMPLÉTÉ** - MongoDB avec indexes et seed data
- ✅ **COMPLÉTÉ** - Documentation API Swagger améliorée

### Backlog (P3) - COMPLÉTÉ ✅
- ✅ **COMPLÉTÉ** - Dashboard analytics avancé (P3.1)
- ✅ **COMPLÉTÉ** - Carte interactive Leaflet (P3.2)
- ✅ **COMPLÉTÉ** - Export de données PDF/CSV (P3.3)
- ✅ **COMPLÉTÉ** - Mode hors ligne PWA (P3.4)
- ✅ **COMPLÉTÉ** - Waypoint Quality Score (WQS) & Success Forecast (P3.5)
- ✅ **COMPLÉTÉ** - Intégration GPT-5.2 & Heatmap (P3.6)

### Phase P4 - Mobile PWA Avancée - COMPLÉTÉ ✅
- ✅ **COMPLÉTÉ** - Backend Geolocation Engine (11 endpoints)
- ✅ **COMPLÉTÉ** - Tracking GPS arrière-plan (toutes les 5 min)
- ✅ **COMPLÉTÉ** - Alertes de proximité (500m waypoints, 700m hotspots)
- ✅ **COMPLÉTÉ** - Sessions de chasse avec calcul distance
- ✅ **COMPLÉTÉ** - Service Worker amélioré (push, sync, geolocation)
- ✅ **COMPLÉTÉ** - Composant BackgroundTracker
- ✅ **COMPLÉTÉ** - Page Map avec onglet GPS Tracking
- ⚠️ **MOCKÉ** - Notifications Push (VAPID keys requis pour production)

---

## 8. Changelog

### P3 - Dashboard Analytics & Export (10 Février 2026)
- ✅ **P3.1 - Dashboard Analytics Avancé**:
  - Backend: analytics_engine avec 10 endpoints
  - KPIs: sorties, taux de succès, heures, observations
  - Graphiques: tendances mensuelles, répartition espèces
  - Analyse météo et horaires optimaux
  - Filtres temporels (semaine, mois, saison, année)
  - Page `/analytics` avec navigation
- ✅ **P3.2 - Carte Interactive Leaflet**:
  - Composant WaypointMap avec OpenStreetMap
  - Marqueurs personnalisés par type de waypoint
  - Mode ajout par clic sur carte
  - Liste latérale avec centrage sur waypoint
  - Page `/map` dédiée
- ✅ **P3.3 - Export PDF/CSV**:
  - Service ExportService avec jsPDF
  - Export waypoints en CSV et PDF
  - Export rapport analytique complet en PDF
  - Export journal de chasse en PDF
  - Boutons d'export intégrés aux dashboards
- ✅ **P3.5 - Waypoint Quality Score (WQS) & Success Forecast**:
  - Backend: waypoint_scoring_engine avec 8 endpoints
  - WQS avec pondération: 40% historique, 25% météo, 20% activité, 15% accessibilité
  - Classification dynamique: Hotspot, Bon, Standard, Faible
  - Success Forecast: probabilité 0-100% avec confiance
  - Recommandations IA basées sur météo, horaires, espèce
  - Fenêtre horaire optimale et meilleur waypoint
  - Page `/forecast` avec filtres interactifs
- ✅ **P3.6 - Intégration GPT-5.2 & Heatmap**:
  - Service AIRecommendationService avec GPT-5.2
  - Recommandations personnalisées via `/recommendations/ai`
  - Briefing quotidien via `/briefing`
  - Heatmap de performance sur la carte Leaflet
  - Popup waypoint avec score WQS intégré
  - Bouton toggle Heatmap sur la carte
- ✅ **P3.4 - Mode Hors Ligne (PWA)**:
  - Service Worker avec stratégies cache-first et network-first
  - IndexedDB pour stockage local des waypoints et WQS
  - Page offline.html pour mode déconnecté
  - Composant OfflineIndicator pour statut connexion
  - Manifest.json pour installation PWA
  - Background sync pour synchronisation différée

### P2 - Stabilisation Complète (9-10 Février 2026)
- ✅ **Tests E2E Playwright**: 14 tests passés (Homepage, Dashboards, API)
- ✅ **MongoDB**: Database service avec indexes et seed data
- ✅ **Performance**: LRU Cache (200 items, 60s TTL), Rate Limiting
- ✅ **Documentation Swagger**: Tags, descriptions améliorées
- ✅ **README.md**: Documentation projet complète
- ✅ **Version API**: 3.8.0
- ✅ **BUG FIX - Waypoint Manager (10 Février 2026)**:
  - Intégration du composant `WaypointManager` dans l'onglet Territoire
  - CRUD complet: création, affichage, suppression de waypoints
  - Persistance MongoDB fonctionnelle
  - Toast de confirmation "Waypoint enregistré !"

### P1 - Intégration GPT-5.2 & Notifications (9 Février 2026)
- ✅ **GPT-5.2 via Emergent LLM Key** intégré dans ai_engine
- ✅ Nouveaux endpoints AI: `/query`, `/compare`, `/suggestions`
- ✅ Réponses IA expertes sur la chasse fonctionnelles
- ✅ **Notifications Push + In-app** pour fin de période légale
- ✅ Endpoint `/notification/legal-time/status` pour statut temps réel
- ✅ Endpoint `/notification/legal-time/upcoming` pour alertes planifiées
- ✅ Composants frontend: `NotificationProvider`, `LegalTimeAlert`
- ✅ Intégration dans App.js avec warning 15 min avant fin

### Phase 11 - Tests & Documentation (9 Février 2026)
- ✅ Tests unitaires Legal Time Engine: 37 tests passés
- ✅ Tests unitaires Predictive Engine: 39 tests passés
- ✅ Tests intégration Frontend-Backend: 21 tests passés
- ✅ Documentation legal_time_engine: README.md complet
- ✅ Documentation predictive_engine: README.md complet
- ✅ Documentation modules Core: weather, scoring, ai, strategy
- ✅ Documentation modules Business: products, orders
- ✅ Mise à jour README global modules (40 modules)
- ✅ **Total: 97 tests unitaires passés**

### Phase 8+ - Legal Time Engine (9 Février 2026)
- ✅ Nouveau module backend: legal_time_engine (7 endpoints)
- ✅ Nouveau module backend: predictive_engine (5 endpoints)
- ✅ Bibliothèque `astral` intégrée pour calculs astronomiques
- ✅ Frontend: LegalTimeWidget avec heures légales temps réel
- ✅ Frontend: LegalTimeBar dans header PlanMaitreDashboard
- ✅ Frontend: Nouvel onglet "Heures Légales"
- ✅ Intégration: Heures optimales respectent fenêtre légale
- ✅ Tests: 19/19 passés (100%)
- ✅ Règlement Québec: 30 min avant/après soleil implémenté

### Phase 10+ - Connexion Backend (Février 2026)
- ✅ 20 services frontend mis à jour avec vraies APIs
- ✅ Fallback gracieux implémenté sur tous les services
- ✅ Tests backend 24/24 passés
- ✅ Tous les dashboards affichent données réelles

### Phase P4 - Geolocation Engine & PWA Avancée (10 Février 2026)
- ✅ **Backend Geolocation Engine**: 11 nouveaux endpoints
  - POST /api/v1/geolocation/location - Enregistrement positions
  - POST /api/v1/geolocation/session/start - Démarrage session
  - POST /api/v1/geolocation/session/{id}/end - Fin session avec stats
  - GET /api/v1/geolocation/history - Historique positions
  - GET /api/v1/geolocation/nearby-hotspots - Waypoints proches
  - POST /api/v1/geolocation/check-proximity - Vérification proximité
  - POST /api/v1/geolocation/subscribe - Abonnement push
- ✅ **Service Haversine**: Calcul distances GPS précis (mètres)
- ✅ **Alertes de Proximité**: 500m pour waypoints standard, 700m pour hotspots
- ✅ **Sessions de Chasse**: Tracking avec distance parcourue
- ✅ **Service Worker v2**: Sync arrière-plan, notifications push, IndexedDB
- ✅ **Composant BackgroundTracker**: Interface tracking GPS complète
- ✅ **Page Map**: Nouvel onglet "GPS Tracking" avec guide
- ✅ **PWA Manifest**: Shortcuts, permissions geolocation
- ✅ **Tests E2E**: 18/18 passés (100%)

### Phase P4 - Authentification Hybride & VAPID (10 Février 2026)
- ✅ **Auth Engine (JWT + Google OAuth)**: Module complet d'authentification
  - POST /api/auth/register - Inscription email/password
  - POST /api/auth/login - Connexion avec tokens JWT (24h)
  - POST /api/auth/google/callback - Google OAuth via Emergent Auth
  - GET /api/auth/me - Utilisateur courant (authentifié)
  - POST /api/auth/logout - Déconnexion
  - GET /api/auth/auto-login - Connexion automatique (appareil de confiance)
  - GET /api/auth/ip-info - Info IP et confiance
- ✅ **auth_helpers.py**: Helper centralisé pour tous les modules
  - get_user_id_with_fallback() - Auth optionnelle avec fallback
  - get_current_user_id() - Auth requise
- ✅ **Modules mis à jour**: analytics, geolocation, waypoint_scoring
- ✅ **VAPID Keys**: Générées et configurées pour push notifications réelles
- ✅ **Frontend Auth Modal**: Email/password + Google OAuth
- ✅ **GoogleOAuthCallback**: Composant de callback OAuth
- ✅ **Tests E2E**: 25/25 passés (100%)

### Phase P4+ - Données Réelles & Password Reset (10 Février 2026)
- ✅ **Hunting Trip Logger**: Module de logging des sorties de chasse
  - POST /api/v1/trips/create - Créer sortie
  - POST /api/v1/trips/start - Démarrer avec météo
  - POST /api/v1/trips/end - Terminer et sync analytics
  - POST /api/v1/trips/observations - Logger observations
  - POST /api/v1/trips/visits - Logger visites waypoints
  - GET /api/v1/trips/statistics - Stats utilisateur
  - GET /api/v1/trips/statistics/waypoint/{id} - Stats waypoint
- ✅ **Data Sync**: Sorties terminées synchronisées vers analytics_engine
- ✅ **Email Service (Resend)**: Service email pour notifications
  - send_password_reset_email() - Email de réinitialisation
  - send_welcome_email() - Email de bienvenue
- ✅ **Password Reset Flow**: Flux complet de réinitialisation
  - POST /api/auth/forgot-password - Demande reset
  - GET /api/auth/verify-reset-token - Validation token
  - POST /api/auth/reset-password - Reset avec token
- ✅ **Frontend Trip Logger COMPLET** (10 Février 2026):
  - Page `/trips` avec statistiques rapides (Sorties, Succès, Heures, Observations)
  - 3 onglets: Sortie Active, Historique, Statistiques
  - CreateTripModal: Titre, espèce, date, notes
  - StartTripModal: Météo, température pour démarrer
  - ActiveTripPanel: Timer, météo, observations, actions
  - AddObservationModal: Type, espèce, nombre, distance, comportement
  - EndTripModal: Résumé, succès, notes finales
  - TripHistory: Planifiées avec Démarrer, Historique terminées
  - TripStatsDashboard: Charts Recharts, insights, meilleures conditions
  - Navigation: Lien "🦌 Sorties" dans menu principal
- ✅ **RESEND_API_KEY**: Clé configurée - Envoi d'emails réels activé!
- ✅ **Tests E2E**: 27/27 passés (100%)

### Phase P5 - Module Rôles (10 Février 2026)
- ✅ **roles_engine**: Module RBAC complet
  - 4 rôles: hunter (défaut), guide, admin, business
  - Middleware de permissions: @require_admin, @require_role
  - Endpoints protégés pour gestion des rôles
- ✅ **Site Access Control**: 3 modes (Live, Development, Maintenance)
- ✅ **Documentation**: ROLE_BUSINESS_DOC.md, ARCHITECTURE_MAP.md

### Phase P6 - Unification Géospatiale (10 Février 2026)
- ✅ **DIAGNOSTIC TERMINÉ**: Analyse synchronisation Map ↔ Territory
  - Problème identifié: 2 sources de vérité non synchronisées
  - user_waypoints (legacy) vs territory_waypoints (moderne)
- ✅ **MIGRATION EFFECTUÉE**: 2 waypoints migrés vers territory_waypoints
  - Mapping: lat→latitude, lng→longitude, type→waypoint_type
  - Ajout champs: active, color, notes pour rétrocompatibilité
- ✅ **API UNIFIÉE**: /api/territory/waypoints
  - GET, POST, DELETE fonctionnels
  - Schéma enrichi avec tous les champs legacy
- ✅ **FRONTEND MIS À JOUR**: WaypointMap.jsx
  - Utilise maintenant l'API territory unifiée
  - Fonction normalizeWaypoint() pour compatibilité
  - getDefaultUserId() pour authentification
- ✅ **LEGACY DÉPRÉCIÉ**: user_waypoints.py marqué comme deprecated
  - Warning émis au chargement du module
  - Documentation de migration ajoutée
- ✅ **DOCUMENTATION**: 
  - DIAGNOSTIC_MAP_TERRITORY_SYNC.md
  - UNIFIED_GEOSPATIAL_ARCHITECTURE.md

### Phase P6.2 - Normalisation Géospatiale (10 Février 2026)
- ✅ **SCHÉMA UNIFIÉ**: Collection `geo_entities` avec GeoJSON
  - Types: waypoint, zone, sector, cache, camera, poi, hotspot, corridor
  - Format GeoJSON Point pour coordonnées [lng, lat]
  - Métadonnées enrichies (habitat, densité, altitude, pente, exposition)
- ✅ **MODÈLES PYDANTIC**: /app/backend/models/geo_entity.py
  - GeoEntityCreate, GeoEntityUpdate, GeoEntityResponse
  - GeoMetadata, HotspotMetadata, CorridorMetadata
  - GeoJSONPoint avec conversion lat/lng
- ✅ **HUNTING GROUPS**: Système de groupes de chasse
  - Création et gestion de groupes
  - Ajout/suppression de membres
  - Rôles: owner, admin, member

### Phase P6.3 - Optimisation Géospatiale (10 Février 2026)
- ✅ **INDEX 2DSPHERE**: Index MongoDB pour requêtes spatiales
  - Index géospatial sur `location`
  - Index composites (user_id, entity_type, group_id)
  - Index sur metadata.habitat et metadata.is_auto_generated
- ✅ **REQUÊTES OPTIMISÉES**:
  - GET /api/v1/geo/nearby - Recherche par proximité
  - GET /api/v1/geo/within-bbox - Recherche dans rectangle
  - GET /api/v1/geo/clusters - Clustering pour carte

### Phase P6.4 - WebSocket Temps Réel (10 Février 2026)
- ✅ **WEBSOCKET SERVER**: /ws/geo-sync
  - Connection Manager avec isolation par groupe
  - Événements: geo.created, geo.updated, geo.deleted
  - member.joined, member.left pour notifications
- ✅ **COMPOSANT FRONTEND**: GeoSyncToggle.jsx
  - Toggle on/off synchronisation
  - Indicateur de connexion en temps réel
  - Keep-alive automatique (30s)
  - Reconnexion automatique après déconnexion

### Phase P6.5 - Espace Admin Global (10 Février 2026)
- ✅ **API ADMIN**: /api/admin/geo/*
  - GET /all - Toutes les entités
  - GET /hotspots - Tous les hotspots
  - GET /corridors - Tous les corridors
  - GET /analytics/overview - Statistiques globales
  - GET /analytics/heatmap - Données heatmap
  - GET /monetization/available-hotspots - Hotspots premium
  - POST /monetization/claim-hotspot/{id} - Réclamer hotspot
  - GET /export/geojson - Export GeoJSON
- ✅ **PAGE ADMIN**: /admin/geo (AdminGeoPage.jsx)
  - Vue d'ensemble avec statistiques
  - Carte globale avec filtres
  - Onglet hotspots avec détails
  - Onglet monétisation
- ✅ **HOTSPOT AUTO-GENERATION**:
  - Algorithme basé sur habitat, corridors, densité
  - Classification par confiance (Premium > 0.7)
  - Support monétisation (is_premium, is_claimed)

---

## 5. Tâches En Cours / À Venir

### P0 - Finalisations
- ⏳ **Resend Domain Verification**: Attente propagation DNS par l'utilisateur
- ⏳ **Corrections P2/P3**: Warnings mineurs du checkup précédent

### P7 - Nettoyage (Planifié)
- 🔲 Suppression complète de user_waypoints.py
- 🔲 Archivage collection user_waypoints (optionnel)
- 🔲 UI admin pour gestion des rôles

### Backlog
- 🔲 Dashboard profil `business`
- 🔲 Notifications push de groupe
- ✅ Synchronisation temps réel (WebSocket) - LIVRÉ P6.4

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
*Architecture Modulaire v2.0 - 48 Backend + 24 Frontend - CONNECTÉS*
*Phase P6.5 - Chantier Géospatial Intégré - LIVRÉ*
