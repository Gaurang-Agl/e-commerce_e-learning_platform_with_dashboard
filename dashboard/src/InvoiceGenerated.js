import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import Modal from './Modal';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function InvoiceGenerated() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [search, setSearch] = useState('');

  const fetchInvoices = () => {
    setLoading(true);
    fetch(`${API_BASE}/invoices`)
      .then(r => r.json())
      .then(data => { setInvoices(data); setLoading(false); setError(null); })
      .catch(() => { setError('Unable to connect to backend. Make sure the server is running on port 5000.'); setLoading(false); });
  };

  useEffect(() => { fetchInvoices(); }, []);

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.userName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.orderId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const totalTax = invoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);

  if (loading) {
    return (
      <div className="page-content page-transition">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
          <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content page-transition">
        <div className="ecom-error-card glass-card">
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>Connection Error</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchInvoices}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      {/* Stats */}
      <div className="ecom-stats-grid animate-fade-up">
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>📄</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{invoices.length}</div>
            <div className="ecom-stat-label">Total Invoices</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>💰</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">₹{totalRevenue.toLocaleString()}</div>
            <div className="ecom-stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d' }}>🏛️</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">₹{totalTax.toLocaleString()}</div>
            <div className="ecom-stat-label">GST Collected</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>📊</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">₹{invoices.length > 0 ? Math.round(totalRevenue / invoices.length).toLocaleString() : 0}</div>
            <div className="ecom-stat-label">Avg. Order Value</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="ecom-filters animate-fade-up stagger-1">
        <div className="ecom-search-box">
          <Icons.Search />
          <input type="text" placeholder="Search invoices by number, customer, or order ID..."
            value={search} onChange={e => setSearch(e.target.value)} className="ecom-search-input" />
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchInvoices}>🔄 Refresh</button>
      </div>

      {/* Invoices List */}
      {filtered.length === 0 ? (
        <div className="ecom-empty-state glass-card animate-fade-up stagger-2">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 4 }}>No Invoices Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Invoices will appear here when customers complete their purchases on G Store.
          </p>
        </div>
      ) : (
        <div className="ecom-invoice-list animate-fade-up stagger-2">
          {filtered.map(invoice => (
            <div key={invoice.id} className="ecom-invoice-card glass-card" onClick={() => setSelectedInvoice(invoice)} style={{ cursor: 'pointer' }}>
              <div className="ecom-invoice-card-left">
                <div className="ecom-invoice-icon">📄</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    {invoice.invoiceNumber}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Order: {invoice.orderId}
                  </div>
                </div>
              </div>
              <div className="ecom-invoice-card-mid">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="ecom-invoice-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {invoice.userName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{invoice.userName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{invoice.userEmail}</div>
                  </div>
                </div>
              </div>
              <div className="ecom-invoice-card-right">
                <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  ₹{invoice.grandTotal?.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <span className="ecom-status-badge stock-ok">✅ {invoice.status === 'generated' ? 'Generated' : invoice.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title={`Invoice ${selectedInvoice?.invoiceNumber || ''}`} size="large">
        {selectedInvoice && (
          <div>
            {/* Header Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: 16, background: 'var(--bg-card-hover)', borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Billed To</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedInvoice.userName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedInvoice.userEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Payment</div>
                <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  {selectedInvoice.cardType && (
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                      background: selectedInvoice.cardType === 'Visa' ? 'rgba(26, 31, 113, 0.4)' :
                        selectedInvoice.cardType === 'Mastercard' ? 'rgba(235, 0, 27, 0.2)' :
                        selectedInvoice.cardType === 'Amex' ? 'rgba(0, 111, 207, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: selectedInvoice.cardType === 'Visa' ? '#818cf8' :
                        selectedInvoice.cardType === 'Mastercard' ? '#fda4af' :
                        selectedInvoice.cardType === 'Amex' ? '#67e8f9' : '#a5b4fc',
                      fontSize: 11, fontWeight: 800, letterSpacing: '0.04em'
                    }}>
                      {selectedInvoice.cardType}
                    </span>
                  )}
                  {selectedInvoice.maskedCardNumber || selectedInvoice.paymentMethod}
                </div>
                {selectedInvoice.cardHolder && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Card Holder: {selectedInvoice.cardHolder}</div>
                )}
                {selectedInvoice.cardExpiry && (
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>Exp: {selectedInvoice.cardExpiry}</div>
                )}
                <div style={{ fontSize: 13, color: '#6ee7b7', marginTop: 2 }}>Status: Paid ✅</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="ecom-table" style={{ marginBottom: 20 }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{item.type === 'course' ? '📚' : item.image}</span>
                        <div>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                          {item.type === 'course' && (
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                              <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 4, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 700, fontSize: 10 }}>COURSE</span>
                              {item.instructor && <span style={{ marginLeft: 6 }}>by {item.instructor}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{item.price?.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.subtotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                <span>Subtotal</span><span>₹{selectedInvoice.subtotal?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                <span>GST (18%)</span><span>₹{selectedInvoice.tax?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-primary)', marginTop: 8, fontFamily: 'var(--font-display)' }}>
                <span>Grand Total</span><span>₹{selectedInvoice.grandTotal?.toLocaleString()}</span>
              </div>
            </div>

            {/* Order & Date Info */}
            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-card-hover)', borderRadius: 10, fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Order ID: {selectedInvoice.orderId}</span>
              <span>Generated: {new Date(selectedInvoice.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default InvoiceGenerated;
