import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import ApproachSection from '../sections/ApproachSection'
import ServicesSection from '../sections/ServicesSection'
import ContactSection from '../sections/ContactSection'
import ScrollPath from '../components/ScrollPath'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ScrollPath />
      <AboutSection />
      <ApproachSection />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
