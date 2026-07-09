/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER.JSX — Page Footer Component

   This component displays at the bottom of every page.
   It shows:
   - A motivational headline (on work page only)
   - A personal message and call-to-action
   - Last update date
   - Live visitor counter from backend

   The footer is reusable across all pages but can optionally show a headline.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import state management and side effects hooks */
import { useState, useEffect } from 'react'

/* Main Footer component */
/* Props: showHeadline (boolean) - whether to show the "more on the way" headline */
export default function Footer({ showHeadline = false }) {
  /* State for storing visitor count from backend API */
  /* null = loading state, number = actual count from server */
  const [visitorCount, setVisitorCount] = useState(null)

  /* ─── FETCH VISITOR COUNT FROM BACKEND ─── */
  /* This useEffect runs once when component loads (empty dependency array []) */
  /* It makes an API request to get the number of site visitors */
  useEffect(() => {
    /* Fetch visitor count from backend API endpoint */
    /* '/api/visit' = server endpoint that returns { count: number } */
    fetch('/api/visit')
      .then(r => r.json()) /* Convert response to JSON */
      .then(data => setVisitorCount(data.count)) /* Store count in state */
      .catch(() => {}) /* Silently fail if API is down (don't show errors) */
  }, []) /* Empty array = run only once on component mount */

  /* ─────────────────────────────────────────────────────────────────────
     RENDER FOOTER
     ───────────────────────────────────────────────────────────────────── */
  return (
    /* Footer semantic HTML element */
    /* className="site-footer work-footer" = CSS classes for styling */
    /* site-footer = shared styles for all footers */
    /* work-footer = work page specific footer styles */
    <footer className="site-footer work-footer">

      {/* Conditional headline: only shows on work page (showHeadline={true}) */}
      {/* className="work-footer__headline" = large decorative text styling */}
      {/* TO CHANGE: Edit text "more on the way" to different message */}
      {/* TO CHANGE: Set showHeadline={false} in Work.jsx to hide on other pages */}

      {/* Footer metadata container - two halves */}
      <div className="work-footer__meta">

        {/* Left half */}
        <div className="work-footer__left">
          {/* Personal message and CTA */}
          <span>LinkedIn</span>
          <span>GitHub</span>
          <span>Mail</span>
          
        </div>

        {/* Right half */}
        <div className="work-footer__right">
          {/* Sign-off message */}
          <span>Thanks for visiting ❤︎</span>
          {/* Visitor counter */}
          <span className="teal">You are visitor # {visitorCount ?? '...'}</span>
          {/* Last update date */}
          <span>Last updated: 05 01 26</span>
        </div>

      </div>

    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW TO USE THIS COMPONENT:

   1. ON WORK PAGE (show headline):
      <Footer showHeadline={true} />

   2. ON OTHER PAGES (no headline):
      <Footer showHeadline={false} />
      OR just: <Footer /> (defaults to false)

   3. STYLING:
      Edit contact.css for footer styles

   CUSTOMIZATION OPTIONS:
   - Change personal message (line 50)
   - Change sign-off text (line 54)
   - Update last updated date (line 58)
   - Change "VISITOR #" label (line 62)
   - Hide visitor counter by removing line 62
   ═══════════════════════════════════════════════════════════════════════════ */
