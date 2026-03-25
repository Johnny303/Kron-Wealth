import { useRef, useEffect, useCallback } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'

const SECTION_IDS = ['about', 'approach', 'services', 'contact']

/**
 * Build structured path segments from section positions.
 * Returns an array of { cmd, points } objects where points are {x, y}.
 */
function buildSegments(vw) {
  const sections = SECTION_IDS.map(id => {
    const el = document.getElementById(id)
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return {
      id,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: rect.height,
    }
  }).filter(Boolean)

  const footerEl = document.querySelector('footer')
  if (footerEl) {
    const rect = footerEl.getBoundingClientRect()
    sections.push({
      id: 'footer',
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: rect.height,
    })
  }

  if (sections.length < 2) return null

  const startY = sections[0].top + 40
  const last = sections[sections.length - 1]
  const endY = last.bottom - 40

  const points = [{ x: vw * 0.92, y: startY }]

  for (let i = 0; i < sections.length - 1; i++) {
    const curr = sections[i]
    const next = sections[i + 1]
    const midY = (curr.bottom + next.top) / 2
    const goRight = i % 2 === 0

    const farX = goRight ? vw * 1.05 : vw * -0.05
    const nearX = goRight ? vw * -0.02 : vw * 1.02

    points.push({ x: farX, y: curr.bottom - curr.height * 0.1 })
    points.push({ x: farX, y: midY })
    points.push({ x: nearX, y: next.top + next.height * 0.15 })
    points.push({
      x: vw * (goRight ? 0.05 : 0.95),
      y: next.top + next.height * 0.35,
    })
  }

  points.push({ x: vw * 0.5, y: endY })

  // Convert points into structured segments
  const segments = [{ cmd: 'M', points: [points[0]] }]

  for (let i = 1; i < points.length; i += 4) {
    if (i + 3 < points.length) {
      const cp1 = points[i]
      const mid = points[i + 1]
      const cp2 = points[i + 2]
      const end = points[i + 3]

      segments.push({
        cmd: 'C',
        points: [
          { x: cp1.x, y: cp1.y },
          { x: mid.x, y: (cp1.y + mid.y) / 2 },
          { x: mid.x, y: mid.y },
        ],
      })
      segments.push({
        cmd: 'C',
        points: [
          { x: mid.x, y: (mid.y + cp2.y) / 2 },
          { x: cp2.x, y: cp2.y },
          { x: end.x, y: end.y },
        ],
      })
    } else {
      const remaining = points.slice(i)
      if (remaining.length === 1) {
        const prev = points[i - 1]
        const pt = remaining[0]
        segments.push({
          cmd: 'Q',
          points: [
            { x: vw * 0.5, y: (prev.y + pt.y) / 2 },
            { x: pt.x, y: pt.y },
          ],
        })
      } else {
        for (const pt of remaining) {
          const prev = points[points.indexOf(pt) - 1] || points[i - 1]
          segments.push({
            cmd: 'Q',
            points: [
              { x: (prev.x + pt.x) / 2, y: (prev.y + pt.y) / 2 },
              { x: pt.x, y: pt.y },
            ],
          })
        }
      }
    }
  }

  return segments
}

/**
 * Convert segments to a `d` string, shifting all Y values by yOffset.
 */
function segmentsToD(segments, yOffset) {
  let d = ''
  for (const seg of segments) {
    d += seg.cmd + ' '
    d += seg.points
      .map(p => `${p.x} ${p.y - yOffset}`)
      .join(', ')
    d += ' '
  }
  return d
}

/**
 * Measure total path length using an offscreen SVG.
 */
function measurePathLength(segments) {
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'

  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', segmentsToD(segments, 0))
  path.setAttribute('fill', 'none')
  svg.appendChild(path)
  document.body.appendChild(svg)

  const len = path.getTotalLength()
  document.body.removeChild(svg)
  return len
}

/**
 * Sample the path at regular intervals to build a Y → cumulative-length lookup.
 */
function buildYToLengthMap(segments, totalLength) {
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'

  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', segmentsToD(segments, 0))
  path.setAttribute('fill', 'none')
  svg.appendChild(path)
  document.body.appendChild(svg)

  const steps = 500
  const map = []
  for (let i = 0; i <= steps; i++) {
    const len = (i / steps) * totalLength
    const pt = path.getPointAtLength(len)
    map.push({ y: pt.y, len })
  }

  document.body.removeChild(svg)
  return map
}

/**
 * Find the path length corresponding to a given document Y position.
 * Scans forward, returning the max length where y <= targetY.
 */
function yToLength(map, targetY) {
  let bestLen = 0
  for (let i = 0; i < map.length; i++) {
    if (map[i].y <= targetY) bestLen = map[i].len
  }
  return bestLen
}

const mobileQuery = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 479px)')
  : null

