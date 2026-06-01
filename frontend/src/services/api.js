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

  // Rechercher des produits dans le backend
  searchProducts: async (query, filters = {}) => {
    try {
      const params = { q: query };
      if (filters.page) params.page = filters.page;
      if (filters.nutriScore) params.nutriScore = filters.nutriScore;
      if (filters.nova) params.nova = filters.nova;

      const response = await client.get(`${BACKEND_URL}/search`, { params });
      return { products: response.data.data || [], count: response.data.pagination?.total || 0 };
    } catch (error) {
      console.error('Erreur recherche:', error);
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
      return { totalProducts: 0, byNutriScore: [], byNova: [] };
    }
  },

  // Distribution Nutri-Score
  getNutriscoreDistribution: async () => {
    try {
      const response = await client.get(`${BACKEND_URL}/stats/nutriscore-distribution`);
      return response.data;
    } catch (error) {
      console.error('Erreur nutriscore distribution:', error);
      return [];
    }
  },

  // Distribution NOVA
  getNovaDistribution: async () => {
    try {
      const response = await client.get(`${BACKEND_URL}/stats/nova-distribution`);
      return response.data;
    } catch (error) {
      console.error('Erreur nova distribution:', error);
      return [];
    }
  },

  // Top marques
  getTopBrands: async () => {
    try {
      const response = await client.get(`${BACKEND_URL}/stats/top-brands`);
      return response.data;
    } catch (error) {
      console.error('Erreur top brands:', error);
      return [];
    }
  },

  // Récupérer les produits depuis le backend
  getProducts: async (page = 1, limit = 20, filters = {}) => {
    try {
      const params = { page, limit };
      if (filters.categories) params.categories = filters.categories;
      if (filters.nutriscore_grade) params.nutriscore_grade = filters.nutriscore_grade;

      const response = await client.get(`${BACKEND_URL}/products`, { params });
      return { products: response.data.data || [], pagination: response.data.pagination || {} };
    } catch (error) {
      console.error('Erreur produits:', error);
      throw error;
    }
  },

  // Récupérer les détails d'un produit
  getProductDetail: async (id) => {
    try {
      const response = await client.get(`${BACKEND_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

  // Filtrer les produits
  filterProducts: async (filters) => {
    try {
      const response = await client.post(`${BACKEND_URL}/products/filter`, filters);
      return response.data;
    } catch (error) {
      console.error('Erreur filtrage:', error);
      throw error;
    }
  },

  // Rechercher par catégorie
  getProductsByCategory: async (category) => {
    try {
      const response = await client.get(`${BACKEND_URL}/search/category/${category}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur recherche par catégorie:', error);
      throw error;
    }
  },

  // Prédiction Nutri-Score
  predictNutriScore: async (features) => {
    try {
      const response = await client.post(`${BACKEND_URL}/prediction`, features);
      return response.data;
    } catch (error) {
      console.error('Erreur prédiction Nutri-Score:', error);
      throw error;
    }
  },

};
