const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all users (for Team Space integration)
router.get('/', (req, res) => {
  const users = db.findAll('users').map(u => {
    const { passwordHash, ...safe } = u;
    return safe;
  });
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = db.findById('users', req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Update user
router.put('/:id', authMiddleware, (req, res) => {
  const { name, role, dept, phone, email, status } = req.body;
  const updates = {};
  if (name) {
    updates.name = name;
    updates.initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  if (role) updates.role = role;
  if (dept) updates.dept = dept;
  if (phone) updates.phone = phone;
  if (email) updates.email = email;
  if (status) updates.status = status;

  const updated = db.update('users', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safe } = updated;
  res.json(safe);
});

// Delete user
router.delete('/:id', authMiddleware, (req, res) => {
  const deleted = db.delete('users', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
