/* ═══════════════════════════════════════════════════════════════════════════
   DISCIPLINES.JSX — the "what I actually do" section, below the Home hero

   Two-column block per discipline, after the agency-services layout the
   reference screenshot uses:

     Number | Service                          <- column header + rule
     ┌──────────────────┬──────────────────────┐
     │  BIG NUMERAL     │  + (Category)        │
     │  (script face)   │  ● Title             │
     │                  │  label ....... detail│  x5, hairline per row
     │  blurb           │                      │
     └──────────────────┴──────────────────────┘

   The expanded row used to also carry a label over the blurb, a draggable
   photo strip and a "See the work" button. All three are gone: the strip
   showed the same /images/about photos the About page already runs, and the
   button sent a reader to /work from inside a row whose own title is already
   a link there.

   Type is this site's, not the reference's. The big numeral is Coneria
   Script Slanted — the same face as the hero name, which is what keeps this
   section reading as part of the same site rather than a lifted template.
   The reference used a high-contrast script numeral for exactly this job, so
   it is a like-for-like swap. Everything else is DM Sans, matching the nav,
   the /work ring's labels and the tldr; block.

   AI is deliberately NOT a fifth discipline, and no longer has a note of its
   own either. It was a standing claim with nothing under it demonstrating the
   claim, and two of its three sentences were spent answering an objection the
   reader had not raised yet. The case study takeaways make the argument where
   there is work to back it.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarqueeTitle from './MarqueeTitle'
import MicroLabel from './MicroLabel'
import CursorTag from './CursorTag'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

/* THESE ARE CSS VALUES, NOT TOKEN NAMES. Each one is dropped straight into
   style={{ background: d.accent }}, so it has to be something CSS can parse:
   'var(--jade-ink)', not 'jade-ink'. Getting that wrong fails silently in
   both directions — React does not validate inline style values, and the
   browser discards a declaration it cannot parse without logging anything,
   so the only symptom is a dot that renders as a transparent circle.

   Accent per discipline, one each. This cycled three tokens across four
   disciplines, so Product Strategy and Brand & Strategy both came out jade;
   --aqua was added to close that. It matters more than it used to, because
   the accent is no longer only this dot — Selected work tints each card's
   micro-label and its hover with the SAME discipline's accent, so colour is
   what ties a card in (01) to its row in (04), and a repeat is two cards
   claiming one discipline. Change one here and change the matching `ink` in
   SelectedWork.jsx, which carries the text-safe version of the same colour.
   The old note still applies if a fifth is ever added: they sit far enough
   apart vertically that it does not read as a mistake. Adding a fourth
   accent token would remove the repeat if that ever matters. */
const DISCIPLINES = [
  {
    numeral: '1',
    category: 'Product',
    title: 'Product Strategy & Design',
    accent: 'var(--jade-ink)',
    rows: [
      ['Research', 'User interviews & insight mapping'],
      ['Systems', 'Design tokens, components & documentation'],
      ['Prototyping', 'Figma, Figma Make & rapid concept testing'],
      ['Handoff', 'Specs, redlines & dev collaboration'],
    ],
    blurb:
      ' ',
  },
  {
    numeral: '2',
    category: 'Engineering',
    title: 'Front-End Development',
    accent: 'var(--orchid-ink)',
    rows: [
      ['Interfaces', 'React, Swift & component architecture'],
      ['Motion', 'GSAP timelines, ScrollTrigger & Lenis'],
      ['Native', 'SwiftUI & iOS interaction patterns'],
      ['Ship', 'Vite, Vercel, Xcode & deploy workflow'],
    ],
    blurb:
      ' ',
  },
  {
    numeral: '3',
    category: 'Content',
    title: 'Social & Content',
    accent: 'var(--gold-ink)',
    rows: [
      ['Direction', 'Concept, storyboards & shot planning'],
      ['Edit', 'CapCut, Final Cut Pro, pacing & sound'],
      ['Graphics', 'Firefly, Photoshop, Illustrator & Canva systems'],
      ['Social', 'Short-form formats, hooks & series design'],
    ],
    blurb:
      ' ',
  },
  {
    numeral: '4',
    category: 'Brand',
    title: 'Brand & Strategy',
    accent: 'var(--aqua-ink)',
    rows: [
      ['Identity', 'Marks, type systems & visual language'],
      ['Positioning', 'Audience, voice & differentiation'],
      ['Growth', 'Content strategy, funnels & community'],
      ['Measure', 'Analytics, iteration & reporting'],
    ],
    blurb:
      ' ',
  },
]

