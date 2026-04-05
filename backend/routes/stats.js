const express = require('express');
const db = require('../db');

const router = express.Router();

// Aggregated dashboard stats
router.get('/', (req, res) => {
  try {
    const users = db.findAll('users');
    const orders = db.findAll('orders');
    const products = db.findAll('products');
    const invoices = db.findAll('invoices');
    const emails = db.findAll('emails');

    // Revenue calculations
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalTax = confirmedOrders.reduce((sum, o) => sum + (o.tax || 0), 0);

    // Stock calculations
    const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
    const lowStockProducts = products.filter(p => p.stockQty > 0 && p.stockQty <= 10);
    const outOfStockProducts = products.filter(p => p.stockQty === 0);

    // Recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        userName: o.userName,
        userEmail: o.userEmail,
        grandTotal: o.grandTotal,
        status: o.status,
        paymentStatus: o.paymentStatus,
        itemCount: o.items?.length || 0,
        items: o.items?.map(i => ({ name: i.name, image: i.image, quantity: i.quantity })) || [],
        createdAt: o.createdAt
      }));

    // Recent users (last 5)
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(u => {
        const { passwordHash, ...safe } = u;
        return safe;
      });

    // Email stats
    const sentEmails = emails.filter(e => e.status === 'sent').length;
    const resentEmails = emails.filter(e => e.status === 'resent').length;

    res.json({
      overview: {
        totalUsers: users.length,
        totalOrders: orders.length,
        confirmedOrders: confirmedOrders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue,
        totalTax,
        avgOrderValue: confirmedOrders.length > 0 ? Math.round(totalRevenue / confirmedOrders.length) : 0,
        totalInvoices: invoices.length,
        totalEmails: emails.length,
        sentEmails,
        resentEmails,
        totalProducts: products.length,
        totalStock,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
      recentOrders,
      recentUsers,
      stockAlerts: [
        ...outOfStockProducts.map(p => ({
          id: p.id, name: p.name, image: p.image, color: p.color,
          stockQty: p.stockQty, category: p.category, severity: 'critical'
        })),
        ...lowStockProducts.map(p => ({
          id: p.id, name: p.name, image: p.image, color: p.color,
          stockQty: p.stockQty, category: p.category, severity: 'warning'
        }))
      ],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

module.exports = router;
