import { motion } from 'motion/react'
import { FadeInUp, StaggerChildren, staggerItem } from '../components/ScrollAnimations'

const services = [
  {
    title: 'Strategic Financial Planning',
    description:
      'A comprehensive financial plan tailored to your goals, covering cash flow management, tax efficiency, and long-term wealth building.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  },
  {
    title: 'Risk Management & Protection',
    description:
      'Protecting you and your family against the unexpected with life insurance, critical illness cover, and income protection.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    title: 'Retirement Planning & Pensions',
    description:
      'Planning for a comfortable retirement, whether that means early retirement, phased retirement, or maximising your pension benefits.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: 'Investments',
    description:
      'Building and managing an investment portfolio aligned with your goals, risk tolerance, and time horizon.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
  },
  {
    title: 'Estate Planning',
    description:
      'Ensuring your wealth is passed on efficiently and in line with your wishes, minimising inheritance tax where possible.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
  },
  {
    title: 'Business Owner Services',
    description:
      'Specialist advice for business owners including exit planning, shareholder protection, and key person insurance.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-16">
      {/* Header + Intro */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Services</h2>
              <p className="text-lg text-navy-lighter">
                Comprehensive financial services tailored to your needs
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-navy-lighter leading-relaxed">
                We offer a full range of financial planning services designed to help you achieve
                your goals. Every recommendation is personal to you and based on a thorough
                understanding of your circumstances.
              </p>
            </div>
          </FadeInUp>

          {/* Service cards */}
          <StaggerChildren
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={staggerItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="group rounded-2xl border border-slate-100 p-8 hover:shadow-lg hover:border-emerald/20 transition-all bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mb-6 group-hover:bg-emerald/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {service.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy mb-3">{service.title}</h3>
                <p className="text-sm text-navy-lighter leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-navy mb-6">
              Let&apos;s Talk About Your Goals
            </h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-navy-lighter leading-relaxed mb-10">
              Ready to take the next step? Get in touch and we&apos;ll arrange a
              complimentary initial consultation to discuss how we can help.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <a
              href="#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald to-emerald-dark text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}
