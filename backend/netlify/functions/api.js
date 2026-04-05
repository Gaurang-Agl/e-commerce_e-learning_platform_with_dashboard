/* ============================================
   Netlify Function — Express API Wrapper
   Wraps the Express app for serverless deployment
   ============================================ */
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'netlify', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', require('../../routes/auth'));
app.use('/api/users', require('../../routes/users'));
app.use('/api/products', require('../../routes/products'));
app.use('/api/orders', require('../../routes/orders'));
app.use('/api/invoices', require('../../routes/invoices'));
app.use('/api/emails', require('../../routes/emails'));
app.use('/api/courses', require('../../routes/courses'));
app.use('/api/stats', require('../../routes/stats'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export as serverless handler
module.exports.handler = serverless(app);
