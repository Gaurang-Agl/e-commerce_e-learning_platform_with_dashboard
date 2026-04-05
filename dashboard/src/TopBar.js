import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { useApp } from './AppContext';

function TopBar({ breadcrumb, searchPlaceholder, onMenuClick }) {
  const navigate = useNavigate();
  const { teamMembers, announcements, learningCourses, feedPosts, notifications: notifData, messages: msgData } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState(notifData || []);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const msgRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchResults(null); setSearchQuery(''); }
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (msgRef.current && !msgRef.current.contains(e.target)) setShowMessages(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search with debounced loading animation
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); setSearching(false); return; }
    setSearching(true);
    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const people = teamMembers.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)).slice(0, 3);
      const annc = announcements.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)).slice(0, 2);
      const courses = learningCourses.filter(c => c.title.toLowerCase().includes(q)).slice(0, 2);
      const posts = feedPosts.filter(p => p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)).slice(0, 2);
      setSearchResults({ people, announcements: annc, courses, posts });
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, teamMembers, announcements, learningCourses, feedPosts]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMsgCount = (msgData || []).filter(m => m.unread).length;

  const handleResultClick = (type) => {
    setSearchResults(null);
    setSearchQuery('');
    if (type === 'people') navigate('/team');
    else if (type === 'announcements') navigate('/');
    else if (type === 'courses') navigate('/learning');
    else if (type === 'posts') navigate('/feed');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Icons.Menu />
        </button>
        <div className="topbar-breadcrumb">Home / <span>{breadcrumb}</span></div>
      </div>

      {/* Functional Search */}
      <div className="topbar-search" ref={searchRef} style={searchFocused ? { boxShadow: '0 0 0 2px rgba(79,140,255,0.2)' } : {}}>
        <Icons.Search />
        <input
          type="text"
          placeholder={searchPlaceholder || 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {(searching || searchResults) && (
          <div className="search-results-panel">
            {searching ? (
              <div className="search-loading">
                <div className="search-spinner"></div>
                <span>Searching...</span>
              </div>
            ) : searchResults && (
              <>
                {searchResults.people.length === 0 && searchResults.announcements.length === 0 && searchResults.courses.length === 0 && searchResults.posts.length === 0 ? (
                  <div className="search-empty">No results found for "{searchQuery}"</div>
                ) : (
                  <>
                    {searchResults.people.length > 0 && (
                      <div className="search-category">
                        <div className="search-category-title">👥 People</div>
                        {searchResults.people.map((p, i) => (
                          <div key={i} className="search-result-item" onClick={() => handleResultClick('people')}>
                            <div className="search-result-avatar" style={{ background: p.gradient }}>{p.initials}</div>
                            <div><div className="search-result-name">{p.name}</div><div className="search-result-meta">{p.role}</div></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.announcements.length > 0 && (
                      <div className="search-category">
                        <div className="search-category-title">📢 Announcements</div>
                        {searchResults.announcements.map((a, i) => (
                          <div key={i} className="search-result-item" onClick={() => handleResultClick('announcements')}>
                            <div className="search-result-icon">📢</div>
                            <div><div className="search-result-name">{a.title}</div><div className="search-result-meta">{a.author}</div></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.courses.length > 0 && (
                      <div className="search-category">
                        <div className="search-category-title">📚 Courses</div>
                        {searchResults.courses.map((c, i) => (
                          <div key={i} className="search-result-item" onClick={() => handleResultClick('courses')}>
                            <div className="search-result-icon">📚</div>
                            <div><div className="search-result-name">{c.title}</div><div className="search-result-meta">{c.progress}% complete</div></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.posts.length > 0 && (
                      <div className="search-category">
                        <div className="search-category-title">💬 Posts</div>
                        {searchResults.posts.map((p, i) => (
                          <div key={i} className="search-result-item" onClick={() => handleResultClick('posts')}>
                            <div className="search-result-avatar" style={{ background: p.gradient }}>{p.initials}</div>
                            <div><div className="search-result-name">{p.author}</div><div className="search-result-meta">{p.time}</div></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="topbar-icon-btn" aria-label="Notifications" onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}>
            <Icons.Bell />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>
          {showNotifications && (
            <div className="topbar-dropdown-panel">
              <div className="dropdown-panel-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && <button className="dropdown-panel-action" onClick={markAllRead}>Mark all read</button>}
              </div>
              <div className="dropdown-panel-body">
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                    <div className="notif-icon">{n.icon}</div>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                    {!n.read && <div className="notif-unread-dot"></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ position: 'relative' }} ref={msgRef}>
          <button className="topbar-icon-btn" aria-label="Messages" onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}>
            <Icons.Chat />
            {unreadMsgCount > 0 && <span className="notification-dot"></span>}
          </button>
          {showMessages && (
            <div className="topbar-dropdown-panel">
              <div className="dropdown-panel-header">
                <h3>Messages</h3>
                <button className="dropdown-panel-action" onClick={() => { setShowMessages(false); navigate('/feed'); }}>View All</button>
              </div>
              <div className="dropdown-panel-body">
                {(msgData || []).map(m => (
                  <div key={m.id} className={`msg-item ${m.unread ? 'unread' : ''}`}>
                    <div className="msg-avatar" style={{ background: m.gradient }}>{m.initials}</div>
                    <div className="msg-content">
                      <div className="msg-from">{m.from}</div>
                      <div className="msg-preview">{m.preview}</div>
                      <div className="msg-time">{m.time}</div>
                    </div>
                    {m.unread && <div className="notif-unread-dot"></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
