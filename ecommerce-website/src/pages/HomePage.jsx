import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addCourse, isCourseInCart, openCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/courses').then(r => r.json())
    ]).then(([prods, cors]) => {
      setProducts(prods.slice(0, 4));
      setCourses(cors.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAddCourseToCart = (e, course) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCourseInCart(course.id)) {
      openCart();
      return;
    }
    addCourse(course);
    toast.success(`${course.title} added to cart!`);
  };

  const handleBuyCourse = (e, course) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isCourseInCart(course.id)) {
      addCourse(course);
    }
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p>Loading G Store...</p></div>;
  }

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">✨ Premium Tech & Learning</div>
            <h1>
              Welcome to <span className="gradient-text">G Store</span>
            </h1>
            <p>
              Discover premium tech products and world-class courses. Shop the latest gadgets,
              accessories, and upskill with expert-led programs — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                🛍️ Shop Now
              </Link>
              <Link to="/courses" className="btn btn-secondary btn-lg">
                📚 Explore Courses
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">12+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4</div>
                <div className="hero-stat-label">Courses</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">₹499</div>
                <div className="hero-stat-label">Starting at</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">18%</div>
                <div className="hero-stat-label">GST Included</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="section-title" style={{ margin: 0 }}>🔥 Featured Products</h2>
          <Link to="/products" className="btn btn-ghost">View All →</Link>
        </div>
        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} onClick={setSelectedProduct}
              style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="section-title" style={{ margin: 0 }}>📚 Popular Courses</h2>
          <Link to="/courses" className="btn btn-ghost">View All →</Link>
        </div>
        <div className="courses-grid">
          {courses.map((course, i) => {
            const inCart = isCourseInCart(course.id);
            return (
              <div className="course-card animate-fade-in" key={course.id} style={{ animationDelay: `${i * 0.1}s` }}>
                {course.badge && (
                  <div className="course-card-badge">
                    <span className={`badge ${course.badge === 'bestseller' ? 'badge-warning' : course.badge === 'popular' ? 'badge-primary' : 'badge-success'}`}>
                      {course.badgeLabel}
                    </span>
                  </div>
                )}
                <div className="course-icon">{course.image}</div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span>👤 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}</span>
                </div>
                <div className="course-card-footer">
                  <div className="course-price">₹{course.price.toLocaleString()}</div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {course.enrollments} enrolled
                  </span>
                </div>
                {/* Action Buttons */}
                <div className="course-actions">
                  <button
                    className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={(e) => handleAddCourseToCart(e, course)}
                  >
                    {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={(e) => handleBuyCourse(e, course)}
                  >
                    💳 Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="card" style={{
          padding: 'var(--space-2xl)', textAlign: 'center',
          background: 'var(--gradient-card)', border: '1px solid var(--border-accent)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
            🚀 Access Your Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: 500, margin: '0 auto var(--space-xl)' }}>
            Manage your team, track orders, monitor stock, view invoices, and more from the G Workspace Dashboard.
          </p>
          <a href="https://gaurang-workspace.netlify.app" target="_blank" rel="noopener noreferrer"
            className="btn btn-primary btn-lg">
            Open Dashboard ↗
          </a>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
