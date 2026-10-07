/* ═══════════════════════════════════════════════════════════════════════════
   SELECTEDWORK.JSX — the proof, first thing after the tldr;

   ONE WORK PER DISCIPLINE, and the numeral on each card is the join: it
   names that card's discipline in Disciplines.jsx — 1 Product, 2 Front-End,
   3 Social & Content, 4 Brand — so the two sections are the same list read
   twice, here as evidence and there as capability.

   THE TWO ARRAYS ARE NOT PARALLEL BY INDEX, and must not be assumed to be.
   This one is ordered for reading — Known first, because a number anyone
   recognises is the strongest opening — while Disciplines is ordered by
   discipline. So the numerals here run 3, 1, 4, 2 and that is correct. The
   pairing lives in the numeral and nowhere else, which means either array
   can be reordered freely, but a card's numeral may only change if its
   discipline does.

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

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeTitle from './MarqueeTitle'
import MicroLabel from './MicroLabel'
import useReducedMotion from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"

/* Every fact here is already stated somewhere else on this site — the case
   studies' own meta rows, the Where I've been notes, the How I got here
   paragraphs. Nothing is inferred and nothing is new copy about the work
   itself, so a number that changes gets changed in both places or neither.

   ONE EXCEPTION, and it is marked because the rule above is worth keeping:
   katsaliya.com has no case study to be the other place, since the site is
   its own evidence. Its note is therefore the only statement of how this
   one was built, rather than a second copy of one.

   All four images are 1200x900 or smaller at exactly 4:3, generated into
   /images/selected-work/ from art that was every ratio from 2.26 to 1.05.
   The frame below is aspect-[4/3], so object-cover crops nothing — the same
   arrangement Where I've been settled on, for the same reason: normalise the
   files once rather than let the frame fight them on every render. */
