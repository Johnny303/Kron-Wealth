import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import AnimatedHourglass from '../components/AnimatedHourglass'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen bg-kron-green overflow-hidden"
    >
      {/* Parallax background accents — disabled on mobile via motion style */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(185,122,69,0.15),transparent_50%)]"
        style={{ y: bgY2 }}
      />

      {/* Full-width grid layout */}
      <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
        {/* Left: Animated Hourglass — 40vh on mobile for more text room */}
        <motion.div
          className="relative overflow-hidden h-[40vh] lg:h-auto order-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <AnimatedHourglass className="mix-blend-lighten" />

          {/* Gradient overlays for seamless blending */}
          <div className="absolute inset-0 bg-gradient-to-l from-kron-green via-kron-green/40 to-transparent to-60%" />
          <div className="absolute inset-0 bg-gradient-to-b from-kron-green to-transparent to-20%" />
          <div className="absolute inset-0 bg-gradient-to-t from-kron-green to-transparent to-20%" />
        </motion.div>

        {/* Right: Text content — mobile gets px-5, no parallax transforms */}
        <motion.div
          className="text-center lg:text-left order-2 flex flex-col justify-center gap-6 md:gap-8 px-5 md:px-6 lg:px-16 py-8 md:py-12 lg:py-0"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.h1
            className="text-[clamp(2.25rem,7vw,3.5rem)] md:text-6xl lg:text-7xl font-normal text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Strategic Financial
            </motion.span>
            <motion.span
              className="block text-kron-gold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Consultancy
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              & Wealth Management
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base md:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Helping you make the most of your time and money through personalised
            financial planning and expert guidance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <a
              href="#about"
              className="inline-block px-8 py-4 min-h-[48px] bg-kron-gold text-white font-sans font-normal rounded-full hover:opacity-90 transition-opacity text-center active:scale-[0.97]"
            >
              Learn About Us
            </a>
            <a
              href="#contact"
              className="inline-block px-8 py-4 min-h-[48px] border border-white/20 text-white font-sans font-normal rounded-full hover:bg-white/5 transition-colors text-center active:scale-[0.97]"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
