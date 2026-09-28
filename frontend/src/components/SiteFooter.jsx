/* ═══════════════════════════════════════════════════════════════════════════
   SITEFOOTER.JSX — the close

   Three things: a kinetic statement, the ways to reach her, and a visitor
   number.

   ── The motion ──────────────────────────────────────────────────────────
   Every character answers the cursor individually, and the response is
   ASYMMETRIC: it takes up displacement quickly and returns slowly. Those two
   rates are the /work ring's own `grab` (0.14) and `release` (0.06), and the
   gap between them is the whole point — equal rates read as a mechanism
   tracking a cursor, whereas a fast take and a slow return reads as
   something with weight that got pushed and is working its way back.

   That is the grit, expressed as behaviour rather than as a word: the type
   never refuses the cursor, and it never fails to come back either. Shove it
   as much as you like; it returns to the line every time.

   It reuses chase() from the ring rather than
   reimplementing them, so the footer and the carousel are literally running
   the same easing maths.

   ── The visitor number ──────────────────────────────────────────────────
   /api/visit runs redis.incr() on every request, so the count is a function
   of how many times it is CALLED, not how many people arrive. The old footer
   called it on every mount, which meant a single visitor clicking around a
   client-side-routed site inflated the number on every navigation.

   The fix is a sessionStorage guard: the first load of a tab assigns a
   number and stores it; every remount after that reads the stored value and
   never touches the network. One increment per visit, which is what the
   number claims to mean.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marquee from './Marquee'
import { chase } from './WorkCarousel/ring/utils'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"
/* DM Sans has no Thai glyphs, so without a Thai face named first this falls
   back to whatever the OS supplies — Thonburi on a Mac, something else
   everywhere else — and the one line on the page in her family's language
   would look different on every machine. Noto Sans Thai is loaded in
   index.html alongside the rest. */
const THAI_FONT = "'Noto Sans Thai', 'DM Sans', sans-serif"

const VISITOR_KEY = 'kataliya:visitor-number'

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

/* How fast the light chases the pointer, per 60fps frame. Slower than the
   letters ever were: a light that snaps looks like a switch, and the whole
   point of raking one across a relief is that you watch the shading travel.
   REST is where it sits with no pointer — see the effect below. */
