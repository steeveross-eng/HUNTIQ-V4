/**
 * MapPage - Interactive Map Page for Waypoints
 * Phase P3.2 - Interactive Map
 * Phase P4 - Background Geolocation & Proximity Alerts
 * Phase P6.4 - Real-time WebSocket Sync
 * Phase P6.5 - Support URL params for map centering (from Admin)
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WaypointMap } from '../modules/territory';
import BackgroundTracker from '../components/BackgroundTracker';
import GeoSyncToggle from '../components/GeoSyncToggle';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Satellite, RefreshCw, X, Users, MapPin, Bell, BarChart3, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GroupeTab } from '../modules/groupe';

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('map');
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();
  
  // Get URL parameters for map centering (from Admin "Voir sur la carte")
  const urlParams = useMemo(() => {
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const zoom = parseInt(searchParams.get('zoom')) || 15;
    
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng, zoom, hasParams: true };
    }
    return { hasParams: false };
  }, [searchParams]);

  // Show notification when centered on a specific location
  useEffect(() => {
    if (urlParams.hasParams) {
      toast.info(`Carte centrée sur: ${urlParams.lat.toFixed(4)}, ${urlParams.lng.toFixed(4)}`);
    }
  }, [urlParams]);

  // Clear URL params (reset view)
  const clearUrlParams = () => {
    setSearchParams({});
  };

  const handleProximityAlert = (alert) => {
    // Handle proximity alerts - could update map highlight here
    console.log('Proximity alert received:', alert);
  };

  // Handle real-time sync events from other group members
  const handleEntityReceived = useCallback(({ action, entity, entityId, userId }) => {
    console.log('Sync event:', action, entity || entityId);
    // Refresh map to show new/updated/deleted entities
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleMemberJoined = useCallback((userId) => {
    console.log('Member joined:', userId);
  }, []);

  const handleMemberLeft = useCallback((userId) => {
    console.log('Member left:', userId);
  }, []);

  // Get user info for sync
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.email || parsed.id || 'default_user';
      } catch (e) {
        return 'default_user';
      }
    }
    return 'default_user';
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Map className="h-8 w-8 text-[#f5a623]" />
            Carte Interactive
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gérez vos waypoints de chasse sur la carte • Phase P3/P4/P6
          </p>
        </div>

        {/* URL Params Banner (when coming from Admin) */}
        {urlParams.hasParams && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300">
                Vue centrée sur: <strong>{urlParams.lat.toFixed(6)}, {urlParams.lng.toFixed(6)}</strong>
                <span className="text-blue-400 ml-2">(Zoom: {urlParams.zoom})</span>
              </span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearUrlParams}
              className="text-blue-400 hover:text-blue-300"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          </div>
        )}

        {/* Real-time Sync Toggle */}
        <div className="mb-4">
          <GeoSyncToggle
            groupId="default_group"
            userId={getUserId()}
            onEntityReceived={handleEntityReceived}
            onMemberJoined={handleMemberJoined}
            onMemberLeft={handleMemberLeft}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 mb-4">
            <TabsTrigger value="map" className="data-[state=active]:bg-emerald-600" data-testid="tab-map">
              <Map className="h-4 w-4 mr-2" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-cyan-600" data-testid="tab-tracking">
              <Satellite className="h-4 w-4 mr-2" />
              GPS Tracking
            </TabsTrigger>
            <TabsTrigger value="groupe" className="data-[state=active]:bg-[var(--bionic-gold-primary)]" data-testid="tab-groupe">
              <Users className="h-4 w-4 mr-2" />
              {t('groupe_tab_title')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <WaypointMap 
              key={refreshKey}
              initialCenter={urlParams.hasParams ? [urlParams.lat, urlParams.lng] : null}
              initialZoom={urlParams.hasParams ? urlParams.zoom : null}
            />
          </TabsContent>

          <TabsContent value="tracking" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BackgroundTracker onProximityAlert={handleProximityAlert} />
              <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#f5a623]" /> Guide de Tracking
                </h3>
                <div className="space-y-4 text-sm text-slate-400">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-cyan-400 font-medium mb-2 flex items-center gap-2">
                      <Satellite className="h-4 w-4" /> Tracking Arrière-plan
                    </h4>
                    <p>Activez le tracking pour enregistrer automatiquement votre position toutes les 5 minutes pendant votre sortie de chasse.</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Alertes de Proximité
                    </h4>
                    <p>Recevez une notification lorsque vous approchez à 500m d'un waypoint (700m pour les hotspots).</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Sessions de Chasse
                    </h4>
                    <p>Le tracking calcule automatiquement la distance parcourue et le nombre de positions enregistrées.</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" /> Mode PWA
                    </h4>
                    <p>Pour une meilleure expérience, installez HUNTIQ sur votre téléphone via "Ajouter à l'écran d'accueil".</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groupe" className="mt-0">
            <GroupeTab
              groupId="default_group"
              userId={getUserId()}
              compact={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapPage;
