import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white tracking-wider mb-4">
              KRON<span className="text-gold">.</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Strategic Financial Consultancy and Wealth Management. Helping you
              make the most of your time and money.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <a href="/#hero" className="text-sm hover:text-white transition-colors">Home</a>
              <a href="/#about" className="text-sm hover:text-white transition-colors">About Us</a>
              <a href="/#approach" className="text-sm hover:text-white transition-colors">Our Approach</a>
              <a href="/#services" className="text-sm hover:text-white transition-colors">Services</a>
              <a href="/#contact" className="text-sm hover:text-white transition-colors">Get in Touch</a>
              <Link to="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:Hello@kron.uk" className="hover:text-white transition-colors">
                Hello@kron.uk
              </a>
              <a href="tel:02071736544" className="hover:text-white transition-colors">
                0207 173 6544
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-xs text-white/40">
          <p className="mb-2">
            Kron Wealth Ltd is an appointed representative of Quilter Wealth Limited and Quilter Mortgage Planning Limited,
            which are authorised and regulated by the Financial Conduct Authority.
          </p>
          <p>&copy; {new Date().getFullYear()} Kron Wealth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