const WORKS = [
  {
    numeral: '3',
    discipline: 'Social & Content',
    ink: 'var(--gold-ink)',
    title: 'Known',
    note: 'Content and growth campaigns for a new dating app — 3M+ impressions, 10K+ followers.',
    meta: 'Growth Associate',
    image: '/images/selected-work/known.jpg',
    /* Already a seamless loop and already in the repo for the case study
       hero — 179KB, so there is nothing to cut down. */
    video: '/video/known-hero-loop.mp4',
    poster: '/video/known-hero-loop-poster.jpg',
    href: '/known',
  },
  {
    numeral: '1',
    discipline: 'Product Strategy & Design',
    ink: 'var(--jade-ink)',
    title: 'BlueCore',
    note: 'AI automation built for the realities of maritime work - decreasing documentation time by 80%.',
    meta: 'Product Design & Engineering Lead ',
    image: '/images/selected-work/bluecore.jpg',
    /* The orb, cut from the 157MB source that cannot be committed. Five
       seconds forward and the same five reversed, so the loop point has
       nothing to see — the orb morphs continuously and a straight cut back
       to frame one would read as a jolt. 697KB at 720x540. */
    video: '/video/bluecore-orb-loop.mp4',
    poster: '/video/bluecore-orb-loop-poster.jpg',
    /* Verbatim from BLUECORE.awards in data/caseStudies.js, per the rule at
       the top of this file — the masthead there is the other place these
       live, so a correction has to land in both. */
    awards: [
      '1st Place at SF Hacks 2026 for VectorAI DB',
      '1st Place SFSU Student AI Awards for Problem Solving',
    ],
    href: '/bluecore',
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
  {
    numeral: '2',
    discipline: 'Front-End Development',
    ink: 'var(--orchid-ink)',
    title: 'katsaliya.com',
    /* No href, and not for want of a page: this IS the page. A link to the
       site you are standing on is a link to nowhere. */
    note: 'This site — React and Vite, GSAP riding a Lenis ticker, built end to end in Claude Code and Cursor.',
    meta: 'Design & Build ',
    image: '/images/selected-work/katsaliya.jpg',
    /* No video for this one and it does not want one — a screen recording
       of the site you are already standing on says nothing. The orchid
       turns instead; see CardMedia. */
    motif: true,
    href: null,
  },
]

/* ═══════════════════════════════════════════════════════════════════════
   CARDMEDIA — the 4:3 frame at the top of a card

   Three kinds of thing go in the same box, so they all take the same
   classes: the aspect ratio, the cover fit and the hover swell live in one
   string and are handed to whichever element the entry calls for.

   `video` wins, then `motif`, then the still. The still stays on every
   entry regardless — it is the poster for the video path and the fallback
   if a file is missing, so no card can ever come up empty.

   AUTOPLAY NEEDS ALL FOUR of muted, playsInline, loop and autoPlay. Drop
   muted and every browser blocks it outright; drop playsInline and iOS
   Safari takes the video fullscreen the moment it starts, which on a
   portfolio card is the worst possible behaviour.

   preload="none" on purpose. Four cards would otherwise pull their video
   on page load, and these sit below the fold on every screen — the poster
   carries the card until the browser gets round to it.

   REDUCED MOTION GETS THE POSTER, not a paused video. A paused <video> on
   iOS still shows a play affordance over it; an <img> is just the frame. */
function CardMedia({ work, linked }) {
  const reduceMotion = useReducedMotion()
  const frame = `block w-full aspect-[4/3] object-cover ${
    linked ? 'transition-transform duration-700 ease-out group-hover:scale-[1.03]' : ''
  }`

  if (work.video && !reduceMotion) {
    return (
      <video
        className={frame}
        src={work.video}
        poster={work.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
    )
  }

  /* The orchid, turning. A full rotation is 48s — slow enough that it reads
     as drift rather than as a spinner, which is the difference between a
     motif and a loading state. The breathe runs on a different period from
     the turn on purpose, so the two never sync into an obvious cycle. */
  if (work.motif && !reduceMotion) {
    return (
      <div className={`${frame} grid place-items-center bg-[var(--ivory-deep)]`}>
        <div className="sw-motif-spin w-[46%] max-w-[190px]">
          <img src="/images/assets/orchid-logo-placeholder.png" alt="" className="sw-motif block w-full" />
        </div>
      </div>
    )
  }

  return <img src={work.image} alt="" loading="lazy" className={frame} />
}

function Card({ work, onUnavailable }) {
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
      {/* RELATIVE, so the ribbon can hang off the frame. The frame itself
          keeps overflow-hidden for the hover swell, which means the ribbon
          cannot live inside it — anything crossing that edge would be cut
          off at exactly the corner it is meant to straddle. So it is a
          sibling, positioned against this wrapper instead. */}
      <div className="relative">
        <div className="overflow-hidden rounded-[4px] bg-[var(--ivory-deep)]">
          <CardMedia work={work} linked={linked} />
        </div>

        {work.awards?.length ? (
          /* A PHOTOGRAPH OF A REAL ROSETTE, supplied rather than drawn. It
             came with its own alpha, so it needed only trimming to its
             content and sizing — no background to key out.

             ANCHORED BY THE ROSETTE, NOT BY THE IMAGE. The tails are more
             than half the file's height, so the corner offsets here place
             the medal on the corner and let the tails hang down across the
             artwork, which is how the object actually pins to something.

             It is the one place on the site with a photographic object
             rather than a drawn mark, and that is the point of it: a prize
             is a thing that exists, and a thing that exists is allowed to
             look like itself.

             Outside the clipped frame, so it does not scale with the hover
             swell — a badge that grows with the artwork reads as part of
             the picture. Offsets stay inside the grid's 24px gutter so it
             never reaches the neighbouring card.

             alt rather than aria-label and role=img: it IS an image, and
             the awards it names are information the page does not otherwise
             carry. A single rosette cannot say "two wins" — the alt text
             and the tooltip are what carry the second one. */
          <img
            src="/images/assets/award-ribbon-1st.webp"
            alt={work.awards.join('. ')}
            title={work.awards.join('. ')}
            className="sw-ribbon absolute -top-3 -right-3 z-10 h-[84px] w-auto md:h-[100px]"
          />
        ) : null}
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
        /* TEMPORARY. These two cards have no case study yet, and the whole
           point of the hover state being inert is that nothing claims they
           go anywhere — but people click them regardless, because the other
           two are links and a grid of four reads as four of the same thing.
           So a click gets an answer instead of silence.

           It is a div with onClick, which is not focusable and cannot be
           reached by keyboard. That is acceptable only because it announces
           something rather than doing something; when the real pages land,
           this becomes a Link and the problem goes away. */
        <div onClick={(e) => onUnavailable(e, work.title)} className="md:cursor-pointer">
          {inner}
        </div>
      )}
    </article>
  )
}

