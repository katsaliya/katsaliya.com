import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────────────────────
   ContentRow
   Horizontal-scrolling row pinned by GSAP ScrollTrigger.

   Props:
     label   – category heading string
     cards   – array of { type, src, caption }
               type: 'video' | 'image' | 'placeholder-video' | 'placeholder-image'
   ───────────────────────────────────────────────────────────── */
export default function ContentRow({ label, cards = [] }) {
  const outerRef    = useRef(null)   // full-height section — gets pinned
  const trackRef    = useRef(null)   // flex row — translated by GSAP
  const cardRefs    = useRef([])     // individual card elements
  const videoRefs   = useRef([])     // in-row video elements
  const mediaRef    = useRef(null)   // expanded modal media element
  const overlayRef  = useRef(null)   // modal background overlay

  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(null) // { type, src, caption, cardRect }

  /* ── GSAP pin + horizontal scroll ─────────────────────────── */
  useLayoutEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return

    const getScrollDist = () => {
      const lastCard = track.lastElementChild
      const lastCardHalfW = lastCard ? lastCard.offsetWidth / 2 : 0
      return track.scrollWidth - lastCardHalfW - outer.offsetWidth / 2
    }

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          pin: true,
          scrub: 1.4,
          end: () => `+=${getScrollDist()}`,
          onUpdate: self => setProgress(self.progress),
          invalidateOnRefresh: true,
        },
      })
    }, outer)

    return () => ctx.revert()
  }, [])

  /* ── Video autoplay via IntersectionObserver ───────────────── */
  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean)
    if (!videos.length) return

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {})
        else { e.target.pause(); e.target.currentTime = 0 }
      }),
      { threshold: 0.4 }
    )
    videos.forEach(v => observer.observe(v))
    return () => observer.disconnect()
  }, [])

  /* ── Lock body scroll while modal open ─────────────────────── */
  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  /* ── Pause row videos when modal opens ─────────────────────── */
  useEffect(() => {
    if (expanded) videoRefs.current.forEach(v => v?.pause())
  }, [expanded])

  /* ── Expand: capture card rect, open modal ──────────────────── */
  const handleExpand = useCallback((card, index) => {
    const cardEl = cardRefs.current[index]
    if (!cardEl) return
    setExpanded({ ...card, cardRect: cardEl.getBoundingClientRect() })
  }, [])

  /* ── Fade overlay in immediately on open ───────────────────── */
  useEffect(() => {
    if (!expanded || !overlayRef.current) return
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
  }, [expanded])

  /* ── FLIP from card → natural-size media (fires after metadata) ─ */
  const runFlip = useCallback(() => {
    if (!expanded || !mediaRef.current) return
    const { cardRect } = expanded
    const mr    = mediaRef.current.getBoundingClientRect()
    if (!mr.width || !mr.height) return
    const dx    = (cardRect.left + cardRect.width  / 2) - (mr.left + mr.width  / 2)
    const dy    = (cardRect.top  + cardRect.height / 2) - (mr.top  + mr.height / 2)
    const scale = cardRect.width / mr.width
    gsap.fromTo(mediaRef.current,
      { x: dx, y: dy, scale, opacity: 0 },
      { x: 0,  y: 0,  scale: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut', clearProps: 'transform' }
    )
  }, [expanded])

  /* ── Close: FLIP animate back to card ──────────────────────── */
  const handleClose = useCallback(() => {
    if (!expanded || !mediaRef.current || !overlayRef.current) return

    const { cardRect } = expanded
    const mediaEl     = mediaRef.current
    const overlayEl   = overlayRef.current
    const mr          = mediaEl.getBoundingClientRect()
    const dx          = (cardRect.left + cardRect.width  / 2) - (mr.left + mr.width  / 2)
    const dy          = (cardRect.top  + cardRect.height / 2) - (mr.top  + mr.height / 2)
    const scale       = cardRect.width / mr.width

    gsap.to(mediaEl,  { x: dx, y: dy, scale, opacity: 0, duration: 0.4, ease: 'power3.in',
                         onComplete: () => setExpanded(null) })
    gsap.to(overlayEl, { opacity: 0, duration: 0.3 })
  }, [expanded])

  /* ── Escape key ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && expanded) handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, handleClose])

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Pinned row ── */}
      <section className="cr-outer" ref={outerRef}>

        {/* header + progress */}
        <div className="cr-header">
          <span className="cr-label">{label}</span>
          <div className="cr-progress" aria-hidden>
            <div className="cr-progress__fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>

        {/* horizontal track */}
        <div className="cr-track" ref={trackRef}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={`cr-card cr-card--${card.type}`}
              ref={el => { cardRefs.current[i] = el }}
              onClick={() => handleExpand(card, i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') handleExpand(card, i) }}
            >
              <div className="cr-card__media">
                {card.type === 'video' ? (
                  <>
                    <video
                      ref={el => { videoRefs.current[i] = el }}
                      src={card.src}
                      muted loop playsInline
                    />
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
                ) : (
                  /* placeholder */
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

      </section>

      {/* ── Expanded modal ── */}
      {expanded && (
        <div
          className="cr-modal-overlay"
          ref={overlayRef}
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <button className="cr-modal__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="cr-modal__media" ref={mediaRef} onClick={e => e.stopPropagation()}>
            {expanded.type === 'video' ? (
              <video
                src={expanded.src}
                controls
                autoPlay
                onLoadedMetadata={runFlip}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh' }}
              />
            ) : (
              <img
                src={expanded.src}
                alt={expanded.caption || ''}
                onLoad={runFlip}
                style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh' }}
              />
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
