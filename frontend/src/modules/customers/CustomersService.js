/**
 * Customers Service - API client for customers module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class CustomersService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/customers/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/customers/stats`);
    return response.json();
  }

  static async getCustomers() {
    const response = await fetch(`${API_URL}/api/v1/customers/`);
    return response.json();
  }

  static async getCustomer(customerId) {
    const response = await fetch(`${API_URL}/api/v1/customers/${customerId}`);
    if (!response.ok) return null;
    return response.json();
  }

  static async getCustomerBySession(sessionId) {
    const response = await fetch(`${API_URL}/api/v1/customers/session/${sessionId}`);
    if (!response.ok) return null;
    return response.json();
  }

  static async createCustomer(customerData) {
    const response = await fetch(`${API_URL}/api/v1/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return response.json();
  }

  static async updateCustomer(customerId, updateData) {
    const response = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  // Helper methods
  static getSessionId() {
    let sessionId = localStorage.getItem('customer_session_id');
    if (!sessionId) {
      sessionId = 'cust_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('customer_session_id', sessionId);
    }
    return sessionId;
  }

  static formatCustomerStatus(status) {
    const statuses = {
      'new': 'Nouveau',
      'active': 'Actif',
      'inactive': 'Inactif',
      'vip': 'VIP'
    };
    return statuses[status] || status;
  }

  static getStatusColor(status) {
    const colors = {
      'new': 'blue',
      'active': 'emerald',
      'inactive': 'slate',
      'vip': 'amber'
    };
    return colors[status] || 'slate';
  }
}

export default CustomersService;
