/* ═══════════════════════════════════════════════════════════════════════════
   SPLITREVEAL.JSX — per-word stagger reveal

   Splits its text content into one <span> per word and animates them in with
   a staggered fade + rise. Two trigger modes:
     - trigger="load"   plays once, gated on `play` (for above-the-fold
                         content like the hero — nothing to scroll to yet,
                         but it needs to wait behind PageLoader rather than
                         animate underneath it)
     - trigger="scroll" plays once when the element enters the viewport, via
                         GSAP ScrollTrigger (for everything below the fold)

   Renders the real text immediately for SEO/accessibility (no FOUC of empty
   content); only opacity/transform are animated, so a user with JS disabled
   or a slow connection still gets readable text, just unanimated.

   Styling is Tailwind, passed straight through via `className` (matches
   Carousel.jsx's convention) — this component only owns the split + the
   animation, not typography.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SplitReveal({
  children,
  as: Tag = 'p',
  className = '',
  style,
  trigger = 'scroll',
  play = true,
  delay = 0,
  stagger = 0.03,
  start = 'top 85%',
  reduceMotion = false,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll('.split-word')
    if (!words.length) return

    if (reduceMotion) {
      gsap.set(words, { opacity: 1, y: 0 })
      return
    }

    const anim = {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger,
      delay,
    }

    if (trigger === 'load') {
      gsap.set(words, { opacity: 0, y: '0.6em' })
      // Held at opacity 0 until told to go — otherwise this races PageLoader
      // and finishes animating in while still hidden behind the overlay.
      if (!play) return
      const tween = gsap.to(words, anim)
      return () => tween.kill()
    }

    gsap.set(words, { opacity: 0, y: '0.6em' })
    const tween = gsap.to(words, {
      ...anim,
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [trigger, play, delay, stagger, start, reduceMotion])

  // Split on whitespace, keep the spaces themselves out of the animated
  // spans (a space between two inline-block spans still renders as a
  // natural word gap) so line-wrapping stays exactly what plain text would do.
  const words = typeof children === 'string' ? children.split(' ') : null

  return (
    <Tag ref={ref} className={className} style={style}>
      {words
        ? words.map((word, i) => (
            <span key={i} className="split-word inline-block">
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))
        : children}
    </Tag>
  )
}
