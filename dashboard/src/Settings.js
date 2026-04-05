import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'team', label: 'Team Management', icon: '👥' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

function Settings() {
  const { currentUser, teamMembers, addMember, deleteMember, roles, addRole } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({ email: true, push: true, announcements: true, celebrations: true, feed: false });
  const [appearance, setAppearance] = useState({ darkMode: true, animations: true, compactView: false });
  const [showAddMember, setShowAddMember] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', dept: 'engineering', email: '', phone: '' });
  const [addingCustomRole, setAddingCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const toggleNotif = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleAppear = (key) => setAppearance(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.dept) return;
    addMember({ ...form, joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
    setForm({ name: '', role: '', dept: 'engineering', email: '', phone: '' });
    setShowAddMember(false);
    setAddingCustomRole(false);
    setCustomRoleInput('');
  };

  const handleAddCustomRole = () => {
    if (customRoleInput.trim()) {
      addRole(customRoleInput.trim());
      setForm({ ...form, role: customRoleInput.trim() });
      setAddingCustomRole(false);
      setCustomRoleInput('');
    }
  };

  const renderProfile = () => (
    <div className="settings-section glass-card animate-fade-up">
      <h3>👤 Profile</h3>
      <div className="detail-header">
        <div className="detail-avatar" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
        <div>
          <div className="detail-title">{currentUser.name}</div>
          <div className="detail-subtitle">{currentUser.role}</div>
        </div>
      </div>
      <div className="detail-grid">
        <div className="detail-field"><div className="detail-field-label">Email</div><div className="detail-field-value">{currentUser.email}</div></div>
        <div className="detail-field"><div className="detail-field-label">Phone</div><div className="detail-field-value">{currentUser.phone}</div></div>
        <div className="detail-field"><div className="detail-field-label">Department</div><div className="detail-field-value">Engineering</div></div>
        <div className="detail-field"><div className="detail-field-label">Joined</div><div className="detail-field-value">{currentUser.joined}</div></div>
        <div className="detail-field"><div className="detail-field-label">Status</div><div className="detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="dropdown-status-dot online" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span> Online</div></div>
        <div className="detail-field"><div className="detail-field-label">Role</div><div className="detail-field-value">{currentUser.role}</div></div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="settings-section glass-card animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ marginBottom: 0 }}>👥 Team Management</h3>
        <button className="btn btn-primary btn-small" onClick={() => { setForm({ name: '', role: '', dept: 'engineering', email: '', phone: '' }); setShowAddMember(true); }}>+ Add Member</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Manage team members — add new people or remove existing ones.</p>
      <div className="settings-team-list">
        {teamMembers.map(m => (
          <div className="settings-team-member" key={m.id}>
            <div className="settings-team-avatar" style={{ background: m.gradient }}>{m.initials}</div>
            <div className="settings-team-info">
              <div className="settings-team-name">{m.name}</div>
              <div className="settings-team-role">{m.role}</div>
            </div>
            <div className="settings-team-dept">
              <span className="member-department">{m.dept.charAt(0).toUpperCase() + m.dept.slice(1)}</span>
            </div>
            <button
              className="member-action-btn"
              title="Remove"
              style={{ color: 'var(--accent-rose)' }}
              onClick={() => { if (window.confirm(`Remove ${m.name}?`)) deleteMember(m.id); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-section glass-card animate-fade-up">
      <h3>🔔 Notifications</h3>
      {[
        { key: 'email', title: 'Email Notifications', desc: 'Receive important updates via email' },
        { key: 'push', title: 'Push Notifications', desc: 'Get real-time browser notifications' },
        { key: 'announcements', title: 'Announcements', desc: 'Notify me about company announcements' },
        { key: 'celebrations', title: 'Celebrations', desc: 'Notify me about birthdays and anniversaries' },
        { key: 'feed', title: 'Feed Activity', desc: 'Notify me about likes and comments on my posts' },
      ].map(item => (
        <div className="setting-row" key={item.key}>
          <div className="setting-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
          <button className={`toggle ${notifications[item.key] ? 'active' : ''}`} onClick={() => toggleNotif(item.key)} aria-label={`Toggle ${item.title}`} />
        </div>
      ))}
    </div>
  );

  const renderAppearance = () => (
    <div className="settings-section glass-card animate-fade-up">
      <h3>🎨 Appearance</h3>
      {[
        { key: 'darkMode', title: 'Dark Mode', desc: 'Use dark theme for reduced eye strain' },
        { key: 'animations', title: 'Animations', desc: 'Enable smooth transitions and micro-animations' },
        { key: 'compactView', title: 'Compact View', desc: 'Reduce spacing for more content on screen' },
      ].map(item => (
        <div className="setting-row" key={item.key}>
          <div className="setting-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
          <button className={`toggle ${appearance[item.key] ? 'active' : ''}`} onClick={() => toggleAppear(item.key)} aria-label={`Toggle ${item.title}`} />
        </div>
      ))}
    </div>
  );

  const renderAbout = () => (
    <div className="settings-section glass-card animate-fade-up">
      <h3>ℹ️ About</h3>
      <div className="detail-grid">
        <div className="detail-field"><div className="detail-field-label">Version</div><div className="detail-field-value">2.0.0</div></div>
        <div className="detail-field"><div className="detail-field-label">Build</div><div className="detail-field-value">2026.03.26</div></div>
        <div className="detail-field"><div className="detail-field-label">Platform</div><div className="detail-field-value">React 19</div></div>
        <div className="detail-field"><div className="detail-field-label">License</div><div className="detail-field-value">Internal Use</div></div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'team': return renderTeam();
      case 'notifications': return renderNotifications();
      case 'appearance': return renderAppearance();
      case 'about': return renderAbout();
      default: return renderProfile();
    }
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Settings /> Settings</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Manage your account preferences and workspace settings.</p>

      <div className="settings-layout">
        {/* Left Nav */}
        <nav className="settings-nav glass-card">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-nav-icon">{tab.icon}</span>
              <span className="settings-nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Panel */}
        <div className="settings-panel">
          {renderTab()}
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMember} onClose={() => { setShowAddMember(false); setAddingCustomRole(false); setCustomRoleInput(''); }} title="Add Team Member" size="medium">
        <form onSubmit={handleAddMember}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" type="text" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group">
            <label className="form-label">Role / Designation</label>
            {!addingCustomRole ? (
              <>
                <select className="form-select" value={form.role} onChange={e => { if (e.target.value === '__add_new__') { setAddingCustomRole(true); } else { setForm({...form, role: e.target.value}); } }}>
                  <option value="">Select a role...</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  <option value="__add_new__">+ Add New Role...</option>
                </select>
              </>
            ) : (
              <div className="custom-role-input-row">
                <input className="form-input" type="text" placeholder="Enter new role title" value={customRoleInput} onChange={e => setCustomRoleInput(e.target.value)} autoFocus />
                <button type="button" className="btn btn-primary btn-small" onClick={handleAddCustomRole}>Add</button>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => { setAddingCustomRole(false); setCustomRoleInput(''); }}>Cancel</button>
              </div>
            )}
          </div>
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
          <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => { setShowAddMember(false); setAddingCustomRole(false); setCustomRoleInput(''); }}>Cancel</button><button type="submit" className="btn btn-primary">Add Member</button></div>
        </form>
      </Modal>
    </div>
  );
}

export default Settings;
