import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const bgY3 = useTransform(scrollYProgress, [0, 1], [0, 60])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden"
    >
      {/* Parallax background layers */}
      <motion.img
        src="/images/hero-hourglass.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute inset-0 bg-navy/65"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]"
        style={{ y: bgY2 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,168,67,0.1),transparent_50%)]"
        style={{ y: bgY3 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Strategic Financial
          </motion.span>
          <motion.span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald to-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Consultancy
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            & Wealth Management
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Helping you make the most of your time and money through personalised
          financial planning and expert guidance.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href="#about"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald to-emerald-dark text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Learn About Us
          </a>
          <a
            href="#contact"
            className="inline-block px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  )
}
