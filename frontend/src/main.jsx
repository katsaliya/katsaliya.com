/* ═══════════════════════════════════════════════════════════════════════════
   MAIN.JSX — Application Entry Point

   This is the very first file that runs when the browser loads the site.
   It imports React, sets up the app, loads global styles, and renders everything to the page.

   Think of it as the "launch button" for the entire website.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import React library (required for JSX syntax) */
/* React is the framework that powers this entire website */
import React from 'react'

/* Import ReactDOM which connects React components to the HTML page */
/* createRoot is the method that mounts our app to the DOM */
import ReactDOM from 'react-dom/client'

/* Import BrowserRouter from React Router */
/* BrowserRouter enables page navigation between /work, /about, /bluecore, etc. */
/* without reloading the entire page (fast transitions) */
import { BrowserRouter } from 'react-router-dom'

/* Import the main App component */
/* App.jsx contains the page routing logic and renders different pages */
import App from './App'

/* Import global CSS styles */
/* shared.css contains styles used across ALL pages (nav, footer, colors, fonts, etc.) */
/* This file must load first so page-specific CSS can override it if needed */
import './styles/shared.css'

/* Tailwind (utilities only, no Preflight) — scoped in practice to the new
   Work-carousel/Home/About pages; the rest of the site stays plain CSS. */
import './styles/tailwind.css'

/* ─────────────────────────────────────────────────────────────────────────
   MOUNT THE APP TO THE HTML PAGE
   ───────────────────────────────────────────────────────────────────────── */

/* Find the <div id="root"></div> in index.html and render the app there */
/* ReactDOM.createRoot() = create a React application container */
/* document.getElementById('root') = find the target element in HTML */
ReactDOM.createRoot(document.getElementById('root')).render(
  /* React.StrictMode wraps the app to catch potential bugs during development */
  /* It adds extra checks and warnings in development (doesn't affect production) */
  <React.StrictMode>
    {/* BrowserRouter enables routing (URL changes, page navigation) */}
    {/* Everything inside BrowserRouter can use React Router features like Link */}
    <BrowserRouter>
      {/* App component: the main application */}
      {/* This contains all the routes and pages for the entire website */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

/* ═══════════════════════════════════════════════════════════════════════════
   WHAT HAPPENS WHEN YOU LOAD THE SITE:

   1. Browser loads index.html
   2. main.jsx runs (this file)
   3. React initializes and renders the App component
   4. BrowserRouter sets up page routing
   5. shared.css loads global styles
   6. App.jsx renders the current page based on the URL
   7. The website is now interactive!
   ═══════════════════════════════════════════════════════════════════════════ */
