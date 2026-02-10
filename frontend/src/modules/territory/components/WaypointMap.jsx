/**
 * WaypointMap - Interactive Leaflet map for waypoints
 * Phase P3.2 - Interactive Map with Heatmap
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { toast } from 'sonner';
import { ExportService } from '../../../services/ExportService';
import { WaypointScoringService } from '../../../services/WaypointScoringService';
import { HeatmapLayer } from '../../../components/HeatmapLayer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_URL = process.env.REACT_APP_BACKEND_URL;

const WAYPOINT_TYPES = [
  { id: 'hunting', label: 'Spot de chasse', icon: '🎯', color: '#f5a623' },
  { id: 'stand', label: 'Mirador/Affût', icon: '🪵', color: '#8b4513' },
  { id: 'camera', label: 'Caméra trail', icon: '📷', color: '#3b82f6' },
  { id: 'feeder', label: 'Nourrisseur', icon: '🌾', color: '#22c55e' },
  { id: 'sighting', label: 'Observation', icon: '👁️', color: '#8b5cf6' },
  { id: 'parking', label: 'Stationnement', icon: '🅿️', color: '#6b7280' },
  { id: 'custom', label: 'Autre', icon: '📍', color: '#ef4444' }
];

// Custom marker icons
const createCustomIcon = (type) => {
  const typeInfo = WAYPOINT_TYPES.find(t => t.id === type) || WAYPOINT_TYPES[6];
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${typeInfo.color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">
      <span style="transform: rotate(45deg); font-size: 18px;">${typeInfo.icon}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Map click handler component
const MapClickHandler = ({ onMapClick, isAddingMode }) => {
  useMapEvents({
    click: (e) => {
      if (isAddingMode) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
};

// Center map on location component
const CenterOnLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

export const WaypointMap = ({ defaultCenter = { lat: 46.8139, lng: -71.2080 } }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newWaypointLocation, setNewWaypointLocation] = useState(null);
  const [newWaypointName, setNewWaypointName] = useState('');
  const [newWaypointType, setNewWaypointType] = useState('hunting');
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [mapCenter, setMapCenter] = useState([defaultCenter.lat, defaultCenter.lng]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [wqsScores, setWqsScores] = useState({});
  const mapRef = useRef(null);

  // Load waypoints and heatmap data
  const loadWaypoints = useCallback(async () => {
    try {
      const [waypointsResponse, heatmapResponse, wqsResponse] = await Promise.all([
        fetch(`${API_URL}/api/user/waypoints`),
        WaypointScoringService.getHeatmapData(),
        WaypointScoringService.getAllWQS()
      ]);
      
      const waypointsData = await waypointsResponse.json();
      if (waypointsData.success && waypointsData.waypoints) {
        setWaypoints(waypointsData.waypoints);
      }
      
      setHeatmapData(heatmapResponse);
      
      // Create WQS lookup by waypoint id
      const wqsLookup = {};
      wqsResponse.forEach(wqs => {
        wqsLookup[wqs.waypoint_id] = wqs;
      });
      setWqsScores(wqsLookup);
      
    } catch (error) {
      console.error('Error loading waypoints:', error);
      toast.error('Erreur lors du chargement des waypoints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWaypoints();
  }, [loadWaypoints]);

  // Handle map click for adding waypoint
  const handleMapClick = (latlng) => {
    setNewWaypointLocation(latlng);
    setNewWaypointName('');
    toast.info('Cliquez sur "Enregistrer" pour créer le waypoint');
  };

  // Save new waypoint
  const handleSaveWaypoint = async () => {
    if (!newWaypointLocation) {
      toast.error('Cliquez sur la carte pour placer le waypoint');
      return;
    }
    if (!newWaypointName.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/waypoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWaypointName,
          lat: newWaypointLocation.lat,
          lng: newWaypointLocation.lng,
          type: newWaypointType,
          active: true
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Waypoint créé !');
        setWaypoints(prev => [data.waypoint, ...prev]);
        setNewWaypointLocation(null);
        setNewWaypointName('');
        setIsAddingMode(false);
      } else {
        toast.error(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  // Delete waypoint
  const handleDeleteWaypoint = async (waypointId) => {
    try {
      const response = await fetch(`${API_URL}/api/user/waypoints/${waypointId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Waypoint supprimé');
        setWaypoints(prev => prev.filter(w => w.id !== waypointId));
        setSelectedWaypoint(null);
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    if (waypoints.length === 0) {
      toast.error('Aucun waypoint à exporter');
      return;
    }
    try {
      ExportService.exportWaypointsCSV(waypoints);
      toast.success('Waypoints exportés en CSV !');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleExportPDF = () => {
    if (waypoints.length === 0) {
      toast.error('Aucun waypoint à exporter');
      return;
    }
    try {
      ExportService.exportWaypointsPDF(waypoints);
      toast.success('Waypoints exportés en PDF !');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  // Center on waypoint
  const centerOnWaypoint = (waypoint) => {
    setMapCenter([waypoint.lat, waypoint.lng]);
    setSelectedWaypoint(waypoint);
  };

  // Get type info
  const getTypeInfo = (typeId) => {
    return WAYPOINT_TYPES.find(t => t.id === typeId) || WAYPOINT_TYPES[6];
  };

  // Get WQS for a waypoint
  const getWQS = (waypointId) => {
    return wqsScores[waypointId] || null;
  };

  // Get classification color
  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'hotspot': return 'bg-green-600';
      case 'good': return 'bg-blue-600';
      case 'standard': return 'bg-yellow-600';
      case 'weak': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" data-testid="waypoint-map">
      {/* Map */}
      <div className="lg:col-span-3">
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <span>🗺️</span>
                Carte des Waypoints
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={showHeatmap ? 'default' : 'outline'}
                  className={showHeatmap 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-purple-600 text-purple-400 hover:bg-purple-600/20'}
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  data-testid="toggle-heatmap"
                >
                  🔥 {showHeatmap ? 'Masquer' : 'Heatmap'}
                </Button>
                <Button
                  size="sm"
                  className={isAddingMode 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#f5a623] hover:bg-[#e09000] text-black'}
                  onClick={() => {
                    setIsAddingMode(!isAddingMode);
                    setNewWaypointLocation(null);
                  }}
                  data-testid="toggle-add-mode"
                >
                  {isAddingMode ? '✕ Annuler' : '+ Ajouter'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600/20"
                  onClick={handleExportCSV}
                >
                  📥 CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                  onClick={handleExportPDF}
                >
                  📄 PDF
                </Button>
              </div>
            </div>
            {isAddingMode && (
              <p className="text-amber-400 text-sm mt-2">
                📍 Mode ajout actif - Cliquez sur la carte pour placer un waypoint
              </p>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] relative">
              {loading ? (
                <div className="h-full flex items-center justify-center bg-slate-900">
                  <div className="text-slate-400">Chargement de la carte...</div>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  className="h-full w-full"
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <CenterOnLocation center={mapCenter} />
                  <MapClickHandler 
                    onMapClick={handleMapClick} 
                    isAddingMode={isAddingMode} 
                  />

                  {/* Heatmap layer */}
                  {showHeatmap && heatmapData.length > 0 && (
                    <HeatmapLayer data={heatmapData} />
                  )}

                  {/* Existing waypoints */}
                  {waypoints.map(waypoint => {
                    const wqs = getWQS(waypoint.id);
                    return (
                    <Marker
                      key={waypoint.id}
                      position={[waypoint.lat, waypoint.lng]}
                      icon={createCustomIcon(waypoint.type)}
                      eventHandlers={{
                        click: () => setSelectedWaypoint(waypoint)
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[220px]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getTypeInfo(waypoint.type).icon}</span>
                            <strong>{waypoint.name}</strong>
                          </div>
                          
                          {/* WQS Score */}
                          {wqs && (
                            <div className="bg-slate-100 rounded p-2 mb-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">WQS Score</span>
                                <span className="text-lg font-bold text-orange-500">{wqs.total_score}%</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{wqs.total_visits} visites</span>
                                <span className={`px-2 py-0.5 rounded text-white ${
                                  wqs.classification === 'hotspot' ? 'bg-green-500' :
                                  wqs.classification === 'good' ? 'bg-blue-500' :
                                  wqs.classification === 'standard' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                  {wqs.classification === 'hotspot' ? '🔥 Hotspot' :
                                   wqs.classification === 'good' ? '👍 Bon' :
                                   wqs.classification === 'standard' ? '📍 Standard' : '⚠️ Faible'}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                          </p>
                          {waypoint.notes && (
                            <p className="text-sm text-gray-500 mb-2">{waypoint.notes}</p>
                          )}
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: getTypeInfo(waypoint.type).color }}>
                              {getTypeInfo(waypoint.type).label}
                            </span>
                            <button
                              className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleDeleteWaypoint(waypoint.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )})}

                  {/* New waypoint marker */}
                  {newWaypointLocation && (
                    <Marker
                      position={[newWaypointLocation.lat, newWaypointLocation.lng]}
                      icon={createCustomIcon(newWaypointType)}
                    >
                      <Popup>
                        <div className="text-center p-2">
                          <strong>Nouveau waypoint</strong>
                          <p className="text-sm text-gray-600">
                            {newWaypointLocation.lat.toFixed(4)}, {newWaypointLocation.lng.toFixed(4)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
            </div>

            {/* Add waypoint form */}
            {isAddingMode && newWaypointLocation && (
              <div className="p-4 bg-slate-700/50 border-t border-slate-600">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-slate-400 text-sm block mb-1">Nom du waypoint</label>
                    <Input
                      placeholder="Ex: Mon spot favori"
                      value={newWaypointName}
                      onChange={(e) => setNewWaypointName(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      data-testid="new-waypoint-name"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-1">Type</label>
                    <select
                      value={newWaypointType}
                      onChange={(e) => setNewWaypointType(e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    >
                      {WAYPOINT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleSaveWaypoint}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="save-map-waypoint"
                  >
                    💾 Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Waypoints list */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-800 border-slate-700 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📍</span>
                Mes Waypoints
              </span>
              <Badge className="bg-slate-700">{waypoints.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {waypoints.length > 0 ? (
                waypoints.map(waypoint => {
                  const typeInfo = getTypeInfo(waypoint.type);
                  return (
                    <div
                      key={waypoint.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedWaypoint?.id === waypoint.id
                          ? 'bg-[#f5a623]/20 border border-[#f5a623]'
                          : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                      }`}
                      onClick={() => centerOnWaypoint(waypoint)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{typeInfo.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{waypoint.name}</p>
                          <p className="text-slate-400 text-xs">
                            {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <span className="text-3xl">🗺️</span>
                  <p className="text-slate-400 mt-2 text-sm">Aucun waypoint</p>
                  <p className="text-slate-500 text-xs">Utilisez la carte pour en ajouter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaypointMap;
