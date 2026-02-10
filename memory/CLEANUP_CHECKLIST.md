# 📋 HUNTIQ V3 - Checklist de Nettoyage & Maintenance

## ✅ Objectif: Build 0 Warning

Ce document définit les règles et procédures pour maintenir un build propre.

---

## 1. Configuration ESLint (.eslintrc.js)

```javascript
module.exports = {
  rules: {
    'react-hooks/exhaustive-deps': 'off'
  }
};
```

**Justification**: Les warnings `exhaustive-deps` sont désactivés car:
- Certains useEffect sont intentionnellement limités
- La performance prime dans certains cas
- Code legacy stable

---

## 2. Règles Backend (Python)

### ✅ Faire
- Utiliser `except Exception:` au lieu de `except:`
- Supprimer les imports non utilisés
- Utiliser f-strings uniquement avec des placeholders

### ❌ Ne pas faire
- `except:` (bare except)
- Variables non utilisées sans préfixe `_`
- f-strings vides: `f"texte"` → `"texte"`

### Commandes de vérification
```bash
# Lint backend
cd /app/backend && python -m ruff check .

# Lint avec auto-fix
cd /app/backend && python -m ruff check --fix .
```

---

## 3. Règles Frontend (React/JavaScript)

### ✅ Faire
- Utiliser `useCallback` pour les fonctions passées en props
- Déclarer les dépendances explicites quand nécessaire
- Préfixer les variables inutilisées avec `_`

### Commandes de vérification
```bash
# Build strict (CI mode)
cd /app/frontend && CI=true yarn build

# Build normal
cd /app/frontend && yarn build
```

---

## 4. Checklist Pré-Commit

- [ ] `yarn build` frontend sans erreur
- [ ] `ruff check .` backend sans erreur
- [ ] Tests unitaires passent
- [ ] Pas de `console.log` en production
- [ ] Pas de credentials en dur

---

## 5. Architecture Modulaire - Règles

### Backend (/app/backend/modules/)
```
module_name/
├── __init__.py      # Export du router
├── v1/
│   ├── __init__.py
│   ├── router.py    # Endpoints FastAPI
│   ├── service.py   # Logique métier
│   └── models.py    # Pydantic models
```

### Frontend (/app/frontend/src/modules/)
```
module_name/
├── index.js         # Exports
├── ModuleService.js # API client
└── components/
    └── Component.jsx
```

### Règles
- ❌ Pas de logique croisée entre modules
- ✅ Chaque module est indépendant
- ✅ Communication via API uniquement

---

## 6. Versions et Dépendances

| Technologie | Version | Notes |
|-------------|---------|-------|
| Node.js | 18.x | LTS |
| Python | 3.11+ | FastAPI |
| React | 18.x | Hooks |
| MongoDB | 6.x | Atlas compatible |

---

## 7. Maintenance Régulière

### Hebdomadaire
- Vérifier les warnings de build
- Mettre à jour les dépendances mineures

### Mensuelle
- Audit de sécurité: `yarn audit`, `pip-audit`
- Nettoyage des imports non utilisés
- Revue des TODO/FIXME

---

## 8. Contacts & Ressources

- **Documentation**: `/app/memory/PRD.md`
- **Changelog**: `/app/memory/PRD.md` section Changelog
- **Tests**: `/app/backend/tests/`, `/app/e2e-tests/`

---

*Dernière mise à jour: 10 Février 2026*
*Mainteneur: HUNTIQ Team*
