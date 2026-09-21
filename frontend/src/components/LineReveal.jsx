/* ═══════════════════════════════════════════════════════════════════════════
   LINEREVEAL.JSX — clip-path wipe, or a plain blur/fade resolve

   For big display headlines: each line — or, with splitBy="char", each
   character — reveals either via a bottom-to-top clip-path wipe (matching
   the WorkCarousel ring's own intro-text reveal — see ring/splitText.js +
   shaders/textShaders.js: for a fixed screen pixel at texture-v Y,
   `gy = vUv.y + 1.0 - uReveal`, discarded whenever gy is outside [0,1],
   which works out to "pixel at Y turns on once uReveal >= Y, always
   sampling texture-v = Y" — the glyph's own pixels never move, a reveal
   boundary just sweeps up across a texture already rendered in its final
   position) — or, with `wipe={false}`, a plain opacity/blur resolve with
   no masking at all.

   wipe defaults to true (clip-path) for non-connected faces where it's a
   clean match for the ring. For a connected/script face it's a bad fit:
   splitBy="char" already isolates each letter in its own box (disabling
   ligatures/contextual shaping), and clip-path on top of that clips
   mid-swash at each character's box edge — visibly severing strokes that
   are drawn to flow into their neighbor. wipe={false} skips the mask
   entirely; only opacity (and blur, if blur=true) animate, so nothing gets
   cut regardless of how far a swash overshoots its box.

   `blur={false} wipe={true}` plus the ring's own timing (`duration=0.95
   ease="power4.out" stagger=0.015`, from ring/params.js's
   textTime/textEase/textStagger) matches the ring exactly. Defaults to
   wipe+blur together for headlines that want the softer, editorial
   "resolving into focus" read.

   Each visual line is wrapped in a line-reveal-row (block, width:max-content
   so it still line-breaks between rows but reports its own true content
   width, not the container's — needed by any caller measuring line width,
   e.g. fit-to-width sizing) — a level above line-reveal-inner, the actual
   per-reveal-unit (one per line, or one per character, depending on
   splitBy).

   When wipe is on, the clip only stays through the reveal — released to
   `clipPath: none` once the tween completes. inset(0,0,0,0) at rest is a
   zero-size clip region matching the box exactly, and swash-heavy
   display/script fonts routinely paint ink outside their own tight layout
   box (descenders, flourish tails) — leaving any clip on permanently would
   silently cut those off forever instead of just for the entrance.

   onComplete fires once, when the last staggered element finishes — lets a
   caller sequence something after the whole reveal lands (e.g. Home.jsx's
   loader chaining the name's move-into-place after this resolves).

   Same trigger/play/reduceMotion contract as SplitReveal: trigger="load"
   gates on `play`, trigger="scroll" fires once via ScrollTrigger when the
   block enters the viewport.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CLIP_HIDDEN = 'inset(100% 0% 0% 0%)'
const CLIP_SHOWN = 'inset(0% 0% 0% 0%)'

export default function LineReveal({
  lines,
  as: Tag = 'div',
  lineClassName = '',
  className = '',
  style,
  trigger = 'load',
  play = true,
  delay = 0,
  stagger = 0.12,
  duration = 0.65,
  ease = 'power3.out',
  blur = true,
  wipe = true,
  splitBy = 'line',
  start = 'top 85%',
  reduceMotion = false,
  onComplete,
}) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const els = wrap.querySelectorAll('.line-reveal-inner')
    if (!els.length) return

    const releaseClips = () => {
      if (wipe) gsap.set(els, { clipPath: 'none' })
      onComplete?.()
    }

    if (reduceMotion) {
      gsap.set(els, { opacity: 1, filter: 'blur(0px)' })
      releaseClips()
      return
    }

    const runTimeline = () => {
      if (wipe) gsap.set(els, { clipPath: CLIP_HIDDEN })
      const tl = gsap.timeline({ delay, onComplete: releaseClips })
      const revealProps = wipe ? { clipPath: CLIP_SHOWN } : {}
      if (blur) {
        gsap.set(els, { opacity: 0, filter: 'blur(18px)' })
        tl.to(els, { ...revealProps, opacity: 1, duration, ease, stagger })
        tl.to(els, { filter: 'blur(0px)', duration: duration * 0.85, ease: 'power2.out', stagger }, `-=${duration * 0.5}`)
      } else {
        gsap.set(els, { opacity: wipe ? 1 : 0 })
        tl.to(els, { ...revealProps, opacity: 1, duration, ease, stagger })
      }
      return tl
    }

    if (trigger === 'load') {
      if (!play) return
      const tl = runTimeline()
      return () => tl.kill()
    }

    let tl
    const st = ScrollTrigger.create({
      trigger: wrap,
      start,
      once: true,
      onEnter: () => { tl = runTimeline() },
    })
    return () => { tl?.kill(); st.kill() }
  }, [trigger, play, delay, stagger, duration, ease, blur, wipe, start, reduceMotion])

  return (
    <Tag ref={wrapRef} className={className} style={style}>
      {lines.map((line, i) => (
        <div key={i} className="line-reveal-row block w-max whitespace-nowrap">
          {splitBy === 'char'
            ? [...line].map((ch, ci) => (
                <span key={ci} className={`line-reveal-inner inline-block will-change-[clip-path,opacity,filter] ${lineClassName}`}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))
            : (
              <div className={`line-reveal-inner will-change-[clip-path,opacity,filter] ${lineClassName}`}>{line}</div>
            )}
        </div>
      ))}
    </Tag>
  )
}
