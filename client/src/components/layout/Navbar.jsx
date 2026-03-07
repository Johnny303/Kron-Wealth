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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-kron-green border-t border-white/10">
          <div className="px-6 py-4 flex flex-col gap-4">
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
        </div>
      )}
    </nav>
  )
}
