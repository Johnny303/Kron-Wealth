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
      {/* Parallax background accents */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(185,122,69,0.15),transparent_50%)]"
        style={{ y: bgY2 }}
      />

      {/* Full-width grid layout */}
      <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
        {/* Left: Animated Hourglass — full height, edge-to-edge */}
        <motion.div
          className="relative overflow-hidden h-[50vh] lg:h-auto order-1"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <AnimatedHourglass className="mix-blend-lighten" />

          {/* Gradient overlays for seamless blending */}
          {/* Right edge fade */}
          <div className="absolute inset-0 bg-gradient-to-l from-kron-green via-kron-green/40 to-transparent to-60%" />
          {/* Top edge fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-kron-green to-transparent to-20%" />
          {/* Bottom edge fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-kron-green to-transparent to-20%" />
        </motion.div>

        {/* Right: Text content */}
        <motion.div
          className="text-center lg:text-left order-2 flex flex-col justify-center gap-8 px-6 lg:px-16 py-12 lg:py-0"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-normal text-white leading-tight"
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
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Helping you make the most of your time and money through personalised
            financial planning and expert guidance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <a
              href="#about"
              className="inline-block px-8 py-4 bg-kron-gold text-white font-sans font-normal rounded-lg hover:opacity-90 transition-opacity"
            >
              Learn About Us
            </a>
            <a
              href="#contact"
              className="inline-block px-8 py-4 border border-white/20 text-white font-sans font-normal rounded-lg hover:bg-white/5 transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
