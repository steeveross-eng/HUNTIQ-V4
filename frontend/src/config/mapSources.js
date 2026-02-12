/**
 * Map Sources Configuration
 * Configuration centralisée des 7 types de cartes premium BIONIC
 */

// Types de cartes disponibles
export const MAP_TYPES = {
  BIONIC_PREMIUM: 'bionic-premium',
  ECOFORESTRY: 'ecoforestry',
  SATELLITE: 'satellite',
  IQHO: 'iqho',
  BATHYMETRY: 'bathymetry',
  FOREST_ROADS: 'forest-roads',
  TOPO_ADVANCED: 'topo-advanced'
};

// Configuration complète des cartes
export const MAP_CONFIGS = {
  [MAP_TYPES.BIONIC_PREMIUM]: {
    id: 'bionic-premium',
    name: 'BIONIC Premium',
    shortName: 'BIONIC',
    description: 'Style tactique haute lisibilité',
    icon: '🔶',
    category: 'tactical',
    isDark: true,
    isPremium: true,
    // Utilise CartoDB Dark Matter comme base avec style personnalisé
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© BIONIC™ | © OpenStreetMap | © CARTO',
    maxZoom: 19,
    // Style overlay pour accent BIONIC
    overlayStyle: {
      accentColor: '#F5A623',
      labelColor: '#E0E0E0',
      roadColor: '#4A4A4A'
    },
    zoneOpacity: {
      fill: 0.35,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.ECOFORESTRY]: {
    id: 'ecoforestry',
    name: 'Écoforestière',
    shortName: 'ÉCO',
    description: 'Coupes, peuplements, essences',
    iconName: 'tree-pine',
    category: 'environmental',
    isDark: false,
    isPremium: true,
    // Base OpenStreetMap avec overlay WMS
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    wmsLayers: [
      {
        url: 'https://serviceswebcarto.mern.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer',
        layers: 'Coupes_et_feux_5_dernieres_annees',
        format: 'image/png',
        transparent: true
      }
    ],
    attribution: '© MFFP Québec | © OpenStreetMap',
    maxZoom: 18,
    zoneOpacity: {
      fill: 0.25,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.SATELLITE]: {
    id: 'satellite',
    name: 'Satellite HR',
    shortName: 'SAT',
    description: 'Imagerie haute résolution',
    iconName: 'satellite',
    category: 'imagery',
    isDark: false,
    isPremium: true,
    // ESRI World Imagery (gratuit)
    tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    // Labels overlay
    labelsUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    zoneOpacity: {
      fill: 0.30,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.IQHO]: {
    id: 'iqho',
    name: 'IQHO',
    shortName: 'IQHO',
    description: 'Hydro + Relief + Ombrage',
    iconName: 'droplet',
    category: 'terrain',
    isDark: true,
    isPremium: true,
    // Stamen Terrain avec personnalisation
    tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png',
    attribution: '© Stadia Maps | © Stamen Design | © OpenStreetMap',
    maxZoom: 18,
    overlayStyle: {
      waterColor: '#1A237E',
      reliefOpacity: 0.7
    },
    zoneOpacity: {
      fill: 0.30,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.BATHYMETRY]: {
    id: 'bathymetry',
    name: 'Bathymétrie',
    shortName: 'BATHY',
    description: 'Courbes de profondeur',
    iconName: 'bar-chart-3',
    category: 'water',
    isDark: true,
    isPremium: true,
    // Base sombre avec overlay bathymétrique
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '© BIONIC™ | © CARTO | Données MFFP',
    maxZoom: 18,
    // Sera complété avec données utilisateur
    bathymetrySource: 'user-provided',
    zoneOpacity: {
      fill: 0.25,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.FOREST_ROADS]: {
    id: 'forest-roads',
    name: 'Chemins Forestiers',
    shortName: 'CHEMINS',
    description: 'Sentiers et accès terrain',
    iconName: 'route',
    category: 'access',
    isDark: false,
    isPremium: true,
    // OpenTopoMap avec routes forestières
    tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap | © OpenStreetMap',
    maxZoom: 17,
    // Overlay des chemins depuis geo_entities
    customRoadsSource: 'geo_entities',
    zoneOpacity: {
      fill: 0.20,
      stroke: 1.0
    }
  },
  
  [MAP_TYPES.TOPO_ADVANCED]: {
    id: 'topo-advanced',
    name: 'Topo Avancée',
    shortName: 'TOPO',
    description: 'Courbes de niveau fines',
    iconName: 'ruler',
    category: 'terrain',
    isDark: false,
    isPremium: true,
    // Thunderforest Outdoors ou OpenTopoMap
    tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap | © OpenStreetMap',
    maxZoom: 17,
    contourInterval: 10, // mètres
    zoneOpacity: {
      fill: 0.25,
      stroke: 1.0
    }
  }
};

// Cartes optimisées pour le mode sombre
export const DARK_OPTIMIZED_MAPS = [
  MAP_TYPES.BIONIC_PREMIUM,
  MAP_TYPES.IQHO,
  MAP_TYPES.BATHYMETRY
];

// Ordre d'affichage dans le sélecteur
export const MAP_DISPLAY_ORDER = [
  MAP_TYPES.BIONIC_PREMIUM,
  MAP_TYPES.ECOFORESTRY,
  MAP_TYPES.SATELLITE,
  MAP_TYPES.IQHO,
  MAP_TYPES.BATHYMETRY,
  MAP_TYPES.FOREST_ROADS,
  MAP_TYPES.TOPO_ADVANCED
];

// Catégories de cartes
export const MAP_CATEGORIES = {
  tactical: { name: 'Tactique', color: '#F5A623' },
  environmental: { name: 'Environnement', color: '#22C55E' },
  imagery: { name: 'Imagerie', color: '#3B82F6' },
  terrain: { name: 'Terrain', color: '#8B5CF6' },
  water: { name: 'Eau', color: '#06B6D4' },
  access: { name: 'Accès', color: '#FF9800' }
};

// Fonction pour obtenir la config d'une carte
export const getMapConfig = (mapType) => {
  return MAP_CONFIGS[mapType] || MAP_CONFIGS[MAP_TYPES.BIONIC_PREMIUM];
};

// Fonction pour vérifier si une carte est sombre
export const isMapDark = (mapType) => {
  return DARK_OPTIMIZED_MAPS.includes(mapType);
};

// Fonction pour obtenir l'opacité des zones selon la carte
export const getZoneOpacity = (mapType, zoneType = 'fill') => {
  const config = getMapConfig(mapType);
  return config.zoneOpacity?.[zoneType] || 0.25;
};

export default {
  MAP_TYPES,
  MAP_CONFIGS,
  DARK_OPTIMIZED_MAPS,
  MAP_DISPLAY_ORDER,
  MAP_CATEGORIES,
  getMapConfig,
  isMapDark,
  getZoneOpacity
};
