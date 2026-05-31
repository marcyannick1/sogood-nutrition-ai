import axios from 'axios';
import Product from '../models/Product.js';

const API_BASE = 'https://world.openfoodfacts.org/api/v0';

export const searchProducts = async (query, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_BASE}/cgi/search.pl`, {
      params: {
        search_terms: query,
        page_size: pageSize,
        json: 1,
        action: 'process',
      },
    });
    return response.data.products || [];
  } catch (error) {
    console.error('Error searching products:', error.message);
    return [];
  }
};

export const getProductDetail = async (code) => {
  try {
    const response = await axios.get(`${API_BASE}/product/${code}.json`);
    if (response.data.status === 1) {
      return normalizeProduct(response.data.product);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return null;
  }
};

export const searchByCategory = async (category, pageSize = 20) => {
  try {
    const response = await axios.get(`${API_BASE}/cgi/search.pl`, {
      params: {
        tagtype_0: 'categories',
        tag_contains_0: 'contains',
        tag_0: category,
        page_size: pageSize,
        json: 1,
      },
    });
    return response.data.products || [];
  } catch (error) {
    console.error('Error searching by category:', error.message);
    return [];
  }
};

const normalizeProduct = (offProduct) => {
  return {
    code: offProduct.code || offProduct.id || 'UNKNOWN',
    name: offProduct.product_name || offProduct.generic_name || 'Unknown Product',
    brands: offProduct.brands ? offProduct.brands.split(',').map(b => b.trim()) : [],
    category: offProduct.categories_en || offProduct.categories || '',
    imageUrl: offProduct.image_front_url || offProduct.image_url || '',
    nutriScore: offProduct.nutriscore_grade?.toUpperCase() || 'UNKNOWN',
    nova: offProduct.nova_group || 0,
    nutrition: {
      energyKcal: offProduct.nutriments?.['energy-kcal'] || offProduct.nutriments?.['energy-kcal_100g'] || 0,
      fat: offProduct.nutriments?.fat_100g || 0,
      saturatedFat: offProduct.nutriments?.['saturated-fat_100g'] || 0,
      carbohydrates: offProduct.nutriments?.carbohydrates_100g || 0,
      sugars: offProduct.nutriments?.sugars_100g || 0,
      protein: offProduct.nutriments?.proteins_100g || 0,
      salt: offProduct.nutriments?.salt_100g || 0,
      fiber: offProduct.nutriments?.fiber_100g || 0,
    },
    additives: offProduct.additives_en ? offProduct.additives_en.split(',').map(a => a.trim()) : [],
    allergens: offProduct.allergens_en ? offProduct.allergens_en.split(',').map(a => a.trim()) : [],
    ingredients: offProduct.ingredients_text || offProduct.ingredients_text_en || '',
    ecoscoreGrade: offProduct.ecoscore_grade?.toUpperCase() || '',
    origin: offProduct.origin || '',
  };
};

export const normalizeAndSaveProduct = async (offProduct) => {
  const normalized = normalizeProduct(offProduct);
  try {
    const existing = await Product.findOne({ code: normalized.code });
    if (existing) {
      return await Product.findByIdAndUpdate(existing._id, normalized, { new: true });
    }
    return await Product.create(normalized);
  } catch (error) {
    console.error('Error saving product:', error.message);
    return null;
  }
};

export const syncProductsFromAPI = async (query, limit = 50) => {
  try {
    const products = await searchProducts(query, limit);
    const saved = [];
    for (const product of products) {
      const result = await normalizeAndSaveProduct(product);
      if (result) saved.push(result);
    }
    return saved;
  } catch (error) {
    console.error('Error syncing products:', error.message);
    return [];
  }
};
