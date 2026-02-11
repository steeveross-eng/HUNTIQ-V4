# 🗺️ PROPOSITION AFFICHAGE AVANCÉ DES ZONES
## HUNTIQ V3 / BIONIC™

**Date:** 11 Février 2026  
**Phase:** Conception Technique  
**Statut:** EN ATTENTE DE VALIDATION

---

## 1. OBJECTIF

Permettre une lecture cartographique **scientifique, précise et intuitive** des zones critiques du territoire, avec un système d'activation/désactivation fluide et une hiérarchie visuelle claire.

---

## 2. INVENTAIRE DES ZONES À AFFICHER

### 2.1 Zones Comportementales (Analyse Faune)

| Zone | Description | Forme | Priorité |
|------|-------------|-------|----------|
| **Zone de Rut** | Aires d'activité reproductrice | Polygone | 🔴 HAUTE |
| **Zone de Repos** | Zones de couchage et refuge | Polygone/Cercle | 🔴 HAUTE |
| **Zone d'Alimentation** | Sources de nourriture | Polygone | 🔴 HAUTE |
| **Corridors de Déplacement** | Trajets habituels | Polyline | 🔴 HAUTE |
| **Affûts Potentiels** | Points d'embuscade optimaux | Point/Cercle | 🟡 MOYENNE |
| **Habitats Optimaux** | Zones à haute densité | Polygone | 🟡 MOYENNE |

### 2.2 Zones Environnementales (Terrain)

| Zone | Description | Forme | Priorité |
|------|-------------|-------|----------|
| **Ensoleillement** | Exposition solaire (S/SE) | Polygone | 🟡 MOYENNE |
| **Orientation/Pentes** | Relief favorable | Gradient | 🟡 MOYENNE |
| **Hydrographie** | Cours d'eau, zones humides | Polyline/Polygone | 🟡 MOYENNE |
| **Couvert Forestier** | Densité végétale | Polygone | 🟢 BASSE |
| **Zones Thermiques** | Microclimats favorables | Gradient | 🟢 BASSE |

### 2.3 Zones Stratégiques (Chasse)

| Zone | Description | Forme | Priorité |
|------|-------------|-------|----------|
| **Points Chauds (Hotspots)** | Zones à haute activité | Cercle + Gradient | 🔴 HAUTE |
| **Zones de Pression** | Densité chasseurs | Polygone | 🟡 MOYENNE |
| **Points d'Accès** | Entrées territoire | Point | 🟢 BASSE |

---

## 3. PALETTE DE COULEURS BIONIC TACTICAL

### 3.1 Couleurs par Type de Zone

```css
/* === ZONES COMPORTEMENTALES === */
--zone-rut: #FF4D6D;           /* Rouge rosé - Activité reproductrice */
--zone-rut-fill: rgba(255, 77, 109, 0.25);

--zone-repos: #8B5CF6;         /* Violet - Repos/Refuge */
--zone-repos-fill: rgba(139, 92, 246, 0.25);

--zone-alimentation: #22C55E;  /* Vert vif - Alimentation */
--zone-alimentation-fill: rgba(34, 197, 94, 0.25);

--zone-corridor: #06B6D4;      /* Cyan - Corridors */
--zone-corridor-stroke: 3px dashed;

--zone-affut: #F5A623;         /* Or BIONIC - Affûts */
--zone-affut-fill: rgba(245, 166, 35, 0.35);

--zone-habitat: #10B981;       /* Vert tactique - Habitats */
--zone-habitat-fill: rgba(16, 185, 129, 0.20);

/* === ZONES ENVIRONNEMENTALES === */
--zone-soleil: #FBBF24;        /* Jaune doré - Ensoleillement */
--zone-soleil-fill: rgba(251, 191, 36, 0.20);

--zone-pente: #A78BFA;         /* Lavande - Orientation */
--zone-pente-fill: rgba(167, 139, 250, 0.15);

--zone-hydro: #3B82F6;         /* Bleu - Hydrographie */
--zone-hydro-stroke: 2px solid;

--zone-foret: #059669;         /* Vert forêt - Couvert */
--zone-foret-fill: rgba(5, 150, 105, 0.15);

--zone-thermique: #EF4444;     /* Rouge - Thermique */
--zone-thermique-gradient: radial-gradient;

/* === ZONES STRATÉGIQUES === */
--zone-hotspot: #FF6B6B;       /* Rouge corail - Points chauds */
--zone-hotspot-glow: 0 0 20px rgba(255, 107, 107, 0.6);

--zone-pression: #F59E0B;      /* Ambre - Pression chasse */
--zone-pression-fill: rgba(245, 158, 11, 0.20);

--zone-acces: #6366F1;         /* Indigo - Points d'accès */
```

