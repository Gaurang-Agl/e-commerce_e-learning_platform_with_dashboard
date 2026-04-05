import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🔒</div>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Sign in required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Please sign in to view your orders.
          </p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p>Loading orders...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)', maxWidth: 800 }}>
        <h1 className="section-title">📦 My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📦</div>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
              You haven't placed any orders yet.
            </p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{order.id}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${order.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>
                      ₹{order.grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  {order.items.map((item, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)', fontSize: '0.82rem'
                    }}>
                      {item.image} {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>

                {expandedOrder === order.id && (
                  <div style={{
                    marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)',
                    borderTop: '1px solid var(--border-subtle)', animation: 'slideDown 0.3s ease'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: 2 }}>PAYMENT</div>
                        <div>{order.paymentMethod || 'Pending'}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: 2 }}>PAYMENT STATUS</div>
                        <div>{order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</div>
                      </div>
                      {order.shippingInfo && order.shippingInfo.address && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: 2 }}>SHIPPING</div>
                          <div>{order.shippingInfo.address}, {order.shippingInfo.city} — {order.shippingInfo.pincode}</div>
                        </div>
                      )}
                    </div>

                    <table className="invoice-table" style={{ marginTop: 'var(--space-md)' }}>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th style={{ textAlign: 'center' }}>Qty</th>
                          <th style={{ textAlign: 'right' }}>Price</th>
                          <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.image} {item.name}</td>
                            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>₹{item.price.toLocaleString()}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{item.subtotal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-xl)', marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>
                      <div>Subtotal: ₹{order.total.toLocaleString()}</div>
                      <div>Tax: ₹{order.tax.toLocaleString()}</div>
                      <div style={{ fontWeight: 700 }}>Grand Total: ₹{order.grandTotal.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
