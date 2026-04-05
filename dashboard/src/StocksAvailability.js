import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import Modal from './Modal';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function StocksAvailability() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); setError(null); })
      .catch(() => { setError('Unable to connect to backend. Make sure the server is running on port 5000.'); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
  const lowStockCount = products.filter(p => p.stockQty > 0 && p.stockQty <= 10).length;
  const outOfStockCount = products.filter(p => p.stockQty === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQty), 0);

  const handleUpdateStock = async () => {
    if (!selectedProduct || editStock === '') return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQty: parseInt(editStock) })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
    setUpdating(false);
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: 'Out of Stock', cls: 'stock-out', color: '#f43f5e' };
    if (qty <= 10) return { label: 'Low Stock', cls: 'stock-low', color: '#f59e0b' };
    return { label: 'In Stock', cls: 'stock-ok', color: '#10b981' };
  };

  const getStockBarWidth = (qty) => Math.min((qty / 60) * 100, 100);

  if (loading) {
    return (
      <div className="page-content page-transition">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
          <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Loading stock data...</span>
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
          <button className="btn btn-primary" onClick={fetchProducts}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      {/* Stats Overview */}
      <div className="ecom-stats-grid animate-fade-up">
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>📦</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{totalStock}</div>
            <div className="ecom-stat-label">Total Units</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>✅</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{products.length - lowStockCount - outOfStockCount}</div>
            <div className="ecom-stat-label">In Stock</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d' }}>⚠️</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{lowStockCount}</div>
            <div className="ecom-stat-label">Low Stock</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af' }}>🚫</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{outOfStockCount}</div>
            <div className="ecom-stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="ecom-value-banner glass-card animate-fade-up stagger-1">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Inventory Value</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            ₹{totalValue.toLocaleString()}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchProducts}>🔄 Refresh</button>
      </div>

      {/* Search & Filters */}
      <div className="ecom-filters animate-fade-up stagger-2">
        <div className="ecom-search-box">
          <Icons.Search />
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} className="ecom-search-input" />
        </div>
        <div className="ecom-category-chips">
          {categories.map(cat => (
            <button key={cat} className={`ecom-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="ecom-table-card glass-card animate-fade-up stagger-3">
        <div className="ecom-table-header">
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            📦 Product Inventory ({filtered.length})
          </h3>
        </div>
        <div className="ecom-table-wrap">
          <table className="ecom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const status = getStockStatus(product.stockQty);
                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="ecom-product-icon" style={{ background: `${product.color}18`, color: product.color }}>
                          {product.image}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{product.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="ecom-cat-badge">{product.category}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{product.price.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="ecom-stock-bar">
                          <div className="ecom-stock-fill" style={{ width: `${getStockBarWidth(product.stockQty)}%`, background: status.color }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: status.color, minWidth: 24 }}>{product.stockQty}</span>
                      </div>
                    </td>
                    <td><span className={`ecom-status-badge ${status.cls}`}>{status.label}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedProduct(product); setEditStock(String(product.stockQty)); }}>
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Stock Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Update Stock" size="small">
        {selectedProduct && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 16, background: 'var(--bg-card-hover)', borderRadius: 12 }}>
              <div className="ecom-product-icon" style={{ background: `${selectedProduct.color}18`, width: 48, height: 48, fontSize: 24 }}>
                {selectedProduct.image}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedProduct.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Current stock: {selectedProduct.stockQty} units</div>
              </div>
            </div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Stock Quantity
            </label>
            <input
              type="number" min="0" value={editStock}
              onChange={e => setEditStock(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedProduct(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdateStock} disabled={updating}>
                {updating ? 'Updating...' : '✅ Update Stock'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default StocksAvailability;
