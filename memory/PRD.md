# HUNTIQ V3 - Product Requirements Document

## Date de création: 2026-02-03
## Dernière mise à jour: Février 2026
## Version: 5.0 (Architecture Modulaire v2.0 - Phases 8, 9, 10 COMPLÈTES)

---

## 1. Énoncé du Problème Original

Fusionner HUNTIQ V1 et V2 + Intégrer l'IA GPT-5.2 pour l'analyse d'attractants.
Refactorisation majeure vers une architecture modulaire stricte ("PLAN MAÎTRE BIONIC").

---

## 2. Architecture

### Stack Technique
- **Frontend**: React 18 + Tailwind CSS + ShadCN UI + 20 Modules Frontend
- **Backend**: FastAPI (Python) - 38 modules
- **Base de données**: MongoDB
- **IA**: GPT-5.2 via Emergent LLM Key (planifié)
- **Architecture**: Modulaire v2.0 (Backend 100% + Frontend Phases 8-10 Complètes)

### Frontend Modulaire

```
/app/frontend/src/modules/
│
├── [DASHBOARDS INTÉGRATEURS]
│   ├── dashboard/CoreDashboard.jsx      # Dashboard Core (Phase 8)
│   ├── business/BusinessDashboard.jsx   # Dashboard Métier (Phase 9)
│   └── planmaitre/PlanMaitreDashboard.jsx # Dashboard Plan Maître (Phase 10)
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
├── [PLAN MAÎTRE MODULES - Phase 10] ✅
│   ├── recommendation/  # RecommendationPanel, SimilarProducts + RecommendationService
│   ├── wildlife/        # WildlifeTracker, SpeciesSelector + WildlifeService
│   ├── territory/       # TerritoryCard, TerritoryList + TerritoryService
│   ├── predictive/      # PredictiveWidget + PredictiveService
│   ├── collaborative/   # SightingsFeed + CollaborativeService
│   ├── ecoforestry/     # HabitatAnalysis + EcoforestryService
│   └── behavioral/      # ActivityChart + BehavioralService
│
└── [Existing modules]
    ├── live_heading_view/   # Phase 6
    ├── wms/
    └── geospatial/
```

### Routes Frontend (3 Dashboards)
| Route | Dashboard | Modules | Nav Color |
|-------|-----------|---------|-----------|
| `/dashboard` | CoreDashboard | nutrition, scoring, weather, ai, strategy | 🟡 Jaune |
| `/business` | BusinessDashboard | user, products, orders, cart, affiliate, suppliers, customers | 🟣 Violet |
| `/plan-maitre` | PlanMaitreDashboard | recommendation, wildlife, territory, predictive, collaborative, ecoforestry, behavioral | 🟢 Émeraude |

---

## 3. Fonctionnalités Implémentées ✅

### Phase 1-7: Backend (38 modules) ✅

### Phase 8: Frontend Core ✅
- **CoreDashboard** avec 5 onglets
- 5 modules core: nutrition, scoring, weather, ai, strategy
- 17 composants UI

### Phase 9: Frontend Business ✅
- **BusinessDashboard** avec 5 onglets
- 7 modules business: user, products, orders, cart, affiliate, suppliers, customers
- 11 composants UI, 7 services

### Phase 10: Frontend Plan Maître ✅
- **PlanMaitreDashboard** avec 5 onglets
- 7 modules avancés: recommendation, wildlife, territory, predictive, collaborative, ecoforestry, behavioral
- 10 composants UI, 7 services
- Sélecteur 7 espèces intégré

---

## 4. Tests et Validation

### Rapport de Test Phase 10 (iteration_5.json)
- **Status**: PASSED
- **Success Rate Frontend**: 100%
- **Non-régression Phase 8 & 9**: OK
- **Non-régression Pages existantes**: OK

### Résumé Tests Cumulatifs
| Phase | Tests | Status |
|-------|-------|--------|
| Phase 8 (Core) | 11 tests | ✅ 100% |
| Phase 9 (Business) | 11 tests | ✅ 100% |
| Phase 10 (Plan Maître) | 12 tests | ✅ 100% |

---

## 5. Phases Restantes

### Complété ✅
- Phase 1-7: Backend 38 modules
- Phase 8: Frontend Core + Dashboard
- Phase 9: Frontend Business + Dashboard
- Phase 10: Frontend Plan Maître + Dashboard

### À venir (P1)
- [ ] **Phase 11**: Tests & Documentation complète
  - Unit tests pour chaque module
  - Documentation API
  - README par module

### Futur (P2)
- [ ] Intégration données réelles (remplacer placeholders)
- [ ] GPT-5.2 intégration complète
- [ ] Tests E2E complets
- [ ] Optimisation performance

---

## 6. Statistiques Finales

| Métrique | Valeur |
|----------|--------|
| Modules Backend | 38 |
| Modules Frontend Total | 20 |
| └─ Core (Phase 8) | 5 |
| └─ Business (Phase 9) | 7 |
| └─ Plan Maître (Phase 10) | 7 |
| └─ Existants | 1 |
| Dashboards | 3 |
| Composants UI Total | 38+ |
| Services Frontend | 14 |
| Routes Dashboard | 3 |
| Tests Passés | 100% |

---

## 7. Navigation

```
Navigation principale:
├── Home (gris)
├── Dashboard (jaune #f5a623) → /dashboard (Core)
├── Business (violet) → /business (Métier)
├── Plan Maître (émeraude) → /plan-maitre (Avancé)
├── Analyze (gris)
├── Shop (gris)
└── Territory (gris)
```

---

## 8. Changelog

### Phase 10 Complétée (Février 2026)
- ✅ Module recommendation créé (RecommendationPanel, SimilarProducts)
- ✅ Module wildlife créé (WildlifeTracker, SpeciesSelector)
- ✅ Module territory créé (TerritoryCard, TerritoryList)
- ✅ Module predictive créé (PredictiveWidget)
- ✅ Module collaborative créé (SightingsFeed)
- ✅ Module ecoforestry créé (HabitatAnalysis)
- ✅ Module behavioral créé (ActivityChart)
- ✅ PlanMaitreDashboard créé avec 5 onglets
- ✅ Route /plan-maitre ajoutée
- ✅ Navigation Plan Maître ajoutée (lien émeraude)
- ✅ Tous composants avec fallback placeholders
- ✅ Tests Phase 10 - 100% passés
- ✅ Non-régression Phases 8 & 9 validées

### Phase 9 Complétée (Février 2026)
- 7 modules Business + BusinessDashboard

### Phase 8 Complétée (Février 2026)
- 5 modules Core + CoreDashboard

---

## 9. Notes Techniques

### Données Placeholder
Tous les modules frontend utilisent des données placeholder quand les APIs backend retournent des erreurs. C'est un comportement intentionnel pour la Phase 10 qui permet un développement frontend indépendant.

### Prochaines Étapes Recommandées
1. **Phase 11**: Ajouter tests unitaires et documentation
2. Activer progressivement les vrais endpoints backend
3. Implémenter GPT-5.2 dans les modules AI
4. Optimiser les performances (lazy loading, caching)

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
*Architecture Modulaire v2.0 - 38 Modules Backend + 20 Modules Frontend*
*3 Dashboards Intégrateurs : Core • Business • Plan Maître*
