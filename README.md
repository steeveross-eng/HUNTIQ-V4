# HUNTIQ V3 - Plateforme de Chasse Intelligente

![Version](https://img.shields.io/badge/version-3.8.0-green)
![Modules](https://img.shields.io/badge/modules-42-blue)
![Tests](https://img.shields.io/badge/tests-111%20passed-brightgreen)

## 🎯 Description

**HUNTIQ V3** est une plateforme de chasse intelligente utilisant l'IA GPT-5.2 pour optimiser les stratégies de chasse, analyser les attractants et fournir des recommandations personnalisées.

## ✨ Fonctionnalités Principales

### 🕐 Legal Time Engine
- Calcul précis des heures légales de chasse
- Basé sur lever/coucher du soleil (bibliothèque Astral)
- Règlement Québec: 30 min avant lever → 30 min après coucher
- Alertes 15 minutes avant fin de période

### 🔮 Predictive Engine
- Prédiction de succès de chasse multi-facteurs
- Analyse: saison, météo, phase lunaire, pression, activité
- Timeline d'activité 24h par espèce
- Support: cerf, orignal, ours, dindon

### 🤖 AI Engine (GPT-5.2)
- Analyse de produits automatisée
- Recommandations personnalisées
- Q&A intelligent sur la chasse
- Comparaison de produits avec IA

### 🔔 Notifications
- Push notifications navigateur
- Alertes in-app (toasts)
- Rappels personnalisables

## 🏗️ Architecture

```
/app/
├── backend/
│   ├── server.py              # Orchestrateur FastAPI
│   ├── database.py            # MongoDB connection
│   ├── modules/               # 42 modules backend
│   │   ├── legal_time_engine/
│   │   ├── predictive_engine/
│   │   ├── ai_engine/
│   │   ├── notification_engine/
│   │   ├── weather_engine/
│   │   ├── scoring_engine/
│   │   ├── products_engine/
│   │   └── ...
│   └── utils/
│       └── performance.py     # Cache & rate limiting
├── frontend/
│   └── src/
│       ├── App.js
│       ├── modules/           # 21 modules frontend
│       │   ├── legaltime/
│       │   ├── predictive/
│       │   ├── notifications/
│       │   └── ...
│       └── pages/
│           ├── DashboardPage.jsx
│           ├── BusinessPage.jsx
│           └── PlanMaitrePage.jsx
└── e2e-tests/
    └── tests/
        └── huntiq.spec.js     # 14 tests E2E Playwright
```

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Modules Backend | 42 |
| Modules Frontend | 21 |
| Tests Unitaires | 97 |
| Tests E2E | 14 |
| Endpoints API | 100+ |
| Couverture | 100% features |

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.11+
- Node.js 18+
- MongoDB 6+

### Installation Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### Installation Frontend
```bash
cd frontend
yarn install
yarn start
```

### Tests
```bash
# Tests unitaires backend
cd backend && pytest tests/ -v

# Tests E2E
cd e2e-tests && npx playwright test
```

## 📖 Documentation API

- **Swagger UI**: `/api/docs`
- **ReDoc**: `/api/redoc`
- **OpenAPI JSON**: `/api/openapi.json`

### Endpoints Principaux

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/legal-time/legal-window` | Fenêtre de chasse légale |
| `GET /api/v1/legal-time/check` | Vérification statut actuel |
| `GET /api/v1/predictive/success` | Prédiction de succès |
| `GET /api/v1/predictive/timeline` | Timeline d'activité 24h |
| `POST /api/v1/ai/query` | Q&A avec GPT-5.2 |
| `GET /api/v1/notification/legal-time/status` | Statut notifications |

## 🔧 Configuration

### Variables d'environnement (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=huntiq_v3
EMERGENT_LLM_KEY=sk-emergent-xxx
```

### Localisation par défaut
- Québec City, QC (46.8139, -71.2080)
- Timezone: America/Toronto

## 📈 Changelog

### v3.8.0 (Février 2026)
- ✅ Phase P2 complète - Stabilisation
- ✅ Tests E2E Playwright (14 tests)
- ✅ MongoDB avec indexes et seed data
- ✅ Performance: LRU Cache & Rate Limiting
- ✅ Documentation API Swagger améliorée

### v3.7.0 (Février 2026)
- ✅ Phase P1 - GPT-5.2 & Notifications
- ✅ Intégration Emergent LLM Key
- ✅ Notifications Push + In-app

### v3.6.0 (Février 2026)
- ✅ Phase 11 - Tests & Documentation
- ✅ 97 tests unitaires

### v3.5.0 (Février 2026)
- ✅ Phase 8+ - Legal Time Engine
- ✅ Predictive Engine

## 📜 License

Copyright © 2026 BIONIC Hunt. Tous droits réservés.

---

*HUNTIQ V3 - Powered by GPT-5.2 & Emergent Platform*
