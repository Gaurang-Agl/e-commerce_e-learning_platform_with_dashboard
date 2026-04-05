import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, isProductInCart, openCart } = useCart();
  const toast = useToast();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => { navigate('/products'); });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (isProductInCart(product.id)) {
      openCart();
    } else {
      addProduct(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const userEmail = user?.email || email.trim();
    if (!userEmail) {
      return toast.error('Please provide an email to verify your purchase.');
    }
    
    setSubmittingReview(true);
    // Guest or Authenticated username
    const userName = user?.name || 'Guest User';
    
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, userName, email: userEmail })
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        setComment('');
        setEmail('');
        toast.success('Review submitted successfully!');
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to submit review.');
      }
    } catch (err) {
      toast.error('Error connecting to backend.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  const inCart = isProductInCart(product.id);
  const isEmoji = product.image.length <= 4 && !product.image.startsWith('http');

  // Calculate average rating
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 'var(--space-xl)' }}>
          ← Back
        </button>

        <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
          {/* Visual Side */}
          <div className="product-visual-large" style={{ 
            background: isEmoji ? `${product.color}20` : 'var(--bg-card)', 
            borderRadius: 'var(--radius-lg)', 
            display: 'flex', alignItems: 'center', justifyItems: 'center', 
            minHeight: 400, overflow: 'hidden', border: '1px solid var(--border-primary)' 
          }}>
            {isEmoji ? (
              <div style={{ fontSize: '10rem', width: '100%', textAlign: 'center' }}>{product.image}</div>
            ) : (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          {/* Info Side */}
          <div>
            <div className="badge badge-info" style={{ marginBottom: 'var(--space-sm)' }}>{product.category}</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
              <span style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
              <span style={{ fontWeight: 600 }}>{avgRating}</span>
              <span style={{ color: 'var(--text-tertiary)' }}>({reviews.length} reviews)</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-xl)' }}>
              ₹{product.price.toLocaleString()}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: 'var(--space-2xl)' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <button 
                className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-lg`} 
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                style={{ flex: 1, padding: '1rem' }}
              >
                {product.stockQty === 0 ? 'Out of Stock' : inCart ? '✓ Inside Cart' : '🛒 Add to Cart'}
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', color: product.stockQty > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {product.stockQty > 0 ? `● In Stock (${product.stockQty} available)` : '● Currently Unavailable'}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-2xl)' }}>
          <h2 className="section-title">Ratings & Reviews</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
            {/* Review Form */}
            <div className="card" style={{ padding: 'var(--space-xl)', alignSelf: 'start' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Write a Review</h3>
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label>Rating</label>
                  <select className="input-field" value={rating} onChange={e => setRating(Number(e.target.value))}>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea 
                    className="input-field" 
                    rows="4" 
                    placeholder="What did you like or dislike?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  />
                </div>
                {!user && (
                  <>
                    <div className="form-group">
                      <label>Verification Email</label>
                      <input 
                        type="email"
                        className="input-field" 
                        placeholder="Email used during checkout"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                      You are posting as a Guest. We need your email to verify your purchase.
                    </p>
                  </>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-tertiary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {[...reviews].reverse().map((r, i) => (
                    <div key={i} className="card" style={{ padding: 'var(--space-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                        <div style={{ fontWeight: 600 }}>{r.userName}</div>
                        <div style={{ color: '#fbbf24' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{r.comment}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-sm)' }}>
                        {new Date(r.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
