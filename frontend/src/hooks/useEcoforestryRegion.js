/**
 * useEcoforestryRegion Hook
 * 
 * Gestion des sources écoforestières multi-régions
 * Détection automatique de région et fallback intelligent
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  REGIONS,
  ECOFORESTRY_SOURCES,
  AVAILABILITY_STATUS,
  PROXY_CONFIG,
  detectRegion,
  getRegionSources,
  getDefaultSource,
  getFallbackSource,
  requiresProxy,
  buildProxiedUrl
} from '@/config/ecoforestryRegistry';

/**
 * Hook principal pour gérer les sources écoforestières par région
 * 
 * @param {object} options - Options de configuration
 * @param {number} options.lat - Latitude pour détection automatique
 * @param {number} options.lng - Longitude pour détection automatique
 * @param {string} options.defaultRegion - Région par défaut (si pas de détection)
 * @param {boolean} options.autoDetect - Activer la détection automatique
 */
const useEcoforestryRegion = ({
  lat = null,
  lng = null,
  defaultRegion = 'QC',
  autoDetect = true
} = {}) => {
  // État de la région active
  const [activeRegion, setActiveRegion] = useState(defaultRegion);
  
  // État de la source active
  const [activeSource, setActiveSource] = useState(null);
  
  // État de disponibilité
  const [availability, setAvailability] = useState({
    status: AVAILABILITY_STATUS.UNKNOWN,
    checkedAt: null,
    error: null
  });
  
  // État du fallback
  const [fallbackActive, setFallbackActive] = useState(false);
  const [fallbackSource, setFallbackSource] = useState(null);
  
  // Compteur de retry
  const [retryCount, setRetryCount] = useState(0);
  
  // Détection automatique de la région
  useEffect(() => {
    if (autoDetect && lat && lng) {
      const detectedRegion = detectRegion(lat, lng);
      if (detectedRegion && detectedRegion !== activeRegion) {
        console.log(`[Ecoforestry] Région détectée: ${detectedRegion}`);
        setActiveRegion(detectedRegion);
      }
    }
  }, [lat, lng, autoDetect, activeRegion]);
  
  // Charger la source par défaut quand la région change
  useEffect(() => {
    const defaultSrc = getDefaultSource(activeRegion);
    if (defaultSrc) {
      setActiveSource(defaultSrc);
      setFallbackActive(false);
      setRetryCount(0);
      checkSourceAvailability(defaultSrc);
    }
  }, [activeRegion]);
  
  // Vérifier la disponibilité d'une source
  const checkSourceAvailability = useCallback(async (source) => {
    if (!source) return;
    
    setAvailability({
      status: AVAILABILITY_STATUS.CHECKING,
      checkedAt: null,
      error: null
    });
    
    try {
      // Construire l'URL de test (GetCapabilities)
      let testUrl = source.url;
      const needsProxy = requiresProxy(source.id, activeRegion);
      
      if (needsProxy && PROXY_CONFIG.proxyBaseUrl) {
        testUrl = buildProxiedUrl(source.url, true);
      }
      
      // Pour WMS, tester avec GetCapabilities
      if (source.type === 'wms') {
        const separator = testUrl.includes('?') ? '&' : '?';
        testUrl = `${testUrl}${separator}SERVICE=WMS&REQUEST=GetCapabilities&VERSION=${source.version || '1.3.0'}`;
      }
      
      // Test avec timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors', // Éviter les erreurs CORS pour le test
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      setAvailability({
        status: AVAILABILITY_STATUS.AVAILABLE,
        checkedAt: new Date().toISOString(),
        error: null
      });
      
    } catch (error) {
      console.warn(`[Ecoforestry] Source ${source.id} indisponible:`, error.message);
      
      // Marquer comme restreint si c'est une source connue pour avoir des restrictions
      const status = source.restricted 
        ? AVAILABILITY_STATUS.RESTRICTED 
        : AVAILABILITY_STATUS.UNAVAILABLE;
      
      setAvailability({
        status,
        checkedAt: new Date().toISOString(),
        error: error.message
      });
      
      // Activer le fallback si disponible
      if (!fallbackActive) {
        activateFallback();
      }
    }
  }, [activeRegion, fallbackActive]);
  
  // Activer le fallback
  const activateFallback = useCallback(() => {
    const fallback = getFallbackSource(activeRegion);
    if (fallback && fallback.id !== activeSource?.id) {
      console.log(`[Ecoforestry] Activation fallback: ${fallback.id}`);
      setFallbackSource(fallback);
      setFallbackActive(true);
      setActiveSource(fallback);
    }
  }, [activeRegion, activeSource]);
  
  // Réessayer la source principale
  const retryPrimarySource = useCallback(async () => {
    if (retryCount >= PROXY_CONFIG.maxRetries) {
      console.warn('[Ecoforestry] Nombre maximum de tentatives atteint');
      return false;
    }
    
    const primarySource = getDefaultSource(activeRegion);
    if (!primarySource) return false;
    
    setRetryCount(prev => prev + 1);
    
    // Attendre avant de réessayer
    await new Promise(resolve => setTimeout(resolve, PROXY_CONFIG.retryDelay));
    
    setActiveSource(primarySource);
    setFallbackActive(false);
    await checkSourceAvailability(primarySource);
    
    return availability.status === AVAILABILITY_STATUS.AVAILABLE;
  }, [activeRegion, retryCount, availability.status, checkSourceAvailability]);
  
  // Changer manuellement de région
  const changeRegion = useCallback((regionId) => {
    if (REGIONS[regionId]) {
      setActiveRegion(regionId);
    } else {
      console.warn(`[Ecoforestry] Région inconnue: ${regionId}`);
    }
  }, []);
  
  // Changer manuellement de source
  const changeSource = useCallback((sourceId) => {
    const regionConfig = getRegionSources(activeRegion);
    if (!regionConfig) return;
    
    const source = regionConfig.sources.find(s => s.id === sourceId);
    if (source) {
      setActiveSource(source);
      setFallbackActive(false);
      checkSourceAvailability(source);
    }
  }, [activeRegion, checkSourceAvailability]);
  
  // Informations de la région active
  const regionInfo = useMemo(() => {
    return REGIONS[activeRegion] || null;
  }, [activeRegion]);
  
  // Sources disponibles pour la région active
  const availableSources = useMemo(() => {
    const config = getRegionSources(activeRegion);
    return config?.sources || [];
  }, [activeRegion]);
  
  // URL WMS à utiliser (avec proxy si nécessaire)
  const wmsUrl = useMemo(() => {
    if (!activeSource) return null;
    
    const needsProxy = requiresProxy(activeSource.id, activeRegion);
    return buildProxiedUrl(activeSource.url, needsProxy && PROXY_CONFIG.proxyBaseUrl);
  }, [activeSource, activeRegion]);
  
  // Configuration WMS pour react-leaflet
  const wmsConfig = useMemo(() => {
    if (!activeSource) return null;
    
    return {
      url: wmsUrl,
      layers: activeSource.layers?.all || activeSource.layers?.peuplements || '',
      format: activeSource.format || 'image/png',
      transparent: activeSource.transparent !== false,
      version: activeSource.version || '1.3.0',
      attribution: activeSource.attribution || '',
      opacity: 0.7
    };
  }, [activeSource, wmsUrl]);
  
  return {
    // État
    activeRegion,
    activeSource,
    availability,
    fallbackActive,
    fallbackSource,
    retryCount,
    
    // Infos
    regionInfo,
    availableSources,
    wmsUrl,
    wmsConfig,
    
    // Actions
    changeRegion,
    changeSource,
    retryPrimarySource,
    checkSourceAvailability,
    
    // Constantes
    REGIONS,
    AVAILABILITY_STATUS
  };
};

export default useEcoforestryRegion;
