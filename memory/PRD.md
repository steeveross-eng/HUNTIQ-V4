# HUNTIQ V3 - Product Requirements Document

## Date de création: 2026-02-03
## Dernière mise à jour: Février 2026
## Version: 4.0 (Architecture Modulaire v2.0 - Phases 8 & 9 COMPLÈTES)

---

## 1. Énoncé du Problème Original

Fusionner HUNTIQ V1 et V2 + Intégrer l'IA GPT-5.2 pour l'analyse d'attractants.
Refactorisation majeure vers une architecture modulaire stricte ("PLAN MAÎTRE BIONIC").

---

## 2. Architecture

### Stack Technique
- **Frontend**: React 18 + Tailwind CSS + ShadCN UI + 13 Modules Frontend
- **Backend**: FastAPI (Python) - 38 modules
- **Base de données**: MongoDB
- **IA**: GPT-5.2 via Emergent LLM Key (planifié)
- **Architecture**: Modulaire v2.0 (Backend 100% + Frontend Phase 8 & 9 Complètes)

### Frontend Modulaire

```
/app/frontend/src/modules/
│
├── [DASHBOARDS]
│   ├── dashboard/CoreDashboard.jsx      # Dashboard Core (Phase 8)
│   └── business/BusinessDashboard.jsx   # Dashboard Métier (Phase 9)
│
├── [CORE MODULES - Phase 8] ✅
│   ├── nutrition/       # NutritionAnalyzer, NutritionCard, NutritionScore
│   ├── scoring/         # ScoreDisplay, ScoreGauge, ScoreBreakdown, ScoreCompare
│   ├── weather/         # WeatherWidget, WindRose, HuntingConditions, WeatherForecast
│   ├── ai/              # AIAnalyzer, AIChat, AIInsights
│   └── strategy/        # StrategyPanel, StrategyCard, StrategyTimeline
│
├── [BUSINESS MODULES - Phase 9] ✅
│   ├── user/            # UserProfile, UserActivity + UserService
│   ├── products/        # ProductCard, ProductGrid + ProductsService
│   ├── orders/          # OrderCard, OrdersList + OrdersService
│   ├── cart/            # CartWidget + CartService
│   ├── affiliate/       # AffiliateStats + AffiliateService
│   ├── suppliers/       # SupplierCard + SuppliersService
│   └── customers/       # CustomerCard + CustomersService
│
└── [Existing modules]
    ├── live_heading_view/   # Phase 6
    ├── wms/
    └── geospatial/
```

### Routes Frontend
| Route | Dashboard | Modules |
|-------|-----------|---------|
| `/dashboard` | CoreDashboard | nutrition, scoring, weather, ai, strategy |
| `/business` | BusinessDashboard | user, products, orders, cart, affiliate, suppliers, customers |

---

## 3. Fonctionnalités Implémentées ✅

### Phase 1-7: Backend (38 modules) ✅

### Phase 8: Frontend Core ✅
- **CoreDashboard** avec 5 onglets
- 5 modules core: nutrition, scoring, weather, ai, strategy
- 17 composants UI totaux

### Phase 9: Frontend Business ✅
- **BusinessDashboard** avec 5 onglets
- 7 modules business: user, products, orders, cart, affiliate, suppliers, customers
- 11 composants UI totaux
- 7 services API

---

## 4. Tests et Validation

### Rapport de Test Phase 9 (iteration_4.json)
- **Status**: PASSED
- **Success Rate Frontend**: 100%
- **Non-régression Phase 8**: OK
- **Non-régression Pages existantes**: OK

### Modules Testés Phase 9
- ✅ user: 2 composants - PASSED
- ✅ products: 2 composants - PASSED
- ✅ orders: 2 composants - PASSED
- ✅ cart: 1 composant - PASSED
- ✅ affiliate: 1 composant - PASSED
- ✅ suppliers: 1 composant - PASSED
- ✅ customers: 1 composant - PASSED

---

## 5. Phases Restantes

### Complété ✅
- Phase 1-7: Backend 38 modules
- Phase 8: Frontend Core + Dashboard
- Phase 9: Frontend Business + Dashboard

### À venir (P1)
- [ ] **Phase 10**: Modules Frontend Plan Maître
  - recommendation_engine frontend
  - collaborative_sharing frontend
  - ecoforestry frontend
  - behavioral_layers frontend
- [ ] **Phase 11**: Tests & Documentation complète

### Futur (P2)
- [ ] Intégration données réelles (remplacer placeholders)
- [ ] GPT-5.2 intégration complète
- [ ] Tests E2E complets

---

## 6. Architecture des Services Frontend

| Module | Service | Endpoints Backend |
|--------|---------|-------------------|
| user | UserService | /api/v1/user/* |
| products | ProductsService | /api/v1/products/* |
| orders | OrdersService | /api/v1/orders/* |
| cart | CartService | /api/v1/cart/* |
| affiliate | AffiliateService | /api/v1/affiliate/* |
| suppliers | SuppliersService | /api/v1/suppliers/* |
| customers | CustomersService | /api/v1/customers/* |

---

## 7. Changelog

### Phase 9 Complétée (Février 2026)
- ✅ Module user créé (UserProfile, UserActivity, UserService)
- ✅ Module products créé (ProductCard, ProductGrid, ProductsService)
- ✅ Module orders créé (OrderCard, OrdersList, OrdersService)
- ✅ Module cart créé (CartWidget, CartService)
- ✅ Module affiliate créé (AffiliateStats, AffiliateService)
- ✅ Module suppliers créé (SupplierCard, SuppliersService)
- ✅ Module customers créé (CustomerCard, CustomersService)
- ✅ BusinessDashboard créé avec 5 onglets
- ✅ Route /business ajoutée à App.js
- ✅ Navigation Business ajoutée (lien en violet)
- ✅ Tests Phase 9 - 100% passés
- ✅ Non-régression Phase 8 validée

### Phase 8 Complétée (Février 2026)
- ✅ 5 modules Core frontend
- ✅ CoreDashboard avec 5 onglets
- ✅ Route /dashboard
- ✅ Tests Phase 8 - 100% passés

---

## 8. Statistiques

| Métrique | Valeur |
|----------|--------|
| Modules Backend | 38 |
| Modules Frontend Core | 5 |
| Modules Frontend Business | 7 |
| Dashboards | 2 |
| Composants UI Total | 28+ |
| Services Frontend | 7 |
| Routes Dashboard | 2 |
| Tests Passés | 100% |

---

## 9. Notes Techniques

### Backend APIs (Placeholder Mode)
Les modules backend retournent des données placeholder. C'est le comportement attendu pour cette phase de développement frontend.

### Navigation
- **Dashboard** (jaune #f5a623) → /dashboard (Core)
- **Business** (violet) → /business (Métier)

### Prochaines Étapes
1. Phase 10: Créer les modules frontend Plan Maître
2. Connecter les vrais endpoints backend aux composants
3. Implémenter l'intégration GPT-5.2 dans ai_engine

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
*Architecture Modulaire v2.0 - 38 Modules Backend + 13 Modules Frontend*
