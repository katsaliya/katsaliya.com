/* ═══════════════════════════════════════════════════════════════════════════
   PLAY.JSX — Experimental/Creative Projects Playground Page

   A fun sandbox space for experimental projects, creative explorations, and
   interactive experiments. Currently shows a "Coming Soon!" placeholder.

   This page has its own visual theme (page-play-body) with play-specific styling.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import useEffect for page setup */
import { useEffect } from 'react'

/* Import global navigation component */
import Nav from '../components/Nav'

/* Import animated social icons sidebar */
import SideSocial from '../components/SideSocial'

/* Import reusable footer component */
import Footer from '../components/Footer'

/* Import page-specific styles */
import '../styles/play.css'

/* Main Play page component */
export default function Play() {
  /* ─── PAGE SETUP ─── */
  /* Add play-specific CSS class to body for unique styling */
  /* Different from other pages (page-light-body) */
  useEffect(() => {
    /* Set page background and theme styles */
    document.body.className = 'page-play-body'

    /* Cleanup: remove class when user leaves page */
    return () => { document.body.className = '' }
  }, [])

  return (
    <>
      {/* Animated social icons sidebar */}
      <SideSocial />

      {/* Main site wrapper */}
      <div className="site-wrapper" id="siteWrapper">
        {/* Page nav-script: K.Sun logo */}
        <div className="page-nav-script">K.Sun</div>

        {/* Global navigation bar */}
        <Nav />

        {/* Main page content */}
        <main className="page page-play" id="page-play">

          {/* Decorative background element */}
          {/* className="play-blush" = CSS-styled decorative div */}
          {/* Used for visual effects in play.css (gradients, shapes, etc.) */}
          <div className="play-blush" />

          {/* Main content container */}
          <div className="play-inner">

            {/* Intro/header section */}
            <div className="play-intro">
              {/* Sandbox welcome message */}
              {/* <br /> creates line break in text */}
              {/* TO CHANGE: Edit text to customize welcome message */}
              <span className="play-sandbox-label">welcome to the<br />sandbox!</span>
            </div>

            {/* Coming Soon placeholder */}
            {/* TO REPLACE: Once content is ready, replace this with actual content */}
            {/* Examples of content that could go here: */}
            {/* - Interactive experiments (canvas, WebGL, animations) */}
            {/* - Side projects and explorations */}
            {/* - Creative coding demos */}
            {/* - Prototypes and playgrounds */}
            <div className="play-coming-soon">Coming Soon!</div>
          </div>

          {/* Page footer */}
          <Footer />
        </main>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW TO ADD CONTENT:

   This page is a placeholder waiting for experimental projects or creative work.

   Option 1: Grid of Project Cards
   - Create reusable ProjectCard component
   - Map over projects array
   - Style with grid layout in play.css

   Option 2: Interactive Canvas/WebGL Demo
   - Create Canvas element
   - Initialize with animation library
   - Add refs and useEffect for rendering

   Option 3: Embed CodePen/Observable Notebooks
   - Create ProjectFrame component
   - Embed iframes with aspect-ratio preservation
   - Style with gallery layout

   CUSTOMIZATION:

   - Change welcome text: Edit "welcome to the sandbox!" text
   - Add background effects: Edit .play-blush CSS styles
   - Change coming soon message: Edit "Coming Soon!" text
   - Add page-specific styles: Edit play.css
   ═══════════════════════════════════════════════════════════════════════════ */
