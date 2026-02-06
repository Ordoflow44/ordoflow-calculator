'use client'

import React, { useEffect } from 'react'

interface AdminThemeProviderProps {
  children: React.ReactNode
}

const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('ordoflow-admin-theme')
    return () => {
      document.body.classList.remove('ordoflow-admin-theme')
    }
  }, [])

  // Use Payload's default layout styled via custom.scss
  return <>{children}</>
}

export default AdminThemeProvider
