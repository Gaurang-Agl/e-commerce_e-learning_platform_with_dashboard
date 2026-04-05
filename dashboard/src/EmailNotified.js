import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import Modal from './Modal';

const API_BASE = 'http://localhost:5000/api';

function EmailNotified() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [resending, setResending] = useState(null);

  const fetchEmails = () => {
    setLoading(true);
    fetch(`${API_BASE}/emails`)
      .then(r => r.json())
      .then(data => { setEmails(data); setLoading(false); setError(null); })
      .catch(() => { setError('Unable to connect to backend. Make sure the server is running on port 5000.'); setLoading(false); });
  };

  useEffect(() => { fetchEmails(); }, []);

  const handleResend = async (emailId, e) => {
    e.stopPropagation();
    setResending(emailId);
    try {
      await fetch(`${API_BASE}/emails/${emailId}/resend`, { method: 'POST' });
      setEmails(prev => prev.map(em =>
        em.id === emailId ? { ...em, status: 'resent', resentAt: new Date().toISOString() } : em
      ));
    } catch (err) {
      console.error('Failed to resend:', err);
    }
    setResending(null);
  };

  const sentCount = emails.filter(e => e.status === 'sent').length;
  const resentCount = emails.filter(e => e.status === 'resent').length;

  if (loading) {
    return (
      <div className="page-content page-transition">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
          <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Loading email logs...</span>
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
          <button className="btn btn-primary" onClick={fetchEmails}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      {/* Stats */}
      <div className="ecom-stats-grid animate-fade-up">
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>📧</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{emails.length}</div>
            <div className="ecom-stat-label">Total Emails</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>✅</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{sentCount}</div>
            <div className="ecom-stat-label">Delivered</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>🔄</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{resentCount}</div>
            <div className="ecom-stat-label">Resent</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f9a8d4' }}>📬</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">100%</div>
            <div className="ecom-stat-label">Delivery Rate</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="ecom-filters animate-fade-up stagger-1">
        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>📧 Email Notification Log</h3>
        <button className="btn btn-primary btn-sm" onClick={fetchEmails}>🔄 Refresh</button>
      </div>

      {/* Email List */}
      {emails.length === 0 ? (
        <div className="ecom-empty-state glass-card animate-fade-up stagger-2">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 4 }}>No Emails Sent</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Email notifications will appear here when orders are confirmed on G Store.
          </p>
        </div>
      ) : (
        <div className="ecom-email-list animate-fade-up stagger-2">
          {emails.map(email => (
            <div key={email.id} className="ecom-email-card glass-card" onClick={() => setSelectedEmail(email)} style={{ cursor: 'pointer' }}>
              <div className="ecom-email-card-icon">
                {email.status === 'resent' ? '🔄' : '✅'}
              </div>
              <div className="ecom-email-card-content">
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {email.subject}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  To: {email.toName} ({email.toEmail})
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {email.status === 'resent' ? 'Resent' : 'Sent'}: {new Date(email.resentAt || email.sentAt).toLocaleString()}
                </div>
              </div>
              <div className="ecom-email-card-actions">
                <span className={`ecom-status-badge ${email.status === 'resent' ? 'stock-low' : 'stock-ok'}`}>
                  {email.status === 'resent' ? '🔄 Resent' : '✅ Sent'}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => handleResend(email.id, e)}
                  disabled={resending === email.id}
                  style={{ marginLeft: 8 }}
                >
                  {resending === email.id ? '...' : '📤 Resend'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Detail Modal */}
      <Modal isOpen={!!selectedEmail} onClose={() => setSelectedEmail(null)} title="📧 Email Details" size="large">
        {selectedEmail && (
          <div>
            {/* Email Header */}
            <div style={{ padding: 16, background: 'var(--bg-card-hover)', borderRadius: 12, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>To</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedEmail.toName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedEmail.toEmail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</div>
                  <span className={`ecom-status-badge ${selectedEmail.status === 'resent' ? 'stock-low' : 'stock-ok'}`}>
                    {selectedEmail.status === 'resent' ? '🔄 Resent' : '✅ Delivered'}
                  </span>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {new Date(selectedEmail.resentAt || selectedEmail.sentAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Payment Details */}
            {(selectedEmail.cardType || selectedEmail.maskedCardNumber) && (
              <div style={{ padding: 14, background: 'var(--bg-card-hover)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24 }}>💳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Payment Card</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {selectedEmail.cardType && (
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                        background: selectedEmail.cardType === 'Visa' ? 'rgba(26, 31, 113, 0.4)' :
                          selectedEmail.cardType === 'Mastercard' ? 'rgba(235, 0, 27, 0.2)' :
                          selectedEmail.cardType === 'Amex' ? 'rgba(0, 111, 207, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: selectedEmail.cardType === 'Visa' ? '#818cf8' :
                          selectedEmail.cardType === 'Mastercard' ? '#fda4af' :
                          selectedEmail.cardType === 'Amex' ? '#67e8f9' : '#a5b4fc',
                        fontSize: 11, fontWeight: 800, letterSpacing: '0.04em'
                      }}>
                        {selectedEmail.cardType}
                      </span>
                    )}
                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                      {selectedEmail.maskedCardNumber || ''}
                    </span>
                  </div>
                  {selectedEmail.cardHolder && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Holder: {selectedEmail.cardHolder}</div>
                  )}
                </div>
              </div>
            )}

            {/* Subject */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Subject</div>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)' }}>{selectedEmail.subject}</div>
            </div>

            {/* Body */}
            <div style={{ padding: 20, background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {selectedEmail.body}
            </div>

            {/* Meta */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-tertiary)' }}>
              <span>Order: {selectedEmail.orderId}</span>
              <span>Invoice: {selectedEmail.invoiceId?.slice(0, 8)}...</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedEmail(null)}>Close</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={(e) => { handleResend(selectedEmail.id, e); setSelectedEmail(null); }}>
                📤 Resend Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EmailNotified;
