/* ═══════════════════════════════════════════════════════════════════════════
   APP.JSX — Main Application Router & Setup

   This is the central hub of the entire website.
   It defines:
   - What pages exist (routes like /work, /about, /contact)
   - Which page component loads for each URL
   - Smooth scrolling behavior across all pages

   Think of it as the "navigation map" of the site.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import useEffect hook for running code on component load */
/* We use this to set up smooth scrolling when the app first loads */
import { useEffect } from 'react'

/* Import Routes and Route from React Router */
/* Routes = container for all page routes */
/* Route = individual page mapping (URL path → component) */
import { Routes, Route } from 'react-router-dom'

/* Import Lenis library for smooth scrolling */
/* Lenis provides smooth, physics-based scrolling animation */
/* This makes scrolling feel premium and polished instead of jerky */
import Lenis from 'lenis'

/* ─── IMPORT ALL PAGE COMPONENTS ─── */
/* Each import loads a different page that users can navigate to */

/* Work page (home/portfolio page) */
import Work from './pages/Work'

/* About page (biography/background) */
import About from './pages/About'

/* Play page (experiments/creative projects) */
import Play from './pages/Play'

/* Contact page (email/contact form) */
import Contact from './pages/Contact'

/* Bluecore case study page */
import Bluecore from './pages/Bluecore'

/* Known case study page */
import Known from './pages/Known'

/* Floating social bubble (draggable, expandable) */
import FloatingSocialBubble from './components/FloatingSocialBubble'

/* ─────────────────────────────────────────────────────────────────────────
   MAIN APP COMPONENT
   ───────────────────────────────────────────────────────────────────────── */

