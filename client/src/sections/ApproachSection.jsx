import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FadeInUp, StaggerChildren, staggerItem } from '../components/ScrollAnimations'

const steps = [
  {
    title: 'Life Planning',
    description:
      'We start by understanding you — your goals, values, and what matters most. This isn\'t about numbers yet; it\'s about your life.',
    tags: ['Goals', 'Lifestyle', 'Vision'],
  },
  {
    title: 'Strategy',
    description:
      'Based on your life plan, we develop a clear financial strategy that aligns with your objectives and risk tolerance.',
    tags: ['Portfolio', 'Risk', 'Return'],
  },
  {
    title: 'Financial Planning',
    description:
      'We build a comprehensive financial plan covering investments, pensions, protection, tax planning, and estate planning.',
    tags: ['Tax', 'Estate', 'Structure'],
  },
  {
    title: 'Financial Advice',
    description:
      'We provide ongoing advice and regular reviews to keep your plan on track as your life evolves and markets change.',
    tags: ['Ongoing', 'Reviews', 'Proactive'],
  },
]

// Spatial positions for each card (percentage-based)
const cardPositions = [
  { left: '12%', top: '0%' },    // Card 0 — top-left (Life Planning — first in timeline)
  { left: '62%', top: '10%' },   // Card 1 — upper-right (Strategy — below Life Planning)
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
  const cardRefs = useRef([])
  const [lineData, setLineData] = useState([])
  const [cardMaskData, setCardMaskData] = useState([])

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

    // Compute card bounding rects relative to container for SVG mask
    const masks = cardRefs.current.map(el => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        x: r.left - containerRect.left,
        y: r.top - containerRect.top,
        width: r.width,
        height: r.height,
      }
    }).filter(Boolean)
    setCardMaskData(masks)
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

  // Sequence: gold bg first (1000ms), then show text
  useEffect(() => {
    if (hoveredIndex !== null) {
      setShowText(false)
      const timer = setTimeout(() => setShowText(true), 1000)
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
                  {/* Mask that fades line opacity where cards sit on top */}
                  <mask id="line-card-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {cardMaskData.map((rect, i) => (
                      <rect
                        key={i}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        fill="black"
                        fillOpacity="0.72"
                        rx="12"
                        style={{ filter: 'blur(18px)' }}
                      />
                    ))}
                  </mask>
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
                          mask="url(#line-card-mask)"
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
                    0% { box-shadow: 0 0 0 0 rgba(224, 176, 122, 0); }
                    50% { box-shadow: 0 0 24px 10px rgba(224, 176, 122, 0.7); }
                    100% { box-shadow: 0 0 0 0 rgba(224, 176, 122, 0); }
                  }
                  @keyframes cornerDraw {
                    from { clip-path: inset(0 100% 100% 0); }
                    to { clip-path: inset(0 0 0 0); }
                  }
                  @keyframes cornerDrawBR {
                    from { clip-path: inset(100% 0 0 100%); }
                    to { clip-path: inset(0 0 0 0); }
                  }
                  @keyframes underlineDraw {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
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
                      transition: 'filter 400ms ease-out, opacity 200ms',
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Card — elevated above the connector lines */}
                    <div
                      ref={el => { cardRefs.current[i] = el }}
                      className={`relative w-64 overflow-hidden backdrop-blur-sm border rounded-xl cursor-default
                        pt-6 px-6 pb-6 ${!isHovered ? 'bg-white/10' : ''}`}
                      style={{
                        transition: [
                          `box-shadow ${isHovered ? '533ms' : '267ms'} cubic-bezier(0.4, 0, 0.2, 1)`,
                          `border-color ${isHovered ? '400ms' : '133ms'} ease-out`,
                          `background-color ${isHovered ? '1000ms' : '200ms'} ease`,
                        ].join(', '),
                        borderColor: isHovered ? 'rgba(185,122,69,0.25)' : 'rgba(255,255,255,0.2)',
                        boxShadow: isHovered
                          ? [
                              '0 2px 6px rgba(185, 122, 69, 0.15)',
                              '0 12px 32px rgba(185, 122, 69, 0.1)',
                              '0 24px 64px rgba(0, 0, 0, 0.5)',
                              'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                              'inset 0 -1px 0 rgba(185, 122, 69, 0.08)',
                            ].join(', ')
                          : '0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* Hover surface — gradient mesh + noise grain */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                          zIndex: 0,
                          background: [
                            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(224, 176, 122, 0.08) 0%, transparent 60%)',
                            'radial-gradient(ellipse 60% 80% at 85% 80%, rgba(185, 122, 69, 0.05) 0%, transparent 50%)',
                            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
                          ].join(', '),
                        }}
                      />
                      {/* Noise grain overlay */}
                      <svg className="absolute inset-0 w-full h-full rounded-xl pointer-events-none" style={{
                        opacity: isHovered ? 0.06 : 0,
                        transition: 'opacity 933ms ease',
                        zIndex: 0,
                        mixBlendMode: 'overlay',
                      }}>
                        <filter id={`grain-${i}`}>
                          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                          <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter={`url(#grain-${i})`} />
                      </svg>

                      {/* Corner accent — top-left */}
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          top: 0,
                          left: 0,
                          width: 28,
                          height: 28,
                          borderTop: '2px solid #e0b07a',
                          borderLeft: '2px solid #e0b07a',
                          borderTopLeftRadius: 12,
                          opacity: isHovered ? 1 : 0,
                          animation: isHovered ? 'cornerDraw 333ms cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'none',
                          zIndex: 3,
                        }}
                      />
                      {/* Corner accent — bottom-right */}
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          bottom: 0,
                          right: 0,
                          width: 28,
                          height: 28,
                          borderBottom: '2px solid #e0b07a',
                          borderRight: '2px solid #e0b07a',
                          borderBottomRightRadius: 12,
                          opacity: isHovered ? 1 : 0,
                          animation: isHovered ? 'cornerDrawBR 333ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards' : 'none',
                          zIndex: 3,
                        }}
                      />

                      {/* Ripple — expands from dot position to fill the card */}
                      <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: '16px',
                          height: '16px',
                          left: '50%',
                          backgroundColor: 'rgba(185,122,69,0.55)',
                          bottom: isHovered ? '3.5rem' : '1.25rem',
                          transform: isHovered
                            ? 'translate(-50%, 50%) scale(60)'
                            : 'translate(-50%, 50%) scale(0)',
                          transition: isHovered
                            ? 'transform 2000ms cubic-bezier(0.25, 0.46, 0.45, 0.94), bottom 2000ms ease'
                            : 'transform 533ms ease-in, bottom 400ms ease',
                          zIndex: 0,
                        }}
                      />

                      <h3
                        className={`relative font-medium text-white text-center mb-2 whitespace-nowrap ${
                          isHovered ? 'text-2xl' : 'text-lg'
                        }`}
                        style={{
                          transition: [
                            `font-size ${isHovered ? '1000ms' : '200ms'} ease`,
                            `letter-spacing ${isHovered ? '800ms' : '167ms'} cubic-bezier(0.22, 1, 0.36, 1)`,
                          ].join(', '),
                          letterSpacing: isHovered ? '0.06em' : '0em',
                          zIndex: 1,
                        }}
                      >
                        {step.title}
                        {/* Decorative underline — draws in on hover */}
                        <span
                          className="block mx-auto"
                          style={{
                            height: 1.5,
                            width: '60%',
                            marginTop: 4,
                            background: 'linear-gradient(90deg, transparent, #e0b07a, transparent)',
                            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                            transition: `transform ${isHovered ? '533ms' : '133ms'} cubic-bezier(0.22, 1, 0.36, 1) ${isHovered ? '400ms' : '0ms'}`,
                            transformOrigin: 'center',
                          }}
                        />
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
                            transition={{ duration: 0.27, ease: 'easeOut' }}
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Dot — inside card, under text */}
                      <div
                        ref={el => dotRefs.current[i] = el}
                        className="relative mx-auto mt-3 rounded-full w-3 h-3"
                        style={{
                          backgroundColor: '#e0b07a',
                          opacity: isHovered ? 0 : 1,
                          transition: 'opacity 267ms ease-out',
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

          {/* Mobile: accordion cards */}
          <StaggerChildren className="md:hidden" staggerDelay={0.12}>
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isOpen = activeIndex === idx
                return (
                  <motion.div
                    key={step.title}
                    variants={staggerItem}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-350 active:scale-[0.99]
                      ${isOpen
                        ? 'border-kron-gold/32 shadow-lg shadow-black/30'
                        : 'border-kron-gold/12'
                      }`}
                    style={{ background: isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)' }}
                    onClick={() => setActiveIndex(isOpen ? null : idx)}
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-4 px-5 py-5">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] tracking-[0.2em] uppercase text-kron-gold/80 mb-1 font-light">
                          Step {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="text-xl font-light text-white italic" style={{ fontFamily: 'Georgia, serif' }}>
                          {step.title}
                        </div>
                      </div>
                      {/* Chevron circle */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          border: isOpen ? '1px solid #B97A45' : '1px solid rgba(185,122,69,0.28)',
                          background: isOpen ? '#B97A45' : 'transparent',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke={isOpen ? '#10312C' : '#B97A45'}
                          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Body */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 border-t border-kron-gold/12 pt-4">
                            <div className="w-6 h-px bg-kron-gold/70 mb-3" />
                            <p className="text-sm text-white/50 leading-relaxed font-light">
                              {step.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {step.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-[10px] tracking-[0.1em] uppercase px-3 py-1 rounded-full font-light"
                                  style={{
                                    background: 'rgba(185,122,69,0.12)',
                                    border: '1px solid rgba(185,122,69,0.25)',
                                    color: '#e0b07a',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
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
                className="inline-block px-6 py-3 min-h-[48px] bg-kron-green text-white font-medium rounded-lg hover:bg-kron-brown transition-colors text-center flex items-center justify-center"
              >
                Our Services
              </a>
              <a
                href="#contact"
                className="inline-block px-6 py-3 min-h-[48px] border border-kron-green text-kron-green font-medium rounded-lg hover:bg-kron-green hover:text-white transition-colors text-center flex items-center justify-center"
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
