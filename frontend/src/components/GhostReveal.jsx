/* ═══════════════════════════════════════════════════════════════════════════
   GHOSTREVEAL.JSX — duplicate-layer blur crossfade

   Two stacked copies of the same text: a blurred "ghost" layer sitting
   behind, and a sharp layer in front, absolutely positioned over it. At rest
   the sharp layer is invisible and the ghost sits soft and dim; on
   scroll-in, the ghost fades out while the sharp copy blurs-in-to-focus and
   rises to full opacity. Same technique observed on produx.design's
   emphasis lines — reads as the text "resolving into focus" rather than a
   plain fade.

   For a single short line/phrase, not paragraphs — the duplicate DOM plus
   blur filter is comparatively expensive, so this is meant for the handful
   of emphasis moments on a page, not everything. Styling (font size, color,
   etc.) is Tailwind via `className`, applied to both layers identically so
   they sit exactly on top of one another.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GhostReveal({
  children,
  as: Tag = 'p',
  className = '',
  style,
  start = 'top 80%',
  reduceMotion = false,
}) {
  const wrapRef = useRef(null)
  const ghostRef = useRef(null)
  const sharpRef = useRef(null)

  useEffect(() => {
    const ghost = ghostRef.current
    const sharp = sharpRef.current
    if (!ghost || !sharp) return

    if (reduceMotion) {
      gsap.set(ghost, { opacity: 0 })
      gsap.set(sharp, { opacity: 1, filter: 'blur(0px)', y: 0 })
      return
    }

    gsap.set(ghost, { opacity: 0.35, filter: 'blur(14px)' })
    gsap.set(sharp, { opacity: 0, filter: 'blur(18px)', y: '0.3em' })

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrapRef.current, start, once: true },
    })
    tl.to(sharp, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.1, ease: 'power2.out' }, 0)
    tl.to(ghost, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.15)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [start, reduceMotion])

  return (
    <div ref={wrapRef} className="relative">
      {/* Ghost sets the wrapper's real layout size (sharp is absolute and
          would otherwise collapse the wrapper to zero height). */}
      <Tag ref={ghostRef} className={className} style={style} aria-hidden="true">
        {children}
      </Tag>
      <Tag ref={sharpRef} className={`${className} absolute inset-0`} style={style}>
        {children}
      </Tag>
    </div>
  )
}
