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

  const points = [{ x: vw * 0.5, y: startY }]

  for (let i = 0; i < sections.length - 1; i++) {
    const curr = sections[i]
    const next = sections[i + 1]
    const midY = (curr.bottom + next.top) / 2
    const goRight = i % 2 === 0

    const farX = goRight ? vw * 1.08 : vw * -0.08
    const nearX = goRight ? vw * -0.04 : vw * 1.04

    points.push({ x: farX, y: curr.bottom - curr.height * 0.1 })
    points.push({ x: farX, y: midY })
    points.push({ x: nearX, y: next.top + next.height * 0.15 })
    points.push({
      x: vw * (goRight ? 0.3 : 0.7),
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

    if (containerRef.current) {
      containerRef.current.style.display = ''
    }

    // Set initial path state
    const scrollY = window.scrollY
    const d = segmentsToD(segments, scrollY)

    for (const ref of [mainPathRef, outerGlowRef, innerGlowRef]) {
      if (ref.current) {
        ref.current.setAttribute('d', d)
        ref.current.style.strokeDasharray = data.pathLength
        ref.current.style.strokeDashoffset = data.pathLength
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

    // Fade in
    const opacity = progress < 0.03 ? 0
      : progress < 0.08 ? (progress - 0.03) / 0.05
      : 1
    if (containerRef.current) {
      containerRef.current.style.opacity = opacity
    }

    // Translate path into viewport coordinates
    const d = segmentsToD(data.segments, scrollY)

    // Dash offset: draw from 5% to 95% scroll
    const drawProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.9))
    const offset = data.pathLength * (1 - drawProgress)

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
        </defs>

        {/* Outer glow — wide, very faint */}
        <path
          ref={outerGlowRef}
          stroke="rgba(185, 122, 69, 0.03)"
          strokeWidth={36}
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner glow — medium width, slightly stronger */}
        <path
          ref={innerGlowRef}
          stroke="rgba(185, 122, 69, 0.08)"
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />

        {/* Main gold ribbon */}
        <path
          ref={mainPathRef}
          stroke="url(#kron-path-gradient)"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
