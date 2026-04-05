const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Detect card type from card number
function detectCardType(number) {
  const n = (number || '').replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6(?:011|5)/.test(n)) return 'Discover';
  if (/^(508[5-9]|6069|6521|6522)/.test(n)) return 'RuPay';
  if (/^35/.test(n)) return 'JCB';
  if (/^3(?:0[0-5]|[68])/.test(n)) return 'Diners Club';
  return 'Card';
}

// Mask card number: show first 4 and last 4
function maskCardNumber(number) {
  const n = (number || '').replace(/\s/g, '');
  if (n.length < 8) return '•••• •••• •••• ' + n.slice(-4);
  return n.slice(0, 4) + ' •••• •••• ' + n.slice(-4);
}

// Create order — supports both products and courses
router.post('/', authMiddleware, (req, res) => {
  try {
    const { items, shippingInfo } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = 0;
    let hasPhysicalProducts = false;
    const orderItems = items.map(item => {
      const type = item.type || 'product';

      if (type === 'course') {
        // Course item
        const course = db.findById('courses', item.courseId);
        if (!course) throw new Error(`Course ${item.courseId} not found`);

        const subtotal = course.price;
        total += subtotal;

        return {
          courseId: course.id,
          name: course.title,
          price: course.price,
          quantity: 1,
          image: course.image,
          type: 'course',
          instructor: course.instructor,
          duration: course.duration,
          subtotal
        };
      } else {
        // Product item
        hasPhysicalProducts = true;
        const product = db.findById('products', item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (item.quantity > 5) throw new Error(`Max 5 per item`);
        if (item.quantity > product.stockQty) throw new Error(`Insufficient stock for ${product.name}`);

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          type: 'product',
          subtotal
        };
      }
    });

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: orderItems,
      total,
      tax: Math.round(total * 0.18),
      grandTotal: total + Math.round(total * 0.18),
      shippingInfo: hasPhysicalProducts ? (shippingInfo || {}) : null,
      hasPhysicalProducts,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    db.insert('orders', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (admin/dashboard)
router.get('/', (req, res) => {
  const orders = db.findAll('orders');
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = db.findById('orders', req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Confirm payment — generates invoice + triggers email
// Now accepts full card details from Razorpay-style popup
router.post('/:id/confirm', (req, res) => {
  try {
    const { cardNumber, cardExpiry, cardHolder, cardCvv } = req.body;
    const order = db.findById('orders', req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const cardType = detectCardType(cardNumber);
    const maskedNumber = maskCardNumber(cardNumber);
    const cardLast4 = (cardNumber || '').replace(/\s/g, '').slice(-4);

    // Update order status with full card info
    db.update('orders', order.id, {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: `${cardType} ending ${cardLast4}`,
      cardType,
      maskedCardNumber: maskedNumber,
      cardHolder: cardHolder || '',
      cardExpiry: cardExpiry || '',
      paidAt: new Date().toISOString()
    });

    // Update stock quantities for products only
    order.items.forEach(item => {
      if (item.type !== 'course' && item.productId) {
        const product = db.findById('products', item.productId);
        if (product) {
          db.update('products', item.productId, {
            stockQty: Math.max(0, product.stockQty - item.quantity)
          });
        }
      }
      // Increment course enrollments
      if (item.type === 'course' && item.courseId) {
        const course = db.findById('courses', item.courseId);
        if (course) {
          db.update('courses', item.courseId, {
            enrollments: (course.enrollments || 0) + 1
          });
        }
      }
    });

    // Generate invoice with card details
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(db.count('invoices') + 1).padStart(4, '0')}`;
    const invoice = {
      id: uuidv4(),
      orderId: order.id,
      invoiceNumber,
      userId: order.userId,
      userName: order.userName,
      userEmail: order.userEmail,
      items: order.items,
      subtotal: order.total,
      tax: order.tax,
      grandTotal: order.grandTotal,
      paymentMethod: `${cardType} ending ${cardLast4}`,
      cardType,
      maskedCardNumber: maskedNumber,
      cardHolder: cardHolder || '',
      cardExpiry: cardExpiry || '',
      shippingInfo: order.shippingInfo,
      hasPhysicalProducts: order.hasPhysicalProducts,
      status: 'generated',
      createdAt: new Date().toISOString()
    };

    db.insert('invoices', invoice);

    // Build items text for email
    const itemsText = order.items.map(i => {
      const icon = i.type === 'course' ? '📚' : i.image;
      return `  ${icon} ${i.name} x${i.quantity} — ₹${i.subtotal.toLocaleString()}`;
    }).join('\n');

    // Create email record with card details
    const email = {
      id: uuidv4(),
      invoiceId: invoice.id,
      orderId: order.id,
      userId: order.userId,
      toEmail: order.userEmail,
      toName: order.userName,
      subject: `Order Confirmation & Invoice ${invoiceNumber}`,
      body: `Dear ${order.userName},\n\nThank you for your order!\n\nOrder ID: ${order.id}\nInvoice: ${invoiceNumber}\nTotal: ₹${order.grandTotal.toLocaleString()}\n\nItems:\n${itemsText}\n\nPayment: ${cardType} •••• ${cardLast4}\nCard Holder: ${cardHolder || 'N/A'}\nCard Number: ${maskedNumber}\nStatus: Paid ✅\n\n${order.hasPhysicalProducts ? 'Your order will be shipped within 2-3 business days.\n\n' : 'Your course access has been activated.\n\n'}Thank you for shopping with G Store!\n\nBest regards,\nG Workspace Team`,
      cardType,
      maskedCardNumber: maskedNumber,
      cardHolder: cardHolder || '',
      status: 'sent',
      sentAt: new Date().toISOString()
    };

    db.insert('emails', email);

    res.json({
      order: db.findById('orders', order.id),
      invoice,
      email: { id: email.id, subject: email.subject, status: email.status }
    });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

module.exports = router;
