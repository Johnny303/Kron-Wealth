import { useRef } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'motion/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function LottieScrollPlayer({
  src,
  className,
  containerRef,
  speed = 1,
  autoplay = false,
}) {
  const dotLottieRef = useRef(null)
  const fallbackRef = useRef(null)

  const scrollTarget = containerRef || fallbackRef

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start end', 'end start'],
  })

  const frame = useTransform(scrollYProgress, [0, 1], [0, 100 * speed])

  useMotionValueEvent(frame, 'change', (latest) => {
    const lottie = dotLottieRef.current
    if (lottie) {
      const totalFrames = lottie.totalFrames || 100
      const targetFrame = (latest / 100) * totalFrames
      lottie.setFrame(Math.min(targetFrame, totalFrames - 1))
    }
  })

  return (
    <div ref={fallbackRef} className={className}>
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={false}
        dotLottieRefCallback={(ref) => {
          dotLottieRef.current = ref
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
