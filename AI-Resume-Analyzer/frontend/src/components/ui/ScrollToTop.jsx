import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 bg-clip-padding text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-300 ease-out hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_8px_25px_rgba(124,58,237,0.5)] active:scale-90 ${
        isVisible
          ? 'pointer-events-auto opacity-100 scale-100'
          : 'pointer-events-none opacity-0 scale-75'
      }`}
      aria-label="Scroll to top"
    >
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  )
}
