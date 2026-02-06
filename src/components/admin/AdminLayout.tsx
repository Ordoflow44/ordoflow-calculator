'use client'

import React, { useEffect, useState } from 'react'
import './admin-layout.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  group?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', group: undefined },
  { label: 'Użytkownicy', href: '/admin/collections/users', group: 'Administracja' },
  { label: 'Media', href: '/admin/collections/media', group: 'Administracja' },
  { label: 'Ustawienia', href: '/admin/globals/settings', group: 'Administracja' },
  { label: 'Kategorie', href: '/admin/collections/categories', group: 'Kalkulator' },
  { label: 'Automatyzacje', href: '/admin/collections/automations', group: 'Kalkulator' },
  { label: 'Leady', href: '/admin/collections/leads', group: 'Sprzedaż' },
]

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    // Get current path
    setCurrentPath(window.location.pathname)

    // Fetch logo from settings
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/globals/settings?depth=1')
        if (res.ok) {
          const data = await res.json()
          if (data.logo && typeof data.logo === 'object') {
            setLogoUrl(data.logo.sizes?.logo?.url || data.logo.url)
          }
        }
      } catch (e) {
        console.error('Failed to fetch logo:', e)
      }
    }
    fetchLogo()
  }, [])

  // Group nav items
  const groupedNav = navItems.reduce((acc, item) => {
    const group = item.group || '_root'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  return (
    <div className="admin-layout">
      {/* HEADER - top bar */}
      <header className="admin-header">
        <div className="admin-header__logo">
          {logoUrl ? (
            <img src={logoUrl} alt="Ordoflow" className="admin-logo-img" />
          ) : (
            <span className="admin-logo-text">ORDOFLOW</span>
          )}
        </div>
        <div className="admin-header__spacer" />
      </header>

      {/* MAIN CONTAINER */}
      <div className="admin-container">
        {/* NAVBAR - left sidebar */}
        <nav className="admin-navbar">
          {/* Root items (Dashboard) */}
          {groupedNav['_root']?.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${currentPath === item.href ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}

          {/* Grouped items */}
          {Object.entries(groupedNav)
            .filter(([group]) => group !== '_root')
            .map(([group, items]) => (
              <div key={group} className="admin-nav-group">
                <div className="admin-nav-group__label">{group}</div>
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${currentPath === item.href ? 'active' : ''}`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
        </nav>

        {/* CONTENT - main workspace */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
