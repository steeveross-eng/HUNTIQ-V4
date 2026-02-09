/**
 * Weather Service - API client for weather module
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class WeatherService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/weather/health`);
    return response.json();
  }

  static async getCurrentWeather(lat, lng) {
    const response = await fetch(
      `${API_URL}/api/v1/weather/current?lat=${lat}&lng=${lng}`
    );
    return response.json();
  }

  static async getForecast(lat, lng, days = 7) {
    const response = await fetch(
      `${API_URL}/api/v1/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`
    );
    return response.json();
  }

  static async getHuntingConditions(lat, lng, species) {
    const params = new URLSearchParams({ lat, lng });
    if (species) params.append('species', species);
    
    const response = await fetch(
      `${API_URL}/api/v1/weather/hunting-conditions?${params}`
    );
    return response.json();
  }

  static async getWindData(lat, lng) {
    const response = await fetch(
      `${API_URL}/api/v1/weather/wind?lat=${lat}&lng=${lng}`
    );
    return response.json();
  }
}

export default WeatherService;
