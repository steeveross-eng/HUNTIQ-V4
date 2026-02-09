/**
 * Cart Service - API client for cart module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class CartService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/cart/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/cart/stats`);
    return response.json();
  }

  static async getCart(sessionId) {
    const response = await fetch(`${API_URL}/api/v1/cart/session/${sessionId}`);
    return response.json();
  }

  static async addItem(sessionId, productId, quantity = 1) {
    const response = await fetch(`${API_URL}/api/v1/cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, product_id: productId, quantity })
    });
    return response.json();
  }

  static async updateItem(itemId, quantity) {
    const response = await fetch(`${API_URL}/api/v1/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  }

  static async removeItem(itemId) {
    const response = await fetch(`${API_URL}/api/v1/cart/${itemId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  static async clearCart(sessionId) {
    const response = await fetch(`${API_URL}/api/v1/cart/session/${sessionId}/clear`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Helper methods
  static getSessionId() {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = 'cart_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }

  static calculateTotal(items) {
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  static getItemCount(items) {
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}

export default CartService;
