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
const SHARED_NAV = 79
const OWN_HEIGHT = 46

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
      const line = SHARED_NAV + OWN_HEIGHT + 8
      let current = sections[0]
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s
      }
      setActive(current.id)
    }

    const io = new IntersectionObserver(pick, {
      rootMargin: `-${SHARED_NAV + OWN_HEIGHT}px 0px 0px 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })
    sections.forEach((s) => io.observe(s))
    pick()
    return () => io.disconnect()
  }, [movements])

  const jump = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - (SHARED_NAV + OWN_HEIGHT)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav ref={ref} className="cs-secnav" aria-label="Sections of this case study">
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
