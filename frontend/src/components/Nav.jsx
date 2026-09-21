/* ═══════════════════════════════════════════════════════════════════════════
   NAV.JSX — the site's only navigation bar

   One component for every page, Home included. Home used to carry its own
   copy because its wordmark is the landing point of the hero's FLIP, and two
   navs meant every change had to be made twice and stayed the same only by
   discipline. That is solved by handing Home the refs it needs instead:
   `wordmarkRef` is the FLIP target, `linksRef` is what its scrub fades in.
   Every other page passes neither and gets the same bar, visible from the
   start.

   The wordmark is the same script lockup the hero name docks into, so the
   mark is identical wherever you arrive. No chalk texture on it — the filter
   displaces by 10px, which is texture at the hero's ~200px and destroys a
   21.38px glyph.

   The page you are ON renders as the orchid rather than as a link: the
   active-state indicator and the mark in one, and one fewer word competing
   with the two destinations that are actually elsewhere.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Link, useLocation } from 'react-router-dom'

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

/* Matches the Figma nav spec — see Home's hero, which FLIPs onto these. */
export const NAV_NAME_FONT_SIZE = 21.38
export const NAV_LINK_FONT_SIZE = 21.34

/* `match` is which paths count as "you are here". Home renders at both / and
   /about, so About owns the pair. Contact is a mailto and is never current. */
const NAV_LINKS = [
  { to: '/work', label: 'WORKS', match: ['/work'] },
  { to: '/about', label: 'ABOUT', match: ['/', '/about'] },
  { href: 'mailto:kataliyasun@gmail.com', label: 'CONTACT', match: [] },
]

export default function Nav({
  /* Home passes these; nothing else does. */
  wordmarkRef,
  linksRef,
  wordmarkClassName = '',
  linksClassName = '',
  wordmarkAriaHidden = false,
}) {
  const { pathname } = useLocation()

  return (
    /* ANCHORED TO THE TOP, not floated 17px below it. The bar carries a solid
       ground now, and at top-[17px] that left a 17px strip above it with the
       page scrolling through — a white band with content sliding behind its
       upper edge. The offset moved into padding, so the wordmark still sits
       exactly where it did and the ground reaches the top of the screen. */
    <nav className="site-nav fixed top-0 left-0 w-full z-[50] pointer-events-none pt-[17px] pb-[14px]">
      <div className="shell flex flex-row justify-between items-center">
        <Link
          ref={wordmarkRef}
          to="/"
          aria-hidden={wordmarkAriaHidden || undefined}
          tabIndex={wordmarkAriaHidden ? -1 : undefined}
          aria-label="Kataliya Sungkamee — home"
          className={`h-12 block no-underline leading-[1.14] tracking-[-0.01em] text-[var(--walnut)] pointer-events-auto ${wordmarkClassName}`}
          style={{ fontFamily: SCRIPT_FONT, fontSize: `${NAV_NAME_FONT_SIZE}px` }}
        >
          Kataliya<br />Sungkamee
        </Link>

        <div
          ref={linksRef}
          className={`flex flex-row justify-center items-center gap-[44px] pointer-events-auto ${linksClassName}`}
        >
          {NAV_LINKS.map((l) => {
            const current = l.match.includes(pathname)
            if (current) {
              return (
                <span key={l.label} className="flex items-center" aria-current="page" title={l.label}>
                  <img
                    src="/images/assets/orchid-logo-placeholder.png"
                    alt={l.label}
                    className="w-auto"
                    style={{ height: `${NAV_LINK_FONT_SIZE * 1.5}px` }}
                  />
                </span>
              )
            }
            const className =
              'text-[var(--walnut)] no-underline transition-colors duration-300 hover:text-[var(--orchid)]'
            const style = {
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: `${NAV_LINK_FONT_SIZE}px`,
              lineHeight: '28px',
            }
            return l.href ? (
              <a key={l.label} href={l.href} className={className} style={style}>
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.to} className={className} style={style}>
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
