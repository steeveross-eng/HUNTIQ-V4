/**
 * Predictive Service - API client for predictive analytics
 * Phase 10 - Plan Maître Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class PredictiveService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/predictive/`);
      if (!response.ok) return { status: 'unavailable' };
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async predictHuntingSuccess(params) {
    try {
      const queryParams = new URLSearchParams();
      if (params.species) queryParams.append('species', params.species);
      if (params.date) queryParams.append('date', params.date);
      if (params.lat) queryParams.append('lat', params.lat);
      if (params.lng) queryParams.append('lng', params.lng);
      if (params.weather) queryParams.append('weather', JSON.stringify(params.weather));
      
      const response = await fetch(`${API_URL}/api/v1/predictive/success?${queryParams}`);
      if (!response.ok) return { success: false, prediction: null };
      return response.json();
    } catch {
      return { success: false, prediction: null };
    }
  }

  static async getOptimalTimes(species, date, location) {
    try {
      const params = new URLSearchParams({ species, date });
      if (location) {
        params.append('lat', location.lat);
        params.append('lng', location.lng);
      }
      
      const response = await fetch(`${API_URL}/api/v1/predictive/optimal-times?${params}`);
      if (!response.ok) return { success: false, times: [] };
      return response.json();
    } catch {
      return { success: false, times: [] };
    }
  }

  static async getActivityForecast(species, days = 7) {
    try {
      const response = await fetch(`${API_URL}/api/v1/predictive/forecast/${species}?days=${days}`);
      if (!response.ok) return { success: false, forecast: [] };
      return response.json();
    } catch {
      return { success: false, forecast: [] };
    }
  }

  // Placeholder predictions
  static getPlaceholderPrediction() {
    return {
      success_probability: 68,
      confidence: 0.85,
      factors: [
        { name: 'Météo', impact: 'positive', score: 75 },
        { name: 'Phase lunaire', impact: 'neutral', score: 50 },
        { name: 'Pression atmosphérique', impact: 'positive', score: 82 },
        { name: 'Saison', impact: 'very_positive', score: 90 },
        { name: 'Activité récente', impact: 'positive', score: 70 }
      ],
      optimal_times: [
        { period: 'Aube', time: '06:00-08:00', score: 92 },
        { period: 'Crépuscule', time: '16:30-18:30', score: 88 },
        { period: 'Mi-journée', time: '11:00-13:00', score: 45 }
      ],
      recommendation: 'Conditions favorables pour la chasse à l\'affût en matinée'
    };
  }
}

export default PredictiveService;
