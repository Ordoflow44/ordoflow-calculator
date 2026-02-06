'use client'

import React, { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import '@/styles/admin.css'

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

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

export default AdminThemeProvider
