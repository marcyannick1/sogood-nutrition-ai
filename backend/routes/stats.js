import express from 'express';
import Product from '../models/Product.js';
import sequelize from '../config/database.js';
import { Op, fn, col } from 'sequelize';

const router = express.Router();

// Overview stats
router.get('/overview', async (req, res) => {
  try {
    const total = await Product.count();

    const byNutriScore = await Product.findAll({
      attributes: [
        'nutriScore',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nutriScore']
    });

    const byNova = await Product.findAll({
      attributes: [
        'nova',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nova']
    });

    res.json({
      totalProducts: total,
      byNutriScore: byNutriScore.map(item => ({ _id: item.nutriScore, count: parseInt(item.dataValues.count) })),
      byNova: byNova.map(item => ({ _id: item.nova, count: parseInt(item.dataValues.count) })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NutriScore distribution
router.get('/nutriscore-distribution', async (req, res) => {
  try {
    const data = await Product.findAll({
      attributes: [
        'nutriScore',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nutriScore'],
      order: [['nutriScore', 'ASC']]
    });

    res.json(data.map(item => ({ _id: item.nutriScore, count: parseInt(item.dataValues.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOVA distribution
router.get('/nova-distribution', async (req, res) => {
  try {
    const data = await Product.findAll({
      attributes: [
        'nova',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nova'],
      order: [['nova', 'ASC']]
    });

    res.json(data.map(item => ({ _id: item.nova, count: parseInt(item.dataValues.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top brands
router.get('/top-brands', async (req, res) => {
  try {
    const data = await sequelize.query(`
      SELECT unnest(brands) as brand, COUNT(*) as count
      FROM products
      WHERE brands IS NOT NULL AND array_length(brands, 1) > 0
      GROUP BY brand
      ORDER BY count DESC
      LIMIT 20
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(data.map(item => ({ _id: item.brand, count: parseInt(item.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Best products (by NutriScore)
router.get('/best-products', async (req, res) => {
  try {
    const data = await Product.findAll({
      where: { nutriScore: { [Op.in]: ['A', 'B'] } },
      limit: 20,
      order: [['nutriScore', 'ASC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Worst products (by NutriScore)
router.get('/worst-products', async (req, res) => {
  try {
    const data = await Product.findAll({
      where: { nutriScore: { [Op.in]: ['D', 'E'] } },
      limit: 20,
      order: [['nutriScore', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Average nutrition stats
router.get('/nutrition-average', async (req, res) => {
  try {
    const data = await Product.findOne({
      attributes: [
        [fn('AVG', col('energyKcal')), 'avgEnergy'],
        [fn('AVG', col('fat')), 'avgFat'],
        [fn('AVG', col('sugars')), 'avgSugars'],
        [fn('AVG', col('salt')), 'avgSalt'],
        [fn('AVG', col('protein')), 'avgProtein']
      ]
    });

    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
