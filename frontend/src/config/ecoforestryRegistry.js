/**
 * Ecoforestry Registry - Multi-Regions (Canada + USA)
 * 
 * Registry centralisé des sources WMS/WMTS écoforestières
 * Architecture extensible pour Québec, Canada, USA
 * 
 * Structure:
 * - Chaque région a ses propres sources WMS/WMTS
 * - Fallback automatique si source primaire indisponible
 * - Détection automatique de la région selon la position
 */

// ==================================================
// TYPES & INTERFACES
// ==================================================

/**
 * Types de sources de données
 */
export const SOURCE_TYPES = {
  WMS: 'wms',
  WMTS: 'wmts',
  REST: 'rest',
  TILE: 'tile'
};

/**
 * Statuts de disponibilité
 */
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  CHECKING: 'checking',
  RESTRICTED: 'restricted', // Restriction géographique
  UNKNOWN: 'unknown'
};

// ==================================================
// REGISTRY DES RÉGIONS
// ==================================================

/**
 * Définition des régions supportées
 */
export const REGIONS = {
  // Canada
  QC: {
    id: 'QC',
    name: 'Québec',
    nameEn: 'Quebec',
    country: 'CA',
    bounds: {
      north: 62.5,
      south: 45.0,
      east: -57.0,
      west: -79.5
    },
    defaultZoom: 8,
    center: [46.8, -71.2]
  },
  ON: {
    id: 'ON',
    name: 'Ontario',
    nameEn: 'Ontario',
    country: 'CA',
    bounds: {
      north: 56.9,
      south: 41.7,
      east: -74.3,
      west: -95.2
    },
    defaultZoom: 7,
    center: [51.2, -85.3]
  },
  BC: {
    id: 'BC',
    name: 'Colombie-Britannique',
    nameEn: 'British Columbia',
    country: 'CA',
    bounds: {
      north: 60.0,
      south: 48.3,
      east: -114.0,
      west: -139.0
    },
    defaultZoom: 6,
    center: [53.7, -127.6]
  },
  NB: {
    id: 'NB',
    name: 'Nouveau-Brunswick',
    nameEn: 'New Brunswick',
    country: 'CA',
    bounds: {
      north: 48.1,
      south: 44.6,
      east: -63.8,
      west: -69.1
    },
    defaultZoom: 8,
    center: [46.5, -66.1]
  },
  NS: {
    id: 'NS',
    name: 'Nouvelle-Écosse',
    nameEn: 'Nova Scotia',
    country: 'CA',
    bounds: {
      north: 47.0,
      south: 43.4,
      east: -59.7,
      west: -66.4
    },
    defaultZoom: 8,
    center: [44.9, -63.1]
  },
  
  // Canada - National
  CA_NATIONAL: {
    id: 'CA_NATIONAL',
    name: 'Canada (National)',
    nameEn: 'Canada (National)',
    country: 'CA',
    bounds: {
      north: 83.0,
      south: 41.7,
      east: -52.6,
      west: -141.0
    },
    defaultZoom: 4,
    center: [56.1, -106.3]
  },
  
  // USA
  USA_NATIONAL: {
    id: 'USA_NATIONAL',
    name: 'États-Unis (National)',
    nameEn: 'United States (National)',
    country: 'US',
    bounds: {
      north: 49.4,
      south: 24.5,
      east: -66.9,
      west: -124.8
    },
    defaultZoom: 5,
    center: [39.8, -98.6]
  },
  USA_NORTHEAST: {
    id: 'USA_NORTHEAST',
    name: 'États-Unis Nord-Est',
    nameEn: 'US Northeast',
    country: 'US',
    bounds: {
      north: 47.5,
      south: 37.0,
      east: -66.9,
      west: -80.5
    },
    defaultZoom: 6,
    center: [42.5, -74.0]
  }
};

// ==================================================
// SOURCES WMS/WMTS PAR RÉGION
// ==================================================

/**
 * Registry des sources écoforestières par région
 * Chaque région peut avoir plusieurs sources avec priorité
 */
