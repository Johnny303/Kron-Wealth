import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FadeInUp, StaggerChildren, staggerItem } from '../components/ScrollAnimations'

const steps = [
  {
    title: 'Life Planning',
    description:
      'We start by understanding you — your goals, values, and what matters most. This isn\'t about numbers yet; it\'s about your life.',
  },
  {
    title: 'Strategy',
    description:
      'Based on your life plan, we develop a clear financial strategy that aligns with your objectives and risk tolerance.',
  },
  {
    title: 'Financial Planning',
    description:
      'We build a comprehensive financial plan covering investments, pensions, protection, tax planning, and estate planning.',
  },
  {
    title: 'Financial Advice',
    description:
      'We provide ongoing advice and regular reviews to keep your plan on track as your life evolves and markets change.',
  },
]

// Spatial positions for each card (percentage-based)
const cardPositions = [
  { left: '12%', top: '5%' },    // Card 0 — top-left
  { left: '62%', top: '0%' },    // Card 1 — upper-right
  { left: '58%', top: '48%' },   // Card 2 — center-right
  { left: '12%', top: '58%' },   // Card 3 — bottom-left
]

// Generate a cubic bezier path string between two points with curvature
function generatePathD(x1, y1, x2, y2, offset = 0) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  // Perpendicular unit vector
  const nx = -dy / len
  const ny = dx / len
  // Curvature amount — proportional to distance
  const curvature = len * 0.3
  // Control points offset perpendicular to the midpoint
  const cx1 = mx + nx * (curvature + offset)
  const cy1 = my + ny * (curvature + offset)
  // Second control point on the other side for S-curve feel
  const cx2 = mx - nx * (curvature * 0.3 - offset)
  const cy2 = my - ny * (curvature * 0.3 - offset)
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

// Calculate path length using a temporary SVG element
function getPathLength(d) {
  if (typeof document === 'undefined') return 0
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)
  const length = path.getTotalLength()
  document.body.removeChild(svg)
  return length
}

