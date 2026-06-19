import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContentRow({ label, cards = [], info, sections = [] }) {
  const outerRef = useRef(null)
  const trackRef    = useRef(null)  // flex row — translated by GSAP
  const cardRefs    = useRef([])
  const videoRefs   = useRef([])
  const mediaRef    = useRef(null)
  const overlayRef  = useRef(null)

  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded]  = useState(null)

  const maxProgressRef = useRef(0)
  const scrollDistRef = useRef(0)
  const manualOffsetRef = useRef(0)

  const words = useMemo(() => {
    if (!info) return []
    return [
      ...info.title.split(' ').map(w => ({ text: w, type: 'title' })),
      ...info.description.split(' ').map(w => ({ text: w, type: 'desc' })),
    ]
  }, [info])

  /* ── Scroll-scrubbed animation (Apple-style, Lenis-paired) ───────
     Extends scroll distance 2.5x for more deliberate, weighted motion.
     Card pan + word reveals chained into single timeline for unified feel.
     Heavy scrub lag (1.8) pairs with Lenis smooth scroll.            */
  useLayoutEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return

    const getScrollDist = () => {
      // Align last card's right edge with the right edge of the visible area
      return Math.max(0, track.scrollWidth - outer.offsetWidth)
    }

    const ctx = gsap.context(() => {
      const scrollDist = getScrollDist()
      const baseDistance = scrollDist * 2.5

      // Cache scrollDist for hover-scroll calculations
      scrollDistRef.current = scrollDist

      // Direct scrub on track — applies scroll-driven position
      gsap.to(track, {
        x: -scrollDist,
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start: 'top bottom',
          end: () => `+=${baseDistance}`,
          scrub: 1.5,
          onUpdate: self => {
            maxProgressRef.current = Math.max(maxProgressRef.current, self.progress)
            setProgress(maxProgressRef.current)
          },
        },
      })

      // Word reveals: separate scrubs for text reveal
      words.forEach((word, i) => {
        const wordEl = document.querySelector(`[data-word-index="${i}"]`)
        if (wordEl) {
          const revealStart = (i / words.length) * baseDistance * 0.78
          gsap.to(wordEl, {
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: outer,
              start: `top bottom +=${revealStart}`,
              end: `top bottom +=${revealStart + 100}`,
              scrub: 1.5,
            },
          })
        }
      })

      // Meta reveal at 72% of scroll distance
      const metaEl = outer.querySelector('[data-meta="true"]')
      if (metaEl) {
        gsap.to(metaEl, {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outer,
            start: `top bottom +=${baseDistance * 0.72}`,
            end: `top bottom +=${baseDistance * 0.72 + 100}`,
            scrub: 1.5,
          },
        })
      }
    }, outer)

    return () => ctx.revert()
  }, [words])

  /* ── Video autoplay via IntersectionObserver ─────────────── */
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

    // Calculate step size: width of 1 card + 1 gap
    const cards = trackRef.current.querySelectorAll('.cr-card')
    if (cards.length === 0) return

    const cardWidth = cards[0].offsetWidth
    const gap = 24 // approximate gap size (clamp(1rem, 2vw, 2rem))
    const stepSize = cardWidth + gap

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
                             src={card.src} muted loop playsInline />
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
              <video src={expanded.src} controls autoPlay onLoadedMetadata={runFlip}
                     style={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh' }} />
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
