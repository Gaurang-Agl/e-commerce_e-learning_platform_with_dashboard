import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { useApp } from './AppContext';

function Sidebar({ isOpen, onClose }) {
  const { currentUser, ecomBadges } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'Main',
      items: [
        { to: '/', label: 'Dashboard', icon: <Icons.Home /> },
        { to: '/team', label: 'Team Space', icon: <Icons.Team /> },
        { to: '/feed', label: 'Social Feed', icon: <Icons.Chat />, badge: 5 },
      ]
    },
    {
      title: 'Tools',
      items: [
        { to: '/timesheet', label: 'Timesheet', icon: <Icons.Clock /> },
        { to: '/leave', label: 'Leave Manager', icon: <Icons.Calendar /> },
        { to: '/expenses', label: 'Expenses', icon: <Icons.Dollar /> },
        { to: '/meetings', label: 'Meetings', icon: <Icons.Clock /> },
        { to: '/it-support', label: 'IT Support', icon: <Icons.Settings /> },
        { to: '/hr-portal', label: 'HR Portal', icon: <Icons.Team /> },
      ]
    },
    {
      title: 'More',
      items: [
        { to: '/learning', label: 'Learning Hub', icon: <Icons.Book /> },
        { to: '/settings', label: 'Settings', icon: <Icons.Settings /> },
      ]
    },
    {
      title: 'E-Commerce',
      items: [
        { to: '/stocks', label: 'Stocks Availability', icon: <Icons.Package /> },
        { to: '/invoices', label: 'Invoice Generated', icon: <Icons.FileText />, badge: ecomBadges.invoices || null },
        { to: '/emails', label: 'Email Notified', icon: <Icons.Mail />, badge: ecomBadges.emails || null },
        { to: '/users', label: 'Users Management', icon: <Icons.Team /> },
      ]
    }
  ];

  const handleDropdownNav = (path) => {
    setUserDropdownOpen(false);
    onClose();
    navigate(path);
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">G</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">G Workspace</span>
            <span className="sidebar-brand-tagline">Connect · Learn · Grow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map(section => (
            <div className="nav-section" key={section.title}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item, idx) => (
                <NavLink
                  key={`${section.title}-${idx}`}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div
            className={`sidebar-user-card ${userDropdownOpen ? 'dropdown-active' : ''}`}
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            style={{ textDecoration: 'none' }}
          >
            <div className="user-avatar online" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.role}</div>
            </div>
            <div className={`sidebar-chevron ${userDropdownOpen ? 'open' : ''}`}>
              <Icons.ChevronDown />
            </div>
          </div>

          {userDropdownOpen && (
            <div className="sidebar-user-dropdown">
              <div className="dropdown-profile-summary">
                <div className="dropdown-avatar" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
                <div className="dropdown-profile-details">
                  <div className="dropdown-profile-name">{currentUser.name}</div>
                  <div className="dropdown-profile-role">{currentUser.role}</div>
                  <div className="dropdown-profile-email">{currentUser.email}</div>
                  <div className="dropdown-profile-status">
                    <span className="dropdown-status-dot online"></span>
                    <span>{currentUser.status === 'online' ? 'Online' : 'Away'}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => handleDropdownNav('/settings')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                View Profile
              </button>
              <button className="dropdown-item" onClick={() => handleDropdownNav('/settings')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                Settings
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item dropdown-item-danger" onClick={() => setUserDropdownOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
