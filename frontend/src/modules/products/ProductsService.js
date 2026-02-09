/**
 * Products Service - API client for products module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class ProductsService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/products/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/products/stats`);
    return response.json();
  }

  static async getProducts(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.animal_type) params.append('animal_type', options.animal_type);
    if (options.season) params.append('season', options.season);
    if (options.sale_mode) params.append('sale_mode', options.sale_mode);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`${API_URL}/api/v1/products/?${params}`);
    return response.json();
  }

  static async getTopProducts(limit = 5) {
    const response = await fetch(`${API_URL}/api/v1/products/top?limit=${limit}`);
    return response.json();
  }

  static async getFilterOptions() {
    const response = await fetch(`${API_URL}/api/v1/products/filters/options`);
    return response.json();
  }

  static async getProduct(productId) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}`);
    if (!response.ok) return null;
    return response.json();
  }

  static async createProduct(productData) {
    const response = await fetch(`${API_URL}/api/v1/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  }

  static async updateProduct(productId, updateData) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  static async deleteProduct(productId) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  static async searchProducts(searchRequest) {
    const response = await fetch(`${API_URL}/api/v1/products/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchRequest)
    });
    return response.json();
  }

  static async trackAnalyze(productId) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}/track/analyze`, {
      method: 'POST'
    });
    return response.json();
  }

  static async trackCompare(productId) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}/track/compare`, {
      method: 'POST'
    });
    return response.json();
  }

  static async trackClick(productId) {
    const response = await fetch(`${API_URL}/api/v1/products/${productId}/track/click`, {
      method: 'POST'
    });
    return response.json();
  }
}

export default ProductsService;
