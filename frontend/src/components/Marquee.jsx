/* ═══════════════════════════════════════════════════════════════════════════
   MARQUEE.JSX — seamless looping text strip

   One unit of content (passed as children) repeated across the viewport and
   translated sideways forever. Generic on purpose: the /work-style discipline
   sections want the same device with different content.

   How the loop is made seamless: the track holds TWO identical groups side by
   side and is translated by exactly -50% of its own width. At the end of that
   travel the second group sits precisely where the first began, so resetting
   to 0 is invisible. This is why the duplicate exists and why it is
   aria-hidden — it is a rendering trick, not content, and a screen reader
   hitting the same sentence twice is just noise.

   `copies` is measured rather than hardcoded: one unit of a long phrase is
   wider than a phone and narrower than an ultrawide, and a group narrower
   than the container would leave a visible gap mid-loop. Measured once on
   mount and again on resize.

   The strip clips horizontally via clip-path rather than overflow, so
   content is free to spill above and below it — see the note on the
   container element.

   Speed is scroll-reactive. The strip has a resting pace and accelerates with
   Lenis's scroll velocity, easing back down when scrolling stops — eased on a
   chase rather than set directly, the same way the ring smooths its cursor,
   so it never snaps between speeds.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Marquee({
  children,
  /* px per second at rest. 18 is measured off the reference site: sampling
     its marquee across a window where the page was provably NOT scrolling
     gave +35 px/s of drift in a 2x retina capture, so ~17.5 CSS px/s. It is
     far slower than it looks in motion. */
  speed = 18,
  /* 'right' matches the reference, which drifts left-to-right. */
  direction = 'right',
  /* how hard scrolling drives it, and the ceiling on that boost */
  velocityGain = 0.06,
  maxBoost = 5,
  /* How far content may spill above and below the strip before it is cut.
     A percentage of the strip's own height, so it scales with the type. */
  bleed = '25%',
  reduceMotion = false,
  className = '',
  ariaLabel,
}) {
  const containerRef = useRef(null)
  const groupRef = useRef(null)
  const trackRef = useRef(null)
  const [copies, setCopies] = useState(2)

  /* Enough copies to overflow the container, so the group is never narrower
     than what it has to cover. useLayoutEffect so the count settles before
     paint rather than flashing a short strip. */
  useLayoutEffect(() => {
    const container = containerRef.current
    const group = groupRef.current
    if (!container || !group) return

    const fit = () => {
      const unit = group.firstElementChild
      if (!unit) return
      const unitWidth = unit.getBoundingClientRect().width
      if (!unitWidth) return
      const needed = Math.ceil(container.clientWidth / unitWidth) + 1
      setCopies((prev) => (prev === needed ? prev : needed))
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(container)
    return () => ro.disconnect()
  }, [children])

  useEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return

    if (reduceMotion) {
      gsap.set(track, { xPercent: 0 })
      return
    }

    const groupWidth = group.getBoundingClientRect().width
    if (!groupWidth) return

    /* Duration from distance and speed, so the pace reads the same whether
       the strip is one long phrase or several short ones.

       Rightward travel runs -50% -> 0 rather than 0 -> +50%. The track is
       two identical groups, so it spans [x, x + 2*groupWidth]; letting x go
       positive would walk the track's left edge into the viewport and show
       blank space behind it. Starting at -50% keeps the viewport covered for
       the whole cycle, and -50% and 0 are visually identical frames, so the
       loop point is invisible either direction. */
    const from = direction === 'right' ? -50 : 0
    const tween = gsap.fromTo(
      track,
      { xPercent: from },
      {
        xPercent: direction === 'right' ? 0 : -50,
        duration: groupWidth / speed,
        ease: 'none',
        repeat: -1,
      },
    )

    let ts = 1
    const tick = () => {
      const v = window.__lenis?.velocity ?? 0
      const target = 1 + Math.min(maxBoost, Math.abs(v) * velocityGain)
      ts += (target - ts) * 0.08
      tween.timeScale(ts)
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      tween.kill()
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [copies, speed, direction, velocityGain, maxBoost, reduceMotion, children])

  const group = (hidden) => (
    <div ref={hidden ? undefined : groupRef} className="flex shrink-0" aria-hidden={hidden || undefined}>
      {Array.from({ length: copies }, (_, i) => (
        <div key={i} className="shrink-0">
          {children}
        </div>
      ))}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      /* Clipped on the horizontal axis ONLY. overflow:hidden would do the
         job sideways but also cuts the strip's top and bottom, and display
         type routinely paints outside its own line box — a swashed script's
         ascenders, any descender, and the chalk filter's paint region all
         live out there. Roughly 16px of the "D" swash was being sliced off.

         overflow-x:hidden with overflow-y:visible is not an option: CSS
         computes the visible axis to auto as soon as the other is hidden,
         which turns this into a scroll container. clip-path is the way to
         constrain one axis and genuinely leave the other alone — the
         negative vertical inset pushes the cut well outside the box. */
      style={{ clipPath: `inset(-${bleed} 0px)` }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}
