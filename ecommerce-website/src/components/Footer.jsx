import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="https://gaurang-dashboard.netlify.app" target="_blank" rel="noopener noreferrer">
            Dashboard
          </a>
          <a href="#products">Products</a>
          <a href="#courses">Courses</a>
          <a href="#support">Support</a>
        </div>
        <p>© {new Date().getFullYear()} G Store — A G Workspace Product. All rights reserved.</p>
      </div>
    </footer>
  );
}
