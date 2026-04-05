import React from 'react';

function MascotSVG() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="35" width="80" height="80" rx="24" fill="url(#mascotGrad)" opacity="0.9" />
      <ellipse cx="56" cy="70" rx="8" ry="9" fill="#4f8cff" />
      <ellipse cx="84" cy="70" rx="8" ry="9" fill="#4f8cff" />
      <ellipse cx="56" cy="68" rx="4" ry="5" fill="white" />
      <ellipse cx="84" cy="68" rx="4" ry="5" fill="white" />
      <path d="M58 85 Q70 95 82 85" stroke="#4f8cff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="63" y1="95" x2="77" y2="108" stroke="#4f8cff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="77" y1="95" x2="63" y2="108" stroke="#4f8cff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="35" x2="70" y2="18" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="14" r="6" fill="#f59e0b">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="14" y="60" width="20" height="14" rx="7" fill="url(#mascotGrad)" opacity="0.7" />
      <rect x="106" y="60" width="20" height="14" rx="7" fill="url(#mascotGrad)" opacity="0.7" />
      <defs>
        <linearGradient id="mascotGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e2140" />
          <stop offset="100%" stopColor="#2d2f6e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default MascotSVG;
