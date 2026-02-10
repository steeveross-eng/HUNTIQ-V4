/**
 * MapPage - Interactive Map Page for Waypoints
 * Phase P3.2 - Interactive Map
 */
import React from 'react';
import { WaypointMap } from '../modules/territory';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            Carte Interactive
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gérez vos waypoints de chasse sur la carte • Phase P3
          </p>
        </div>
        <WaypointMap />
      </div>
    </div>
  );
};

export default MapPage;
