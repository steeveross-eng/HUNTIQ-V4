# 📋 RAPPORT D'ALIGNEMENT - NAVIGATION + COUCHES + IDENTITÉ VISUELLE
## HUNTIQ V3 / BIONIC™

**Date:** 11 Février 2026  
**Phase:** Conception Globale  
**Statut:** EN ATTENTE DE VALIDATION FINALE

---

## 1. SYNTHÈSE DES LIVRABLES

| Document | Chemin | Statut |
|----------|--------|--------|
| Audit UI/UX Complet | `/app/memory/AUDIT_UIUX_COMPLET.md` | ✅ |
| Audit Admin Interfaces | `/app/memory/AUDIT_ADMIN_INTERFACES.md` | ✅ |
| Proposition Zones Avancées | `/app/memory/PROPOSITION_ZONES_AVANCEES.md` | ✅ |
| Design Guidelines JSON | `/app/design_guidelines.json` | ✅ |
| Structure i18n | `/app/frontend/src/i18n/` | ✅ |
| Traductions FR | `/app/frontend/src/i18n/locales/fr/common.json` | ✅ |
| Traductions EN | `/app/frontend/src/i18n/locales/en/common.json` | ✅ |

---

## 2. NAVIGATION UNIFIÉE

### 2.1 Structure Proposée (Utilisateur)

```
┌────────────────────────────────────────────────────────────────┐
│  🦌 BIONIC™                                    [FR|EN] [👤]    │
├────────────────────────────────────────────────────────────────┤
│  [Accueil] [Dashboard] [Intelligence ▼] [Carte ▼] [Sorties]   │
│            [Analysez] [Magasin] [Business*] [Admin*]          │
└────────────────────────────────────────────────────────────────┘

* Conditionnel selon rôle
```

| Onglet | Sous-menus | Rôles |
|--------|------------|-------|
| Accueil | - | Tous |
| Dashboard | - | Tous |
| Intelligence | Analytics, Forecast, Plan Maître | Tous |
| Carte | Carte, Territoire | Tous |
| Sorties | - | Tous |
| Analysez | - | Tous |
| Magasin | - | Tous |
| Business | - | business, admin |
| Admin | - | admin |

### 2.2 Structure Admin (10 onglets groupés)

```
┌────────────────────────────────────────────────────────────────┐
│  [Dashboard] [Commerce ▼] [Utilisateurs ▼] [Géo ▼]            │
│  [Contenu ▼] [Marketing ▼] [Config ▼] [Système]               │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. PANNEAU DE COUCHES (CARTE)

### 3.1 Hiérarchie des Groupes

```
📊 COUCHES BIONIC
├── ▼ ZONES COMPORTEMENTALES (6)
│   ├── Zone de Rut          #FF4D6D
│   ├── Zone de Repos        #8B5CF6
│   ├── Zone d'Alimentation  #22C55E
│   ├── Corridors            #06B6D4
│   ├── Affûts Potentiels    #F5A623
│   └── Habitats Optimaux    #10B981
├── ▼ ZONES ENVIRONNEMENTALES (5)
│   ├── Ensoleillement       #FBBF24
│   ├── Orientation/Pentes   #A78BFA
│   ├── Hydrographie         #3B82F6
│   ├── Couvert Forestier    #059669
│   └── Zones Thermiques     #EF4444
├── ▼ ZONES STRATÉGIQUES (3)
│   ├── Hotspots             #FF6B6B
│   ├── Zones de Pression    #F59E0B
│   └── Points d'Accès       #6366F1
└── ▼ DONNÉES EXTERNES (4)
    ├── WMS Forêt
    ├── WMS Hydro
    ├── WMS Topo
    └── WMS Routes
```

### 3.2 Fonctionnalités Clés

- ✅ Toggle individuel par couche
- ✅ Toggle global par groupe
- ✅ Opacité globale ajustable
- ✅ Presets rapides (Rut, Repos, Alimentation, Tous)
- ✅ Raccourcis clavier (R, A, C, H, Shift+A, Shift+D)
- ✅ Légende dynamique contextuelle

---

## 4. IDENTITÉ VISUELLE BIONIC TACTICAL

### 4.1 Palette de Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| **Background** | `#0A0A0A` | Fond principal |
| **Card** | `#121212` | Cards, panneaux |
| **Border** | `#262626` | Bordures |
| **Gold** | `#F5A623` | Accent primaire |
| **Tactical** | `#10B981` | Accent secondaire |
| **Danger** | `#EF4444` | Alertes |
| **Text** | `#FAFAFA` | Texte principal |
| **Muted** | `#A3A3A3` | Texte secondaire |

