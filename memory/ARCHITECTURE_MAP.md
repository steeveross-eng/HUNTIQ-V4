# HUNTIQ/BIONIC - Cartographie Architecture Interne

## Date: 10 Février 2026
## Version: 1.0.0

---

## 1. VUE D'ENSEMBLE

### Statistiques Globales
| Métrique | Valeur |
|----------|--------|
| Modules Backend | 46 |
| Endpoints API | ~350 |
| Rôles Techniques | 3 (hunter, guide, admin) |
| Profils Métier | 4 (Usager, Affilié, Business, Admin) |
| Phases Complétées | P1 → P5 |

---

## 2. CLASSIFICATION FONCTIONNELLE DES MODULES

### 2.1 MODULES USAGER (13 modules)
Destinés aux chasseurs individuels (rôle: `hunter`)

| Module | Prefix API | Description | Endpoints |
|--------|-----------|-------------|-----------|
| analytics_engine | /api/v1/analytics | Dashboard analytics personnel | 11 |
| waypoint_scoring_engine | /api/v1/waypoint-scoring | WQS et prédictions | 11 |
| hunting_trip_logger | /api/v1/trips | Logging sorties de chasse | 14 |
| geolocation_engine | /api/v1/geolocation | GPS et alertes proximité | 11 |
| notification_engine | /api/v1/notification | Notifications push | 15 |
| weather_engine | /api/v1/weather | Météo et conditions | 6 |
| legal_time_engine | /api/v1/legal-time | Heures légales | 7 |
| nutrition_engine | /api/v1/nutrition | Guide nutrition gibier | 8 |
| scoring_engine | /api/v1/scoring | Score waypoints | 6 |
| strategy_engine | /api/v1/strategy | Stratégies de chasse | 10 |
| recommendation_engine | /api/v1/recommendation | Recommandations IA | 11 |
| progression_engine | /api/v1/progression | Badges, gamification | 13 |
| user_engine | /api/v1/user | Profil utilisateur | 17 |

### 2.2 MODULES AFFILIÉ / GUIDE (5 modules)
Destinés aux guides professionnels (rôle: `guide`)

| Module | Prefix API | Description | Endpoints |
|--------|-----------|-------------|-----------|
| collaborative_engine | /api/v1/collaborative | Groupes et collaboration | 27 |
| territory_engine | /api/v1/territory | Gestion territoires | ~10 |
| networking_engine | /api/v1/network | Réseau chasseurs | 19 |
| referral_engine | /api/v1/referral | Parrainage | 15 |
| affiliate_engine | /api/v1/affiliate | Programme affiliation | 5 |

### 2.3 MODULES COMMERCIAL / MARKETPLACE (6 modules)
Destinés aux vendeurs (rôle: `business` - à créer)

| Module | Prefix API | Description | Endpoints |
|--------|-----------|-------------|-----------|
| products_engine | /api/v1/products | Catalogue produits | 13 |
| cart_engine | /api/v1/cart | Panier d'achat | 7 |
| orders_engine | /api/v1/orders | Gestion commandes | 9 |
| customers_engine | /api/v1/customers | Gestion clients | 7 |
| suppliers_engine | /api/v1/suppliers | Fournisseurs | 7 |
| marketplace_engine | /api/v1/marketplace | Place de marché | ~8 |

### 2.4 MODULES ADMINISTRATION (3 modules)
Réservés aux administrateurs (rôle: `admin`)

| Module | Prefix API | Description | Protection |
|--------|-----------|-------------|------------|
| admin_engine | /api/v1/admin | Panneau admin | 9 endpoints require_admin |
| roles_engine | /api/v1/roles | Gestion rôles | 9 endpoints require_admin |
| alerts_engine | /api/v1/alerts | Alertes système | Non protégé (à corriger) |

### 2.5 MODULES TECHNIQUE / INFRASTRUCTURE (7 modules)
Modules transversaux

| Module | Prefix API | Description |
|--------|-----------|-------------|
| auth_engine | /api/auth | Auth JWT/OAuth |
| ai_engine | /api/v1/ai | GPT-5.2 integration |
| geospatial_engine | /api/v1/geospatial | Données géo |
| advanced_geospatial_engine | /api/v1/advanced-geo | Geo avancé |
| wms_engine | /api/v1/wms | Web Map Service |
| data_layers | N/A | Couches données |
| plugins_engine | /api/v1/plugins | Système plugins |

### 2.6 MODULES AVANCÉ / SIMULATION (8 modules)
Fonctionnalités premium

| Module | Prefix API | Description |
|--------|-----------|-------------|
| predictive_engine | /api/v1/predictive | Prédictions ML |
| adaptive_strategy_engine | /api/v1/adaptive | Stratégies adaptatives |
| wildlife_behavior_engine | /api/v1/wildlife | Comportement faune |
| weather_fauna_simulation_engine | /api/v1/simulation | Simulation |
| ecoforestry_engine | /api/v1/ecoforestry | Écoforesterie |
| engine_3d | /api/v1/3d | Visualisation 3D |
| live_heading_engine | /api/v1/live-heading | Direction temps réel |
| tracking_engine | /api/v1/tracking | Tracking avancé |

