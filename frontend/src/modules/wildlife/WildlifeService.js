/**
 * Wildlife Service - API client for wildlife behavior engine
 * Phase 10 - Plan Maître Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class WildlifeService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/wildlife/`);
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async listSpecies() {
    try {
      const response = await fetch(`${API_URL}/api/v1/wildlife/species`);
      if (!response.ok) return { success: false, species: [] };
      return response.json();
    } catch {
      return { success: false, species: [] };
    }
  }

  static async getSpeciesInfo(species) {
    try {
      const response = await fetch(`${API_URL}/api/v1/wildlife/species/${species}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  static async getMovementPatterns(species, patternType = 'daily') {
    try {
      const response = await fetch(`${API_URL}/api/v1/wildlife/patterns/${species}?pattern_type=${patternType}`);
      if (!response.ok) return { success: false, patterns: {} };
      return response.json();
    } catch {
      return { success: false, patterns: {} };
    }
  }

  static async predictActivity(species, options = {}) {
    try {
      const params = new URLSearchParams({ species });
      if (options.lat) params.append('lat', options.lat);
      if (options.lng) params.append('lng', options.lng);
      if (options.date) params.append('date', options.date);
      if (options.temperature) params.append('temperature', options.temperature);
      if (options.wind_speed) params.append('wind_speed', options.wind_speed);
      
      const response = await fetch(`${API_URL}/api/v1/wildlife/predict-activity?${params}`);
      if (!response.ok) return { success: false, prediction: {} };
      return response.json();
    } catch {
      return { success: false, prediction: {} };
    }
  }

  static async getSeasonalBehavior(species, season) {
    try {
      const response = await fetch(`${API_URL}/api/v1/wildlife/seasonal/${species}/${season}`);
      if (!response.ok) return { success: false, behavior: {} };
      return response.json();
    } catch {
      return { success: false, behavior: {} };
    }
  }

  static async predictPresence(lat, lng, radiusKm = 1.0, species = null) {
    try {
      const params = new URLSearchParams({ lat, lng, radius_km: radiusKm });
      if (species) params.append('species', Array.isArray(species) ? species.join(',') : species);
      
      const response = await fetch(`${API_URL}/api/v1/wildlife/presence?${params}`);
      if (!response.ok) return { success: false, presence: {} };
      return response.json();
    } catch {
      return { success: false, presence: {} };
    }
  }

  // Placeholder data for demo
  static getPlaceholderSpecies() {
    return [
      { id: 'deer', name: 'Cerf de Virginie', icon: '🦌', category: 'big_game' },
      { id: 'moose', name: 'Orignal', icon: '🫎', category: 'big_game' },
      { id: 'bear', name: 'Ours noir', icon: '🐻', category: 'big_game' },
      { id: 'wild_boar', name: 'Sanglier', icon: '🐗', category: 'big_game' },
      { id: 'turkey', name: 'Dindon sauvage', icon: '🦃', category: 'small_game' },
      { id: 'duck', name: 'Canard', icon: '🦆', category: 'waterfowl' },
      { id: 'goose', name: 'Oie', icon: '🪿', category: 'waterfowl' }
    ];
  }
}

export default WildlifeService;
