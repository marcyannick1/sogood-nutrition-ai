import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  brands: {
    type: DataTypes.TEXT
  },
  categories: {
    type: DataTypes.TEXT
  },
  ingredients_text: {
    type: DataTypes.TEXT
  },
  nutriscore_grade: {
    type: DataTypes.STRING
  },
  nova_group: {
    type: DataTypes.STRING
  },
  image_url: {
    type: DataTypes.TEXT
  },
  sugars: {
    type: DataTypes.FLOAT
  },
  salt: {
    type: DataTypes.FLOAT
  },
  fat: {
    type: DataTypes.FLOAT
  },
  additives_count: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'products',
  timestamps: false,
  indexes: [
    { fields: ['product_name'] }
  ]
});

export default Product;
