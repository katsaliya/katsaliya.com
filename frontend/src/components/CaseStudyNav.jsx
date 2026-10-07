/* ═══════════════════════════════════════════════════════════════════════════
   CASESTUDYNAV.JSX — the case study's own section bar

   Sits directly under the shared nav and sticks there. It is placed AFTER the
   hero in the flow rather than fixed, so `position: sticky` handles its
   appearance on its own: it is out of frame while the masthead is on screen,
   and pins the moment the reader reaches the body. No scroll listener, no
   fade-in, nothing to keep in sync.

   ON THE LEFT, HORIZONTALLY. A vertical rail in the left margin is the more
   obvious reading of "on the left side", and it does not fit: the shell's
   padding is clamp(24px, 4vw, 53px), so at 1440 there are 53px between the
   viewport edge and the first character of body text — about half of what
   "overview" needs. It only opens up past 1906px, where the shell stops
   growing and centres. Rather than build a nav that appears on one monitor
   in ten, the links are left-aligned in a bar the full width of the shell.

   The active state is an IntersectionObserver rather than a scroll handler.
   A scroll handler on a 10,000px page runs on every frame of every scroll to
   answer a question that changes four times in total.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'

/* Cleared height of the bar above (17px pad + 48px wordmark + 14px pad) plus
   this bar's own, so a jump lands the heading below both rather than under
   them. Measured, not guessed — see the note in case-study.css. */
/* The shared bar's height, read from the custom property Nav.jsx measures
   and publishes. It was a hardcoded 79 here as well as in the stylesheet,
   and it was wrong in both for the same reason — the bar changed. */
const OWN_HEIGHT = 46
const sharedNav = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
  ) || 79

export default function CaseStudyNav({ movements }) {
  const [active, setActive] = useState(movements[0]?.id)
  const ref = useRef(null)

  useEffect(() => {
    const sections = movements
      .map((m) => document.getElementById(m.id))
      .filter(Boolean)
    if (!sections.length) return

    /* The band is the strip just under the two bars. A section is "current"
       while its top edge is above that line and its bottom is still below —
       which is what a reader would say is on screen, and is not what a naive
       "most visible" test returns on a section three viewports tall. */
    const pick = () => {
      const line = sharedNav() + OWN_HEIGHT + 8
      let current = sections[0]
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s
      }
      setActive(current.id)
    }

    const io = new IntersectionObserver(pick, {
      rootMargin: `-${sharedNav() + OWN_HEIGHT}px 0px 0px 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })
    sections.forEach((s) => io.observe(s))
    pick()
    return () => io.disconnect()
  }, [movements])

  /* ── PINNED OR NOT, and the glass depends on it ──────────────────────
     Two backdrop-filters that share an edge do not line up. Each blurs only
     what is behind its own box and clamps its sampling at the boundary, so
     where the content behind has any contrast crossing that line the two
     resolve to different colours — measured at up to 81 levels apart, which
     is the visible seam between this bar and the one above it.

     The only real fix is one blurred region rather than two. While this bar
     is pinned it sits exactly under the shared bar, so its own glass can be
     stretched up to cover both and the shared bar's can be switched off —
     see .cs-secnav[data-pinned] in case-study.css.

     That is only true WHILE PINNED. Unpinned, this bar is somewhere down the
     page and a glass panel reaching --nav-h above it would hang over the
     masthead, so the stretch has to be gated on the state. */
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const check = () => {
      frame = 0
      /* +1 for subpixel: a sticky element settles a fraction below its own
         top value and a strict compare flickers the state every frame. */
      setPinned(el.getBoundingClientRect().top <= sharedNav() + 1)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* The shared bar has to know too, so it can drop its own glass. It is a
     different component entirely, so this goes through the body. */
  useEffect(() => {
    document.body.classList.toggle('secnav-pinned', pinned)
    return () => document.body.classList.remove('secnav-pinned')
  }, [pinned])

  const jump = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - (sharedNav() + OWN_HEIGHT)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav
      ref={ref}
      className="cs-secnav"
      data-pinned={pinned ? 'true' : 'false'}
      aria-label="Sections of this case study"
    >
      <div className="page-content-shell cs-secnav-inner">
        {movements.map((m) => {
          const current = active === m.id
          return (
            <a
              key={m.id}
              href={`#${m.id}`}
              onClick={(e) => jump(e, m.id)}
              className={`cs-secnav-link ${current ? 'is-current' : ''}`}
              aria-current={current ? 'true' : undefined}
            >
              {m.sans}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
