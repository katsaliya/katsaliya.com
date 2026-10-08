/* ═══════════════════════════════════════════════════════════════════════════
   WORKCAROUSEL.JSX — /work page

   Thin page wrapper around the ported ring carousel: sets the page-scoped
   body class (see work-carousel.css), floats the site Nav on top of the
   WebGL canvas, and owns what a card click DOES. The ring itself only
   reports that a card already at the front was clicked; whether that is a
   route or a "not yet" is a page-level question, so it is answered here.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Carousel from '../components/WorkCarousel/Carousel'
import '../styles/work-carousel.css'

const FONT = "'DM Sans', sans-serif"

export default function WorkCarousel() {
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const hideTimer = useRef(null)
  const dropTimer = useRef(null)

  useEffect(() => {
    document.body.className = 'page-work-carousel-body'
    return () => {
      document.body.className = ''
      clearTimeout(hideTimer.current)
      clearTimeout(dropTimer.current)
    }
  }, [])

  /* The same two-phase show the Selected work cards use: mount the node at
     its resting state, then flip data-open on the next frame so the
     transition has something to run from. Setting both in one go gives the
     browser no start state and the note simply appears. */
  const handleOpen = (project, e) => {
    if (project.href) {
      navigate(project.href)
      return
    }
    clearTimeout(hideTimer.current)
    clearTimeout(dropTimer.current)
    const PAD = 14
    setNote({
      x: Math.min((e?.clientX ?? window.innerWidth / 2) + 18, window.innerWidth - 170 - PAD),
      y: Math.min((e?.clientY ?? window.innerHeight / 2) + 20, window.innerHeight - 52 - PAD),
    })
    setNoteOpen(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setNoteOpen(true)))
    hideTimer.current = setTimeout(() => {
      setNoteOpen(false)
      dropTimer.current = setTimeout(() => setNote(null), 220)
    }, 1600)
  }

  return (
    <>
      <Nav />
      <Carousel onOpen={handleOpen} />
      {note &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            data-open={noteOpen ? 'true' : 'false'}
            className="sw-note fixed z-[90] pointer-events-none select-none rounded-full px-4 py-2 text-[13px] leading-none whitespace-nowrap"
            style={{ left: note.x, top: note.y, fontFamily: FONT, fontWeight: 500 }}
          >
            Coming soon
          </div>,
          document.body,
        )}
    </>
  )
}
