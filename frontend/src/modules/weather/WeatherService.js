/**
 * Weather Service - API client for weather module
 * Phase 10+ - Connected to real backend
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class WeatherService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/`);
      if (!response.ok) return { status: 'unavailable' };
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async getCurrentWeather(lat, lng) {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/current?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        return this.getPlaceholderWeather();
      }
      return response.json();
    } catch {
      return this.getPlaceholderWeather();
    }
  }

  static async getHuntingConditions(lat, lng, species = 'deer') {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/hunting-conditions?lat=${lat}&lng=${lng}&species=${species}`);
      if (!response.ok) {
        return this.getPlaceholderConditions();
      }
      return response.json();
    } catch {
      return this.getPlaceholderConditions();
    }
  }

  static async getHuntingScore(lat, lng, species = 'deer') {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/hunting-score?lat=${lat}&lng=${lng}&species=${species}`);
      if (!response.ok) return { score: 65 };
      return response.json();
    } catch {
      return { score: 65 };
    }
  }

  static async getForecast(lat, lng, days = 5) {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`);
      if (!response.ok) return { forecast: [] };
      return response.json();
    } catch {
      return { forecast: [] };
    }
  }

  static async getBestHuntingTimes(lat, lng, species = 'deer') {
    try {
      const response = await fetch(`${API_URL}/api/v1/weather/best-times?lat=${lat}&lng=${lng}&species=${species}`);
      if (!response.ok) return { times: [] };
      return response.json();
    } catch {
      return { times: [] };
    }
  }

  // Placeholder for graceful degradation
  static getPlaceholderWeather() {
    return {
      temperature: 8,
      feels_like: 5,
      humidity: 72,
      wind_speed: 12,
      wind_direction: 225,
      wind_direction_text: 'SW',
      pressure: 1015,
      condition: 'Partiellement nuageux',
      icon: '⛅',
      hunting_index: 72,
      last_updated: new Date().toISOString()
    };
  }

  static getPlaceholderConditions() {
    return {
      overall_score: 72,
      temperature_rating: 'good',
      wind_rating: 'moderate',
      pressure_rating: 'excellent',
      humidity_rating: 'good',
      recommendation: 'Conditions favorables pour la chasse à l\'affût',
      best_periods: ['06:00-08:00', '17:00-19:00'],
      factors: {
        temperature: { score: 75, impact: 'positive' },
        wind: { score: 65, impact: 'neutral' },
        pressure: { score: 85, impact: 'very_positive' },
        humidity: { score: 70, impact: 'positive' }
      }
    };
  }
}

export default WeatherService;
