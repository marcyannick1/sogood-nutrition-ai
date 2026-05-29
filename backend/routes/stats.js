import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Overview stats
router.get('/overview', async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const byNutriScore = await Product.aggregate([
      { $group: { _id: '$nutriScore', count: { $sum: 1 } } },
    ]);
    const byNova = await Product.aggregate([
      { $group: { _id: '$nova', count: { $sum: 1 } } },
    ]);

    res.json({
      totalProducts: total,
      byNutriScore,
      byNova,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NutriScore distribution
router.get('/nutriscore-distribution', async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: '$nutriScore', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOVA distribution
router.get('/nova-distribution', async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: '$nova', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top brands
router.get('/top-brands', async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $unwind: '$brands' },
      { $group: { _id: '$brands', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Best products (by NutriScore)
router.get('/best-products', async (req, res) => {
  try {
    const data = await Product.find({ nutriScore: { $in: ['A', 'B'] } })
      .limit(20)
      .sort({ nutriScore: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Worst products (by NutriScore)
router.get('/worst-products', async (req, res) => {
  try {
    const data = await Product.find({ nutriScore: { $in: ['D', 'E'] } })
      .limit(20)
      .sort({ nutriScore: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Average nutrition stats
router.get('/nutrition-average', async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgEnergy: { $avg: '$nutrition.energyKcal' },
          avgFat: { $avg: '$nutrition.fat' },
          avgSugars: { $avg: '$nutrition.sugars' },
          avgSalt: { $avg: '$nutrition.salt' },
          avgProtein: { $avg: '$nutrition.protein' },
        },
      },
    ]);
    res.json(data[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
