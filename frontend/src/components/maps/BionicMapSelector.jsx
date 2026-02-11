/**
 * BionicMapSelector - Sélecteur de cartes premium BIONIC TACTICAL
 * Permet de choisir parmi les 7 types de cartes disponibles
 */

import React, { useState } from 'react';
import { 
  Map, Layers, ChevronDown, ChevronUp, Check, 
  Satellite, Mountain, Droplets, TreePine, Route, Grid3X3,
  Eye, EyeOff, Settings, Compass
} from 'lucide-react';
import { 
  MAP_TYPES, 
  MAP_CONFIGS, 
  MAP_DISPLAY_ORDER, 
  MAP_CATEGORIES 
} from '@/config/mapSources';

// Icônes personnalisées pour chaque type de carte
const MAP_ICONS = {
  [MAP_TYPES.BIONIC_PREMIUM]: () => (
    <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F5A623] to-[#FF8F00] flex items-center justify-center">
      <span className="text-black text-[10px] font-black">B</span>
    </div>
  ),
  [MAP_TYPES.ECOFORESTRY]: () => <TreePine className="w-5 h-5 text-green-500" />,
  [MAP_TYPES.SATELLITE]: () => <Satellite className="w-5 h-5 text-blue-400" />,
  [MAP_TYPES.IQHO]: () => <Droplets className="w-5 h-5 text-cyan-400" />,
  [MAP_TYPES.BATHYMETRY]: () => (
    <div className="w-5 h-5 rounded bg-gradient-to-b from-cyan-400 to-blue-700 flex items-center justify-center">
      <span className="text-white text-[10px] font-bold">~</span>
    </div>
  ),
  [MAP_TYPES.FOREST_ROADS]: () => <Route className="w-5 h-5 text-orange-400" />,
  [MAP_TYPES.TOPO_ADVANCED]: () => <Mountain className="w-5 h-5 text-purple-400" />
};

/**
 * Carte individuelle dans le sélecteur
 */
const MapTypeCard = ({ 
  mapType, 
  config, 
  isSelected, 
  onClick,
  compact = false 
}) => {
  const IconComponent = MAP_ICONS[mapType];
  
  return (
    <button
      onClick={() => onClick(mapType)}
      className={`
        relative flex ${compact ? 'flex-row items-center gap-2 p-2' : 'flex-col items-center p-3'}
        rounded-lg border transition-all duration-200
        ${isSelected 
          ? 'border-[#F5A623] bg-[#F5A623]/10 shadow-[0_0_15px_rgba(245,166,35,0.2)]' 
          : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5'
        }
      `}
      data-testid={`map-type-${mapType}`}
    >
      {/* Badge Premium */}
      {config.isPremium && !compact && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#F5A623] to-[#FF8F00] text-black text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
          Pro
        </span>
      )}
      
      {/* Icône */}
      <div className={`${compact ? '' : 'mb-2'}`}>
        {IconComponent && <IconComponent />}
      </div>
      
      {/* Nom */}
      <span className={`
        text-center font-medium uppercase tracking-wider
        ${compact ? 'text-[11px]' : 'text-[10px]'}
        ${isSelected ? 'text-[#F5A623]' : 'text-gray-300'}
      `}>
        {compact ? config.shortName : config.name}
      </span>
      
      {/* Indicateur de sélection */}
      {isSelected && (
        <div className={`
          ${compact ? 'ml-auto' : 'absolute bottom-1 right-1'}
        `}>
          <Check className="w-3 h-3 text-[#F5A623]" />
        </div>
      )}
    </button>
  );
};

/**
 * Composant principal du sélecteur de cartes
 */
