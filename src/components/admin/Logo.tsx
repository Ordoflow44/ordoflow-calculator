'use client'

import React from 'react'

const logoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '0.5rem',
}

const frameStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '60px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '14px',
  transition: 'all 0.3s ease',
}

const Logo: React.FC = () => {
  return (
    <div style={logoStyles}>
      <div style={frameStyles}>
        <svg
          width="140"
          height="40"
          viewBox="0 0 140 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="20" r="12" fill="url(#logoGradient)" opacity="0.2" />
          <path
            d="M10 20C10 16.686 12.686 14 16 14C19.314 14 22 16.686 22 20C22 23.314 19.314 26 16 26"
            stroke="url(#logoGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M16 14L16 11M22 20L25 20M16 26L16 29"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="20" r="3" fill="url(#logoGradient)" />
          <text
            x="34"
            y="25"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill="white"
            letterSpacing="1"
          >
            ORDOFLOW
          </text>
        </svg>
      </div>
    </div>
  )
}

export default Logo
