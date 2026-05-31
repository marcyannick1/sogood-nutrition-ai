import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brands: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  nutriScore: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D', 'E', 'UNKNOWN'),
    defaultValue: 'UNKNOWN'
  },
  nova: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, 2, 3, 4]]
    }
  },
  energyKcal: {
    type: DataTypes.FLOAT
  },
  fat: {
    type: DataTypes.FLOAT
  },
  saturatedFat: {
    type: DataTypes.FLOAT
  },
  carbohydrates: {
    type: DataTypes.FLOAT
  },
  sugars: {
    type: DataTypes.FLOAT
  },
  protein: {
    type: DataTypes.FLOAT
  },
  salt: {
    type: DataTypes.FLOAT
  },
  fiber: {
    type: DataTypes.FLOAT
  },
  additives: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  allergens: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  ingredients: {
    type: DataTypes.TEXT
  },
  ecoscoreGrade: {
    type: DataTypes.STRING
  },
  origin: {
    type: DataTypes.STRING
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['code'] },
    { fields: ['name'] }
  ]
});

export default Product;
