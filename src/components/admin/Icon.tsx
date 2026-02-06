'use client'

import React from 'react'

const Icon: React.FC = () => {
  return (
    <div className="ordoflow-icon">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle cx="14" cy="14" r="10" fill="url(#iconGradient)" opacity="0.2" />
        <path
          d="M9 14C9 11.239 11.239 9 14 9C16.761 9 19 11.239 19 14C19 16.761 16.761 19 14 19"
          stroke="url(#iconGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 9L14 6.5M19 14L21.5 14M14 19L14 21.5"
          stroke="url(#iconGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="2.5" fill="url(#iconGradient)" />
      </svg>
    </div>
  )
}

export default Icon
