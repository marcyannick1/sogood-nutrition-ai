import mongoose from 'mongoose';
import Product from './models/Product.js';
import * as OpenFoodFacts from './services/openFoodFacts.js';

const MONGO_URI = 'mongodb://localhost:27017/sogood';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Effacer les données existantes
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Recherches à faire
    const searches = ['pizza', 'coca', 'apple', 'bread', 'chocolate'];
    let totalSaved = 0;

    for (const query of searches) {
      console.log(`\n🔍 Searching for: ${query}`);
      const products = await OpenFoodFacts.searchProducts(query, 10);
      console.log(`   Found: ${products.length} products`);

      for (const product of products) {
        try {
          const saved = await OpenFoodFacts.normalizeAndSaveProduct(product);
          if (saved) totalSaved++;
        } catch (error) {
          console.error(`   Error saving product: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Seeding complete! Saved ${totalSaved} products`);

    // Afficher les stats
    const stats = await Product.aggregate([
      { $group: { _id: '$nutriScore', count: { $sum: 1 } } },
    ]);
    console.log('\n📊 NutriScore Distribution:');
    console.table(stats);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
