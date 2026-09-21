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

   It reuses chase() and smoothstep() from the ring rather than
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
import { CHALK_TEXTURE } from './ChalkTexture'
import CursorTag from './CursorTag'
import Marquee from './Marquee'
import { chase, smoothstep } from './WorkCarousel/ring/utils'

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
  { label: 'Email', href: 'mailto:kataliyasun@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/katsaliya' },
  { label: 'GitHub', href: 'https://github.com/katsaliya' },
]

/* Cursor response, all in one place. reach is in px; lift and pull are the
   maximum displacement a character will take at the very centre of it. */
const REACH = 260
const LIFT = 18
const PULL = 0.14
const GRAB = 0.14 // per 60fps frame, taking up displacement
const RELEASE = 0.06 // and letting it go — deliberately much slower

function Kinetic({ text, className, style }) {
  return [...text].map((ch, i) => (
    <span
      key={i}
      className={`footer-char inline-block will-change-transform ${className || ''}`}
      style={style}
    >
      {ch === ' ' ? ' ' : ch}
    </span>
  ))
}

export default function SiteFooter({ reduceMotion = false }) {
  const rootRef = useRef(null)
  const ctaRef = useRef(null)
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

  /* ── the motion ── */
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduceMotion) return
    const chars = [...root.querySelectorAll('.footer-char')]
    if (!chars.length) return

    /* Rest positions are measured once and re-measured on resize, never in
       the loop — reading a rect per character per frame is a forced layout
       sixty times a second. */
    let rests = []
    const measure = () => {
      rests = chars.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
    }
    measure()

    const state = chars.map(() => ({ dx: 0, dy: 0 }))
    const pointer = { x: -9999, y: -9999, live: false }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.live = true
    }
    const onLeave = () => {
      pointer.live = false
    }
    /* On window rather than the footer: the characters should already be
       reacting as the cursor approaches from above, not snap to life at the
       boundary. */
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', measure)
    /* Rest positions move with the page, so they are stale after any scroll. */
    window.addEventListener('scroll', measure, { passive: true })

    let raf = 0
    let prev = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now

      for (let i = 0; i < chars.length; i++) {
        const rest = rests[i]
        let tx = 0
        let ty = 0

        if (pointer.live && rest) {
          const dx = pointer.x - rest.x
          const dy = pointer.y - rest.y
          const dist = Math.hypot(dx, dy)
          const f = smoothstep(REACH, REACH * 0.2, dist)
          if (f > 0.0001 && dist > 0.0001) {
            tx = dx * PULL * f
            ty = dy * PULL * f - LIFT * f
          }
        }

        const s = state[i]
        /* The asymmetry. Compared per axis on magnitude, so a character
           moving further from rest grabs and one returning releases. */
        const kx = Math.abs(tx) > Math.abs(s.dx) ? GRAB : RELEASE
        const ky = Math.abs(ty) > Math.abs(s.dy) ? GRAB : RELEASE
        s.dx += (tx - s.dx) * chase(dt, kx)
        s.dy += (ty - s.dy) * chase(dt, ky)

        chars[i].style.transform =
          Math.abs(s.dx) < 0.01 && Math.abs(s.dy) < 0.01
            ? ''
            : `translate3d(${s.dx.toFixed(2)}px, ${s.dy.toFixed(2)}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      chars.forEach((el) => {
        el.style.transform = ''
      })
    }
  }, [reduceMotion])

  return (
    <footer
      ref={rootRef}
      className="relative w-full overflow-hidden bg-[var(--ivory)] pt-12 md:pt-16 pb-8"
    >
      <div className="shell">
        {/* The statement. Script + orchid + sans, the same lockup grammar as
            the section marquees, so the close reads as part of the system
            rather than as a detached footer. */}
        {/* The statement is the hover area, not the whole footer — the footer
            also holds Email / LinkedIn / GitHub, and a blanket click handler
            over all of it would hijack those. */}
        <CursorTag targetRef={ctaRef} label="Contact" />
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center text-center gap-x-[0.24em] text-[clamp(2.4rem,8vw,7rem)] leading-[1.1] text-[var(--walnut)] md:cursor-pointer"
          onClick={() => {
            window.location.href = 'mailto:kataliyasun@gmail.com'
          }}
        >
          <span style={{ fontFamily: SCRIPT_FONT, filter: CHALK_TEXTURE }}>
            <Kinetic text="Let's" />
          </span>
          <img
            src="/images/assets/orchid-logo-placeholder.png"
            alt=""
            className="w-auto shrink-0"
            style={{ height: '0.62em', transform: 'rotate(-0.2deg)' }}
          />
          <span
            style={{ fontFamily: FONT, fontWeight: 400, filter: CHALK_TEXTURE }}
            className="text-[0.62em]"
          >
            <Kinetic text="work together" />
          </span>
        </div>

        {/* One centred row under the statement.

            This was a 12-column split — links stacked vertically on the left,
            a two-line message beside them on the right. The message is gone,
            and with it the reason for the split: three short words in a
            column with an empty right half is worse than no layout at all.

            `footer-line` is kept on the row so it still catches the reveal
            that used to bring the message in; without it that timeline would
            target an empty NodeList and the links would simply appear. */}
        <div className="footer-line mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
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

        <div aria-hidden="true" className="relative mt-10 md:mt-12 h-px w-full">
          <div className="footer-rule absolute inset-0 h-px bg-[rgba(43,35,28,0.39)]" />
        </div>

        {/* The border-t that used to sit here has gone — it landed a few px
            under the rule above it and the two read as one thick line. */}
        <div
          className="mt-6 flex justify-end text-[14px] text-[var(--walnut-faint)]"
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
          page settling rather than announcing anything. */}
      <Marquee
        reduceMotion={reduceMotion}
        speed={12}
        className="mt-8 md:mt-10"
        ariaLabel="A Thai blessing: good luck, strong health, prosperity, a strong community, live well and be happy, friendship"
      >
        <span
          aria-hidden="true"
          className="whitespace-nowrap text-[clamp(1.1rem,1.7vw,1.5rem)] leading-[1.6] text-[var(--walnut-soft)] pr-[1.2em]"
          style={{ fontFamily: THAI_FONT, fontWeight: 400 }}
        >
          {THAI_BLESSING}
        </span>
      </Marquee>
    </footer>
  )
}
