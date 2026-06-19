import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ContentRow from '../components/ContentRow'
import '../styles/known.css'
import '../styles/content-row.css'

/*
  Drop files into /public/known/<category>/ and add entries here.
  type: 'video' | 'image' | 'placeholder-video' | 'placeholder-image'
*/
const PRINT_ITEMS = [
  // Standalone prints
  { type: 'image', src: '/known/print/flyer-car-show.png',   alt: 'Car Show Flyer' },
  { type: 'image', src: '/known/print/welcome-print.png',    alt: 'Welcome Print' },

  // Always Playing Singles (10)
  ...Array.from({ length: 10 }, (_, i) => ({
    type: 'image', src: `/known/print/aps-${i + 1}.png`, alt: `Always Playing Singles ${i + 1}`,
  })),

  // Blind Match (3)
  ...Array.from({ length: 3 }, (_, i) => ({
    type: 'image', src: `/known/print/blind-match-${i + 1}.png`, alt: `Blind Match ${i + 1}`,
  })),

  // First Date Fund (2)
  ...Array.from({ length: 2 }, (_, i) => ({
    type: 'image', src: `/known/print/first-date-fund-${i + 1}.png`, alt: `First Date Fund ${i + 1}`,
  })),

  // Match & Mixer (4)
  ...Array.from({ length: 4 }, (_, i) => ({
    type: 'image', src: `/known/print/match-mixer-${i + 1}.png`, alt: `Match & Mixer ${i + 1}`,
  })),

  // SF Dating Scene (2)
  ...Array.from({ length: 2 }, (_, i) => ({
    type: 'image', src: `/known/print/sf-dating-${i + 1}.png`, alt: `SF Dating Scene ${i + 1}`,
  })),

  // The Summer I... (4)
  ...Array.from({ length: 4 }, (_, i) => ({
    type: 'image', src: `/known/print/summer-i-${i + 1}.png`, alt: `The Summer I... ${i + 1}`,
  })),

  // PDFs
  { type: 'pdf', src: '/known/print/blind-match.pdf',     alt: 'Blind Match' },
  { type: 'pdf', src: '/known/print/flyer-prints.pdf',    alt: 'Flyer Prints' },
  { type: 'pdf', src: '/known/print/flyer-variation.pdf', alt: 'Flyer Variation' },
  { type: 'pdf', src: '/known/print/magazine-print.pdf',  alt: 'Magazine Print' },
  { type: 'pdf', src: '/known/print/post-2.pdf',          alt: 'Post' },

  // Date cards (10)
  ...Array.from({ length: 10 }, (_, i) => ({
    type: 'image', src: `/known/print/date-card-${i + 1}.png`, alt: `Date Card ${i + 1}`,
  })),

  // Playing cards (5)
  ...Array.from({ length: 5 }, (_, i) => ({
    type: 'image', src: `/known/print/playing-card-${i + 1}.png`, alt: `Playing Card ${i + 1}`,
  })),
]

