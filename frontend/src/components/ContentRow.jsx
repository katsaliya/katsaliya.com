/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT ROW — Horizontal Scrolling Card Gallery with Modal Expansion

   A reusable component for displaying media-rich cards (TikTok, Instagram,
   images, videos) in a horizontally-scrolling layout. Cards expand into a
   full-screen modal with smooth FLIP animation (First, Last, Invert, Play).

   Features:
   - Horizontal scroll with arrow navigation (GSAP smooth animation)
   - Video autoplay (IntersectionObserver — only most visible video plays)
   - Responsive card gallery with entrance animations
   - Modal expansion with FLIP technique for smooth animation
   - Instagram embed reprocessing on updates
   - Keyboard support (Escape to close modal)
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import React hooks for state, effects, and optimization */
import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react'

/* Import GSAP for smooth animations and ScrollTrigger plugin */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Register GSAP plugin for scroll-based animations */
gsap.registerPlugin(ScrollTrigger)

/* ─── LOAD THIRD-PARTY EMBED SCRIPTS ─── */
/* TikTok and Instagram embeds require their scripts to process embed markup */
/* These are loaded once at component initialization to process embeds */
if (typeof window !== 'undefined') {
  /* Load TikTok embed script (only once) */
  if (!window.tiktok) {
    const script = document.createElement('script')
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  }
  /* Load Instagram embed script (only once) */
  if (!window.instgrm) {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  }
}

/* ─────────────────────────────────────────────────────────────────────
   CONTENT ROW COMPONENT

   Props:
   - label: Section label for header
   - cards: Array of card objects {type, src, alt, ...}
   - info: Title/description for header {title, description}
   - sections: Additional sections to render
   ───────────────────────────────────────────────────────────────────── */
