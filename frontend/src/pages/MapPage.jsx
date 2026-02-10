/**
 * MapPage - Interactive Map Page for Waypoints
 * Phase P3.2 - Interactive Map
 * Phase P4 - Background Geolocation & Proximity Alerts
 */
import React, { useState } from 'react';
import { WaypointMap } from '../modules/territory';
import BackgroundTracker from '../components/BackgroundTracker';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Satellite } from 'lucide-react';

const MapPage = () => {
  const [activeTab, setActiveTab] = useState('map');

  const handleProximityAlert = (alert) => {
    // Handle proximity alerts - could update map highlight here
    console.log('Proximity alert received:', alert);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            Carte Interactive
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gérez vos waypoints de chasse sur la carte • Phase P3/P4
          </p>
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
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <WaypointMap />
          </TabsContent>

          <TabsContent value="tracking" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BackgroundTracker onProximityAlert={handleProximityAlert} />
              <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📍</span> Guide de Tracking
                </h3>
                <div className="space-y-4 text-sm text-slate-400">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-cyan-400 font-medium mb-2">🛰️ Tracking Arrière-plan</h4>
                    <p>Activez le tracking pour enregistrer automatiquement votre position toutes les 5 minutes pendant votre sortie de chasse.</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-medium mb-2">🔔 Alertes de Proximité</h4>
                    <p>Recevez une notification lorsque vous approchez à 500m d'un waypoint (700m pour les hotspots).</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-emerald-400 font-medium mb-2">📊 Sessions de Chasse</h4>
                    <p>Le tracking calcule automatiquement la distance parcourue et le nombre de positions enregistrées.</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-medium mb-2">📱 Mode PWA</h4>
                    <p>Pour une meilleure expérience, installez HUNTIQ sur votre téléphone via "Ajouter à l'écran d'accueil".</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapPage;
