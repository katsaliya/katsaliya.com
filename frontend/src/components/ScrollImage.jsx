/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLIMAGE.JSX — scroll-triggered image reveal

   Wraps an <img>, hidden and offset until it scrolls into view, then fades
   and rises into place, once. Used for photos in the About section instead
   of everything being visible from page load.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  start = 'top 88%',
  delay = 0,
  reduceMotion = false,
  ...imgProps
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduceMotion) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 })
      return
    }

    gsap.set(el, { opacity: 0, y: 28, scale: 0.97 })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [start, delay, reduceMotion])

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`${className} ${imgClassName}`}
      {...imgProps}
    />
  )
}
