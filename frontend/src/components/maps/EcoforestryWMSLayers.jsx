/**
 * EcoforestryWMSLayers.jsx
 * 
 * Couches WMS écoforestières du Québec (MFFP/MERN)
 * Intégration modulaire avec le système de cartes premium BIONIC
 * 
 * Sources:
 * - MERN (Ministère de l'Énergie et des Ressources naturelles)
 * - NFIS (National Forest Information System)
 * - SCANFI (Spatialized Canadian NFI 2020)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WMSTileLayer, TileLayer, LayerGroup, useMap } from 'react-leaflet';
import { toast } from 'sonner';

// Configuration des services WMS du Québec
const WMS_SERVICES = {
  // Service MERN principal - Territoire
  mern_territoire: {
    id: 'mern_territoire',
    name: 'Territoire (MERN)',
    url: 'https://servicescarto.mern.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer',
    layers: '0,1,2,3,4,5',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '© MERN Québec'
  },
  
  // Service MERN - Hydrographie
  mern_hydro: {
    id: 'mern_hydro',
    name: 'Hydrographie (MERN)',
    url: 'https://servicescarto.mern.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer',
    layers: '6,7,8',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '© MERN Québec'
  },
  
  // Service NFIS - Couverture terrestre Canada
  nfis_landcover: {
    id: 'nfis_landcover',
    name: 'Couverture terrestre (NFIS)',
    url: 'https://ca.nfis.org/cubewerx/cubeserv',
    layers: 'scanfi_landcover_2020',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: '© NFIS Canada'
  },
  
  // Service NFIS - Hauteur de canopée
  nfis_canopy: {
    id: 'nfis_canopy',
    name: 'Hauteur canopée (NFIS)',
    url: 'https://ca.nfis.org/cubewerx/cubeserv',
    layers: 'scanfi_canopy_height_2020',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: '© NFIS Canada'
  }
};

// Palette de couleurs pour les légendes écoforestières
export const ECOFORESTRY_COLORS = {
  // Types de peuplements
  resineux: '#1B5E20',      // Vert foncé
  feuillus: '#FFB300',      // Jaune-orange
  mixte: '#7CB342',         // Vert clair
  
  // Coupes et perturbations
  coupe_recente: '#E53935', // Rouge
  coupe_2_5_ans: '#FF7043', // Orange
  coupe_5_10_ans: '#FFCC80', // Orange pâle
  regeneration: '#81C784',  // Vert tendre
  feu_recent: '#D32F2F',    // Rouge foncé
  
  // Densité
  densite_forte: '#2E7D32', // Vert forêt
  densite_moyenne: '#66BB6A', // Vert moyen
  densite_faible: '#A5D6A7', // Vert pâle
  
  // Âge
  age_mature: '#1B5E20',    // Vert foncé
  age_moyen: '#4CAF50',     // Vert
  age_jeune: '#81C784',     // Vert clair
};

/**
 * Composant de légende pour les couches écoforestières
 */
export const EcoforestryLegend = ({ visible = true, language = 'fr' }) => {
  if (!visible) return null;
  
  const labels = {
    fr: {
      title: 'Légende Écoforestière',
      peuplements: 'Types de peuplements',
      resineux: 'Résineux',
      feuillus: 'Feuillus',
      mixte: 'Mixte',
      perturbations: 'Perturbations',
      coupe_recente: 'Coupe récente (<2 ans)',
      coupe_ancienne: 'Coupe ancienne (2-10 ans)',
      feu: 'Feu récent',
      regeneration: 'Régénération'
    },
    en: {
      title: 'Ecoforestry Legend',
      peuplements: 'Stand Types',
      resineux: 'Coniferous',
      feuillus: 'Deciduous',
      mixte: 'Mixed',
      perturbations: 'Disturbances',
      coupe_recente: 'Recent cut (<2 years)',
      coupe_ancienne: 'Old cut (2-10 years)',
      feu: 'Recent fire',
      regeneration: 'Regeneration'
    }
  };
  
  const t = labels[language] || labels.fr;
  
  return (
    <div className="absolute bottom-20 left-4 z-[600] bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 max-w-[200px]">
      <div className="text-white text-xs font-bold uppercase tracking-wider mb-2">
        {t.title}
      </div>
      
      {/* Types de peuplements */}
      <div className="mb-2">
        <div className="text-gray-400 text-[10px] uppercase mb-1">{t.peuplements}</div>
        <div className="space-y-1">
          <LegendItem color={ECOFORESTRY_COLORS.resineux} label={t.resineux} />
          <LegendItem color={ECOFORESTRY_COLORS.feuillus} label={t.feuillus} />
          <LegendItem color={ECOFORESTRY_COLORS.mixte} label={t.mixte} />
        </div>
      </div>
      
      {/* Perturbations */}
      <div>
        <div className="text-gray-400 text-[10px] uppercase mb-1">{t.perturbations}</div>
        <div className="space-y-1">
          <LegendItem color={ECOFORESTRY_COLORS.coupe_recente} label={t.coupe_recente} />
          <LegendItem color={ECOFORESTRY_COLORS.coupe_2_5_ans} label={t.coupe_ancienne} />
          <LegendItem color={ECOFORESTRY_COLORS.feu_recent} label={t.feu} />
          <LegendItem color={ECOFORESTRY_COLORS.regeneration} label={t.regeneration} />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div 
      className="w-3 h-3 rounded-sm border border-white/20" 
      style={{ backgroundColor: color }} 
    />
    <span className="text-gray-300 text-[10px]">{label}</span>
  </div>
);

/**
 * Hook pour gérer l'état des couches WMS
 */
export const useEcoforestryLayers = () => {
  const [activeLayers, setActiveLayers] = useState({
    territoire: false,
    hydro: false,
    landcover: false,
    canopy: false
  });
  
  const [layerOpacities, setLayerOpacities] = useState({
    territoire: 0.7,
    hydro: 0.8,
    landcover: 0.6,
    canopy: 0.5
  });
  
  const [wmsStatus, setWmsStatus] = useState({
    isChecking: false,
    isAvailable: null,
    error: null
  });
  
  // Vérifier la disponibilité des services WMS
  const checkWMSAvailability = useCallback(async () => {
    setWmsStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      // Test simple via GetCapabilities
      const testUrl = `${WMS_SERVICES.nfis_landcover.url}?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1`;
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors' // Évite les erreurs CORS pour le test
      });
      
      setWmsStatus({
        isChecking: false,
        isAvailable: true,
        error: null
      });
    } catch (error) {
      console.warn('WMS check failed:', error);
      setWmsStatus({
        isChecking: false,
        isAvailable: false,
        error: 'Service WMS temporairement indisponible'
      });
    }
  }, []);
  
  // Toggle une couche
  const toggleLayer = useCallback((layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  }, []);
  
  // Activer toutes les couches
  const enableAllLayers = useCallback(() => {
    setActiveLayers({
      territoire: true,
      hydro: true,
      landcover: true,
      canopy: true
    });
  }, []);
  
  // Désactiver toutes les couches
  const disableAllLayers = useCallback(() => {
    setActiveLayers({
      territoire: false,
      hydro: false,
      landcover: false,
      canopy: false
    });
  }, []);
  
  // Mettre à jour l'opacité d'une couche
  const setLayerOpacity = useCallback((layerId, opacity) => {
    setLayerOpacities(prev => ({
      ...prev,
      [layerId]: opacity
    }));
  }, []);
  
  return {
    activeLayers,
    layerOpacities,
    wmsStatus,
    toggleLayer,
    enableAllLayers,
    disableAllLayers,
    setLayerOpacity,
    checkWMSAvailability
  };
};

