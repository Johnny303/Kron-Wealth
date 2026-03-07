export default function PrivacyPolicy() {
  return (
    <>
      <section className="bg-navy py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <div className="space-y-8 text-navy-lighter leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Introduction</h2>
              <p>
                Kron Wealth Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting
                and respecting your privacy. This policy sets out the basis on which any personal
                data we collect from you, or that you provide to us, will be processed by us.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Information We Collect</h2>
              <p>We may collect and process the following data about you:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Information you give us via our contact form (name, email, phone number, message)</li>
                <li>Information about your visits to our website (IP address, browser type, pages visited)</li>
                <li>Any other information you choose to send to us</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-3">How We Use Your Information</h2>
              <p>We use information held about you to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your enquiries and provide the services you request</li>
                <li>Provide you with information about our services</li>
                <li>Ensure that content from our site is presented effectively</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Data Security</h2>
              <p>
                We are committed to ensuring that your information is secure. We have put in place
                suitable physical, electronic and managerial procedures to safeguard and secure
                the information we collect online.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Your Rights</h2>
              <p>
                You have the right to request access to, correction of, or deletion of your
                personal data. You also have the right to object to processing and to data
                portability. To exercise any of these rights, please contact us at{' '}
                <a href="mailto:Hello@kron.uk" className="text-emerald hover:underline">
                  Hello@kron.uk
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Contact</h2>
              <p>
                Questions, comments and requests regarding this privacy policy should be addressed
                to{' '}
                <a href="mailto:Hello@kron.uk" className="text-emerald hover:underline">
                  Hello@kron.uk
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
