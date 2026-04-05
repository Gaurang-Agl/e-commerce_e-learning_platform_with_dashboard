import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p>Loading products...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <h1 className="section-title">🛍️ All Products</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', marginTop: '-0.5rem' }}>
          Browse our curated collection of premium tech products and accessories.
        </p>

        {/* Search */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="product-search"
          />
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔍</div>
            <p>No products found matching your search.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
