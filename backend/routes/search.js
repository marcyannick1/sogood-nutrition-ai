import express from 'express';
import Product from '../models/Product.js';
import * as OpenFoodFacts from '../services/openFoodFacts.js';
import { Op } from 'sequelize';

const router = express.Router();

// Search in local database
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, nutriScore, nova } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const offset = (page - 1) * 20;
    const where = {
      [Op.or]: [
        { product_name: { [Op.iLike]: `%${q}%` } },
        { categories: { [Op.iLike]: `%${q}%` } },
        { brands: { [Op.iLike]: `%${q}%` } }
      ]
    };

    // Ajouter les filtres Nutri-Score et NOVA
    if (nutriScore) {
      where.nutriscore_grade = nutriScore.toLowerCase();
    }
    if (nova) {
      where.nova_group = nova.toString();
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: 20,
      offset
    });

    res.json({ data: rows, pagination: { page, total: count } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { categories: { [Op.iLike]: `%${req.params.category}%` } },
      limit: 50
    });

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search in OpenFoodFacts API and sync
router.post('/sync', async (req, res) => {
  try {
    const { q, limit = 20 } = req.body;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const apiProducts = await OpenFoodFacts.searchProducts(q, limit);
    const saved = [];

    for (const product of apiProducts) {
      const result = await OpenFoodFacts.normalizeAndSaveProduct(product);
      if (result) saved.push(result);
    }

    res.json({ data: saved, count: saved.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
