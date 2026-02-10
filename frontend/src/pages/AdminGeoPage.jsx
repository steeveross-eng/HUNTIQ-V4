/**
 * AdminGeoPage - Global Geospatial Administration Dashboard
 * Phase P6.5 - Admin Dashboard
 * 
 * Features:
 * - Global view of all geo entities
 * - Advanced filtering (type, habitat, density)
 * - Hotspot monetization overview
 * - Analytics and statistics
 * - Real-time sync status
 */
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Entity type colors
const TYPE_COLORS = {
  waypoint: '#3b82f6',
  zone: '#22c55e',
  sector: '#8b5cf6',
  hotspot: '#ef4444',
  camera: '#f97316',
  cache: '#eab308',
  corridor: '#06b6d4',
  poi: '#ec4899'
};

// Habitat labels
const HABITAT_LABELS = {
  forest_mixed: 'Forêt mixte',
  forest_coniferous: 'Forêt conifère',
  forest_deciduous: 'Forêt feuillue',
  clearing: 'Clairière',
  wetland: 'Zone humide',
  field: 'Champ',
  edge: 'Lisière',
  ridge: 'Crête',
  valley: 'Vallée',
  stream: 'Cours d\'eau'
};

const AdminGeoPage = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [entities, setEntities] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [filters, setFilters] = useState({
    entity_type: '',
    habitat: '',
    is_auto_generated: null
  });
  const [mapCenter] = useState([46.82, -71.21]);
  const [activeTab, setActiveTab] = useState('overview');

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/geo/analytics/overview`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
    }
  }, []);

  // Load all entities
  const loadEntities = useCallback(async () => {
    try {
      let url = `${API_URL}/api/admin/geo/all?limit=200`;
      
      if (filters.entity_type) {
        url += `&entity_type=${filters.entity_type}`;
      }
      if (filters.habitat) {
        url += `&habitat=${filters.habitat}`;
      }
      if (filters.is_auto_generated !== null) {
        url += `&is_auto_generated=${filters.is_auto_generated}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setEntities(data);
    } catch (error) {
      console.error('Error loading entities:', error);
    }
  }, [filters]);

  // Load hotspots for monetization
  const loadHotspots = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/geo/monetization/available-hotspots?min_confidence=0.3`);
      const data = await response.json();
      setHotspots(data.available_hotspots || []);
    } catch (error) {
      console.error('Error loading hotspots:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadAnalytics(), loadEntities(), loadHotspots()]);
      setLoading(false);
    };
    loadData();
  }, [loadAnalytics, loadEntities, loadHotspots]);

  // Reload entities when filters change
  useEffect(() => {
    loadEntities();
  }, [filters, loadEntities]);

  // Get marker color based on entity type
  const getMarkerColor = (entity) => {
    return TYPE_COLORS[entity.entity_type] || '#6b7280';
  };

  // Render stats card
  const StatsCard = ({ title, value, icon, color = 'blue' }) => (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement de l'espace admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6" data-testid="admin-geo-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🗺️ Espace Admin Géospatial
        </h1>
        <p className="text-slate-400">
          Vue globale de toutes les entités géospatiales - Phase P6.5
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Entités" 
          value={analytics?.total_entities || 0} 
          icon="📍"
          color="blue"
        />
        <StatsCard 
          title="Hotspots" 
          value={analytics?.by_type?.hotspot || 0} 
          icon="🔥"
          color="red"
        />
        <StatsCard 
          title="Auto-générés" 
          value={analytics?.auto_generated_count || 0} 
          icon="🤖"
          color="purple"
        />
        <StatsCard 
          title="Premium" 
          value={analytics?.premium_hotspots || 0} 
          icon="⭐"
          color="yellow"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 mb-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-blue-600">
            Carte globale
          </TabsTrigger>
          <TabsTrigger value="hotspots" className="data-[state=active]:bg-blue-600">
            Hotspots
          </TabsTrigger>
          <TabsTrigger value="monetization" className="data-[state=active]:bg-blue-600">
            Monétisation
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Type Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Répartition par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics?.by_type || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: TYPE_COLORS[type] || '#6b7280' }}
                        />
                        <span className="text-slate-300 capitalize">{type}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Habitat Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Répartition par habitat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics?.by_habitat || {}).map(([habitat, count]) => (
                    <div key={habitat} className="flex items-center justify-between">
                      <span className="text-slate-300">
                        {HABITAT_LABELS[habitat] || habitat}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Users */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Top Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(analytics?.top_users || []).slice(0, 5).map((user, idx) => (
                    <div key={user.user_id} className="flex items-center justify-between">
                      <span className="text-slate-300">
                        {idx + 1}. {user.user_id?.substring(0, 20)}...
                      </span>
                      <Badge>{user.count} entités</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(analytics?.recent_activity || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <div>
                        <span className="text-white">{item.name}</span>
                        <Badge className="ml-2" variant="outline">{item.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Carte Globale ({entities.length} entités)</span>
                <div className="flex gap-2">
                  <select
                    className="bg-slate-700 text-white px-3 py-1 rounded text-sm"
                    value={filters.entity_type}
                    onChange={(e) => setFilters({...filters, entity_type: e.target.value})}
                  >
                    <option value="">Tous les types</option>
                    <option value="waypoint">Waypoints</option>
                    <option value="hotspot">Hotspots</option>
                    <option value="zone">Zones</option>
                    <option value="camera">Caméras</option>
                  </select>
                  <select
                    className="bg-slate-700 text-white px-3 py-1 rounded text-sm"
                    value={filters.is_auto_generated === null ? '' : filters.is_auto_generated}
                    onChange={(e) => setFilters({
                      ...filters, 
                      is_auto_generated: e.target.value === '' ? null : e.target.value === 'true'
                    })}
                  >
                    <option value="">Toutes sources</option>
                    <option value="true">Auto-générés</option>
                    <option value="false">Manuels</option>
                  </select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapContainer
                  center={mapCenter}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {entities.map((entity) => (
                    entity.latitude && entity.longitude && (
                      <CircleMarker
                        key={entity.id}
                        center={[entity.latitude, entity.longitude]}
                        radius={8}
                        pathOptions={{
                          fillColor: getMarkerColor(entity),
                          fillOpacity: 0.8,
                          color: '#fff',
                          weight: 2
                        }}
                      >
                        <Popup>
                          <div className="text-sm">
                            <strong>{entity.name}</strong>
                            <br />
                            Type: {entity.entity_type}
                            <br />
                            {entity.metadata?.habitat && (
                              <>Habitat: {HABITAT_LABELS[entity.metadata.habitat] || entity.metadata.habitat}<br /></>
                            )}
                            {entity.metadata?.confidence && (
                              <>Confiance: {(entity.metadata.confidence * 100).toFixed(0)}%<br /></>
                            )}
                            User: {entity.user_id?.substring(0, 15)}...
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  ))}
                </MapContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-400 text-sm capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotspots Tab */}
        <TabsContent value="hotspots">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                🔥 Tous les Hotspots ({entities.filter(e => e.entity_type === 'hotspot').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entities.filter(e => e.entity_type === 'hotspot').map((hotspot) => (
                  <Card key={hotspot.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{hotspot.name}</h3>
                        {hotspot.metadata?.is_premium && (
                          <Badge className="bg-yellow-500">Premium</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-slate-400">
                        <p>📍 {hotspot.latitude?.toFixed(4)}, {hotspot.longitude?.toFixed(4)}</p>
                        {hotspot.metadata?.confidence && (
                          <p>🎯 Confiance: {(hotspot.metadata.confidence * 100).toFixed(0)}%</p>
                        )}
                        {hotspot.metadata?.habitat && (
                          <p>🌲 {HABITAT_LABELS[hotspot.metadata.habitat] || hotspot.metadata.habitat}</p>
                        )}
                        {hotspot.metadata?.density && (
                          <p>📊 Densité: {(hotspot.metadata.density * 100).toFixed(0)}%</p>
                        )}
                      </div>
                      {hotspot.metadata?.is_auto_generated && (
                        <Badge variant="outline" className="mt-2">Auto-généré</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                💰 Hotspots Premium Disponibles ({hotspots.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Ces hotspots premium non réclamés sont disponibles pour la monétisation.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-slate-400 pb-2">Nom</th>
                      <th className="text-slate-400 pb-2">Confiance</th>
                      <th className="text-slate-400 pb-2">Habitat</th>
                      <th className="text-slate-400 pb-2">Densité</th>
                      <th className="text-slate-400 pb-2">Valeur Est.</th>
                      <th className="text-slate-400 pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((h) => (
                      <tr key={h.id} className="border-b border-slate-700/50">
                        <td className="py-3 text-white">{h.name}</td>
                        <td className="py-3">
                          <Badge className={h.confidence > 0.6 ? 'bg-green-500' : 'bg-yellow-500'}>
                            {(h.confidence * 100).toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="py-3 text-slate-300">
                          {HABITAT_LABELS[h.habitat] || h.habitat || '-'}
                        </td>
                        <td className="py-3 text-slate-300">
                          {h.density ? `${(h.density * 100).toFixed(0)}%` : '-'}
                        </td>
                        <td className="py-3 text-green-400 font-medium">
                          ${h.estimated_value?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.info(`Claiming hotspot ${h.name}`)}
                          >
                            Réclamer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hotspots.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Aucun hotspot premium disponible actuellement.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGeoPage;
