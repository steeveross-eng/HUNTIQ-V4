/**
 * TripHistory - List and manage past hunting trips
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar, Clock, Play, CheckCircle, XCircle, Target, Eye,
  Thermometer, Cloud, Loader2, ChevronRight, AlertTriangle
} from 'lucide-react';
import TripService from '@/services/TripService';

const WEATHER_OPTIONS = [
  { value: 'sunny', label: '☀️ Ensoleillé' },
  { value: 'cloudy', label: '☁️ Nuageux' },
  { value: 'overcast', label: '🌥️ Couvert' },
  { value: 'rainy', label: '🌧️ Pluvieux' },
  { value: 'snowy', label: '❄️ Neigeux' },
  { value: 'foggy', label: '🌫️ Brumeux' },
  { value: 'windy', label: '💨 Venteux' }
];

const SPECIES_EMOJIS = {
  deer: '🦌',
  moose: '🫎',
  bear: '🐻',
  turkey: '🦃',
  duck: '🦆',
  goose: '🪿',
  grouse: '🐔',
  rabbit: '🐰',
  coyote: '🐺',
  other: '🎯'
};

const STATUS_CONFIG = {
  planned: { label: 'Planifiée', color: 'bg-blue-600', icon: Calendar },
  in_progress: { label: 'En cours', color: 'bg-emerald-600', icon: Play },
  completed: { label: 'Terminée', color: 'bg-slate-600', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-600', icon: XCircle }
};

const TripHistory = ({ trips, onTripStarted, onRefresh }) => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleStartClick = (trip) => {
    setSelectedTrip(trip);
    setShowStartModal(true);
  };

  const plannedTrips = trips.filter(t => t.status === 'planned');
  const completedTrips = trips.filter(t => t.status === 'completed');
  const inProgressTrips = trips.filter(t => t.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* In Progress Trips */}
      {inProgressTrips.length > 0 && (
        <Card className="bg-emerald-900/20 border-emerald-700">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <Play className="h-5 w-5" />
              Sorties en cours ({inProgressTrips.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inProgressTrips.map((trip) => (
                <TripCard key={trip.trip_id} trip={trip} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planned Trips */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sorties planifiées ({plannedTrips.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plannedTrips.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune sortie planifiée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plannedTrips.map((trip) => (
                <TripCard 
                  key={trip.trip_id} 
                  trip={trip} 
                  onStartClick={() => handleStartClick(trip)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Trips */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Historique ({completedTrips.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTrips.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune sortie terminée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTrips.slice(0, 10).map((trip) => (
                <TripCard key={trip.trip_id} trip={trip} />
              ))}
              {completedTrips.length > 10 && (
                <p className="text-center text-sm text-gray-500">
                  Et {completedTrips.length - 10} autres sorties...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Trip Modal */}
      {selectedTrip && (
        <StartTripModal
          open={showStartModal}
          onClose={() => {
            setShowStartModal(false);
            setSelectedTrip(null);
          }}
          trip={selectedTrip}
          onTripStarted={onTripStarted}
        />
      )}
    </div>
  );
};

// Trip Card Component
const TripCard = ({ trip, onStartClick }) => {
  const statusConfig = STATUS_CONFIG[trip.status] || STATUS_CONFIG.planned;
  const StatusIcon = statusConfig.icon;
  const plannedDate = trip.planned_date ? new Date(trip.planned_date) : null;

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
      <div className="text-3xl">
        {SPECIES_EMOJIS[trip.target_species] || '🎯'}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-medium truncate">{trip.title}</h4>
          <Badge className={`${statusConfig.color} text-xs`}>
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {plannedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(plannedDate, 'dd MMM yyyy', { locale: fr })}
            </span>
          )}
          {trip.duration_hours > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {trip.duration_hours}h
            </span>
          )}
          {trip.observations_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {trip.observations_count} obs.
            </span>
          )}
          {trip.status === 'completed' && (
            trip.success ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                Succès
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <XCircle className="h-3 w-3" />
                Sans succès
              </span>
            )
          )}
        </div>
      </div>

      {trip.status === 'planned' && onStartClick && (
        <Button
          size="sm"
          onClick={onStartClick}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Play className="h-4 w-4 mr-1" />
          Démarrer
        </Button>
      )}
    </div>
  );
};

// Start Trip Modal
const StartTripModal = ({ open, onClose, trip, onTripStarted }) => {
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState('cloudy');
  const [temperature, setTemperature] = useState('');

  const handleStart = async () => {
    setLoading(true);

    try {
      const result = await TripService.startTrip(trip.trip_id, {
        actual_weather: weather,
        temperature: temperature ? parseFloat(temperature) : null
      });

      if (result.success) {
        onTripStarted(result.trip);
        onClose();
      } else {
        toast.error(result.detail || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-emerald-400" />
            Démarrer la Sortie
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {trip.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Weather */}
          <div className="space-y-2">
            <Label className="text-gray-300">Conditions météo actuelles</Label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {WEATHER_OPTIONS.map((w) => (
                  <SelectItem key={w.value} value={w.value} className="text-white">
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label className="text-gray-300">Température (°C)</Label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="bg-slate-800 border-slate-600 pl-10"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p>Une fois démarrée, vous pourrez:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Ajouter des observations</li>
                <li>Logger vos visites de waypoints</li>
                <li>Suivre le temps écoulé</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleStart}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  C'est parti!
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripHistory;
