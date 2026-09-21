/* ═══════════════════════════════════════════════════════════════════════════
   PAGELOADER.JSX — branded entrance, orchid logo

   Same relationship as the WorkCarousel's load counter and its entry
   timeline: this holds the page's real content back until it's done, then
   the caller's own entrance (hero SplitReveal, etc.) begins. Not gated on
   heavy asset loading the way the carousel's atlas is — there's nothing
   that big to wait for on this page — so it gates on document.fonts.ready
   (the hero's type shouldn't reveal in a fallback font and reflow) plus a
   minimum hold so the logo moment reads as deliberate rather than a flash.

   Exit is a FLIP-style flight rather than a fade-in-place: the logo travels
   from its centered hold position to the real nav logo's exact on-screen
   spot and shrinks to match it, landing right as the overlay clears — the
   loader hands off directly to the logo that was already waiting for it in
   the nav, rather than two unrelated logos swapping places.

   Shows on every mount, matching how /work's own loader behaves on every
   visit rather than once per session.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const MIN_HOLD_MS = 1100
const FONTS_TIMEOUT_MS = 2500

export default function PageLoader({ onComplete, reduceMotion = false, landOnSelector = '.nav-logo img' }) {
  const [phase, setPhase] = useState('in') // 'in' | 'holding' | 'out' | 'done'
  const overlayRef = useRef(null)
  const logoRef = useRef(null)
  const pulseTweenRef = useRef(null)

  useEffect(() => {
    const logo = logoRef.current
    const overlay = overlayRef.current

    if (reduceMotion) {
      // Skip the ceremony entirely — still a beat, not an instant swap, so
      // there's no jarring flash, but nothing that reads as "motion".
      const t = setTimeout(() => {
        setPhase('done')
        onComplete?.()
      }, 150)
      return () => clearTimeout(t)
    }

    gsap.set(logo, { opacity: 0, scale: 0.7, rotate: -8 })
    gsap.to(logo, {
      opacity: 0.9,
      scale: 1,
      rotate: 0,
      duration: 0.7,
      ease: 'back.out(1.6)',
      onComplete: () => {
        setPhase('holding')
        // Gentle breathing while held, same idea as the carousel's counter
        // actively ticking rather than sitting frozen during its own hold.
        pulseTweenRef.current = gsap.to(logo, {
          scale: 1.05,
          duration: 1.1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      },
    })

    const start = performance.now()
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const timeout = new Promise((resolve) => setTimeout(resolve, FONTS_TIMEOUT_MS))

    Promise.race([fontsReady, timeout]).then(() => {
      const elapsed = performance.now() - start
      const remaining = Math.max(0, MIN_HOLD_MS - elapsed)
      setTimeout(() => {
        pulseTweenRef.current?.kill()

        const tl = gsap.timeline({
          onComplete: () => {
            setPhase('done')
            onComplete?.()
          },
        })

        // offsetWidth ignores the pulse's transform:scale, so this is the
        // logo's true untransformed size — needed to compute an absolute
        // target scale rather than one relative to whatever mid-pulse frame
        // the hold happened to be killed on.
        const baseWidth = logo.offsetWidth
        const target = document.querySelector(landOnSelector)

        if (target) {
          const from = logo.getBoundingClientRect()
          const to = target.getBoundingClientRect()
          // transform-origin is center by default, so the rect's center is
          // stable under scale — safe to diff even mid-pulse.
          const dx = (to.left + to.width / 2) - (from.left + from.width / 2)
          const dy = (to.top + to.height / 2) - (from.top + from.height / 2)
          const landScale = to.width / baseWidth

          tl.to(logo, {
            x: dx,
            y: dy,
            scale: landScale,
            duration: 0.85,
            ease: 'power3.inOut',
          }, 0)
          // Overlay clears while the logo is still mid-flight, so the real
          // page (nav included) is visible behind it as it closes the gap —
          // reads as arriving home rather than a plain cut.
          tl.to(overlay, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.3)
          // Quick handoff fade once it has landed on the real nav logo's spot.
          tl.to(logo, { opacity: 0, duration: 0.18, ease: 'power1.in' }, '>-0.05')
        } else {
          // Fallback if the nav logo isn't in the DOM for some reason —
          // the old fade-in-place behavior.
          tl.to(logo, { opacity: 0, scale: 1.15, duration: 0.45, ease: 'power2.in' }, 0)
          tl.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.1)
        }

        setPhase('out')
      }, remaining)
    })

    return () => {
      pulseTweenRef.current?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ivory)] pointer-events-none"
      aria-hidden="true"
    >
      <img
        ref={logoRef}
        src="/images/assets/orchid-logo-placeholder.png"
        alt=""
        className="w-[72px] h-[80px] object-contain"
      />
    </div>
  )
}
