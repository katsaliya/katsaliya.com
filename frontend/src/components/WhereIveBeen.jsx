/* ═══════════════════════════════════════════════════════════════════════════
   WHEREIVEBEEN.JSX — the record, below "How I got here"

   A dated timeline: a narrow date gutter, a hairline spine, then the role and
   the organisation on one line with a single sentence under it. Reformatted
   from the previous alternating left/right layout, which gave each entry half
   a screen and made five jobs read as five sections.

   THE SPINE IS CONTINUOUS, not a rule per row. Rows carry their own vertical
   padding and the list has no gap between them, so the 1px column runs
   unbroken from the first entry to the last. Put the gap on the list instead
   and the line breaks into five dashes, which reads as five separators rather
   than one timeline.

     Disciplines      ruled two-column table, numerals, dense text
     How I got here   single centred prose column
     Where I've been  dated timeline against a spine

   ONE SENTENCE PER ENTRY, no more. The resume is the document for detail;
   this is the version someone reads in fifteen seconds.
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
   REVERSE-CHRONOLOGICAL: newest first. This ran oldest-first for a while, on
   the argument that the progression is itself the point — support, to
   marketing, to growth, to leading product — and that reading up the list
   told that story. The counter-argument won: the first entry is the one a
   reader weighs most, and burying the current role at the bottom spends that
   position on a job from 2022. The arc is still legible read upward; the
   present is just no longer last.

   Dates and roles are the author's own; nothing here is inferred.

   All five are real photographs, and all five are 1400x1050 — see the note
   on the frame in Entry, which relies on that.

   Every one was normalised on the way in, and two of the three fixes only
   ever fail in production: uppercase .JPG/.jpeg extensions (macOS is
   case-insensitive, the deploy target is not, so a lowercase reference
   resolves locally and 404s once live) and 600 permissions where every other
   asset is 644. The third is size — the originals ran to 6.4MB for a frame
   that renders at 300px, so all are capped at 1400px. */
const ENTRIES = [
  ,
  {
    org: 'Emporium Thai Market',
    dates: 'Jul 2026 – Present',
    role: 'Creative & Growth Lead',
    image: '/images/about/emporium-thai-market.jpg',
  },
  ,
  {
    org: 'SUGAR Network',
    dates: 'Sep 2025 – Jun 2026',
    role: 'Product Design & Engineering Lead',
    image: '/images/about/sugar.jpg',
  },
  ,
  {
    org: 'Known',
    dates: 'Jun 2025 – Sep 2025',
    role: 'Growth Associate',
    image: '/images/about/known.jpg',
  },
  ,
  {
    org: 'Allied Global Marketing',
    dates: 'Jan 2025 – Jun 2025',
    role: 'Field Marketing Intern',
    image: '/images/about/allied-global-marketing.jpg',
  },
  {
    org: 'Apple',
    dates: 'Apr 2022 – Jun 2023',
    role: 'Sales Specialist',
    /* Apple Union Square. A 3:4 portrait, shown whole — logo and all — now
       that the frame follows the file instead of the other way round.
       Served from the 1600px .jpg, not the 2.7MB .jpeg original, which is
       still in this folder and can be deleted. */
    image: '/images/about/apple-union-square.jpg',
  },
]

function Entry({ entry }) {
  return (
    /* THE PADDING IS ON THE CHILDREN, NOT THE ROW. A grid item only stretches
       across the row's CONTENT box, so padding on the row itself sits outside
       the spine and breaks it — measured at 56px of gap between each segment.
       Moving the same padding onto the date and the content makes the row
       taller from the inside, and the 1px column stretches the whole way. */
    <div className="wib-item grid grid-cols-1 md:grid-cols-[11.5rem_1px_10rem_minmax(0,1fr)] gap-y-3 md:gap-y-0 md:gap-x-7">
      {/* Tracked uppercase so a date scans as a date rather than as prose,
          and the lightest ink on the row: it is the index, not the content.

          The gutter is 11.5rem because these carry months, not just years —
          "APR 2022 – JUN 2023" wrapped to two lines at 8.5rem, which put a
          ragged second line under every entry. Years alone would fit a
          narrower column, but the month precision is worth more than the
          80px. */}
      <p
        className="pt-6 md:pt-7 pb-1 md:pb-7 text-[15px] leading-[1.6] tracking-[0.06em] uppercase text-[var(--walnut-faint)]"
        style={{ fontFamily: FONT, fontWeight: 400 }}
      >
        {entry.dates}
      </p>

      {/* The spine. Hidden below the breakpoint, where the row is one column
          and a vertical rule has nothing to divide. */}
      <div className="hidden md:block w-px bg-[var(--border-alpha)]" aria-hidden="true" />

      {/* THE FRAME IS 4:3 BECAUSE THE PHOTOGRAPHS ARE. All five are
          1400x1050, so object-cover crops exactly nothing here — the frame
          matches the files rather than imposing on them. The note further up
          this file about "real photographs of different shapes" predates
          that: they were re-exported to one ratio, and a square frame would
          now be the thing doing the cropping, taking a quarter off the sides
          of every one. Swap to object-contain if a future replacement is not
          4:3, or re-export it to match. */}
      <div className="pb-2 md:py-7">
        <div className="w-full md:w-40 overflow-hidden rounded-[4px] bg-[var(--ivory-deep)]">
          <img
            src={entry.image}
            alt=""
            loading="lazy"
            className="block w-full aspect-[4/3] object-cover"
          />
        </div>
      </div>

      <div className="min-w-0 pb-6 md:py-7">
        {/* Role and organisation on ONE line. The org carries the heavier
            weight because it is the word that gets scanned — "Apple",
            "Known" — while the role is the qualifier after it. */}
        <p
          className="text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.35] text-[var(--walnut)]"
          style={{ fontFamily: FONT, fontWeight: 400 }}
        >
          {entry.role}
          <span aria-hidden="true" className="mx-2 text-[var(--walnut-faint)]">·</span>
          <span style={{ fontWeight: 500 }}>{entry.org}</span>
        </p>

        {entry.note && (
          <p
            className="mt-2 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--walnut-soft)]"
            style={{ fontFamily: FONT, fontWeight: 400 }}
          >
            {entry.note}
          </p>
        )}
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

    /* The scrubbed parallax that used to ride the photographs went with them
       — there is nothing in a text row for it to move without shifting the
       words themselves. */
    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
    }
  }, [reduceMotion])

  return (
    <section
      id="where-ive-been"
      className="relative w-full overflow-hidden bg-[var(--ivory)] seam-under-deep pt-10 md:pt-12 pb-16 md:pb-24"
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

      <div className="page-content-shell">
        {/* CAPPED AND CENTRED, not stretched to the shell. The text column is
            1fr, so without a cap it absorbs every extra pixel the viewport
            gives it — and since the note is capped at 62ch, that surplus turns
            into dead space on the right and the whole block reads as pinned
            to the left edge. The cap is the row's own natural width: date +
            spine + photo + a full-measure note. */}
        <div ref={listRef} className="flex flex-col w-full max-w-[62rem] mx-auto">
          {ENTRIES.map((entry) => (
            <Entry key={entry.org} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
