const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Seed products on first load
const SEED_PRODUCTS = [
  {
    id: 'prod-001', name: 'Apple MacBook Pro M3', description: '14-inch, Apple M3 chip, 8-core CPU, 10-core GPU, 8GB Memory, 512GB SSD Storage - Space Black.', price: 159900, category: 'Laptops', stockQty: 15, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'], color: '#3b82f6', reviews: []
  },
  {
    id: 'prod-002', name: 'Apple MacBook Air M2', description: '15-inch, M2 chip, 8GB RAM, 256GB SSD, Liquid Retina display, macOS.', price: 114900, category: 'Laptops', stockQty: 20, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800', images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'], color: '#10b981', reviews: []
  },
  {
    id: 'prod-003', name: 'Apple iPhone 15 Pro Max', description: '6.7-inch Super Retina XDR display, Titanium design, A17 Pro chip, 48MP main camera.', price: 159900, category: 'Smartphones', stockQty: 30, image: 'https://images.unsplash.com/photo-1696446701796-da6122d25032?w=800', images: ['https://images.unsplash.com/photo-1696446701796-da6122d25032?w=800'], color: '#8b5cf6', reviews: []
  },
  {
    id: 'prod-004', name: 'Apple iPhone 15', description: '6.1-inch display, A16 Bionic chip, Advanced dual-camera system.', price: 79900, category: 'Smartphones', stockQty: 40, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'], color: '#f43f5e', reviews: []
  },
  {
    id: 'prod-005', name: 'Samsung Galaxy S24 Ultra', description: '6.8-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 200MP camera, S Pen included.', price: 129999, category: 'Smartphones', stockQty: 25, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'], color: '#06b6d4', reviews: []
  },
  {
    id: 'prod-006', name: 'Samsung Galaxy S24 Plus', description: '6.7-inch display, AI features, 50MP camera, fast charging.', price: 99999, category: 'Smartphones', stockQty: 35, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800', images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'], color: '#f59e0b', reviews: []
  },
  {
    id: 'prod-007', name: 'Asus ROG Zephyrus G14', description: '14-inch QHD 165Hz gaming laptop, AMD Ryzen 9, NVIDIA RTX 4060, 16GB RAM, 1TB SSD.', price: 144990, category: 'Laptops', stockQty: 10, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'], color: '#ec4899', reviews: []
  },
  {
    id: 'prod-008', name: 'HP Spectre x360', description: '13.5-inch OLED touch 2-in-1, Intel Core i7, 16GB RAM, 1TB SSD.', price: 134990, category: 'Laptops', stockQty: 12, image: 'https://images.unsplash.com/photo-1537498425277-c2a13cc70868?w=800', images: ['https://images.unsplash.com/photo-1537498425277-c2a13cc70868?w=800'], color: '#8b5cf6', reviews: []
  },
  {
    id: 'prod-009', name: 'Lenovo ThinkPad X1 Carbon', description: '14-inch ultralight business laptop, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro.', price: 149990, category: 'Laptops', stockQty: 18, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'], color: '#3b82f6', reviews: []
  },
  {
    id: 'prod-010', name: 'Dell XPS 15', description: '15.6-inch 3.5K OLED touch, Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD.', price: 189990, category: 'Laptops', stockQty: 8, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'], color: '#f59e0b', reviews: []
  },
  {
    id: 'prod-011', name: 'LG UltraGear 27" 4K Monitor', description: '27-inch 4K UHD Nano IPS 144Hz 1ms Gaming Monitor with G-SYNC.', price: 54990, category: 'Monitors', stockQty: 22, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'], color: '#10b981', reviews: []
  },
  {
    id: 'prod-012', name: 'Samsung Odyssey Neo G9 8K', description: '57-inch Dual UHD 8K 240Hz Mini LED Curved Gaming Monitor.', price: 199990, category: 'Monitors', stockQty: 5, image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800', images: ['https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800'], color: '#6366f1', reviews: []
  }
];

db.seedIfEmpty('products', SEED_PRODUCTS);

// Get all products (public)
router.get('/', (req, res) => {
  const products = db.findAll('products');
  res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = db.findById('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Add product (admin)
router.post('/', (req, res) => {
  const { name, description, price, category, stockQty, image, color } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const product = {
    id: `prod-${uuidv4().slice(0, 8)}`,
    name,
    description: description || '',
    price: Number(price),
    category: category || 'General',
    stockQty: Number(stockQty) || 0,
    image: image || '📦',
    images: req.body.images || [image || '📦'],
    reviews: req.body.reviews || [],
    color: color || '#3b82f6',
    createdAt: new Date().toISOString()
  };

  db.insert('products', product);
  res.status(201).json(product);
});

// Update product
router.put('/:id', (req, res) => {
  const updates = {};
  const { name, description, price, category, stockQty, image, color } = req.body;
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = Number(price);
  if (category !== undefined) updates.category = category;
  if (stockQty !== undefined) updates.stockQty = Number(stockQty);
  if (image !== undefined) updates.image = image;
  if (color !== undefined) updates.color = color;

  const updated = db.update('products', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

// Delete product
router.delete('/:id', (req, res) => {
  const deleted = db.delete('products', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// Add review to product
router.post('/:id/reviews', (req, res) => {
  const product = db.findById('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  const { rating, comment, userName, email } = req.body;
  if (!rating || !comment || !userName || !email) {
    return res.status(400).json({ error: 'Rating, comment, userName, and email are required' });
  }

  // Check if they purchased
  const orders = db.findAll('orders');
  const hasPurchased = orders.some(o => 
    o.userEmail === email && 
    (o.status === 'confirmed' || o.paymentStatus === 'paid') && 
    o.items.some(i => i.productId === req.params.id)
  );

  if (!hasPurchased) {
    return res.status(403).json({ error: 'You can only review items you have purchased.' });
  }

  const review = {
    rating: Number(rating),
    comment,
    userName,
    date: new Date().toISOString()
  };

  const reviews = product.reviews || [];
  reviews.push(review);
  
  const updated = db.update('products', req.params.id, { reviews });
  res.status(201).json(updated);
});

module.exports = router;
