import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, nutriScore } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (category) query.category = new RegExp(category, 'i');
    if (nutriScore) query.nutriScore = nutriScore.toUpperCase();

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by code
router.get('/code/:code', async (req, res) => {
  try {
    const product = await Product.findOne({ code: req.params.code });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter by criteria
router.post('/filter', async (req, res) => {
  try {
    const { nutriScore, nova, maxSugars, maxSalt, brands } = req.body;
    let query = {};

    if (nutriScore) query.nutriScore = { $in: nutriScore };
    if (nova) query.nova = { $in: nova };
    if (maxSugars) query['nutrition.sugars'] = { $lte: maxSugars };
    if (maxSalt) query['nutrition.salt'] = { $lte: maxSalt };
    if (brands) query.brands = { $in: brands };

    const products = await Product.find(query).limit(100);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync products from OpenFoodFacts
router.post('/sync', async (req, res) => {
  try {
    const { query, limit = 50 } = req.body;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    res.json({ message: 'Sync started (background task)', status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
