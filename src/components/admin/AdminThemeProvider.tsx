'use client'

import React from 'react'

interface AdminThemeProviderProps {
  children: React.ReactNode
}

const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  return <>{children}</>
}

export default AdminThemeProvider
