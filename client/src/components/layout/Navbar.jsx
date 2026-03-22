import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLenis } from '../LenisProvider'

const sectionLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#approach', label: 'Our Approach' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Get in Touch' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#hero')
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const lenisRef = useLenis()

  const isHome = pathname === '/'

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (!isHome) return

    const sectionIds = sectionLinks.map((l) => l.href.slice(1))
    const observers = []
    const visibleSections = new Map()

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio)
            } else {
              visibleSections.delete(id)
            }
          })

          let maxRatio = 0
          let maxId = 'hero'
          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio
              maxId = sectionId
            }
          })
          setActiveSection('#' + maxId)
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-64px 0px 0px 0px' }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [isHome])

  // Track scroll position for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault()
      setOpen(false)

      if (!isHome) {
        window.location.href = '/' + href
        return
      }

      const lenis = lenisRef?.current
      if (lenis) {
        lenis.scrollTo(href, { offset: -64 })
      } else {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [isHome, lenisRef]
  )

  const bgClass = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-kron-green/95 backdrop-blur-sm border-b border-white/10'

  return (
    <>
      {/* Top navbar — logo always visible, hamburger hidden on mobile (moved to bottom bar) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {isHome ? (
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="block"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/kron-signature.png`}
                alt="Kron Wealth"
                className="h-15 w-auto brightness-[1.8]"
              />
            </a>
          ) : (
            <Link to="/" className="block">
              <img
                src={`${import.meta.env.BASE_URL}images/kron-signature.png`}
                alt="Kron Wealth"
                className="h-15 w-auto brightness-[1.8]"
              />
            </Link>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {sectionLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`text-[1.225rem] font-medium transition-colors ${
                  isHome && activeSection === href
                    ? 'text-kron-gold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger — hidden, replaced by bottom bar */}
          <div className="md:hidden" />
        </div>
      </nav>

      {/* Mobile bottom bar — fixed at bottom of screen, thumb zone */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-kron-green/95 backdrop-blur-md border-t border-white/10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-2 py-3 text-white/80 active:text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="text-sm font-medium">Menu</span>
        </button>
      </div>

      {/* Mobile bottom sheet overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            style={{
              animation: 'fadeIn 0.2s ease-out',
            }}
          />

          {/* Bottom sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-kron-green rounded-t-2xl"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
              animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            {/* Drag handle visual cue */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            {/* Nav links */}
            <nav className="px-6 pb-4">
              {sectionLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`flex items-center min-h-[48px] px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    isHome && activeSection === href
                      ? 'text-kron-gold bg-white/5'
                      : 'text-white/80 active:text-white active:bg-white/5'
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Close button */}
            <div className="px-6 pb-2">
              <button
                onClick={() => setOpen(false)}
                className="w-full min-h-[48px] py-3 rounded-xl border border-white/20 text-white/60 text-sm font-medium active:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations for bottom sheet */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
