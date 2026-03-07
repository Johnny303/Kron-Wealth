import { FadeInUp, WidthGrow, ParallaxLayer } from '../components/ScrollAnimations'

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">
      {/* Founder section */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
              About Us
            </h2>
            <p className="text-lg text-navy-lighter text-center mb-16">
              Getting to know Kron Wealth
            </p>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Founder headshot with parallax + sticky on desktop */}
            <div className="flex justify-center md:sticky md:top-24">
              <ParallaxLayer speed={0.15} className="flex justify-center">
                <div className="w-72 h-72 rounded-2xl bg-gradient-to-br from-navy-light to-navy-lighter flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              </ParallaxLayer>
            </div>

            <div>
              <FadeInUp delay={0.1}>
                <h3 className="text-3xl font-bold text-navy mb-2">A Word from Our Founder</h3>
              </FadeInUp>
              <WidthGrow className="w-16 h-1 bg-gradient-to-r from-emerald to-gold mb-8" delay={0.2} />
              <div className="space-y-4 text-navy-lighter leading-relaxed">
                <FadeInUp delay={0.2}>
                  <p>
                    Kron derives from Kronos (Chronos), the personification and God of time in
                    Greek mythology. Time is our most valuable and finite resource; it is this
                    very philosophy that is at the heart of everything we do at Kron.
                  </p>
                </FadeInUp>
                <FadeInUp delay={0.3}>
                  <p>
                    We believe that effective financial planning is not just about growing wealth —
                    it&apos;s about giving you the freedom to spend your time the way you want.
                    Whether that&apos;s retiring early, building a legacy, or simply having peace of mind,
                    we&apos;re here to help you make the most of every moment.
                  </p>
                </FadeInUp>
                <FadeInUp delay={0.4}>
                  <p>
                    Our approach is personal, transparent, and rooted in building long-term
                    relationships. We take the time to understand your unique circumstances
                    before making any recommendations.
                  </p>
                </FadeInUp>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-navy mb-6">Our Philosophy</h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-navy-lighter leading-relaxed mb-4">
              Time is our most valuable and finite resource. At Kron, we help you make
              the most of both your time and your money. We believe that with the right
              financial strategy, you can focus on what truly matters to you.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-lg text-navy-lighter leading-relaxed mb-10">
              We are dedicated to providing clear, straightforward advice that puts your
              interests first. Our commitment is to build lasting relationships based on
              trust, transparency, and results.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#approach"
                className="inline-block px-6 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy-light transition-colors"
              >
                Our Approach
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
