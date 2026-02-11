# 🗺️ PROPOSITION - Cartes Premium BIONIC TACTICAL

**Date**: 11 Février 2026  
**Version**: 1.0  
**Statut**: EN ATTENTE DE VALIDATION  
**Auteur**: Agent E1  

---

## 📋 Résumé Exécutif

Cette proposition détaille l'implémentation de **7 types de cartes premium** pour les sections Carte et Territoire de HUNTIQ V3. Chaque carte est optimisée pour un usage terrain spécifique et s'intègre parfaitement au Design System BIONIC TACTICAL.

**Objectif**: Offrir une expérience cartographique professionnelle, immersive et adaptée aux besoins réels des chasseurs et gestionnaires de territoire.

---

## 🎯 Les 7 Cartes Premium

### 1. 🔶 CARTE PREMIUM BIONIC (Style Tactique)

**Description**: Carte propriétaire haute lisibilité conçue spécifiquement pour la chasse tactique.

| Caractéristique | Détail |
|-----------------|--------|
| **Style** | Fond sombre (#0A0A0A) avec contrastes élevés |
| **Palette** | Tons neutres (gris) + accents or (#F5A623) |
| **Relief** | Ombrage subtil avec orientation solaire |
| **Routes** | Hiérarchie claire (autoroutes → sentiers) |
| **Labels** | Typographie Barlow Condensed, uppercase |
| **Points d'intérêt** | Icônes minimalistes BIONIC |

**Avantages terrain**:
- Lisibilité maximale en conditions de faible luminosité
- Réduction de la fatigue oculaire lors d'usage prolongé
- Contraste optimal pour les zones BIONIC superposées

**Source technique**: Tiles personnalisés via Mapbox Studio ou tiles auto-hébergés

```
URL Pattern: /api/tiles/bionic/{z}/{x}/{y}.png
Style: Dark tactical avec accent #F5A623
```

---

### 2. 🌲 CARTE ÉCOFORESTIÈRE

**Description**: Carte spécialisée affichant les données forestières du Québec (MFFP).

| Caractéristique | Détail |
|-----------------|--------|
| **Coupes forestières** | Polygones datés avec couleur par année |
| **Peuplements** | Classification par type (résineux, feuillus, mixte) |
| **Essences dominantes** | Sapin, Épinette, Érable, Bouleau, etc. |
| **Âge des peuplements** | Gradient de couleur (jeune → mature) |
| **Densité canopée** | Pourcentage de couverture |

**Palette de couleurs Écoforestière**:
```css
--eco-resineux: #1B5E20;     /* Vert foncé */
--eco-feuillus: #FFB300;     /* Jaune-orange */
--eco-mixte: #7CB342;        /* Vert clair */
--eco-coupe-recente: #E53935; /* Rouge */
--eco-coupe-ancienne: #FFCC80; /* Orange pâle */
--eco-regeneration: #81C784;  /* Vert tendre */
```

**Source technique**: 
- WMS MFFP Québec (déjà intégré via EcoforestryLayers)
- Fallback: tiles pré-rendus si WMS indisponible

---

### 3. 🛰️ CARTE SATELLITE HAUTE RÉSOLUTION

**Description**: Imagerie satellite géoréférencée avec résolution optimale.

| Caractéristique | Détail |
|-----------------|--------|
| **Résolution** | 0.5m - 1m par pixel |
| **Millésime** | Été 2023-2024 (feuillage visible) |
| **Couverture** | Complète Québec + Ontario |
| **Options** | Satellite pur / Satellite + labels |

**Modes d'affichage**:
1. **Satellite Pure**: Aucun overlay, image brute
2. **Satellite Hybride**: Image + routes + labels blancs
3. **Satellite BIONIC**: Image + zones BIONIC + labels or

**Source technique**:
```
Primary: Mapbox Satellite Streets
Fallback: ESRI World Imagery
Alternative: Google Satellite (si licence)
```

**Optimisation mode sombre**:
- Labels en blanc avec halo noir
- Routes en jaune pâle (#FFF8E1)
- Zones BIONIC avec bordure lumineuse

---

### 4. 💧 CARTE IQHO (Hydrographie + Relief + Ombrage)

**Description**: Carte hydrologique intelligente combinant 3 couches pour une vision terrain complète.

| Composante | Détail |
|------------|--------|
| **Hydrographie** | Cours d'eau classés (permanent, intermittent, marécage) |
| **Relief** | Modèle numérique de terrain (MNT) 10m |
| **Ombrage** | Hillshade dynamique selon heure du jour |

**Palette IQHO**:
```css
--iqho-eau-profonde: #0D47A1;   /* Bleu foncé */
--iqho-eau-moyenne: #1976D2;    /* Bleu moyen */
--iqho-eau-peu-profonde: #42A5F5; /* Bleu clair */
--iqho-marecage: #4DB6AC;       /* Turquoise */
--iqho-riviere: #29B6F6;        /* Cyan */
--iqho-ruisseau: #81D4FA;       /* Bleu pâle */
--iqho-relief-bas: #2E7D32;     /* Vert vallée */
--iqho-relief-haut: #8D6E63;    /* Brun sommet */
```

**Caractéristiques avancées**:
- Ombrage adaptatif (matin: est illuminé / soir: ouest illuminé)
- Zones humides avec texture spéciale
- Lignes de crête mises en évidence

**Source technique**:
- MNT: SRTM 30m ou LiDAR Québec 1m
- Hydrographie: Base de données hydrographiques du Québec (BDHQ)

---

### 5. 📊 COURBES BATHYMÉTRIQUES

**Description**: Carte spécialisée pour les plans d'eau avec profondeurs détaillées.

| Caractéristique | Détail |
|-----------------|--------|
| **Courbes** | Intervalles 1m, 2m, 5m, 10m |
| **Zones colorées** | Gradient bleu selon profondeur |
| **Points profonds** | Marqueurs avec valeur en mètres |
| **Hauts-fonds** | Zones < 2m en surbrillance |
| **Obstacles** | Rochers, souches, structures |

**Palette Bathymétrique**:
```css
--bathy-0-2m: #B3E5FC;    /* Très peu profond - Cyan pâle */
--bathy-2-5m: #4FC3F7;    /* Peu profond - Cyan */
--bathy-5-10m: #0288D1;   /* Moyen - Bleu */
--bathy-10-20m: #01579B;  /* Profond - Bleu foncé */
--bathy-20m-plus: #0D47A1; /* Très profond - Marine */
--bathy-contour: #FFFFFF;  /* Lignes de contour */
```

**Usage chasse**:
- Identification des traversées de cervidés
- Zones d'abreuvement potentielles
- Points de chasse au gibier d'eau

**Source technique**:
- Données bathymétriques MFFP
- Navionics (si disponible)
- Données LiDAR subaquatique

---

### 6. 🛤️ RÉSEAU DE CHEMINS FORESTIERS

**Description**: Carte exhaustive des accès terrain (sentiers, chemins, routes forestières).

| Type de chemin | Style visuel |
|----------------|--------------|
| **Route forestière principale** | Ligne solide orange 3px |
| **Chemin secondaire** | Ligne tiretée orange 2px |
| **Sentier VTT/Quad** | Ligne pointillée jaune 1.5px |
| **Sentier pédestre** | Ligne fine verte 1px |
| **Accès privé** | Ligne rouge tiretée |
| **Chemin abandonné** | Ligne grise semi-transparente |

**Informations additionnelles**:
- État du chemin (bon, moyen, mauvais)
- Accessibilité saisonnière (été/hiver/4 saisons)
- Points de stationnement
- Barrières et accès restreints
- Distance depuis route principale

**Palette Chemins**:
```css
--chemin-principal: #FF9800;   /* Orange vif */
--chemin-secondaire: #FFB74D;  /* Orange pâle */
--chemin-vtt: #FFEB3B;         /* Jaune */
--chemin-pedestre: #4CAF50;    /* Vert */
--chemin-prive: #F44336;       /* Rouge */
--chemin-abandonne: #9E9E9E;   /* Gris */
```

**Source technique**:
- OpenStreetMap (chemins publics)
- Données MFFP (chemins forestiers)
- Contributions utilisateurs (chemins privés avec permission)

---

### 7. 📐 CARTE TOPOGRAPHIQUE AVANCÉE

**Description**: Carte topographique professionnelle avec courbes de niveau haute précision.

| Caractéristique | Détail |
|-----------------|--------|
| **Courbes principales** | Toutes les 10m, ligne épaisse |
| **Courbes secondaires** | Toutes les 2m, ligne fine |
| **Courbes index** | Toutes les 50m, annotées |
| **Points cotés** | Sommets et dépressions |
| **Pentes** | Gradient visuel (plat → abrupt) |

**Visualisation des pentes**:
```css
--pente-0-5: transparent;      /* Plat */
--pente-5-15: rgba(255,235,59,0.2);  /* Léger */
--pente-15-30: rgba(255,152,0,0.3);  /* Modéré */
--pente-30-45: rgba(244,67,54,0.4);  /* Abrupt */
--pente-45-plus: rgba(156,39,176,0.5); /* Très abrupt */
```

**Caractéristiques tactiques**:
- Lignes de crête en surbrillance
- Vallées et couloirs identifiés
- Exposition des versants (N/S/E/O)
- Zones de replat mises en évidence

**Source technique**:
- LiDAR Québec haute résolution
- SRTM avec interpolation
- Tiles TopoQuebec personnalisés

---

## 🎨 Intégration Design System BIONIC TACTICAL

### Sélecteur de Carte

**Composant**: `BionicMapSelector`

```
┌─────────────────────────────────────────────────────────────┐
│  🗺️ TYPE DE CARTE                                    [▼]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ 🔶      │  │ 🌲      │  │ 🛰️      │  │ 💧      │       │
│  │ BIONIC  │  │ ÉCO     │  │ SATELL  │  │ IQHO    │       │
│  │ PREMIUM │  │ FOREST  │  │ -ITE    │  │         │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ 📊      │  │ 🛤️      │  │ 📐      │                     │
│  │ BATHY   │  │ CHEMINS │  │ TOPO    │                     │
│  │ -MÉTRIE │  │ FOREST. │  │ AVANCÉ  │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                             │
│  ────────────────────────────────────────────────────      │
│  ⚙️ OPTIONS                                                │
│  ☑ Labels de terrain                                       │
│  ☑ Coordonnées GPS                                         │
│  ☐ Mode impression (haute résolution)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Style des Cartes Sélectionnées

```css
/* Carte sélectionnée */
.bionic-map-card-selected {
  border: 2px solid var(--bionic-gold);
  background: rgba(245, 166, 35, 0.1);
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
}

/* Carte au survol */
.bionic-map-card:hover {
  border-color: rgba(245, 166, 35, 0.5);
  transform: scale(1.02);
}

/* Badge Premium */
.bionic-map-premium-badge {
  background: linear-gradient(135deg, #F5A623 0%, #FF8F00 100%);
  color: black;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 2px;
}
```

---

## 🔗 Compatibilité avec les 14 Zones Avancées

Chaque carte premium doit permettre la superposition claire des zones BIONIC:

| Zone | Couleur | Opacité sur carte claire | Opacité sur carte sombre |
|------|---------|--------------------------|--------------------------|
| Rut | #FF4D6D | 25% | 35% |
| Repos | #8B5CF6 | 25% | 35% |
| Alimentation | #22C55E | 20% | 30% |
| Corridor | #06B6D4 | 20% | 30% |
| Affût | #F5A623 | 30% | 40% |
| Habitat | #10B981 | 15% | 25% |
| Soleil | #FCD34D | 15% | 25% |
| Pente | #A78BFA | 20% | 30% |
| Hydro | #3B82F6 | 20% | 30% |
| Forêt | #15803D | 20% | 30% |
| Thermique | #EF4444 | 25% | 35% |
| Hotspot | #FF6B6B | 35% | 45% |
| Pression | #F97316 | 20% | 30% |
| Accès | #8B5CF6 | 25% | 35% |

### Règles de superposition

1. **Contours toujours visibles**: Bordure 2px de la couleur de zone à 100% opacité
2. **Remplissage adaptatif**: Opacité ajustée selon le type de carte de fond
3. **Labels de zone**: Toujours en blanc avec halo noir pour lisibilité
4. **Priorité d'affichage**: Hotspots > Corridors > Zones comportementales > Zones environnementales

---

## 🌙 Optimisation Mode Sombre

Toutes les cartes respectent les principes du mode sombre BIONIC:

### Palette commune mode sombre

```css
:root {
  /* Fonds de carte */
  --map-bg-dark: #0A0A0A;
  --map-bg-secondary: #121212;
  
  /* Éléments cartographiques */
  --map-road-primary: #4A4A4A;
  --map-road-secondary: #333333;
  --map-water-dark: #1A237E;
  --map-forest-dark: #1B3D1B;
  --map-label-dark: #E0E0E0;
  --map-label-halo: rgba(0, 0, 0, 0.8);
  
  /* Accents */
  --map-highlight: #F5A623;
  --map-selection: rgba(245, 166, 35, 0.3);
}
```

### Adaptation par type de carte

| Carte | Adaptation mode sombre |
|-------|----------------------|
| BIONIC Premium | Native sombre, aucune adaptation |
| Écoforestière | Saturation -20%, luminosité -30% |
| Satellite | Contraste +10%, labels blancs |
| IQHO | Fond #0D1421, eau lumineuse |
| Bathymétrie | Gradient bleu plus profond |
| Chemins | Chemins lumineux sur fond sombre |
| Topographique | Courbes dorées, fond #1A1A1A |

---

## 📍 Lecture Optimale des Points Chauds

### Style des hotspots par carte

```css
/* Hotspot standard */
.hotspot-marker {
  background: radial-gradient(circle, #FF6B6B 0%, transparent 70%);
  animation: hotspot-pulse 2s ease-in-out infinite;
}

/* Hotspot sur carte satellite */
.satellite .hotspot-marker {
  border: 3px solid white;
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.8);
}

/* Hotspot sur carte BIONIC */
.bionic-premium .hotspot-marker {
  border: 2px solid #F5A623;
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.6);
}

@keyframes hotspot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
```

### Hiérarchie visuelle des points

1. **Score 90-100%**: Icône grande (32px), pulsation rapide, halo doré
2. **Score 75-89%**: Icône moyenne (24px), pulsation normale, halo orange
3. **Score 60-74%**: Icône petite (18px), pulsation lente, halo jaune
4. **Score <60%**: Icône minimale (14px), statique, sans halo

---

## 🏗️ Architecture Technique Proposée

### Structure des fichiers

```
/app/frontend/src/
├── components/
│   └── maps/
│       ├── BionicMapSelector.jsx      # Sélecteur de cartes
│       ├── MapTypeCard.jsx            # Carte individuelle
│       ├── layers/
│       │   ├── BionicPremiumLayer.jsx
│       │   ├── EcoforestryLayer.jsx   # Existant, à améliorer
│       │   ├── SatelliteLayer.jsx
│       │   ├── IQHOLayer.jsx
│       │   ├── BathymetryLayer.jsx
│       │   ├── ForestRoadsLayer.jsx
│       │   └── TopoAdvancedLayer.jsx
│       └── styles/
│           └── map-themes.css
├── hooks/
│   └── useMapType.js                  # Hook de gestion du type de carte
└── config/
    └── mapSources.js                  # URLs et configuration des sources
```

### Hook `useMapType`

```javascript
const useMapType = () => {
  const [mapType, setMapType] = useState('bionic-premium');
  const [mapOptions, setMapOptions] = useState({
    labels: true,
    coordinates: true,
    highRes: false
  });
  
  return {
    mapType,
    setMapType,
    mapOptions,
    setMapOptions,
    getLayerConfig: () => MAP_CONFIGS[mapType],
    isDarkOptimized: () => DARK_OPTIMIZED_MAPS.includes(mapType)
  };
};
```

---

## 📊 Sources de Données

| Carte | Source principale | Source fallback | Licence |
|-------|-------------------|-----------------|---------|
| BIONIC Premium | Tiles auto-hébergés | Mapbox Dark | Propriétaire |
| Écoforestière | WMS MFFP | Tiles pré-rendus | Données ouvertes QC |
| Satellite | Mapbox Satellite | ESRI World Imagery | Commercial |
| IQHO | WMS Géoboutique | SRTM + OSM | Données ouvertes |
| Bathymétrie | Données MFFP | Navionics API | Commercial |
| Chemins | OSM + MFFP | Tiles OSM | Open Data |
| Topographique | LiDAR QC | SRTM | Données ouvertes |

---

## 🚀 Plan d'Implémentation

### Phase 1 - Fondations (Sprint 1)
- [ ] Créer composant `BionicMapSelector`
- [ ] Implémenter hook `useMapType`
- [ ] Intégrer sélecteur dans pages Carte et Territoire
- [ ] Carte BIONIC Premium (style personnalisé)

### Phase 2 - Cartes Existantes (Sprint 2)
- [ ] Améliorer EcoforestryLayer existant
- [ ] Ajouter mode Satellite amélioré
- [ ] Optimiser pour mode sombre

### Phase 3 - Cartes Spécialisées (Sprint 3)
- [ ] Implémenter IQHO Layer
- [ ] Ajouter Bathymétrie (si données disponibles)
- [ ] Intégrer Chemins Forestiers

### Phase 4 - Finitions (Sprint 4)
- [ ] Carte Topographique Avancée
- [ ] Tests de performance
- [ ] Optimisation mobile
- [ ] Documentation utilisateur

---

## ✅ Critères de Validation

- [ ] Chaque carte s'affiche correctement dans Carte et Territoire
- [ ] Le sélecteur est intuitif et répond au Design System BIONIC
- [ ] Les 14 zones sont lisibles sur chaque type de carte
- [ ] Le mode sombre est cohérent sur toutes les cartes
- [ ] Les hotspots sont clairement identifiables
- [ ] Performance acceptable (< 2s chargement initial)
- [ ] Fallback fonctionnel si source principale indisponible

---

## 📝 Questions pour Validation

1. **Priorité des cartes**: Quel ordre d'implémentation préférez-vous?
2. **Sources bathymétriques**: Avez-vous accès à des données bathymétriques spécifiques?
3. **Chemins privés**: Souhaitez-vous une fonctionnalité de contribution utilisateur?
4. **Mode impression**: Est-ce une fonctionnalité prioritaire?
5. **Tiles hébergés**: Préférez-vous Mapbox, auto-hébergement, ou hybride?

---

*Document préparé pour HUNTIQ V3 / BIONIC™*  
*En attente de validation avant implémentation*
