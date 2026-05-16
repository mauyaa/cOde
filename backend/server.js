const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ensureDataFile } = require('./config/store');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const messageRoutes = require('./routes/messageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

dotenv.config();

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
    })
  );
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      name: 'Agricultural Market Platform API',
      status: 'ok',
      endpoints: ['/api/auth', '/api/products', '/api/orders', '/api/messages', '/api/dashboard'],
    });
  });

  app.get('/api/health', async (req, res, next) => {
    try {
      await ensureDataFile();
      return res.json({ status: 'ok' });
    } catch (error) {
      return next(error);
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

async function startServer() {
  await ensureDataFile();
  const app = createApp();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = { createApp, startServer };