### 3.2 Hiérarchie Visuelle (Z-Index)

```
Z-INDEX LAYERS (du plus bas au plus haut):
─────────────────────────────────────────
100: Fond de carte (tuiles)
200: Zones environnementales (forêt, hydro)
300: Zones comportementales (habitat, alimentation)
400: Corridors de déplacement
500: Zones d'activité (rut, repos)
600: Hotspots et points chauds
700: Affûts potentiels
800: Waypoints utilisateur
900: Marqueurs GPS actifs
```

---

## 4. SYSTÈME D'ACTIVATION/DÉSACTIVATION

### 4.1 Architecture du Panneau de Couches

```
┌────────────────────────────────────────────────────────┐
│  🗺️ COUCHES BIONIC                           [−] [×]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ▼ ZONES COMPORTEMENTALES                    [👁 ALL] │
│  ├─ [●] Zone de Rut              🔴 ━━━━━━━━━━━ [👁]  │
│  ├─ [●] Zone de Repos            🟣 ━━━━━━━━━━━ [👁]  │
│  ├─ [●] Zone d'Alimentation      🟢 ━━━━━━━━━━━ [👁]  │
│  ├─ [●] Corridors                🔵 ━━━━━━━━━━━ [👁]  │
│  ├─ [○] Affûts Potentiels        🟡 ━━━━━━━━━━━ [👁]  │
│  └─ [○] Habitats Optimaux        🟢 ━━━━━━━━━━━ [👁]  │
│                                                        │
│  ▼ ZONES ENVIRONNEMENTALES                   [👁 ALL] │
│  ├─ [○] Ensoleillement           ☀️ ━━━━━━━━━━━ [👁]  │
│  ├─ [○] Orientation/Pentes       ⛰️ ━━━━━━━━━━━ [👁]  │
│  ├─ [●] Hydrographie             💧 ━━━━━━━━━━━ [👁]  │
│  ├─ [○] Couvert Forestier        🌲 ━━━━━━━━━━━ [👁]  │
│  └─ [○] Zones Thermiques         🌡️ ━━━━━━━━━━━ [👁]  │
│                                                        │
│  ▼ ZONES STRATÉGIQUES                        [👁 ALL] │
│  ├─ [●] Hotspots                 🔥 ━━━━━━━━━━━ [👁]  │
│  ├─ [○] Zones de Pression        👥 ━━━━━━━━━━━ [👁]  │
│  └─ [○] Points d'Accès           🚪 ━━━━━━━━━━━ [👁]  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ⚙️ OPACITÉ: ━━━━━━━━●━━━━━━━━ 75%                    │
│  🎯 FOCUS: [Rut] [Repos] [Alimentation] [Tous]        │
└────────────────────────────────────────────────────────┘
```

### 4.2 Comportements d'Activation

| Action | Comportement |
|--------|--------------|
| **Clic sur [●]/[○]** | Toggle couche individuelle |
| **Clic sur [👁 ALL]** | Toggle toutes les couches du groupe |
| **Hover sur ligne** | Highlight temporaire de la zone sur la carte |
| **Clic sur nom** | Zoom sur l'étendue de la zone |
| **Drag & Drop** | Réorganiser l'ordre des couches |

### 4.3 Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `R` | Toggle zones de Rut |
| `A` | Toggle zones d'Alimentation |
| `C` | Toggle Corridors |
| `H` | Toggle Hotspots |
| `Shift+A` | Activer toutes les couches |
| `Shift+D` | Désactiver toutes les couches |
| `1-9` | Presets de couches |

---

## 5. DÉLIMITATION VISUELLE PRÉCISE

### 5.1 Styles de Contours par Type

