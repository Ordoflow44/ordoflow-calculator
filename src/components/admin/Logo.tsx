'use client'

import React, { useEffect, useState } from 'react'

interface MediaFile {
  url?: string
  alt?: string
  sizes?: {
    logo?: {
      url?: string
    }
  }
}

interface Settings {
  logo?: MediaFile | number
  companyName?: string
}

const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string>('ORDOFLOW')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/globals/settings?depth=1')
        if (response.ok) {
          const data: Settings = await response.json()

          if (data.companyName) {
            setCompanyName(data.companyName)
          }

          if (data.logo && typeof data.logo === 'object') {
            // Prefer logo size, fallback to original
            const url = data.logo.sizes?.logo?.url || data.logo.url
            if (url) {
              setLogoUrl(url)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <div className="ordoflow-logo-container">
        <div className="ordoflow-logo-box ordoflow-logo-loading">
          <div className="ordoflow-logo-skeleton" />
        </div>
      </div>
    )
  }

  if (logoUrl) {
    return (
      <div className="ordoflow-logo-container">
        <div className="ordoflow-logo-image-wrapper">
          <img
            src={logoUrl}
            alt={companyName}
            className="ordoflow-logo-image"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="ordoflow-logo-container">
      <div className="ordoflow-logo-box">
        {companyName}
      </div>
    </div>
  )
}

export default Logo
