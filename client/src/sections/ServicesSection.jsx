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

function ServiceIcon({ icon, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'
  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
  return (
    <div className={`${sizeClasses} rounded-xl bg-kron-gold/10 flex items-center justify-center shrink-0`}>
      <svg className={`${iconSize} text-kron-gold`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
  )
}

function ExpandedContent({ service, onClose }) {
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 p-6 md:p-8 flex flex-col overflow-hidden"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-kron-green/10 hover:bg-kron-green/20 transition-colors text-kron-green z-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-3 mb-4 pr-8">
        <ServiceIcon icon={service.icon} size="sm" />
        <h3 className="text-lg font-bold text-kron-green">{service.title}</h3>
      </div>

      <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-sm text-kron-brown leading-relaxed scrollbar-thin">
        <p>{service.details.intro}</p>
        <p className="font-medium text-kron-green/80">{service.details.subtitle}</p>

        {service.details.bullets.length > 0 && (
          <ul className="space-y-2 ml-1">
            {service.details.bullets.map((b) => (
              <li key={b.label} className="flex gap-2">
                <span className="text-kron-gold mt-1 shrink-0">&#x2022;</span>
                <span><strong className="text-kron-green">{b.label}:</strong> {b.text}</span>
              </li>
            ))}
          </ul>
        )}

        <p>{service.details.outro}</p>
      </div>

      <a
        href="#contact"
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-block text-center px-6 py-3 bg-kron-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shrink-0"
      >
        Get Started
      </a>
    </motion.div>
  )
}

function TileContent({ service, delay = 0 }) {
  return (
    <motion.div
      key="tile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full h-full flex items-center justify-center"
    >
      <ServiceIcon icon={service.icon} size="sm" />
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
      className="p-8 flex flex-col"
    >
      <div className="w-12 h-12 rounded-xl bg-kron-gold/10 flex items-center justify-center mb-6">
        <svg className="w-6 h-6 text-kron-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {service.icon}
        </svg>
      </div>
      <h3 className="text-lg font-bold text-kron-green mb-3">{service.title}</h3>
      <p className="text-sm text-kron-brown leading-relaxed">{service.description}</p>
    </motion.div>
  )
}

function getInactiveRow(cardIndex, activeIndex) {
  let row = 0
  for (let i = 0; i < services.length; i++) {
    if (i === activeIndex) continue
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

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'collapsing'
  const gridRef = useRef(null)
  const isExpanded = activeIndex !== null
  const windowWidth = useWindowWidth()

  const isMobile = windowWidth < 768
  const isDesktop = windowWidth >= 1024

  const handleClose = useCallback(() => {
    // Phase 1: fade out content
    setPhase('collapsing')
    // Phase 2: after content fades, reset grid
    setTimeout(() => {
      setActiveIndex(null)
      setPhase('idle')
    }, 500)
  }, [])

  const handleCardClick = useCallback((i) => {
    if (phase === 'collapsing') return
    if (activeIndex === i) return
    setActiveIndex(i)
    setPhase('idle')
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

  const gridStyle = (() => {
    if (!isExpanded) {
      if (isMobile) {
        return {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'repeat(6, auto)',
          gap: '16px',
        }
      }
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

    // Expanded state
    if (isMobile) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '480px auto',
        gap: '16px',
      }
    }

    return {
      display: 'grid',
      gridTemplateColumns: `${tileSize}px 1fr`,
      gridTemplateRows: 'repeat(5, 1fr)',
      gap: isDesktop ? '12px' : '10px',
    }
  })()

  const getCardStyle = (i) => {
    if (!isExpanded) return {}

    if (isMobile) {
      if (i === activeIndex) {
        return { gridColumn: '1', gridRow: '1' }
      }
      return { display: 'none' }
    }

    if (i === activeIndex) {
      return { gridColumn: '2', gridRow: '1 / -1' }
    }
    const row = getInactiveRow(i, activeIndex)
    return { gridColumn: '1', gridRow: `${row + 1}` }
  }

  // Determine content state for each card
  const getContentState = (i) => {
    if (phase === 'collapsing') return 'fading-out'
    if (!isExpanded) return 'default'
    if (i === activeIndex) return 'expanded'
    return 'tile'
  }

  return (
    <section id="services" className="scroll-mt-16">
      {/* Header + Intro */}
      <div className="bg-kron-green py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-6">
              <h2 className="font-display text-7xl md:text-8xl font-medium text-white mb-4">Our Services</h2>
              <p className="text-lg text-white/70">
                Comprehensive financial services tailored to your needs
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-white/70 leading-relaxed">
                We offer a full range of financial planning services designed to help you achieve
                your goals. Every recommendation is personal to you and based on a thorough
                understanding of your circumstances.
              </p>
            </div>
          </FadeInUp>

          {/* Service cards */}
          <LayoutGroup>
            <div ref={gridRef}>
              <div ref={staggerRef} style={gridStyle}>
                {services.map((service, i) => {
                  const isActive = activeIndex === i
                  const isInactive = isExpanded && !isActive
                  const cardPlacement = getCardStyle(i)
                  const contentState = getContentState(i)

                  if (isMobile && isExpanded && !isActive) return null

                  const tileDelay = isInactive ? getInactiveRow(i, activeIndex) * 0.1 + 0.3 : 0
                  const defaultStaggerDelay = i * 0.08

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
                      style={{
                        ...cardPlacement,
                        cursor: isActive ? 'default' : 'pointer',
                        minHeight: isActive ? (isMobile ? '480px' : '100%') : isInactive ? `${tileSize}px` : undefined,
                      }}
                      className={`relative rounded-2xl border border-kron-sage/30 bg-white ${
                        !isActive && !isInactive ? 'hover:shadow-lg hover:border-kron-gold/20' : ''
                      } ${isActive ? 'shadow-lg overflow-hidden' : ''} ${isInactive ? 'hover:border-kron-gold/30 hover:shadow-md overflow-hidden' : ''}`}
                      whileHover={!isExpanded ? { y: -4, transition: { duration: 0.2 } } : undefined}
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
                          />
                        )}
                        {(contentState === 'default' || contentState === 'fading-out') && (
                          <DefaultContent
                            service={service}
                            delay={contentState === 'default' ? defaultStaggerDelay : 0}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Mobile: horizontal icon row for inactive cards when expanded */}
              {isMobile && isExpanded && phase !== 'collapsing' && (
                <motion.div
                  className="flex flex-row gap-3 justify-center mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {services.map((service, i) => {
                    if (i === activeIndex) return null
                    return (
                      <motion.div
                        key={service.title}
                        layout="position"
                        onClick={() => handleCardClick(i)}
                        className="flex items-center justify-center rounded-xl border border-kron-sage/30 bg-white hover:border-kron-gold/30 hover:shadow-md transition-all cursor-pointer w-14 h-14"
                        whileHover={{ scale: 1.1 }}
                        title={service.title}
                      >
                        <ServiceIcon icon={service.icon} size="sm" />
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* CTA */}
      <div id="goals" className="bg-kron-mist py-24 px-6">
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
              className="inline-block px-8 py-4 bg-kron-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}
