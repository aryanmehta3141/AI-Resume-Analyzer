import GlowBackground from './components/ui/GlowBackground'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import UploadSection from './components/sections/UploadSection'
import Features from './components/sections/Features'
import SocialProof from './components/sections/SocialProof'
import FinalCTA from './components/sections/FinalCTA'
import ScrollToTop from './components/ui/ScrollToTop'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlowBackground />
      <Navbar />
      <main>
        <Hero />
        <UploadSection />
        <SocialProof />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
