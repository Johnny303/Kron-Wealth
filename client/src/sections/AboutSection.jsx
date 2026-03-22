import { FadeInUp, WidthGrow, ParallaxLayer } from '../components/ScrollAnimations'

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">
      {/* Founder section */}
      <div className="py-16 px-5 md:py-24 md:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInUp>
            <h2 className="font-display text-7xl md:text-8xl font-medium text-kron-green text-center mb-4">
              About Us
            </h2>
            <p className="text-lg text-kron-brown text-center mb-16">
              Getting to know Kron Wealth
            </p>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Founder headshot — full-width on mobile, sticky on desktop */}
            <div className="flex justify-center md:sticky md:top-24">
              <ParallaxLayer speed={0.15} className="flex justify-center w-full">
                <div className="w-full max-w-xs md:w-72 md:h-72 aspect-square rounded-2xl bg-kron-brown flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              </ParallaxLayer>
            </div>

            <div>
              <FadeInUp delay={0.1}>
                <div className="inline-block mb-8">
                  <h3 className="text-3xl font-bold text-kron-green mb-2">A Word from Our Founder</h3>
                  <WidthGrow className="w-full h-1 bg-kron-gold" delay={0.2} />
                </div>
              </FadeInUp>
              <div className="space-y-4 text-kron-brown leading-relaxed">
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
      <div id="philosophy" className="bg-kron-mist py-16 px-5 md:py-24 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h3 className="text-3xl font-bold text-kron-green mb-6">Our Philosophy</h3>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-lg text-kron-brown leading-relaxed mb-4">
              Time is our most valuable and finite resource. At Kron, we help you make
              the most of both your time and your money. We believe that with the right
              financial strategy, you can focus on what truly matters to you.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-lg text-kron-brown leading-relaxed mb-10">
              We are dedicated to providing clear, straightforward advice that puts your
              interests first. Our commitment is to build lasting relationships based on
              trust, transparency, and results.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#approach"
                className="inline-block px-6 py-3 min-h-[48px] bg-kron-green text-white font-medium rounded-lg hover:bg-kron-brown transition-colors text-center flex items-center justify-center"
              >
                Our Approach
              </a>
              <a
                href="#contact"
                className="inline-block px-6 py-3 min-h-[48px] border border-kron-green text-kron-green font-medium rounded-lg hover:bg-kron-green hover:text-white transition-colors text-center flex items-center justify-center"
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
