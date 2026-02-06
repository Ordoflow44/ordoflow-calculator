'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  if (isEmbed) {
    // Tryb embed - bez navbar i footer
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {/* Padding top dla fixed navbar (h-20 = 5rem = 80px) */}
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </>
  )
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="pt-20">{children}</div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