export default function ApproachSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showText, setShowText] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [revealedCards, setRevealedCards] = useState([false, false, false, false])

  // Refs for dynamic SVG lines
  const containerRef = useRef(null)
  const dotRefs = useRef([])
  const [lineData, setLineData] = useState([])

  // Scroll-triggered entrance animation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasEntered(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const updateLines = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const data = []
    for (let i = 0; i < dotRefs.current.length - 1; i++) {
      const a = dotRefs.current[i]
      const b = dotRefs.current[i + 1]
      if (!a || !b) continue
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      const x1 = aRect.left + aRect.width / 2 - containerRect.left
      const y1 = aRect.top + aRect.height / 2 - containerRect.top
      const x2 = bRect.left + bRect.width / 2 - containerRect.left
      const y2 = bRect.top + bRect.height / 2 - containerRect.top
      // Main path + two offset strands
      const mainD = generatePathD(x1, y1, x2, y2, 0)
      const leftD = generatePathD(x1, y1, x2, y2, -12)
      const rightD = generatePathD(x1, y1, x2, y2, 12)
      const mainLength = getPathLength(mainD)
      const leftLength = getPathLength(leftD)
      const rightLength = getPathLength(rightD)
      data.push({
        x1, y1, x2, y2,
        strands: [
          { d: leftD, length: leftLength, width: 1.5, opacity: 0.25 },
          { d: mainD, length: mainLength, width: 2, opacity: 0.5 },
          { d: rightD, length: rightLength, width: 1.5, opacity: 0.25 },
        ],
        glowD: mainD,
        glowLength: mainLength,
      })
    }
    setLineData(data)
  }, [])

  // Recalculate lines on hover changes, entrance, and mount
  useEffect(() => {
    updateLines()
    const frames = []
    let count = 0
    const tick = () => {
      updateLines()
      count++
      if (count < 150) frames.push(requestAnimationFrame(tick))
    }
    frames.push(requestAnimationFrame(tick))
    return () => frames.forEach(cancelAnimationFrame)
  }, [hoveredIndex, hasEntered, updateLines])

  // Sequence: gold bg first (1500ms), then show text
  useEffect(() => {
    if (hoveredIndex !== null) {
      setShowText(false)
      const timer = setTimeout(() => setShowText(true), 1500)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
    }
  }, [hoveredIndex])

  // Reveal cards sequentially as the glow line reaches each dot
  useEffect(() => {
    if (!hasEntered) return
    const timers = steps.map((_, i) =>
      setTimeout(() => {
        setRevealedCards(prev => { const next = [...prev]; next[i] = true; return next })
      }, i * 900)
    )
    return () => timers.forEach(clearTimeout)
  }, [hasEntered])

  return (
    <section id="approach" className="scroll-mt-16">
      {/* Header */}
      <div className="bg-kron-green py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-display text-7xl md:text-8xl font-medium text-white mb-4">Our Approach</h2>
             
            </div>
          </FadeInUp>

          {/* Desktop: spatial scattered layout with river paths */}
          <StaggerChildren className="hidden md:block" staggerDelay={0.15}>
            <div className="relative" ref={containerRef} style={{ height: '600px' }}>
              {/* SVG connector paths — dynamically positioned to follow dots */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  {/* Glow filter for the bright flow */}
                  <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Soft shadow filter to make lines feel recessed/inset */}
                  <filter id="line-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="shadow" />
                    <feOffset dx="0" dy="1" result="offsetShadow" />
                    <feFlood floodColor="#000" floodOpacity="0.3" result="color" />
                    <feComposite in="color" in2="offsetShadow" operator="in" result="coloredShadow" />
                    <feMerge>
                      <feMergeNode in="coloredShadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {lineData.map((segment, idx) => {
                  const segDelay = idx * 900
                  const fadeDelay = segDelay + 900
                  return (
                    <g key={idx}>
                      {/* Base path strands — recessed behind cards */}
                      {segment.strands.map((strand, si) => (
                        <path
                          key={`base-${si}`}
                          d={strand.d}
                          fill="none"
                          stroke="#8A5A2A"
                          strokeWidth={strand.width}
                          opacity={hasEntered ? strand.opacity : 0.1}
                          filter="url(#line-shadow)"
                          strokeLinecap="round"
                          style={{ transition: 'opacity 900ms' }}
                        />
                      ))}
                      {/* Bright glow path — draws itself on entrance, then fades out */}
                      {hasEntered && (
                        <path
                          d={segment.glowD}
                          fill="none"
                          stroke="#F0C27A"
                          strokeWidth="4"
                          filter="url(#line-glow)"
                          strokeLinecap="round"
                          strokeDasharray={segment.glowLength}
                          strokeDashoffset={segment.glowLength}
                          opacity="1"
                          style={{
                            animation: `drawLine 900ms ease-out ${segDelay}ms forwards, fadeGlow 1200ms ease-in ${fadeDelay}ms forwards`,
                          }}
                        />
                      )}
                    </g>
                  )
                })}
                <style>{`
                  @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                  }
                  @keyframes fadeGlow {
                    to { opacity: 0; }
                  }
                  @keyframes dotBlink {
                    0% { box-shadow: 0 0 0 0 rgba(240, 194, 122, 0); }
                    50% { box-shadow: 0 0 24px 10px rgba(240, 194, 122, 0.9); }
                    100% { box-shadow: 0 0 0 0 rgba(240, 194, 122, 0); }
                  }
                `}</style>
              </svg>

              {/* Cards — absolute positioned spatially */}
              {steps.map((step, i) => {
                const isHovered = hoveredIndex === i
                const anyHovered = hoveredIndex !== null
                const isRevealed = revealedCards[i]

                return (
                  <motion.div
                    key={step.title}
                    variants={staggerItem}
                    className={`absolute transition-all duration-500 ${
                      anyHovered && !isHovered ? 'opacity-50' : 'opacity-100'
                    }`}
                    style={{
                      left: cardPositions[i].left,
                      top: cardPositions[i].top,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isHovered ? 10 : 2,
                      filter: isRevealed ? 'blur(0px)' : 'blur(6px)',
                      transition: 'filter 600ms ease-out, opacity 300ms',
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Card — elevated above the connector lines */}
                    <div
                      className={`relative w-64 overflow-hidden backdrop-blur-sm border rounded-xl cursor-default
                        transition-all pt-6 px-6 ${
                          isHovered
                            ? 'border-kron-gold pb-6'
                            : 'bg-white/10 border-white/20 pb-6'
                        }`}
                      style={{
                        transitionDuration: isHovered ? '1500ms' : '300ms',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* Ripple — expands from dot position to fill the card */}
                      <div
                        className="absolute rounded-full bg-kron-gold pointer-events-none"
                        style={{
                          width: '16px',
                          height: '16px',
                          left: '50%',
                          bottom: isHovered ? '3.5rem' : '1.25rem',
                          transform: isHovered
                            ? 'translate(-50%, 50%) scale(60)'
                            : 'translate(-50%, 50%) scale(0)',
                          transition: isHovered
                            ? 'transform 3000ms cubic-bezier(0.25, 0.46, 0.45, 0.94), bottom 3000ms ease'
                            : 'transform 800ms ease-in, bottom 600ms ease',
                          zIndex: 0,
                        }}
                      />

                      <h3
                        className={`relative font-medium text-white text-center mb-2 transition-all whitespace-nowrap ${
                          isHovered ? 'text-2xl' : 'text-lg'
                        }`}
                        style={{ transitionDuration: isHovered ? '1500ms' : '300ms', zIndex: 1 }}
                      >
                        {step.title}
                      </h3>

                      {/* Description — revealed AFTER gold bg finishes (1500ms delay) */}
                      <AnimatePresence>
                        {isHovered && showText && (
                          <motion.p
                            className="relative text-base text-white/80 text-center leading-relaxed overflow-hidden"
                            style={{ zIndex: 1 }}
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Dot — inside card, under text */}
                      <div
                        ref={el => dotRefs.current[i] = el}
                        className={`relative mx-auto mt-3 rounded-full bg-kron-gold transition-all duration-300 ${
                          isHovered ? 'w-6 h-6' : 'w-3 h-3'
                        }`}
                        style={{
                          transition: 'all 300ms',
                          zIndex: 1,
                          ...(hasEntered ? {
                            animation: `dotBlink 750ms ease-in-out ${i * 900}ms`,
                          } : {}),
                        }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </StaggerChildren>

          {/* Mobile: vertical tap-to-expand timeline */}
          <StaggerChildren className="md:hidden" staggerDelay={0.12}>
            <div className="relative pl-8">
              {/* Vertical gold line */}
              <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-kron-gold/40" />

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.title}
                    variants={staggerItem}
                    className="relative"
                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                  >
                    {/* Gold dot marker */}
                    <div className="absolute -left-8 top-4 w-3 h-3 rounded-full bg-kron-gold ring-4 ring-kron-green z-10" />

                    {/* Card */}
                    <div
                      className={`bg-white/10 backdrop-blur-sm border rounded-xl p-5 cursor-pointer
                        transition-all duration-300
                        ${activeIndex === idx ? 'border-kron-gold/60 shadow-lg' : 'border-white/20'}`}
                    >
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>

                      <AnimatePresence>
                        {activeIndex === idx && (
                          <motion.p
                            className="text-sm text-white/70 leading-relaxed overflow-hidden"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </StaggerChildren>
        </div>
      </div>

      {/* CTA */}
      <div id="ready" className="bg-kron-mist py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-kron-green mb-6">Ready to Get Started?</h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-kron-brown leading-relaxed mb-10">
              Our process is designed to give you clarity and confidence in your financial future.
              Let&apos;s start the conversation.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#services"
                className="inline-block px-6 py-3 bg-kron-green text-white font-medium rounded-lg hover:bg-kron-brown transition-colors"
              >
                Our Services
              </a>
              <a
                href="#contact"
                className="inline-block px-6 py-3 border border-kron-green text-kron-green font-medium rounded-lg hover:bg-kron-green hover:text-white transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}
