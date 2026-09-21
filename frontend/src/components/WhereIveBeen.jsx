/* ═══════════════════════════════════════════════════════════════════════════
   WHEREIVEBEEN.JSX — the record, below "How I got here"

   Text-led, image-supported. Each entry is an organisation, a short meta line
   and one sentence, with an image beside it at roughly a third of the row —
   present, but clearly the accompaniment rather than the subject.

   Deliberately not the Disciplines format. That section is a dense ruled
   table: two columns, a header row, five label/detail pairs per block, a
   numeral. Repeating it would make the page read as one long table with
   different words in it. The alternating sides here are the main thing
   keeping this from collapsing back into a table — nothing lines up into a
   grid, so the eye reads entries rather than rows and columns.

     Disciplines      ruled two-column table, numerals, dense text, no images
     How I got here   single centred prose column, no images
     Where I've been  alternating entries, text-led, one image each

   ONE SENTENCE PER ENTRY, no more. The resume is the document for detail;
   this is the version someone reads in fifteen seconds. Every `note` below is
   drawn from copy that already exists on this site rather than written fresh
   — see the data comment.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeTitle from './MarqueeTitle'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"

/* `note` is sourced from this site's own words wherever one exists — the
   "How I got here" narrative and the previous About page — so nothing here is
   invented. The two entries without one have no source on the site: there is
   copy about Emporium Thai, The 310 Table, SUGAR Network and SFSU, but none
   about Allied Global Marketing or Known beyond the handles themselves.
   `dates` IS ONLY FILLED WHERE THE NARRATIVE IMPLIES IT, AND THOSE THREE ARE
   Ascending, not reverse-chronological. A resume runs newest-first because
   it is scanned for a current title; this is read as a story, and read
   upward it is one — support, to marketing, to growth, to leading product.
   The arc is the argument, and reversing it throws that away.

   Dates and roles are the author's own now; nothing here is inferred.

   Images show WHOLE — no fixed ratio, no crop — so they can be any shape.
   All five are the real photographs now.

   Every one was normalised on the way in, and two of the three fixes only
   ever fail in production: uppercase .JPG/.jpeg extensions (macOS is
   case-insensitive, the deploy target is not, so a lowercase reference
   resolves locally and 404s once live) and 600 permissions where every other
   asset is 644. The third is size — the originals ran to 6.4MB for a frame
   that renders at 300px, so all are capped at 1400px. */
const ENTRIES = [
  {
    org: 'Apple',
    dates: 'Apr 2022 – Jun 2023',
    role: 'Sales Specialist',
    note: 'Technical support, translating complex product issues into plain language — 200+ resolved conversations a week, 100 NPS.',
    /* Apple Union Square. A 3:4 portrait, shown whole — logo and all — now
       that the frame follows the file instead of the other way round.
       Served from the 1600px .jpg, not the 2.7MB .jpeg original, which is
       still in this folder and can be deleted. */
    image: '/images/about/apple-union-square.jpg',
  },
  {
    org: 'Allied Global Marketing',
    dates: 'Jan 2025 – Jun 2025',
    role: 'Field Marketing Intern',
    note: 'Drafted and executed marketing pitches for 50+ Bay Area film releases, securing partnerships with 20+ regional partners.',
    image: '/images/about/allied-global-marketing.jpg',
  },
  {
    org: 'Known',
    dates: 'Jun 2025 – Sep 2025',
    role: 'Growth Associate, promoted from intern',
    note: 'Owned growth end-to-end — design, content & events — for an early-stage dating startup, driving 3M+ impressions, 10K+ followers, and scaling onboarding to 5K+ users.',
    image: '/images/about/known.jpg',
  },
  {
    org: 'SUGAR Network',
    dates: 'Sep 2025 – Jun 2026',
    role: 'Product Design & Engineering Lead',
    note: 'BlueCore, an AI paperwork platform for maritime workers — cut documentation time 80%, from up to 40 minutes to under 4. 1st place at SF Hacks, presented at SAP Palo Alto.',
    image: '/images/about/sugar.jpg',
  },
  {
    org: 'Emporium Thai Market',
    dates: 'Jul 2026 – Present',
    role: 'Creative Lead',
    note: "Leading creative and consumer product strategy across web, design, and social for my family's second restaurant location launch.",
    image: '/images/about/emporium-thai-market.jpg',
  },
]

