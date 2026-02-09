# HUNTIQ V3 - Product Requirements Document

## Date de création: 2026-02-03
## Dernière mise à jour: Décembre 2025
## Version: 3.7 (Architecture Modulaire v2.0 - Phase 7 COMPLÈTE)

---

## 1. Énoncé du Problème Original

Fusionner HUNTIQ V1 et V2 + Intégrer l'IA GPT-5.2 pour l'analyse d'attractants.
Refactorisation majeure vers une architecture modulaire stricte ("PLAN MAÎTRE BIONIC").

---

## 2. Architecture

### Stack Technique
- **Frontend**: React 18 + Tailwind CSS + ShadCN UI
- **Backend**: FastAPI (Python)
- **Base de données**: MongoDB
- **IA**: GPT-5.2 via Emergent LLM Key
- **Architecture**: Modulaire v2.0 (38 modules - ORCHESTRATEUR PUR)

### server.py → ORCHESTRATEUR PUR ✅
Le fichier `server.py` a été transformé en orchestrateur pur:
- ~150 lignes (vs 4688 lignes avant)
- Import uniquement des modules
- Pas de logique métier
- Backup monolithe: `server_monolith_backup.py`

### Structure Modulaire - 38 Modules Opérationnels

```
/app/backend/modules/
├── [PHASE 2 - CORE] 7 modules ✅
├── [PHASE 3 - MÉTIER] 8 modules ✅
├── [PHASE 4 - PLAN MAÎTRE] 10 modules ✅
├── [PHASE 5 - DATA LAYERS] 5 modules ✅
├── [PHASE 6 - LIVE HEADING] 1 module ✅
├── [PHASE 7 - DÉCOUPÉS DE SERVER.PY] 7 modules ✅
│   ├── products_engine/v1/        ✅ Gestion produits
│   ├── orders_engine/v1/          ✅ Commandes + commissions
│   ├── suppliers_engine/v1/       ✅ Fournisseurs
│   ├── customers_engine/v1/       ✅ Clients
│   ├── cart_engine/v1/            ✅ Panier
│   ├── affiliate_engine/v1/       ✅ Clics affiliés
│   └── alerts_engine/v1/          ✅ Alertes + site settings
│
├── routers.py                     ✅ Registre central v2.0
└── server.py                      ✅ ORCHESTRATEUR PUR (~150 lignes)
```

---

## 3. Fonctionnalités Implémentées ✅

### Phase 1: Infrastructure Modulaire ✅
- Structure des répertoires créée pour 26 modules backend
- Documentation et configuration

### Phase 2: Moteurs Core Backend ✅
| Module | Endpoint | Fonctionnalités |
|--------|----------|-----------------|
| nutrition_engine | /api/v1/nutrition | 29 ingrédients, analyse nutritionnelle |
| scoring_engine | /api/v1/scoring | 13 critères pondérés |
| ai_engine | /api/v1/ai | GPT-5.2, comparaisons |
| weather_engine | /api/v1/weather | Score météo, lune |
| geospatial_engine | /api/v1/geospatial | 17 régions Québec |
| wms_engine | /api/v1/wms | 10 couches WMS |
| strategy_engine | /api/v1/strategy | Stratégies de chasse |

### Phase 3: Moteurs Métier Backend ✅
| Module | Endpoint | Fonctionnalités |
|--------|----------|-----------------|
| user_engine | /api/v1/user | Auth, profils, préférences |
| admin_engine | /api/v1/admin | Dashboard, maintenance |
| notification_engine | /api/v1/notification | Multi-canal |
| referral_engine | /api/v1/referral | Parrainage, commissions |
| territory_engine | /api/v1/territory | Territoires, locations |
| tracking_engine | /api/v1/tracking | GPS temps réel |
| marketplace_engine | /api/v1/marketplace | C2C équipement |
| plugins_engine | /api/v1/plugins | Feature flags |

### Phase 4: Moteurs Plan Maître Backend ✅
| Module | Endpoint | Fonctionnalités |
|--------|----------|-----------------|
| recommendation_engine | /api/v1/recommendation | Recommandations personnalisées, filtrage hybride |
| collaborative_engine | /api/v1/collaborative | Groupes de chasse, chat, partage de spots |
| ecoforestry_engine | /api/v1/ecoforestry | Données SIEF, habitats par espèce |
| engine_3d | /api/v1/3d | MNT, profils élévation, viewshed |
| wildlife_behavior_engine | /api/v1/wildlife | Comportement animalier, prédiction |
| weather_fauna_simulation_engine | /api/v1/simulation | Corrélation météo/faune |
| adaptive_strategy_engine | /api/v1/adaptive | Stratégies adaptatives temps réel |
| advanced_geospatial_engine | /api/v1/advanced-geo | Corridors, zones concentration, heatmaps |
| progression_engine | /api/v1/progression | Gamification, XP, badges, défis |
| networking_engine | /api/v1/network | Réseau social chasseurs |

