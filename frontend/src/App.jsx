import { Routes, Route } from 'react-router-dom'
import Work from './pages/Work'
import About from './pages/About'
import Play from './pages/Play'
import Contact from './pages/Contact'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Work />} />
      <Route path="/about" element={<About />} />
      <Route path="/play" element={<Play />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}
