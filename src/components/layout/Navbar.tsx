'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

// URL do strony głównej Ordoflow (produkcja)
const ORDOFLOW_URL = process.env.NEXT_PUBLIC_ORDOFLOW_URL || 'https://ordoflow.com'

// Logo - ustaw ścieżkę po dodaniu logo do /public
const LOGO_PATH = '/logo.png'
const USE_IMAGE_LOGO = false // zmień na true po dodaniu logo

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur-xl">
      <div className="flex h-20 max-w-7xl mx-auto px-6 items-center justify-between">
        {/* Logo */}
        <Link href={ORDOFLOW_URL} className="flex items-center">
          {USE_IMAGE_LOGO ? (
            <Image
              src={LOGO_PATH}
              alt="Ordoflow Logo"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          ) : (
            <span className="font-display text-2xl font-bold text-white">
              Ordo<span className="text-purple-400">flow</span>
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-purple-400 font-medium"
          >
            Kalkulator
          </Link>
          <a
            href={`${ORDOFLOW_URL}/blog`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Blog
          </a>
          <a
            href={`${ORDOFLOW_URL}/#case-studies`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Case Studies
          </a>
          <a
            href={`${ORDOFLOW_URL}/#about`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            O mnie
          </a>
          <a
            href="https://cal.com/maciej-kanikowski-ordoflow/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all glow-purple"
          >
            <span>Umów Konsultację</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0A0A0F]/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm text-purple-400 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Kalkulator
            </Link>
            <a
              href={`${ORDOFLOW_URL}/blog`}
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href={`${ORDOFLOW_URL}/#case-studies`}
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Case Studies
            </a>
            <a
              href={`${ORDOFLOW_URL}/#about`}
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              O mnie
            </a>
            <a
              href="https://cal.com/maciej-kanikowski-ordoflow/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl py-3 px-4 text-center glow-purple"
            >
              Umów Konsultację
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
