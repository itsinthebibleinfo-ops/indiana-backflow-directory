'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-[#0f2044] text-white sticky top-0 z-50 shadow-lg">
      <div className="container-site flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg leading-tight hover:text-blue-300 transition-colors">
          <span className="text-blue-400">Indiana</span> Backflow Directory
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/backflow-testing/indiana/" className="hover:text-blue-300 transition-colors">
            Find a Tester
          </Link>
          <Link href="/services/irrigation-backflow-testing/" className="hover:text-blue-300 transition-colors">
            Services
          </Link>
          <Link href="/resources/what-is-backflow-testing/" className="hover:text-blue-300 transition-colors">
            Resources
          </Link>
          <Link href="/claim-listing/" className="hover:text-blue-300 transition-colors">
            List Your Business
          </Link>
          <Link
            href="/request-backflow-test/"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            Request a Quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-900 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-blue-900 bg-[#0f2044] px-4 pb-4 pt-2 flex flex-col gap-2 text-sm font-medium">
          <Link href="/backflow-testing/indiana/" className="py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>
            Find a Tester
          </Link>
          <Link href="/services/irrigation-backflow-testing/" className="py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>
            Services
          </Link>
          <Link href="/resources/what-is-backflow-testing/" className="py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>
            Resources
          </Link>
          <Link href="/claim-listing/" className="py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>
            List Your Business
          </Link>
          <Link
            href="/request-backflow-test/"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-center font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote
          </Link>
        </nav>
      )}
    </header>
  )
}
