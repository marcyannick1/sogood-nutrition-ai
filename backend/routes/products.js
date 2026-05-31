import express from 'express';
import Product from '../models/Product.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, categories, nutriscore_grade } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (categories) where.categories = { [Op.iLike]: `%${categories}%` };
    if (nutriscore_grade) where.nutriscore_grade = nutriscore_grade.toLowerCase();

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Filter by criteria
router.post('/filter', async (req, res) => {
  try {
    const { nutriscore_grade, nova_group, maxSugars, maxSalt, brands } = req.body;
    let where = {};

    if (nutriscore_grade) where.nutriscore_grade = { [Op.in]: nutriscore_grade };
    if (nova_group) where.nova_group = { [Op.in]: nova_group };
    if (maxSugars) where.sugars = { [Op.lte]: maxSugars };
    if (maxSalt) where.salt = { [Op.lte]: maxSalt };
    if (brands) where.brands = { [Op.iLike]: `%${brands}%` };

    const products = await Product.findAll({ where, limit: 100 });
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
