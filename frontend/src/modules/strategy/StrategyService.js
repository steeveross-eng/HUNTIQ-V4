/**
 * Strategy Service - API client
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class StrategyService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/strategy/health`);
    return response.json();
  }

  static async getStrategies(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.species) searchParams.append('species', params.species);
    if (params.season) searchParams.append('season', params.season);
    
    const response = await fetch(`${API_URL}/api/v1/strategy/list?${searchParams}`);
    return response.json();
  }

  static async getStrategy(strategyId) {
    const response = await fetch(`${API_URL}/api/v1/strategy/${strategyId}`);
    return response.json();
  }

  static async generateStrategy(params) {
    const response = await fetch(`${API_URL}/api/v1/strategy/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  static async getRecommendedStrategy(conditions) {
    const response = await fetch(`${API_URL}/api/v1/strategy/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conditions)
    });
    return response.json();
  }
}

export default StrategyService;
