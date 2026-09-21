/* ═══════════════════════════════════════════════════════════════════════════
   HOWIGOTHERE.JSX — the narrative section, below Disciplines

   Same ruled marquee title as Disciplines (see MarqueeTitle.jsx — Frame 6
   and Frame 10 are the same lockup at different box crops), then a single
   centred column of prose.

   Column width comes from the Figma frame: 725px, sitting at left 396 in a
   1512 frame — 396 left against 391 right, so it is centred, not aligned to
   the content column's left edge. Kept centred deliberately: under a
   full-bleed marquee a centred column reads as a chapter, where a
   left-aligned one would strand the right half of the screen. It is now the
   --prose-max token so later prose sections inherit the same measure.

   The type is NOT the frame's 32px / 500 throughout — see the note on the
   body below for why that was changed.

   Background is --ivory against Disciplines' --ivory-deep, continuing the
   alternating section rhythm.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeTitle from './MarqueeTitle'

gsap.registerPlugin(ScrollTrigger)

const FONT = "'DM Sans', sans-serif"

/* One entry per paragraph, each with the handles that close it. Kept as data
   rather than markup so the reveal below can stagger paragraphs without
   reaching into the DOM for text nodes, and so a handle's destination is one
   field to change rather than a URL buried in JSX.

   HANDLE DESTINATIONS ARE ASSUMED. Every one currently resolves to Instagram
   because that is where the original @the310table pointed and where an
   @-handle conventionally reads. Several of these plausibly live somewhere
   else — @katsaliya is TikTok and LinkedIn elsewhere on this site, @known is
   a case study here, and @alliedglobalmarketing is a company that may want
   LinkedIn. Give any handle an explicit `url` to override the default. */
const IG = (handle) => `https://www.instagram.com/${handle}`

const PARAGRAPHS = [
  {
    text: 'I recently graduated from SFSU with a dual background in Computer Science and Business Marketing.',
  },
  {
    text: 'My path started with creating personal social media content, where I fell in love with ideating videos, fixing aesthetics, and experimenting with new editing styles.',
    handles: ['alliedglobalmarketing', 'known', 'katsaliya'],
  },
  {
    text: 'As my coding skills grew, I naturally transitioned into product strategy and design—the perfect bridge to apply my eye for visuals directly to code.',
  },
  {
    text: 'After graduating, I returned to Los Angeles to launch the second location of our 26-year-old family restaurant. Working alongside my brother, who runs kitchen and house operations, I manage our entire creative side. On any given day, I’m fixing our website, shaping our branding, designing merch, or running our socials.',
    handles: ['emporiumthai', 'emporiumthaimarket', 'boothbyet'],
  },
  {
    text: 'Falling deep into the hospitality scene inspired my next move: building a community for the next generation of makers of LA.',
    handles: ['the310table'],
  },
]

/* Closing aside. The one place in this section where the type changes:
   italic, a step down in size, per the Figma spec (DM Sans italic 400 / 20px
   / 154%). Italic plus the parentheses is what marks it as an aside rather
   than another paragraph — it is deliberately NOT another body line.

   Sized with its own clamp rather than a flat 20px so it holds the same
   ratio to the body tier at every width (20 / 21.6 = 0.93) instead of
   converging with it on narrow screens. */
/* Non-breaking space before the emoji: without it the line wraps between
   "way" and the emoji, stranding "🧧)" alone on a second line. */
const CLOSING_NOTE =
  '(feeling inspired and grateful for all the opportunities that have come my way\u00A0🧧)'

export default function HowIGotHere({ reduceMotion = false }) {
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const paras = el.querySelectorAll('.hgh-p')
    if (!paras.length) return

    if (reduceMotion) {
      gsap.set(paras, { opacity: 1, y: 0 })
      return
    }

    gsap.set(paras, { opacity: 0, y: 20 })
    const tween = gsap.to(paras, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power4.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduceMotion])

  return (
    <section id="how-i-got-here" className="relative w-full overflow-hidden bg-[var(--ivory-deep)] pt-10 md:pt-12 pb-16 md:pb-24">
      {/* The trailing dash is what separates one cycle from the next, so the
          loop reads "How ❁ I got here - How ❁ I got here -" rather than
          running the two together. */}
      <MarqueeTitle
        script="How"
        sans="I got here"
        number="04"
        trailing="-"
        ariaLabel="How I got here"
        reduceMotion={reduceMotion}
        className="mb-8 md:mb-10"
      />

      <div className="shell">
        {/* One tier for the whole section — every paragraph identical, no
            lede. The narrative was previously set in the page's PULL-QUOTE
            tier (32px / 500 / --walnut, what the hero's tldr; and the
            Disciplines blurbs use); that treatment is built for a sentence or
            two, and ~200 words of it reads as a wall. This is the page's
            existing BODY tier instead (the AI thesis's), so no new type style
            is invented here.

            Leading is 1.7 rather than the thesis's 1.5: three lines can sit
            tight, five paragraphs cannot. The measure works out better at
            this size too — 725px holds ~43 characters at 32px but ~66 here,
            which is the comfortable band, so the Figma column width survives
            the change rather than fighting it. */}
        <div
          ref={bodyRef}
          className="mx-auto flex flex-col"
          style={{ maxWidth: 'var(--prose-max)' }}
        >
          {PARAGRAPHS.map(({ text, handles = [] }, i) => (
            <p
              key={i}
              className="hgh-p text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.7] text-[var(--walnut-soft)] mb-7 last:mb-0"
              style={{ fontFamily: FONT, fontWeight: 400 }}
            >
              {text}
              {/* Inline at the end of the paragraph rather than on their own
                  row: they read as a citation of what the sentence just
                  described, and a separate row would make them a list. */}
              {handles.map((h) => (
                <span key={h}>
                  {' '}
                  <a
                    href={typeof h === 'string' ? IG(h) : h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap text-[var(--orchid)] no-underline border-b border-transparent transition-colors duration-300 hover:border-[var(--orchid)]"
                  >
                    @{typeof h === 'string' ? h : h.handle}
                  </a>
                </span>
              ))}
            </p>
          ))}

          <p
            className="hgh-p mt-3 italic text-balance text-[clamp(1rem,1.48vw,1.25rem)] leading-[1.54] text-[var(--walnut-soft)]"
            style={{ fontFamily: FONT, fontWeight: 400 }}
          >
            {CLOSING_NOTE}
          </p>
        </div>
      </div>
    </section>
  )
}
