import { useRef, useEffect } from 'react'

export default function AnimatedHourglass({ className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const LOOP_WINDOW = 0.5
    const SNAP_THRESHOLD = 0.05

    let rafId = null

    const tick = () => {
      const { duration, currentTime } = video
      if (duration && currentTime >= duration - SNAP_THRESHOLD) {
        video.currentTime = duration - LOOP_WINDOW
      }
      rafId = requestAnimationFrame(tick)
    }

    const handleEnded = () => {
      const { duration } = video
      if (duration) {
        video.currentTime = duration - LOOP_WINDOW
        video.play().catch(() => {})
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.load()
          video.play().catch(() => {})
          rafId = requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    video.addEventListener('ended', handleEnded)
    observer.observe(video)

    return () => {
      observer.disconnect()
      video.removeEventListener('ended', handleEnded)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const base = import.meta.env.BASE_URL
  const isMobile = window.innerWidth < 1024

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      muted
      playsInline
      loop={false}
      preload="none"
    >
      <source
        src={`${base}videos/hourglass${isMobile ? '-mobile' : ''}.webm`}
        type="video/webm"
      />
      <source
        src={`${base}videos/hourglass${isMobile ? '-mobile' : ''}.mp4`}
        type="video/mp4"
      />
    </video>
  )
}
