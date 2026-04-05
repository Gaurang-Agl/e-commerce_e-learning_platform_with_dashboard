import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, invoice } = location.state || {};

  if (!order || !invoice) {
    return (
      <div className="page-wrapper">
        <div className="success-page">
          <h2>No order data found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            It looks like you navigated here directly. Please place an order first.
          </p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  const hasCourses = invoice.items?.some(i => i.type === 'course');
  const hasProducts = invoice.items?.some(i => i.type !== 'course');

  return (
    <div className="page-wrapper">
      <div className="success-page">
        {/* Success Header */}
        <div className="success-icon">✓</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
          Order Confirmed! 🎉
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>
          Thank you for shopping with G Store. Your order has been placed successfully.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)', margin: 'var(--space-lg) 0', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Order ID</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{order.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Invoice</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{invoice.invoiceNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Payment</div>
            <div style={{ fontWeight: 700 }}>{order.paymentMethod}</div>
          </div>
        </div>

        {/* Card Details Banner */}
        {(invoice.cardType || invoice.maskedCardNumber) && (
          <div className="card-details-banner">
            <div className="card-visual">
              <div className="card-visual-chip" />
              <div className="card-visual-number">{invoice.maskedCardNumber}</div>
              <div className="card-visual-bottom">
                <div>
                  <div className="card-visual-label">CARD HOLDER</div>
                  <div className="card-visual-value">{invoice.cardHolder || order.userName}</div>
                </div>
                <div>
                  <div className="card-visual-label">EXPIRES</div>
                  <div className="card-visual-value">{invoice.cardExpiry || 'N/A'}</div>
                </div>
                <div className="card-visual-type">{invoice.cardType}</div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Card */}
        <div className="invoice-card">
          <div className="invoice-header">
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>
                📄 Invoice #{invoice.invoiceNumber}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {new Date(invoice.createdAt).toLocaleString()}
              </div>
            </div>
            <span className="badge badge-success">PAID</span>
          </div>

          <div className="invoice-body">
            <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: 'var(--text-tertiary)', marginBottom: 2, fontSize: '0.75rem' }}>BILLED TO</div>
                  <div style={{ fontWeight: 600 }}>{invoice.userName}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{invoice.userEmail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-tertiary)', marginBottom: 2, fontSize: '0.75rem' }}>PAYMENT</div>
                  <div style={{ fontWeight: 600 }}>
                    {invoice.cardType && <span className="invoice-card-type-tag">{invoice.cardType}</span>}
                    {invoice.maskedCardNumber || invoice.paymentMethod}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {invoice.cardHolder && <span>Card Holder: {invoice.cardHolder}</span>}
                  </div>
                  <div style={{ color: '#6ee7b7', marginTop: 2 }}>Status: Paid ✅</div>
                </div>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'center' }}>Type</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ marginRight: 8 }}>{item.type === 'course' ? '📚' : item.image}</span>
                      {item.name}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${item.type === 'course' ? 'badge-primary' : 'badge-info'}`}
                        style={{ fontSize: '0.65rem' }}>
                        {item.type === 'course' ? 'Course' : 'Product'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{item.price.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals">
              <div className="invoice-total-row">
                <span>Subtotal</span>
                <span>₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="invoice-total-row">
                <span>GST (18%)</span>
                <span>₹{invoice.tax.toLocaleString()}</span>
              </div>
              {invoice.hasPhysicalProducts && (
                <div className="invoice-total-row">
                  <span>Shipping</span>
                  <span style={{ color: 'var(--accent-success)' }}>FREE</span>
                </div>
              )}
              <div className="invoice-total-row grand-total">
                <span>Grand Total</span>
                <span>₹{invoice.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Access Notice */}
        {hasCourses && (
          <div className="card" style={{
            marginTop: 'var(--space-xl)', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            background: 'var(--gradient-card)', border: '1px solid var(--border-accent)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Course Access Activated</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Your course access has been activated. Visit the Learning Hub to start learning!
              </div>
            </div>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Active</span>
          </div>
        )}

        {/* Email Notification */}
        <div className="card" style={{
          marginTop: 'var(--space-md)', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📧</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Confirmation Email Sent</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              A copy of this invoice has been sent to {invoice.userEmail}
            </div>
          </div>
          <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Sent</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-2xl)', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-secondary">📦 View Orders</Link>
          <Link to="/products" className="btn btn-primary">🛍️ Continue Shopping</Link>
          <Link to="/courses" className="btn btn-secondary">📚 Browse Courses</Link>
          <a href="https://gaurang-workspace.netlify.app" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Dashboard ↗
          </a>
        </div>
      </div>
    </div>
  );
}
