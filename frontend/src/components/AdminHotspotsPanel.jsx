/**
 * AdminHotspotsPanel - Hotspots Administration Panel
 * Phase P6.5 - Integrated in Admin "Terres à louer" tab
 * 
 * ⚠️ ADMIN ONLY - Cette section n'est jamais visible par les utilisateurs réguliers
 * ⚠️ CONFIDENTIALITÉ: Les hotspots personnels des utilisateurs sont EXCLUS
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { MapPin, ExternalLink, Filter, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Hotspot category colors
const CATEGORY_COLORS = {
  standard: 'bg-gray-500',
  premium: 'bg-amber-500',
  land_rental: 'bg-emerald-500',
  environmental: 'bg-blue-500',
  inactive: 'bg-red-500'
};

// Category labels in French
const CATEGORY_LABELS = {
  standard: 'Hotspot standard',
  premium: 'Hotspot premium',
  land_rental: 'Hotspot Terre à louer',
  environmental: 'Hotspot environnemental',
  inactive: 'Hotspot inactif'
};

// Category icons
const CATEGORY_ICONS = {
  standard: '📍',
  premium: '⭐',
  land_rental: '🏠',
  environmental: '🌲',
  inactive: '⏸️'
};

const AdminHotspotsPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hotspots, setHotspots] = useState([]);
  const [hotspotStats, setHotspotStats] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expanded, setExpanded] = useState(true);

  // Load hotspots (admin only - excludes user personal hotspots)
  const loadHotspots = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/admin/geo/hotspots?limit=100`;
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setHotspots(data.hotspots || []);
      setHotspotStats(data.by_category || {});
    } catch (error) {
      console.error('Error loading hotspots:', error);
      toast.error('Erreur lors du chargement des hotspots');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  // Initial load
  useEffect(() => {
    loadHotspots();
  }, [loadHotspots]);

  // Navigate to map centered on hotspot
  const viewOnMap = (hotspot) => {
    if (hotspot.latitude && hotspot.longitude) {
      navigate(`/map?lat=${hotspot.latitude}&lng=${hotspot.longitude}&zoom=17`);
    } else {
      toast.error('Coordonnées non disponibles');
    }
  };

  // Open full admin page
  const openFullAdmin = () => {
    navigate('/admin/geo');
  };

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Gestion des Hotspots
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={openFullAdmin}
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Vue complète
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-amber-400 text-sm mt-1">
            ⚠️ Les hotspots personnels des utilisateurs sont exclus (confidentialité)
          </p>
        </CardHeader>
      </Card>

      {expanded && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Card key={key} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">{label}</p>
                      <p className="text-xl font-bold text-white">{hotspotStats[key] || 0}</p>
                    </div>
                    <span className="text-2xl">{CATEGORY_ICONS[key]}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hotspots List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  Hotspots Administratifs ({hotspots.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    className="bg-slate-700 text-white px-2 py-1 rounded text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Toutes</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="land_rental">Terre à louer</option>
                    <option value="environmental">Environnemental</option>
                    <option value="inactive">Inactif</option>
                  </select>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={loadHotspots}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Chargement...</div>
              ) : hotspots.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Aucun hotspot administratif trouvé.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-slate-400 pb-2 font-medium">Nom</th>
                        <th className="text-slate-400 pb-2 font-medium">Catégorie</th>
                        <th className="text-slate-400 pb-2 font-medium">GPS</th>
                        <th className="text-slate-400 pb-2 font-medium">Statut</th>
                        <th className="text-slate-400 pb-2 font-medium">Confiance</th>
                        <th className="text-slate-400 pb-2 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotspots.slice(0, 10).map((hotspot) => (
                        <tr key={hotspot.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span>{CATEGORY_ICONS[hotspot.category] || '📍'}</span>
                              <span className="text-white">{hotspot.name}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge className={CATEGORY_COLORS[hotspot.category]}>
                              {hotspot.category_label}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-400 font-mono text-xs">
                            {hotspot.latitude?.toFixed(4)}, {hotspot.longitude?.toFixed(4)}
                          </td>
                          <td className="py-3">
                            <span className={hotspot.active ? 'text-emerald-400' : 'text-red-400'}>
                              {hotspot.status}
                            </span>
                          </td>
                          <td className="py-3">
                            {hotspot.confidence ? (
                              <Badge className={hotspot.confidence > 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}>
                                {(hotspot.confidence * 100).toFixed(0)}%
                              </Badge>
                            ) : '-'}
                          </td>
                          <td className="py-3">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 h-7 px-2"
                              onClick={() => viewOnMap(hotspot)}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Carte
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {hotspots.length > 10 && (
                    <div className="mt-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={openFullAdmin}
                      >
                        Voir les {hotspots.length - 10} autres hotspots
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminHotspotsPanel;
