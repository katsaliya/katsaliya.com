/* ═══════════════════════════════════════════════════════════════════════════
   CURSORTAG.JSX — the /work ring's "View" tag, as DOM

   On the carousel this tag is drawn inside the ring's own shader pass, which
   is what lets it refract the artwork behind it and invert its label against
   whatever pixels it lands on. None of that is available to an element sitting
   over ordinary page content, so this reproduces what CSS can: the same
   geometry, the same offset from the cursor, the same smoothing, and genuine
   refraction of the backdrop via an SVG displacement filter — see
   GlassLens.jsx for how that is possible at all.

   Everything dimensional is lifted from ring/tag.js and ring/params.js rather
   than eyeballed, so the two read as the same object:

     TAG_W 104 x TAG_H 40, radius TAG_H/2 (a pill)   ring/tag.js
     label 14px / weight 500                        params.tagSize etc.
     offset +64 x, +38 y from the cursor             params.tagX / tagY
     frost 0.16, rim 0.02                            params.tagFrost / tagRim

   tagY is -38 in the ring because that space has Y up; on screen it is +38,
   i.e. below and right of the cursor. The offset exists so the tag does not
   cover the thing being pointed at.

   ── Why this does not replace the link ──────────────────────────────────
   A hover-only affordance is not a control: it cannot be focused, cannot be
   reached by keyboard, and does not exist on touch. So the tag is decoration
   over a real <a>/<Link>, never a substitute for one. Callers keep their
   actual link and pass a ref to it; below `tagFrom`, or on any device without
   a fine pointer, this renders nothing and the caller's own visible button
   stays as the affordance.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { GLASS_LENS } from './GlassLens'

const FONT = "'DM Sans', sans-serif"

/* ring/tag.js */
const TAG_W = 104
const TAG_H = 40
/* ring/params.js */
const TAG_SIZE = 14
const TAG_WEIGHT = 500
const TAG_X = 64
const TAG_Y = 38
const TAG_FROM = 1024

export default function CursorTag({ targetRef, label = 'View', enabled = true }) {
  const tagRef = useRef(null)

  useEffect(() => {
    const target = targetRef?.current
    const tag = tagRef.current
    if (!target || !tag) return

    /* Both tests, as the ring does: the media query covers a mouse, the width
       covers a large tablet that reports hover but has no cursor to hang this
       from. Re-evaluated on change so a window dragged across the threshold
       resolves rather than stranding the tag. */
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    let live = enabled && mq.matches && window.innerWidth > TAG_FROM

    const sync = () => {
      live = enabled && mq.matches && window.innerWidth > TAG_FROM
      if (!live) gsap.set(tag, { opacity: 0, scale: 0.6 })
    }
    /* Run once on mount and whenever `enabled` flips, so a tag that is
       switched off while the cursor is still inside its target hides
       immediately rather than waiting for a pointerleave that may never
       come — the section it was over just changed under the cursor. */
    sync()
    mq.addEventListener('change', sync)
    window.addEventListener('resize', sync)

    /* quickTo rather than a per-frame chase: it is the same smoothing idea as
       the ring's `lag`, and it is already how this site moves the hero's
       "{ scroll down }" label, so the two feel identical. */
    const toX = gsap.quickTo(tag, 'x', { duration: 0.42, ease: 'power3' })
    const toY = gsap.quickTo(tag, 'y', { duration: 0.42, ease: 'power3' })

    const place = (e) => {
      toX(e.clientX + TAG_X)
      toY(e.clientY + TAG_Y)
    }

    const onEnter = (e) => {
      if (!live) return
      /* Jumped, not tweened, on the way in — easing from wherever the cursor
         last was would sweep the tag across the page to reach you. */
      gsap.set(tag, { x: e.clientX + TAG_X, y: e.clientY + TAG_Y })
      gsap.to(tag, { opacity: 1, scale: 1, duration: 0.32, ease: 'power3.out' })
    }
    const onLeave = () => {
      gsap.to(tag, { opacity: 0, scale: 0.6, duration: 0.28, ease: 'power2.in' })
    }

    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointermove', place)
    target.addEventListener('pointerleave', onLeave)

    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointermove', place)
      target.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(tag)
    }
  }, [targetRef, enabled])

  /* Portalled to <body>: the tag has to sit above everything and be positioned
     against the viewport, and any ancestor with a transform, filter or
     clip-path — all three exist on this page — would otherwise become its
     containing block and drag it out of place. */
  return createPortal(
    <div
      ref={tagRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full opacity-0"
      style={{
        width: TAG_W,
        height: TAG_H,
        /* Real refraction, not frost. The lens displaces the backdrop by
           1.33x about the pill's centre — see GlassLens.jsx — so the thing
           under the cursor is genuinely magnified inside the pill, as it is
           on the /work ring.

           The fill drops from 0.16 to 0.06 and the blur from 14px to 1px,
           because both were there to STAND IN for refraction. Left as they
           were they would wash out and smear the very thing the lens is now
           bending, and the effect would be invisible. saturate keeps what
           shows through reading as glass rather than as grey. */
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: `${GLASS_LENS} blur(1px) saturate(1.35)`,
        WebkitBackdropFilter: `${GLASS_LENS} blur(1px) saturate(1.35)`,
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow:
          '0 6px 24px rgba(43, 35, 28, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
        willChange: 'transform, opacity',
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: TAG_SIZE,
          fontWeight: TAG_WEIGHT,
          color: 'var(--walnut)',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>,
    document.body,
  )
}
