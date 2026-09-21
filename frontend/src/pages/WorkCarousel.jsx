/* ═══════════════════════════════════════════════════════════════════════════
   WORKCAROUSEL.JSX — /work page

   Thin page wrapper around the ported ring carousel: sets the page-scoped
   body class (see work-carousel.css) and floats the site Nav on top of the
   WebGL canvas. All the actual carousel logic lives in
   components/WorkCarousel/Carousel.jsx, ported from the Viscose-carousel
   reference — see AGENTS.md in reference/viscose-carousel for how it works.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import Nav from '../components/Nav'
import Carousel from '../components/WorkCarousel/Carousel'
import '../styles/work-carousel.css'

export default function WorkCarousel() {
  useEffect(() => {
    document.body.className = 'page-work-carousel-body'
    return () => { document.body.className = '' }
  }, [])

  return (
    <>
      <Nav />
      <Carousel />
    </>
  )
}