export default function ContentRow({ label, cards = [], info, sections = [] }) {
  /* ─── DOM ELEMENT REFERENCES ─── */
  /* Outer container (prevents scrollbar from appearing) */
  const outerRef = useRef(null)

  /* Flex row containing all cards (animated with transform: translateX) */
  const trackRef = useRef(null)

  /* Individual card elements (for calculating FLIP animation) */
  const cardRefs = useRef([])

  /* Video elements inside cards (for autoplay control) */
  const videoRefs = useRef([])

  /* Modal media element (image/video being expanded) */
  const mediaRef = useRef(null)

  /* Modal overlay/backdrop */
  const overlayRef = useRef(null)

  /* ─── UI STATE ─── */
  /* Progress bar value (0-1) for visual scrolling indicator */
  const [progress, setProgress] = useState(0)

  /* Expanded card data + original position for FLIP animation */
  const [expanded, setExpanded] = useState(null)

  /* ─── ANIMATION STATE (NON-RENDERING) ─── */
  /* Maximum scroll progress calculated from track size */
  const maxProgressRef = useRef(0)

  /* Total horizontal scroll distance available (for arrow navigation) */
  const scrollDistRef = useRef(0)

  /* Current scroll offset (updated by arrow clicks) */
  const manualOffsetRef = useRef(0)

  const words = useMemo(() => {
    if (!info) return []
    return [
      ...info.title.split(' ').map(w => ({ text: w, type: 'title' })),
      ...info.description.split(' ').map(w => ({ text: w, type: 'desc' })),
    ]
  }, [info])

  /* ── Cache scroll distance for arrow navigation ───────────── */
  useLayoutEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return

    const getScrollDist = () => {
      // Align last card's right edge with the right edge of the visible area
      return Math.max(0, track.scrollWidth - outer.offsetWidth)
    }

    scrollDistRef.current = getScrollDist()
  }, [cards])

  /* ── Video autoplay via IntersectionObserver ─────────────── */
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean)
    if (!videos.length) return
    const observer = new IntersectionObserver(
      entries => {
        let mostVisible = null
        let maxRatio = 0
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio > maxRatio) {
            maxRatio = e.intersectionRatio
            mostVisible = e.target
          }
        })
        // Only the most visible video plays, others pause and mute
        entries.forEach(e => {
          if (e.target === mostVisible && maxRatio > 0.3) {
            e.target.play().catch(() => {})
            e.target.muted = false
          } else {
            e.target.pause()
            e.target.currentTime = 0
            e.target.muted = true
          }
        })
      },
      { threshold: [0.3, 0.5, 0.7] }
    )
    videos.forEach(v => observer.observe(v))
    return () => observer.disconnect()
  }, [])

  /* ── Process embeds ──────────────────────────────────────── */
  useEffect(() => {
    // Reprocess Instagram embeds when cards mount/update
    if (window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process()
    }
  }, [cards])

  /* ── Modal helpers ───────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  useEffect(() => {
    if (expanded) videoRefs.current.forEach(v => v?.pause())
  }, [expanded])

  const handleExpand = useCallback((card, index) => {
    const cardEl = cardRefs.current[index]
    if (!cardEl) return
    setExpanded({ ...card, cardRect: cardEl.getBoundingClientRect() })
  }, [])

  useEffect(() => {
    if (!expanded || !overlayRef.current) return
    gsap.fromTo(overlayRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  }, [expanded])

  const runFlip = useCallback(() => {
    if (!expanded || !mediaRef.current) return
    const { cardRect } = expanded
    const mr = mediaRef.current.getBoundingClientRect()
    if (!mr.width || !mr.height) return
    const dx    = (cardRect.left + cardRect.width  / 2) - (mr.left + mr.width  / 2)
    const dy    = (cardRect.top  + cardRect.height / 2) - (mr.top  + mr.height / 2)
    const scale = cardRect.width / mr.width
    gsap.fromTo(mediaRef.current,
      { x: dx, y: dy, scale, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut', clearProps: 'transform' }
    )
  }, [expanded])

  const handleClose = useCallback(() => {
    if (!expanded || !mediaRef.current || !overlayRef.current) return
    const { cardRect } = expanded
    const mr    = mediaRef.current.getBoundingClientRect()
    const dx    = (cardRect.left + cardRect.width  / 2) - (mr.left + mr.width  / 2)
    const dy    = (cardRect.top  + cardRect.height / 2) - (mr.top  + mr.height / 2)
    const scale = cardRect.width / mr.width
    gsap.to(mediaRef.current,  { x: dx, y: dy, scale, opacity: 0, duration: 0.4, ease: 'power3.in',
                                   onComplete: () => setExpanded(null) })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
  }, [expanded])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && expanded) handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, handleClose])

  /* ── Arrow navigation ────────────────────────────────────── */
  const handleArrowClick = useCallback((direction) => {
    if (!trackRef.current) return

    const scrollDist = scrollDistRef.current

    // Calculate step size: width of 1.5 cards + gap
    const cards = trackRef.current.querySelectorAll('.cr-card')
    if (cards.length === 0) return

    const cardWidth = cards[0].offsetWidth
    const gap = 24 // approximate gap size (clamp(1rem, 2vw, 2rem))
    const stepSize = (cardWidth + gap) * 1.5

    const newOffset = direction === 'left'
      ? Math.max(0, manualOffsetRef.current - stepSize)
      : Math.min(scrollDist, manualOffsetRef.current + stepSize)

    manualOffsetRef.current = newOffset
    gsap.to(trackRef.current, {
      x: -newOffset,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [])

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <>
      <section className="cr-outer" ref={outerRef}>

          {/* TOP: label + progress + words */}
          <div className="cr-header">
            <div className="cr-header__bar">
              <div className="cr-progress" aria-hidden>
                <div className="cr-progress__fill" style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>

            {info && (
              <div className="cr-info__words">
                {words.map((word, i) => (
                  <span
                    key={i}
                    data-word-index={i}
                    className={`cr-info__word cr-info__word--${word.type}`}
                    style={{ opacity: 0 }}
                  >
                    {word.text}{' '}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* MIDDLE: card track with arrow navigation */}
          <div className="cr-track-wrapper">
            <button className="cr-arrow cr-arrow--left" onClick={() => handleArrowClick('left')} aria-label="Scroll left">
              ←
            </button>
            <div className="cr-track" ref={trackRef}>
            {cards.map((card, i) => (
              <div
                key={i}
                className={`cr-card cr-card--${card.type}`}
                ref={el => { cardRefs.current[i] = el }}
                onClick={() => handleExpand(card, i)}
                role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter') handleExpand(card, i) }}
              >
                <div className="cr-card__media">
                  {card.type === 'video' ? (
                    <>
                      <video ref={el => { videoRefs.current[i] = el }}
                             src={card.src} muted loop playsInline preload="none" />
                      <div className="cr-card__ui">
                        <span className="cr-card__mute">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                          </svg>
                        </span>
                        <span className="cr-card__expand-hint">expand</span>
                      </div>
                    </>
                  ) : card.type === 'image' ? (
                    <img src={card.src} alt={card.caption || ''} loading="lazy" />
                  ) : card.type === 'tiktok' ? (
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${card.src}`}
                        width="100%"
                        style={{ border: 'none', display: 'block', minHeight: '100%' }}
                        allow="autoplay"
                      />
                    </div>
                  ) : card.type === 'instagram' ? (
                    <a
                      href={`https://www.instagram.com/p/${card.src}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#888',
                        fontSize: '14px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}
                    >
                      View on Instagram →
                    </a>
                  ) : (
                    <div className="cr-card__placeholder">
                      {card.type === 'placeholder-video' && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity=".3">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                      <span>{card.caption || `[${card.type}]`}</span>
                    </div>
                  )}
                </div>
                {card.caption && card.type !== 'placeholder-video' && card.type !== 'placeholder-image' && (
                  <p className="cr-card__caption">{card.caption}</p>
                )}
              </div>
            ))}
            </div>
            <button className="cr-arrow cr-arrow--right" onClick={() => handleArrowClick('right')} aria-label="Scroll right">
              →
            </button>
          </div>

          {/* BOTTOM: platform + stat */}
          {info && (
            <div className="cr-info__meta" data-meta="true" style={{ opacity: 0 }}>
              <span className="cr-info__platform">{info.platform}</span>
              <span className="cr-info__stat">{info.stat}</span>
            </div>
          )}

      </section>

      {/* Expanded modal */}
      {expanded && (
        <div className="cr-modal-overlay" ref={overlayRef} onClick={handleClose}
             aria-modal="true" role="dialog">
          <button className="cr-modal__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className="cr-modal__media" ref={mediaRef} onClick={e => e.stopPropagation()}>
            {expanded.type === 'video' ? (
              <video src={expanded.src} controls autoPlay preload="auto" onLoadedMetadata={runFlip}
                     style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh' }} />
            ) : expanded.type === 'tiktok' ? (
              <iframe
                src={`https://www.tiktok.com/embed/v2/${expanded.src}`}
                width="100%"
                height="600"
                frameBorder="0"
                allow="autoplay"
                style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block' }}
              />
            ) : expanded.type === 'instagram' ? (
              <a
                href={`https://www.instagram.com/p/${expanded.src}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#888',
                  fontSize: '16px',
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                View this Instagram post →
              </a>
            ) : (
              <img src={expanded.src} alt={expanded.caption || ''} onLoad={runFlip}
                   style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh' }} />
            )}
          </div>
          {expanded.caption && (
            <p className="cr-modal__caption" onClick={e => e.stopPropagation()}>
              {expanded.caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}
