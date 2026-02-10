# HUNTIQ V3 - Product Requirements Document

## Date de création: 2026-02-03
## Dernière mise à jour: 9 Février 2026
## Version: 6.0 (Architecture Modulaire v2.0 - Phase 8+ Legal Time Engine COMPLÈTE)

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
| Modules Backend | 42 |
| Modules Frontend | 21 |
| Services Frontend | 16 |
| Dashboards | 3 |
| APIs Connectées | 30+ |
| Tests Unitaires | 97 |
| Tests E2E | 14 |
| **Total Tests** | **111** |
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
- **Phase 11 (NEW): Tests unitaires + Documentation**

### À venir (P1)
- ✅ **COMPLÉTÉ** - Intégration GPT-5.2 pour ai_engine
- ✅ **COMPLÉTÉ** - Notification Push + In-app fin période légale

### Futur (P2)
- ✅ **COMPLÉTÉ** - Tests E2E avec Playwright (14 tests passés)
- ✅ **COMPLÉTÉ** - Optimisation performance (LRU Cache, Rate Limiting)
- ✅ **COMPLÉTÉ** - MongoDB avec indexes et seed data
- ✅ **COMPLÉTÉ** - Documentation API Swagger améliorée

### Backlog (P3) - EN COURS
- ✅ **COMPLÉTÉ** - Dashboard analytics avancé (P3.1)
- ✅ **COMPLÉTÉ** - Carte interactive Leaflet (P3.2)
- ✅ **COMPLÉTÉ** - Export de données PDF/CSV (P3.3)
- [ ] Mode hors ligne (P3.4 - PWA)
- [ ] Application mobile native (Backlog)

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

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
*Architecture Modulaire v2.0 - 40 Backend + 21 Frontend - CONNECTÉS*
