import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import MascotSVG from './MascotSVG';
import Modal from './Modal';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, announcements, learningCourses, tools, celebrations, milestones } = useApp();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCelebration, setSelectedCelebration] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  // — Live Store Analytics —
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchStats = () => {
    setStatsLoading(true);
    setStatsError(false);
    fetch(`${API_BASE}/stats`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setStats(data); setStatsLoading(false); })
      .catch(() => { setStatsError(true); setStatsLoading(false); });
  };

  useEffect(() => { fetchStats(); }, []);

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="page-content page-transition">
      {/* Hero Welcome Banner */}
      <div className="hero-banner animate-fade-up">
        <div className="hero-content">
          <div className="hero-greeting">👋 Good afternoon, {currentUser.name.split(' ')[0]}</div>
          <h1 className="hero-title">Welcome to your Workspace</h1>
          <p className="hero-subtitle">
            Stay connected with your team, track your progress, and celebrate milestones together.
            You have <strong>3 new announcements</strong> and <strong>2 learning modules</strong> to explore today.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-value">{stats?.overview?.totalUsers || '—'}</div><div className="hero-stat-label">Registered Users</div></div>
            <div className="hero-stat"><div className="hero-stat-value">{stats?.overview?.totalOrders || 0}</div><div className="hero-stat-label">Total Orders</div></div>
            <div className="hero-stat"><div className="hero-stat-value">{stats?.overview?.totalProducts || 12}</div><div className="hero-stat-label">Products</div></div>
          </div>
        </div>
        <div className="hero-mascot"><MascotSVG /></div>
      </div>

      {/* ===================== */}
      {/* STORE ANALYTICS PANEL */}
      {/* ===================== */}
      <div style={{ marginTop: 32 }}>
        <div className="section-header animate-fade-up stagger-1">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📊</span> Store Analytics
            <span className="sa-live-dot" />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-emerald)', letterSpacing: '0.04em' }}>LIVE</span>
          </h2>
          <button className="btn btn-primary btn-small" onClick={fetchStats} style={{ fontSize: 12 }}>
            🔄 Refresh
          </button>
        </div>

        {statsLoading ? (
          <div className="sa-loading animate-fade-up stagger-2">
            <div className="loading-spinner" />
            <span style={{ marginLeft: 12, color: 'var(--text-secondary)', fontSize: 14 }}>Fetching live store data...</span>
          </div>
        ) : statsError ? (
          <div className="sa-error glass-card animate-fade-up stagger-2">
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Backend Offline</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12 }}>
              Start the backend server on port 5000 to see live analytics.
            </div>
            <button className="btn btn-primary btn-small" onClick={fetchStats}>Retry</button>
          </div>
        ) : stats && (
          <>
            {/* Stat Cards */}
            <div className="sa-stats-grid animate-fade-up stagger-2">
              <div className="sa-stat-card glass-card" onClick={() => navigate('/invoices')} style={{ cursor: 'pointer' }}>
                <div className="sa-stat-icon sa-stat-icon-blue">💰</div>
                <div className="sa-stat-info">
                  <div className="sa-stat-value">₹{stats.overview.totalRevenue.toLocaleString()}</div>
                  <div className="sa-stat-label">Total Revenue</div>
                </div>
                <div className="sa-stat-trend sa-trend-up">↑ Live</div>
              </div>
              <div className="sa-stat-card glass-card" onClick={() => navigate('/invoices')} style={{ cursor: 'pointer' }}>
                <div className="sa-stat-icon sa-stat-icon-purple">📦</div>
                <div className="sa-stat-info">
                  <div className="sa-stat-value">{stats.overview.totalOrders}</div>
                  <div className="sa-stat-label">Total Orders</div>
                </div>
                <div className="sa-stat-mini">
                  <span className="sa-mini-badge sa-mini-success">{stats.overview.confirmedOrders} confirmed</span>
                  {stats.overview.pendingOrders > 0 && <span className="sa-mini-badge sa-mini-warning">{stats.overview.pendingOrders} pending</span>}
                </div>
              </div>
              <div className="sa-stat-card glass-card">
                <div className="sa-stat-icon sa-stat-icon-emerald">👥</div>
                <div className="sa-stat-info">
                  <div className="sa-stat-value">{stats.overview.totalUsers}</div>
                  <div className="sa-stat-label">Registered Users</div>
                </div>
                <div className="sa-stat-trend sa-trend-up">↑ Active</div>
              </div>
              <div className="sa-stat-card glass-card" onClick={() => navigate('/emails')} style={{ cursor: 'pointer' }}>
                <div className="sa-stat-icon sa-stat-icon-rose">📧</div>
                <div className="sa-stat-info">
                  <div className="sa-stat-value">{stats.overview.totalEmails}</div>
                  <div className="sa-stat-label">Emails Sent</div>
                </div>
                <div className="sa-stat-mini">
                  <span className="sa-mini-badge sa-mini-success">{stats.overview.sentEmails} delivered</span>
                </div>
              </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="sa-secondary-row animate-fade-up stagger-3">
              <div className="sa-secondary-card glass-card" onClick={() => navigate('/invoices')} style={{ cursor: 'pointer' }}>
                <span className="sa-sec-icon">📄</span>
                <div>
                  <div className="sa-sec-value">{stats.overview.totalInvoices}</div>
                  <div className="sa-sec-label">Invoices</div>
                </div>
              </div>
              <div className="sa-secondary-card glass-card">
                <span className="sa-sec-icon">🏛️</span>
                <div>
                  <div className="sa-sec-value">₹{stats.overview.totalTax.toLocaleString()}</div>
                  <div className="sa-sec-label">GST Collected</div>
                </div>
              </div>
              <div className="sa-secondary-card glass-card">
                <span className="sa-sec-icon">📊</span>
                <div>
                  <div className="sa-sec-value">₹{stats.overview.avgOrderValue.toLocaleString()}</div>
                  <div className="sa-sec-label">Avg. Order Value</div>
                </div>
              </div>
              <div className="sa-secondary-card glass-card" onClick={() => navigate('/stocks')} style={{ cursor: 'pointer' }}>
                <span className="sa-sec-icon">📦</span>
                <div>
                  <div className="sa-sec-value">{stats.overview.totalStock}</div>
                  <div className="sa-sec-label">Total Stock Units</div>
                </div>
              </div>
            </div>

            {/* Recent Orders + Stock Alerts */}
            <div className="sa-panels animate-fade-up stagger-4">
              {/* Recent Orders */}
              <div className="sa-panel glass-card">
                <div className="sa-panel-header">
                  <h3 className="sa-panel-title">🛒 Recent Orders</h3>
                  <button className="section-link" onClick={() => navigate('/invoices')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: 12 }}>
                    View all <Icons.ChevronRight />
                  </button>
                </div>
                {stats.recentOrders.length === 0 ? (
                  <div className="sa-empty">
                    <span style={{ fontSize: 32 }}>🛒</span>
                    <p>No orders yet. Orders from G Store will appear here.</p>
                  </div>
                ) : (
                  <div className="sa-orders-list">
                    {stats.recentOrders.map(order => (
                      <div key={order.id} className="sa-order-item" onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                        <div className="sa-order-left">
                          <div className="sa-order-items-preview">
                            {order.items.slice(0, 3).map((item, i) => (
                              <span key={i} className="sa-order-emoji" title={item.name}>{item.image}</span>
                            ))}
                            {order.items.length > 3 && <span className="sa-order-more">+{order.items.length - 3}</span>}
                          </div>
                          <div>
                            <div className="sa-order-id">{order.id}</div>
                            <div className="sa-order-customer">{order.userName}</div>
                          </div>
                        </div>
                        <div className="sa-order-right">
                          <div className="sa-order-amount">₹{order.grandTotal?.toLocaleString()}</div>
                          <div className="sa-order-meta">
                            <span className={`sa-order-status ${order.status === 'confirmed' ? 'sa-status-confirmed' : 'sa-status-pending'}`}>
                              {order.status === 'confirmed' ? '✅' : '⏳'} {order.status}
                            </span>
                            <span className="sa-order-time">{getTimeAgo(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Alerts */}
              <div className="sa-panel sa-panel-narrow glass-card">
                <div className="sa-panel-header">
                  <h3 className="sa-panel-title">🚨 Stock Alerts</h3>
                  <button className="section-link" onClick={() => navigate('/stocks')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: 12 }}>
                    Manage <Icons.ChevronRight />
                  </button>
                </div>
                {stats.stockAlerts.length === 0 ? (
                  <div className="sa-empty">
                    <span style={{ fontSize: 32 }}>✅</span>
                    <p>All products are well stocked!</p>
                  </div>
                ) : (
                  <div className="sa-alerts-list">
                    {stats.stockAlerts.map(alert => (
                      <div key={alert.id} className={`sa-alert-item ${alert.severity === 'critical' ? 'sa-alert-critical' : 'sa-alert-warning'}`}>
                        <div className="sa-alert-icon" style={{ background: `${alert.color}18`, color: alert.color }}>
                          {alert.image}
                        </div>
                        <div className="sa-alert-info">
                          <div className="sa-alert-name">{alert.name}</div>
                          <div className="sa-alert-cat">{alert.category}</div>
                        </div>
                        <div className="sa-alert-badge-wrap">
                          <span className={`sa-alert-badge ${alert.severity === 'critical' ? 'sa-badge-critical' : 'sa-badge-warning'}`}>
                            {alert.stockQty === 0 ? 'Out of Stock' : `${alert.stockQty} left`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Users */}
            {stats.recentUsers.length > 0 && (
              <div className="sa-users-strip glass-card animate-fade-up stagger-5">
                <div className="sa-panel-header" style={{ marginBottom: 12 }}>
                  <h3 className="sa-panel-title">👤 Recently Registered Users</h3>
                  <button className="section-link" onClick={() => navigate('/team')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: 12 }}>
                    Team Space <Icons.ChevronRight />
                  </button>
                </div>
                <div className="sa-users-list">
                  {stats.recentUsers.map(user => (
                    <div key={user.id} className="sa-user-chip">
                      <div className="sa-user-avatar" style={{ background: user.gradient }}>{user.initials}</div>
                      <div>
                        <div className="sa-user-name">{user.name}</div>
                        <div className="sa-user-email">{user.email}</div>
                      </div>
                      <span className="sa-user-joined">{user.joined}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="content-with-sidebar">
        <div className="main-column">
          {/* Announcements */}
          <div className="section-header animate-fade-up stagger-1">
            <h2 className="section-title"><Icons.Star /> Announcements</h2>
            <button className="section-link" onClick={() => setShowAllAnnouncements(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>View all <Icons.ChevronRight /></button>
          </div>
          <div className="grid-3 animate-fade-up stagger-2">
            {announcements.map((a, i) => (
              <div className="announcement-card glass-card" key={i} onClick={() => setSelectedAnnouncement(a)} style={{ cursor: 'pointer' }}>
                <div className={`announcement-tag ${a.tag}`}>{a.tagLabel}</div>
                <h3 className="announcement-title">{a.title}</h3>
                <p className="announcement-excerpt">{a.excerpt}</p>
                <div className="announcement-meta">
                  <div className="announcement-author-avatar" style={{ background: a.gradient }}>{a.authorInitials}</div>
                  <span>{a.author}</span><span>·</span><span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Programs */}
          <div style={{ marginTop: 32 }}>
            <div className="section-header animate-fade-up stagger-3">
              <h2 className="section-title"><Icons.Book /> Learning Programs</h2>
              <button className="section-link" onClick={() => navigate('/learning')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>Browse all <Icons.ChevronRight /></button>
            </div>
            <div className="grid-3 animate-fade-up stagger-4">
              {learningCourses.slice(0, 3).map((l, i) => (
                <div className="learning-card glass-card" key={i} onClick={() => setSelectedCourse(l)} style={{ cursor: 'pointer' }}>
                  <div className="learning-card-header">
                    <div><h3 className="learning-title">{l.title}</h3><p className="learning-meta">{l.meta}</p></div>
                    <span className={`learning-badge ${l.badge}`}>{l.badgeLabel}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${l.progress}%` }}></div></div>
                  <p className="progress-text">{l.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tools */}
          <div style={{ marginTop: 32 }}>
            <div className="section-header animate-fade-up stagger-5"><h2 className="section-title"><Icons.Briefcase /> Quick Tools</h2></div>
            <div className="tools-grid animate-fade-up stagger-6">
              {tools.map((t, i) => (
                <div className="tool-card glass-card" key={i} onClick={() => navigate(t.route)} style={{ cursor: 'pointer' }}>
                  <div className={`tool-icon ${t.colorClass}`}>{t.icon}</div>
                  <span className="tool-name">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar-column">
          <div className="section-header animate-fade-up stagger-2"><h2 className="section-title" style={{ fontSize: 16 }}>🎉 Celebrations</h2></div>
          <div className="celebrations-card glass-card animate-fade-up stagger-3">
            {celebrations.map((c, i) => (
              <div className="celebration-item" key={i} onClick={() => setSelectedCelebration(c)} style={{ cursor: 'pointer' }}>
                <div className="celebration-avatar" style={{ background: c.gradient }}>{c.initials}</div>
                <div className="celebration-info"><h4>{c.name}</h4><p>{c.event}</p></div>
                <div className="celebration-emoji">{c.emoji}</div>
              </div>
            ))}
          </div>
          <div className="section-header animate-fade-up stagger-4" style={{ marginTop: 24 }}><h2 className="section-title" style={{ fontSize: 16 }}>🏆 Milestones</h2></div>
          <div className="milestone-card glass-card animate-fade-up stagger-5">
            {milestones.map((m, i) => (
              <div className="milestone-item" key={i} onClick={() => setSelectedMilestone(m)} style={{ cursor: 'pointer' }}>
                <div className="milestone-icon" style={{ background: m.bg }}>{m.icon}</div>
                <div className="milestone-info"><h4>{m.title}</h4><p>{m.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      <Modal isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} title="Announcement" size="medium">
        {selectedAnnouncement && (
          <div>
            <div className={`announcement-tag ${selectedAnnouncement.tag}`} style={{ marginBottom: 16 }}>{selectedAnnouncement.tagLabel}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{selectedAnnouncement.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{selectedAnnouncement.excerpt}</p>
            <div className="announcement-meta">
              <div className="announcement-author-avatar" style={{ background: selectedAnnouncement.gradient }}>{selectedAnnouncement.authorInitials}</div>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedAnnouncement.author}</span><span style={{ color: 'var(--text-tertiary)' }}>· {selectedAnnouncement.time}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* View All Announcements Modal */}
      <Modal isOpen={showAllAnnouncements} onClose={() => setShowAllAnnouncements(false)} title="All Announcements" size="large">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {announcements.map((a, i) => (
            <div key={i} className="glass-card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => { setShowAllAnnouncements(false); setSelectedAnnouncement(a); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div className={`announcement-tag ${a.tag}`}>{a.tagLabel}</div>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{a.time}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{a.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <div className="announcement-author-avatar" style={{ background: a.gradient, width: 24, height: 24, fontSize: 10 }}>{a.authorInitials}</div>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{a.author}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Course Detail Modal */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || ''} size="large">
        {selectedCourse && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className={`learning-badge ${selectedCourse.badge}`}>{selectedCourse.badgeLabel}</span>
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{selectedCourse.duration} · {selectedCourse.modules?.length || 0} modules</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{selectedCourse.description}</p>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${selectedCourse.progress}%` }}></div></div>
            <p className="progress-text" style={{ marginBottom: 16 }}>{selectedCourse.progress}% complete</p>
            {selectedCourse.modules && (
              <ul className="module-list">
                {selectedCourse.modules.map((mod, i) => {
                  const completed = ((i + 1) / selectedCourse.modules.length * 100) <= selectedCourse.progress;
                  return <li key={i} className={`module-item ${completed ? 'completed' : ''}`}><span className="module-num">{completed ? '✓' : i + 1}</span>{mod}</li>;
                })}
              </ul>
            )}
          </div>
        )}
      </Modal>

      {/* Celebration Detail Modal */}
      <Modal isOpen={!!selectedCelebration} onClose={() => setSelectedCelebration(null)} title="🎉 Celebration" size="medium">
        {selectedCelebration && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{selectedCelebration.emoji}</div>
            <div className="detail-avatar" style={{ background: selectedCelebration.gradient, width: 64, height: 64, fontSize: 22, margin: '0 auto 12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{selectedCelebration.initials}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{selectedCelebration.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--accent-blue)', fontWeight: 500, marginBottom: 16 }}>{selectedCelebration.event}</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{selectedCelebration.message}</p>
            <button className="btn btn-primary" onClick={() => setSelectedCelebration(null)}>🎉 Send Wishes</button>
          </div>
        )}
      </Modal>

      {/* Milestone Detail Modal */}
      <Modal isOpen={!!selectedMilestone} onClose={() => setSelectedMilestone(null)} title="🏆 Milestone" size="medium">
        {selectedMilestone && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{selectedMilestone.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selectedMilestone.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{selectedMilestone.detail}</p>
            <button className="btn btn-primary" onClick={() => setSelectedMilestone(null)}>Celebrate 🎉</button>
          </div>
        )}
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.id || ''}`} size="medium">
        {selectedOrder && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20, padding: 16, background: 'var(--bg-card-hover)', borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Customer</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedOrder.userName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedOrder.userEmail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</div>
                <span className={`ecom-status-badge ${selectedOrder.status === 'confirmed' ? 'stock-ok' : 'stock-low'}`}>
                  {selectedOrder.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                </span>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Items</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < selectedOrder.items.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{item.image}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>×{item.quantity}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)' }}>
              <span>Total</span>
              <span>₹{selectedOrder.grandTotal?.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
