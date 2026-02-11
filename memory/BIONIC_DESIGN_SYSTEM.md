# BIONIC DESIGN SYSTEM - Documentation
## Version 1.0.0 | 11 Février 2026

---

# 1. VUE D'ENSEMBLE

Le Design System BIONIC est la **source unique de vérité** pour tous les aspects visuels et structurels de l'application HUNTIQ V3. Son application est **obligatoire** et **sans exception**.

## Fichiers du Design System

| Fichier | Description |
|---------|-------------|
| `/src/styles/bionic-design-system.css` | Variables CSS globales |
| `/src/config/bionic-icons.js` | Mapping des icônes Lucide |
| `/src/config/bionic-colors.js` | Palette de couleurs JS |
| `/src/config/bionic-config.js` | Types, labels, options centralisés |

---

# 2. PALETTE TACTIQUE

## 2.1 Couleurs Primaires

### Noir (Backgrounds)
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-black-pure` | `#000000` | Background principal |
| `--bionic-black-deep` | `#0a0a0a` | Background profond |
| `--bionic-black-base` | `#121212` | Background standard |
| `--bionic-black-elevated` | `#1a1a1a` | Cards, surfaces élevées |

### Gris Scientifique
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-gray-900` | `#1a1a1a` | Surfaces |
| `--bionic-gray-800` | `#2a2a2a` | Bordures |
| `--bionic-gray-700` | `#3a3a3a` | Bordures actives |
| `--bionic-gray-500` | `#6a6a6a` | Texte désactivé |
| `--bionic-gray-400` | `#8a8a8a` | Texte secondaire |

### Jaune Analytique (Accent Principal)
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-gold-primary` | `#F5A623` | Accent principal |
| `--bionic-gold-light` | `#FBBF24` | Hover states |
| `--bionic-gold-dark` | `#D4890E` | Active states |
| `--bionic-gold-muted` | `rgba(245,166,35,0.1)` | Backgrounds accentués |

### Bleu Analytique
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-blue-primary` | `#1E40AF` | Données, liens |
| `--bionic-blue-light` | `#3B82F6` | Informations |
| `--bionic-blue-muted` | `rgba(59,130,246,0.1)` | Backgrounds info |

### Vert Tactique
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-green-primary` | `#10B981` | Succès, positif |
| `--bionic-green-light` | `#34D399` | Hover success |
| `--bionic-green-muted` | `rgba(16,185,129,0.1)` | Backgrounds success |

### Rouge Alerte
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-red-primary` | `#EF4444` | Erreurs, alertes |
| `--bionic-red-light` | `#F87171` | Hover error |
| `--bionic-red-muted` | `rgba(239,68,68,0.1)` | Backgrounds error |

---

# 3. TYPOGRAPHIE

## Police: Inter

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

## Tailles

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-text-xs` | `0.75rem` (12px) | Labels, badges |
| `--bionic-text-sm` | `0.875rem` (14px) | Texte secondaire |
| `--bionic-text-base` | `1rem` (16px) | Texte principal |
| `--bionic-text-lg` | `1.125rem` (18px) | Sous-titres |
| `--bionic-text-xl` | `1.25rem` (20px) | Titres section |
| `--bionic-text-2xl` | `1.5rem` (24px) | Titres page |
| `--bionic-text-4xl` | `2.25rem` (36px) | Titres hero |

## Poids

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bionic-font-normal` | `400` | Texte courant |
| `--bionic-font-medium` | `500` | Labels |
| `--bionic-font-semibold` | `600` | Sous-titres |
| `--bionic-font-bold` | `700` | Titres |

---

# 4. ICÔNES

## Règle Absolue
**AUCUN EMOJI AUTORISÉ** dans le code. Utiliser **uniquement Lucide React**.

## Import
```javascript
import { BIONIC_ICONS, TERRITORY_ICONS, WEATHER_ICONS } from '@/config/bionic-icons';
```

## Mapping Principal

| Catégorie | Icônes disponibles |
|-----------|-------------------|
| Navigation | `target`, `menu`, `close`, `search`, `filter`, `settings` |
| CRUD | `add`, `remove`, `edit`, `delete`, `save`, `download` |
| Status | `success`, `error`, `warning`, `info`, `loading` |
| Météo | `clear`, `cloudy`, `rain`, `snow`, `wind`, `temperature` |
| Territoire | `hunting`, `camera`, `feeding`, `observation`, `blind` |
| Commerce | `cart`, `package`, `dollar`, `percent`, `star` |

