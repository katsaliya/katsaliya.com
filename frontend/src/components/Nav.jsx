/* ═══════════════════════════════════════════════════════════════════════════
   NAV.JSX — the site's only navigation bar

   One component for every page, Home included. Home used to carry its own
   copy because its wordmark is the landing point of the hero's FLIP, and two
   navs meant every change had to be made twice and stayed the same only by
   discipline. That is solved by handing Home the refs it needs instead:
   `wordmarkRef` is the FLIP target. Every other page passes nothing and
   gets the same bar, visible from the start.

   There used to be a `linksRef` beside it, for the row of links Home faded
   in on first scroll. The links live behind the chrysanthemum at every
   width now, and a trigger that is invisible until you scroll is a trigger
   nobody can find — so the row, and the ref, are gone.

   The wordmark is the same script lockup the hero name docks into, so the
   mark is identical wherever you arrive. No chalk texture on it — the filter
   displaces by 10px, which is texture at the hero's ~200px and destroys a
   21.38px glyph.

   The page you are ON renders as the orchid rather than as a link: the
   active-state indicator and the mark in one, and one fewer word competing
   with the two destinations that are actually elsewhere.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FanMark from './FanMark'

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

/* Matches the Figma nav spec — see Home's hero, which FLIPs onto these. */
export const NAV_NAME_FONT_SIZE = 21.38
export const NAV_LINK_FONT_SIZE = 21.34

/* `match` is which paths count as "you are here". ABOUT points at / because
   the root IS the about page — the bio hero, the disciplines, where she has
   been. /about is only a redirect to it now, so nothing links there.
   Contact is a mailto and is never current. */
const NAV_LINKS = [
  { to: '/', label: 'About', match: ['/'] },
  { to: '/work', label: 'Work', match: ['/work'] },
  { href: 'mailto:kataliyasun@gmail.com', label: 'Contact', match: [] },
]

/* The second tier, under the destinations. These go OUT — a different kind
   of link from the three above, which is why they sit apart, run at a
   fraction of the size, and take the diagonal arrow rather than the
   horizontal one. Same URLs the side rail and the footer use. */
const NAV_ELSEWHERE = [
  { href: 'https://linkedin.com/in/katsaliya', label: 'LinkedIn' },
  { href: 'https://github.com/katsaliya', label: 'GitHub' },
  { href: 'mailto:kataliyasun@gmail.com', label: 'Email' },
]

/* Right for a destination inside the site, diagonal for one that leaves it.
   Drawn rather than glyphs so both sit on the same hairline weight as the
   rules between the rows. */
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
         className="w-[22px] h-[22px] shrink-0">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

function ArrowOut() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
         className="w-[13px] h-[13px] shrink-0">
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  )
}

/* One list, rendered twice — once stacked in the mobile panel, once as the
   desktop row. Kept as a function rather than duplicated markup so a link
   added to NAV_LINKS cannot appear in one and not the other. */
/* One list, rendered into the panel. Kept as a function rather than inline
   markup so a link added to NAV_LINKS cannot be missed.

   THE CURRENT PAGE IS A HIGHLIGHT, NOT A MARK. It used to be flagged with
   the orchid — replacing the word entirely in the old desktop row, and
   sitting beside it in the panel. Both are gone: on an ink panel the
   brighter label is already the strongest signal available, and a small
   image beside one item knocked that row out of alignment with the other
   two for no information the colour was not already giving.

   So current is full-strength ivory and the rest are held back to 58%. That
   is a 3.4:1 step between them, which is a clear difference at a glance,
   while both still clear AA against the panel. */
/* A ROW, NOT A WORD. Each destination is its own full-width line: the
   label left, a rule under it, an arrow out at the right. The whole row is
   the target, which is what makes a near-full-screen menu usable with a
   thumb — on the old centred list only the three words themselves were.

   DM SANS, NOT THE SCRIPT. The script was legible at 48px and it was still
   the wrong call for a panel this size: a menu is the one place on the site
   that has to be read without being looked at. The sans is what the rest of
   the page sets its navigation and labels in, so this now matches rather
   than competing. */
