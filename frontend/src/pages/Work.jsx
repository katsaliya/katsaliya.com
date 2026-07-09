/* ═══════════════════════════════════════════════════════════════════════════
   WORK PAGE — Main portfolio landing page with hero and project cards
   This file handles the layout, scroll interactions, and card animations
   ═══════════════════════════════════════════════════════════════════════════ */

/* React hooks for state management and DOM manipulation */
import { useEffect, useRef, useState } from 'react'
/* useNavigate allows us to programmatically navigate between pages (e.g., clicking a card) */
import { useNavigate } from 'react-router-dom'
/* createPortal renders elements outside their normal DOM location (for popups) */
import { createPortal } from 'react-dom'
/* Import the global navigation bar component */
import Nav from '../components/Nav'
/* Import the social icons that appear on the side of the page */
import SideSocial from '../components/SideSocial'
/* Import the animated circular logo for the BlueCore card */
import LogoOrb from '../components/LogoOrb'
/* Import the page footer */
import Footer from '../components/Footer'
/* Import custom typewriter hook for hero name animation */
import { useTypewriter } from '../hooks/useTypewriter'
/* Import masonry grid component for Pinterest-style layout */
import MasonryGrid from '../components/MasonryGrid'
/* Import styles specific to this page */
import '../styles/work.css'

