/* ═══════════════════════════════════════════════════════════════════════════
   SITEFOOTER.JSX — the close

   Three things now: the ways to reach her, a hairline rule, and the Thai
   blessing running off both edges. The display element that used to open it
   is gone and a replacement is expected — see the note at the shell below.

   ── What used to be here ────────────────────────────────────────────────
   A kinetic statement whose every character answered the cursor, taking up
   displacement quickly and returning slowly on the /work ring's own grab
   (0.14) and release (0.06). Then the name in its place, lit by a raking
   relief. Both are removed. If something kinetic comes back, chase() in
   ring/utils is the easing those rates were expressed in, and the reason
   they differed is worth keeping: equal rates read as a mechanism tracking a
   cursor, a fast take and a slow return reads as something with weight.

   ── The visitor number is gone ──────────────────────────────────────────
   It read "You are visitor No.0000" above the Thai band and fetched
   /api/visit, a Vercel function backed by redis.incr(). Nothing here calls
   that endpoint any more. The function and its Redis binding are still
   deployed and still cost whatever they cost — delete them separately if
   this stays gone. Footer.jsx, which is not mounted anywhere, also still
   fetches it.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marquee from './Marquee'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"
/* DM Sans has no Thai glyphs, so without a Thai face named first this falls
   back to whatever the OS supplies — Thonburi on a Mac, something else
   everywhere else — and the one line on the page in her family's language
   would look different on every machine. Noto Sans Thai is loaded in
   index.html alongside the rest. */
const THAI_FONT = "'Noto Sans Thai', 'DM Sans', sans-serif"


/* Luck, health, wealth, community — the four things a Thai-Chinese family
   business wishes you on the way out, which is what a footer is.

   THE THAI SHOULD BE READ BY SOMEONE WHO SPEAKS IT before this ships. The
   phrases are common set greetings rather than translated English, but I am
   not a native speaker and a blessing that is subtly wrong is worse than no
   blessing:
     โชคดี              good luck
     สุขภาพแข็งแรง        strong health
     ร่ำรวย              prosperity
     ชุมชนเข้มแข็ง         a strong community
     อยู่ดีมีสุข           live well, be happy
     เฮงๆ รวยๆ          colloquial "lucky, rich" — the Chinese-Thai New Year one
     กินดีอยู่ดี           eat well, live well
     มิตรภาพ            friendship */
const THAI_BLESSING =
  'โชคดี · สุขภาพแข็งแรง · ร่ำรวย · ชุมชนเข้มแข็ง · อยู่ดีมีสุข · เฮงๆ รวยๆ · กินดีอยู่ดี · มิตรภาพ'

const LINKS = [
  { label: 'email', href: 'mailto:kataliyasun@gmail.com' },
  { label: 'linkedin', href: 'https://linkedin.com/in/katsaliya' },
  { label: 'github', href: 'https://github.com/katsaliya' },
]

/* `ramp` colours each character individually, [from, to] across the word.

   IT HAS TO BE PER CHARACTER, not a gradient on the parent. The obvious way
   to colour a word like this is background-image + background-clip:text, and
   it is silently incompatible with the motion below: the clip is computed
   from the text where it was LAID OUT, so a character that translates paints
   against a clip that did not follow it. Measured — with transforms applied
   the letters stopped appearing to move at all, and the ones displaced
   furthest vanished outright, glyph and clip no longer overlapping. A colour
   set on each span travels with that span, so a ramp survives whatever
   transform the pointer applies. */
function mix(a, b, t) {
  const p = (c) => c.match(/[\d.]+/g).map(Number)
  const [ar, ag, ab, aa = 1] = p(a)
  const [br, bg, bb, ba = 1] = p(b)
  const n = (x, y) => Math.round(x + (y - x) * t)
  return `rgba(${n(ar, br)}, ${n(ag, bg)}, ${n(ab, bb)}, ${(aa + (ba - aa) * t).toFixed(3)})`
}

function Kinetic({ text, className, style, ramp }) {
  const chars = [...text]
  return chars.map((ch, i) => (
    <span
      key={i}
      className={`footer-char inline-block will-change-transform ${className || ''}`}
      style={
        ramp
          ? { ...style, color: mix(ramp[0], ramp[1], chars.length < 2 ? 0 : i / (chars.length - 1)) }
          : style
      }
    >
      {ch === ' ' ? ' ' : ch}
    </span>
  ))
}