function Entry({ entry, flip }) {
  return (
    /* TWO HALVES, NO GUTTER. This was a 12-column grid with the text on 7 and
       the image on 4, which left column 8 empty between them — the two sides
       floated with a hole in the middle and neither had a fixed edge to sit
       against. Halves that meet give both a shared centre line: the image is
       flush to it, the text runs from the outer edge toward it.

       The text keeps an inner pad so it stops short of the line; the image
       does not, because the image touching it is the whole point. */
    <div className="wib-item grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-0">
      {/* Order swaps per entry. On mobile the image always follows the text —
          text-led is the point, and alternating it there would just look like
          a mistake. */}
      {/* EVERYTHING CONVERGES ON THE CENTRE LINE. The text's flush edge always
          faces the middle: right-aligned when it sits in the left half,
          left-aligned when it sits in the right. The image already meets that
          same line from the opposite side, so each row closes inward from both
          edges rather than reading as two independent columns.

          Note this is the INVERSE of aligning each column to the page's outer
          edge — the ragged edge here points outward, not inward.

          md: only. Below the breakpoint there is one column and no centre
          line, so both revert to plain left. */}
      <div
        className={flip ? 'md:order-2 md:pl-12' : 'md:order-1 md:pr-12 md:text-right'}
      >
        <h3
          className="text-[clamp(1.3rem,1.9vw,1.75rem)] leading-[1.25] text-[var(--walnut)]"
          style={{ fontFamily: FONT, fontWeight: 500 }}
        >
          {entry.org}
        </h3>
        {/* Stacked under the organisation rather than right-aligned across
            from it. Right-aligned dates scan faster on a resume because they
            form a column — but the sides alternate here, so there is no
            column for them to form, and they would instead read as the
            Disciplines table's label/detail pairing. Directly beneath the
            name keeps them in a predictable place per entry. */}
        {(entry.dates || entry.role) && (
          <p
            className="mt-2 text-[15px] leading-[1.5] text-[var(--walnut-faint)]"
            style={{ fontFamily: FONT, fontWeight: 400 }}
          >
            {/* One metadata line, not two. Dates keep the tracked uppercase
                that makes a year scan as a year; the role does NOT — it is
                mixed-case prose ("Growth Associate, promoted from intern")
                and uppercasing it at this length reads as shouting. Same
                size and colour holds them together as one line. */}
            {entry.dates && (
              <span className="tracking-[0.06em] uppercase">{entry.dates}</span>
            )}
            {entry.dates && entry.role && (
              <span aria-hidden="true" className="mx-2">·</span>
            )}
            {entry.role && <span>{entry.role}</span>}
          </p>
        )}
        {/* ml-auto is what actually moves it. text-align only decides where
            lines sit INSIDE the box; a max-w-[46ch] block still starts at the
            column's left edge, so on the right-aligned side the note would
            otherwise be right-aligned text floating on the far left of its
            half — worse than not doing it at all. */}
        {entry.note && (
          <p
            className={`mt-3 max-w-[46ch] ${flip ? '' : 'md:ml-auto'} text-[clamp(1.02rem,1.35vw,1.15rem)] leading-[1.65] text-[var(--walnut-soft)]`}
            style={{ fontFamily: FONT, fontWeight: 400 }}
          >
            {entry.note}
          </p>
        )}
      </div>

      {/* The image sits INSIDE its half, pushed to the inner edge so it meets
          the centre line — justify-end when it is the left half, justify-start
          when it is the right. The half is 667px at a 1334 shell and the
          image is capped well under that, so the outer side is deliberately
          open: the photo reads as anchored to the middle rather than as a
          column of its own.

          The cap is md+ ONLY. On a phone the row is one column and there is
          no centre line to meet, so a 300px cap just left a 27px orphan gap
          down the right of a 327px column. Full width there. */}
      <div className={`flex ${flip ? 'md:order-1 md:justify-end' : 'md:order-2 md:justify-start'}`}>
        <div className="wib-img w-full md:max-w-[300px] overflow-hidden rounded-[4px] bg-[var(--ivory)]">
          {/* NO fixed ratio and no crop. Every image here used to be forced
              into a 3:2 landscape box with object-cover, which meant a
              portrait source lost half its height — for the Apple shot, the
              whole top of the wall and the logo with it.

              The column width is fixed and the height follows the file, so
              each photo shows entire and the rows vary. That variation is
              the point: these are real photographs of different shapes, and
              a uniform frame was quietly editing them. `items-center` on the
              row keeps the text centred against whatever height results. */}
          <img
            src={entry.image}
            alt=""
            loading="lazy"
            className="block w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default function WhereIveBeen({ reduceMotion = false }) {
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const items = el.querySelectorAll('.wib-item')
    if (!items.length) return

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0 })
      gsap.set(el.querySelectorAll('.wib-img'), { y: 0 })
      return
    }

    gsap.set(items, { opacity: 0, y: 24 })
    const reveal = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })

    /* A small scrubbed drift on the images only — enough that the column is
       not static as you pass it, not enough to pull focus from the text. On
       the image wrapper rather than the row, so it cannot fight the reveal's
       own y-tween on the row. */
    const drifts = [...el.querySelectorAll('.wib-img')].map((img, i) =>
      gsap.to(img, {
        y: i % 2 === 0 ? -18 : 18,
        ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
      }),
    )

    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
      drifts.forEach((d) => {
        d.scrollTrigger?.kill()
        d.kill()
      })
    }
  }, [reduceMotion])

  return (
    <section
      id="where-ive-been"
      className="relative w-full overflow-hidden bg-[var(--ivory)] pt-10 md:pt-12 pb-16 md:pb-24"
    >
      <MarqueeTitle
        script="Where"
        sans="I've been"
        number="03"
        trailing="-"
        ariaLabel="Where I've been"
        reduceMotion={reduceMotion}
        className="mb-8 md:mb-10"
      />

      <div className="shell">
        <div ref={listRef} className="flex flex-col gap-14 md:gap-16">
          {ENTRIES.map((entry, i) => (
            <Entry key={entry.org} entry={entry} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
