# Rôle Business - Documentation Périmètre Fonctionnel

## Date: 10 Février 2026
## Version: 1.0.0

---

## 1. DÉFINITION DU RÔLE

| Attribut | Valeur |
|----------|--------|
| **Identifiant technique** | `business` |
| **Label** | 🏪 Business |
| **Description** | Profil commercial avec accès marketplace, ventes et programme affilié |
| **Elevated** | Oui (rôle professionnel) |
| **Permissions** | 32 |

---

## 2. PUBLIC CIBLE

Le rôle `business` est destiné aux :

- **Vendeurs Marketplace** : Utilisateurs souhaitant vendre des produits/services
- **Partenaires Commerciaux** : Entreprises partenaires avec catalogue
- **Affiliés Avancés** : Participants au programme d'affiliation avec dashboard
- **Fournisseurs** : Fournisseurs de produits/équipements de chasse

---

## 3. MODULES ACCESSIBLES

### 3.1 Modules Rattachés Directement

| Module | Permissions | Description |
|--------|-------------|-------------|
| products_engine | 7 | Gestion catalogue produits |
| orders_engine | 6 | Traitement des commandes |
| customers_engine | 3 | Relations clients |
| cart_engine | 1 | Analytique paniers |
| suppliers_engine | 2 | Profil fournisseur |
| marketplace_engine | 4 | Dashboard vendeur |
| affiliate_engine | 4 | Programme affilié |

### 3.2 Modules Partagés (avec hunter)

| Module | Permissions | Description |
|--------|-------------|-------------|
| dashboard | 1 | Vue d'ensemble |
| profile | 1 | Gestion profil |
| notifications | 1 | Réception notifications |

---

## 4. LISTE COMPLÈTE DES PERMISSIONS

### 4.1 Permissions de base (3)
```
view_dashboard           # Vue dashboard général
manage_profile           # Gestion de son profil
receive_notifications    # Réception des notifications
```

### 4.2 Products Module (7)
```
view_own_products           # Voir ses propres produits
create_products             # Créer des produits
update_own_products         # Modifier ses produits
delete_own_products         # Supprimer ses produits
manage_product_inventory    # Gérer les stocks
manage_product_pricing      # Ajuster les prix
manage_product_media        # Gérer images/vidéos
```

### 4.3 Orders Module (6)
```
view_own_orders             # Voir commandes reçues
update_order_status         # Mettre à jour statut (expédié, annulé)
manage_order_fulfillment    # Workflow de fulfillment
view_order_history          # Historique des commandes
export_order_reports        # Exporter données commandes
```

### 4.4 Customers Module (3)
```
view_own_customers              # Voir ses clients
manage_customer_communications  # Envoyer messages clients
view_customer_analytics         # Insights comportement client
```

### 4.5 Cart Module (1)
```
view_cart_analytics         # Analytique paniers abandonnés
```

### 4.6 Suppliers Module (2)
```
manage_supplier_profile     # Gérer profil fournisseur
view_supplier_orders        # Voir commandes en tant que fournisseur
```

### 4.7 Marketplace Module (4)
```
access_marketplace_seller   # Accès dashboard vendeur
manage_marketplace_listings # Gérer ses listings
view_marketplace_analytics  # Performance ventes
participate_promotions      # Participer aux promotions
```

### 4.8 Affiliate Module (4)
```
access_affiliate_program    # Rejoindre programme affilié
view_affiliate_earnings     # Suivi commissions
manage_affiliate_links      # Gérer liens de parrainage
export_affiliate_reports    # Exporter rapports
```

### 4.9 Analytics (4)
```
view_sales_analytics        # Tendances ventes
view_revenue_reports        # Rapports revenus
export_business_reports     # Export données business
```

---

## 5. DISTINCTION AVEC AUTRES RÔLES

### 5.1 Business vs Hunter
| Aspect | Hunter | Business |
|--------|--------|----------|
| Focus | Chasse terrain | Commerce |
| Produits | Non | ✅ Gestion complète |
| Commandes | Acheteur | ✅ Vendeur |
| Analytics | Personnel | ✅ Ventes |

### 5.2 Business vs Guide
| Aspect | Guide | Business |
|--------|-------|----------|
| Focus | Groupes terrain | Commerce |
| Territoires | ✅ Gestion | Non |
| Groupes | ✅ Gestion | Non |
| Marketplace | Non | ✅ Complet |

### 5.3 Business vs Admin
| Aspect | Business | Admin |
|--------|----------|-------|
| Scope | Propres données | Toutes données |
| Users | Non | ✅ Gestion |
| Settings | Non | ✅ Configuration |
| Audit | Non | ✅ Complet |

---

## 6. API ENDPOINTS DÉDIÉS

### 6.1 Promotion vers Business
```
POST /api/v1/roles/promote/business/{user_id}
Authorization: Bearer <admin_token>
```

### 6.2 Middleware de Protection
```python
from modules.roles_engine.v1 import require_business_or_admin

@router.get("/seller/dashboard")
async def seller_dashboard(user: UserWithRole = Depends(require_business_or_admin)):
    pass
```

---

## 7. CONFORMITÉ ARCHITECTURALE

| Critère | Status |
|---------|--------|
| Séparation couches | ✅ models/service/router |
| Isolation module | ✅ 0 import métier |
| Dépendances circulaires | ✅ Aucune |
| Middleware dédié | ✅ require_business_or_admin |
| Documentation | ✅ Complète |

---

## 8. ÉVOLUTIONS FUTURES COMPATIBLES

Le rôle `business` est préparé pour :

- **Subscription tiers** : Plans Basic/Pro/Enterprise
- **Multi-boutiques** : Gestion plusieurs boutiques
- **B2B Features** : Fonctionnalités inter-entreprises
- **Payout system** : Gestion des paiements vendeurs
- **Ratings & Reviews** : Système d'avis

---

## 9. UTILISATION

### 9.1 Promouvoir un utilisateur
```bash
# Via API (admin requis)
curl -X POST "/api/v1/roles/promote/business/{user_id}" \
  -H "Authorization: Bearer <admin_token>"
```

### 9.2 Vérifier le rôle
```bash
# Obtenir son rôle
curl "/api/v1/roles/me" \
  -H "Authorization: Bearer <user_token>"
```

### 9.3 Vérifier une permission
```bash
# Vérifier permission spécifique
curl "/api/v1/roles/check/create_products" \
  -H "Authorization: Bearer <user_token>"
```
