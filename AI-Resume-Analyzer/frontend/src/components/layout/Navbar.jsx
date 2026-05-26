import { useState, useEffect, useCallback } from 'react'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Upload', href: '#upload' },
  { label: 'Features', href: '#features' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // ── Active section tracking ──────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let active = ''

      for (const link of navLinks) {
        const el = document.getElementById(link.href.substring(1))
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top && scrollPosition < top + el.offsetHeight) {
            active = link.href
            break
          }
        }
      }

      if (window.scrollY < 120) active = ''
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Lock body scroll when mobile menu is open ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // ── Close menu on Escape key ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleNavClick = useCallback((href) => {
    closeMenu()
    // Small delay lets the menu close animation finish before scrolling
    setTimeout(() => {
      const el = document.getElementById(href.substring(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }, [closeMenu])

  return (
    <>
      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md transition-all duration-300">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <a
            href="#"
            onClick={closeMenu}
            className="flex items-center gap-2.5 text-white group shrink-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-sm font-bold shadow-md shadow-violet-600/10 transition-transform duration-300 group-hover:scale-105">
              R
            </span>
            <span className="text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-zinc-200">
              ResumeAI
            </span>
          </a>

          {/* Desktop nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-all duration-300 ${
                    activeSection === link.href
                      ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — hidden on mobile */}
          <div className="hidden md:flex items-center">
            <a href="#upload">
              <Button size="sm" className="shadow-[0_2px_10px_rgba(124,58,237,0.15)]">
                Get started
              </Button>
            </a>
          </div>

          {/* Hamburger button — visible on mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
          >
            {/* Animated hamburger → X */}
            <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  menuOpen ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* ── Mobile menu overlay ──────────────────────────────────────────── */}
      {/* Dark backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-down panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-x-0 top-16 z-40 md:hidden transition-all duration-300 ease-out ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="mx-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {/* Nav links */}
          <ul className="px-2 pt-3 pb-2">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === link.href
                      ? 'bg-violet-500/10 text-white'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {activeSection === link.href && (
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="mx-4 h-px bg-white/5" />

          {/* CTA */}
          <div className="p-4">
            <a
              href="#upload"
              onClick={() => handleNavClick('#upload')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_6px_25px_rgba(124,58,237,0.45)] active:scale-[0.98]"
            >
              Get started
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