export const ECOFORESTRY_SOURCES = {
  // ============================================
  // QUÉBEC
  // ============================================
  QC: {
    regionId: 'QC',
    sources: [
      {
        id: 'mffp_ecoforestry',
        name: 'Carte Écoforestière MFFP',
        nameEn: 'MFFP Ecoforestry Map',
        type: SOURCE_TYPES.WMS,
        priority: 1,
        url: 'https://servicescarto.mffp.gouv.qc.ca/pes/services/Inventaire/CarteEcoforestiere/MapServer/WMSServer',
        layers: {
          peuplements: '0',
          perturbations: '1',
          all: '0,1'
        },
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        attribution: '© MFFP Québec',
        restricted: true, // Restriction géographique connue
        proxyRequired: true,
        fallbackId: 'mern_territoire'
      },
      {
        id: 'mern_territoire',
        name: 'Territoire MERN',
        nameEn: 'MERN Territory',
        type: SOURCE_TYPES.WMS,
        priority: 2,
        url: 'https://servicescarto.mern.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer',
        layers: {
          territoire: '0,1,2,3,4,5',
          hydrographie: '6,7,8',
          relief: '9,10',
          all: '0,1,2,3,4,5,6,7,8,9,10'
        },
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        attribution: '© MERN Québec',
        restricted: true,
        proxyRequired: true,
        fallbackId: 'nfis_qc'
      },
      {
        id: 'nfis_qc',
        name: 'NFIS Québec',
        nameEn: 'NFIS Quebec',
        type: SOURCE_TYPES.WMS,
        priority: 3,
        url: 'https://ca.nfis.org/cubewerx/cubeserv',
        layers: {
          index_carte: 'qc_5einv_index_carte_ecoforestiere',
          volume_forestier: 'qc_volumeforestier',
          vegetation: 'qc_vegetation_potentielle',
          all: 'qc_5einv_index_carte_ecoforestiere'
        },
        version: '1.1.1',
        format: 'image/png',
        transparent: true,
        attribution: '© NFIS Canada',
        restricted: false,
        proxyRequired: false,
        fallbackId: 'scanfi_landcover'
      }
    ],
    defaultSourceId: 'mffp_ecoforestry',
    fallbackSourceId: 'nfis_qc'
  },
  
  // ============================================
  // CANADA NATIONAL
  // ============================================
  CA_NATIONAL: {
    regionId: 'CA_NATIONAL',
    sources: [
      {
        id: 'scanfi_landcover',
        name: 'SCANFI Couverture Terrestre 2020',
        nameEn: 'SCANFI Land Cover 2020',
        type: SOURCE_TYPES.WMS,
        priority: 1,
        url: 'https://ca.nfis.org/cubewerx/cubeserv',
        layers: {
          landcover: 'scanfi_landcover_2020',
          canopy_height: 'scanfi_canopy_height_2020',
          all: 'scanfi_landcover_2020'
        },
        version: '1.1.1',
        format: 'image/png',
        transparent: true,
        attribution: '© NFIS Canada - SCANFI 2020',
        restricted: false,
        proxyRequired: false
      },
      {
        id: 'nfi_managed_forests',
        name: 'NFI Forêts Aménagées',
        nameEn: 'NFI Managed Forests',
        type: SOURCE_TYPES.WMS,
        priority: 2,
        url: 'https://ca.nfis.org/mapserver/cgi-bin/ccfm_managed_forests_eng.cgi',
        layers: {
          managed_forests: 'managed_forests',
          classification: 'forest_management_classification',
          all: 'managed_forests'
        },
        version: '1.1.1',
        format: 'image/png',
        transparent: true,
        attribution: '© NFI Canada',
        restricted: false,
        proxyRequired: false
      }
    ],
    defaultSourceId: 'scanfi_landcover',
    fallbackSourceId: 'nfi_managed_forests'
  },
  
  // ============================================
  // ONTARIO
  // ============================================
  ON: {
    regionId: 'ON',
    sources: [
      {
        id: 'on_forest_inventory',
        name: 'Inventaire Forestier Ontario',
        nameEn: 'Ontario Forest Inventory',
        type: SOURCE_TYPES.REST,
        priority: 1,
        url: 'https://ws.lioservices.lrc.gov.on.ca/arcgis1061a/rest/services/LIO_Open_Data/Forest_Resources_Inventory/MapServer',
        layers: {
          inventory: 'Forest_Resources_Inventory',
          management: 'Forest_Management_Unit',
          all: '0,1,2,3'
        },
        format: 'image/png',
        transparent: true,
        attribution: '© Ontario GeoHub',
        restricted: false,
        proxyRequired: false,
        fallbackId: 'scanfi_landcover'
      }
    ],
    defaultSourceId: 'on_forest_inventory',
    fallbackSourceId: 'scanfi_landcover'
  },
  
  // ============================================
  // COLOMBIE-BRITANNIQUE
  // ============================================
  BC: {
    regionId: 'BC',
    sources: [
      {
        id: 'bc_vri',
        name: 'VRI Colombie-Britannique',
        nameEn: 'BC VRI (Vegetation Resources)',
        type: SOURCE_TYPES.WMS,
        priority: 1,
        url: 'https://openmaps.gov.bc.ca/geo/pub/wms',
        layers: {
          vri: 'WHSE_FOREST_VEGETATION.VEG_COMP_LYR_R1_POLY',
          harvest: 'WHSE_FOREST_TENURE.FTEN_HARVEST_AUTH_POLY_SVW',
          cutblocks: 'WHSE_FOREST_VEGETATION.RSLT_OPENING_SVW',
          fire: 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP',
          all: 'WHSE_FOREST_VEGETATION.VEG_COMP_LYR_R1_POLY'
        },
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        attribution: '© BC Data Catalogue',
        restricted: false,
        proxyRequired: false,
        fallbackId: 'scanfi_landcover'
      }
    ],
    defaultSourceId: 'bc_vri',
    fallbackSourceId: 'scanfi_landcover'
  },
  
  // ============================================
  // NOUVEAU-BRUNSWICK
  // ============================================
  NB: {
    regionId: 'NB',
    sources: [
      {
        id: 'nb_forest',
        name: 'Forêts Nouveau-Brunswick',
        nameEn: 'New Brunswick Forests',
        type: SOURCE_TYPES.WMS,
        priority: 1,
        url: 'https://geonb.snb.ca/arcgis/services/GeoNB_ENR_ForestManagement/MapServer/WMSServer',
        layers: {
          inventory: 'Forest_Inventory',
          vegetation: 'Vegetation_Management',
          silviculture: 'Silviculture',
          all: 'Forest_Inventory'
        },
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        attribution: '© GeoNB',
        restricted: false,
        proxyRequired: false,
        fallbackId: 'scanfi_landcover'
      }
    ],
    defaultSourceId: 'nb_forest',
    fallbackSourceId: 'scanfi_landcover'
  },
  
  // ============================================
  // USA NATIONAL
  // ============================================
  USA_NATIONAL: {
    regionId: 'USA_NATIONAL',
    sources: [
      {
        id: 'usfs_national_forests',
        name: 'Forêts Nationales USFS',
        nameEn: 'USFS National Forests',
        type: SOURCE_TYPES.REST,
        priority: 1,
        url: 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ForestSystemBoundaries_01/MapServer',
        layers: {
          boundaries: '0',
          wilderness: '1',
          all: '0,1'
        },
        format: 'image/png',
        transparent: true,
        attribution: '© USDA Forest Service',
        restricted: false,
        proxyRequired: false
      },
      {
        id: 'landfire_vegetation',
        name: 'LANDFIRE Végétation',
        nameEn: 'LANDFIRE Vegetation',
        type: SOURCE_TYPES.WMS,
        priority: 2,
        url: 'https://landfire.cr.usgs.gov/arcgis/services/Landfire/US_220/MapServer/WMSServer',
        layers: {
          vegetation: 'US_220EVT',
          cover: 'US_220EVC',
          height: 'US_220EVH',
          all: 'US_220EVT'
        },
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        attribution: '© LANDFIRE USGS',
        restricted: false,
        proxyRequired: false
      },
      {
        id: 'nlcd_landcover',
        name: 'NLCD Couverture Terrestre',
        nameEn: 'NLCD Land Cover',
        type: SOURCE_TYPES.WMS,
        priority: 3,
        url: 'https://www.mrlc.gov/geoserver/wms',
        layers: {
          landcover_2021: 'nlcd_2021',
          all: 'nlcd_2021'
        },
        version: '1.1.1',
        format: 'image/png',
        transparent: true,
        attribution: '© MRLC NLCD 2021',
        restricted: false,
        proxyRequired: false
      }
    ],
    defaultSourceId: 'landfire_vegetation',
    fallbackSourceId: 'nlcd_landcover'
  },
  
  // ============================================
  // USA NORTHEAST (États frontaliers)
  // ============================================
  USA_NORTHEAST: {
    regionId: 'USA_NORTHEAST',
    sources: [
      {
        id: 'usfs_northeast',
        name: 'USFS Nord-Est',
        nameEn: 'USFS Northeast',
        type: SOURCE_TYPES.REST,
        priority: 1,
        url: 'https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ForestSystemBoundaries_01/MapServer',
        layers: {
          boundaries: '0',
          all: '0'
        },
        format: 'image/png',
        transparent: true,
        attribution: '© USDA Forest Service',
        restricted: false,
        proxyRequired: false,
        fallbackId: 'landfire_vegetation'
      }
    ],
    defaultSourceId: 'usfs_northeast',
    fallbackSourceId: 'landfire_vegetation'
  }
};