const BionicMapSelector = ({
  currentMapType,
  onMapTypeChange,
  mapOptions = {},
  onOptionsChange,
  variant = 'panel', // 'panel' | 'dropdown' | 'compact'
  showOptions = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'panel');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const currentConfig = MAP_CONFIGS[currentMapType];

  // Rendu en mode dropdown
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg hover:border-[#F5A623]/30 transition-colors"
          data-testid="map-selector-dropdown"
        >
          {MAP_ICONS[currentMapType] && <MAP_ICONS[currentMapType]() />}
          <span className="text-white text-sm font-medium">{currentConfig?.shortName}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 p-2">
            <div className="grid grid-cols-2 gap-2">
              {MAP_DISPLAY_ORDER.map(mapType => (
                <MapTypeCard
                  key={mapType}
                  mapType={mapType}
                  config={MAP_CONFIGS[mapType]}
                  isSelected={currentMapType === mapType}
                  onClick={(type) => {
                    onMapTypeChange(type);
                    setIsExpanded(false);
                  }}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Rendu en mode compact (barre horizontale)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg ${className}`}>
        {MAP_DISPLAY_ORDER.map(mapType => {
          const IconComponent = MAP_ICONS[mapType];
          return (
            <button
              key={mapType}
              onClick={() => onMapTypeChange(mapType)}
              className={`
                p-2 rounded transition-all
                ${currentMapType === mapType 
                  ? 'bg-[#F5A623]/20 border border-[#F5A623]/50' 
                  : 'hover:bg-white/10'
                }
              `}
              title={MAP_CONFIGS[mapType].name}
              data-testid={`map-compact-${mapType}`}
            >
              {IconComponent && <IconComponent />}
            </button>
          );
        })}
      </div>
    );
  }

  // Rendu en mode panel (complet)
  return (
    <div className={`bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 border-b border-white/10 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#F5A623]" />
          <span className="text-white text-sm font-semibold uppercase tracking-wider">
            Type de Carte
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#F5A623] text-xs font-medium">
            {currentConfig?.shortName}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Contenu expandable */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Grille des cartes */}
          <div className="grid grid-cols-4 gap-2">
            {MAP_DISPLAY_ORDER.slice(0, 4).map(mapType => (
              <MapTypeCard
                key={mapType}
                mapType={mapType}
                config={MAP_CONFIGS[mapType]}
                isSelected={currentMapType === mapType}
                onClick={onMapTypeChange}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MAP_DISPLAY_ORDER.slice(4).map(mapType => (
              <MapTypeCard
                key={mapType}
                mapType={mapType}
                config={MAP_CONFIGS[mapType]}
                isSelected={currentMapType === mapType}
                onClick={onMapTypeChange}
              />
            ))}
          </div>

          {/* Description de la carte sélectionnée */}
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#F5A623]/10 rounded border border-[#F5A623]/20">
            <div className="flex-shrink-0">
              {MAP_ICONS[currentMapType] && <MAP_ICONS[currentMapType]() />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium">{currentConfig?.name}</div>
              <div className="text-gray-400 text-[10px] truncate">{currentConfig?.description}</div>
            </div>
          </div>

          {/* Options */}
          {showOptions && (
            <>
              <div className="border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-wider">Options</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showAdvancedOptions && (
                <div className="space-y-2 pt-2">
                  {/* Labels */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-400 text-[11px] group-hover:text-white transition-colors">
                      Labels de terrain
                    </span>
                    <button
                      onClick={() => onOptionsChange?.({ showLabels: !mapOptions.showLabels })}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        mapOptions.showLabels ? 'bg-[#F5A623]' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        mapOptions.showLabels ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>

                  {/* Coordonnées */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-400 text-[11px] group-hover:text-white transition-colors">
                      Coordonnées GPS
                    </span>
                    <button
                      onClick={() => onOptionsChange?.({ showCoordinates: !mapOptions.showCoordinates })}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        mapOptions.showCoordinates ? 'bg-[#F5A623]' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        mapOptions.showCoordinates ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>

                  {/* Auto-opacité zones */}
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-400 text-[11px] group-hover:text-white transition-colors">
                      Opacité zones auto
                    </span>
                    <button
                      onClick={() => onOptionsChange?.({ autoZoneOpacity: !mapOptions.autoZoneOpacity })}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        mapOptions.autoZoneOpacity ? 'bg-[#F5A623]' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        mapOptions.autoZoneOpacity ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BionicMapSelector;
export { MapTypeCard, MAP_ICONS };
