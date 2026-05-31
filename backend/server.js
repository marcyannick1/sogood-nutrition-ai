import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import productsRouter from './routes/products.js';
import searchRouter from './routes/search.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('✅ Database synchronized'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SoGood Backend is running' });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/stats', statsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend should be at http://localhost:5174`);
});

export default app;