function Block({ d, reduceMotion }) {
  const ref = useRef(null)
  const bodyRef = useRef(null)
  const navigate = useNavigate()
  /* Closed on first load, all four. */
  const [open, setOpen] = useState(false)

  /* The ORIGINAL two-column block, unchanged — Number|Service header, big
     numeral left, category / title / rows / CTA right, blurb bottom-left.
     What collapses is the whole service's CONTENT (numeral aside): the rows,
     the photo strip, the CTA and the blurb all go together, so the control
     acts on the service rather than on its row list.

     The title row stays put inside the right column rather than being lifted
     out into a header bar, which is what keeps the layout identical to the
     uncollapsed design. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const panels = el.querySelectorAll('.disc-panel')
    if (!panels.length) return
    if (reduceMotion) {
      gsap.set(panels, { height: open ? 'auto' : 0, opacity: open ? 1 : 0 })
      return
    }
    /* height:auto is animatable by GSAP — it measures, tweens, then restores
       auto — which keeps this correct when the type reflows at a different
       width. A baked px height would go stale on resize. */
    const tween = gsap.to(panels, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: open ? 0.62 : 0.44,
      ease: open ? 'power3.out' : 'power2.in',
    })
    return () => tween.kill()
  }, [open, reduceMotion])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const numeral = el.querySelector('.disc-numeral')
    const head = el.querySelectorAll('.disc-head')
    if (reduceMotion) {
      gsap.set([numeral, ...head].filter(Boolean), { opacity: 1, y: 0, filter: 'blur(0px)' })
      return
    }
    gsap.set(numeral, { opacity: 0, filter: 'blur(14px)', scale: 0.94 })
    gsap.set(head, { opacity: 0, y: 18 })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })
    tl.to(numeral, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
    tl.to(head, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.15)
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduceMotion])

  return (
    <div ref={ref} className="pt-10 md:pt-16">
      {/* Only while COLLAPSED. The tag is the invitation to open — with the
          arrow gone it reads as "view this", which is what the click does.
          Once open there is nothing left to invite, and a tag still riding
          the cursor over content the reader is already reading is noise.

          Anywhere on a collapsed service opens it, so the whole row is the
          target the tag implies rather than just the title. */}
      <CursorTag targetRef={ref} label="View" enabled={!open} />

      <div
        ref={bodyRef}
        className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 pt-10 md:pt-14 ${
          open ? '' : 'md:cursor-pointer'
        }`}
        onClick={(e) => {
          if (open || e.target.closest('a, button, .drag-strip')) return
          setOpen(true)
        }}
      >
        <div className="flex flex-col gap-12">
          <div
            className="disc-numeral leading-[0.8] text-[clamp(7rem,13vw,15rem)] text-[var(--walnut)] will-change-[opacity,transform,filter]"
            style={{ fontFamily: SCRIPT_FONT }}
            aria-hidden="true"
          >
            {d.numeral}
          </div>

          <div className="disc-panel overflow-hidden h-0 opacity-0" aria-hidden={!open} inert={!open ? '' : undefined}>
            <div className="max-w-[560px]">
              <p
                className="text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.3] text-[var(--walnut)]"
                style={{ fontFamily: FONT, fontWeight: 500 }}
              >
                {d.blurb}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="disc-head mb-5">
            <MicroLabel>{d.category}</MicroLabel>
          </div>

          {/* The title row is the control. The "+" is this page's own
              micro-label glyph rather than a widget icon, and it rotates 45deg
              into a cross when open — the one gesture that reads as
              expand/collapse without a label. The count says what expanding
              will produce before you do it. */}
          <h3 className="disc-head mb-10">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="group flex w-full items-center gap-4 text-left bg-transparent border-0 p-0 cursor-pointer text-[clamp(1.75rem,2.6vw,2.4rem)] leading-[1.2] text-[var(--walnut)]"
              style={{ fontFamily: FONT, fontWeight: 500 }}
            >
              <span
                aria-hidden="true"
                className="inline-block w-[0.42em] h-[0.42em] rounded-full shrink-0"
                style={{ background: d.accent }}
              />
              <span className="flex-1">{d.title}</span>
              <span
                className="text-[16px] tabular-nums text-[var(--walnut-faint)] shrink-0"
                style={{ fontFamily: FONT, fontWeight: 400 }}
              >
                {open ? 'Close' : `${d.rows.length} areas`}
              </span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-[1.1em] leading-none text-[var(--walnut-soft)] transition-transform duration-500 ease-out ${
                  open ? 'rotate-45' : 'group-hover:rotate-90'
                }`}
              >
                +
              </span>
            </button>
          </h3>

          <div className="disc-panel overflow-hidden h-0 opacity-0" aria-hidden={!open} inert={!open ? '' : undefined}>
            <dl>
              {d.rows.map(([label, detail]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-6 py-3 border-b border-[var(--border-alpha)]"
                >
                  <dt
                    className="text-[16px] leading-[1.54] text-[var(--walnut)] shrink-0"
                    style={{ fontFamily: FONT, fontWeight: 400 }}
                  >
                    {label}
                  </dt>
                  <dd
                    className="text-[16px] leading-[1.54] text-[var(--walnut-soft)] text-right"
                    style={{ fontFamily: FONT, fontWeight: 400 }}
                  >
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function Disciplines({ reduceMotion = false }) {
  return (
    <section
      id="disciplines"
      className="relative w-full overflow-hidden bg-[var(--ivory-deep)] seam-under-ivory pt-10 md:pt-12 pb-16 md:pb-24"
    >
      <MarqueeTitle
        script="Disciplines"
        number="04"
        sans="by Kataliya Sungkamee"
        ariaLabel="Disciplines, section four, by Kataliya Sungkamee"
        reduceMotion={reduceMotion}
        className="mb-8 md:mb-10"
      />

      <div className="page-content-shell">
        {/* The section's premise, stated before the evidence rather than
            after it.

            This sat at the BOTTOM until now, and the argument for that was
            specific: each discipline used to name its own AI stage in its
            rows — Synthesis, Velocity, Generation, Exploration — so by the
            time a reader reached this line it was summarising a pattern they
            had already seen four times. Those rows are gone, so that argument
            is gone with them; the sentence is a standalone claim wherever it
            sits, and a claim reads better as a premise than as an
            afterthought.

            Set as the "Number / Service" column labels are — 16px, 1.54,
            walnut-soft, weight 400 — so it reads as part of the table's own
            furniture rather than as a headline above it. It briefly ran at
            the body tier in full walnut, which competed with the marquee.

            The MEASURE narrows with the size. 720px was the right column for
            21.6px text; the same box at 16px runs to about 95 characters a
            line, well past comfortable. 540px is that measure scaled by the
            same ratio (725 x 16/21.6), which keeps it near the 65-75
            characters the rest of the site's prose sits at.

            No rule above it: the hairline under "Number / Service" already
            separates it from the table, so a second one would say the same
            thing twice. */}
        {/* Once, at the top. It labels the two columns every service below is
            laid out on, so repeating it per service made it read as four
            separate tables rather than one. */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 pb-4 border-b border-[var(--border-alpha)] text-[16px] leading-[1.54] text-[var(--walnut-soft)]"
          style={{ fontFamily: FONT, fontWeight: 400 }}
        >
          <span>Number</span>
          <span className="hidden md:block">Service</span>
        </div>

        {DISCIPLINES.map((d) => (
          <Block key={d.numeral} d={d} reduceMotion={reduceMotion} />
        ))}
      </div>
    </section>
  )
}
