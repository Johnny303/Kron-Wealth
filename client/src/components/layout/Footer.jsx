import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white text-kron-brown/70">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <img
              src={`${import.meta.env.BASE_URL}images/kron-logo-full.png`}
              alt="Kron Wealth"
              className="h-16 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed">
              Strategic Financial Consultancy and Wealth Management. Helping you
              make the most of your time and money.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-kron-green uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-1 md:gap-2">
              <a href="/#hero" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">Home</a>
              <a href="/#about" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">About Us</a>
              <a href="/#approach" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">Our Approach</a>
              <a href="/#services" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">Services</a>
              <a href="/#contact" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">Get in Touch</a>
              <Link to="/privacy" className="text-sm hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">Privacy Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-kron-green uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-1 md:gap-2 text-sm">
              <a href="mailto:Hello@kron.uk" className="hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">
                Hello@kron.uk
              </a>
              <a href="tel:02071736544" className="hover:text-kron-green transition-colors py-2 md:py-0 min-h-[44px] md:min-h-0 flex items-center">
                0207 173 6544
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-8 border-t border-kron-brown/10 text-xs text-kron-brown/40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <p className="mb-2">
            Kron Wealth Ltd is an appointed representative of Quilter Wealth Limited and Quilter Mortgage Planning Limited,
            which are authorised and regulated by the Financial Conduct Authority.
          </p>
          <p>&copy; {new Date().getFullYear()} Kron Wealth. All rights reserved.</p>
        </div>
      </div>

      {/* Spacer for mobile bottom nav bar */}
      <div className="md:hidden h-14" />
    </footer>
  )
}
