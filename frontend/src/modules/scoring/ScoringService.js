/**
 * Scoring Service - API client for scoring module
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class ScoringService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/scoring/health`);
    return response.json();
  }

  static async calculateScore(params) {
    const response = await fetch(`${API_URL}/api/v1/scoring/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  static async getProductScore(productId) {
    const response = await fetch(`${API_URL}/api/v1/scoring/product/${productId}`);
    return response.json();
  }

  static async getRankings(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`${API_URL}/api/v1/scoring/rankings?${params}`);
    return response.json();
  }

  static async getScoreBreakdown(productId) {
    const response = await fetch(`${API_URL}/api/v1/scoring/breakdown/${productId}`);
    return response.json();
  }
}

export default ScoringService;
