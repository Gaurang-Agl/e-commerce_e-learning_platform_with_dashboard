/* ============================================
   G WORKSPACE E-COMMERCE — Express Server
   ============================================ */
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/stats', require('./routes/stats'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 G Workspace E-Commerce Backend`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   API endpoints:`);
  console.log(`   ├── POST /api/auth/signup`);
  console.log(`   ├── POST /api/auth/login`);
  console.log(`   ├── GET  /api/users`);
  console.log(`   ├── GET  /api/products`);
  console.log(`   ├── POST /api/orders`);
  console.log(`   ├── GET  /api/invoices`);
  console.log(`   ├── GET  /api/emails`);
  console.log(`   └── GET  /api/courses\n`);
});
