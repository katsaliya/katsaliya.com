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

/* GSAP + ScrollTrigger, driven by Lenis's ticker rather than a separate raf
   loop — see the note below. Needed here (not just in the components that
   use ScrollTrigger) because this is where that wiring has to happen once,
   globally. */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── IMPORT ALL PAGE COMPONENTS ─── */
/* Each import loads a different page that users can navigate to */

/* Home page (bio hero) + About (scrolled-into section of the same page) */
import Home from './pages/Home'

/* Play page (experiments/creative projects) */
import Play from './pages/Play'

/* Contact page (email/contact form) */
import Contact from './pages/Contact'

/* Bluecore case study page */
import Bluecore from './pages/Bluecore'

/* Known case study page */
import Known from './pages/Known'

/* Work carousel page — the ring, ported from the Viscose-carousel reference */
import WorkCarousel from './pages/WorkCarousel'

/* The chalky-edge SVG filter, mounted once here rather than inside any one
   page: an SVG filter id is document-global, and the elements referencing it
   (Home's hero name, the nav wordmark, the Disciplines marquee) sit in
   different components. See components/ChalkTexture.jsx. */
import ChalkTexture from './components/ChalkTexture'
import GlassLens from './components/GlassLens'

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

    /* Lenis is a virtual/JS-driven scroller — it doesn't move window.scrollY
       via the browser's native scroll mechanism, so GSAP's ScrollTrigger
       (which by default watches the native scroll position) never finds out
       a scroll happened unless the two are explicitly wired together. This
       is GSAP's own documented integration pattern for Lenis:
         - Lenis's per-frame update rides GSAP's ticker instead of its own
           requestAnimationFrame loop, so both stay on the same clock.
         - Every Lenis 'scroll' event tells ScrollTrigger to recalculate.
       Skipping this means every ScrollTrigger-based reveal on the site
       (SplitReveal/GhostReveal/ScrollImage, and anything scroll-triggered
       added later) silently never fires, since ScrollTrigger's internal
       scroll position never updates.
       Time is *1000: gsap.ticker hands time in seconds, lenis.raf expects ms.
       Named (not inline) so cleanup can remove this exact function — ticker
       .remove() needs the same reference that was added, not just an
       identical-looking arrow function. */
    const tickLenis = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickLenis)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    /* Exposed so pages can scroll programmatically (e.g. Home.jsx jumping to
       the About section on /about) via lenis.scrollTo() — its own official
       API for this, which updates its internal virtual-scroll state
       correctly. Plain window.scrollTo()/scrollIntoView() get silently
       overridden by Lenis's own per-frame update the next tick, since it
       doesn't know about them. */
    window.__lenis = lenis

    /* Cleanup function: runs when component unmounts (user leaves page) */
    /* This prevents memory leaks and stops unnecessary animations */
    return () => {
      gsap.ticker.remove(tickLenis)
      window.__lenis = null
      /* Destroy Lenis instance and clean up resources */
      lenis.destroy()
    }
  }, []) /* Empty dependency array = run only once on mount */

  /* ─────────────────────────────────────────────────────────────────────
     PAGE ROUTING (URL ↔ PAGE MAPPING)
     ───────────────────────────────────────────────────────────────────── */

  return (
    <>
      <ChalkTexture />
      <GlassLens />

      {/* Routes container: holds all page route definitions */}
      <Routes>

        {/* Home page — bio hero + About scrolled below it */}
        {/* path="/" = when URL is "katsaliya.com/" (root) */}
        <Route path="/" element={<Home />} />

      {/* Work carousel page — the WebGL ring */}
      {/* path="/work" = when URL is "katsaliya.com/work" */}
      <Route path="/work" element={<WorkCarousel />} />

      {/* About — same component as Home, auto-scrolls to the About section */}
      {/* path="/about" = when URL is "katsaliya.com/about" */}
      <Route path="/about" element={<Home />} />

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
