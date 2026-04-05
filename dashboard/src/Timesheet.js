import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function Timesheet() {
  const { timesheetEntries, addTimesheetEntry, deleteTimesheetEntry } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: '', project: '', hours: '', task: '' });
  const [filter, setFilter] = useState('all');

  const totalHours = timesheetEntries.reduce((sum, e) => sum + e.hours, 0);
  const thisWeek = timesheetEntries.filter(e => new Date(e.date) > new Date(Date.now() - 7 * 86400000));
  const weekHours = thisWeek.reduce((sum, e) => sum + e.hours, 0);
  const approved = timesheetEntries.filter(e => e.status === 'approved');
  const pending = timesheetEntries.filter(e => e.status === 'submitted');

  const filtered = filter === 'all' ? timesheetEntries
    : filter === 'approved' ? approved
    : filter === 'pending' ? pending : timesheetEntries;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.project || !form.hours) return;
    addTimesheetEntry({ ...form, hours: Number(form.hours) });
    setForm({ date: '', project: '', hours: '', task: '' });
    setShowAdd(false);
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Clock /> Timesheet</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Track your work hours across projects and tasks.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'all' ? 'stat-active' : ''}`} onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{weekHours}h</div><div className="stat-card-label">This Week</div></div>
        <div className="stat-card glass-card" style={{ cursor: 'default' }}><div className="stat-card-value">{totalHours}h</div><div className="stat-card-label">This Month</div></div>
        <div className={`stat-card glass-card ${filter === 'approved' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{approved.length}</div><div className="stat-card-label">Approved</div></div>
        <div className={`stat-card glass-card ${filter === 'pending' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{pending.length}</div><div className="stat-card-label">Pending</div></div>
      </div>

      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: 16 }}>📋 Entries {filter !== 'all' && <span style={{ color: 'var(--accent-blue)', fontSize: 12, fontWeight: 400 }}> — filtered by {filter}</span>}</h2>
        <button className="btn btn-primary btn-small" onClick={() => setShowAdd(true)}>+ Add Entry</button>
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>Date</th><th>Project</th><th>Task</th><th>Hours</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(entry => (
              <tr key={entry.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{entry.date}</td>
                <td>{entry.project}</td>
                <td>{entry.task}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{entry.hours}h</td>
                <td><span className={`status-pill ${entry.status}`}>{entry.status}</span></td>
                <td>
                  <button className="action-icon-btn danger" onClick={() => deleteTimesheetEntry(entry.id)} title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Timesheet Entry" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Hours</label><input className="form-input" type="number" min="0.5" max="24" step="0.5" value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Project</label><input className="form-input" type="text" placeholder="e.g. G Workspace Redesign" value={form.project} onChange={e => setForm({...form, project: e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Task Description</label><input className="form-input" type="text" placeholder="What did you work on?" value={form.task} onChange={e => setForm({...form, task: e.target.value})} /></div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary">Submit Entry</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default Timesheet;