/**
 * Composant principal des couches WMS écoforestières
 * S'intègre avec le système de cartes premium BIONIC
 */
const EcoforestryWMSLayers = ({
  enabled = false,
  activeLayers = {},
  opacities = {},
  showLegend = true,
  language = 'fr',
  onError = null
}) => {
  const map = useMap();
  const [loadErrors, setLoadErrors] = useState({});
  
  // Gestionnaire d'erreur de chargement WMS
  const handleTileError = useCallback((layerId, error) => {
    console.warn(`WMS layer ${layerId} error:`, error);
    setLoadErrors(prev => ({ ...prev, [layerId]: true }));
    
    if (onError) {
      onError(layerId, error);
    }
  }, [onError]);
  
  if (!enabled) return null;
  
  return (
    <>
      <LayerGroup>
        {/* Couche Territoire MERN */}
        {activeLayers.territoire && (
          <WMSTileLayer
            url={WMS_SERVICES.mern_territoire.url}
            layers={WMS_SERVICES.mern_territoire.layers}
            format={WMS_SERVICES.mern_territoire.format}
            transparent={true}
            version={WMS_SERVICES.mern_territoire.version}
            opacity={opacities.territoire || 0.7}
            attribution={WMS_SERVICES.mern_territoire.attribution}
            eventHandlers={{
              tileerror: (e) => handleTileError('territoire', e)
            }}
          />
        )}
        
        {/* Couche Hydrographie MERN */}
        {activeLayers.hydro && (
          <WMSTileLayer
            url={WMS_SERVICES.mern_hydro.url}
            layers={WMS_SERVICES.mern_hydro.layers}
            format={WMS_SERVICES.mern_hydro.format}
            transparent={true}
            version={WMS_SERVICES.mern_hydro.version}
            opacity={opacities.hydro || 0.8}
            attribution={WMS_SERVICES.mern_hydro.attribution}
            eventHandlers={{
              tileerror: (e) => handleTileError('hydro', e)
            }}
          />
        )}
        
        {/* Couche Couverture terrestre NFIS */}
        {activeLayers.landcover && (
          <WMSTileLayer
            url={WMS_SERVICES.nfis_landcover.url}
            layers={WMS_SERVICES.nfis_landcover.layers}
            format={WMS_SERVICES.nfis_landcover.format}
            transparent={true}
            version={WMS_SERVICES.nfis_landcover.version}
            opacity={opacities.landcover || 0.6}
            attribution={WMS_SERVICES.nfis_landcover.attribution}
            eventHandlers={{
              tileerror: (e) => handleTileError('landcover', e)
            }}
          />
        )}
        
        {/* Couche Hauteur canopée NFIS */}
        {activeLayers.canopy && (
          <WMSTileLayer
            url={WMS_SERVICES.nfis_canopy.url}
            layers={WMS_SERVICES.nfis_canopy.layers}
            format={WMS_SERVICES.nfis_canopy.format}
            transparent={true}
            version={WMS_SERVICES.nfis_canopy.version}
            opacity={opacities.canopy || 0.5}
            attribution={WMS_SERVICES.nfis_canopy.attribution}
            eventHandlers={{
              tileerror: (e) => handleTileError('canopy', e)
            }}
          />
        )}
      </LayerGroup>
      
      {/* Légende */}
      {showLegend && Object.values(activeLayers).some(v => v) && (
        <EcoforestryLegend visible={true} language={language} />
      )}
    </>
  );
};

export default EcoforestryWMSLayers;
export { WMS_SERVICES };
