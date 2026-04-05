import React, { useState } from 'react';
import { useApp } from './AppContext';
import Modal from './Modal';

function HRPortal() {
  const { hrResources } = useApp();
  const [selectedResource, setSelectedResource] = useState(null);
  const [filter, setFilter] = useState('all');

  const resources = hrResources || [];
  const categories = [...new Set(resources.map(r => r.category))];
  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter);

  const policiesCount = resources.filter(r => r.category === 'Policies').length;
  const benefitsCount = resources.filter(r => r.category === 'Benefits' || r.category === 'Wellness').length;
  const openPositions = resources.find(r => r.category === 'Careers')?.count || 0;
  const trainingCount = resources.find(r => r.category === 'Training')?.count || 0;

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}>🏢 HR Portal</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Access HR resources, company policies, benefits information, and career opportunities.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'Policies' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'Policies' ? 'all' : 'Policies')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{policiesCount}</div><div className="stat-card-label">Policies</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'Benefits' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'Benefits' ? 'all' : 'Benefits')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{benefitsCount}</div><div className="stat-card-label">Benefits</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'Careers' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'Careers' ? 'all' : 'Careers')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{openPositions}</div><div className="stat-card-label">Open Positions</div>
        </div>
        <div className={`stat-card glass-card ${filter === 'Training' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'Training' ? 'all' : 'Training')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-value">{trainingCount}</div><div className="stat-card-label">Training Events</div>
        </div>
      </div>

      <div className="team-filters animate-fade-up" style={{ marginBottom: 20 }}>
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {categories.map(c => (
          <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="grid-2">
        {filtered.map(r => (
          <div key={r.id} className="glass-card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => setSelectedResource(r)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ fontSize: 28, width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</p>
                <span className="member-department" style={{ marginTop: 8, display: 'inline-block' }}>{r.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedResource} onClose={() => setSelectedResource(null)} title={selectedResource?.title || ''} size="medium">
        {selectedResource && (
          <div>
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>{selectedResource.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{selectedResource.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, textAlign: 'center', marginBottom: 20 }}>{selectedResource.desc}</p>
            <div className="detail-grid">
              <div className="detail-field"><div className="detail-field-label">Category</div><div className="detail-field-value">{selectedResource.category}</div></div>
              <div className="detail-field"><div className="detail-field-label">Last Updated</div><div className="detail-field-value">March 2026</div></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary">Open Resource</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HRPortal;