// ==================================================
// FONCTIONS UTILITAIRES
// ==================================================

/**
 * Détecte la région en fonction des coordonnées
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string|null} - ID de la région ou null
 */
export const detectRegion = (lat, lng) => {
  // Vérifier les régions provinciales canadiennes d'abord (plus spécifiques)
  for (const [regionId, region] of Object.entries(REGIONS)) {
    if (regionId.includes('NATIONAL')) continue; // Skip national pour le moment
    
    const { bounds } = region;
    if (lat >= bounds.south && lat <= bounds.north &&
        lng >= bounds.west && lng <= bounds.east) {
      return regionId;
    }
  }
  
  // Sinon, vérifier les régions nationales
  if (lat >= 41.7 && lat <= 83.0 && lng >= -141.0 && lng <= -52.6) {
    return 'CA_NATIONAL';
  }
  
  if (lat >= 24.5 && lat <= 49.4 && lng >= -124.8 && lng <= -66.9) {
    return 'USA_NATIONAL';
  }
  
  return null;
};

/**
 * Obtenir les sources disponibles pour une région
 * @param {string} regionId - ID de la région
 * @returns {object|null} - Configuration des sources ou null
 */
export const getRegionSources = (regionId) => {
  return ECOFORESTRY_SOURCES[regionId] || null;
};

