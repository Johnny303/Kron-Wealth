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

export default function ApproachSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showText, setShowText] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // Refs for dynamic SVG lines
  const containerRef = useRef(null)
  const dotRefs = useRef([])
  const [lineCoords, setLineCoords] = useState([])

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
    const coords = []
    for (let i = 0; i < dotRefs.current.length - 1; i++) {
      const a = dotRefs.current[i]
      const b = dotRefs.current[i + 1]
      if (!a || !b) continue
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      coords.push({
        x1: aRect.left + aRect.width / 2 - containerRect.left,
        y1: aRect.top + aRect.height / 2 - containerRect.top,
        x2: bRect.left + bRect.width / 2 - containerRect.left,
        y2: bRect.top + bRect.height / 2 - containerRect.top,
      })
    }
    setLineCoords(coords)
  }, [])

  // Recalculate lines on hover changes, entrance, and mount
  useEffect(() => {
    updateLines()
    // Keep updating during transitions and stagger entrance animations
    const frames = []
    let count = 0
    const tick = () => {
      updateLines()
      count++
      if (count < 150) frames.push(requestAnimationFrame(tick)) // ~2.5s of tracking
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

  return (
    <section id="approach" className="scroll-mt-16">
      {/* Header */}
      <div className="bg-kron-green py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="font-display text-7xl md:text-8xl font-medium text-white mb-4">Our Approach</h2>
              <p className="text-lg text-white/70">
                A structured process designed around your life
              </p>
            </div>
          </FadeInUp>

          {/* Desktop: zig-zag interactive timeline */}
          <StaggerChildren className="hidden md:block" staggerDelay={0.15}>
            <div className="relative" ref={containerRef}>
              {/* SVG connector lines — dynamically positioned to follow dots */}
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
                </defs>
                {lineCoords.map((c, idx) => {
                  const dx = c.x2 - c.x1
                  const dy = c.y2 - c.y1
                  const length = Math.sqrt(dx * dx + dy * dy)
                  const segDelay = idx * 900
                  // Glow fades out after its draw finishes: draw ends at segDelay+900, fade starts there
                  const fadeDelay = segDelay + 900
                  return (
                    <g key={idx}>
                      {/* Base line — dim until entrance animation */}
                      <line
                        x1={c.x1} y1={c.y1}
                        x2={c.x2} y2={c.y2}
                        stroke="#B97A45"
                        strokeWidth="2"
                        opacity={hasEntered ? 1 : 0.3}
                        style={{ transition: 'opacity 900ms' }}
                      />
                      {/* Bright glow line — draws itself on entrance, then fades out */}
                      {hasEntered && (
                        <line
                          x1={c.x1} y1={c.y1}
                          x2={c.x2} y2={c.y2}
                          stroke="#F0C27A"
                          strokeWidth="4"
                          filter="url(#line-glow)"
                          strokeDasharray={length}
                          strokeDashoffset={length}
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

              {/* Cards row */}
              <div className="relative flex gap-6" style={{ zIndex: 2 }}>
                {steps.map((step, i) => {
                  const isTopRow = i % 2 === 0
                  const isHovered = hoveredIndex === i
                  const anyHovered = hoveredIndex !== null

                  return (
                    <motion.div
                      key={step.title}
                      variants={staggerItem}
                      className={`relative flex-1 transition-opacity duration-300 ${
                        !isTopRow ? 'mt-[80px]' : ''
                      } ${anyHovered && !isHovered ? 'opacity-50' : 'opacity-100'}`}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Card */}
                      <div
                        className={`relative w-full backdrop-blur-sm border rounded-xl cursor-default
                          transition-all pt-6 px-6 ${
                            isHovered
                              ? 'bg-kron-gold border-kron-gold pb-16'
                              : 'bg-white/10 border-white/20 pb-6'
                          }`}
                        style={{ transitionDuration: isHovered ? '1500ms' : '300ms' }}
                      >
                        <h3
                          className={`font-bold text-white text-center mb-2 transition-all whitespace-nowrap ${
                            isHovered ? 'text-2xl' : 'text-lg'
                          }`}
                          style={{ transitionDuration: isHovered ? '1500ms' : '300ms' }}
                        >
                          {step.title}
                        </h3>

                        {/* Description — revealed AFTER gold bg finishes (1500ms delay) */}
                        <AnimatePresence>
                          {isHovered && showText && (
                            <motion.p
                              className="text-base text-white/80 text-center leading-relaxed overflow-hidden"
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                              {step.description}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Dot — absolutely positioned inside the card, doesn't shift text */}
                        <div
                          ref={el => dotRefs.current[i] = el}
                          className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-kron-gold transition-all duration-300 ${
                            isHovered ? 'w-6 h-6' : 'w-3 h-3'
                          }`}
                          style={{
                            [isTopRow ? 'bottom' : 'top']: '0.75rem',
                            transition: 'all 300ms',
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
