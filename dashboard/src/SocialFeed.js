import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Icons } from './Icons';
import Modal from './Modal';

function FeedPost({ post, onFilterTag }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.commentList || []);
  const [commentText, setCommentText] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { currentUser } = useApp();

  const toggleLike = (e) => { e.stopPropagation(); setLiked(!liked); setLikes(prev => liked ? prev - 1 : prev + 1); };
  const toggleBookmark = (e) => { e.stopPropagation(); setBookmarked(!bookmarked); };
  const handleShare = (e) => { e.stopPropagation(); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const toggleComments = (e) => { e.stopPropagation(); setShowComments(!showComments); };

  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { author: currentUser.name, initials: currentUser.initials, gradient: currentUser.gradient, text: commentText, time: 'Just now' }]);
    setCommentText('');
  };

  const handleContentClick = (e) => {
    if (e.target.classList.contains('highlight')) {
      const tag = e.target.textContent;
      if (tag.startsWith('#') && onFilterTag) { onFilterTag(tag); return; }
    }
    setShowDetail(true);
  };

  return (
    <>
      <div className="feed-post glass-card">
        <div className="post-header" onClick={() => setShowDetail(true)} style={{ cursor: 'pointer' }}>
          <div className="post-avatar" style={{ background: post.gradient }}>{post.initials}</div>
          <div className="post-author-info">
            <div className="post-author-name">{post.author}</div>
            <div className="post-meta">{post.role} · {post.time}</div>
          </div>
          <button className="post-options" title="More options" onClick={e => e.stopPropagation()}><Icons.MoreVert /></button>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} onClick={handleContentClick} style={{ cursor: 'pointer' }} />
        {post.hasImage && (
          <div className="post-image" style={{ background: 'linear-gradient(135deg, rgba(79,140,255,0.1), rgba(139,92,246,0.1))', fontSize: 14, fontWeight: 500 }}>{post.imageLabel}</div>
        )}
        <div className="post-actions">
          <button className={`post-action-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}><Icons.Heart filled={liked} /><span>{likes}</span></button>
          <button className={`post-action-btn ${showComments ? 'active-action' : ''}`} onClick={toggleComments}><Icons.Chat /><span>{comments.length}</span></button>
          <button className="post-action-btn" onClick={handleShare}><Icons.Share /><span>Share</span></button>
          <button className={`post-action-btn ${bookmarked ? 'bookmarked' : ''}`} onClick={toggleBookmark}>
            <svg viewBox="0 0 24 24" fill={bookmarked ? 'var(--accent-amber)' : 'none'} stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Inline Comments */}
        {showComments && (
          <div className="post-comments">
            {comments.map((c, i) => (
              <div className="comment-item" key={i}>
                <div className="comment-avatar" style={{ background: c.gradient }}>{c.initials}</div>
                <div className="comment-body">
                  <div className="comment-author">{c.author}</div>
                  <div className="comment-text">{c.text}</div>
                  <div className="comment-time">{c.time}</div>
                </div>
              </div>
            ))}
            <form className="comment-form" onSubmit={addComment}>
              <div className="comment-avatar" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
              <input type="text" className="comment-input" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
              <button type="submit" className="comment-submit" disabled={!commentText.trim()}>Post</button>
            </form>
          </div>
        )}

        {showToast && <div className="toast-notification">🔗 Link copied to clipboard!</div>}
      </div>

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Post Detail" size="large">
        <div className="detail-header">
          <div className="detail-avatar" style={{ background: post.gradient, width: 48, height: 48, fontSize: 16 }}>{post.initials}</div>
          <div>
            <div className="detail-title" style={{ fontSize: 16 }}>{post.author}</div>
            <div className="detail-subtitle">{post.role} · {post.time}</div>
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.hasImage && (
          <div className="post-image" style={{ background: 'linear-gradient(135deg, rgba(79,140,255,0.1), rgba(139,92,246,0.1))', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>{post.imageLabel}</div>
        )}
        <div style={{ display: 'flex', gap: 24, color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 16 }}>
          <span>❤️ {likes} likes</span>
          <span>💬 {comments.length} comments</span>
          {bookmarked && <span>🔖 Saved</span>}
        </div>
        {/* Comments in modal */}
        <div className="post-comments" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Comments ({comments.length})</h4>
          {comments.map((c, i) => (
            <div className="comment-item" key={i}>
              <div className="comment-avatar" style={{ background: c.gradient }}>{c.initials}</div>
              <div className="comment-body">
                <div className="comment-author">{c.author}</div>
                <div className="comment-text">{c.text}</div>
                <div className="comment-time">{c.time}</div>
              </div>
            </div>
          ))}
          <form className="comment-form" onSubmit={addComment}>
            <div className="comment-avatar" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
            <input type="text" className="comment-input" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button type="submit" className="comment-submit" disabled={!commentText.trim()}>Post</button>
          </form>
        </div>
      </Modal>
    </>
  );
}

function SocialFeed() {
  const { feedPosts, addPost, currentUser, trending, achievements } = useApp();
  const [postText, setPostText] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handlePost = () => {
    if (!postText.trim()) return;
    addPost(postText);
    setPostText('');
  };

  const filteredPosts = filterTag
    ? feedPosts.filter(p => p.content.toLowerCase().includes(filterTag.toLowerCase()))
    : feedPosts;

  return (
    <div className="page-content page-transition">
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h1 className="section-title" style={{ fontSize: 24 }}><Icons.Chat /> Social Feed</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Share ideas, celebrate wins, and stay connected with your colleagues.</p>

      {filterTag && (
        <div className="filter-active-bar" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 16px', background: 'rgba(79,140,255,0.1)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Filtering by:</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{filterTag}</span>
          <button onClick={() => setFilterTag(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>✕ Clear</button>
        </div>
      )}

      <div className="content-with-sidebar">
        <div>
          <div className="post-composer glass-card animate-fade-up">
            <div className="composer-top">
              <div className="composer-avatar" style={{ background: currentUser.gradient }}>{currentUser.initials}</div>
              <textarea className="composer-input" placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}? Share an idea, achievement, or update...`} value={postText} onChange={e => setPostText(e.target.value)} />
            </div>
            <div className="composer-actions">
              <div className="composer-attachments">
                <button className="composer-attach-btn" title="Add image"><Icons.Image /></button>
                <button className="composer-attach-btn" title="Add file"><Icons.Paperclip /></button>
                <button className="composer-attach-btn" title="Add emoji"><Icons.Smile /></button>
                <button className="composer-attach-btn" title="Tag colleague"><Icons.Tag /></button>
              </div>
              <button className="composer-submit" onClick={handlePost}>Share Post</button>
            </div>
          </div>
          {filteredPosts.map(post => <FeedPost key={post.id} post={post} onFilterTag={setFilterTag} />)}
        </div>

        <div>
          <div className="section-header" style={{ marginBottom: 12 }}><h2 className="section-title" style={{ fontSize: 16 }}>🔥 Trending</h2></div>
          <div className="trending-card glass-card">
            {trending.map((t, i) => (
              <div className="trending-item" key={i} onClick={() => setFilterTag(t.tag)} style={{ cursor: 'pointer' }}>
                <span className="trending-number">{i + 1}</span>
                <div><div className="trending-tag">{t.tag}</div><div className="trending-count">{t.count}</div></div>
              </div>
            ))}
          </div>
          <div className="section-header" style={{ marginBottom: 12, marginTop: 24 }}><h2 className="section-title" style={{ fontSize: 16 }}>🏅 Achievements</h2></div>
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="achievement-grid">
              {achievements.map((a, i) => (
                <div className="achievement-badge" key={i} onClick={() => setSelectedAchievement(a)} style={{ cursor: 'pointer' }}>
                  <div className="achievement-icon">{a.icon}</div>
                  <div className="achievement-name">{a.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <Modal isOpen={!!selectedAchievement} onClose={() => setSelectedAchievement(null)} title="🏅 Achievement" size="medium">
        {selectedAchievement && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{selectedAchievement.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selectedAchievement.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{selectedAchievement.desc}</p>
            <div className="detail-field" style={{ display: 'inline-block', textAlign: 'center' }}>
              <div className="detail-field-label">Earned By</div>
              <div className="detail-field-value" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedAchievement.earnedBy}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SocialFeed;