const LIGHT_CHASE = 0.08

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
  const nameRef = useRef(null)
  const lightRef = useRef(null)
  const [visitor, setVisitor] = useState(null)

  /* ── visitor number ── */
  useEffect(() => {
    const cached = sessionStorage.getItem(VISITOR_KEY)
    if (cached) {
      setVisitor(Number(cached))
      return
    }
    let alive = true
    fetch('/api/visit')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => {
        if (!alive || typeof d?.count !== 'number') return
        sessionStorage.setItem(VISITOR_KEY, String(d.count))
        setVisitor(d.count)
      })
      /* The endpoint is a Vercel function and simply is not there under `vite
         dev`, so a local failure is expected rather than exceptional. The
         line renders only when there is a real number to show. */
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

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


  /* ── the light ───────────────────────────────────────────────────────────
     The name is set at --ivory-deep on an --ivory footer, so at flat light it
     is almost the background. What makes it readable is shading: the filter
     turns the glyphs into a low relief and this rakes a point light across
     it, so the letters are picked out by where the light is not.

     IT RESTS SOMEWHERE LEGIBLE. Pensatori can let their hands vanish without
     a cursor because the hands are decoration; this name is the footer's
     mark AND its contact control, so it has to read with no pointer at all —
     on touch, before the mouse has moved, and for anyone who never goes near
     it. REST sits the light above and slightly left of centre, which is the
     ordinary direction light comes from and gives every letter a consistent
     shadow. The pointer only moves the light away from there.

     Coordinates are the element's own box: the CSS filter region puts user
     space at the element's top-left, so 0..width maps across the name. The
     pointer is allowed outside that range — a light off to one side rakes at
     a shallower angle, which is exactly what should happen.

     The loop is on demand. It starts on the first pointer move and stops
     once the light has settled back on REST, so a footer nobody touches
     costs no frames at all. */
  useEffect(() => {
    const el = nameRef.current
    const light = lightRef.current
    if (!el || !light) return

    const REST = { x: 0.5, y: -0.55 }
    let box = el.getBoundingClientRect()
    const measure = () => { box = el.getBoundingClientRect() }
    const rest = () => ({ x: box.width * REST.x, y: box.height * REST.y })

    const place = (p) => {
      light.setAttribute('x', p.x.toFixed(1))
      light.setAttribute('y', p.y.toFixed(1))
      light.setAttribute('z', (box.height * 0.85).toFixed(1))
    }

    /* RE-PLACE WHENEVER THE BOX CHANGES, or the resting light is wrong for
       the whole visit. It is derived from the name's width, and on first
       mount that width is whatever the fallback face happened to measure —
       the script loads later and the name grows by hundreds of pixels. The
       original ran place() once here and left a light sitting where the
       centre used to be: measured 427 against a true centre of 673, and
       nothing corrected it until the pointer moved. So the one state that
       has to be right for a visitor who never hovers was the one state that
       was never updated.

       `idle` keeps this from yanking the light away from the pointer if a
       resize lands mid-interaction. */
    let idle = true
    const reset = () => { measure(); if (idle) place(rest()) }
    reset()
    document.fonts?.ready.then(reset)
    const ro = new ResizeObserver(reset)
    ro.observe(el)

    /* No pointer, or the visitor asked for less motion: the resting light is
       the whole effect and nothing needs to run. */
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduceMotion || !mq.matches) return () => ro.disconnect()

    const cur = rest()
    let target = rest()
    let raf = 0
    let prev = performance.now()

    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const k = chase(dt, LIGHT_CHASE)
      cur.x += (target.x - cur.x) * k
      cur.y += (target.y - cur.y) * k
      place(cur)
      const r = rest()
      const settled =
        Math.abs(target.x - r.x) < 0.5 && Math.abs(target.y - r.y) < 0.5 &&
        Math.abs(cur.x - r.x) < 0.5 && Math.abs(cur.y - r.y) < 0.5
      if (settled) { raf = 0; return }
      raf = requestAnimationFrame(tick)
    }
    const wake = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick) } }

    const onMove = (e) => {
      idle = false
      target = { x: e.clientX - box.left, y: e.clientY - box.top }
      wake()
    }
    const onLeave = () => { idle = true; target = rest(); wake() }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', reset)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', reset)
      window.removeEventListener('scroll', measure)
      place(rest())
    }
  }, [reduceMotion])

  return (
    <footer
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-[var(--ivory)] pt-2 md:pt-3 pb-4 ${seamClassName}`.trim()}
    >
      {/* THE VERTICAL BUDGET, top to bottom: pt-6/8, statement, mt-4/5,
          links, mt-5/6, rule, mt-3, visitor count, mt-4/5, Thai band, pb-4.
          Six gaps and two paddings, and between them they are now most of
          what is left to cut here — the statement itself is 123px of the
          footer's ~300 at 1440, and it is the one thing in here that is
          supposed to be big. Tightened twice: the gaps alone used to total
          152px, more than the statement they were separating.

          Anything added to this stack costs the footer twice, once for the
          element and once for the gap above it. */}
      {/* DEFINED HERE, not beside ChalkTexture at the app root, and the
          difference is deliberate: that filter is shared by the hero name,
          the nav wordmark and the footer CTA, so its id has to be global.
          This one has a single consumer and carries moving state — the light
          position — which belongs with the component that drives it.

          The recipe: blur the glyphs' alpha into a height field, rake a point
          light across it, mask the lighting back inside the letterforms, then
          MULTIPLY that over the real text. Multiply rather than replace is
          what keeps the text's own colour: where the light lands the result
          is the near-background ivory, where it does not the letter darkens.
          Compositing with `in` alone would throw the colour away and paint
          pure lighting, which loses the tint the rest of the page is set in. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id="footer-relief" x="-15%" y="-80%" width="130%" height="260%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="height" />
          <feDiffuseLighting in="height" surfaceScale="4" diffuseConstant="1" lightingColor="#ffffff" result="lit">
            <fePointLight ref={lightRef} x="0" y="0" z="80" />
          </feDiffuseLighting>
          {/* THE AMBIENT FLOOR, and it is the whole reason this reads as a
              surface rather than as engraving. feDiffuseLighting has no
              ambient term: where a normal turns away from the light, N·L
              reaches 0 and the output is pure black. Multiplying that over
              the text drives the strokes to black whatever colour the text
              is — measured, setting the text to pure #ffffff left 4.08% of
              pixels below level 120 against 4.32% at --ivory-deep, i.e. the
              colour does essentially nothing. The darkness was never the
              fill, it was the lighting bottoming out.

              SLOPE 0.48 IS MATCHED TO KAREN LOU'S FOOTER WORDMARK, which is
              the look this is aiming at. Hers is a pre-rendered transparent
              PNG, so there was no technique to copy — only a target to hit.
              Measured off her asset: perfectly neutral (R=G=B), ink spanning
              181..255 on a white page, median 233. Normalised against the
              background that is min 0.710, median 0.914, band 0.290.

              Swept against those: slope 0.45 gave min 0.723 / band 0.261 and
              0.55 gave 0.656 / 0.328, so 0.48 sits on her numbers. Median
              comes out 0.957 against her 0.914 — ours carries slightly less
              of its area in shadow, which is the shape of the bevel rather
              than its range, and not something slope can reach.

              SLOPE IS THE ONLY DIAL THAT MOVES THE RANGE. surfaceScale was
              swept 6 -> 12 -> 20 -> 30 and stdDeviation 4 -> 2 with the
              output identical to three decimals every time: the lighting
              already spans its full 0..1 across glyph edges, so those two
              redistribute where shading falls, not how far it goes. Change
              them for the character of the bevel; change slope for depth. */}
          <feComponentTransfer in="lit" result="ambient">
            <feFuncR type="linear" slope="0.48" intercept="0.52" />
            <feFuncG type="linear" slope="0.48" intercept="0.52" />
            <feFuncB type="linear" slope="0.48" intercept="0.52" />
          </feComponentTransfer>
          <feComposite in="ambient" in2="SourceAlpha" operator="in" result="litText" />
          <feBlend in="SourceGraphic" in2="litText" mode="multiply" />
        </filter>
      </svg>

      <div className="page-content-shell">
        {/* THE NAME AS THE CLOSE, replacing "Let's work together" — the page
            ends on whose page it is rather than on a request. Two lines, the
            surname set larger in the script and riding up into the first, so
            the pair reads as one mark rather than two stacked words.

            IT STILL OPENS MAIL, WITH NOTHING SAYING SO. The "Contact" pill
            that used to follow the cursor here is gone, so the only hint
            left is the pointer cursor on a mouse — and none at all on touch
            or by keyboard, since a div with onClick is not focusable and
            never was. That is survivable while Email / LinkedIn / GitHub sit
            directly underneath carrying the same address, and it is the
            state to remove entirely rather than re-decorate if this stops
            being a control.

            The click is still scoped to the name rather than the footer: a
            blanket handler out here would hijack those three links.

            No chalk filter on the name. At this size the displacement reads
            as a printing fault rather than as texture, and the relief
            lighting is doing the surface work instead. */}
        <div
          className="footer-name md:cursor-pointer"
          onClick={() => {
            window.location.href = 'mailto:kataliyasun@gmail.com'
          }}
        >
          <span
            ref={nameRef}
            className="footer-name-given"
            style={{ fontFamily: SCRIPT_FONT, fontWeight: 400, filter: 'url(#footer-relief)' }}
          >
            Kataliya Sungkamee
          </span>
          {/* The ramp is the colour: a slight drift across the word rather
              than one flat tint, held at the alpha of a watermark so it reads
              as a tinted surface and not as coloured type. The hairline
              stroke in .footer-name-family is what makes it glass. 
          <span className="footer-name-family" style={{ fontFamily: SCRIPT_FONT }}>
            <Kinetic
              text="Sungkamee"
              ramp={['rgba(45, 136, 169, 0.34)', 'rgba(168, 85, 143, 0.28)']}
            />
          </span>
          */}
        </div>

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
        <div
          className="mt-3 flex justify-end text-[14px] text-[var(--walnut-faint)]"
          style={{ fontFamily: FONT, fontWeight: 400 }}
        >
          {visitor !== null && (
            <span>You are visitor №{String(visitor).padStart(4, '0')}</span>
          )}
        </div>
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
