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
  { to: '/', label: 'about', match: ['/'] },
  { to: '/work', label: 'works', match: ['/work'] },
  { href: 'mailto:kataliyasun@gmail.com', label: 'contact', match: [] },
]

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
function renderLinks(pathname, onNavigate) {
  return NAV_LINKS.map((l) => {
    const current = l.match.includes(pathname)
    /* THE SCRIPT, AND ONLY BECAUSE IT IS LARGE. Coneria is the site's
       display face and it is what the wordmark above is set in, so a menu
       in the same hand reads as written rather than as chrome. At the 19px
       this list used to run it would have been unreadable; at 34–48px it is
       the best-looking type on the page.

       Current is the orchid rather than plain ivory. At this size it is
       "large text" for contrast purposes, where 3:1 is the bar — orchid on
       the panel measures 3.96:1, so it passes here although it would not
       have at 19px. */
    const className =
      'no-underline transition-colors duration-300 leading-[1.08] ' +
      'text-[clamp(2.1rem,3.4vw,3rem)] ' +
      (current
        ? 'text-[var(--orchid)]'
        : 'text-[rgba(255,255,255,0.72)] hover:text-[var(--ivory)]')
    const style = { fontFamily: SCRIPT_FONT, fontWeight: 400 }

    if (current) {
      return (
        <span key={l.label} aria-current="page" className={className} style={style}>
          {l.label}
        </span>
      )
    }
    return l.href ? (
      <a key={l.label} href={l.href} className={className} onClick={onNavigate} style={style}>
        {l.label}
      </a>
    ) : (
      <Link key={l.label} to={l.to} className={className} onClick={onNavigate} style={style}>
        {l.label}
      </Link>
    )
  })
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
  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return
    const publish = () => {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${Math.round(el.getBoundingClientRect().height)}px`,
      )
    }
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    document.fonts?.ready.then(publish)
    return () => ro.disconnect()
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
        <div className="relative pointer-events-auto chrys-trigger">
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
            className="grid place-items-center w-[74px] h-[70px] md:w-[90px] md:h-[84px] -mr-3 bg-transparent border-0 p-0 cursor-pointer text-[var(--walnut)] transition-colors duration-300 hover:text-[var(--orchid)]"
          >
            <FanMark open={open} className="w-[70px] h-[65px] md:w-[86px] md:h-[80px]" />
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
            className="nav-menu-panel absolute right-0 top-full mt-3 flex flex-col
              items-end gap-2 rounded-[18px] py-7 pl-8 pr-10 md:pl-10 md:pr-14
              min-w-[262px] md:min-w-[332px]"
          >
            {renderLinks(pathname, () => setOpen(false))}
          </div>
        </div>

      </div>
    </nav>
  )
}
