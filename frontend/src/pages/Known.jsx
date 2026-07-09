/* ═══════════════════════════════════════════════════════════════════════════
   KNOWN.JSX — Case Study Page

   Known is a Series A AI-matchmaking startup's content & marketing case study.
   Showcases content strategy, print materials, social media campaigns, and
   TikTok strategy for building brand voice from scratch.

   Key interactions:
   - Sticky section navigation with smooth scrolling
   - Lightbox for expanding print material gallery
   - Entrance animations for sections and gallery items
   - FeaturedTikToks section with platform links
   - Responsive gallery of design materials
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import React hooks for state and lifecycle management */
import { useEffect, useRef, useState, useCallback } from 'react'

/* Import Link for internal navigation (not used in case study, available for future) */
import { Link } from 'react-router-dom'

/* Import global navigation component */
import Nav from '../components/Nav'

/* Import page footer component */
import Footer from '../components/Footer'

/* Import page-specific styles */
import '../styles/known.css'

/* ─── SECTION IDENTIFIERS ─── */
/* Array of section IDs on page (used for scrollspy and navigation) */
const SECTIONS = ['brief', 'strategy', 'process', 'content', 'materials', 'results']

/* ─── CONTENT DATA ─── */

/* Print materials gallery: images and PDFs for lightbox viewing */
const PRINT_ITEMS = [
  { type: 'image', src: '/known/print/flyer-car-show.png',   alt: 'Car Show Flyer' },
  { type: 'image', src: '/known/print/welcome-print.png',    alt: 'Welcome Print' },
  ...Array.from({ length: 10 }, (_, i) => ({
    type: 'image', src: `/known/print/aps-${i + 1}.png`, alt: `Always Playing Singles ${i + 1}`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    type: 'image', src: `/known/print/blind-match-${i + 1}.png`, alt: `Blind Match ${i + 1}`,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    type: 'image', src: `/known/print/first-date-fund-${i + 1}.png`, alt: `First Date Fund ${i + 1}`,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    type: 'image', src: `/known/print/match-mixer-${i + 1}.png`, alt: `Match & Mixer ${i + 1}`,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    type: 'image', src: `/known/print/sf-dating-${i + 1}.png`, alt: `SF Dating Scene ${i + 1}`,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    type: 'image', src: `/known/print/summer-i-${i + 1}.png`, alt: `The Summer I... ${i + 1}`,
  })),
  { type: 'pdf', src: '/known/print/blind-match.pdf',     alt: 'Blind Match' },
  { type: 'pdf', src: '/known/print/flyer-prints.pdf',    alt: 'Flyer Prints' },
  { type: 'pdf', src: '/known/print/flyer-variation.pdf', alt: 'Flyer Variation' },
  { type: 'pdf', src: '/known/print/magazine-print.pdf',  alt: 'Magazine Print' },
  { type: 'pdf', src: '/known/print/post-2.pdf',          alt: 'Post' },
  ...Array.from({ length: 10 }, (_, i) => ({
    type: 'image', src: `/known/print/date-card-${i + 1}.png`, alt: `Date Card ${i + 1}`,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    type: 'image', src: `/known/print/playing-card-${i + 1}.png`, alt: `Playing Card ${i + 1}`,
  })),
]

/* Content strategy pillars: three main content approaches */
/* Each pillar targets specific platforms and marketing goals */
const STRATEGY_PILLARS = [
  {
    name: 'Day in My Life',
    goal: 'Humanize the founder, build parasocial trust',
    platforms: ['TikTok', 'Instagram'],
  },
  {
    name: 'Founder Series',
    goal: 'Establish credibility and vision',
    platforms: ['TikTok', 'Instagram'],
  },
  {
    name: 'Events',
    goal: 'Drive IRL signups and community proof',
    platforms: ['TikTok', 'Instagram'],
  },
]

/* Content creation workflow: steps from brief to iteration */
const PROCESS_STEPS = [
  'Brief & platform audit',
  'Content pillar definition',
  'Shoot & direct (same-day turnaround)',
  'Edit in CapCut — music, captions, pacing',
  'Post, monitor, iterate based on performance',
]

/* Featured TikTok videos for "Featured Content" section */
/* TO CHANGE: Replace IDs with actual TikTok video IDs from your account */
const FEATURED_TIKTOKS = [
  { id: '7541552580887907615', placeholder: true },
  { id: '7548243888914353439', placeholder: true },
  { id: '7520841844310199582', placeholder: true },
  { id: '7532327613310831903', placeholder: true },
]

