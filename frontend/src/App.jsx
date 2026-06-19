import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Work from './pages/Work'
import About from './pages/About'
import Play from './pages/Play'
import Contact from './pages/Contact'
import Bluecore from './pages/Bluecore'
import Known from './pages/Known'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Work />} />
      <Route path="/about" element={<About />} />
      <Route path="/play" element={<Play />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bluecore" element={<Bluecore />} />
      <Route path="/known" element={<Known />} />
    </Routes>
  )
}