export default function SiteFooter({ reduceMotion = false,
  /* WHICH SEAM, DECIDED BY THE CALLER. This footer is on Home and on every
     case study, and what sits above it differs: grey on Home (How I got
     here), white on a case study (the outro band). A hardcoded seam would be
     right on one and paint a grey band across the other. */
  seamClassName = '',
}) {
  const rootRef = useRef(null)

  /* ── message reveal ── */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll('.footer-line')
    const rules = root.querySelectorAll('.footer-rule')
    if (reduceMotion) {
      gsap.set(lines, { opacity: 1, y: 0 })
      gsap.set(rules, { scaleX: 1 })
      return
    }
    gsap.set(lines, { opacity: 0, y: 22 })
    gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 75%', once: true },
    })
    /* The rules draw first and the type arrives on them — the same order the
       marquee titles imply, where the guide exists and the words sit on it. */
    tl.to(rules, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', stagger: 0.08 }, 0)
    tl.to(lines, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 }, 0.35)
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduceMotion])


  return (
    <footer
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-[var(--ivory)] pt-2 md:pt-3 pb-4 ${seamClassName}`.trim()}
    >
      {/* THE VERTICAL BUDGET, top to bottom: pt-6/8, statement, mt-4/5,
          links, mt-5/6, rule, mt-4/5, Thai band, pb-4. Five gaps and two
          paddings, and between them they are now most of
          what is left to cut here — the statement itself is 123px of the
          footer's ~300 at 1440, and it is the one thing in here that is
          supposed to be big. Tightened twice: the gaps alone used to total
          152px, more than the statement they were separating.

          Anything added to this stack costs the footer twice, once for the
          element and once for the gap above it. */}
      <div className="page-content-shell">
        {/* THE NAME THAT CLOSED THE PAGE HAS BEEN REMOVED, to be replaced.
            It was "Kataliya Sungkamee" in the script, sized by useFitText to
            fill the column, set near the background and made legible only by
            a raking SVG relief light that tracked the pointer and rested
            above centre. All of that went with it: the #footer-relief filter,
            the light effect, the useFitText call and the .footer-name rules
            in shared.css.

            What is left here is the links row, the rule and the Thai band.
            If the replacement is also a single line of display type that
            should fill the column, useFitText is still in src/hooks and still
            reads its --fit-fill dial from CSS. */}
        {/* One centred row under the statement.

            This was a 12-column split — links stacked vertically on the left,
            a two-line message beside them on the right. The message is gone,
            and with it the reason for the split: three short words in a
            column with an empty right half is worse than no layout at all.

            `footer-line` is kept on the row so it still catches the reveal
            that used to bring the message in; without it that timeline would
            target an empty NodeList and the links would simply appear. */}
        <div className="footer-line mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[clamp(1.05rem,1.45vw,1.25rem)] text-[var(--walnut)] no-underline border-b border-transparent transition-colors duration-300 hover:text-[var(--orchid)] hover:border-[var(--orchid)]"
              style={{ fontFamily: FONT, fontWeight: 400 }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div aria-hidden="true" className="relative mt-5 md:mt-6 h-px w-full">
          <div className="footer-rule absolute inset-0 h-px bg-[rgba(43,35,28,0.39)]" />
        </div>

        {/* The border-t that used to sit here has gone — it landed a few px
            under the rule above it and the two read as one thick line. */}
      </div>

      {/* Full-bleed, outside .shell: the last thing on the page should run off
          both edges rather than stop at the content column — it is a band, not
          a line of text. Slower than the section titles, because this is the
          page settling rather than announcing anything.

          SIZED DOWN TWICE, from clamp(1.1rem, 1.7vw, 1.5rem) — 24px on a
          1440 screen, the same tier as the footer's own links, so a blessing
          meant to murmur read as another line of content — and now to about
          13px there.

          WEIGHT 300 NEEDS THE FONT REQUEST TO CARRY IT. index.html asked for
          Noto Sans Thai at 400;500 only, and a weight a family has not
          loaded does not fail loudly: the browser picks the nearest cut it
          does have, so this would have rendered at 400 and looked like the
          change had simply not worked. 300 was added to that URL with this.

          leading-[1.6] stays where it is at every size. Thai stacks tone
          marks and vowels above and below the base glyph, and a tighter line
          box is what makes them collide with the row above rather than the
          point size on its own. */}
      <Marquee
        reduceMotion={reduceMotion}
        speed={12}
        className="mt-4 md:mt-5"
        ariaLabel="A Thai blessing: good luck, strong health, prosperity, a strong community, live well and be happy, friendship"
      >
        <span
          aria-hidden="true"
          className="whitespace-nowrap text-[clamp(0.75rem,0.9vw,0.875rem)] leading-[1.6] text-[var(--walnut-soft)] pr-[1.2em]"
          style={{ fontFamily: THAI_FONT, fontWeight: 300 }}
        >
          {THAI_BLESSING}
        </span>
      </Marquee>
    </footer>
  )
}
