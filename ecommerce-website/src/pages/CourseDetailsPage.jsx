import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCourse, isCourseInCart, openCart } = useCart();
  const toast = useToast();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setCourse(data); setLoading(false); })
      .catch(() => { navigate('/courses'); });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (isCourseInCart(course.id)) {
      openCart();
    } else {
      addCourse(course);
      toast.success(`${course.title} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!isCourseInCart(course.id)) {
      addCourse(course);
    }
    navigate('/checkout');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const userEmail = user?.email || email.trim();
    if (!userEmail) {
      return toast.error('Please provide an email to verify your purchase.');
    }

    setSubmittingReview(true);
    const userName = user?.name || 'Guest Student';
    
    try {
      const res = await fetch(`/api/courses/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, userName, email: userEmail })
      });
      if (res.ok) {
        const updatedCourse = await res.json();
        setCourse(updatedCourse);
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

  const inCart = isCourseInCart(course.id);
  const isEmoji = course.image.length <= 4 && !course.image.startsWith('http');
  const reviews = course.reviews || [];
  const avgRating = course.rating || (reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'New');

  return (
    <div className="page-wrapper">
      {/* Hero Header */}
      <div style={{ background: 'var(--gradient-card)', borderBottom: '1px solid var(--border-primary)', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 'var(--space-xl)' }}>
            ← Back to Courses
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3xl)', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                {course.category && <span className="badge badge-info">{course.category}</span>}
                {course.badge && <span className={`badge ${course.badge === 'bestseller' ? 'badge-warning' : 'badge-primary'}`}>{course.badgeLabel}</span>}
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 'var(--space-sm)', lineHeight: 1.2 }}>{course.title}</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>{course.description}</p>
              
              <div style={{ display: 'flex', gap: 'var(--space-xl)', color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>👤 Instructor: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{course.instructor}</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⏱️ {course.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24' }}>★ <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{avgRating}</span> ({reviews.length} ratings)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🎓 {course.enrollments} enrolled</span>
              </div>
            </div>

            {/* Action Card */}
            <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ background: isEmoji ? `${course.color}20` : 'transparent', height: 200, margin: '-var(--space-xl) -var(--space-xl) var(--space-xl) -var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isEmoji ? (
                  <span style={{ fontSize: '5rem' }}>{course.image}</span>
                ) : (
                  <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
                ₹{course.price.toLocaleString()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <button className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} btn-lg`} onClick={handleAddToCart}>
                  {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
                </button>
                <button className="btn btn-success btn-lg" onClick={handleBuyNow}>
                  💳 Buy Now
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-md)' }}>
                Includes full lifetime access. Certificate of completion.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-3xl) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3xl)' }}>
          {/* Syllabus */}
          <div>
            <h2 className="section-title">Course Syllabus</h2>
            <div style={{ marginTop: 'var(--space-xl)' }}>
              {course.modules && course.modules.map((mod, i) => (
                <div key={i} style={{ 
                  padding: 'var(--space-lg)', 
                  border: '1px solid var(--border-primary)', 
                  marginBottom: 'var(--space-sm)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)'
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {i+1}
                  </div>
                  <div style={{ fontWeight: 500 }}>{mod}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor & Details */}
          <div>
            <h2 className="section-title">About the Instructor</h2>
            <div className="card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', margin: '0 auto var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 700 }}>
                {course.instructor.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>{course.instructor}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Senior Expert & Professional Educator</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section" style={{ borderTop: '1px solid var(--border-primary)', marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-2xl)' }}>
          <h2 className="section-title">Student Reviews</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
            {/* Review Form */}
            <div className="card" style={{ padding: 'var(--space-xl)', alignSelf: 'start' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Leave a Review</h3>
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
                  <label>Your Feedback</label>
                  <textarea 
                    className="input-field" 
                    rows="4" 
                    placeholder="How was the course?"
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
                      Browsing as Guest. We need your email to verify your enrollment.
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
                  <p>No reviews yet. Enrolled? Let others know what you think!</p>
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
