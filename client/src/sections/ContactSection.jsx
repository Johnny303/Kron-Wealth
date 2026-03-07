import { useState } from 'react'
import { FadeInUp, SlideInLeft, SlideInRight } from '../components/ScrollAnimations'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <section id="contact" className="scroll-mt-16">
      {/* Header */}
      <div className="bg-kron-green py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp>
            <h2 className="font-display text-7xl md:text-8xl font-medium text-white mb-4">Get in Touch</h2>
            <p className="text-lg text-white/60">
              We&apos;d love to hear from you
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <SlideInLeft>
            <div>
              <h3 className="text-2xl font-bold text-kron-green mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-kron-gold/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-kron-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-kron-brown mb-1">Email</p>
                    <a href="mailto:Hello@kron.uk" className="text-kron-green font-medium hover:text-kron-gold transition-colors">
                      Hello@kron.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-kron-gold/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-kron-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-kron-brown mb-1">Phone</p>
                    <a href="tel:02071736544" className="text-kron-green font-medium hover:text-kron-gold transition-colors">
                      0207 173 6544
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-kron-mist border border-kron-sage/30">
                <h4 className="text-lg font-bold text-kron-green mb-2">Book a Consultation</h4>
                <p className="text-sm text-kron-brown leading-relaxed">
                  We offer a complimentary initial consultation to discuss your financial
                  goals and how we might be able to help. Fill in the form and we&apos;ll
                  be in touch to arrange a time.
                </p>
              </div>
            </div>
          </SlideInLeft>

          {/* Contact form */}
          <SlideInRight delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-kron-green mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kron-sage focus:outline-none focus:ring-2 focus:ring-kron-gold/50 focus:border-kron-gold transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-kron-green mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kron-sage focus:outline-none focus:ring-2 focus:ring-kron-gold/50 focus:border-kron-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-kron-green mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kron-sage focus:outline-none focus:ring-2 focus:ring-kron-gold/50 focus:border-kron-gold transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-kron-green mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kron-sage focus:outline-none focus:ring-2 focus:ring-kron-gold/50 focus:border-kron-gold transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-8 py-4 bg-kron-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-kron-gold font-medium text-center">
                  Thank you! We&apos;ll be in touch soon.
                </p>
              )}

              {status === 'error' && (
                <p className="text-red-600 font-medium text-center">
                  {errorMsg || 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}
