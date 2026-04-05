import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function TeamSpace() {
  const { teamMembers, addMember, updateMember, deleteMember, teamActivity, roles, addRole } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', dept: 'engineering', email: '', phone: '' });
  const [addingCustomRole, setAddingCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const filters = ['all', 'engineering', 'design', 'marketing', 'hr', 'product', 'sales', 'customer'];
  const filterLabels = { all: 'All Teams', engineering: 'Engineering', design: 'Design', marketing: 'Marketing', hr: 'HR & People', product: 'Product', sales: 'Sales', customer: 'G Store' };
  const members = filter === 'all' ? teamMembers : teamMembers.filter(m => m.dept === filter);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.dept) return;
    addMember({ ...form, joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
    setForm({ name: '', role: '', dept: 'engineering', email: '', phone: '' });
    setShowAddMember(false);
    resetCustomRole();
  };

  const handleEditMember = (e) => {
    e.preventDefault();
    if (!showEditMember) return;
    updateMember(showEditMember.id, form);
    setShowEditMember(null);
    resetCustomRole();
  };

  const openEdit = (member) => {
    setForm({ name: member.name, role: member.role, dept: member.dept, email: member.email || '', phone: member.phone || '' });
    setShowEditMember(member);
    resetCustomRole();
  };

  const resetCustomRole = () => { setAddingCustomRole(false); setCustomRoleInput(''); };

  const handleRoleChange = (e) => {
    if (e.target.value === '__add_new__') setAddingCustomRole(true);
    else setForm({...form, role: e.target.value});
  };

  const handleAddCustomRole = () => {
    if (customRoleInput.trim()) {
      addRole(customRoleInput.trim());
      setForm({ ...form, role: customRoleInput.trim() });
      resetCustomRole();
    }
  };

  const renderRoleField = () => (
    <div className="form-group">
      <label className="form-label">Role / Designation</label>
      {!addingCustomRole ? (
        <select className="form-select" value={form.role} onChange={handleRoleChange}>
          <option value="">Select a role...</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
          <option value="__add_new__">+ Add New Role...</option>
        </select>
      ) : (
        <div className="custom-role-input-row">
          <input className="form-input" type="text" placeholder="Enter new role title" value={customRoleInput} onChange={e => setCustomRoleInput(e.target.value)} autoFocus />
          <button type="button" className="btn btn-primary btn-small" onClick={handleAddCustomRole}>Add</button>
          <button type="button" className="btn btn-secondary btn-small" onClick={resetCustomRole}>Cancel</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Team /> Team Space</h1>
        <button className="btn btn-primary btn-small" onClick={() => { setForm({ name: '', role: '', dept: 'engineering', email: '', phone: '' }); setShowAddMember(true); resetCustomRole(); }}>+ Add Member</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Explore your colleagues, connect across departments, and see what everyone is working on.</p>

      <div className="team-filters animate-fade-up">
        {filters.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{filterLabels[f]}</button>
        ))}
      </div>

      <div className="content-with-sidebar">
        <div>
          <div className="team-grid">
            {members.map((m, i) => (
              <div className={`team-member-card glass-card animate-fade-up stagger-${Math.min((i % 6) + 1, 6)}`} key={m.id}>
                <div className="member-avatar" style={{ background: m.gradient, cursor: 'pointer' }} onClick={() => setSelectedMember(m)}>
                  {m.initials}
                  <div className={`status-dot ${m.status}`}></div>
                </div>
                <h3 className="member-name" style={{ cursor: 'pointer' }} onClick={() => setSelectedMember(m)}>{m.name}</h3>
                <p className="member-role">{m.role}</p>
                <span className="member-department">{m.dept.charAt(0).toUpperCase() + m.dept.slice(1)}</span>
                {m.source === 'backend' && (
                  <span className="member-source-badge member-source-backend">🛍️ G Store User</span>
                )}
                <div className="member-actions">
                  <button className="member-action-btn" title="View Profile" onClick={() => setSelectedMember(m)}><Icons.Profile /></button>
                  <button className="member-action-btn" title="Edit" onClick={() => openEdit(m)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="member-action-btn" title="Delete" onClick={() => { if(window.confirm(`Remove ${m.name}?`)) deleteMember(m.id); }} style={{ color: 'var(--accent-rose)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-header" style={{ marginBottom: 12 }}><h2 className="section-title" style={{ fontSize: 16 }}>⚡ Recent Activity</h2></div>
          <div className="team-activity-card glass-card">
            {teamActivity.map((a, i) => (
              <div className="activity-item" key={i} onClick={() => setSelectedActivity(a)} style={{ cursor: 'pointer' }}>
                <div className="activity-avatar" style={{ background: a.gradient }}>{a.initials}</div>
                <div>
                  <p className="activity-text" dangerouslySetInnerHTML={{ __html: `<strong>${a.name}</strong> ${a.action}` }} />
                  <p className="activity-time">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="Team Member" size="medium">
        {selectedMember && (
          <div>
            <div className="detail-header">
              <div className="detail-avatar" style={{ background: selectedMember.gradient }}>{selectedMember.initials}</div>
              <div>
                <div className="detail-title">{selectedMember.name}</div>
                <div className="detail-subtitle">{selectedMember.role}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}><div style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: selectedMember.status === 'online' ? 'var(--accent-emerald)' : selectedMember.status === 'away' ? 'var(--accent-amber)' : 'var(--text-tertiary)' }}></div> <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{selectedMember.status}</span></div>
            </div>
            <div className="detail-grid">
              <div className="detail-field"><div className="detail-field-label">Department</div><div className="detail-field-value">{selectedMember.dept.charAt(0).toUpperCase() + selectedMember.dept.slice(1)}</div></div>
              <div className="detail-field"><div className="detail-field-label">Email</div><div className="detail-field-value">{selectedMember.email}</div></div>
              <div className="detail-field"><div className="detail-field-label">Phone</div><div className="detail-field-value">{selectedMember.phone}</div></div>
              <div className="detail-field"><div className="detail-field-label">Joined</div><div className="detail-field-value">{selectedMember.joined}</div></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => openEdit(selectedMember)}>Edit Profile</button>
              <button className="btn btn-danger" onClick={() => { if(window.confirm(`Remove ${selectedMember.name}?`)) { deleteMember(selectedMember.id); setSelectedMember(null); } }}>Remove</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Activity Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Activity Detail" size="medium">
        {selectedActivity && (
          <div>
            <div className="detail-header">
              <div className="detail-avatar" style={{ background: selectedActivity.gradient }}>{selectedActivity.initials}</div>
              <div>
                <div className="detail-title">{selectedActivity.name}</div>
                <div className="detail-subtitle">{selectedActivity.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 16 }} dangerouslySetInnerHTML={{ __html: selectedActivity.action }} />
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, marginTop: 12, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>{selectedActivity.detail}</p>
          </div>
        )}
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMember} onClose={() => { setShowAddMember(false); resetCustomRole(); }} title="Add Team Member" size="medium">
        <form onSubmit={handleAddMember}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" type="text" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          {renderRoleField()}
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-select" value={form.dept} onChange={e => setForm({...form, dept: e.target.value})}>
              <option value="engineering">Engineering</option><option value="design">Design</option><option value="marketing">Marketing</option><option value="hr">HR & People</option><option value="product">Product</option><option value="sales">Sales</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="email@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="+91 99999 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          </div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => { setShowAddMember(false); resetCustomRole(); }}>Cancel</button><button type="submit" className="btn btn-primary">Add Member</button></div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal isOpen={!!showEditMember} onClose={() => { setShowEditMember(null); resetCustomRole(); }} title="Edit Team Member" size="medium">
        <form onSubmit={handleEditMember}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          {renderRoleField()}
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-select" value={form.dept} onChange={e => setForm({...form, dept: e.target.value})}>
              <option value="engineering">Engineering</option><option value="design">Design</option><option value="marketing">Marketing</option><option value="hr">HR & People</option><option value="product">Product</option><option value="sales">Sales</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          </div>
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => { setShowEditMember(null); resetCustomRole(); }}>Cancel</button><button type="submit" className="btn btn-primary">Save Changes</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default TeamSpace;
