/**
 * PlanMaitreDashboard - Central dashboard for Plan Maître modules
 * Phase 10 - Plan Maître Integration
 * Updated: Phase 8 - Added Legal Time Engine integration
 * Version: 1.1.0 - BIONIC Design System Compliance
 */
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Rocket, BarChart3, Clock, Sparkles, CircleDot, Map, Users,
  MapPin, FileText, AlertTriangle, Calendar, Eye, Edit, Megaphone
} from 'lucide-react';

// Plan Maître Module Imports
import { RecommendationPanel } from '../recommendation';
import { WildlifeTracker, SpeciesSelector } from '../wildlife';
import { TerritoryList, WaypointManager } from '../territory';
import { PredictiveWidget } from '../predictive';
import { SightingsFeed } from '../collaborative';
import { HabitatAnalysis } from '../ecoforestry';
import { ActivityChart } from '../behavioral';
import { LegalTimeWidget, LegalTimeBar } from '../legaltime';

const DEFAULT_COORDS = { lat: 46.8139, lng: -71.2082 }; // Quebec City

export const PlanMaitreDashboard = ({ 
  coordinates = DEFAULT_COORDS
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSpecies, setSelectedSpecies] = useState('deer');
  const [selectedSeason, setSelectedSeason] = useState('rut');

  const handleSpeciesChange = useCallback((species) => {
    setSelectedSpecies(species);
  }, []);

  return (
    <div className="space-y-6" data-testid="plan-maitre-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--bionic-text-primary)] flex items-center gap-3">
            <Rocket className="h-7 w-7 text-[var(--bionic-gold-primary)]" />
            {t('plan_maitre_title') || 'Plan Maître BIONIC™'}
          </h1>
          <p className="text-[var(--bionic-text-secondary)] text-sm mt-1">
            {t('plan_maitre_subtitle') || 'Modules Avancés'} • Phase 10
          </p>
        </div>
        
        {/* Module Status */}
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--bionic-gold-muted)] text-[var(--bionic-gold-primary)]">legal-time</Badge>
          <Badge className="bg-[var(--bionic-gold-muted)] text-[var(--bionic-gold-light)]">recommendation</Badge>
          <Badge className="bg-[var(--bionic-green-muted)] text-[var(--bionic-green-primary)]">wildlife</Badge>
          <Badge className="bg-[var(--bionic-blue-muted)] text-[var(--bionic-blue-light)]">predictive</Badge>
          <Badge className="bg-[var(--bionic-purple-muted)] text-[var(--bionic-purple-primary)]">collaborative</Badge>
        </div>
      </div>

      {/* Species Selector */}
      <Card className="bg-[var(--bionic-bg-card)] border-[var(--bionic-border-secondary)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[var(--bionic-text-secondary)] text-sm">{t('common_target_species') || 'Espèce cible'}:</span>
            <SpeciesSelector 
              selected={selectedSpecies}
              onSelect={handleSpeciesChange}
              showCategories={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Time Status Bar */}
      <LegalTimeBar coordinates={coordinates} />

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[var(--bionic-bg-card)] border border-[var(--bionic-border-secondary)] w-full justify-start flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <BarChart3 className="h-4 w-4" /> {t('common_overview') || "Vue d'ensemble"}
          </TabsTrigger>
          <TabsTrigger value="legal-times" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <Clock className="h-4 w-4" /> {t('legal_times') || 'Heures Légales'}
          </TabsTrigger>
          <TabsTrigger value="prediction" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <Sparkles className="h-4 w-4" /> {t('common_prediction') || 'Prédiction'}
          </TabsTrigger>
          <TabsTrigger value="wildlife" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <CircleDot className="h-4 w-4" /> {t('common_wildlife') || 'Faune'}
          </TabsTrigger>
          <TabsTrigger value="territory" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <Map className="h-4 w-4" /> {t('common_territory') || 'Territoire'}
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-[var(--bionic-gold-primary)] data-[state=active]:text-black gap-2">
            <Users className="h-4 w-4" /> {t('common_community') || 'Communauté'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <LegalTimeWidget 
                coordinates={coordinates}
                compact={true}
              />
              <RecommendationPanel 
                species={selectedSpecies}
                season={selectedSeason}
              />
            </div>

            {/* Center Column */}
            <div className="space-y-4">
              <PredictiveWidget 
                species={selectedSpecies}
                coordinates={coordinates}
                compact={false}
              />
              
              <ActivityChart 
                species={selectedSpecies}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <WildlifeTracker 
                species={selectedSpecies}
                coordinates={coordinates}
              />
              
              <SightingsFeed 
                coordinates={coordinates}
                radiusKm={15}
              />
            </div>
          </div>
        </TabsContent>

        {/* Legal Times Tab - NEW */}
        <TabsContent value="legal-times" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LegalTimeWidget 
              coordinates={coordinates}
              showSlots={true}
            />
            
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <span>📍</span>
                    Position de calcul
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Latitude</p>
                        <p className="text-white font-medium">{coordinates.lat.toFixed(4)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Longitude</p>
                        <p className="text-white font-medium">{coordinates.lng.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Région</p>
                      <p className="text-white font-medium">Québec, QC, Canada</p>
                    </div>
                    <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                      <p className="text-amber-400 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        Les heures légales varient selon votre position exacte
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <span>📜</span>
                    Règlementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-purple-400 font-medium mb-1">Période de chasse légale</p>
                      <p className="text-slate-300">
                        30 minutes avant le lever du soleil jusqu'à 30 minutes après le coucher du soleil
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-purple-400 font-medium mb-1">Source</p>
                      <p className="text-slate-300">
                        Règlement sur la chasse du Québec - MFFP
                      </p>
                    </div>
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                      <p className="text-red-400 text-xs flex items-center gap-2">
                        <span>⚠️</span>
                        La chasse en dehors des heures légales est une infraction grave
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Prediction Tab */}
        <TabsContent value="prediction" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PredictiveWidget 
                species={selectedSpecies}
                coordinates={coordinates}
              />
            </div>

            <div className="space-y-4">
              <LegalTimeWidget 
                coordinates={coordinates}
                showSlots={true}
              />
              
              <ActivityChart 
                species={selectedSpecies}
              />
            </div>
          </div>
        </TabsContent>

        {/* Wildlife Tab */}
        <TabsContent value="wildlife" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <WildlifeTracker 
                species={selectedSpecies}
                coordinates={coordinates}
              />
              
              <ActivityChart 
                species={selectedSpecies}
              />
            </div>

            <div className="space-y-4">
              <HabitatAnalysis 
                coordinates={coordinates}
                species={selectedSpecies}
              />
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <span>📅</span>
                    Comportement Saisonnier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {['Pré-rut', 'Rut', 'Post-rut', 'Hiver'].map((season, i) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season.toLowerCase().replace('-', '_'))}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedSeason === season.toLowerCase().replace('-', '_')
                            ? 'bg-[#f5a623] text-black'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        <div className="font-medium">{season}</div>
                        <div className="text-xs opacity-75">
                          {['Sept-Oct', 'Nov', 'Déc', 'Jan-Mar'][i]}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Territory Tab */}
        <TabsContent value="territory" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Waypoint Manager - Principal */}
              <WaypointManager coordinates={coordinates} />
              
              <TerritoryList showFilters={true} />
            </div>

            <div className="space-y-4">
              <HabitatAnalysis 
                coordinates={coordinates}
                species={selectedSpecies}
              />
              
              <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-700/50">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <span>📍</span>
                    Position actuelle
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Latitude</span>
                      <span className="text-white">{coordinates.lat.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Longitude</span>
                      <span className="text-white">{coordinates.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SightingsFeed 
              coordinates={coordinates}
              radiusKm={25}
              limit={15}
            />

            <div className="space-y-4">
              <RecommendationPanel 
                species={selectedSpecies}
                season={selectedSeason}
              />
              
              <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-700/50">
                <CardContent className="p-4">
                  <h4 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">
                    <span>📢</span>
                    Contribuer
                  </h4>
                  <div className="space-y-2">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      👁️ Signaler une observation
                    </Button>
                    <Button variant="outline" className="w-full border-emerald-700 text-emerald-400">
                      📝 Soumettre un rapport
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanMaitreDashboard;
