/**
 * Ecoforestry Service - API client for ecoforestry data layers
 * Phase 10 - Plan Maître Modules
 */

const API_URL = process.env.REACT_APP_BACKEND_URL;

export class EcoforestryService {
  static async getHealth() {
    try {
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/`);
      if (!response.ok) return { status: 'unavailable' };
      return response.json();
    } catch {
      return { status: 'unavailable' };
    }
  }

  static async getForestData(lat, lng, radiusKm = 5) {
    try {
      const params = new URLSearchParams({ lat, lng, radius_km: radiusKm });
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/data?${params}`);
      if (!response.ok) return { success: false, data: null };
      return response.json();
    } catch {
      return { success: false, data: null };
    }
  }

  static async getVegetationLayers(bounds) {
    try {
      const params = new URLSearchParams({
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west
      });
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/vegetation?${params}`);
      if (!response.ok) return { success: false, layers: [] };
      return response.json();
    } catch {
      return { success: false, layers: [] };
    }
  }

  static async getHabitatAnalysis(lat, lng, species) {
    try {
      const params = new URLSearchParams({ lat, lng, species });
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/habitat?${params}`);
      if (!response.ok) return { success: false, analysis: null };
      return response.json();
    } catch {
      return { success: false, analysis: null };
    }
  }

  static async getFoodSources(lat, lng, radiusKm = 2, season = null) {
    try {
      const params = new URLSearchParams({ lat, lng, radius_km: radiusKm });
      if (season) params.append('season', season);
      
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/food-sources?${params}`);
      if (!response.ok) return { success: false, sources: [] };
      return response.json();
    } catch {
      return { success: false, sources: [] };
    }
  }

  static async getCoverTypes(lat, lng) {
    try {
      const params = new URLSearchParams({ lat, lng });
      const response = await fetch(`${API_URL}/api/v1/ecoforestry/cover?${params}`);
      if (!response.ok) return { success: false, cover: null };
      return response.json();
    } catch {
      return { success: false, cover: null };
    }
  }

  // Placeholder data
  static getPlaceholderForestData() {
    return {
      dominant_species: ['Érable à sucre', 'Bouleau jaune', 'Sapin baumier'],
      forest_type: 'Mixte',
      age_class: 'Mature (60-80 ans)',
      density: 'Moyenne',
      canopy_cover: 72,
      understory: ['Érable de Pennsylvanie', 'Aulne rugueux', 'Fougères'],
      food_score: 78,
      cover_score: 85,
      water_proximity: 'Ruisseau à 200m'
    };
  }

  static getPlaceholderHabitatScore() {
    return {
      overall: 82,
      food: 78,
      cover: 88,
      water: 75,
      terrain: 80,
      human_disturbance: 15
    };
  }
}

export default EcoforestryService;
