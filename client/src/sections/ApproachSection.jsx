import { motion } from 'motion/react'
import { FadeInUp, StaggerChildren, staggerItem } from '../components/ScrollAnimations'

const steps = [
  {
    number: '01',
    title: 'Life Planning',
    description:
      'We start by understanding you — your goals, values, and what matters most. This isn\'t about numbers yet; it\'s about your life.',
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'Based on your life plan, we develop a clear financial strategy that aligns with your objectives and risk tolerance.',
  },
  {
    number: '03',
    title: 'Financial Planning',
    description:
      'We build a comprehensive financial plan covering investments, pensions, protection, tax planning, and estate planning.',
  },
  {
    number: '04',
    title: 'Financial Advice',
    description:
      'We provide ongoing advice and regular reviews to keep your plan on track as your life evolves and markets change.',
  },
]

export default function ApproachSection() {
  return (
    <section id="approach" className="scroll-mt-16">
      {/* Header */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Approach</h2>
              <p className="text-lg text-navy-lighter">
                A structured process designed around your life
              </p>
            </div>
          </FadeInUp>

          {/* Desktop: horizontal timeline */}
          <StaggerChildren className="hidden md:grid grid-cols-4 gap-8" staggerDelay={0.15}>
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={staggerItem} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald to-gold/50"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  />
                )}
                <div className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto"
                    whileInView={{ scale: [0.8, 1.05, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-lg font-bold text-navy text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-navy-lighter text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>

          {/* Mobile: vertical timeline */}
          <StaggerChildren className="md:hidden space-y-8" staggerDelay={0.12}>
            {steps.map((step) => (
              <motion.div key={step.number} variants={staggerItem} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {step.number}
                  </div>
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald/50 to-transparent mt-2" />
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-navy-lighter leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-navy mb-6">Ready to Get Started?</h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-navy-lighter leading-relaxed mb-10">
              Our process is designed to give you clarity and confidence in your financial future.
              Let&apos;s start the conversation.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#services"
                className="inline-block px-6 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy-light transition-colors"
              >
                Our Services
              </a>
              <a
                href="#contact"
                className="inline-block px-6 py-3 border border-navy text-navy font-medium rounded-lg hover:bg-navy hover:text-white transition-colors"
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
