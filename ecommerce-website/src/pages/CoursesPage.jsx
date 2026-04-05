import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const { addCourse, isCourseInCart, openCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, course) => {
    e.stopPropagation();
    if (isCourseInCart(course.id)) {
      openCart();
      return;
    }
    addCourse(course);
    toast.success(`${course.title} added to cart!`);
  };

  const handleBuyNow = (e, course) => {
    e.stopPropagation();
    if (!isCourseInCart(course.id)) {
      addCourse(course);
    }
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p>Loading courses...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <h1 className="section-title">📚 Learning Hub</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)', marginTop: '-0.5rem' }}>
          Upskill with expert-led courses. From web development to data science — learn at your pace.
        </p>

        <div className="courses-grid">
          {courses.map((course, i) => {
            const inCart = isCourseInCart(course.id);
            return (
              <div className="course-card animate-fade-in" key={course.id}
                style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>

                {course.badge && (
                  <div className="course-card-badge">
                    <span className={`badge ${course.badge === 'bestseller' ? 'badge-warning' :
                      course.badge === 'popular' ? 'badge-primary' : 'badge-success'}`}>
                      {course.badgeLabel}
                    </span>
                  </div>
                )}

                <div className="course-icon">{course.image}</div>
                <h3>{course.title}</h3>
                <p className="course-desc" style={expandedCourse === course.id ? {
                  WebkitLineClamp: 'unset', display: 'block'
                } : {}}>{course.description}</p>

                <div className="course-meta">
                  <span>👤 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}</span>
                </div>

                {/* Expanded modules */}
                {expandedCourse === course.id && course.modules && (
                  <div style={{
                    marginBottom: 'var(--space-md)', padding: 'var(--space-md)',
                    background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                    animation: 'slideDown 0.3s ease'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)',
                      marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Course Modules
                    </div>
                    {course.modules.map((mod, j) => (
                      <div key={j} style={{
                        padding: '6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)',
                        borderBottom: j < course.modules.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        <span style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>▸</span>
                        {mod}
                      </div>
                    ))}
                  </div>
                )}

                <div className="course-card-footer">
                  <div className="course-price">₹{course.price.toLocaleString()}</div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {course.enrollments} enrolled
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="course-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={(e) => handleAddToCart(e, course)}
                    id={`course-add-cart-${course.id}`}
                  >
                    {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={(e) => handleBuyNow(e, course)}
                    id={`course-buy-now-${course.id}`}
                  >
                    💳 Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