## Remplacement d'emoji

```javascript
import { getIconForEmoji } from '@/config/bionic-icons';

// Avant (INTERDIT)
<span>🎯</span>

// Après (CORRECT)
const IconComponent = getIconForEmoji('🎯');
<IconComponent className="h-5 w-5" />
```

---

# 5. CONFIGURATIONS CENTRALISÉES

## Types de Lieux (PLACE_TYPES)
```javascript
import { PLACE_TYPES, getPlaceType } from '@/config/bionic-config';

// Utilisation
const placeType = getPlaceType('zec');
<placeType.Icon className="h-5 w-5" style={{ color: placeType.color }} />
```

## Types de Waypoints (WAYPOINT_TYPES)
```javascript
import { WAYPOINT_TYPES, getWaypointType } from '@/config/bionic-config';
```

## Zones Avancées (ADVANCED_ZONE_TYPES)
```javascript
import { ADVANCED_ZONE_TYPES, getZoneType } from '@/config/bionic-config';
```

---

# 6. CLASSES UTILITAIRES

## Texte Doré
```html
<h1 className="bionic-text-gold">Titre doré</h1>
<h1 className="bionic-text-gradient">Titre gradient</h1>
```

## Cards
```html
<div className="bionic-card">Card standard</div>
<div className="bionic-card-elevated">Card élevée</div>
```

## Badges
```html
<span className="bionic-badge bionic-badge-success">Succès</span>
<span className="bionic-badge bionic-badge-warning">Attention</span>
<span className="bionic-badge bionic-badge-error">Erreur</span>
<span className="bionic-badge bionic-badge-info">Info</span>
```

## Boutons
```html
<button className="bionic-btn bionic-btn-primary">Principal</button>
<button className="bionic-btn bionic-btn-secondary">Secondaire</button>
```

---

# 7. RÈGLES OBLIGATOIRES

## ✅ À FAIRE

1. **Couleurs** : Utiliser uniquement les variables CSS du Design System
2. **Icônes** : Utiliser uniquement Lucide React via `bionic-icons.js`
3. **Textes** : Utiliser la fonction `t()` pour tous les textes affichés
4. **Types** : Importer depuis `bionic-config.js` pour tous les types/options
5. **Styles** : Utiliser les classes utilitaires BIONIC quand disponibles

## ❌ INTERDIT

1. **Emojis** : Aucun emoji dans le code JSX/JS
2. **Couleurs hardcodées** : Pas de `#XXXXXX` direct dans les composants
3. **Textes français hardcodés** : Tout doit passer par i18n
4. **Définitions locales** : Pas de PLACE_TYPES, WAYPOINT_TYPES locaux
5. **Styles inline** : Éviter `style={{}}` quand possible

---

# 8. CHECKLIST PRE-COMMIT

Avant chaque commit, vérifier :

- [ ] Aucun emoji dans le fichier
- [ ] Couleurs via variables CSS ou `bionic-colors.js`
- [ ] Icônes via `bionic-icons.js`
- [ ] Textes via `t()` (LanguageContext)
- [ ] Types via `bionic-config.js`
- [ ] Tests visuels FR et EN

---

# 9. MIGRATION DES ANCIENS COMPOSANTS

## Étape 1: Remplacer les emojis
```javascript
// Avant
<span className="text-4xl">🎯</span>

// Après
import { Target } from 'lucide-react';
<Target className="h-10 w-10 text-bionic-gold-primary" />
```

## Étape 2: Centraliser les types
```javascript
// Avant (INTERDIT)
const PLACE_TYPES = [
  { id: 'zec', name: 'ZEC', icon: '🏕️', color: '#22c55e' },
  ...
];

// Après (CORRECT)
import { PLACE_TYPES } from '@/config/bionic-config';
```

## Étape 3: Traduire les textes
```javascript
// Avant
<p>Chargement...</p>

// Après
import { useLanguage } from '@/contexts/LanguageContext';
const { t } = useLanguage();
<p>{t('common_loading')}</p>
```

---

*BIONIC Design System v1.0.0 - HUNTIQ V3*
*Aucune modification locale autorisée*
