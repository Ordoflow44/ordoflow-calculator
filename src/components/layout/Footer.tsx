import Link from 'next/link'
import Image from 'next/image'

// URL do strony głównej Ordoflow (produkcja)
const ORDOFLOW_URL = process.env.NEXT_PUBLIC_ORDOFLOW_URL || 'https://ordoflow.com'

// Logo - ustaw ścieżkę po dodaniu logo do /public
const LOGO_PATH = '/logo.png'
const USE_IMAGE_LOGO = false // zmień na true po dodaniu logo

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12 bg-gradient-to-b from-transparent to-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href={ORDOFLOW_URL} className="flex items-center">
            {USE_IMAGE_LOGO ? (
              <Image
                src={LOGO_PATH}
                alt="Ordoflow"
                width={140}
                height={40}
                className="h-10 w-auto object-contain opacity-80"
              />
            ) : (
              <span className="font-display text-xl font-bold text-white/80">
                Ordo<span className="text-purple-400/80">flow</span>
              </span>
            )}
          </Link>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            © {currentYear} Ordoflow. Automatyzacja procesów biznesowych.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href={`${ORDOFLOW_URL}/blog`}
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Blog
            </a>
            <a
              href="https://cal.com/maciej-kanikowski-ordoflow/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
            >
              Skontaktuj się →
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
