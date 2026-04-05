const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all invoices
router.get('/', (req, res) => {
  const invoices = db.findAll('invoices');
  res.json(invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Get invoice by ID
router.get('/:id', (req, res) => {
  const invoice = db.findById('invoices', req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

module.exports = router;
