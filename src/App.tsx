import Nav from './components/Nav'
import Hero from './components/Hero'
import DayTimeline from './components/DayTimeline'
import Features from './components/Features'
import Stats from './components/Stats'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ParticleField from './components/ParticleField'

export default function App() {
  return (
    <div className="grain relative min-h-screen">
      <ParticleField />
      <Nav />
      <main>
        <Hero />
        <DayTimeline />
        <Features />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
