/* ═══════════════════════════════════════════════════════════════════════════
   SELECTEDWORK.JSX — the proof, first thing after the tldr;

   ONE WORK PER DISCIPLINE, and the numerals are the join. Each card carries
   the same numeral as its discipline in Disciplines.jsx — 1 Product, 2
   Front-End, 3 Social & Content, 4 Brand — so the two sections are the same
   list read twice: here as evidence, there as capability. Reordering
   DISCIPLINES without reordering WORKS breaks that silently, since nothing
   enforces the pairing but these numerals.

   WHY IT SITS FIRST. The page used to open tldr; -> Disciplines, which is
   one sentence followed immediately by a four-area capability matrix: a
   claim before any evidence for it, and the least differentiated block on
   the site in the position that gets read most. The work goes here instead
   and Disciplines drops to last, where "here is what I do" lands next to
   "Let's work together" as an answer rather than an assertion.

   NO SEAM CLASS, deliberately. The hero and the tldr; above it are already
   --ivory and so is this, so the page opens as one continuous white field —
   name, statement, work — and the grey/white alternation starts below it at
   "How I got here". A seam here would fade white into white and paint
   nothing. See shared.css for what the seams do at the real boundaries.

   TWO OF FOUR CARDS DO NOT LINK YET. BlueCore and Known have case studies;
   katsaliya.com is the page you are already on, and Emporium Thai Market's
   write-up does not exist yet. A card with `href: null` renders without any
   click affordance at all rather than with a "coming soon" badge — the
   absence of the cue is the honest signal, and advertising the gap is worse
   than leaving it quiet. Adding the case study later is one field.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeTitle from './MarqueeTitle'
import MicroLabel from './MicroLabel'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"

/* Every fact here is already stated somewhere else on this site — the case
   studies' own meta rows, the Where I've been notes, the How I got here
   paragraphs. Nothing is inferred and nothing is new copy about the work
   itself, so a number that changes gets changed in both places or neither.

   All four images are 1200x900 or smaller at exactly 4:3, generated into
   /images/selected-work/ from art that was every ratio from 2.26 to 1.05.
   The frame below is aspect-[4/3], so object-cover crops nothing — the same
   arrangement Where I've been settled on, for the same reason: normalise the
   files once rather than let the frame fight them on every render. */
const WORKS = [
  {
    numeral: '1',
    discipline: 'Product Strategy & Design',
    ink: 'var(--jade-ink)',
    title: 'BlueCore',
    note: 'AI automation built for the realities of maritime work - decreasing documentation time by 80%.',
    meta: 'Product Design & Engineering Lead ',
    image: '/images/selected-work/bluecore.jpg',
    href: '/bluecore',
  },
  {
    numeral: '2',
    discipline: 'Front-End Development',
    ink: 'var(--orchid-ink)',
    title: 'katsaliya.com',
    /* No href, and not for want of a page: this IS the page. A link to the
       site you are standing on is a link to nowhere. */
    note: 'This site — React and Vite, GSAP and ScrollTrigger riding a Lenis ticker.',
    meta: 'Design & Build ',
    image: '/images/selected-work/katsaliya.jpg',
    href: null,
  },
  {
    numeral: '3',
    discipline: 'Social & Content',
    ink: 'var(--gold-ink)',
    title: 'Known',
    note: 'Content and growth campaigns for a new dating app — 3M+ impressions, 10K+ followers.',
    meta: 'Growth Associate',
    image: '/images/selected-work/known.jpg',
    href: '/known',
  },
  {
    numeral: '4',
    discipline: 'Brand & Strategy',
    ink: 'var(--aqua-ink)',
    title: 'Emporium Thai Market',
    note: 'Brand and growth strategy for the launch of a new restaurant in Los Angeles.',
    meta: 'Creative & Growth Lead',
    image: '/images/selected-work/emporium-thai-market.jpg',
    href: null,
  },
]

