/**
 * ForecastPage - Success Forecast & WQS Dashboard
 * Phase P3 - Waypoint Scoring
 */
import React from 'react';
import { SuccessForecast } from '../components/SuccessForecast';

const ForecastPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Prévision de Succès
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Waypoint Quality Score (WQS) et recommandations IA • Phase P3
          </p>
        </div>
        <SuccessForecast />
      </div>
    </div>
  );
};

export default ForecastPage;