export default function App() {
  /* ─── SMOOTH SCROLLING SETUP ─── */
  /* This useEffect runs ONCE when the app first loads (empty dependency array []) */
  /* It initializes Lenis smooth scrolling for the entire site */
  useEffect(() => {
    /* Create a Lenis instance (smooth scrolling controller) */
    /* Lenis handles all the physics and animation for smooth scrolling */
    const lenis = new Lenis({
      /* Scroll duration in seconds */
      /* 1.2 = each scroll animation takes 1.2 seconds */
      /* TO CHANGE: Increase to 1.5 for slower/longer scrolling, decrease to 0.8 for faster */
      duration: 1.2,

      /* Easing function controls how scroll accelerates/decelerates */
      /* This specific function: starts slow, speeds up, then slows down at end */
      /* Creates a natural "ease in-out" motion that feels smooth */
      /* TO CHANGE: Can't easily change without understanding easing functions */
      /* Leave this as-is unless you really know easing curves */
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      /* Direction of scrolling */
      /* 'vertical' = only scrolls up/down (normal) */
      /* TO CHANGE: Would need 'horizontal' for sideways scroll, but not typical */
      direction: 'vertical',

      /* Direction of gesture (touchscreen swipes) */
      /* Same as direction above for consistency */
      gestureDirection: 'vertical',

      /* Enable smooth scrolling on all devices */
      /* true = smooth scrolling is ON */
      /* TO CHANGE: Set to false to turn off smooth scrolling entirely */
      smooth: true,

      /* Enable smooth scrolling on touch devices (mobile) */
      /* false = on mobile, scrolling is normal (not smooth) */
      /* This is because smooth scrolling can feel laggy on some mobile devices */
      /* TO CHANGE: Set to true to force smooth scrolling on mobile (might feel sluggish) */
      smoothTouch: false,

      /* Multiplier for touch scrolling speed */
      /* 2 = touchscreen scrolls 2x faster than the easing suggests */
      /* Makes touch scrolling feel more responsive to finger movement */
      /* TO CHANGE: Increase to 3 for faster mobile scrolling, decrease to 1.5 for slower */
      touchMultiplier: 2,
    })

    /* Set up animation loop for Lenis */
    /* requestAnimationFrame calls raf function before each screen refresh */
    /* This keeps Lenis smooth scrolling synchronized with screen refreshes */
    function raf(time) {
      /* Update Lenis with current frame time */
      /* Lenis calculates smooth scroll position for this frame */
      lenis.raf(time)

      /* Queue up the next animation frame */
      /* This creates a continuous loop while the page is scrolled */
      requestAnimationFrame(raf)
    }

    /* Start the animation loop */
    requestAnimationFrame(raf)

    /* Cleanup function: runs when component unmounts (user leaves page) */
    /* This prevents memory leaks and stops unnecessary animations */
    return () => {
      /* Destroy Lenis instance and clean up resources */
      lenis.destroy()
    }
  }, []) /* Empty dependency array = run only once on mount */

  /* ─────────────────────────────────────────────────────────────────────
     PAGE ROUTING (URL ↔ PAGE MAPPING)
     ───────────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Floating social bubble on all pages */}
      <FloatingSocialBubble />

      {/* Routes container: holds all page route definitions */}
      <Routes>

        {/* Home page / Work page (portfolio) */}
        {/* path="/" = when URL is "katsaliya.com/" (root) */}
        {/* element={<Work />} = render the Work component */}
        {/* This is the landing page users see first */}
        {/* TO CHANGE: Replace <Work /> with different component to change home page */}
        <Route path="/" element={<Work />} />

      {/* About page */}
      {/* path="/about" = when URL is "katsaliya.com/about" */}
      {/* element={<About />} = render the About component */}
      {/* TO CHANGE: Replace <About /> with different component */}
      <Route path="/about" element={<About />} />

      {/* Play / Experiments page */}
      {/* path="/play" = when URL is "katsaliya.com/play" */}
      {/* element={<Play />} = render the Play component */}
      {/* Used for creative/experimental projects */}
      {/* TO CHANGE: Replace <Play /> with different component */}
      <Route path="/play" element={<Play />} />

      {/* Contact page */}
      {/* path="/contact" = when URL is "katsaliya.com/contact" */}
      {/* element={<Contact />} = render the Contact component */}
      {/* Contains contact form or email info */}
      {/* TO CHANGE: Replace <Contact /> with different component */}
      <Route path="/contact" element={<Contact />} />

      {/* BlueCore case study page */}
      {/* path="/bluecore" = when URL is "katsaliya.com/bluecore" */}
      {/* element={<Bluecore />} = render the Bluecore case study */}
      {/* Deep dive into the BlueCore project */}
      {/* TO CHANGE: Replace <Bluecore /> with different component */}
      <Route path="/bluecore" element={<Bluecore />} />

      {/* Known case study page */}
      {/* path="/known" = when URL is "katsaliya.com/known" */}
      {/* element={<Known />} = render the Known case study */}
      {/* Deep dive into the Known project */}
      {/* TO CHANGE: Replace <Known /> with different component */}
      <Route path="/known" element={<Known />} />

        {/* Note: Any URL not listed above (e.g., /invalid-page) will show nothing */}
        {/* TO ADD A PAGE: */}
        {/* 1. Create new file in pages/ folder (e.g., pages/NewPage.jsx) */}
        {/* 2. Import it at top of this file: import NewPage from './pages/NewPage' */}
        {/* 3. Add route here: <Route path="/newpage" element={<NewPage />} /> */}

      </Routes>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW ROUTING WORKS:

   1. User clicks a link (e.g., Link to="/about")
   2. URL changes to /about
   3. React Router detects the URL change
   4. Checks Routes to find matching path="/about"
   5. Renders the <About /> component
   6. Page changes instantly without reloading (fast!)

   ADDING NEW PAGES:
   1. Create new component file (e.g., src/pages/NewPage.jsx)
   2. Import it here
   3. Add new Route: <Route path="/newpage" element={<NewPage />} />
   4. User can now navigate to site.com/newpage
   ═══════════════════════════════════════════════════════════════════════════ */
