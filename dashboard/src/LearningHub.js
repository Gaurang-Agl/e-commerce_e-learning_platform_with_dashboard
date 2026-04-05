import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function LearningHub() {
  const { learningCourses, setLearningCourses } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('all');

  const inProgress = learningCourses.filter(c => c.badge === 'in-progress');
  const completed = learningCourses.filter(c => c.badge === 'completed');
  const newCourses = learningCourses.filter(c => c.badge === 'new');

  const filtered = filter === 'all' ? learningCourses
    : filter === 'in-progress' ? inProgress
    : filter === 'completed' ? completed
    : filter === 'new' ? newCourses : learningCourses;

  const enrollCourse = (id) => {
    setLearningCourses(prev => prev.map(c => c.id === id ? { ...c, badge: 'in-progress', badgeLabel: 'In Progress', progress: 5 } : c));
  };

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Book /> Learning Hub</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Explore courses, track your learning progress, and grow your skills.</p>

      <div className="stats-row">
        <div className={`stat-card glass-card ${filter === 'all' ? 'stat-active' : ''}`} onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{learningCourses.length}</div><div className="stat-card-label">Total Courses</div></div>
        <div className={`stat-card glass-card ${filter === 'in-progress' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'in-progress' ? 'all' : 'in-progress')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{inProgress.length}</div><div className="stat-card-label">In Progress</div></div>
        <div className={`stat-card glass-card ${filter === 'completed' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{completed.length}</div><div className="stat-card-label">Completed</div></div>
        <div className={`stat-card glass-card ${filter === 'new' ? 'stat-active' : ''}`} onClick={() => setFilter(filter === 'new' ? 'all' : 'new')} style={{ cursor: 'pointer' }}><div className="stat-card-value">{newCourses.length}</div><div className="stat-card-label">New</div></div>
      </div>

      <div className="grid-2">
        {filtered.map(course => (
          <div className="glass-card" style={{ padding: 24, cursor: 'pointer' }} key={course.id} onClick={() => setSelectedCourse(course)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 className="learning-title" style={{ fontSize: 16, marginBottom: 6 }}>{course.title}</h3>
                <p className="learning-meta">{course.meta} · {course.duration}</p>
              </div>
              <span className={`learning-badge ${course.badge}`}>{course.badgeLabel}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{course.description.slice(0, 120)}...</p>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${course.progress}%` }}></div></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="progress-text" style={{ textAlign: 'left' }}>Instructor: {course.instructor}</span>
              <span className="progress-text">{course.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || ''} size="large">
        {selectedCourse && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className={`learning-badge ${selectedCourse.badge}`}>{selectedCourse.badgeLabel}</span>
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{selectedCourse.duration} · {selectedCourse.modules.length} modules</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{selectedCourse.description}</p>
            <div className="detail-grid" style={{ marginBottom: 20 }}>
              <div className="detail-field"><div className="detail-field-label">Instructor</div><div className="detail-field-value">{selectedCourse.instructor}</div></div>
              <div className="detail-field"><div className="detail-field-label">Progress</div><div className="detail-field-value">{selectedCourse.progress}% complete</div></div>
            </div>
            <div className="progress-bar" style={{ marginBottom: 20 }}><div className="progress-fill" style={{ width: `${selectedCourse.progress}%` }}></div></div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Module Curriculum</h4>
            <ul className="module-list">
              {selectedCourse.modules.map((mod, i) => {
                const moduleCompleted = (i + 1) / selectedCourse.modules.length * 100 <= selectedCourse.progress;
                return (
                  <li key={i} className={`module-item ${moduleCompleted ? 'completed' : ''}`}>
                    <span className="module-num">{moduleCompleted ? '✓' : i + 1}</span>
                    {mod}
                  </li>
                );
              })}
            </ul>
            {selectedCourse.badge === 'new' && (
              <div className="form-actions">
                <button className="btn btn-primary" onClick={() => { enrollCourse(selectedCourse.id); setSelectedCourse(null); }}>Enroll Now</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LearningHub;