/* Main Work page component */
export default function Work() {
  /* useNavigate hook allows us to redirect users to other pages when they click cards */
  const navigate = useNavigate()

  /* useRef creates a reference to the work-stage container (not used currently, but available for future features) */
  const workStageRef = useRef(null)

  /* useRef creates a reference to the work-canvas (not used currently, but available for future features) */
  const workCanvasRef = useRef(null)

  /* useRef creates a reference to the hero section so we can measure when it scrolls out of view */
  const heroRef = useRef(null)

  /* useState manages whether the "coming soon" popup is showing */
  const [showPopup, setShowPopup] = useState(false)

  /* useState stores the x/y position where the user clicked (for popup placement) */
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })

  /* Typewriter animation for hero name - cycles through multiple languages */
  const nameSequence = [
    'Kataliya Sungkamee',  /* English/Latin */
    'แคทลียา สังขมี',      /* Thai */
    '桑卡米卡特兰',           /* Chinese/Cantonese */
  ]
  const { displayText, isPaused } = useTypewriter(nameSequence, {
    typeSpeed: 80,
    deleteSpeed: 50,
    pauseAfterType: 6000,
    pauseAfterDelete: 300,
  })

  /* ─── PAGE SETUP: Run once when component loads ─── */
  useEffect(() => {
    /* Add CSS class to body for page-specific styling (background color, fonts, etc.) */
    document.body.className = 'page-work-body'

    /* Scroll to top of page when user arrives (creates smooth landing experience) */
    window.scrollTo(0, 0)

    /* Cleanup function: remove the CSS class when user leaves the page */
    return () => { document.body.className = '' }
  }, []) /* [] = dependency array = run only once on mount */

  /* ─── CARD ANIMATIONS: Fade in cards as they scroll into view ─── */
  useEffect(() => {
    /* Find all project cards and section labels on the page */
    const els = document.querySelectorAll('.project-card, .row-label')
    /* If no elements found, exit early */
    if (!els.length) return

    /* IntersectionObserver is a browser API that tells us when elements are visible in the viewport */
    const observer = new IntersectionObserver(
      (entries) => {
        /* For each element that just entered or left the viewport */
        entries.forEach((entry) => {
          /* If the element just became visible */
          if (entry.isIntersecting) {
            /* Add "is-visible" class which triggers CSS animation (fade + slide up) */
            entry.target.classList.add('is-visible')
            /* Stop watching this element (one-time animation only) */
            observer.unobserve(entry.target)
          }
        })
      },
      /* Configuration: element must be 8% visible before triggering */
      /* TO CHANGE: increase to 0.2 for earlier trigger, decrease to 0.02 for later trigger */
      { threshold: 0.08 }
    )

    /* Wait 200ms before starting observations (lets hero animation finish first) */
    /* TO CHANGE: 200 = milliseconds delay. Increase for longer delay, decrease for shorter */
    const timer = setTimeout(() => {
      /* Start watching each element for visibility */
      els.forEach((el) => observer.observe(el))
    }, 200)

    /* Cleanup function: cancel the timer and stop watching elements */
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, []) /* [] = dependency array = run only once on mount */

  /* ─── CLICK HANDLERS: Handle user interactions ─── */

  /* When user clicks a "coming soon" card, show popup at click location */
  const handleCardClick = (e) => {
    /* Store the x/y coordinates where user clicked */
    setPopupPos({ x: e.clientX, y: e.clientY })
    /* Show the popup */
    setShowPopup(true)
    /* Hide popup after 1500 milliseconds (1.5 seconds) */
    /* TO CHANGE: adjust time (e.g., 2000 for 2 seconds, 1000 for 1 second) */
    setTimeout(() => setShowPopup(false), 1500)
  }

  /* Navigate to BlueCore case study page when user clicks the card */
  const handleBluecoreClick = () => navigate('/bluecore')

  /* Navigate to Known case study page when user clicks the card */
  const handleKnownClick = () => navigate('/known')

  /* Card data for masonry grid */
  const masonryCards = [
    {
      projectName: 'BLUECORE AI',
      media: '/images/cards/orbcard.mov',
      mediaType: 'video',
      description: `TLDR: AI paperwork automation for the realities of maritime work.\n
      ROLE: Product Designer & Engineer Lead\n
      TIMELINE: Sep 2025 - Jun 2026\n
      COMPANY: Deep Blue Foundation x Paris d.School\n
      ACHIEVEMENTS: `,
      ribbonImage: '/images/case-studies/bluecore-sfhacks-person.png',
      caseStudyLink: '/bluecore',
      handler: handleBluecoreClick,
    },
    {
      projectName: 'KNOWN',
      media: '/images/cards/KnownTV.mp4',
      mediaType: 'video',
      description: `TLDR: A collection of content, marketing materials, and graphics for an AI-matchmaking startup.\n
      ROLE: Growth Intern --> Growth Associate\n
      TIMELINE: Jun 2025 - Oct 2025\n 
      COMPANY: Known`,
      caseStudyLink: '/known',
      handler: handleKnownClick,
    },
    {
      projectName: 'AIDENTITY',
      media: '/images/cards/demo-aidentity.png',
      mediaType: 'image',
      description: `TLDR: Reimagining how immigrant families access legal guidance — built for the communities attorneys can\'t reach.\n
      ROLE: Team Lead & Product Designer\n 
      TIMELINE: Feb 2026 - Jun 2026\n`,
      caseStudyLink: '#',
      handler: handleCardClick,
    },
    {
      projectName: 'EMPORIUM THAI MARKET',
      media: '/images/cards/demo-aidentity.png',
      mediaType: 'image',
      description: `TLDR: Reimagining how immigrant families access legal guidance — built for the communities attorneys can\'t reach.\n
      ROLE: Team Lead & Product Designer\n 
      TIMELINE: Feb 2026 - Jun 2026\n`,
      caseStudyLink: '#',
      handler: handleCardClick,
    },
    {
      projectName: 'KATSALIYA',
      media: '/images/cards/demo-aidentity.png',
      mediaType: 'image',
      description: `TLDR: Reimagining how immigrant families access legal guidance — built for the communities attorneys can\'t reach.\n
      ROLE: Team Lead & Product Designer\n 
      TIMELINE: Feb 2026 - Jun 2026\n`,
      caseStudyLink: '#',
      handler: handleCardClick,
    }
  ]

  /* ─── RETURN: Render the page structure ─── */
  return (
    <>
      {/* Side social icons component (LinkedIn, GitHub, etc.) */}
      <SideSocial />

      {/* Main page wrapper */}
      <div className="site-wrapper">
        {/* Page nav-script: K.Sun logo */}
        <div className="page-nav-script">K.Sun</div>

        {/* Global navigation bar (appears at top on all pages) */}
        <Nav />

        {/* Main page content area */}
        <main className="page page-work" id="page-work">
          {/* Popup that shows "case study coming soon!!" at click location */}
          {/* createPortal renders this outside normal DOM hierarchy (for proper z-index) */}
          {showPopup && createPortal(
            <div className="coming-soon-popup" style={{ left: popupPos.x, top: popupPos.y }}>
              case study coming soon!
            </div>,
            document.body
          )}

          {/* Container for hero section and cards */}
          <div className="work-stage" ref={workStageRef}>
            <div className="work-canvas" ref={workCanvasRef}>

              {/* ═══════════════════════════════════════════
                  HERO SECTION — Large introduction at top of page
                  ═══════════════════════════════════════════ */}
              <div className="face-hero" ref={heroRef}>

                {/* Intro text: "Hello, I'm" */}
                {/* Styled in work.css .work-hero__intro */}
                {/* TO CHANGE: Edit text in quotes below, change CSS for styling
                <p className="work-hero__intro">Hello, I am</p> */}

                {/* Main name heading with typewriter animation */}
                  {/* Cycles through: English → Thai → Chinese → repeat */}
                  {/* Styled in work.css .work-hero__name */}
                  <h1 className="work-hero__name">
                  {/* Visually hidden accessible name for screen readers */}
                  <span className="sr-only">Kataliya Sungkamee</span>

                  {/* Typewriter text with dynamic script switching */}
                  <span
                    className="typewriter-text"
                    data-script={
                      displayText.includes('แค') ? 'thai' :
                      displayText.includes('桑') ? 'chinese' :
                      'latin'
                    }
                  >
                    {displayText}
                  </span>

                  {/* Cursor - solid while typing/deleting, blinking during pauses */}
                  <span className={`typewriter-cursor ${isPaused ? 'blinking' : 'solid'}`} />
                </h1>

                {/* Decorative dashed line under the name */}
                {/* Styled in work.css .work-hero__line (width, border style, margin) */}
                {/* TO CHANGE: Modify CSS border and width for different look 
                <div className="work-hero__line" />*/}

                {/* Container for bio text paragraphs */}
                <div className="work-hero__bios">

                  {/* First bio paragraph: description of what you do */}
                  {/* <em> tags make text italic for emphasis */}
                  {/* Styled in work.css .work-hero__bio */}
                  {/* TO CHANGE: Edit bio text, adjust colors/fonts in CSS */}
                  <p className="work-hero__bio">
                    a multidisciplinary <em>designer, builder, and content creator</em> passionate about creating at the intersection of technology, people, and storytelling.
                  </p>

                  {/* Second bio paragraph: current work/focus */}
                  {/* <span className="teal"> makes text appear in teal accent color */}
                  {/* Styled in work.css .work-hero__bio and .teal */}
                  {/* TO CHANGE: Update company name and role, edit CSS for color */}
                  <p className="work-hero__bio">
                    Driven by user research and aesthetic intention — currently applying both across <span className="teal">content, product, and web at Emporium Thai</span>.
                  </p>
                </div>

                {/* CTA text encouraging visitors to scroll down */}
                {/* 🡓 is an emoji (downward arrow) */}
                {/* Styled in work.css .work-hero__cta */}
                {/* TO CHANGE: Edit text and emoji, adjust color/size in CSS */}
                <p className="work-hero__cta">some things i've been working on 🡓</p>
              </div>

              {/* ═══════════════════════════════════════════
                  PROJECT CARDS SECTION — Pinterest-style masonry layout
                  ═══════════════════════════════════════════ */}
              <div className="cards-section">
                {/* Masonry grid with bin-packing algorithm */}
                {/* Cards flow into columns based on current column heights */}
                {/* Column count and placement update responsively on resize */}
                <MasonryGrid
                  cards={masonryCards}
                  onCaseStudyClick={(link) => navigate(link)}
                  onComingSoonClick={handleCardClick}
                />
              </div>

            </div>
          </div>

          {/* Page footer with tagline/image */}
          <Footer showHeadline />
        </main>
      </div>
    </>
  )
}
