import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PaymentModal from '../components/PaymentModal';

export default function CheckoutPage() {
  const { items, subtotal, tax, grandTotal, clearCart, hasPhysicalProducts } = useCart();
  const { token, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({ address: '', city: '', pincode: '', state: '' });
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🛒</div>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Add some products or courses before checking out.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInitiatePayment = () => {
    if (hasPhysicalProducts && (!shipping.address || !shipping.city || !shipping.pincode)) {
      toast.error('Please fill in all shipping details');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (cardDetails) => {
    setShowPaymentModal(false);
    setProcessing(true);

    try {
      // Build order items
      const orderItems = items.map(item => {
        if (item.type === 'course') {
          return { courseId: item.courseId, type: 'course' };
        }
        return { productId: item.productId, quantity: item.quantity, type: 'product' };
      });

      // Step 1: Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingInfo: hasPhysicalProducts ? shipping : null
        })
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const order = await orderRes.json();

      // Step 2: Confirm payment with card details
      const confirmRes = await fetch(`/api/orders/${order.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: cardDetails.cardNumber,
          cardExpiry: cardDetails.cardExpiry,
          cardHolder: cardDetails.cardHolder,
          cardCvv: cardDetails.cardCvv
        })
      });

      if (!confirmRes.ok) throw new Error('Payment confirmation failed');

      const result = await confirmRes.json();

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/order-success', { state: { order: result.order, invoice: result.invoice } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ paddingTop: 'var(--space-xl)' }}>🛒 Checkout</h1>

        <div className="checkout-layout">
          {/* Left — Forms */}
          <div>
            {/* Shipping — Only for physical products */}
            {hasPhysicalProducts && (
              <div className="checkout-section">
                <h3>
                  <span className="step-number">1</span>
                  Shipping Address
                </h3>
                <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Street Address</label>
                    <input className="form-input" placeholder="123 Main Street, Apt 4B"
                      value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                      id="shipping-address" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">City</label>
                      <input className="form-input" placeholder="Mumbai"
                        value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                        id="shipping-city" />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">State</label>
                      <input className="form-input" placeholder="Maharashtra"
                        value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                        id="shipping-state" />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">PIN Code</label>
                      <input className="form-input" placeholder="400001"
                        value={shipping.pincode} onChange={e => setShipping(s => ({ ...s, pincode: e.target.value }))}
                        id="shipping-pincode" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Digital-only notice */}
            {!hasPhysicalProducts && (
              <div className="checkout-section">
                <h3>
                  <span className="step-number">1</span>
                  Digital Purchase
                </h3>
                <div style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)'
                }}>
                  <span style={{ fontSize: '2rem' }}>📚</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
                      Digital Course Purchase
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      No shipping required. You'll get instant access after payment.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="checkout-section">
              <h3>
                <span className="step-number">{hasPhysicalProducts ? '2' : '2'}</span>
                Payment
                <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>Test Mode</span>
              </h3>
              <div style={{
                padding: 'var(--space-lg)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>💳</div>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                  Secure Card Payment
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                  You'll enter your card details in a secure payment popup when you click "Pay & Place Order".
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
                  <span className="card-type-pill" style={{ background: 'rgba(26, 31, 113, 0.2)', color: '#818cf8' }}>Visa</span>
                  <span className="card-type-pill" style={{ background: 'rgba(235, 0, 27, 0.15)', color: '#fda4af' }}>Mastercard</span>
                  <span className="card-type-pill" style={{ background: 'rgba(0, 111, 207, 0.15)', color: '#67e8f9' }}>Amex</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button className="btn btn-success btn-lg" onClick={handleInitiatePayment}
              disabled={processing} style={{ width: '100%' }} id="place-order-btn">
              {processing ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, margin: 0, borderWidth: 2 }} />
                  Processing...
                </>
              ) : (
                `💳 Pay ₹${grandTotal.toLocaleString()} & Place Order`
              )}
            </button>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="order-summary-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                📋 Order Summary
              </h3>

              {items.map(item => (
                <div className="order-summary-item" key={item.productId || item.courseId}>
                  <div className="item-name">
                    <span>{item.type === 'course' ? '📚' : item.image}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {item.type === 'course' ? 'Digital Course' : `Qty: ${item.quantity}`}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="cart-summary-row">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {hasPhysicalProducts && (
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span style={{ color: 'var(--accent-success)' }}>FREE</span>
                  </div>
                )}
                <div className="cart-summary-row total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {user && (
                <div style={{
                  marginTop: 'var(--space-lg)', padding: 'var(--space-md)',
                  background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem', color: 'var(--text-secondary)'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Ordering as:</div>
                  <div>{user.name} ({user.email})</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={grandTotal}
        onPaySuccess={handlePaymentSuccess}
      />
    </div>
  );
}
