/**
 * Collaborative Service - API client for collaborative sharing
 * Phase 10 - Plan Maître Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class CollaborativeService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/collaborative/`);
      if (!response.ok) return { status: 'unavailable' };
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async getSharedSpots(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.species) params.append('species', options.species);
      if (options.region) params.append('region', options.region);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await fetch(`${API_URL}/api/v1/collaborative/spots?${params}`);
      if (!response.ok) return { success: false, spots: [] };
      return response.json();
    } catch {
      return { success: false, spots: [] };
    }
  }

  static async shareSpot(spotData) {
    try {
      const response = await fetch(`${API_URL}/api/v1/collaborative/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData)
      });
      return response.json();
    } catch {
      return { success: false };
    }
  }

  static async getHuntingReports(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.species) params.append('species', options.species);
      if (options.date_from) params.append('date_from', options.date_from);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await fetch(`${API_URL}/api/v1/collaborative/reports?${params}`);
      if (!response.ok) return { success: false, reports: [] };
      return response.json();
    } catch {
      return { success: false, reports: [] };
    }
  }

  static async submitReport(reportData) {
    try {
      const response = await fetch(`${API_URL}/api/v1/collaborative/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      return response.json();
    } catch {
      return { success: false };
    }
  }

  static async getSightings(lat, lng, radiusKm = 10) {
    try {
      const params = new URLSearchParams({ lat, lng, radius_km: radiusKm });
      const response = await fetch(`${API_URL}/api/v1/collaborative/sightings?${params}`);
      if (!response.ok) return { success: false, sightings: [] };
      return response.json();
    } catch {
      return { success: false, sightings: [] };
    }
  }

  static async reportSighting(sightingData) {
    try {
      const response = await fetch(`${API_URL}/api/v1/collaborative/sightings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sightingData)
      });
      return response.json();
    } catch {
      return { success: false };
    }
  }

  // Placeholder data
  static getPlaceholderSightings() {
    return [
      { id: 1, species: 'deer', count: 3, timestamp: '2026-02-09T06:30:00Z', verified: true },
      { id: 2, species: 'moose', count: 1, timestamp: '2026-02-08T17:15:00Z', verified: true },
      { id: 3, species: 'turkey', count: 8, timestamp: '2026-02-08T07:45:00Z', verified: false }
    ];
  }

  static getPlaceholderReports() {
    return [
      { 
        id: 1, 
        hunter: 'ChasseurPro', 
        species: 'deer', 
        success: true, 
        date: '2026-02-08',
        rating: 4,
        comment: 'Excellente matinée, 3 observations' 
      },
      { 
        id: 2, 
        hunter: 'NatureHunter', 
        species: 'bear', 
        success: false, 
        date: '2026-02-07',
        rating: 3,
        comment: 'Traces fraîches mais pas de contact visuel' 
      }
    ];
  }
}

export default CollaborativeService;
