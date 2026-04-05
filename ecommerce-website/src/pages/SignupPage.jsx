import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', dept: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone, form.dept);
      toast.success('Account created! Welcome to G Store 🎉');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <Link to="/" className="navbar-brand" style={{ justifyContent: 'center', fontSize: '1.5rem' }}>
            <div className="brand-icon" style={{ width: 42, height: 42, fontSize: '1.2rem' }}>G</div>
            <span>G Store</span>
          </Link>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join G Store and start shopping today</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe"
              name="name" value={form.name} onChange={handleChange} required id="signup-name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              name="email" value={form.email} onChange={handleChange} required id="signup-email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min 6 characters"
              name="password" value={form.password} onChange={handleChange} required id="signup-password" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input type="text" className="form-input" placeholder="+91 98765..."
                name="phone" value={form.phone} onChange={handleChange} id="signup-phone" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input" name="dept" value={form.dept} onChange={handleChange} id="signup-dept"
                style={{ cursor: 'pointer' }}>
                <option value="">Select...</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
            style={{ width: '100%' }} id="signup-submit">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
