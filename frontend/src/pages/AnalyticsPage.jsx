/**
 * AnalyticsPage - Phase P3 Analytics Dashboard Page
 */
import React from 'react';
import { AnalyticsDashboard } from '../modules/analytics';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
