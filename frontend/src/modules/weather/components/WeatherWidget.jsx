/**
 * WeatherWidget - Compact weather display
 * BIONIC Design System compliant
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { WeatherService } from '../WeatherService';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudFog, Wind, CloudSun } from 'lucide-react';

// Weather icons - BIONIC Design System (Lucide components)
const WeatherIcon = ({ condition, className = "h-8 w-8" }) => {
  const conditionLower = condition?.toLowerCase() || '';
  
  const iconMap = {
    clear: { Icon: Sun, color: '#f5a623' },
    sunny: { Icon: Sun, color: '#f5a623' },
    cloudy: { Icon: Cloud, color: '#9ca3af' },
    partly_cloudy: { Icon: CloudSun, color: '#f59e0b' },
    rain: { Icon: CloudRain, color: '#3b82f6' },
    snow: { Icon: Snowflake, color: '#06b6d4' },
    storm: { Icon: CloudLightning, color: '#8b5cf6' },
    fog: { Icon: CloudFog, color: '#6b7280' },
    wind: { Icon: Wind, color: '#64748b' }
  };
  
  const { Icon, color } = iconMap[conditionLower] || { Icon: CloudSun, color: '#f59e0b' };
  return <Icon className={className} style={{ color }} />;
};

export const WeatherWidget = ({ 
  lat, 
  lng, 
  compact = false,
  onWeatherLoad
}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }

      try {
        const data = await WeatherService.getCurrentWeather(lat, lng);
        setWeather(data);
        onWeatherLoad?.(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, onWeatherLoad]);

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-24" />
              <div className="h-3 bg-slate-700 rounded w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4 text-center text-slate-400">
          <CloudSun className="h-8 w-8 text-[#f5a623] mx-auto" />
          <p className="text-sm mt-2">Météo indisponible</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2">
        <WeatherIcon condition={weather.condition} className="h-6 w-6" />
        <div>
          <span className="text-white font-bold">{weather.temperature || '--'}°C</span>
          <span className="text-slate-400 text-xs ml-2">{weather.condition}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon condition={weather.condition} className="h-10 w-10" />
            <div>
              <div className="text-3xl font-bold text-white">
                {weather.temperature || '--'}°C
              </div>
              <div className="text-slate-400 text-sm capitalize">
                {weather.condition || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            {weather.humidity !== undefined && (
              <div className="text-sm">
                <span className="text-slate-400">Humidité:</span>
                <span className="text-blue-400 ml-2">{weather.humidity}%</span>
              </div>
            )}
            {weather.wind_speed !== undefined && (
              <div className="text-sm">
                <span className="text-slate-400">Vent:</span>
                <span className="text-cyan-400 ml-2">{weather.wind_speed} km/h</span>
              </div>
            )}
            {weather.pressure !== undefined && (
              <div className="text-sm">
                <span className="text-slate-400">Pression:</span>
                <span className="text-purple-400 ml-2">{weather.pressure} hPa</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