/**
 * Obtenir la source par défaut pour une région
 * @param {string} regionId - ID de la région
 * @returns {object|null} - Source par défaut ou null
 */
export const getDefaultSource = (regionId) => {
  const regionConfig = ECOFORESTRY_SOURCES[regionId];
  if (!regionConfig) return null;
  
  const defaultId = regionConfig.defaultSourceId;
  return regionConfig.sources.find(s => s.id === defaultId) || regionConfig.sources[0];
};

/**
 * Obtenir la source de fallback pour une région
 * @param {string} regionId - ID de la région
 * @returns {object|null} - Source de fallback ou null
 */
export const getFallbackSource = (regionId) => {
  const regionConfig = ECOFORESTRY_SOURCES[regionId];
  if (!regionConfig) return null;
  
  const fallbackId = regionConfig.fallbackSourceId;
  return regionConfig.sources.find(s => s.id === fallbackId) || null;
};

/**
 * Obtenir toutes les régions disponibles
 * @param {string} country - Code pays (CA, US) ou null pour tout
 * @returns {array} - Liste des régions
 */
export const getAvailableRegions = (country = null) => {
  return Object.values(REGIONS).filter(r => {
    if (!country) return true;
    return r.country === country;
  });
};

/**
 * Vérifier si une source nécessite un proxy
 * @param {string} sourceId - ID de la source
 * @param {string} regionId - ID de la région
 * @returns {boolean}
 */
export const requiresProxy = (sourceId, regionId) => {
  const regionConfig = ECOFORESTRY_SOURCES[regionId];
  if (!regionConfig) return false;
  
  const source = regionConfig.sources.find(s => s.id === sourceId);
  return source?.proxyRequired || false;
};

// ==================================================
// CONFIGURATION PROXY QUÉBEC
// ==================================================

/**
 * Configuration pour le proxy inverse Québec (recommandé)
 * À configurer selon l'infrastructure de production
 */
export const PROXY_CONFIG = {
  // URL du proxy hébergé au Québec (à configurer en production)
  // Options: OVH Beauharnois, CloudOps Montréal, AWS ca-central-1
  proxyBaseUrl: process.env.REACT_APP_QC_PROXY_URL || null,
  
  // Timeout pour les requêtes via proxy
  timeout: 30000,
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
  
  // Sources nécessitant le proxy
  proxiedSources: ['mffp_ecoforestry', 'mern_territoire']
};

/**
 * Construire l'URL avec proxy si nécessaire
 * @param {string} originalUrl - URL originale du WMS
 * @param {boolean} useProxy - Utiliser le proxy
 * @returns {string} - URL (avec ou sans proxy)
 */
export const buildProxiedUrl = (originalUrl, useProxy = false) => {
  if (!useProxy || !PROXY_CONFIG.proxyBaseUrl) {
    return originalUrl;
  }
  
  // Encoder l'URL originale pour le proxy
  const encodedUrl = encodeURIComponent(originalUrl);
  return `${PROXY_CONFIG.proxyBaseUrl}/wms?url=${encodedUrl}`;
};

export default {
  REGIONS,
  ECOFORESTRY_SOURCES,
  SOURCE_TYPES,
  AVAILABILITY_STATUS,
  PROXY_CONFIG,
  detectRegion,
  getRegionSources,
  getDefaultSource,
  getFallbackSource,
  getAvailableRegions,
  requiresProxy,
  buildProxiedUrl
};
