/**
 * Affiliate Service - API client for affiliate module
 * Phase 9 - Business Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class AffiliateService {
  static async getHealth() {
    const response = await fetch(`${API_URL}/api/v1/affiliate/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_URL}/api/v1/affiliate/stats`);
    return response.json();
  }

  static async recordClick(productId, sessionId) {
    const params = new URLSearchParams({ product_id: productId, session_id: sessionId });
    const response = await fetch(`${API_URL}/api/v1/affiliate/click?${params}`, {
      method: 'POST'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to record click');
    }
    return response.json();
  }

  static async getClicks(limit = 500) {
    const response = await fetch(`${API_URL}/api/v1/affiliate/clicks?limit=${limit}`);
    return response.json();
  }

  static async confirmSale(clickId, commissionAmount) {
    const response = await fetch(`${API_URL}/api/v1/affiliate/confirm/${clickId}?commission_amount=${commissionAmount}`, {
      method: 'POST'
    });
    return response.json();
  }

  // Helper methods
  static getSessionId() {
    let sessionId = localStorage.getItem('affiliate_session_id');
    if (!sessionId) {
      sessionId = 'aff_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('affiliate_session_id', sessionId);
    }
    return sessionId;
  }

  static async trackAndRedirect(productId, affiliateUrl) {
    const sessionId = this.getSessionId();
    try {
      const result = await this.recordClick(productId, sessionId);
      if (result.success && result.redirect_url) {
        window.open(result.redirect_url, '_blank');
      } else if (affiliateUrl) {
        window.open(affiliateUrl, '_blank');
      }
      return result;
    } catch (error) {
      // Fallback to direct URL on error
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank');
      }
      throw error;
    }
  }
}

export default AffiliateService;
