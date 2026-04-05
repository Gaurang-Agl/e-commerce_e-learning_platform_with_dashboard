import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function LeaveManager() {
  const { leaveRequests, addLeaveRequest, deleteLeaveRequest } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'Annual Leave', from: '', to: '', reason: '' });
  const [filter, setFilter] = useState('all');

  const totalUsed = leaveRequests.filter(l => l.status === 'approved').reduce((s, l) => s + l.days, 0);
  const pending = leaveRequests.filter(l => l.status === 'pending');
  const approved = leaveRequests.filter(l => l.status === 'approved');

  const filtered = filter === 'all' ? leaveRequests
    : filter === 'pending' ? pending
    : filter === 'approved' ? approved : leaveRequests;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    const from = new Date(form.from);
    const to = new Date(form.to);
    const days = Math.max(1, Math.ceil((to - from) / 86400000) + 1);
    addLeaveRequest({ ...form, days });
    setForm({ type: 'Annual Leave', from: '', to: '', reason: '' });
    setShowAdd(false);
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Calendar /> Leave Manager</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Manage your leave requests, WFH days, and time-off balance.</p>

      <div className="stats-row">
        <div className="stat-card glass-card" style={{ cursor: 'default' }}><div className="stat-card-value">24</div><div className="stat-card-label">Total Annual</div></div>
        <div className={`stat-card glass-card ${filter === 'approved' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{totalUsed}</div><div className="stat-card-label">Used</div></div>
        <div className="stat-card glass-card" style={{ cursor: 'default' }}><div className="stat-card-value">{24 - totalUsed}</div><div className="stat-card-label">Remaining</div></div>
        <div className={`stat-card glass-card ${filter === 'pending' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{pending.length}</div><div className="stat-card-label">Pending</div></div>
      </div>

      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: 16 }}>📄 Leave Requests {filter !== 'all' && <span style={{ color: 'var(--accent-blue)', fontSize: 12, fontWeight: 400 }}> — filtered by {filter}</span>}</h2>
        <button className="btn btn-primary btn-small" onClick={() => setShowAdd(true)}>+ New Request</button>
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(leave => (
              <tr key={leave.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{leave.type}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{leave.days}</td>
                <td>{leave.reason}</td>
                <td><span className={`status-pill ${leave.status}`}>{leave.status}</span></td>
                <td>
                  <button className="action-icon-btn danger" onClick={() => deleteLeaveRequest(leave.id)} title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Leave Request" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option>Annual Leave</option><option>Sick Leave</option><option>Work From Home</option><option>Personal Leave</option><option>Comp Off</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">From</label><input className="form-input" type="date" value={form.from} onChange={e => setForm({...form, from: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">To</label><input className="form-input" type="date" value={form.to} onChange={e => setForm({...form, to: e.target.value})} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Reason</label><textarea className="form-textarea" placeholder="Brief reason for leave..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} /></div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary">Submit Request</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default LeaveManager;
