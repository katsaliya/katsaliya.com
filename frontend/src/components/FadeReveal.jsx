/* ═══════════════════════════════════════════════════════════════════════════
   FADEREVEAL.JSX — generic block reveal, scroll- or load-triggered

   Fade + rise, once, for arbitrary children — the plain sibling to
   SplitReveal for content SplitReveal can't handle: paragraphs with inline
   links mixed into the text, section labels, anything that isn't a single
   flat string. Same mechanism as ScrollImage, generalized past just <img>.

   Same trigger/play contract as SplitReveal: trigger="load" gates on `play`
   (held behind PageLoader, for above-the-fold content with nothing to
   scroll to yet); trigger="scroll" (default, unchanged) fires once via
   ScrollTrigger when the block enters the viewport.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FadeReveal({
  children,
  as: Tag = 'div',
  className = '',
  style,
  trigger = 'scroll',
  play = true,
  start = 'top 88%',
  delay = 0,
  distance = 24,
  reduceMotion = false,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduceMotion) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity: 0, y: distance })

    if (trigger === 'load') {
      if (!play) return
      const tween = gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay })
      return () => tween.kill()
    }

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [trigger, play, start, delay, distance, reduceMotion])

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
