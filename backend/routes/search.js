import express from 'express';
import Product from '../models/Product.js';
import * as OpenFoodFacts from '../services/openFoodFacts.js';

const router = express.Router();

// Search in local database
router.get('/', async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const skip = (page - 1) * 20;
    const results = await Product.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { brands: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
      ],
    })
      .limit(20)
      .skip(skip);

    const total = await Product.countDocuments({
      $or: [
        { name: new RegExp(q, 'i') },
        { brands: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
      ],
    });

    res.json({ data: results, pagination: { page, total } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({
      category: new RegExp(req.params.category, 'i'),
    }).limit(50);

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
