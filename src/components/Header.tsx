'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings2, Search, BookOpen, Menu, X } from 'lucide-react'
import { useSettings } from '@/providers/SettingsProvider'
import { useState } from 'react'
import clsx from 'clsx'

export function Header() {
  const { setSidebarOpen, sidebarOpen } = useSettings()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Surahs', icon: BookOpen },
    { href: '/search/', label: 'Search', icon: Search },
  ]

  return (
    <>
      {/* ── Fixed Header Bar ───────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-40 h-16 flex items-center"
        style={{
          background: 'rgba(5,14,29,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--gold-border)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Al-Quran Home">
            {/* Ornamental mark */}
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm"
              style={{ border: '1px solid var(--gold-border)', color: 'var(--gold)' }}
              aria-hidden
            >
              ☽
            </span>
            <span
              className="font-cormorant font-semibold text-xl tracking-wide"
              style={{ color: 'var(--cream)' }}
            >
              Al&#8209;Quran
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-lora transition-all duration-200',
                  pathname === href
                    ? 'text-yellow-300'
                    : 'text-cream-muted hover:text-cream'
                )}
                style={pathname === href ? { color: 'var(--gold-light)' } : {}}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Mobile nav toggle */}
            <button
              className="sm:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--cream-muted)' }}
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-lora transition-all duration-200',
                sidebarOpen ? 'text-gold' : ''
              )}
              style={
                sidebarOpen
                  ? { color: 'var(--gold)', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }
                  : { color: 'var(--cream-muted)', border: '1px solid transparent' }
              }
              aria-label="Open settings"
            >
              <Settings2 size={16} className={clsx('transition-transform duration-300', sidebarOpen && 'rotate-45')} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drop-down nav ─────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed top-16 inset-x-0 z-30 sm:hidden fade-in"
          style={{
            background: 'rgba(8,21,37,0.97)',
            borderBottom: '1px solid var(--gold-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <nav className="flex flex-col p-3 gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-lora transition-colors"
                style={
                  pathname === href
                    ? { color: 'var(--gold)', background: 'var(--gold-dim)' }
                    : { color: 'var(--cream-muted)' }
                }
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
