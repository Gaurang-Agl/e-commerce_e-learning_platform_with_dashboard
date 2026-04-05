import React from 'react';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const stockStatus = product.stockQty > 10 ? 'in-stock' :
    product.stockQty > 0 ? 'low-stock' : 'out-of-stock';
  const stockLabel = product.stockQty > 10 ? `${product.stockQty} in stock` :
    product.stockQty > 0 ? `Only ${product.stockQty} left` : 'Out of stock';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{
            height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem', background: `${product.color}10`, borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-xl)'
          }}>
            {product.image}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <span className="badge badge-primary">{product.category}</span>
            <span className={`product-card-stock ${stockStatus}`} style={{ fontSize: '0.85rem' }}>
              {stockLabel}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: 'var(--space-xl)' }}>
            {product.description}
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--space-lg)', background: 'var(--gradient-card)',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>Price</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{product.price.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>Incl. GST</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                ₹{Math.round(product.price * 1.18).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
