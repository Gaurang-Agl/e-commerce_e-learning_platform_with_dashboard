const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Seed products on first load
const SEED_PRODUCTS = [
  {
    id: 'prod-001', name: 'Wireless Bluetooth Earbuds', description: 'Premium TWS earbuds with active noise cancellation, 30-hour battery life, and IPX5 water resistance. Crystal-clear audio with deep bass.', price: 2499, category: 'Electronics', stockQty: 25, image: '🎧', color: '#3b82f6'
  },
  {
    id: 'prod-002', name: 'Smart Watch Pro', description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and 7-day battery life. 100+ watch faces.', price: 4999, category: 'Electronics', stockQty: 15, image: '⌚', color: '#8b5cf6'
  },
  {
    id: 'prod-003', name: 'Portable Power Bank 20000mAh', description: 'Ultra-slim 20000mAh power bank with 65W fast charging, dual USB-C ports, and LED display. Charges laptop and phone simultaneously.', price: 1799, category: 'Electronics', stockQty: 40, image: '🔋', color: '#10b981'
  },
  {
    id: 'prod-004', name: 'USB-C Hub Adapter 7-in-1', description: 'Premium aluminum hub with HDMI 4K, 2x USB 3.0, USB-C PD 100W, SD/TF card reader, and ethernet port. Plug and play.', price: 1299, category: 'Electronics', stockQty: 30, image: '🔌', color: '#f59e0b'
  },
  {
    id: 'prod-005', name: 'Premium Leather Laptop Sleeve', description: 'Handcrafted genuine leather sleeve for 13-15" laptops. Soft microfiber interior, magnetic closure, and accessory pocket.', price: 1999, category: 'Accessories', stockQty: 20, image: '💼', color: '#ec4899'
  },
  {
    id: 'prod-006', name: 'Ergonomic Gel Mouse Pad', description: 'Memory foam wrist rest with cooling gel technology. Non-slip rubber base, smooth fabric surface. Reduces wrist strain.', price: 699, category: 'Accessories', stockQty: 50, image: '🖱️', color: '#06b6d4'
  },
  {
    id: 'prod-007', name: 'Premium Silicone Phone Case', description: 'Military-grade drop protection with soft-touch silicone finish. Compatible with MagSafe, raised camera bezels, and wireless charging.', price: 899, category: 'Accessories', stockQty: 60, image: '📱', color: '#f43f5e'
  },
  {
    id: 'prod-008', name: 'Cable Organizer Kit (12-Pack)', description: 'Magnetic cable clips and velcro ties combo. Keep your desk tidy with premium cable management solution. Reusable and adjustable.', price: 499, category: 'Accessories', stockQty: 45, image: '🔗', color: '#8b5cf6'
  },
  {
    id: 'prod-009', name: 'LED Smart Desk Lamp', description: 'Touch-control LED lamp with 5 color temperatures, stepless dimming, USB charging port, and 30-minute auto-off timer. Eye-care technology.', price: 2299, category: 'Home & Office', stockQty: 18, image: '💡', color: '#f59e0b'
  },
  {
    id: 'prod-010', name: 'Bamboo Monitor Stand', description: 'Eco-friendly bamboo monitor riser with storage drawer and phone holder. Elevates screen to eye level. Supports up to 30kg.', price: 1599, category: 'Home & Office', stockQty: 22, image: '🖥️', color: '#10b981'
  },
  {
    id: 'prod-011', name: 'Wireless Charging Pad 15W', description: 'Fast wireless charger compatible with Qi devices. LED indicator, foreign object detection, and anti-slip design. Ultra-thin profile.', price: 999, category: 'Home & Office', stockQty: 35, image: '⚡', color: '#4f8cff'
  },
  {
    id: 'prod-012', name: 'Noise-Cancelling Headphones', description: 'Over-ear wireless headphones with hybrid ANC, 40mm drivers, 60-hour battery, and multi-device connectivity. Premium comfort for all-day wear.', price: 6999, category: 'Electronics', stockQty: 12, image: '🎵', color: '#6366f1'
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

module.exports = router;