const CONTENT_ROWS = [
  {
    label: 'DIML — Day in My Life',
    info: {
      title: 'Day in My Life',
      description: 'Behind-the-scenes content following the founder\'s daily routine — raw, unfiltered, and building in public. Each episode captured a different chapter of early-stage startup life.',
      platform: '@known on TikTok & Instagram',
      stat: 'avg. 12K views per post',
    },
    sections: [
      { label: '1', startIndex: 0 },
      { label: '2', startIndex: 3 },
      { label: '3', startIndex: 6 },
    ],
    cards: [
      { type: 'video', src: '/known/diml/diml-0716.mov', caption: '07.16' },
      { type: 'video', src: '/known/diml/diml-0722.mov', caption: '07.22' },
      { type: 'video', src: '/known/diml/diml-0724.mov', caption: '07.24' },
      { type: 'video', src: '/known/diml/diml-0729.mov', caption: '07.29' },
      { type: 'video', src: '/known/diml/diml-0730.mov', caption: '07.30' },
      { type: 'video', src: '/known/diml/diml-0731.mov', caption: '07.31' },
      { type: 'video', src: '/known/diml/diml-0804.mov', caption: '08.04' },
      { type: 'video', src: '/known/diml/diml-0819.mov', caption: '08.19' },
    ],
  },
  {
    label: 'App',
    info: {
      title: 'In-App',
      description: 'Feature walkthroughs and product highlights shot directly inside the Known app — showing the experience before most people had access to it.',
      platform: '@known on Instagram',
      stat: 'placeholder — avg. views per post',
    },
    cards: [
      { type: 'video', src: '/known/app/app-0722.mov', caption: '07.22' },
      { type: 'video', src: '/known/app/app-0808.mov', caption: '08.08' },
      { type: 'video', src: '/known/app/app-0813.mov', caption: '08.13' },
    ],
  },
  {
    label: 'Event Teasers & Recaps',
    info: {
      title: 'Events',
      description: 'Teasers and same-day recaps from Known\'s Bay Area matchmaking events — building anticipation beforehand and capturing the energy after. Content that turned attendees into followers.',
      platform: '@known on Instagram & LinkedIn',
      stat: 'placeholder — event attendance growth',
    },
    cards: [
      { type: 'video', src: '/known/events/event-0625.mov',      caption: '06.25 teaser' },
      { type: 'video', src: '/known/events/event-0714.mov',      caption: '07.14 teaser' },
      { type: 'video', src: '/known/events/event-0716.mov',      caption: '07.16 teaser' },
      { type: 'video', src: '/known/events/event-0728.mov',      caption: '07.28 teaser' },
      { type: 'video', src: '/known/events/dotthebay.mov',       caption: '@DoTheBay' },
      { type: 'video', src: '/known/events/soft-launch-recap.mov', caption: 'Soft Launch Recap' },
      { type: 'video', src: '/known/events/linkedin-recap.mov',  caption: 'LinkedIn Recap' },
      { type: 'video', src: '/known/events/event-recap.mov',     caption: 'Event Recap' },
    ],
  },
  {
    label: 'Founder-Led Series',
    info: {
      title: 'Founder',
      description: 'A documentary-style series following the founder through the highs and lows of building Known — vision, mission, and the messy middle of early-stage growth.',
      platform: '@known on LinkedIn & TikTok',
      stat: 'placeholder — avg. reach per post',
    },
    cards: [
      { type: 'video', src: '/known/founder-series/founder-0801.mov', caption: '08.01' },
      { type: 'video', src: '/known/founder-series/founder-0811.mov', caption: '08.11' },
      { type: 'video', src: '/known/founder-series/founder-0818.mov', caption: '08.18' },
    ],
  },
]

export default function Known() {
  const printRefs = useRef([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    document.body.className = 'page-light-body page-case-study'
    // Delay until after GSAP ScrollTrigger pins have initialised
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50)
    return () => { clearTimeout(t); document.body.className = '' }
  }, [])

  /* Scroll fade-in for print grid items and row info blocks */
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

  /* Lightbox */
  const openLightbox  = useCallback(item => { setLightbox(item); document.body.style.overflow = 'hidden' }, [])
  const closeLightbox = useCallback(() => { setLightbox(null); document.body.style.overflow = '' }, [])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeLightbox])

  return (
    <div className="site-wrapper">
      <Nav />

      <main className="kn-page">

        {/* ── HERO ── */}
        <div className="kn-hero">
          <Link to="/" className="kn-back">← back to work</Link>

          <div className="kn-hero-layout">
            {/* Left: text */}
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
                  <span className="kn-meta-value">CapCut · Canva · Illustrator · Photoshop </span>
                </div>
                <div className="kn-meta-item">
                  <span className="kn-meta-label">Timeline</span>
                  <span className="kn-meta-value">June 2025 - October 2025</span>
                </div>
              </div>
            </div>

            {/* Right: video */}
            <div className="kn-hero-video">
              <video src="/images/cards/KnownTV.mp4" autoPlay loop muted playsInline />
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL CONTENT ROWS ── */}
        {CONTENT_ROWS.map(row => (
          <ContentRow key={row.label} label={row.label} cards={row.cards} info={row.info} sections={row.sections || []} />
        ))}

        {/* ── PRINT & GRAPHICS GRID ── */}
        <div className="kn-print-header">
          <p className="kn-section-label">Graphics &amp; Marketing Materials</p>
        </div>
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

      </main>

      <Footer />
    </div>
  )
}
