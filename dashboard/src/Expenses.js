import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function Expenses() {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: '', category: 'Travel', description: '', amount: '' });
  const [filter, setFilter] = useState('all');

  const pendingList = expenses.filter(e => e.status === 'pending');
  const approvedList = expenses.filter(e => e.status === 'approved' || e.status === 'reimbursed');
  const totalPending = pendingList.reduce((s, e) => s + e.amount, 0);
  const totalApproved = approvedList.reduce((s, e) => s + e.amount, 0);

  const filtered = filter === 'all' ? expenses
    : filter === 'pending' ? pendingList
    : filter === 'approved' ? approvedList : expenses;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount) return;
    addExpense({ ...form, amount: Number(form.amount) });
    setForm({ date: '', category: 'Travel', description: '', amount: '' });
    setShowAdd(false);
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Dollar /> Expense Tracker</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Submit and track your expense claims and reimbursements.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'pending' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')} style={{ cursor: 'pointer' }}><div className="stat-card-value">₹{totalPending.toLocaleString()}</div><div className="stat-card-label">Pending</div></div>
        <div className={`stat-card glass-card ${filter === 'approved' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')} style={{ cursor: 'pointer' }}><div className="stat-card-value">₹{totalApproved.toLocaleString()}</div><div className="stat-card-label">Approved</div></div>
        <div className={`stat-card glass-card ${filter === 'all' ? 'stat-active' : ''}`} onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{expenses.length}</div><div className="stat-card-label">Total Claims</div></div>
      </div>

      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: 16 }}>💳 Expense Claims {filter !== 'all' && <span style={{ color: 'var(--accent-blue)', fontSize: 12, fontWeight: 400 }}> — filtered by {filter}</span>}</h2>
        <button className="btn btn-primary btn-small" onClick={() => setShowAdd(true)}>+ New Expense</button>
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(exp => (
              <tr key={exp.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>₹{exp.amount.toLocaleString()}</td>
                <td><span className={`status-pill ${exp.status}`}>{exp.status}</span></td>
                <td>
                  <button className="action-icon-btn danger" onClick={() => deleteExpense(exp.id)} title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Expense Claim" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" min="1" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Travel</option><option>Meals</option><option>Software</option><option>Office Supplies</option><option>Communication</option><option>Other</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Description</label><input className="form-input" type="text" placeholder="What was this expense for?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary">Submit Claim</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default Expenses;
