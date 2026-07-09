/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION COMPONENT — Global navbar that appears on every page
   Handles page routing and displays different nav script text on different pages
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import Link component from React Router for page navigation */
/* Link is better than <a> tags because it doesn't reload the page (fast transitions) */
import { Link, useLocation } from 'react-router-dom'

/* Main Navigation component */
/* This component renders the navbar that appears at the top of every page */
export default function Nav({ scriptRef }) {
  /* useLocation hook from React Router tells us which page we're on */
  /* Returns an object with pathname like "/" or "/about" or "/bluecore" */
  const { pathname } = useLocation()

  /* Render the navigation bar */
  return (
    /* <nav> = semantic HTML element for navigation (good for accessibility) */
    /* className="main-nav" = CSS class for styling (shared.css) */
    /* id="mainNav" = unique identifier for JavaScript to find this element */
    <nav className="main-nav" id="mainNav">

      {/* ─── NAV LINKS: WORK/ABOUT/PLAY/CONTACT on right side ─── */}
      {/* Container for the navigation links */}
      {/* className="nav-links" = CSS styling (styled in shared.css) */}
      <div className="nav-links">

        {/* WORK LINK */}
        {/* Link to home/work page */}
        {/* to="/" = navigate to work page (home page, "/" is the home path) */}
        {/* className={...} = conditionally add "active" class if we're on this page */}
        {/* className={pathname === '/' ? 'active' : ''} = if pathname is "/", add "active" class */}
        {/* The "active" class makes the link appear in teal color (styled in shared.css) */}
        {/* TO CHANGE: Replace text "WORK" with different label (e.g., "HOME", "PORTFOLIO") */}
        <Link to="/" className={pathname === '/' ? 'active' : ''}>
          WORK
        </Link>

        {/* ABOUT LINK */}
        {/* Link to about page */}
        {/* to="/about" = navigate to about page */}
        {/* Add "active" class if pathname is "/about" */}
        {/* TO CHANGE: Replace text "ABOUT" with different label (e.g., "ABOUT ME", "BIO") */}
        <Link to="/about" className={pathname === '/about' ? 'active' : ''}>
          ABOUT
        </Link>

        {/* PLAY LINK */}
        {/* Link to play/experimental page */}
        {/* to="/play" = navigate to play page */}
        {/* Add "active" class if pathname is "/play" */}
        {/* TO CHANGE: Replace text "PLAY" with different label (e.g., "EXPERIMENTS", "PROJECTS") */}
        <Link to="/play" className={pathname === '/play' ? 'active' : ''}>
          PLAY
        </Link>

        {/* CONTACT LINK */}
        {/* This is an <a> tag (not Link) because it goes to external email, not a page */}
        {/* href="mailto:..." = opens email client to send email to this address */}
        {/* TO CHANGE: Replace "kataliyasun@gmail.com" with your actual email address */}
        {/* TO CHANGE: Replace text "CONTACT" with different label (e.g., "EMAIL", "REACH OUT") */}
        <a href="mailto:kataliyasun@gmail.com">
          CONTACT
        </a>
      </div>

    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STYLING & CUSTOMIZATION GUIDE
   ═══════════════════════════════════════════════════════════════════════════ */

/* TO STYLE THIS NAVIGATION:

   1. Edit the nav itself (height, background, position):
      Look in shared.css: .main-nav { ... }

   2. Edit the nav links (spacing, font, colors, hover effects):
      Look in shared.css: .nav-links { ... } and .nav-links a { ... }

   COMMON CHANGES:

   - Change nav background color: In shared.css, .main-nav { background: ... }

   - Make nav taller/shorter: In shared.css, .main-nav { height: 60px; } (change 60px)

   - Make nav links bigger: In shared.css, .nav-links a { font-size: 1.2rem; } (change size)

   - Add nav links spacing: In shared.css, .nav-links { gap: 3rem; } (increase gap value)

   - Change active link color: In shared.css, .nav-links a.active { color: red; } (change color)

*/