export default function ScrollPath() {
  const containerRef = useRef(null)
  const mainPathRef = useRef(null)
  const outerGlowRef = useRef(null)
  const innerGlowRef = useRef(null)

  // Stored data (not React state — no re-renders needed)
  const dataRef = useRef({
    segments: null,
    pathLength: 0,
    docHeight: 0,
    isMobile: mobileQuery?.matches ?? false,
  })

  const recalculate = useCallback(() => {
    const data = dataRef.current
    data.isMobile = mobileQuery?.matches ?? false

    if (data.isMobile) {
      if (containerRef.current) containerRef.current.style.display = 'none'
      return
    }

    const vw = window.innerWidth
    const segments = buildSegments(vw)

    if (!segments) {
      if (containerRef.current) containerRef.current.style.display = 'none'
      return
    }

    data.segments = segments
    data.docHeight = document.documentElement.scrollHeight
    data.pathLength = measurePathLength(segments)
    data.yToLenMap = buildYToLengthMap(segments, data.pathLength)

    if (containerRef.current) {
      containerRef.current.style.display = ''
    }

    // Set initial path state
    const scrollY = window.scrollY
    const d = segmentsToD(segments, scrollY)
    const midpointY = scrollY + window.innerHeight / 2
    const revealLen = yToLength(data.yToLenMap, midpointY)
    const initialOffset = data.pathLength - revealLen

    for (const ref of [mainPathRef, outerGlowRef, innerGlowRef]) {
      if (ref.current) {
        ref.current.setAttribute('d', d)
        ref.current.style.strokeDasharray = data.pathLength
        ref.current.style.strokeDashoffset = initialOffset
      }
    }
  }, [])

  // Setup: initial calc + debounced ResizeObserver
  useEffect(() => {
    const timer = setTimeout(recalculate, 300)

    let resizeTimer = null
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(recalculate, 200)
    })
    observer.observe(document.documentElement)

    const handleMediaChange = () => recalculate()
    mobileQuery?.addEventListener('change', handleMediaChange)

    return () => {
      clearTimeout(timer)
      clearTimeout(resizeTimer)
      observer.disconnect()
      mobileQuery?.removeEventListener('change', handleMediaChange)
    }
  }, [recalculate])

  // Imperative scroll handler — zero React re-renders
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const data = dataRef.current
    if (!data.segments || !data.pathLength || data.isMobile) return

    const scrollY = window.scrollY
    const vh = window.innerHeight
    const midpointY = scrollY + vh / 2

    // Fade in
    const opacity = progress < 0.03 ? 0
      : progress < 0.08 ? (progress - 0.03) / 0.05
      : 1
    if (containerRef.current) {
      containerRef.current.style.opacity = opacity
    }

    // Translate path into viewport coordinates
    const d = segmentsToD(data.segments, scrollY)

    // Reveal path up to the viewport midpoint
    const revealLen = data.yToLenMap
      ? yToLength(data.yToLenMap, midpointY)
      : 0
    const offset = data.pathLength - revealLen

    for (const ref of [mainPathRef, outerGlowRef, innerGlowRef]) {
      if (ref.current) {
        ref.current.setAttribute('d', d)
        ref.current.style.strokeDashoffset = offset
      }
    }
  })

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0,
        overflow: 'visible',
        maskImage: `linear-gradient(to right,
          white 0%, white 10%,
          rgba(255,255,255,0.35) 25%,
          rgba(255,255,255,0.35) 75%,
          white 90%, white 100%
        )`,
        WebkitMaskImage: `linear-gradient(to right,
          white 0%, white 10%,
          rgba(255,255,255,0.35) 25%,
          rgba(255,255,255,0.35) 75%,
          white 90%, white 100%
        )`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1440} ${typeof window !== 'undefined' ? window.innerHeight : 900}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
        fill="none"
      >
        <defs>
          <linearGradient id="kron-path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A056" />
            <stop offset="30%" stopColor="#B97A45" />
            <stop offset="65%" stopColor="#C4903A" />
            <stop offset="100%" stopColor="#8B5E30" />
          </linearGradient>

          {/* Tight bloom around the core line */}
          <filter id="glow-inner" x="-500%" y="-500%" width="1100%" height="1100%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* Wide atmospheric haze — barely perceptible */}
          <filter id="glow-outer" x="-500%" y="-500%" width="1100%" height="1100%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Outer glow — blurred haze, whisper opacity */}
        <path
          ref={outerGlowRef}
          stroke="rgba(201, 168, 76, 0.07)"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          filter="url(#glow-outer)"
        />

        {/* Inner glow — tight bloom, very low opacity */}
        <path
          ref={innerGlowRef}
          stroke="rgba(212, 160, 86, 0.14)"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          filter="url(#glow-inner)"
        />

        {/* Main gold ribbon */}
        <path
          ref={mainPathRef}
          stroke="url(#kron-path-gradient)"
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