export default function SelectedWork({ reduceMotion = false }) {
  const listRef = useRef(null)

  /* ── "Coming soon", at the cursor ────────────────────────────────────
     TEMPORARY, until the two missing case studies exist.

     IT IS PORTALLED TO document.body, which is the only part of this that
     is not obvious. This section is overflow-hidden — it has to be, the
     marquee title's track is far wider than the viewport — so a popup
     rendered inside it is clipped the moment it sits near an edge, and the
     rightmost card is exactly where that bites. Out at the body it is
     clipped by nothing.

     Position is clamped so it cannot open off-screen, and it is offset down
     and right of the pointer so it does not cover what was just clicked.

     TWO PIECES OF STATE, NOT ONE, and that is what makes it not choppy. The
     first version unmounted the node the moment it was dismissed, so it had
     an entrance and no exit — it faded in over 180ms and then vanished
     between frames, which is the part that read as a snap. `note` holds the
     position and keeps the element mounted; `open` drives the transition.
     Dismissing flips `open` to false, and the node is not removed until the
     fade has actually run. */
  const [note, setNote] = useState(null)
  const [open, setOpen] = useState(false)
  const hideTimer = useRef(0)
  const dropTimer = useRef(0)

  const dismissNote = () => {
    clearTimeout(hideTimer.current)
    setOpen(false)
    /* Matches the transition in .sw-note. Longer and the node lingers
       invisibly swallowing nothing; shorter and the fade is cut off. */
    dropTimer.current = setTimeout(() => setNote(null), 220)
  }

  const showNote = (e) => {
    clearTimeout(hideTimer.current)
    clearTimeout(dropTimer.current)
    const PAD = 14
    setNote({
      x: Math.min(e.clientX + 18, window.innerWidth - 170 - PAD),
      y: Math.min(e.clientY + 20, window.innerHeight - 52 - PAD),
    })
    /* Mount closed, open on the next frame. Setting both in one pass gives
       the browser no state to transition FROM — it would paint the open
       state directly and the entrance would never play. */
    setOpen(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    hideTimer.current = setTimeout(dismissNote, 2000)
  }

  /* Any scroll or any other press dismisses it — a toast that outlives its
     context reads as a bug. These go through dismissNote rather than
     clearing the node outright, so an interrupted note still fades. */
  useEffect(() => {
    if (!note) return
    const drop = () => dismissNote()
    window.addEventListener('scroll', drop, { passive: true, once: true })
    window.addEventListener('pointerdown', drop, { once: true })
    return () => {
      window.removeEventListener('scroll', drop)
      window.removeEventListener('pointerdown', drop)
    }
  }, [note])

  useEffect(() => () => {
    clearTimeout(hideTimer.current)
    clearTimeout(dropTimer.current)
  }, [])

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
            <Card key={work.title} work={work} onUnavailable={showNote} />
          ))}
        </div>
      </div>

      {note &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            data-open={open ? 'true' : 'false'}
            className="sw-note fixed z-[90] pointer-events-none select-none rounded-full px-4 py-2 text-[13px] leading-none whitespace-nowrap"
            style={{ left: note.x, top: note.y, fontFamily: FONT, fontWeight: 500 }}
          >
            Coming soon
          </div>,
          document.body,
        )}
    </section>
  )
}
