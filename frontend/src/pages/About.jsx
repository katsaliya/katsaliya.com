/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT.JSX — About/Bio Page

   Personal biography page with draggable photo elements.
   Photos can be clicked and dragged around the page by the user.

   Features:
   - Two main sections: "How I Got Here" and "What I've Been Up To"
   - Draggable photo gallery that users can rearrange
   - Inline colored links for visual storytelling
   - Personal narrative with professional background
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import React hooks for state and lifecycle management */
import { useEffect, useRef, useCallback } from 'react'

/* Import global navigation component */
import Nav from '../components/Nav'

/* Import animated social icons sidebar */
import SideSocial from '../components/SideSocial'

/* Import reusable footer component */
import Footer from '../components/Footer'

/* Import page-specific styles */
import '../styles/about.css'

/* Main About page component */
export default function About() {
  /* ─── DRAGGABLE PHOTO STATE ─── */
  /* Reference to store active drag state while dragging photos */
  /* Stores element ref, mouse start position, initial element position */
  const dragRef = useRef(null)

  /* ─── PAGE SETUP ─── */
  /* Add light body styling to this page */
  useEffect(() => {
    document.body.className = 'page-light-body'
    return () => { document.body.className = '' }
  }, [])

  /* ─── DRAG HANDLERS ─── */
  /* Handle mouse down on photos: activate drag mode */
  const onMouseDown = useCallback((e) => {
    /* Get the element being dragged */
    const el = e.currentTarget
    e.preventDefault()

    /* Get parent container position (for relative positioning) */
    const parent = el.offsetParent
    const rect = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()

    /* Calculate element's initial position relative to parent */
    const initLeft = rect.left - parentRect.left
    const initTop = rect.top - parentRect.top

    /* Switch to absolute positioning so element can move freely */
    el.style.left = `${initLeft}px`
    el.style.top = `${initTop}px`
    el.style.right = 'auto'
    el.style.transform = 'none'

    /* Bring to front while dragging */
    el.style.zIndex = '200'

    /* Change cursor to indicate grabbing */
    el.style.cursor = 'grabbing'

    /* Store drag state: element, initial mouse position, initial element position */
    dragRef.current = { el, startX: e.clientX, startY: e.clientY, initLeft, initTop }
  }, [])

  /* Handle mouse move: update photo position while dragging */
  const onMouseMove = useCallback((e) => {
    /* Exit if not currently dragging */
    if (!dragRef.current) return

    const { el, startX, startY, initLeft, initTop } = dragRef.current

    /* Calculate how far mouse has moved and apply to element */
    el.style.left = `${initLeft + e.clientX - startX}px`
    el.style.top = `${initTop + e.clientY - startY}px`
  }, [])

  /* Handle mouse up: deactivate drag mode */
  const onMouseUp = useCallback(() => {
    if (!dragRef.current) return

    /* Reset z-index and cursor */
    dragRef.current.el.style.zIndex = ''
    dragRef.current.el.style.cursor = 'grab'

    /* Clear drag state */
    dragRef.current = null
  }, [])

  /* ─── ATTACH GLOBAL DRAG LISTENERS ─── */
  /* Listen to mouse move/up anywhere on page (not just on photo) */
  /* This allows smooth dragging even when mouse moves fast */
  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    /* Cleanup: remove listeners when component unmounts */
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  /* ─── DRAG PROPS ─── */
  /* Props to attach to draggable elements (photos) */
  const dragProps = { onMouseDown, draggable: false }

  /* ─────────────────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Animated social icons sidebar (visible on all pages) */}
      <SideSocial />

      {/* Main site wrapper */}
      <div className="site-wrapper" id="siteWrapper">
        {/* Page nav-script: K.Sun logo */}
        <div className="page-nav-script">K.Sun</div>

        {/* Global navigation bar */}
        <Nav />

        {/* Main page content */}
        <main className="page page-about" id="page-about">
          <div className="about-body">

            {/* ─── ABOUT TEXT SECTIONS ─── */}
            <div className="about-text">

              {/* SECTION 1: "How I Got Here" */}
              {/* Personal story about upbringing and background */}
              <div className="about-section">

                {/* Draggable photo in section */}
                {/* className="about-photo-item ph-g" = positioned via CSS */}
                {/* {...dragProps} = attach click-drag handlers */}
                {/* TO CHANGE: Replace src with different image */}
                <img
                  className="about-photo-item ph-g"
                  src="/images/about/photo-g.png"
                  alt=""
                  {...dragProps}
                />

                {/* Section heading */}
                {/* TO CHANGE: Edit to different section title */}
                <div className="about-section-heading">HOW I GOT HERE</div>

                {/* Main biography text */}
                {/* Contains colored inline links for visual storytelling */}
                {/* Each <a> tag has style={{ color: '#COLOR' }} for inline coloring */}
                {/* TO CHANGE: Edit biography text, update link colors, add/remove links */}
                <p className="about-section-body">
                  I grew up in the kitchen of <a href="https://www.emporiumthaimarket.com" target="_blank" rel="noopener noreferrer" style={{ color: '#B40000' }}>Emporium Thai</a> in
                  Los Angeles — my Thai-Chinese immigrant parent's restaurant, and by our very unbiased opinion, <a style={{ color: '#D19600' }}> the best Thai
                  restaurant in the world.</a> Between <a style={{ color: '#B70FFF' }}>tables 4 and 16</a> is where I practiced my competitive <a style={{ color: '#00DBA8'}}>dance </a>
                  numbers. I'd walk past the line of delivery drivers on my way to <a style={{color: '#0115EC'}}>swim</a> practice four times a week and come back to pack their orders
                  at the door. That upbringing — <a style={{color: '#FF75ED'}}>between cultures, languages, and creative
                  worlds</a> — taught me to move fluidly between things, which probably explains why
                  I've never been able to stay in just one lane.<br /><br />
                  I consider myself a creative at heart. It's how I think, communicate, and make
                  sense of the world. I studied abroad in <a style={{color: '#FF0000'}}>Madrid</a> and
                  <a style={{color:'#9500FF'}}> Seoul</a>, and am soon graduating
                  with dual degrees in <a style={{color: '#FFA600'}}>Computer Science</a> and <a style={{color: '#FF5500'}}>Marketing</a> from San Francisco State
                  University — somewhere along the way falling deep into the overlap between
                  <a style={{color: 'var(--teal'}}> technology, design, and people.</a>
                </p>
              </div>

              {/* SECTION 2: "What I've Been Up To" */}
              {/* Current work and projects */}
              <div className="about-section">

                {/* Section heading */}
                <div className="about-section-heading">WHAT I'VE BEEN UP TO</div>

                {/* Current activities and work experience */}
                {/* Each paragraph has links to relevant sites/profiles */}
                {/* TO CHANGE: Update with current projects, roles, social links */}
                <p className="about-section-body">
                  Researching and designing at <a href="https://sugar-network.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>SUGAR Network</a> — across San Francisco and Paris.<br />
                  <br />Wrapping up my final projects before I walk across that stage at <a href="https://cose.sfsu.edu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>San Francisco State University</a> (ahhh!)<br /><br />
                  Somewhere between another job application and a full night's sleep!<br /><br />
                  Romanticizing it all — with a side of dance break — on <a href="https://www.tiktok.com/@katsaliya" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>TikTok</a><br /><br />
                  For more details, checkout my <a href="https://www.linkedin.com/in/katsaliya/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>LinkedIn</a><br /><br />
                  I love working with and learning from people who are deeply passionate about
                  what they make — and San Francisco has not disappointed. Always feel free to
                  reach out — for projects, collabs, cool ideas, or just coffee<br /><br />
                  <a style={{color:'var(--teal)'}}>K☆</a>
                </p>
              </div>
            </div>

            {/* ─── DRAGGABLE PHOTO GALLERY ─── */}
            {/* Container with absolutely positioned draggable photos */}
            {/* Photos can be clicked and dragged around by the user */}
            <div className="about-photos">

              {/* Each photo is draggable */}
              {/* className="about-photo-item ph-X" = CSS positioning for layout */}
              {/* {...dragProps} = attach drag event handlers */}
              {/* TO ADD: Add more photos with new src and className */}
              {/* TO CHANGE: Update src paths to different image files */}

              <img className="about-photo-item ph-a" src="/images/about/photo-c.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-b" src="/images/about/photo-e.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-c" src="/images/about/photo-i.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-d" src="/images/about/photo-h.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-e" src="/images/about/photo-d.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-f" src="/images/about/photo-f.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-h" src="/images/about/photo-a.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-i" src="/images/about/photo-b.png" alt="" {...dragProps} />
            </div>

          </div>

          {/* Page footer */}
          <Footer />
        </main>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW THE DRAG SYSTEM WORKS:

   1. User clicks a photo → onMouseDown fires
   2. Element switches to absolute positioning
   3. Element z-index raised to 200 (visible on top)
   4. Cursor changes to "grabbing"
   5. Mouse position is stored in dragRef

   6. User moves mouse → onMouseMove fires (globally)
   7. Element position updates: initPos + (currentMouse - startMouse)
   8. Element follows cursor smoothly

   9. User releases mouse → onMouseUp fires
   10. Element z-index reset to normal
   11. Cursor changes back to "grab"
   12. dragRef cleared (drag state ends)

   CUSTOMIZATION:

   - Add more draggable elements: Add <img {...dragProps} /> for new elements
   - Change drag appearance: Edit CSS .about-photo-item classes
   - Disable drag for specific elements: Remove {...dragProps} prop
   - Change cursor: Edit cursor: 'grab' and cursor: 'grabbing' in handlers
   - Add snap-to-grid: Modify onMouseMove to round positions to grid
   - Add animations: Add transition CSS to photos (except while dragging)
   ═══════════════════════════════════════════════════════════════════════════ */
