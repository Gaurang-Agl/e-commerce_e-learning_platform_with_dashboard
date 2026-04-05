import React, { useState } from 'react';
import { useApp } from './AppContext';
import Modal from './Modal';

function Meetings() {
  const { meetings } = useApp();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', date: '', type: 'Team' });
  const [meetingList, setMeetingList] = useState(meetings || []);
  const [filter, setFilter] = useState('all');

  const today = meetingList.filter(m => m.date === '2026-03-26');
  const upcoming = meetingList.filter(m => m.status === 'upcoming');
  const completed = meetingList.filter(m => m.status === 'completed');

  const filtered = filter === 'all' ? meetingList
    : filter === 'today' ? today
    : filter === 'upcoming' ? upcoming
    : filter === 'completed' ? completed : meetingList;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    setMeetingList(prev => [{ ...form, id: Date.now(), participants: ['GA'], status: 'upcoming', link: '#' }, ...prev]);
    setForm({ title: '', time: '', date: '', type: 'Team' });
    setShowAdd(false);
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}>📹 Meetings</h1>
        <button className="btn btn-primary btn-small" onClick={() => setShowAdd(true)}>+ Schedule Meeting</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Manage your meetings, join calls, and track your schedule.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'today' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'today' ? 'all' : 'today')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{today.length}</div><div className="stat-card-label">Today</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'upcoming' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'upcoming' ? 'all' : 'upcoming')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{upcoming.length}</div><div className="stat-card-label">Upcoming</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'completed' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{completed.length}</div><div className="stat-card-label">Completed</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'all' ? 'stat-active' : ''}`} onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{meetingList.length}</div><div className="stat-card-label">Total</div>
        </div>
      </div>

      <div className="section-header"><h2 className="section-title" style={{ fontSize: 16 }}>📋 Schedule</h2></div>
      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Type</th><th>Participants</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedMeeting(m)}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{m.title}</td>
                <td>{m.date}</td>
                <td>{m.time}</td>
                <td><span className="member-department">{m.type}</span></td>
                <td>{m.participants.join(', ')}</td>
                <td><span className={`status-pill ${m.status === 'in-progress' ? 'submitted' : m.status === 'upcoming' ? 'pending' : 'approved'}`}>{m.status}</span></td>
                <td><button className="btn btn-primary btn-small" onClick={(e) => { e.stopPropagation(); }} disabled={m.status === 'completed'}>
                  {m.status === 'completed' ? 'Done' : 'Join'}
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedMeeting} onClose={() => setSelectedMeeting(null)} title="Meeting Details" size="medium">
        {selectedMeeting && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{selectedMeeting.title}</h3>
            <div className="detail-grid">
              <div className="detail-field"><div className="detail-field-label">Date</div><div className="detail-field-value">{selectedMeeting.date}</div></div>
              <div className="detail-field"><div className="detail-field-label">Time</div><div className="detail-field-value">{selectedMeeting.time}</div></div>
              <div className="detail-field"><div className="detail-field-label">Type</div><div className="detail-field-value">{selectedMeeting.type}</div></div>
              <div className="detail-field"><div className="detail-field-label">Status</div><div className="detail-field-value" style={{ textTransform: 'capitalize' }}>{selectedMeeting.status}</div></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="detail-field-label" style={{ marginBottom: 8 }}>Participants</div>
              <div style={{ display: 'flex', gap: 8 }}>{selectedMeeting.participants.map((p, i) => <span key={i} className="member-department">{p}</span>)}</div>
            </div>
            {selectedMeeting.status !== 'completed' && (
              <div className="form-actions"><button className="btn btn-primary">Join Meeting</button></div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Schedule Meeting" size="medium">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Title</label><input className="form-input" type="text" placeholder="Meeting title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Time</label><input className="form-input" type="text" placeholder="e.g. 2:00 PM — 3:00 PM" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option>Team</option><option>1:1</option><option>Design</option><option>External</option><option>All-Hands</option>
            </select>
          </div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary">Schedule</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default Meetings;
