/* ═══════════════════════════════════════════════════════════════════════════
   FANLOADER.JSX — the arrival

   An ivory ground, a fan folded shut in the middle of it. It opens, then
   flies to the corner and becomes the nav's own fan.

   This replaces the name loader, which staged "Kataliya Sungkamee" at the
   centre of the viewport and flew it into the wordmark slot. Same idea, a
   different object: the mark that does something on every page is the one
   worth introducing, and the fold is already the site's one piece of
   choreography.

   ── CAREFUL WITH `open` ────────────────────────────────────────────────
   FanMark's prop describes the MENU, not the fan. open=true is the menu
   open, which is the fan SHUT. So this starts at open={true} — folded —
   and sets it false to unfold. Reading it the other way round gives you a
   loader that starts spread and closes, which is the opposite of the
   gesture.

   ── The flight is a FLIP against the real mark ─────────────────────────
   The destination is measured off the nav's own fan rather than written
   down, so the two cannot disagree when the bar changes size — which it
   does, between breakpoints and whenever --nav-h is republished. The
   loader lands exactly on top of the real one and crossfades, so there is
   no jump at the handoff.

   ── Fail open ──────────────────────────────────────────────────────────
   Same reasoning as the curtain it replaces: everything here is one
   timeline, and if it never runs the page is a blank ivory screen with no
   way out. The ground is removed on a timer regardless, and onDone is
   called even when the nav mark cannot be found.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FanMark from './FanMark'

export default function FanLoader({ onDone, reduceMotion = false }) {
  const groundRef = useRef(null)
  const fanRef = useRef(null)
  const doneRef = useRef(null)
  doneRef.current = onDone
  /* Starts SHUT. See the note above about what `open` means. */
  const [shut, setShut] = useState(true)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    const ground = groundRef.current
    const fan = fanRef.current

    const finish = () => {
      doneRef.current?.()
      setGone(true)
    }

    if (reduceMotion || !ground || !fan) {
      setShut(false)
      finish()
      return
    }

    /* The nav's own fan — the thing this one turns into. Queried rather
       than passed as a ref because the Nav is a sibling, and threading a
       ref up through the page to hand back down is more wiring than one
       selector for a node that is guaranteed to be mounted by now. */
    const target = document.querySelector('.site-nav .fan-mark')

    /* ── THE ORDER, and the hold is the point of writing it this way ──
       Four beats, each waiting for the one before it to actually finish
       rather than overlapping:

         0.00  shut, blurred, invisible
         0.62  in focus and at full opacity — the fade is OUT OF A BLUR,
               so it resolves rather than just appearing
         0.62  unfold begins
         1.16  unfold complete. UNFOLD is 544ms, not a guess: the blades
               carry a 460ms CSS transition plus a stagger that runs to
               12 x 7ms on the last one, and the hold has to start after
               the last blade lands or it is not a hold
         2.16  one full second of the fan simply open
         3.16  landed in the bar

       Spelled out as constants because the beats depend on each other —
       changing the unfold in shared.css and not here would silently eat
       the pause. */
    const FADE = 0.62
    const UNFOLD = 0.544
    const HOLD = 1.0
    const FLY = 1.0
    const openAt = FADE
    const openDone = openAt + UNFOLD
    const flyAt = openDone + HOLD

    const tl = gsap.timeline()
    gsap.set(fan, { autoAlpha: 0, scale: 0.96, filter: 'blur(16px)' })

    tl.to(fan, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: FADE,
      ease: 'power2.out',
    }, 0)

    tl.call(() => setShut(false), null, openAt)

    if (target) {
      /* tl.call, NOT tl.add. add()'s signature is (child, position), so a
         third argument is simply dropped and the callback lands at
         whatever the timeline's end happened to be when it was added —
         which here was 0.62s, firing the flight before the fan had
         finished unfolding and eating the hold entirely. */
      tl.call(() => {
        const a = fan.getBoundingClientRect()
        const b = target.getBoundingClientRect()
        /* Measured at the moment of the flight, not on mount: the blades
           have just unfolded and the box is a different shape from the
           one it had while shut. */
        gsap.to(fan, {
          x: b.left + b.width / 2 - (a.left + a.width / 2),
          y: b.top + b.height / 2 - (a.top + a.height / 2),
          scale: b.width / a.width,
          duration: FLY,
          ease: 'power3.inOut',
        })
      }, null, flyAt)
    }

    /* The ground lifts while the fan is still travelling, so the page is
       there to receive it rather than appearing after it has landed. */
    tl.to(ground, { autoAlpha: 0, duration: 0.5, ease: 'none' }, flyAt + 0.55)
    tl.call(finish, null, flyAt + 0.7)
    /* Dissolves into the real mark underneath, already at the same size
       in the same place. */
    tl.to(fan, { autoAlpha: 0, duration: 0.3, ease: 'none' }, flyAt + FLY - 0.05)

    const bail = setTimeout(finish, 7000)
    return () => {
      clearTimeout(bail)
      tl.kill()
    }
  }, [reduceMotion])

  if (gone) return null

  return (
    <div
      ref={groundRef}
      aria-hidden="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-[var(--ivory)] pointer-events-none"
    >
      <div ref={fanRef} className="will-change-transform">
        <FanMark open={shut} className="w-[150px] h-[174px] md:w-[210px] md:h-[244px]" />
      </div>
    </div>
  )
}