### 4.2 Typographie

| Usage | Font | Style |
|-------|------|-------|
| Titres | Barlow Condensed | Uppercase, Bold |
| Corps | Inter | Regular |
| Données | JetBrains Mono | Monospace |

### 4.3 Composants Standardisés

- **Cards**: Glassmorphism HUD (`bg-black/60 backdrop-blur-xl`)
- **Boutons**: Uppercase, tracking-wider
- **Tables**: Border subtil, hover effect
- **Icônes**: Lucide React uniquement (pas d'emoji)

---

## 5. STRUCTURE i18n CENTRALISÉE

### 5.1 Architecture

```
/app/frontend/src/i18n/
├── index.js              # Provider + Hook + Selector
└── locales/
    ├── fr/
    │   └── common.json   # 150+ clés FR
    └── en/
        └── common.json   # 150+ clés EN
```

### 5.2 Catégories de Traductions

| Catégorie | Clés | Couverture |
|-----------|------|------------|
| Navigation | 17 | 100% |
| Common | 22 | 100% |
| Auth | 12 | 100% |
| Dashboard | 8 | 100% |
| Map | 13 | 100% |
| Zones | 19 | 100% |
| Species | 5 | 100% |
| Weather | 19 | 100% |
| Territory | 12 | 100% |
| Admin | 14 | 100% |
| Business | 7 | 100% |
| Errors | 7 | 100% |
| Success | 5 | 100% |
| **TOTAL** | **160** | **100%** |

### 5.3 Utilisation

```jsx
import { useTranslation, LanguageSelector } from '@/i18n';

function Component() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <p>{t('zones.rut')}</p>
      <LanguageSelector />
    </div>
  );
}
```

---

## 6. PLAN D'IMPLÉMENTATION UNIFIÉ

### Phase 1: Foundation (Priorité HAUTE)

| Tâche | Effort | Fichiers |
|-------|--------|----------|
| Intégrer i18n Provider dans App.js | 30min | App.js |
| Créer composants Design System | 2h | /design-system/ |
| Unifier navigation App.js | 1h | App.js |
| Corriger couleurs Admin | 30min | AdminPage.jsx |

### Phase 2: Carte (Priorité HAUTE)

| Tâche | Effort | Fichiers |
|-------|--------|----------|
| Créer BionicLayerPanel | 2h | TerritoryMap.jsx |
| Implémenter styles zones | 1h | TerritoryMap.jsx |
| Ajouter légende dynamique | 1h | TerritoryMap.jsx |
| Intégrer raccourcis clavier | 30min | TerritoryMap.jsx |

### Phase 3: Admin (Priorité MOYENNE)

| Tâche | Effort | Fichiers |
|-------|--------|----------|
| Remplacer emojis par Lucide | 1h | Admin*.jsx |
| Regrouper onglets Admin | 2h | AdminPage.jsx |
| Aligner AdminGeoPage | 1h | AdminGeoPage.jsx |

### Phase 4: Finitions (Priorité BASSE)

| Tâche | Effort | Fichiers |
|-------|--------|----------|
| Compléter traductions restantes | 1h | locales/*.json |
| Ajouter images gibier réalistes | 1h | Assets |
| Tests et validation | 2h | - |

---

## 7. CRITÈRES DE VALIDATION

### Navigation
- [ ] 7 onglets principaux (utilisateur)
- [ ] 10 onglets groupés (admin)
- [ ] Couleurs uniformes (#F5A623)
- [ ] Pas d'emoji dans navigation

### Couches Carte
- [ ] 4 groupes de couches
- [ ] 18 types de zones
- [ ] Toggle individuel/groupe
- [ ] Légende contextuelle
- [ ] Raccourcis clavier

### Identité Visuelle
- [ ] Dark mode (#0A0A0A)
- [ ] Palette Or/Vert Tactique
- [ ] Glassmorphism HUD
- [ ] Typographie uniforme

### i18n
- [ ] 100% couverture FR/EN
- [ ] Provider intégré
- [ ] Sélecteur de langue
- [ ] Persistance localStorage

---

## ⏳ EN ATTENTE DE VALIDATION FINALE

**Questions:**

1. **Le plan d'implémentation proposé est-il acceptable?**
2. **Faut-il prioriser la carte (Phase 2) avant l'admin (Phase 3)?**
3. **Souhaitez-vous que je commence l'implémentation immédiatement?**
4. **Y a-t-il des ajustements à apporter aux propositions?**

---

*Document généré le 11 Février 2026*  
*HUNTIQ V3 / BIONIC™ - Rapport d'Alignement Complet*
