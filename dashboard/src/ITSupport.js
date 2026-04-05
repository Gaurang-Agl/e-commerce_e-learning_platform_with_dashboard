import React, { useState } from 'react';
import { useApp } from './AppContext';
import Modal from './Modal';

function ITSupport() {
  const { itTickets } = useApp();
  const [tickets, setTickets] = useState(itTickets || []);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium', category: 'Software' });
  const [filter, setFilter] = useState('all');

  const open = tickets.filter(t => t.status === 'open');
  const inProgress = tickets.filter(t => t.status === 'in-progress');
  const resolved = tickets.filter(t => t.status === 'resolved');

  const filtered = filter === 'all' ? tickets
    : filter === 'open' ? open
    : filter === 'in-progress' ? inProgress
    : filter === 'resolved' ? resolved : tickets;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setTickets(prev => [{ ...form, id: Date.now(), status: 'open', assignedTo: 'IT Team', created: new Date().toISOString().split('T')[0] }, ...prev]);
    setForm({ title: '', priority: 'medium', category: 'Software' });
    setShowAdd(false);
  };

  const priorityColor = (p) => p === 'high' ? 'var(--accent-rose)' : p === 'medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)';

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}>🛠️ IT Support</h1>
        <button className="btn btn-primary btn-small" onClick={() => setShowAdd(true)}>+ Create Ticket</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Submit and track IT support requests, hardware issues, and software problems.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'open' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'open' ? 'all' : 'open')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{open.length}</div><div className="stat-card-label">Open</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'in-progress' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'in-progress' ? 'all' : 'in-progress')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{inProgress.length}</div><div className="stat-card-label">In Progress</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'resolved' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'resolved' ? 'all' : 'resolved')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{resolved.length}</div><div className="stat-card-label">Resolved</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'all' ? 'stat-active' : ''}`} onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{tickets.length}</div><div className="stat-card-label">Total</div>
        </div>
      </div>

      <div className="section-header"><h2 className="section-title" style={{ fontSize: 16 }}>🎫 Support Tickets</h2></div>
      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Created</th></tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(t)}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</td>
                <td><span className="member-department">{t.category}</span></td>
                <td><span style={{ color: priorityColor(t.priority), fontWeight: 600, textTransform: 'uppercase', fontSize: 11 }}>{t.priority}</span></td>
                <td><span className={`status-pill ${t.status === 'open' ? 'pending' : t.status === 'in-progress' ? 'submitted' : 'approved'}`}>{t.status}</span></td>
                <td>{t.assignedTo}</td>
                <td>{t.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details" size="medium">
        {selectedTicket && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{selectedTicket.title}</h3>
            <div className="detail-grid">
              <div className="detail-field"><div className="detail-field-label">Category</div><div className="detail-field-value">{selectedTicket.category}</div></div>
              <div className="detail-field"><div className="detail-field-label">Priority</div><div className="detail-field-value" style={{ color: priorityColor(selectedTicket.priority), textTransform: 'uppercase' }}>{selectedTicket.priority}</div></div>
              <div className="detail-field"><div className="detail-field-label">Status</div><div className="detail-field-value" style={{ textTransform: 'capitalize' }}>{selectedTicket.status}</div></div>
              <div className="detail-field"><div className="detail-field-label">Assigned To</div><div className="detail-field-value">{selectedTicket.assignedTo}</div></div>
              <div className="detail-field"><div className="detail-field-label">Created</div><div className="detail-field-value">{selectedTicket.created}</div></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create Support Ticket" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Issue Title</label><input className="form-input" type="text" placeholder="Describe your issue" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Software</option><option>Hardware</option><option>Network</option><option>Email</option><option>Access</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary">Submit Ticket</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default ITSupport;
