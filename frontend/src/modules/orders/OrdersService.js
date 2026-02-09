/**
 * Orders Service - API client for orders module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class OrdersService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/orders/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/orders/stats`);
    return response.json();
  }

  static async getOrders(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.sale_mode) params.append('sale_mode', options.sale_mode);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`${API_URL}/api/v1/orders/?${params}`);
    return response.json();
  }

  static async getOrder(orderId) {
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`);
    if (!response.ok) return null;
    return response.json();
  }

  static async createOrder(orderData) {
    const response = await fetch(`${API_URL}/api/v1/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Order creation failed');
    }
    return response.json();
  }

  static async updateOrderStatus(orderId, status, notes = '') {
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return response.json();
  }

  static async cancelOrder(orderId, reason, refund_requested = false) {
    const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, refund_requested })
    });
    return response.json();
  }

  // Commissions
  static async getCommissions(options = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.commission_type) params.append('commission_type', options.commission_type);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`${API_URL}/api/v1/orders/commissions/?${params}`);
    return response.json();
  }

  static async markCommissionPaid(commissionId) {
    const response = await fetch(`${API_URL}/api/v1/orders/commissions/${commissionId}/pay`, {
      method: 'PUT'
    });
    return response.json();
  }
}

export default OrdersService;
