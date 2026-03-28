import { useState, useRef, useEffect, useCallback } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used as JSX namespace (motion.div)
import { motion, AnimatePresence, LayoutGroup, useInView } from 'motion/react'
import { FadeInUp } from '../components/ScrollAnimations'

const services = [
  {
    title: 'Strategic Financial Planning',
    description:
      'A comprehensive financial plan tailored to your goals, covering cash flow management, tax efficiency, and long-term wealth building.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
    details: {
      intro: 'Strategic Financial Planning at Kron Wealth is a dynamic and ongoing journey, tailored to bring you closer to your life goals and aspirations. This service goes beyond wealth management and products; it\u2019s about devising a holistic, adaptable strategy that resonates with every aspect of your life.',
      subtitle: 'By arranging your finances in a strategic way you will gain peace of mind and confidence about the future, reduce stress levels and enjoy life more.',
      bullets: [
        { label: 'Goal Setting', text: 'We start by understanding your short, medium, and long-term aspirations. Knowing your priorities and desired lifestyle helps us craft a financial plan that\u2019s uniquely yours.' },
        { label: 'Financial Modelling', text: 'We build financial models to visualise your financial future under various scenarios. This step is key in crafting strategies and making adjustments to ensure your lifestyle goals are achievable and secure.' },
        { label: 'Risk Management', text: 'We assess potential risks like job loss, illness, or market fluctuations, ensuring your plan is resilient and adaptable.' },
        { label: 'Tax Planning', text: 'By considering the tax implications of various financial decisions, financial planning can help minimise your tax liability and maximise your wealth.' },
        { label: 'Estate Planning', text: 'We ensure your legacy is preserved and your assets are distributed as per your wishes, mitigating tax to maximise your legacy.' },
      ],
      outro: 'Our process is founded on the concept of life planning and designed to provide context to your current situation and guide decision-making towards achieving your identified goals.',
    },
  },
  {
    title: 'Risk Management & Protection',
    description:
      'Protecting you and your family against the unexpected with life insurance, critical illness cover, and income protection.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    details: {
      intro: 'At Kron Wealth, we understand that life\u2019s unpredictability can pose risks to even the most robust financial plans. That\u2019s why our risk management and protection services are integral to safeguarding your financial future.',
      subtitle: 'By implementing appropriate insurance solutions \u2014 covering scenarios like early death, critical illness, or inability to work \u2014 we ensure that your financial plan remains on track, even in the face of life\u2019s unforeseen events.',
      bullets: [],
      outro: 'Our aim is to provide a safety net that gives you and your loved ones peace of mind and financial security.',
    },
  },
  {
    title: 'Retirement Planning & Pensions',
    description:
      'Planning for a comfortable retirement, whether that means early retirement, phased retirement, or maximising your pension benefits.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    details: {
      intro: 'Retirement should be a time of enjoyment, not complexity and, we understand that effective retirement planning is critical.',
      subtitle: 'Pensions are a cornerstone of any retirement plan and while pension freedoms have broadened your choices, they\u2019ve also added complexity. Our approach is to simplify these choices, offering clarity and bespoke solutions.',
      bullets: [],
      outro: 'From consolidating various pensions for more efficient management to exploring SIPPs and SSAS for greater control over your investments, we cover all bases. We also assist with pension Drawdown strategies and Annuity options, ensuring a seamless transition into your retirement years.',
    },
  },
  {
    title: 'Investments',
    description:
      'Building and managing an investment portfolio aligned with your goals, risk tolerance, and time horizon.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
    details: {
      intro: 'Kron Wealth\u2019s approach to investments is defined by our agnostic stance towards management styles.',
      subtitle: 'Through our continual research and due diligence across the market place, we navigate the broad and complex investment landscape with a focus on creating investment strategies that align with your specific goals.',
      bullets: [],
      outro: 'Our commitment is to finding the best investment avenues, whether they lie in passive, active, or a combination of strategies. This breadth allows us to design investment portfolios that are as unique as our clients. We pride ourselves on providing versatile, best-of-breed investment solutions tailored to each client\u2019s distinct financial landscape.',
    },
  },
  {
    title: 'Estate Planning',
    description:
      'Ensuring your wealth is passed on efficiently and in line with your wishes, minimising inheritance tax where possible.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
    details: {
      intro: 'Estate planning is a complex area that undergoes constant change, but we\u2019ve helped many clients to preserve their wealth and assets for their loved ones.',
      subtitle: 'Our inheritance tax (IHT) strategy is designed to keep what\u2019s rightfully yours within the family by ensuring the tax you pay is minimal but fair.',
      bullets: [],
      outro: 'We understand your situation is unique and will require a bespoke approach to achieve maximum results. We\u2019ll also examine additional solutions such as wills and trusts and the role they could play in your IHT strategy.',
    },
  },
  {
    title: 'Business Owner Services',
    description:
      'Specialist advice for business owners including exit planning, shareholder protection, and key person insurance.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    details: {
      intro: 'We understand the unique complexities faced by business owners, and at Kron Wealth, we offer a suite of services tailored to support both the stability and growth of your enterprise.',
      subtitle: 'These include Directors\u2019 & Partners\u2019 Pensions, Company owned investments, Relevant Life Insurance, Key Person and Shareholder Protection.',
      bullets: [],
      outro: 'We also appreciate there may come a time when you will want to cash in on your hard work and exit the business. We are here to prepare both you and your business for this transition and life thereafter. We can help craft a comprehensive benefits package, including group pensions, group insurance and group private medical \u2014 fostering loyalty and driving business success.',
    },
  },
]