### Phase 5: Couches de Données Backend ✅
| Module | Endpoint | Fonctionnalités |
|--------|----------|-----------------|
| ecoforestry_data_layer | /api/v1/data/ecoforestry | Peuplements forestiers SIEF, coupes, HSI habitats |
| behavioral_data_layer | /api/v1/data/behavioral | Observations faune, patterns activité, mouvements |
| simulation_data_layer | /api/v1/data/simulation | Corrélations météo, conditions optimales |
| 3d_data_layer | /api/v1/data/3d | Élévation DEM, pente/aspect, viewshed |
| advanced_geospatial_data_layer | /api/v1/data/geospatial-advanced | Corridors, zones concentration, connectivité, heatmaps |

### Phase 6: Live Heading View ✅ (NOUVEAU)
| Module | Endpoint | Fonctionnalités |
|--------|----------|-----------------|
| live_heading_engine | /api/v1/live-heading | Sessions navigation, position updates, POIs, alertes |

**Frontend Live Heading View:**
- `LiveHeadingView.jsx` - Vue immersive plein écran avec cône de vision
- `CompassWidget.jsx` - Boussole animée avec rotation en temps réel
- `WindIndicator.jsx` - Direction du vent avec indicateur de favorabilité
- `POIMarker.jsx` - Marqueurs de points d'intérêt dans le cône
- `AlertToast.jsx` - Notifications contextuelles (vent, POI proches)
- `SessionControls.jsx` - Pause/Resume/Fin de session
- `SessionStats.jsx` - Distance, durée, POIs en temps réel

---

## 4. Documentation

### Swagger/OpenAPI
- **Swagger UI**: /api/docs
- **ReDoc**: /api/redoc
- **OpenAPI JSON**: /api/openapi.json

### Statut des Modules
- **Endpoint**: /api/modules/status
- **Total modules**: 30
- **Phase 2**: 7 modules
- **Phase 3**: 8 modules
- **Phase 4**: 10 modules
- **Phase 5**: 5 modules (Data Layers)

---

## 5. Phases Restantes

### P0 - Critique

#### Phase 5: Couches de Données (5 modules) ✅ COMPLÉTÉE
#### Phase 6: Module Live Heading View ✅ COMPLÉTÉE
#### Phase 7: Découplage server.py ✅ COMPLÉTÉE
- [x] products_engine extrait
- [x] orders_engine extrait (avec commissions)
- [x] suppliers_engine extrait
- [x] customers_engine extrait
- [x] cart_engine extrait
- [x] affiliate_engine extrait
- [x] alerts_engine extrait (avec site settings)
- [x] server.py transformé en orchestrateur pur (~150 lignes)
- [x] Legacy router préservé pour rétrocompatibilité

### P1 - Important (Phases 8-11)
- [ ] Phase 8: Modularisation Frontend Core
- [ ] Phase 9: Modularisation Frontend Métier
- [ ] Phase 10: Modules Frontend Plan Maître
- [ ] Phase 11: Tests & Documentation complète

---

## 6. Tests et Validation

### Rapports de Test
- `/app/test_reports/iteration_1.json` - Phase 2
- `/app/test_reports/iteration_2.json` - Phase 3

### Statut
- [x] 38/38 modules opérationnels
- [x] Monolithe legacy intact (rétrocompatibilité)
- [x] server.py = orchestrateur pur
- [x] Swagger documentation: /api/docs
- [x] Non-régression validée (monolithe + modules existants)
- [x] Frontend fonctionnel
- [x] Documentation Swagger accessible
- [x] Tous les health checks Phase 4 validés

---

## 7. Changelog Décembre 2025

### Phase 4 Complétée (Décembre 2025)
- ✅ recommendation_engine créé avec filtrage hybride (collaboratif + contenu + contexte)
- ✅ collaborative_engine créé avec groupes, spots, calendrier, chat, positions
- ✅ ecoforestry_engine créé avec données SIEF, analyse habitats
- ✅ engine_3d créé avec MNT, profils élévation, viewshed
- ✅ wildlife_behavior_engine créé avec modélisation comportement 3 espèces
- ✅ weather_fauna_simulation_engine créé avec corrélations météo/activité
- ✅ adaptive_strategy_engine créé avec stratégies adaptatives et feedback
- ✅ advanced_geospatial_engine créé avec corridors, zones, heatmaps
- ✅ progression_engine créé avec XP, niveaux, badges, défis
- ✅ networking_engine créé avec profils, connexions, feed, événements
- ✅ routers.py mis à jour vers v1.3 avec 25 modules
- ✅ Tous endpoints testés et fonctionnels

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
*Architecture Modulaire v1.3 - 25 Modules Opérationnels*