/* ─────────────────────────────────────────────────────────────────────
   KNOWN CASE STUDY PAGE
   ───────────────────────────────────────────────────────────────────── */
export default function Known() {
  /* ─── REFS FOR TRACKING ELEMENTS ─── */
  /* Print gallery items for entrance animation observer */
  const printRefs = useRef([])

  /* Section navigation for scroll position tracking */
  const navRef = useRef(null)

  /* Hero section for detecting scroll-out */
  const heroRef = useRef(null)

  /* ─── STATE ─── */
  /* Currently expanded lightbox item (null when closed) */
  const [lightbox, setLightbox] = useState(null)

  /* Currently active section (for nav highlight) */
  const [activeSection, setActiveSection] = useState('brief')

  /* Whether hero has scrolled out of view (shows nav title when true) */
  const [navIsSticky, setNavIsSticky] = useState(false)

  useEffect(() => {
    document.body.className = 'page-light-body page-case-study'
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50)
    return () => { clearTimeout(t); document.body.className = '' }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const navTop = navRef.current?.getBoundingClientRect().bottom ?? 100
      let current = SECTIONS[0]
      for (const id of SECTIONS) {
        const label = document.querySelector(`#${id} .kn-label`)
        if (!label) continue
        if (label.getBoundingClientRect().top <= navTop + 4) current = id
      }
      setActiveSection(current)

      // Check if hero is out of view to show nav logo
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0
      setNavIsSticky(heroBottom < 20)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault()
    const label = document.querySelector(`#${id} .kn-label`)
    if (!label) return
    const navTop = navRef.current?.getBoundingClientRect().bottom ?? 100
    const labelTop = label.getBoundingClientRect().top
    window.scrollTo({ top: window.scrollY + labelTop - navTop, behavior: 'smooth' })
    setActiveSection(id)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.08 }
    )
    printRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const openLightbox = (item) => { setLightbox(item); document.body.style.overflow = 'hidden' }
  const closeLightbox = () => { setLightbox(null); document.body.style.overflow = '' }

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeLightbox])

  return (
    <div className="site-wrapper">
      {/* Page nav-script: K.Sun logo */}
      <div className="page-nav-script">K.Sun</div>

      <Nav />

      <main className="kn-page">

        {/* ── HERO ── */}
        <div className="kn-hero" ref={heroRef}>
          {/* Back link will be at bottom */}

          <div className="kn-hero-layout">
            <div className="kn-hero-text">
              <h1 className="kn-title">Known</h1>
              <p className="kn-description">
                A collection of content, marketing materials, and graphics for a
                Series A AI-matchmaking startup — building brand voice from the ground
                up and shipping across social, pitch, and product.
              </p>
              <div className="kn-meta">
                <div className="kn-meta-item">
                  <span className="kn-meta-label">Role</span>
                  <span className="kn-meta-value">Content · Design · GTM</span>
                </div>
                <div className="kn-meta-item">
                  <span className="kn-meta-label">Tools</span>
                  <span className="kn-meta-value">CapCut · Canva · Illustrator · Photoshop</span>
                </div>
                <div className="kn-meta-item">
                  <span className="kn-meta-label">Timeline</span>
                  <span className="kn-meta-value">June 2025 - October 2025</span>
                </div>
              </div>
            </div>

            <div className="kn-hero-video">
              <video src="/images/cards/KnownTV.mp4" autoPlay loop muted playsInline />
            </div>
          </div>
        </div>

        {/* ── SECTION NAVIGATION ── */}
        <nav className={`kn-nav ${navIsSticky ? 'is-sticky' : ''}`} ref={navRef}>
          <div className="kn-nav__content">
            <div className="kn-nav__title">Known</div>
            <div className="kn-nav__links">
              {[
                ['brief', 'BRIEF'],
                ['strategy', 'STRATEGY'],
                ['process', 'PROCESS'],
                ['content', 'CONTENT'],
                ['materials', 'MATERIALS'],
                ['results', 'RESULTS'],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={activeSection === id ? 'active' : ''}
                  onClick={e => handleNavClick(e, id)}
                >{label}</a>
              ))}
            </div>
          </div>
        </nav>

        {/* ── BRIEF SECTION ── */}
        <div id="brief" className="kn-section kn-brief">
          <span className="kn-label">THE BRIEF</span>
          <div className="kn-brief__column">
            <h3 className="kn-brief__label">The Problem</h3>
            <p className="kn-brief__text">
              Known had zero social presence pre-launch and needed to build an audience
              before the product existed. With no budget for paid ads or influencers,
              organic content strategy was the only lever.
            </p>
          </div>
          <div className="kn-brief__column">
            <h3 className="kn-brief__label">My Role</h3>
            <p className="kn-brief__text">
              Sole content creator, strategist, and graphic designer for 4 months.
              Shaped the brand voice across TikTok, Instagram, and pitch decks while
              managing the creative pipeline end-to-end.
            </p>
          </div>
        </div>

        {/* ── STRATEGY SECTION ── */}
        <div id="strategy" className="kn-section kn-strategy">
          <span className="kn-label">CONTENT ARCHITECTURE</span>
          <div className="kn-pillars">
            {STRATEGY_PILLARS.map(pillar => (
              <div key={pillar.name} className="kn-pillar">
                <h4 className="kn-pillar__name">{pillar.name}</h4>
                <p className="kn-pillar__goal">{pillar.goal}</p>
                <div className="kn-pillar__platforms">
                  {pillar.platforms.map(p => (
                    <span key={p} className="kn-pillar__badge">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROCESS SECTION ── */}
        <div id="process" className="kn-section kn-process">
          <span className="kn-label">WORKFLOW</span>
          <div className="kn-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="kn-step">
                <span className="kn-step__number">{i + 1}.</span>
                <span className="kn-step__text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURED CONTENT SECTION ── */}
        <div id="content" className="kn-section kn-featured">
          <span className="kn-label">FEATURED CONTENT</span>

          <div className="kn-platform-links">
            <a href="https://www.tiktok.com/@joinknown" target="_blank" rel="noopener noreferrer" className="kn-platform-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.81V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-3.47v-3.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.01-.04z"/>
              </svg>
              <div>
                <p className="kn-platform-name">TikTok</p>
                <p className="kn-platform-handle">@joinknown</p>
              </div>
              <span className="kn-platform-cta">View →</span>
            </a>

            <a href="https://www.instagram.com/joinknown" target="_blank" rel="noopener noreferrer" className="kn-platform-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/>
              </svg>
              <div>
                <p className="kn-platform-name">Instagram</p>
                <p className="kn-platform-handle">@joinknown</p>
              </div>
              <span className="kn-platform-cta">View →</span>
            </a>
          </div>

          <div className="kn-highlights-grid">
            {FEATURED_TIKTOKS.map((item, i) => (
              <a
                key={i}
                href={`https://www.tiktok.com/video/${item.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="kn-highlight-card"
              >
                <div className="kn-highlight-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity=".4">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.81V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-3.47v-3.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.01-.04z"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── GRAPHICS & MARKETING MATERIALS ── */}
        <div id="materials" className="kn-section">
          <span className="kn-label">GRAPHICS &amp; MARKETING MATERIALS</span>
          <div className="kn-print-grid">
          {PRINT_ITEMS.map((item, i) => (
            <div
              key={item.src}
              className={`kn-print-item kn-print-item--${item.type}`}
              ref={el => { printRefs.current[i] = el }}
              onClick={() => openLightbox(item)}
            >
              {item.type === 'pdf' ? (
                <embed src={`${item.src}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" />
              ) : (
                <img src={item.src} alt={item.alt} loading="lazy" />
              )}
            </div>
          ))}
          </div>
        </div>

        {/* ── PERFORMANCE SECTION ── */}
        <div id="results" className="kn-section kn-performance">
          <span className="kn-label">RESULTS</span>
          <div className="kn-stats">
            <div className="kn-stat">
              <p className="kn-stat__value">—</p>
              <p className="kn-stat__label">views</p>
            </div>
            <div className="kn-stat">
              <p className="kn-stat__value">—</p>
              <p className="kn-stat__label">followers gained</p>
            </div>
            <div className="kn-stat">
              <p className="kn-stat__value">—</p>
              <p className="kn-stat__label">events promoted</p>
            </div>
          </div>
        </div>

        {/* ── LIGHTBOX ── */}
        {lightbox && (
          <div className="kn-lightbox" onClick={closeLightbox}>
            <button className="kn-lightbox__close" onClick={closeLightbox} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {lightbox.type === 'pdf' ? (
              <embed
                src={lightbox.src}
                type="application/pdf"
                className="kn-lightbox__pdf"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <img src={lightbox.src} alt="" onClick={e => e.stopPropagation()} />
            )}
          </div>
        )}

        {/* ── BACK LINK ── */}
        <div className="kn-footer-link">
          <Link to="/" className="kn-back">← back to work</Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