const layoutSpring = { type: 'spring', stiffness: 100, damping: 30, mass: 2 }

/* ── Helpers ── */

function getTileRow(cardIndex, activeIdx, pendingIdx, isShuffling) {
  if (isShuffling && pendingIdx !== null) {
    let row = 0
    for (let i = 0; i < services.length; i++) {
      if (i === activeIdx) continue
      if (i === pendingIdx) continue
      if (i === cardIndex) return row
      row++
    }
    if (cardIndex === pendingIdx) return row
    return row
  }
  let row = 0
  for (let i = 0; i < services.length; i++) {
    if (i === activeIdx) continue
    if (i === cardIndex) return row
    row++
  }
  return row
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

/* ── Card content components ── */

function ServiceIcon({ icon, size = 'md', glow = false }) {
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'
  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
  return (
    <div
      className={`${sizeClasses} rounded-xl flex items-center justify-center shrink-0 relative`}
      style={{
        background: 'linear-gradient(135deg, rgba(185,122,69,0.12) 0%, rgba(185,122,69,0.06) 100%)',
        boxShadow: glow
          ? '0 0 20px rgba(185,122,69,0.15), inset 0 1px 2px rgba(185,122,69,0.1)'
          : 'inset 0 1px 2px rgba(185,122,69,0.08)',
      }}
    >
      <svg className={`${iconSize} text-kron-gold`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
  )
}

function ExpandedContent({ service, onClose }) {
  const [getStartedHovered, setGetStartedHovered] = useState(false)
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col"
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-kron-sage/30 hover:border-kron-gold/40 hover:bg-kron-gold/5 transition-all text-kron-brown/60 hover:text-kron-gold z-10"
      >
        <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="shrink-0 p-6 md:p-8 pb-0">
        <div className="flex items-center gap-4 mb-5 pr-10">
          <ServiceIcon icon={service.icon} size="sm" glow />
          <div>
            <h3 className="text-xl font-bold text-kron-green tracking-tight">{service.title}</h3>
          </div>
        </div>
        {/* Gold divider */}
        <div
          className="h-px mb-5"
          style={{ background: 'linear-gradient(to right, rgba(185,122,69,0.4), rgba(185,122,69,0.1), transparent)' }}
        />
      </div>

      {/* Scrollable body */}
      <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-6 md:px-8 space-y-4 text-[15px] text-kron-brown leading-[1.7] scrollbar-thin">
        <p>{service.details.intro}</p>
        <p className="font-medium text-kron-green/80 italic">{service.details.subtitle}</p>

        {service.details.bullets.length > 0 && (
          <ul className="space-y-3">
            {service.details.bullets.map((b) => (
              <li key={b.label} className="flex gap-3">
                <span
                  className="mt-[9px] shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #B97A45, #D4A574)' }}
                />
                <span>
                  <strong className="text-kron-green font-semibold">{b.label}:</strong>{' '}
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p>{service.details.outro}</p>
      </div>

      {/* CTA */}
      <div className="shrink-0 px-6 md:px-8 py-5">
        <a
          href="#contact"
          onClick={(e) => e.stopPropagation()}
          className="inline-block text-center px-7 py-3 min-h-[48px] font-semibold rounded-lg text-sm tracking-wide uppercase"
          style={{
            background: getStartedHovered ? 'rgba(185,122,69,0.22)' : 'rgba(185,122,69,0.15)',
            border: getStartedHovered ? '1px solid rgba(185,122,69,0.50)' : '1px solid rgba(185,122,69,0.35)',
            color: '#e0b07a',
            boxShadow: getStartedHovered ? '0 0 12px rgba(185,122,69,0.15)' : 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => setGetStartedHovered(true)}
          onMouseLeave={() => setGetStartedHovered(false)}
        >
          Get Started
        </a>
      </div>
    </motion.div>
  )
}

function TileContent({ service, delay = 0, isHovered = false }) {
  return (
    <motion.div
      key="tile"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
      className="relative w-full h-full"
    >
      {/* Small centered icon — fades out on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <ServiceIcon icon={service.icon} size="sm" />
      </motion.div>

      {/* Large ghost icon — fills tile, fades in on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          className="w-full h-full p-3 text-kron-green/[0.07]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1}
        >
          {service.icon}
        </svg>
      </motion.div>

      {/* Text overlay — centered, on top */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2, delay: isHovered ? 0.06 : 0 }}
        className="absolute inset-0 flex items-center justify-center px-1 z-10"
      >
        <p className="font-serif text-[9.4px] tracking-wide text-kron-gold font-semibold text-center leading-tight">
          {service.title}
        </p>
      </motion.div>
    </motion.div>
  )
}

function DefaultContent({ service, delay = 0 }) {
  return (
    <motion.div
      key="default"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay }}
      className="p-8 flex flex-col relative"
    >
      <ServiceIcon icon={service.icon} glow />
      <h3 className="text-lg font-bold text-kron-green mt-5 mb-3 tracking-tight">{service.title}</h3>
      {/* Small gold accent line */}
      <div
        className="w-8 h-px mb-4"
        style={{ background: 'linear-gradient(to right, rgba(185,122,69,0.5), transparent)' }}
      />
      <p className="text-sm text-kron-brown/80 leading-relaxed">{service.description}</p>
    </motion.div>
  )
}

/* ── Mobile carousel dot indicators ── */
function CarouselDots({ count, activeIndex }) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === activeIndex ? 'w-6 bg-kron-gold' : 'w-2 bg-white/30'
          }`}
        />
      ))}
    </div>
  )
}

/* ── Mobile expanded modal ── */
function MobileExpandedModal({ service, serviceIndex, onClose, onNavigate, total }) {
  const [getStartedHovered, setGetStartedHovered] = useState(false)
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Swipe navigation
  const touchStartX = useRef(null)
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && serviceIndex < total - 1) onNavigate(serviceIndex + 1)
      else if (diff < 0 && serviceIndex > 0) onNavigate(serviceIndex - 1)
    }
    touchStartX.current = null
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-white"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header bar */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3 border-b border-kron-sage/20">
        <div className="flex items-center gap-3">
          <ServiceIcon icon={service.icon} size="sm" glow />
          <h3 className="text-lg font-bold text-kron-green tracking-tight">{service.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-kron-sage/30 active:bg-kron-gold/5 text-kron-brown/60"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-4 text-[15px] text-kron-brown leading-[1.7]">
        <p className="text-base">{service.details.intro}</p>
        <p className="font-medium text-kron-green/80 italic">{service.details.subtitle}</p>

        {service.details.bullets.length > 0 && (
          <ul className="space-y-3">
            {service.details.bullets.map((b) => (
              <li key={b.label} className="flex gap-3">
                <span
                  className="mt-[9px] shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #B97A45, #D4A574)' }}
                />
                <span>
                  <strong className="text-kron-green font-semibold">{b.label}:</strong>{' '}
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p>{service.details.outro}</p>
      </div>

      {/* Bottom CTA + nav indicator */}
      <div className="shrink-0 px-5 py-4 border-t border-kron-sage/20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
        <a
          href="#contact"
          onClick={onClose}
          className="block text-center px-7 py-4 min-h-[52px] font-semibold rounded-xl text-sm tracking-wide uppercase"
          style={{
            background: getStartedHovered ? 'rgba(185,122,69,0.22)' : 'rgba(185,122,69,0.15)',
            border: getStartedHovered ? '1px solid rgba(185,122,69,0.50)' : '1px solid rgba(185,122,69,0.35)',
            color: '#e0b07a',
            boxShadow: getStartedHovered ? '0 0 12px rgba(185,122,69,0.15)' : 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => setGetStartedHovered(true)}
          onMouseLeave={() => setGetStartedHovered(false)}
        >
          Get Started
        </a>
        <p className="text-center text-xs text-kron-brown/40 mt-2">Swipe to browse services</p>
      </div>
    </motion.div>
  )
}

/* ── Main component ── */

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [pendingSwitch, setPendingSwitch] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null)
  const [mobileScrollIndex, setMobileScrollIndex] = useState(0)
  const [hoveredTileIndex, setHoveredTileIndex] = useState(null)
  const [getInTouchHovered, setGetInTouchHovered] = useState(false)
  const gridRef = useRef(null)
  const carouselRef = useRef(null)
  const isExpanded = activeIndex !== null
  const windowWidth = useWindowWidth()

  const isMobile = windowWidth < 768
  const isDesktop = windowWidth >= 1024

  // Track carousel scroll position for dot indicators
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return
    const el = carouselRef.current
    const handleScroll = () => {
      const cardWidth = el.scrollWidth / services.length
      const index = Math.round(el.scrollLeft / cardWidth)
      setMobileScrollIndex(Math.min(index, services.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  /* ── Close: two-phase collapse ── */
  const handleClose = useCallback(() => {
    setPhase('collapsing')
    setTimeout(() => {
      setActiveIndex(null)
      setPhase('idle')
    }, 500)
  }, [])

  /* ── Click: open or conveyor-belt switch ── */
  const handleCardClick = useCallback((i) => {
    if (phase !== 'idle') return
    if (activeIndex === i) return

    if (activeIndex !== null) {
      setPendingSwitch(i)
      setPhase('shuffling')
      setTimeout(() => {
        setActiveIndex(i)
        setPendingSwitch(null)
        setPhase('idle')
      }, 700)
    } else {
      setActiveIndex(i)
    }
  }, [activeIndex, phase])

  const staggerRef = useRef(null)
  const isInView = useInView(staggerRef, { once: true, margin: '-60px' })

  // Click-outside handler
  useEffect(() => {
    if (!isExpanded) return
    function handleClickOutside(e) {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded, handleClose])

  // Escape key handler
  useEffect(() => {
    if (!isExpanded) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, handleClose])

  const tileSize = isDesktop ? 72 : 64

  /* ── Grid layout (desktop/tablet only) ── */
  const gridStyle = (() => {
    if (isMobile) return { display: 'none' }

    if (!isExpanded) {
      if (!isDesktop) {
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(3, auto)',
          gap: '24px',
        }
      }
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '24px',
      }
    }

    return {
      display: 'grid',
      gridTemplateColumns: `${tileSize}px 1fr`,
      gridTemplateRows: 'repeat(5, 1fr)',
      gap: isDesktop ? '12px' : '10px',
    }
  })()

  /* ── Per-card grid placement ── */
  const getCardStyle = (i) => {
    if (!isExpanded) return {}

    if (i === activeIndex) {
      return { gridColumn: '2', gridRow: '1 / -1' }
    }

    const isShuffling = phase === 'shuffling'
    const row = getTileRow(i, activeIndex, pendingSwitch, isShuffling)
    return { gridColumn: '1', gridRow: `${row + 1}` }
  }

  /* ── Content state per card ── */
  const getContentState = (i) => {
    if (phase === 'collapsing') return 'none'
    if (phase === 'shuffling') {
      if (i === activeIndex || i === pendingSwitch) return 'none'
      return 'tile'
    }
    if (!isExpanded) return 'default'
    if (i === activeIndex) return 'expanded'
    return 'tile'
  }

  return (
    <section id="services" className="scroll-mt-16">
      {/* Header + Intro */}
      <div className="bg-kron-green min-h-screen flex flex-col pt-24 md:pt-32 pb-16 px-5 md:px-6">
        <div className="max-w-6xl mx-auto w-full">
          <FadeInUp>
            <div className="text-center mb-6">
              <h2 className="font-display text-7xl md:text-8xl font-medium text-white mb-4">Our Services</h2>
              <p className="text-base md:text-lg text-white/70">
                Comprehensive financial services tailored to your needs
              </p>
            </div>
          </FadeInUp>

          {/* Mobile: horizontal scroll-snap carousel */}
          {isMobile && (
            <div>
              <div
                ref={carouselRef}
                className="mobile-snap-carousel flex gap-4 overflow-x-auto pb-2 -mx-5 px-5"
                style={{ scrollPaddingLeft: '20px' }}
              >
                {services.map((service, i) => (
                  <motion.div
                    key={service.title}
                    className="shrink-0 rounded-2xl bg-white border-l-[3px] border-l-kron-gold/40 border border-kron-sage/20 active:scale-[0.98] transition-transform"
                    style={{
                      minWidth: '85vw',
                      maxWidth: '85vw',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    onClick={() => setMobileExpandedIndex(i)}
                  >
                    <div className="p-6">
                      <ServiceIcon icon={service.icon} glow />
                      <h3 className="text-lg font-bold text-kron-green mt-4 mb-3 tracking-tight">{service.title}</h3>
                      <div
                        className="w-8 h-px mb-3"
                        style={{ background: 'linear-gradient(to right, rgba(185,122,69,0.5), transparent)' }}
                      />
                      <p className="text-sm text-kron-brown/80 leading-relaxed">{service.description}</p>
                      <div className="mt-4 flex items-center gap-1 text-kron-gold text-sm font-medium">
                        <span>Learn more</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <CarouselDots count={services.length} activeIndex={mobileScrollIndex} />
            </div>
          )}

          {/* Desktop/Tablet: existing grid layout */}
          <LayoutGroup>
            <div ref={gridRef}>
              <div ref={staggerRef} style={gridStyle}>
                {services.map((service, i) => {
                  const isActive = activeIndex === i
                  const isInactive = isExpanded && !isActive
                  const cardPlacement = getCardStyle(i)
                  const contentState = getContentState(i)

                  const isShuffling = phase === 'shuffling'
                  const tileDelay = isInactive && !isShuffling
                    ? getTileRow(i, activeIndex, null, false) * 0.1 + 0.3
                    : 0
                  const defaultStaggerDelay = i * 0.08

                  const cardStyle = (() => {
                    if (isActive) {
                      return {
                        ...cardPlacement,
                        cursor: 'default',
                        minHeight: '100%',
                        boxShadow: '0 8px 40px rgba(185,122,69,0.12), 0 4px 20px rgba(0,0,0,0.08)',
                      }
                    }
                    if (isInactive) {
                      return {
                        ...cardPlacement,
                        cursor: 'pointer',
                        minHeight: `${tileSize}px`,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        zIndex: hoveredTileIndex === i ? 20 : 1,
                      }
                    }
                    return {
                      ...cardPlacement,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
                    }
                  })()

                  const hoverEffect = (() => {
                    if (isActive) return undefined
                    if (isInactive) return { scale: 1.5, boxShadow: '0 4px 16px rgba(185,122,69,0.2), 0 0 0 1px rgba(185,122,69,0.25)', transition: { duration: 0.2 } }
                    return {
                      y: -6,
                      boxShadow: '0 8px 30px rgba(185,122,69,0.1), 0 4px 16px rgba(0,0,0,0.06)',
                      transition: { duration: 0.3 },
                    }
                  })()

                  return (
                    <motion.div
                      key={service.title}
                      layout="position"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{
                        opacity: { duration: 1, delay: i * 0.2, ease: 'easeOut' },
                        y: { duration: 1, delay: i * 0.2, ease: 'easeOut' },
                        layout: layoutSpring,
                      }}
                      onClick={() => handleCardClick(i)}
                      onHoverStart={() => isInactive && setHoveredTileIndex(i)}
                      onHoverEnd={() => isInactive && setHoveredTileIndex(null)}
                      style={cardStyle}
                      className={[
                        'relative rounded-2xl bg-white',
                        !isActive && !isInactive
                          ? 'border-l-[3px] border-l-kron-gold/40 border border-kron-sage/20 hover:border-kron-gold/30 hover:border-l-kron-gold/70'
                          : '',
                        isActive ? 'border border-kron-gold/20' : '',
                        isInactive ? 'border border-kron-sage/25 hover:border-kron-gold/40 overflow-hidden' : '',
                      ].filter(Boolean).join(' ')}
                      whileHover={hoverEffect}
                    >
                      <AnimatePresence mode="wait">
                        {contentState === 'expanded' && (
                          <ExpandedContent
                            service={service}
                            onClose={handleClose}
                          />
                        )}
                        {contentState === 'tile' && (
                          <TileContent
                            service={service}
                            delay={tileDelay}
                            isHovered={hoveredTileIndex === i}
                          />
                        )}
                        {contentState === 'default' && (
                          <DefaultContent
                            service={service}
                            delay={defaultStaggerDelay}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* Mobile expanded modal */}
      <AnimatePresence>
        {mobileExpandedIndex !== null && (
          <MobileExpandedModal
            service={services[mobileExpandedIndex]}
            serviceIndex={mobileExpandedIndex}
            total={services.length}
            onClose={() => setMobileExpandedIndex(null)}
            onNavigate={(idx) => setMobileExpandedIndex(idx)}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <div id="goals" className="bg-kron-mist py-16 px-5 md:py-24 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-kron-green mb-6">
              Let&apos;s Talk About Your Goals
            </h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-kron-brown leading-relaxed mb-10">
              Ready to take the next step? Get in touch and we&apos;ll arrange a
              complimentary initial consultation to discuss how we can help.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <a
              href="#contact"
              className="inline-block px-8 py-4 min-h-[48px] font-semibold rounded-lg"
              style={{
                background: getInTouchHovered ? 'rgba(185,122,69,0.22)' : 'rgba(185,122,69,0.15)',
                border: getInTouchHovered ? '1px solid rgba(185,122,69,0.50)' : '1px solid rgba(185,122,69,0.35)',
                color: '#e0b07a',
                boxShadow: getInTouchHovered ? '0 0 12px rgba(185,122,69,0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setGetInTouchHovered(true)}
              onMouseLeave={() => setGetInTouchHovered(false)}
            >
              Get in Touch
            </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}
