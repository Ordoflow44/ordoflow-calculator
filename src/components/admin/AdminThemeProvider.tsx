'use client'

import React, { useEffect } from 'react'
import '@/styles/admin.css'

interface AdminThemeProviderProps {
  children: React.ReactNode
}

const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Add custom class to body for additional styling hooks
    document.body.classList.add('ordoflow-admin-theme')

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('ordoflow-admin-theme')
    }
  }, [])

  return <>{children}</>
}

export default AdminThemeProvider
