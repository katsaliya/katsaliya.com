/* ═══════════════════════════════════════════════════════════════════════════
   DRAGSTRIP.JSX — a horizontal photo strip you drag

   Built on a native overflow-x scroller rather than a transformed track. That
   choice buys three things for free that a custom transform has to
   reimplement badly: a trackpad's two-finger swipe, touch scrolling with the
   platform's own physics, and keyboard access via the scroll container. The
   drag handler only adds pointer-drag on top of what the browser already
   does.

   Momentum is the part the browser will not give you for a pointer drag, so
   it is added: release velocity is measured over the last few moves and then
   bled off on the ring's own decay curve (0.94 per 60fps frame, from
   params.damping), which is what makes a flick here feel like a flick on the
   carousel.

   Click suppression matters more than it looks. Without it every drag that
   ends over a photo also fires a click, so a strip of linked images navigates
   the moment you let go of a throw. A travel threshold decides which gesture
   it was, exactly as the ring does with `pointerTravel`.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'

/* px of pointer travel past which the gesture is a drag, not a click.
   The ring uses 5 for the same decision. */
const DRAG_SLOP = 5
/* velocity kept per 60fps frame after release — ring/params.js `damping` */
const DAMPING = 0.94

export default function DragStrip({
  items = [],
  reduceMotion = false,
  className = '',
  /* When set, items are sized by HEIGHT and their width follows from the
     aspect ratio. That is what keeps a strip short: sizing by width (as a vw
     column) makes height a function of the viewport's width, so a wide window
     produced a very tall strip. */
  height,
}) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let down = false
    let dragging = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0
    let raf = 0

    const stopMomentum = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onDown = (e) => {
      /* Mouse only. On touch the browser's own scrolling is better than
         anything reimplemented here, and hijacking it costs the rubber-band. */
      if (e.pointerType === 'touch') return
      stopMomentum()
      down = true
      dragging = false
      startX = lastX = e.clientX
      startScroll = el.scrollLeft
      lastT = performance.now()
      velocity = 0
    }

    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!dragging && Math.abs(dx) > DRAG_SLOP) {
        dragging = true
        el.setPointerCapture?.(e.pointerId)
        el.classList.add('is-dragging')
      }
      if (!dragging) return
      e.preventDefault()
      el.scrollLeft = startScroll - dx

      const now = performance.now()
      const dt = Math.max(8, now - lastT)
      /* px per frame, which is the unit DAMPING is quoted in */
      velocity = ((e.clientX - lastX) / dt) * 16.67
      lastX = e.clientX
      lastT = now
    }

    const glide = () => {
      velocity *= DAMPING
      el.scrollLeft -= velocity
      if (Math.abs(velocity) > 0.4) raf = requestAnimationFrame(glide)
      else raf = 0
    }

    const onUp = (e) => {
      if (!down) return
      down = false
      el.releasePointerCapture?.(e.pointerId)
      el.classList.remove('is-dragging')
      if (dragging && !reduceMotion && Math.abs(velocity) > 1) raf = requestAnimationFrame(glide)
    }

    /* Capture phase: this has to win before the click reaches a child. */
    const onClick = (e) => {
      if (!dragging) return
      e.preventDefault()
      e.stopPropagation()
      dragging = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('click', onClick, true)

    return () => {
      stopMomentum()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [reduceMotion])

  return (
    <div
      ref={scrollerRef}
      /* scrollbar hidden but the element is still a real scroller, so a
         trackpad swipe and the keyboard both keep working. cursor-grab is the
         only signal that it is draggable, so it matters. */
      className={`drag-strip flex gap-4 md:gap-6 overflow-x-auto overscroll-x-contain cursor-grab select-none ${className}`}
      style={{ scrollbarWidth: 'none' }}
      tabIndex={0}
      role="group"
      aria-label="Photos, drag or scroll sideways"
    >
      {items.map((src, i) => (
        <figure
          key={src + i}
          className={`shrink-0 m-0 ${height ? '' : 'w-[62vw] sm:w-[42vw] md:w-[26vw] lg:w-[21vw]'}`}
          style={height ? { height } : undefined}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            draggable={false}
            className="block object-cover rounded-[4px] pointer-events-none"
            style={
              height
                ? { height: '100%', width: 'auto', aspectRatio: i % 3 === 0 ? '3 / 4' : '4 / 3' }
                : { width: '100%', height: '100%', aspectRatio: i % 3 === 0 ? '3 / 4' : '1 / 1' }
            }
          />
        </figure>
      ))}
    </div>
  )
}
