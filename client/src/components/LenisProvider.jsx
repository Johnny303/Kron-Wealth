import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Snap from 'lenis/snap'

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const snap = new Snap(lenis, {
      type: 'proximity',
      velocityThreshold: 0.3,
      distanceThreshold: '30%',
    })

    const sectionIds = ['#about', '#philosophy', '#approach', '#ready', '#services', '#goals', '#contact']
    sectionIds.forEach(id => {
      const el = document.querySelector(id)
      if (el) snap.addElement(el, { offset: -64 })
    })

    return () => {
      snap.destroy()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  )
}
