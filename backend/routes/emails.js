const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all sent emails
router.get('/', (req, res) => {
  const emails = db.findAll('emails');
  res.json(emails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)));
});

// Get email by ID
router.get('/:id', (req, res) => {
  const email = db.findById('emails', req.params.id);
  if (!email) return res.status(404).json({ error: 'Email not found' });
  res.json(email);
});

// Resend email
router.post('/:id/resend', (req, res) => {
  const email = db.findById('emails', req.params.id);
  if (!email) return res.status(404).json({ error: 'Email not found' });
  
  db.update('emails', email.id, {
    status: 'resent',
    resentAt: new Date().toISOString()
  });

  res.json({ success: true, message: 'Email resent successfully' });
});

module.exports = router;
