/* ═══════════════════════════════════════════════════════════════════════════
   USEFITTEXT.JS — size a single line of type to fill its container

   Set how much of the container to fill and nothing else. The ratio between
   a font-size and the width that text comes out at is MEASURED, not written
   down, so this keeps working when the words change, the face changes, or
   the tracking changes.

   ── Why not CSS ─────────────────────────────────────────────────────────
   The footer name used to carry this:

     font-size: calc((min(110rem, 100vw) - 2 * var(--page-gutter-x)) / 13)

   which is the column width divided by a number hand-derived from this one
   string in this one font: "Kataliya Sungkamee" in Coneria at -0.035em
   occupies 12.731px of width per 1px of font-size, so dividing by 13 filled
   98% of the column. It worked, and it was a trap — the 13 is invisibly
   bound to the text, the face and the letter-spacing, and silently wrong if
   any of the three is edited. Rename the site and the name overflows.

   It also cannot react to a webfont swap. On a cold cache the fallback face
   is much narrower, so a CSS-sized name arrives undersized and stays that
   way; a warm cache hides it completely, which is what makes it easy to
   miss. See the equivalent note in Home.jsx's hero fit, where that bug was
   measured at 2560px: 2812px of name in an 1800px column.

   ── How ─────────────────────────────────────────────────────────────────
   Render at whatever size CSS says, read the line's natural nowrap width,
   divide to get that element's own width-per-font-pixel, then solve for the
   size that fills the container. The ratio is scale-invariant, so one pass
   lands exactly rather than converging.

   useLayoutEffect so it resolves before paint — no flash of the unfitted
   size. Re-runs on container resize and once webfonts settle, because those
   are the two things that change the answer.

   ── Where the dial lives ────────────────────────────────────────────────
   In the CSS, as --fit-fill on the element itself:

     .footer-name-given { --fit-fill: 0.98; }

   1 is edge to edge, 0.98 leaves a sliver inside the gutters, 0.8 is small.
   It is read here rather than passed as a prop because every other thing
   about how this type looks — face, tracking, colour, the relief — is set in
   shared.css, and a size knob sitting alone in a JSX argument is a knob
   nobody finds. The `fill` option stays as the fallback for a caller with no
   stylesheet of its own.

   It is read inside fit() rather than once on mount, so editing the value
   takes effect on the next resize or font settle without a remount.

   The element must be `white-space: nowrap`, or scrollWidth reports the
   wrapped width and the fit solves for the wrong thing.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useLayoutEffect } from 'react'

export default function useFitText(ref, { fill = 1, deps = [] } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    const box = el?.parentElement
    if (!el || !box) return

    const fit = () => {
      const cs = getComputedStyle(el)
      const available = box.clientWidth
      const base = parseFloat(cs.fontSize)
      if (!available || !base) return
      /* --fit-fill from the stylesheet wins; `fill` is the fallback. */
      const declared = parseFloat(cs.getPropertyValue('--fit-fill'))
      const amount = Number.isFinite(declared) ? declared : fill
      /* scrollWidth is the natural single-line width at the CURRENT size, so
         this ratio is "width per 1px of font-size" for this exact string in
         whatever face is actually loaded right now. */
      const ratio = el.scrollWidth / base
      if (!ratio) return
      el.style.fontSize = `${(available * amount) / ratio}px`
    }

    fit()

    const ro = new ResizeObserver(fit)
    ro.observe(box)

    /* The observer watches the CONTAINER, which does not change size when a
       webfont swaps in — only the text inside it does. So the swap has to be
       waited on separately or the fit is left solved against the fallback. */
    let alive = true
    document.fonts?.ready.then(() => { if (alive) fit() })

    return () => {
      alive = false
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill, ...deps])
}
