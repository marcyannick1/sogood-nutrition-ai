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
        'nutriscore_grade',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nutriscore_grade']
    });

    const byNova = await Product.findAll({
      attributes: [
        'nova_group',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nova_group']
    });

    res.json({
      totalProducts: total,
      byNutriScore: byNutriScore.map(item => ({ _id: item.nutriscore_grade, count: parseInt(item.dataValues.count) })),
      byNova: byNova.map(item => ({ _id: item.nova_group, count: parseInt(item.dataValues.count) })),
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
        'nutriscore_grade',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nutriscore_grade'],
      order: [['nutriscore_grade', 'ASC']]
    });

    res.json(data.map(item => ({ _id: item.nutriscore_grade, count: parseInt(item.dataValues.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOVA distribution
router.get('/nova-distribution', async (req, res) => {
  try {
    const data = await Product.findAll({
      attributes: [
        'nova_group',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['nova_group'],
      order: [['nova_group', 'ASC']]
    });

    res.json(data.map(item => ({ _id: item.nova_group, count: parseInt(item.dataValues.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top brands
router.get('/top-brands', async (req, res) => {
  try {
    const data = await Product.findAll({
      attributes: [
        'brands',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        brands: { [Op.ne]: null }
      },
      group: ['brands'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 20
    });

    res.json(data.map(item => ({ _id: item.brands, count: parseInt(item.dataValues.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Best products (by NutriScore)
router.get('/best-products', async (req, res) => {
  try {
    const data = await Product.findAll({
      where: { nutriscore_grade: { [Op.in]: ['a', 'b'] } },
      limit: 20,
      order: [['nutriscore_grade', 'ASC']]
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
      where: { nutriscore_grade: { [Op.in]: ['d', 'e'] } },
      limit: 20,
      order: [['nutriscore_grade', 'DESC']]
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
        [fn('AVG', col('fat')), 'avgFat'],
        [fn('AVG', col('sugars')), 'avgSugars'],
        [fn('AVG', col('salt')), 'avgSalt']
      ]
    });

    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
