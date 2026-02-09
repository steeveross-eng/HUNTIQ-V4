/**
 * Recommendation Service - API client for recommendation engine
 * Phase 10 - Plan Maître Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class RecommendationService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/`);
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async getProductRecommendations(request) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) return { success: false, data: { recommendations: [] } };
      return response.json();
    } catch {
      return { success: false, data: { recommendations: [] } };
    }
  }

  static async getStrategyRecommendations(species, conditions = {}) {
    try {
      const params = new URLSearchParams({ species });
      if (conditions.season) params.append('season', conditions.season);
      if (conditions.temperature) params.append('temperature', conditions.temperature);
      if (conditions.wind_speed) params.append('wind_speed', conditions.wind_speed);
      
      const response = await fetch(`${API_URL}/api/v1/recommendation/strategies?${params}`);
      if (!response.ok) return { success: false, data: { strategies: [] } };
      return response.json();
    } catch {
      return { success: false, data: { strategies: [] } };
    }
  }

  static async getSimilarProducts(productId, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/similar/${productId}?limit=${limit}`);
      if (!response.ok) return { success: false, similar_products: [] };
      return response.json();
    } catch {
      return { success: false, similar_products: [] };
    }
  }

  static async getComplementaryProducts(productId, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/complementary/${productId}?limit=${limit}`);
      if (!response.ok) return { success: false, complementary_products: [] };
      return response.json();
    } catch {
      return { success: false, complementary_products: [] };
    }
  }

  static async getContextualRecommendations(species, season, options = {}) {
    try {
      const params = new URLSearchParams({ species, season });
      if (options.temperature) params.append('temperature', options.temperature);
      if (options.humidity) params.append('humidity', options.humidity);
      if (options.wind_speed) params.append('wind_speed', options.wind_speed);
      if (options.lat) params.append('lat', options.lat);
      if (options.lng) params.append('lng', options.lng);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await fetch(`${API_URL}/api/v1/recommendation/for-context?${params}`);
      if (!response.ok) return { success: false, data: { recommendations: [] } };
      return response.json();
    } catch {
      return { success: false, data: { recommendations: [] } };
    }
  }

  static async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/personalized/${userId}?limit=${limit}`);
      if (!response.ok) return { success: false, data: { recommendations: [] } };
      return response.json();
    } catch {
      return { success: false, data: { recommendations: [] } };
    }
  }

  static async submitFeedback(feedback) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      return response.json();
    } catch {
      return { success: false };
    }
  }

  static async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_URL}/api/v1/recommendation/profile/${userId}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }
}

export default RecommendationService;
