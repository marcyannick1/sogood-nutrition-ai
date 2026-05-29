import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  brands: {
    type: [String],
    default: [],
  },
  category: String,
  imageUrl: String,
  nutriScore: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'UNKNOWN'],
    default: 'UNKNOWN',
  },
  nova: {
    type: Number,
    enum: [1, 2, 3, 4, 0],
    default: 0,
  },
  nutrition: {
    energyKcal: Number,
    fat: Number,
    saturatedFat: Number,
    carbohydrates: Number,
    sugars: Number,
    protein: Number,
    salt: Number,
    fiber: Number,
  },
  additives: {
    type: [String],
    default: [],
  },
  allergens: {
    type: [String],
    default: [],
  },
  ingredients: String,
  ecoscoreGrade: String,
  origin: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
