import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import Modal from './Modal';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function StocksAvailability() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/courses`)
      ]);
      if (!pRes.ok || !cRes.ok) throw new Error('Failed to fetch');
      setProducts(await pRes.json());
      setCourses(await cRes.json());
      setError(null);
    } catch (err) {
      setError('Unable to connect to backend. Make sure the server is running.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const currentData = activeTab === 'products' ? products : courses;
  const categories = ['All', ...new Set(currentData.map(d => d.category))];

  const filtered = currentData.filter(d => {
    const name = activeTab === 'products' ? d.name : d.title;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.category === category;
    return matchSearch && matchCat;
  });

  const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
  const lowStockCount = products.filter(p => p.stockQty > 0 && p.stockQty <= 10).length;
  const outOfStockCount = products.filter(p => p.stockQty === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQty), 0);
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollments, 0);

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setUpdating(true);
    const endpoint = activeTab === 'products' ? 'products' : 'courses';
    const payload = activeTab === 'products' 
      ? { stockQty: parseInt(editStock), image: editImage } 
      : { image: editImage };

    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        if (activeTab === 'products') {
          setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else {
          setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
        }
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Failed to update:', err);
    }
    setUpdating(false);
  };

  const openEditor = (item) => {
    setSelectedItem(item);
    setEditStock(item.stockQty ? String(item.stockQty) : '0');
    setEditImage(item.image || '');
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: 'Out of Stock', cls: 'stock-out', color: '#f43f5e' };
    if (qty <= 10) return { label: 'Low Stock', cls: 'stock-low', color: '#f59e0b' };
    return { label: 'In Stock', cls: 'stock-ok', color: '#10b981' };
  };

  const getStockBarWidth = (qty) => Math.min((qty / 60) * 100, 100);
  
  const isEmojiRender = (imgStr) => imgStr && imgStr.length <= 4 && !imgStr.startsWith('http');

  if (loading) {
    return (
      <div className="page-content page-transition">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
          <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Loading inventory data...</span>
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
          <button className="btn btn-primary" onClick={fetchData}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setActiveTab('products'); setCategory('All'); }}>
          📦 Products Inventory
        </button>
        <button className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setActiveTab('courses'); setCategory('All'); }}>
          📚 Courses Inventory
        </button>
      </div>

      {activeTab === 'products' ? (
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
      ) : (
        <div className="ecom-stats-grid animate-fade-up">
          <div className="ecom-stat-card glass-card">
            <div className="ecom-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>📚</div>
            <div className="ecom-stat-info">
              <div className="ecom-stat-value">{courses.length}</div>
              <div className="ecom-stat-label">Live Courses</div>
            </div>
          </div>
          <div className="ecom-stat-card glass-card">
            <div className="ecom-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>🎓</div>
            <div className="ecom-stat-info">
              <div className="ecom-stat-value">{totalEnrollments}</div>
              <div className="ecom-stat-label">Total Enrollments</div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Value */}
      <div className="ecom-value-banner glass-card animate-fade-up stagger-1">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 4 }}>{activeTab === 'products' ? 'Total Inventory Value' : 'Course Platform Status'}</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {activeTab === 'products' ? `₹${totalValue.toLocaleString()}` : 'Live & Active'}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchData}>🔄 Refresh</button>
      </div>

      {/* Search & Filters */}
      <div className="ecom-filters animate-fade-up stagger-2">
        <div className="ecom-search-box">
          <Icons.Search />
          <input type="text" placeholder={`Search ${activeTab}...`} value={search}
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

      {/* Products/Courses Table */}
      <div className="ecom-table-card glass-card animate-fade-up stagger-3">
        <div className="ecom-table-header">
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {activeTab === 'products' ? '📦 Product Inventory' : '📚 Course Registry'} ({filtered.length})
          </h3>
        </div>
        <div className="ecom-table-wrap">
          <table className="ecom-table">
            <thead>
              <tr>
                <th>{activeTab === 'products' ? 'Product' : 'Course'}</th>
                <th>Category</th>
                <th>Price</th>
                {activeTab === 'products' ? (
                  <>
                    <th>Stock</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>Enrollments</th>
                    <th>Instructor</th>
                  </>
                )}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isProd = activeTab === 'products';
                const status = isProd ? getStockStatus(item.stockQty) : null;
                const emojiRender = isEmojiRender(item.image);
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="ecom-product-icon" style={{ background: emojiRender ? `${item.color}18` : 'transparent', color: item.color, overflow: 'hidden' }}>
                          {emojiRender ? item.image : <img src={item.image} alt={item.name || item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{isProd ? item.name : item.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="ecom-cat-badge">{item.category}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{item.price.toLocaleString()}</td>
                    {isProd ? (
                      <>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="ecom-stock-bar">
                              <div className="ecom-stock-fill" style={{ width: `${getStockBarWidth(item.stockQty)}%`, background: status.color }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: status.color, minWidth: 24 }}>{item.stockQty}</span>
                          </div>
                        </td>
                        <td><span className={`ecom-status-badge ${status.cls}`}>{status.label}</span></td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{item.enrollments}</td>
                        <td>{item.instructor}</td>
                      </>
                    )}
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditor(item)}>
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

      {/* Edit Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={`Edit ${activeTab === 'products' ? 'Product' : 'Course'}`} size="medium">
        {selectedItem && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: 16, background: 'var(--bg-card-hover)', borderRadius: 12 }}>
              <div className="ecom-product-icon" style={{ background: isEmojiRender(selectedItem.image)? `${selectedItem.color}18`:'transparent', width: 48, height: 48, fontSize: 24, overflow: 'hidden' }}>
                {isEmojiRender(selectedItem.image) ? selectedItem.image : <img src={selectedItem.image} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{activeTab==='products' ? selectedItem.name : selectedItem.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{selectedItem.id}</div>
              </div>
            </div>
            
            {activeTab === 'products' && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Stock Quantity
                </label>
                <input
                  type="number" min="0" value={editStock}
                  onChange={e => setEditStock(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}
                />
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Image (URL or Emoji)
              </label>
              <input
                type="text" value={editImage}
                onChange={e => setEditImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedItem(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate} disabled={updating}>
                {updating ? 'Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default StocksAvailability;