function renderLinks(pathname, onNavigate) {
  return NAV_LINKS.map((l) => {
    const current = l.match.includes(pathname)
    const inner = (
      <>
        <span>{l.label}</span>
        <ArrowRight />
      </>
    )
    const className =
      'group/row flex items-center justify-between gap-6 w-full no-underline ' +
      'border-0 border-b border-solid border-[rgba(255,255,255,0.22)] ' +
      'py-[0.42em] text-[clamp(2.1rem,5.2vw,2.9rem)] leading-[1.18] tracking-[-0.015em] ' +
      'transition-colors duration-300 ' +
      (current
        ? 'text-[var(--ivory)]'
        : 'text-[rgba(255,255,255,0.62)] hover:text-[var(--ivory)]')
    const style = { fontFamily: FONT, fontWeight: current ? 500 : 400 }

    if (current) {
      return (
        <span key={l.label} aria-current="page" className={className} style={style}>
          {inner}
        </span>
      )
    }
    return l.href ? (
      <a key={l.label} href={l.href} className={className} onClick={onNavigate} style={style}>
        {inner}
      </a>
    ) : (
      <Link key={l.label} to={l.to} className={className} onClick={onNavigate} style={style}>
        {inner}
      </Link>
    )
  })
}

function renderElsewhere() {
  return NAV_ELSEWHERE.map((l) => (
    <a
      key={l.label}
      href={l.href}
      target={l.href.startsWith('http') ? '_blank' : undefined}
      rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
      className="flex items-center gap-2 no-underline text-[15px] leading-[1.9]
        text-[rgba(255,255,255,0.68)] hover:text-[var(--ivory)] transition-colors duration-300"
      style={{ fontFamily: FONT, fontWeight: 400 }}
    >
      <ArrowOut />
      {l.label}
    </a>
  ))
}

