import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb://localhost:27017/sogood';

const seedTestData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Données de test
    const testProducts = [
      {
        code: '5000159437029',
        name: 'Coca-Cola Original',
        brands: ['Coca-Cola'],
        category: 'Beverages',
        nutriScore: 'E',
        nova: 4,
        nutrition: {
          energyKcal: 42,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 10.6,
          sugars: 10.6,
          protein: 0,
          salt: 0.01,
          fiber: 0,
        },
        additives: ['E150d', 'E338', 'E330'],
      },
      {
        code: '5449000000121',
        name: 'Coca-Cola Zero Sugar',
        brands: ['Coca-Cola'],
        category: 'Beverages',
        nutriScore: 'D',
        nova: 4,
        nutrition: {
          energyKcal: 0.4,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 0.5,
          sugars: 0,
          protein: 0,
          salt: 0.01,
          fiber: 0,
        },
        additives: ['E950', 'E951', 'E338'],
      },
      {
        code: '5410041309283',
        name: 'Baguette Tradition',
        brands: ['Boulangerie Maison'],
        category: 'Bread',
        nutriScore: 'B',
        nova: 1,
        nutrition: {
          energyKcal: 265,
          fat: 1.3,
          saturatedFat: 0.3,
          carbohydrates: 52,
          sugars: 1,
          protein: 8.5,
          salt: 1.5,
          fiber: 2.5,
        },
        additives: [],
      },
      {
        code: '5000382024846',
        name: 'Cadbury Dairy Milk',
        brands: ['Cadbury'],
        category: 'Chocolate',
        nutriScore: 'E',
        nova: 4,
        nutrition: {
          energyKcal: 530,
          fat: 30,
          saturatedFat: 18,
          carbohydrates: 57,
          sugars: 56,
          protein: 7.4,
          salt: 0.12,
          fiber: 0,
        },
        additives: ['E322'],
      },
      {
        code: '4006000000024',
        name: 'Fresh Red Apples',
        brands: ['Farm Fresh'],
        category: 'Fruits',
        nutriScore: 'A',
        nova: 1,
        nutrition: {
          energyKcal: 52,
          fat: 0.2,
          saturatedFat: 0.04,
          carbohydrates: 14,
          sugars: 10,
          protein: 0.3,
          salt: 0.001,
          fiber: 2.4,
        },
        additives: [],
      },
      {
        code: '5449000050127',
        name: 'Fanta Orange',
        brands: ['Fanta', 'Coca-Cola'],
        category: 'Beverages',
        nutriScore: 'E',
        nova: 4,
        nutrition: {
          energyKcal: 47,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 11,
          sugars: 11,
          protein: 0,
          salt: 0.03,
          fiber: 0,
        },
        additives: ['E110', 'E129', 'E338'],
      },
      {
        code: '5010064002012',
        name: 'Heinz Tomato Ketchup',
        brands: ['Heinz'],
        category: 'Condiments',
        nutriScore: 'C',
        nova: 2,
        nutrition: {
          energyKcal: 99,
          fat: 0.1,
          saturatedFat: 0,
          carbohydrates: 23.3,
          sugars: 13.7,
          protein: 0.4,
          salt: 2.2,
          fiber: 0.5,
        },
        additives: ['E202', 'E211'],
      },
      {
        code: '4005808010025',
        name: 'Organic Almonds',
        brands: ['Nature Bio'],
        category: 'Nuts',
        nutriScore: 'B',
        nova: 1,
        nutrition: {
          energyKcal: 579,
          fat: 50,
          saturatedFat: 3.9,
          carbohydrates: 22,
          sugars: 4.4,
          protein: 21.1,
          salt: 0,
          fiber: 12.5,
        },
        additives: [],
      },
    ];

    // Effacer et insérer
    await Product.deleteMany({});
    const inserted = await Product.insertMany(testProducts);
    console.log(`✅ Inserted ${inserted.length} test products\n`);

    // Afficher stats
    const stats = await Product.aggregate([
      { $group: { _id: '$nutriScore', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log('📊 NutriScore Distribution:');
    stats.forEach(s => console.log(`   ${s._id}: ${s.count}`));

    const total = await Product.countDocuments();
    console.log(`\n✅ Total products: ${total}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedTestData();
