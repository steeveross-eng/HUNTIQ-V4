/**
 * Nutrition Service - API client for nutrition module
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class NutritionService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/nutrition/health`);
    return response.json();
  }

  static async analyzeProduct(productId) {
    const response = await fetch(`${API_URL}/api/v1/nutrition/analyze/${productId}`);
    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
  }

  static async getRecommendations(species, season) {
    const params = new URLSearchParams();
    if (species) params.append('species', species);
    if (season) params.append('season', season);
    
    const response = await fetch(`${API_URL}/api/v1/nutrition/recommendations?${params}`);
    return response.json();
  }

  static async compareProducts(productIds) {
    const response = await fetch(`${API_URL}/api/v1/nutrition/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: productIds })
    });
    return response.json();
  }

  static async getNutritionProfile(productId) {
    const response = await fetch(`${API_URL}/api/v1/nutrition/profile/${productId}`);
    return response.json();
  }
}

export default NutritionService;
