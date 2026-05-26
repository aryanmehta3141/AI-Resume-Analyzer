import { useState, useEffect } from 'react'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Upload', href: '#upload' },
  { label: 'Features', href: '#features' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // adjusted offset for active section highlighting
      
      let active = ''
      for (const link of navLinks) {
        const id = link.href.substring(1)
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            active = link.href
            break
          }
        }
      }
      
      // If we are near the top, reset active state
      if (window.scrollY < 120) {
        active = ''
      }
      
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md transition-all duration-300">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5 text-white group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-sm font-bold shadow-md shadow-violet-600/10 transition-transform duration-300 group-hover:scale-105">
            R
          </span>
          <span className="text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-zinc-200">
            ResumeAI
          </span>
        </a>

        <ul className="flex items-center gap-8">
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

        <div className="flex items-center">
          <a href="#upload">
            <Button size="sm" className="shadow-[0_2px_10px_rgba(124,58,237,0.15)]">
              Get started
            </Button>
          </a>
        </div>
      </nav>
    </header>
  )
}
