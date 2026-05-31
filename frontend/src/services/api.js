import axios from 'axios';

// Configuration de l'API OpenFoodFacts
const API_BASE_URL = 'https://world.openfoodfacts.org/api/v0';
const API_SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

// Backend local
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  timeout: 10000,
});

export const apiService = {
  // ==================== BACKEND ENDPOINTS ====================
  
  // Rechercher localement (dans MongoDB)
  searchLocal: async (query) => {
    try {
      const response = await client.get(`${BACKEND_URL}/search`, {
        params: { q: query }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur recherche locale:', error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await client.get(`${BACKEND_URL}/stats/overview`);
      return response.data;
    } catch (error) {
      console.error('Erreur stats:', error);
      return { totalProducts: 0, byNutriScore: [] };
    }
  },

  // Récupérer les produits depuis le backend
  getProducts: async (page = 1, limit = 20) => {
    try {
      const response = await client.get(`${BACKEND_URL}/products`, {
        params: { page, limit }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur produits:', error);
      throw error;
    }
  },

  // Syncer produits depuis OpenFoodFacts
  syncProductsFromAPI: async (query) => {
    try {
      const response = await client.post(`${BACKEND_URL}/search/sync`, {
        q: query,
        limit: 50
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur sync API:', error);
      throw error;
    }
  },

  // ==================== OPENFOODFACTS API ====================
  
  // Rechercher des produits
  searchProducts: async (query, filters = {}) => {
    try {
      const params = {
        search_terms: query,
        action: 'process',
        json: 1,
        fields: 'code,product_name,brands,image_url,image_front_url,nutriscore_grade,nova_group,categories_tags,additives_tags,energy_100g,fat_100g,sugars_100g,salt_100g,proteins_100g',
        page_size: filters.pageSize || 20,
        page: filters.page || 1,
      };

      // Filtrer par Nutri-Score
      if (filters.nutriScore) {
        params.nutrition_grades = filters.nutriScore;
      }

      // Filtrer par NOVA
      if (filters.nova) {
        params.nova_group = filters.nova;
      }

      const response = await client.get(API_SEARCH_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },

  // Récupérer les détails d'un produit
  getProductDetail: async (barcode) => {
    try {
      const url = `${API_BASE_URL}/product/${barcode}.json`;
      const response = await client.get(url);
      return response.data.product;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

  // Récupérer les produits par catégorie
  getProductsByCategory: async (category) => {
    try {
      const params = {
        categories_tags: category,
        json: 1,
        fields: 'code,product_name,brands,image_url,image_front_url,nutriscore_grade,nova_group',
        page_size: 12,
      };

      const response = await client.get(API_SEARCH_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération par catégorie:', error);
      throw error;
    }
  },
};