```jsx
// Configuration des styles de zones
const ZONE_STYLES = {
  // === ZONES COMPORTEMENTALES ===
  rut: {
    stroke: true,
    color: '#FF4D6D',
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: '#FF4D6D',
    fillOpacity: 0.25,
    dashArray: null,
    className: 'zone-rut animate-pulse-subtle'
  },
  
  repos: {
    stroke: true,
    color: '#8B5CF6',
    weight: 2,
    opacity: 0.9,
    fill: true,
    fillColor: '#8B5CF6',
    fillOpacity: 0.2,
    dashArray: '5, 5',
    className: 'zone-repos'
  },
  
  alimentation: {
    stroke: true,
    color: '#22C55E',
    weight: 2,
    opacity: 0.9,
    fill: true,
    fillColor: '#22C55E',
    fillOpacity: 0.2,
    dashArray: null,
    className: 'zone-alimentation'
  },
  
  corridor: {
    stroke: true,
    color: '#06B6D4',
    weight: 4,
    opacity: 0.9,
    fill: false,
    dashArray: '10, 6',
    lineCap: 'round',
    lineJoin: 'round',
    className: 'zone-corridor animate-flow'
  },
  
  affut: {
    stroke: true,
    color: '#F5A623',
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: '#F5A623',
    fillOpacity: 0.35,
    dashArray: null,
    className: 'zone-affut glow-gold'
  },
  
  habitat: {
    stroke: true,
    color: '#10B981',
    weight: 1.5,
    opacity: 0.7,
    fill: true,
    fillColor: '#10B981',
    fillOpacity: 0.15,
    dashArray: '2, 4',
    className: 'zone-habitat'
  },
  
  // === ZONES ENVIRONNEMENTALES ===
  soleil: {
    stroke: false,
    fill: true,
    fillColor: '#FBBF24',
    fillOpacity: 0.2,
    className: 'zone-soleil gradient-radial'
  },
  
  hydro: {
    stroke: true,
    color: '#3B82F6',
    weight: 2,
    opacity: 0.8,
    fill: true,
    fillColor: '#3B82F6',
    fillOpacity: 0.1,
    className: 'zone-hydro'
  },
  
  // === ZONES STRATÉGIQUES ===
  hotspot: {
    stroke: true,
    color: '#FF6B6B',
    weight: 2,
    opacity: 1,
    fill: true,
    fillColor: '#FF6B6B',
    fillOpacity: 0.3,
    className: 'zone-hotspot glow-red animate-pulse'
  },
  
  pression: {
    stroke: true,
    color: '#F59E0B',
    weight: 1.5,
    opacity: 0.6,
    fill: true,
    fillColor: '#F59E0B',
    fillOpacity: 0.15,
    dashArray: '3, 3',
    className: 'zone-pression'
  }
};
```

### 5.2 Animations CSS

```css
/* Animations BIONIC pour zones */

/* Pulsation subtile pour zones actives */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

/* Effet de flux pour corridors */
@keyframes flow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 32; }
}

.animate-flow {
  animation: flow 2s linear infinite;
}

/* Effet glow pour hotspots */
.glow-red {
  filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.6));
}

.glow-gold {
  filter: drop-shadow(0 0 6px rgba(245, 166, 35, 0.5));
}

/* Transition hover */
.zone-layer {
  transition: all 0.3s ease;
}

.zone-layer:hover {
  filter: brightness(1.2);
  stroke-width: calc(var(--stroke-width) + 1px);
}
```

---

## 6. PANNEAU DE COUCHES OPTIMISÉ

### 6.1 Structure de Groupes

```jsx
const LAYER_GROUPS = {
  behavioral: {
    id: 'behavioral',
    label: 'Zones Comportementales',
    icon: Target,
    priority: 1,
    defaultExpanded: true,
    layers: ['rut', 'repos', 'alimentation', 'corridor', 'affut', 'habitat']
  },
  environmental: {
    id: 'environmental',
    label: 'Zones Environnementales',
    icon: TreePine,
    priority: 2,
    defaultExpanded: false,
    layers: ['soleil', 'pente', 'hydro', 'foret', 'thermique']
  },
  strategic: {
    id: 'strategic',
    label: 'Zones Stratégiques',
    icon: Crosshair,
    priority: 3,
    defaultExpanded: true,
    layers: ['hotspot', 'pression', 'acces']
  },
  data: {
    id: 'data',
    label: 'Données Externes',
    icon: Database,
    priority: 4,
    defaultExpanded: false,
    layers: ['wms_foret', 'wms_hydro', 'wms_topo', 'wms_routes']
  }
};
```

