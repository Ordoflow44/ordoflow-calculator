'use client'

import React from 'react'

const containerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '0.5rem',
}

const logoBoxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '50px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px dashed rgba(255, 255, 255, 0.25)',
  borderRadius: '8px',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '2px',
}

const Logo: React.FC = () => {
  return (
    <div style={containerStyles}>
      <div style={logoBoxStyles}>
        ORDOFLOW
      </div>
    </div>
  )
}

export default Logo