function Card({ work }) {
  const linked = Boolean(work.href)

  /* The image and the words are ONE target, not two. Splitting them means a
     reader who lands on the photograph gets no affordance and a reader who
     lands on the title gets one, for the same card.

     WITH THE CURSOR PILL GONE, the hover state IS the affordance: the image
     eases up to 1.03 and the title takes this card's own accent ink. Both
     are gated on `linked`, so the two cards without a case study stay
     completely inert — which is the only thing distinguishing them, since
     nothing else on a card says whether it goes anywhere. Weaken either and
     a clickable card stops announcing itself at all. */
  const inner = (
    <>
      <div className="overflow-hidden rounded-[4px] bg-[var(--ivory-deep)]">
        <img
          src={work.image}
          alt=""
          loading="lazy"
          className={`block w-full aspect-[4/3] object-cover ${
            linked ? 'transition-transform duration-700 ease-out group-hover:scale-[1.03]' : ''
          }`}
        />
      </div>

      <div className="mt-4">
        {/* A RESERVED SECOND LINE, between lg and xl only. Four across at
            1024 puts each card at 222px, and "(Product Strategy & Design)"
            is the one label that does not fit on one line there — so that
            card's title dropped ~25px below the other three and the row of
            titles stopped being a row. 3.1rem is two lines at this label's
            own 16px/1.54. It is released at xl, where 280px fits every label
            on one line and the reserve would just be dead space. */}
        <MicroLabel className="lg:min-h-[3.1rem] xl:min-h-0" color={work.ink}>
          {work.discipline}
        </MicroLabel>

        <p
          className={`mt-2.5 text-[clamp(1.15rem,1.35vw,1.35rem)] leading-[1.25] text-[var(--walnut)] ${
            linked ? 'transition-colors duration-300 group-hover:text-[var(--card-ink)]' : ''
          }`}
          style={{ fontFamily: FONT, fontWeight: 500 }}
        >
          {work.title}
        </p>

        <p
          className="mt-2 text-[15px] leading-[1.55] text-[var(--walnut-soft)]"
          style={{ fontFamily: FONT, fontWeight: 400 }}
        >
          {work.note}
        </p>

        {/* Tracked uppercase and the lightest ink on the card, exactly as the
            dates are in Where I've been: this is the index line, not the
            content. */}
        <p
          className="mt-3 text-[12px] leading-[1.6] tracking-[0.06em] uppercase text-[var(--walnut-faint)]"
          style={{ fontFamily: FONT, fontWeight: 400 }}
        >
          {work.meta}
        </p>
      </div>
    </>
  )

  /* no-underline on the Link is not optional: this site runs Tailwind
     WITHOUT Preflight, so an <a> keeps the browser's own underline and it
     strikes through the entire card — image, title, note and meta line. Every
     other Link in the codebase carries it for the same reason.

     text-[var(--walnut)] is there for the same reason and is easy to miss,
     because nothing looks wrong without it: the anchor inherits the
     browser's default link blue, and every child here happens to set its own
     colour, so the blue never shows. Add a child that does not, and it
     arrives blue. */
  return (
    <article className="sw-item">
      {linked ? (
        <Link
          to={work.href}
          className="group block no-underline text-[var(--walnut)] md:cursor-pointer"
          /* The hover colour has to differ per card, so it cannot be a static
             class. The card publishes its own ink as a custom property here
             and the title reads it back with group-hover:text-[var(--card-ink)]
             — one class, four colours. */
          style={{ '--card-ink': work.ink }}
        >
          {inner}
        </Link>
      ) : (
        <div>{inner}</div>
      )}
    </article>
  )
}

export default function SelectedWork({ reduceMotion = false }) {
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const items = el.querySelectorAll('.sw-item')
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

    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
    }
  }, [reduceMotion])

  return (
    <section
      id="selected-work"
      className="relative w-full overflow-hidden bg-[var(--ivory)] pt-10 md:pt-12 pb-12 md:pb-16"
    >
      {/* numberOffset: the script "Selected" ends in a swashed d that sweeps
          up and to the right through exactly where the numeral sits at the
          default 0.09, which buried the "1". Its ink runs 0.82 of the font
          size past its own advance width, so the numeral is spaced from the
          SWASH rather than from the metric end of the word. See numberOffset
          in MarqueeTitle.jsx for how that was measured. */}
      <MarqueeTitle
        script="Selected"
        sans="work"
        number="01"
        numberOffset={0.92}
        trailing="-"
        ariaLabel="Selected work"
        reduceMotion={reduceMotion}
        className="mb-8 md:mb-10"
      />

      <div className="page-content-shell">
        {/* FOUR ACROSS ON ONE ROW, and no width cap. This was a 2x2 grid
            capped at 62rem, which made the section the tallest on the page —
            1616px, taller than the hero — for four cards. One row of four
            trades that height for width: the shell already allows 110rem, so
            each card still lands near 400px, and the whole section now reads
            in a single glance instead of a scroll.

            Two columns between 640 and 1280 rather than four: four cards in a
            1024px window would put each at ~230px, where the discipline
            label wraps and the frame stops being able to show anything. */}
        <div
          ref={listRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 xl:gap-x-8 gap-y-10 w-full"
        >
          {WORKS.map((work) => (
            <Card key={work.title} work={work} />
          ))}
        </div>
      </div>
    </section>
  )
}