export default function Nav({
  /* Home passes these; nothing else does. */
  wordmarkRef,
  wordmarkClassName = '',
  wordmarkAriaHidden = false,
}) {
  const { pathname } = useLocation()

  /* ── The menu ─────────────────────────────────────────────────────────
     Collapsed behind the chrysanthemum at EVERY width now, not just below
     md. It started as a mobile fix — at 390px the three links ran to x=425
     and "contact" was off the screen — but the mark earns its place on a
     desktop too, and one nav that behaves the same everywhere beats two
     that have to be kept in step. */
  const [open, setOpen] = useState(false)

  /* Any navigation closes it. Without this, tapping "works" leaves the panel
     hanging open over the page it just went to. */
  useEffect(() => setOpen(false), [pathname])

  /* ── PUBLISH THE BAR'S HEIGHT ─────────────────────────────────────────
     Anything that pins below this bar needs to know how tall it is, and the
     only honest source for that is the bar itself.

     The case study's section nav used to hardcode it: `top: 79px`, with a
     comment deriving 17 + 48 + 14 from the padding and the wordmark. That
     was correct when it was written and silently wrong the moment the
     chrysanthemum went in — the bar grew to 87px and the section nav spent
     every case study pinned 8px UNDERNEATH it, with its top edge and the
     blur of its own glass hidden behind the bar above.

     A measured custom property cannot drift that way. ResizeObserver rather
     than a one-off read, because the height changes with the breakpoint and
     again when the webfont swaps the wordmark's metrics in. */
  const barRef = useRef(null)
  const triggerRef = useRef(null)
  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return
    const publish = () => {
      const root = document.documentElement
      root.style.setProperty('--nav-h', `${Math.round(el.getBoundingClientRect().height)}px`)

      /* AND HOW FAR THE TRIGGER SITS FROM THE RIGHT EDGE. The menu panel
         is position:fixed, so left to itself it pins to the VIEWPORT —
         which is right up to --page-max-width and wrong past it. At 2400px
         the shell stops at 2080 and the panel was still at 2380: 300px
         adrift of every other thing on the page.

         Publishing the trigger's own inset rather than recomputing the
         shell's maths in CSS does two things. It cannot disagree with the
         container, because it IS measured from inside it. And it aligns
         the panel with the fan specifically, which is the object it grows
         out of — so the gesture reads as the fan opening into the panel
         at any width. A calc() against 100vw would also have been off by
         the scrollbar, which the measured value simply includes. */
      const t = triggerRef.current
      if (t) {
        const r = t.getBoundingClientRect()
        root.style.setProperty('--nav-right', `${Math.round(window.innerWidth - r.right)}px`)
      }
    }
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    /* The window, not just the bar: the bar's own height does not change
       when the viewport widens past the container cap, but the trigger's
       inset from the right edge does. */
    window.addEventListener('resize', publish)
    document.fonts?.ready.then(publish)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', publish)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }

    /* Closing on scroll as well, since the panel is anchored to a fixed bar
       and a scroll would leave it floating over unrelated content.

       IT HAS TO BE A REAL SCROLL, measured in pixels. This used to close on
       the first scroll EVENT of any kind, which made the menu unusable on
       /work: Lenis runs a ticker there and emits a scroll the instant the
       panel opens, so the menu shut itself before it had finished opening.
       A threshold means a settling ticker cannot trigger it but a flick can.

       The old listener was also registered with `once` and never removed on
       cleanup, so if the menu was closed any other way the listener stayed
       armed and ate the first scroll after the NEXT opening. */
    const from = window.scrollY
    const onScroll = () => {
      if (Math.abs(window.scrollY - from) > 12) setOpen(false)
    }
    /* Tapping anywhere off the menu closes it. Pointerdown rather than
       click, so it lands before any link underneath takes the tap. */
    const onDown = (e) => {
      if (!e.target.closest('#nav-menu, .chrys-trigger button')) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    /* ANCHORED TO THE TOP, not floated 17px below it. The bar carries a solid
       ground now, and at top-[17px] that left a 17px strip above it with the
       page scrolling through — a white band with content sliding behind its
       upper edge. The offset moved into padding, so the wordmark still sits
       exactly where it did and the ground reaches the top of the screen. */
    <nav ref={barRef} className="site-nav fixed top-0 left-0 w-full z-[50] pointer-events-none pt-3 pb-3 md:pt-[17px] md:pb-[14px]">
      <div className="page-content-shell flex flex-row justify-between items-center">
        <Link
          ref={wordmarkRef}
          to="/"
          aria-hidden={wordmarkAriaHidden || undefined}
          tabIndex={wordmarkAriaHidden ? -1 : undefined}
          aria-label="Kataliya Sungkamee — home"
          /* SIZED IN CSS, NOT FROM THE CONSTANT. The hero's landing reads this
             element's live font-size to work out how far to shrink the flying
             name (see navState in Home.jsx), so the two cannot disagree. It
             used to take NAV_NAME_FONT_SIZE on both sides, which made the
             size impossible to vary by breakpoint without the name landing
             at the wrong scale. */
          className={`block no-underline leading-[1.14] tracking-[-0.01em] text-[var(--walnut)] pointer-events-auto text-[15px] md:text-[21.38px] ${wordmarkClassName}`}
          style={{ fontFamily: SCRIPT_FONT }}
        >
          Kataliya<br />Sungkamee
        </Link>

        {/* ALWAYS VISIBLE, never faded in. Home used to hold its nav links
            back until the first scroll, which was a fine flourish for a row
            of words sitting in the bar. Applied to the only way into the
            nav it is not: the menu would be unreachable until you had
            already scrolled past the thing it opens. */}
        <div ref={triggerRef} className="relative pointer-events-auto chrys-trigger">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            /* The button grew with the mark: 48px square on a phone, 56px
               from md, so the flower is never clipped by its own hit area
               and the target stays above the 44px minimum. */
            /* Sized to the OPEN fan, which is the wider of the two states
               — 172 degrees of spread is close to twice as wide as the
               folded stack is. The shut state is narrower and simply sits
               centred in the same box. */
            className="grid place-items-center w-[70px] h-[78px] md:w-[84px] md:h-[94px] -mr-3 bg-transparent border-0 p-0 cursor-pointer text-[var(--walnut)] transition-colors duration-300 hover:text-[var(--orchid)]"
          >
            <FanMark open={open} className="w-[64px] h-[74px] md:w-[78px] md:h-[90px]" />
          </button>

          {/* ALWAYS MOUNTED, never toggled between hidden and flex. The
              open animation is a clip-path growing out of this panel's
              top-right corner, and a box that is display:none until the
              moment it opens has no corner to grow from — it would appear
              at full size and then animate from nothing visible. data-open
              drives the whole thing from CSS instead; see shared.css.

              `inert` while closed so a clipped-away panel cannot be tabbed
              into or read out. */}
          <div
            id="nav-menu"
            data-open={open ? 'true' : 'false'}
            aria-hidden={!open}
            {...(!open && { inert: '' })}
            /* ASYMMETRIC PADDING, because the type is. Coneria's terminal
               swash on "about" and "contact" overhangs its own advance
               width by 30px at 48px type — measured, not guessed — so a
               right-aligned list in symmetric padding has two of its three
               items touching the edge while "works", which ends in an s,
               sits correctly. The right side carries the swash; the left
               does not need to.

               min-width is set from the widest item's INK, not its layout
               box: "contact" is 198px of advance plus 30px of overhang. */
            /* FIXED, NOT ANCHORED TO THE TRIGGER. It was absolutely
               positioned under the button and sized to its own content,
               which cannot become a panel that fills the screen. Fixed to
               the viewport instead: nearly edge to edge on a phone, and a
               tall column pinned to the top right from md, which is how
               the reference sits on a desktop.

               It still GROWS OUT OF THE FAN, because the clip-path origin
               is the top-right corner either way — the gesture survives the
               change of positioning. */
            /* IT STARTS BELOW THE BAR, not at the top of the screen. The
               reference runs its panel to the very top and lets it cover
               the trigger, replacing it with the close — which is right
               when the trigger is a hamburger and there is nothing to
               watch. Here the trigger is the fan, and the fold is the
               whole gesture; covering it would mean the animation plays
               behind the panel and is never seen. Starting under --nav-h
               keeps the fan in view folding while the panel grows past it,
               and still covers 86% of a phone. */
            className="nav-menu-panel fixed z-[60] flex flex-col
              inset-x-3 bottom-3 px-9 pt-7 pb-10
              md:inset-x-auto md:bottom-5 md:px-12 md:pt-8 md:pb-12"
            /* Only `top` is inline, because it is the same at every width.
               The desktop right edge and width are media-query'd, which an
               inline style cannot be — see .nav-menu-panel in shared.css. */
            style={{ top: 'calc(var(--nav-h, 94px) + 8px)' }}
          >
            {/* The close sits inside the panel, where the reference has it.
                The fan behind is still the real toggle — this is the one a
                reader reaches for once the panel covers it. */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="relative z-[2] self-end -mr-1 grid place-items-center w-11 h-11 bg-transparent border-0 p-0
                cursor-pointer text-[rgba(255,255,255,0.72)] hover:text-[var(--ivory)]
                transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" aria-hidden="true" className="w-[21px] h-[21px]">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* The destinations, hard against the top under the close. */}
            <div className="relative z-[2] flex flex-col mt-1">
              {renderLinks(pathname, () => setOpen(false))}
            </div>

            {/* mt-auto is what gives the panel the reference's shape: the
                three rows stay at the top, this block sits on the floor,
                and the gap between them is the empty middle that makes it
                read as a room rather than a list. */}
            <div className="relative z-[2] mt-auto pt-10">
              <p
                className="m-0 mb-3 text-[12px] tracking-[0.14em] uppercase text-[rgba(255,255,255,0.42)]"
                style={{ fontFamily: FONT, fontWeight: 400 }}
              >
                Elsewhere
              </p>
              <div className="flex flex-col items-start">{renderElsewhere()}</div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}
