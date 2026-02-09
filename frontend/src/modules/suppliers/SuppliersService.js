/**
 * Suppliers Service - API client for suppliers module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class SuppliersService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/suppliers/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/suppliers/stats`);
    return response.json();
  }

  static async getSuppliers(isActive = null) {
    let url = `${API_URL}/api/v1/suppliers/`;
    if (isActive !== null) {
      url += `?is_active=${isActive}`;
    }
    const response = await fetch(url);
    return response.json();
  }

  static async getSupplier(supplierId) {
    const response = await fetch(`${API_URL}/api/v1/suppliers/${supplierId}`);
    if (!response.ok) return null;
    return response.json();
  }

  static async createSupplier(supplierData) {
    const response = await fetch(`${API_URL}/api/v1/suppliers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierData)
    });
    return response.json();
  }

  static async updateSupplier(supplierId, updateData) {
    const response = await fetch(`${API_URL}/api/v1/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  static async deleteSupplier(supplierId) {
    const response = await fetch(`${API_URL}/api/v1/suppliers/${supplierId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Helper methods
  static formatSupplierType(type) {
    const types = {
      'manufacturer': 'Fabricant',
      'distributor': 'Distributeur',
      'retailer': 'Détaillant',
      'dropshipper': 'Dropshipper'
    };
    return types[type] || type;
  }

  static getSupplierStatusColor(isActive) {
    return isActive ? 'emerald' : 'red';
  }
}

export default SuppliersService;
