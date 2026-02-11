/**
 * ForecastPage - Success Forecast & WQS Dashboard
 * Phase P3 - Waypoint Scoring
 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SuccessForecast } from '../components/SuccessForecast';
import { Target } from 'lucide-react';

const ForecastPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="h-7 w-7 text-[#f5a623]" />
            {t('forecast_title')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Waypoint Quality Score (WQS) • Phase P3
          </p>
        </div>
        <SuccessForecast />
      </div>
    </div>
  );
};

export default ForecastPage;