### 6.2 Composant LayerPanel

```jsx
// Composant panneau de couches BIONIC
const BionicLayerPanel = ({ 
  layers, 
  visibility, 
  onToggle, 
  onToggleGroup,
  opacity,
  onOpacityChange 
}) => {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border border-white/10 w-80">
      <CardHeader className="border-b border-white/10 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-bionic-gold" />
            Couches BIONIC
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Minus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 max-h-[60vh] overflow-y-auto">
        {Object.entries(LAYER_GROUPS).map(([groupId, group]) => (
          <LayerGroup
            key={groupId}
            group={group}
            layers={layers}
            visibility={visibility}
            onToggle={onToggle}
            onToggleGroup={onToggleGroup}
          />
        ))}
        
        {/* Contrôle d'opacité global */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <Label className="text-xs text-gray-400 uppercase tracking-wider">
            Opacité globale
          </Label>
          <div className="flex items-center gap-3 mt-2">
            <Slider
              value={[opacity]}
              onValueChange={([val]) => onOpacityChange(val)}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-white text-sm font-mono w-12">
              {opacity}%
            </span>
          </div>
        </div>
        
        {/* Presets rapides */}
        <div className="mt-3">
          <Label className="text-xs text-gray-400 uppercase tracking-wider">
            Presets
          </Label>
          <div className="flex flex-wrap gap-1 mt-2">
            <Button size="sm" variant="outline" className="text-xs h-7">
              Rut
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              Repos
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              Alimentation
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              Tous
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 7. LÉGENDE DYNAMIQUE

### 7.1 Légende Contextuelle

```
┌────────────────────────────────────────┐
│  📊 LÉGENDE                            │
├────────────────────────────────────────┤
│  ━━━ Zone de Rut (haute activité)      │
│  ━ ━ Zone de Repos                     │
│  ━━━ Zone d'Alimentation               │
│  ╌╌╌ Corridor de déplacement           │
│  ● ● Hotspot (densité élevée)          │
│  ○ ○ Affût potentiel                   │
├────────────────────────────────────────┤
│  Intensité: ░░▒▒▓▓██                   │
│  Basse ─────────────── Haute           │
└────────────────────────────────────────┘
```

### 7.2 Tooltips Enrichis

```jsx
// Tooltip pour zone survolée
const ZoneTooltip = ({ zone }) => (
  <div className="bg-black/90 p-3 rounded-md border border-white/20 min-w-[200px]">
    <div className="flex items-center gap-2 mb-2">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: zone.color }}
      />
      <span className="text-white font-semibold">{zone.label}</span>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="text-gray-400">Surface:</span>
        <span className="text-white ml-1">{zone.area} km²</span>
      </div>
      <div>
        <span className="text-gray-400">Score:</span>
        <span className="text-white ml-1">{zone.score}/100</span>
      </div>
      <div>
        <span className="text-gray-400">Activité:</span>
        <Badge variant={zone.activity > 70 ? 'success' : 'warning'}>
          {zone.activity}%
        </Badge>
      </div>
      <div>
        <span className="text-gray-400">Dernière obs:</span>
        <span className="text-white ml-1">{zone.lastSeen}</span>
      </div>
    </div>
    
    {zone.recommendations && (
      <div className="mt-2 pt-2 border-t border-white/10">
        <span className="text-bionic-gold text-xs">💡 {zone.recommendations}</span>
      </div>
    )}
  </div>
);
```

---

## 8. INTÉGRATION AVEC ANALYSE BIONIC

### 8.1 Génération Automatique de Zones

```jsx
// Génération de zones basée sur l'analyse BIONIC
const generateZonesFromAnalysis = (analysisResult) => {
  const zones = [];
  
  // Zones de rut basées sur ThermalScore + comportement
  if (analysisResult.modules?.ThermalScore?.score > 60) {
    zones.push({
      type: 'rut',
      geometry: generatePolygonFromHeatmap(analysisResult.heatmap, 'thermal'),
      confidence: analysisResult.modules.ThermalScore.confidence
    });
  }
  
  // Zones d'alimentation basées sur FoodScore
  if (analysisResult.modules?.FoodScore?.score > 50) {
    zones.push({
      type: 'alimentation',
      geometry: generatePolygonFromHeatmap(analysisResult.heatmap, 'food'),
      confidence: analysisResult.modules.FoodScore.confidence
    });
  }
  
  // Corridors basés sur CorridorScore
  if (analysisResult.modules?.CorridorScore?.score > 40) {
    zones.push({
      type: 'corridor',
      geometry: generatePolylineFromPath(analysisResult.corridors),
      confidence: analysisResult.modules.CorridorScore.confidence
    });
  }
  
  return zones;
};
```

---

## 9. PERFORMANCE ET OPTIMISATION

### 9.1 Stratégies d'Optimisation

| Technique | Application |
|-----------|-------------|
| **Clustering** | Regrouper les zones proches à faible zoom |
| **Level of Detail** | Simplifier géométries à faible zoom |
| **Lazy Loading** | Charger zones uniquement dans viewport |
| **Canvas Rendering** | Utiliser Canvas pour > 500 polygones |
| **Web Workers** | Calculs de zones en arrière-plan |

### 9.2 Limites de Performance

```javascript
const PERFORMANCE_LIMITS = {
  maxPolygonsRender: 200,      // Max polygones simultanés
  maxPointsPerPolygon: 100,    // Simplification automatique au-delà
  debounceZoom: 150,           // ms avant recalcul
  clusterThreshold: 12,        // Zoom level pour clustering
  canvasFallbackThreshold: 500 // Basculer vers Canvas
};
```

---

## 10. MAQUETTE FINALE

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  🗺️ CARTE BIONIC                                                    [−] [□] [×] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   ┌─────────────┐                                                                 │
│   │ 📊 COUCHES  │     ╔═══════════════════════════════════════════╗              │
│   ├─────────────┤     ║                                           ║              │
│   │ ▼ COMPORTEM.│     ║    ┌────────────────────┐                 ║              │
│   │ [●] Rut     │     ║    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  Zone Rut       ║              │
│   │ [●] Repos   │     ║    │▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓▓│                 ║              │
│   │ [●] Alim.   │     ║    └────────────────────┘                 ║              │
│   │ [●] Corr.   │     ║           ╲                               ║              │
│   │             │     ║            ╲  Corridor                    ║              │
│   │ ▼ ENVIRON.  │     ║             ╲                             ║              │
│   │ [○] Soleil  │     ║    ┌─────────╲──────────┐                 ║              │
│   │ [●] Hydro   │     ║    │░░░░░░░░░░░░░░░░░░░│  Zone Alim.     ║              │
│   │ [○] Forêt   │     ║    │░░░░░🦌░░░░░░░░░░░░│                 ║              │
│   │             │     ║    └────────────────────┘                 ║              │
│   │ ▼ STRATÉG.  │     ║                                           ║              │
│   │ [●] Hotspot │     ║         ◉ Hotspot (85%)                   ║              │
│   │ [○] Pression│     ║                                           ║              │
│   │             │     ╚═══════════════════════════════════════════╝              │
│   │ ───────────│                                                                 │
│   │ Opacité:75%│     ┌────────────────────────────────────────────┐              │
│   └─────────────┘     │ 📊 LÉGENDE                                 │              │
│                       │ ━━━ Rut  ━ ━ Repos  ━━━ Alim.  ╌╌ Corr.   │              │
│                       └────────────────────────────────────────────┘              │
│                                                                                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [🔍+] [🔍-] [📍] [🎯]                                     Zoom: 14 | Lat: 46.8 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. LIVRABLES

| Livrable | Statut |
|----------|--------|
| Proposition affichage zones | ✅ CE DOCUMENT |
| Palette couleurs BIONIC | ✅ Définie |
| Styles de zones (Leaflet) | ✅ Définis |
| Architecture panneau couches | ✅ Conçue |
| Maquette interface | ✅ Créée |
| Animations CSS | ✅ Définies |
| Intégration BIONIC Analysis | ✅ Conçue |
| Implémentation | ⏳ EN ATTENTE |

---

## ⏳ EN ATTENTE DE VALIDATION

**Questions:**
1. La palette de couleurs proposée convient-elle?
2. La hiérarchie des groupes de couches est-elle correcte?
3. Faut-il ajouter d'autres types de zones?
4. Les animations sont-elles appropriées ou trop distrayantes?

---

*Document généré le 11 Février 2026*  
*HUNTIQ V3 / BIONIC™ - Proposition Affichage Avancé des Zones*
