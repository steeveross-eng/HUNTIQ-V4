/**
 * AI Service - API client for AI module
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class AIService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/ai/health`);
    return response.json();
  }

  static async analyzeProduct(productId, options = {}) {
    const response = await fetch(`${API_URL}/api/v1/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, ...options })
    });
    return response.json();
  }

  static async chat(message, context = {}) {
    const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });
    return response.json();
  }

  static async getRecommendations(params) {
    const response = await fetch(`${API_URL}/api/v1/ai/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  static async getInsights(data) {
    const response = await fetch(`${API_URL}/api/v1/ai/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export default AIService;