---

## 3. PERMISSIONS PAR RÔLE

### 3.1 HUNTER (Chasseur) - 10 permissions
```
view_dashboard, create_trip, manage_own_trips, view_analytics,
view_wqs, manage_waypoints, view_map, manage_profile,
receive_notifications, view_public_territories
```

### 3.2 GUIDE (Guide) - 17 permissions
Inclut toutes les permissions Hunter + :
```
★ view_client_trips, ★ manage_group_trips, ★ share_waypoints,
★ view_group_analytics, ★ export_reports, ★ manage_territory_access,
★ send_group_notifications
```

### 3.3 ADMIN (Administrateur) - Accès illimité
```
* (wildcard), admin_panel, manage_users, manage_roles,
view_all_trips, view_all_analytics, manage_site_settings,
manage_maintenance_mode, view_system_logs, manage_features,
manage_products, manage_orders, manage_territories,
manage_notifications, impersonate_user, export_all_data
```

---

## 4. LOGIQUE D'ACCÈS ACTUELLE

### 4.1 Mécanismes en place

| Mécanisme | Type | Implémentation |
|-----------|------|----------------|
| Authentification | JWT/OAuth | auth_engine |
| Rôles | RBAC | roles_engine |
| Permissions | Permission-based | require_permission() |
| Feature Flags | Module toggle | site_access.py |
| Mode Site | Environnement | live/development/maintenance |

### 4.2 Endpoints protégés

| Module | Endpoints protégés | Méthode |
|--------|-------------------|---------|
| admin_engine | 9/13 | require_admin |
| roles_engine | 9/12 | require_admin |
| site_access | 4/6 | require_admin |

### 4.3 Endpoints NON protégés (attention)
- alerts_engine (10 endpoints)
- Tous les modules usager (accès public avec auth)

---

## 5. DÉPENDANCES INTER-MODULES

```
auth_engine (Core)
├── roles_engine (role checking)
└── email_service (password reset, welcome)

roles_engine (Core)
├── → admin_engine (require_admin)
└── → site_access (require_admin)

hunting_trip_logger
├── analytics_engine (sync trip data)
├── waypoint_scoring (update WQS)
└── email_service (trip summary)

ai_engine (GPT-5.2)
├── → recommendation_engine
├── → strategy_engine
└── → adaptive_strategy_engine

geolocation_engine
└── notification_engine (proximity alerts)
```

---

## 6. COHÉRENCE RÔLES TECHNIQUES / PROFILS MÉTIER

### Mapping actuel

| Profil Métier | Rôle Technique | Modules Accessibles |
|---------------|----------------|---------------------|
| Usager | hunter | 13 modules usager |
| Affilié/Guide | guide | + 5 modules affilié |
| Business | (manquant) | modules marketplace |
| Admin | admin | tous les modules |

### Recommandation

**Gap identifié** : Le profil "Business" (vendeurs marketplace) n'a pas de rôle technique dédié.

**Solution proposée** : Créer un rôle `business` ou `seller` avec permissions :
```
manage_own_products, view_own_orders, manage_own_customers,
view_sales_analytics, export_sales_reports
```

---

## 7. RECOMMANDATIONS

### 7.1 Séparation Usager / Affilié / Admin

✅ **Déjà en place** :
- hunter (usager) vs guide (affilié) vs admin
- Permissions distinctes par rôle
- Middleware require_admin fonctionnel

⚠️ **À compléter** :
1. Ajouter rôle `business` pour marketplace
2. Protéger alerts_engine avec require_admin
3. Ajouter require_permission sur modules métier sensibles

### 7.2 Actions prioritaires

| Priorité | Action | Impact |
|----------|--------|--------|
| P0 | Protéger alerts_engine | Sécurité |
| P1 | Créer rôle business | Marketplace |
| P1 | UI admin pour gestion rôles | UX Admin |
| P2 | Audit permissions par module | Compliance |
| P2 | Documentation API par profil | DX |

### 7.3 Évolutions futures compatibles

Le système actuel est prêt pour :
- ✅ Groupes et notifications push (guide permissions)
- ✅ Marketplace avancé (avec rôle business)
- ✅ Multi-tenancy (via territory_engine)
- ✅ Audit et compliance (via role_change_logs)

---

## 8. CONCLUSION

L'architecture interne HUNTIQ/Bionic est **solide et extensible** :

- **46 modules** organisés en 6 catégories fonctionnelles
- **3 rôles techniques** couvrant les cas d'usage principaux
- **Séparation claire** entre couches API/Service/Modèle
- **Aucune dette technique** sur le module roles_engine
- **Gap identifié** : rôle business manquant pour marketplace

**Validation** : La séparation usager/affilié/admin est formalisée et fonctionnelle.
Le système est prêt pour l'intégration UI et les extensions futures.
