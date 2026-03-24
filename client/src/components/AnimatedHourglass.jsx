import { useRef, useEffect } from 'react'

export default function AnimatedHourglass({ className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.load()
          video.play().catch(() => {})
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(video)
    return () => observer.disconnect()
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
