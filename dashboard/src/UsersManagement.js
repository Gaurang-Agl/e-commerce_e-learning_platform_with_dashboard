import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Admin token (if implemented)
      }
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch users');
        return r.json();
      })
      .then(data => { setUsers(data); setLoading(false); setError(null); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) {
    return (
      <div className="page-content page-transition">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loading-spinner" />
          <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Loading user registry...</span>
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
          <button className="btn btn-primary" onClick={fetchUsers}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      <div className="ecom-stats-grid animate-fade-up">
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>👥</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{users.length}</div>
            <div className="ecom-stat-label">Total Registered Users</div>
          </div>
        </div>
        <div className="ecom-stat-card glass-card">
          <div className="ecom-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>🌟</div>
          <div className="ecom-stat-info">
            <div className="ecom-stat-value">{users.filter(u => u.role === 'admin').length}</div>
            <div className="ecom-stat-label">Active Admins</div>
          </div>
        </div>
      </div>

      <div className="ecom-table-card glass-card animate-fade-up stagger-1" style={{ marginTop: 'var(--space-2xl)' }}>
        <div className="ecom-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            📋 User Registry
          </h3>
          <button className="btn btn-ghost btn-sm" onClick={fetchUsers}>🔄 Refresh</button>
        </div>
        <div className="ecom-table-wrap">
          <table className="ecom-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email Address</th>
                <th>Account ID</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="ecom-product-icon" style={{ background: 'var(--bg-glass)', height: 36, width: 36, borderRadius: '50%', fontSize: 16 }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{u.id}</td>
                  <td>
                    {u.role === 'admin' ? (
                      <span className="badge badge-primary">Admin</span>
                    ) : (
                      <span className="badge badge-info">Standard User</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-tertiary)' }}>
                    No users found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersManagement;
