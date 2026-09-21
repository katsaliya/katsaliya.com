/* ═══════════════════════════════════════════════════════════════════════════
   HOME.JSX — / and /about

   Both "/" and "/about" render this component and land on the hero. The
   About section that "/about" used to scroll into has been removed and is
   being rebuilt; until it returns, the two routes are indistinguishable.

   Replaces the old pages/Work.jsx (masonry grid moved to /work, where the
   WorkCarousel now lives) and pages/About.jsx (content ported in below,
   restructured around scroll-triggered reveals instead of a static page).

   Styled in Tailwind utility classes directly in the JSX, matching
   components/WorkCarousel/Carousel.jsx's convention, rather than a
   dedicated page stylesheet. Font-family values are inline style (Tailwind
   arbitrary classes don't handle multi-word quoted family names cleanly),
   same pattern Carousel.jsx uses. Colors reference this site's existing
   design tokens (--ivory/--walnut/--gold/--orchid/--jade from shared.css)
   via Tailwind's arbitrary-value var() syntax, not a duplicated palette.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import Nav, { NAV_NAME_FONT_SIZE } from '../components/Nav'
import SideSocial from '../components/SideSocial'
import Disciplines from '../components/Disciplines'
import HowIGotHere from '../components/HowIGotHere'
import WhereIveBeen from '../components/WhereIveBeen'
import SiteFooter from '../components/SiteFooter'
import { CHALK_TEXTURE } from '../components/ChalkTexture'
import CursorTag from '../components/CursorTag'
import LineReveal from '../components/LineReveal'

/* ─── Font — matches the Work page (Nav, carousel labels, project list all
   run on DM Sans alone; nothing else is actually loaded there). Weights
   pulled in via index.html's Google Fonts link: 400/500/600 only. ─── */
const FONT = "'DM Sans', sans-serif"

/* ─── Script headline — Coneria Script Slanted, under a purchased
   commercial license (see the @font-face note in shared.css). ─── */
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

/* The name's landing font-size once docked into the nav slot. Imported from
   the nav rather than restated, so the FLIP cannot be measuring against a
   size the nav no longer uses. */

/* ─── Loader: how small the name starts, centered in the viewport, before
   growing/moving into its natural hero position. ─── */
const NAME_LOADER_SCALE = 0.42

/* ─── tldr; copy — held here rather than inline in the JSX because it is
   rendered split into per-word spans (the paragraph's entrance staggers
   across words, see the hero-scene timeline), and a single source keeps
   the in-hero version and the narrow-viewport fallback from drifting. ─── */
const TLDR_COPY =
  'A multidisciplinary creative passionate about working at the intersection of people, storytelling, and technology. I believe in designing between essentialism and beauty, and creating social & content that makes people feel FOMO.'

export default function Home() {
  const { pathname } = useLocation()
  const heroRef = useRef(null)
  const nameGroupRef = useRef(null)
  const navNameSlotRef = useRef(null)
  const navLinksGroupRef = useRef(null)
  const flowerImgRef = useRef(null)
  const tldrRef = useRef(null)
  const tldrLabelRef = useRef(null)
  const pointerFineRef = useRef(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [pointerFine, setPointerFine] = useState(false)
  const [heroLanded, setHeroLanded] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  /* ─── Page setup: body class + reduced-motion + drop into About on /about ─── */
  useEffect(() => {
    document.body.className = 'page-home-body'

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)

    // Plain window.scrollTo()/scrollIntoView() get silently overridden by
    // Lenis's own raf loop the next frame — it has to go through Lenis's
    // scrollTo() instead, which App.jsx exposes on window.__lenis for
    // exactly this. Wait a frame first: App's effect (which creates it)
    // runs after this one on initial mount (children fire before parents),
    // but both are flushed synchronously before the next animation frame.
    /* Always the top now. The About section this used to scroll into has
       been removed pending a rebuild, so /about currently lands on the hero
       like / does — see the note where that section used to be. */
    requestAnimationFrame(() => {
      window.__lenis?.scrollTo(0, { immediate: true })
    })

    return () => {
      document.body.className = ''
      mq.removeEventListener('change', onChange)
    }
  }, [pathname])

  /* ─── Pointer type: the "{ scroll down }" cursor-follow only makes sense
     with a real mouse — touch gets a static fallback instead. ─── */
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setPointerFine(mq.matches)
    pointerFineRef.current = mq.matches
    const onChange = (e) => {
      setPointerFine(e.matches)
      pointerFineRef.current = e.matches
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* The scroll cue is for someone who has not worked out that the page
     scrolls. The moment they do, it has said everything it has to say — and
     hasScrolled never resets, so it is gone for the rest of the visit rather
     than reappearing every time they return to the top. */
  /* The landing runs on a bare timeline rather than inside an effect, so
     nothing cleans it up on its own. */
  useEffect(() => () => landingRef.current?.kill(), [])

  useEffect(() => {
    const onFirstScroll = () => setHasScrolled(true)
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onFirstScroll)
  }, [])

  /* The nav links arrive on the first scroll, on the same signal that retires
     the "Scroll" tag — the cue leaves as the navigation appears, which is the
     one moment where both are saying the same thing. One-way, like everything
     else on this page: scrolling back to the top does not take them away
     again. Held behind heroLanded so they cannot beat the landing to it. */
  useEffect(() => {
    const links = navLinksGroupRef.current
    if (!links || !heroLanded || !hasScrolled) return
    if (reduceMotion) {
      gsap.set(links, { opacity: 1, y: 0 })
      return
    }
    const tween = gsap.to(links, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    return () => tween.kill()
  }, [hasScrolled, heroLanded, reduceMotion])

  /* ─── Fit the script name to the full container width: font-size can't be
     solved with CSS alone here (clamp() has no way to know this specific
     font's glyph-width-to-font-size ratio), so it's measured — render at a
     baseline size, read each line's natural (nowrap) width, solve for the
     font-size that makes the wider line exactly fill the container. Both
     lines share that one font-size, same as the mock: "Sungkamee" reaches
     the edges, "Kataliya" is shorter at the same size, not stretched to
     match. useLayoutEffect so this resolves before first paint — no
     flash of the unfit baseline size. Re-fits on resize (font-size only —
     see the loader effect below for the one-time starting transform), and
     once webfonts settle — see the fonts.ready note below. ─── */
  useLayoutEffect(() => {
    const container = nameGroupRef.current
    if (!container) return
    const lines = container.querySelectorAll('.line-reveal-row')
    if (!lines.length) return

    const fit = () => {
      const containerWidth = container.clientWidth
      const baseFontSize = parseFloat(getComputedStyle(container).fontSize)
      if (!containerWidth || !baseFontSize) return
      let maxRatio = 0
      lines.forEach((line) => {
        const ratio = line.scrollWidth / baseFontSize
        if (ratio > maxRatio) maxRatio = ratio
      })
      if (!maxRatio) return
      container.style.fontSize = `${containerWidth / maxRatio}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(container)

    /* The observer above catches viewport resizes and nothing else — and it
       specifically CANNOT catch the event that most changes this
       measurement, a webfont swapping in. Its width is the shell's (fixed)
       and its height is line-count x font-size (also unchanged by a swap);
       only the rows inside get wider or narrower, and those aren't observed.
       So on a cold cache the name is fitted against the fallback face's much
       narrower glyphs, and when Coneria arrives it overflows --hero-max
       badly — measured at 2560px: 2812px of name in an 1800px column. A warm
       cache hides this completely, which is what makes it so easy to miss. */
    let alive = true
    document.fonts?.ready.then(() => { if (alive) fit() })

    return () => {
      alive = false
      ro.disconnect()
    }
  }, [])

  /* ─── The loader, and the landing it hands off to ──────────────────
     The name is fitted to its natural full-width box (above), then parked
     small and centred while the per-character reveal plays. What used to
     happen next was: grow to full size, then wait for a pinned scroll-scrub
     to dock it into the nav. It goes straight to the nav now — the growing
     step is gone, and so is the scrub, the pin, and the one-way clamp that
     kept fighting it.

     Everything is measured against the natural box with ONE transform
     origin. Mixing origins between the two states (centre for the loader,
     left for the nav) meant the morph could not be a single tween, because
     the same x/y mean different things under each. Left-centre throughout:
     scaling holds the left edge and the vertical centre, so both states are
     just an offset and a scale from the same reference. ─── */
  const naturalRef = useRef(null)
  const landingRef = useRef(null)

  /* Where the name sits at rest, and how big it is there. Read before any
     transform is applied, since a transformed rect would describe the
     loader rather than the layout. */
  const measureNatural = () => {
    const el = nameGroupRef.current
    if (!el) return null
    const prev = el.style.transform
    el.style.transform = 'none'
    const rect = el.getBoundingClientRect()
    const fontSize = parseFloat(getComputedStyle(el).fontSize) || 1
    el.style.transform = prev
    return { left: rect.left, centerY: rect.top + rect.height / 2, width: rect.width, fontSize }
  }

  /* Small and centred, expressed from the natural box. */
  const loaderState = (nat) => ({
    x: window.innerWidth / 2 - (nat.width * NAME_LOADER_SCALE) / 2 - nat.left,
    y: window.innerHeight / 2 - nat.centerY,
    scale: NAME_LOADER_SCALE,
  })

  /* Docked in the nav slot, expressed from the same box. */
  const navState = (nat) => {
    const slot = navNameSlotRef.current?.getBoundingClientRect()
    if (!slot) return null
    return {
      x: slot.left - nat.left,
      y: slot.top + slot.height / 2 - nat.centerY,
      scale: NAV_NAME_FONT_SIZE / nat.fontSize,
    }
  }

  useLayoutEffect(() => {
    const container = nameGroupRef.current
    if (!container) return
    if (reduceMotion) {
      setHeroLanded(true)
      return
    }
    const nat = measureNatural()
    if (!nat) return
    naturalRef.current = nat
    gsap.set(container, { ...loaderState(nat), transformOrigin: 'left center' })
  }, [reduceMotion])

  /* ─── The landing. One timeline, fired when the per-character reveal
     finishes:

       0.00  name morphs toward the nav
       0.30  flower resolves
       0.85  tldr; label
       0.97  tldr; words
       0.92  name -> wordmark crossfade, mid-flight by design

     The nav LINKS are deliberately absent from this list — they arrive on
     scroll, not on load, so the first screen is the wordmark, the flower and
     the sentence and nothing else competing for it.

     The starts overlap rather than queue. Each one begins while the one
     before it is still running, which is how the /work ring's entry is built
     — its heading arrives while the fan is still opening, not once it has
     stopped.

     Overlapping rather than sequential is the point, and it is how the /work
     ring's entry is built — its heading arrives while the fan is still
     opening, not once it has stopped. Nothing here waits for the thing
     before it to finish.

     No ScrollTrigger, no pin, no scrub. The dock was scroll-driven and the
     one-way behaviour asked of it fought that at every turn; on a timeline it
     is one-way for free, because a timeline that is never reversed never
     reverses. ─── */
  const onNameRevealComplete = () => {
    const nameGroup = nameGroupRef.current
    const navSlot = navNameSlotRef.current
    const navLinksGroup = navLinksGroupRef.current
    const flowerImg = flowerImgRef.current
    const tldr = tldrRef.current
    const tldrLabel = tldrLabelRef.current
    const tldrWords = tldr ? [...tldr.querySelectorAll('.tldr-word')] : []

    const showAll = () => {
      gsap.set([navSlot, navLinksGroup, flowerImg, tldr, tldrLabel, ...tldrWords].filter(Boolean), {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      })
      if (flowerImg) gsap.set(flowerImg, { rotation: 29.309 })
      if (nameGroup) gsap.set(nameGroup, { opacity: 0 })
      setHeroLanded(true)
    }

    if (reduceMotion) {
      showAll()
      return
    }

    const nat = naturalRef.current || measureNatural()
    const to = nat && navState(nat)
    if (!nat || !to) {
      showAll()
      return
    }

    /* Starting states. The tldr; container is visible and its PARTS are what
       hide — they are the things that animate. */
    if (navSlot) gsap.set(navSlot, { opacity: 0 })
    if (navLinksGroup) gsap.set(navLinksGroup, { opacity: 0, y: -6 })
    if (flowerImg) gsap.set(flowerImg, { opacity: 0, scale: 0.94, y: 18, rotation: 29.309 })
    if (tldr) gsap.set(tldr, { opacity: 1, y: 0 })
    if (tldrLabel) gsap.set(tldrLabel, { opacity: 0, y: 14 })
    if (tldrWords.length) gsap.set(tldrWords, { opacity: 0, y: '0.5em', filter: 'blur(8px)' })

    /* The rest of the page is gated on this, and it is set up front rather
       than onComplete — the contact links should be arriving with everything
       else, not queued behind it. */
    setHeroLanded(true)

    const tl = gsap.timeline()

    tl.to(nameGroup, { ...to, duration: 1.15, ease: 'power3.inOut' }, 0)
    /* Handoff at the end of the travel: the name is already sitting exactly
       on the slot by now, so this is a pure crossfade and nothing moves. */
    tl.to(nameGroup, { opacity: 0, duration: 0.28, ease: 'none' }, 0.92)
    tl.to(navSlot, { opacity: 1, duration: 0.28, ease: 'none' }, 0.92)

    /* The flower starts while the name is still travelling — it takes over
       the screen the name is leaving rather than waiting for it to go. */
    if (flowerImg) {
      tl.to(flowerImg, { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: 'power3.out' }, 0.3)
    }
    if (tldrLabel) {
      tl.to(tldrLabel, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85)
    }
    if (tldrWords.length) {
      /* 0.85 / power4.out / 0.018 — the ring's own heading reveal timing
         (params.js textTime / textEase / textStagger), a touch looser
         because these are words rather than glyphs. */
      tl.to(
        tldrWords,
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power4.out', stagger: 0.018 },
        0.97,
      )
    }

    landingRef.current = tl
  }

  return (
    <>
      {/* The shared bar — see components/Nav.jsx. Home differs only in that
          its wordmark is the landing point of the hero's FLIP and its links
          fade in on the same scrub, so it hands over the two refs and the
          opacity-0 starting states. Everything else about the nav lives in
          one place now rather than being duplicated here. */}
      <Nav
        wordmarkRef={navNameSlotRef}
        linksRef={navLinksGroupRef}
        wordmarkClassName="opacity-0"
        linksClassName="opacity-0"
        wordmarkAriaHidden
      />

      <SideSocial />
      <div className="relative min-h-screen w-full bg-[var(--ivory)]">
        <main>
          {/* ═══════════════════════════════════════════════════════
              HOME — full-width script name hero, matching the Figma redesign
              ═══════════════════════════════════════════════════════ */}
          <div
            ref={heroRef}
            /* No overflow-hidden. The flower deliberately runs ~121px past
               the hero's bottom edge, and clipping it there guillotined it
               along the exact line where the page turns grey — the worst
               possible place for a cut, because the colour change draws the
               eye straight to it. Letting it bleed reads as one composition
               crossing a section boundary instead.

               Safe to drop here specifically: the hero's z-[1] beats the
               Disciplines section's z-auto, so the overflow paints OVER the
               grey rather than under it; the bleed lands in that section's
               128px of top padding, so it never reaches the marquee; body
               already carries overflow-x:hidden for the sideways spill; and
               while the hero is pinned it is position:fixed at viewport
               height, so anything below its box is off-screen anyway. */
            className="relative w-full min-h-screen bg-[var(--ivory)] flex flex-col justify-center z-[1] py-28 md:py-0"
          >
            {/* The same glass pill the disciplines and the footer use, rather
                than a one-off text follower — one cursor object across the
                whole site. Gated on hasScrolled so it retires once its job is
                done, and CursorTag is pointer-only, so the static touch cue
                below is what serves a phone. */}
            <CursorTag targetRef={heroRef} label="Scroll" enabled={!hasScrolled} />

            {/* .shell-hero, not .shell — the readability cap exists to
                protect measure, and there is no prose here, just a two-line
                wordmark. It doubles as the name's size ceiling: the fit
                effect below solves font-size from this element's own
                clientWidth, so capping the shell at --hero-max is what stops
                a script face growing unbounded on an ultrawide display. */}
            <div className="shell-hero">
              {/* ─── Name — sized to fill the full container width (see the
                  fit useLayoutEffect above; clamp() alone can't solve this
                  for an arbitrary script font's glyph metrics) ─── */}
              <div
                ref={nameGroupRef}
                className="leading-[1.14] tracking-[-0.01em] text-[var(--walnut)] text-[clamp(3rem,15vw,14rem)] will-change-[transform,opacity]"
                style={{ fontFamily: SCRIPT_FONT, filter: CHALK_TEXTURE }}
              >
                <LineReveal
                  lines={['Kataliya', 'Sungkamee']}
                  splitBy="char"
                  trigger="load"
                  delay={0.1}
                  stagger={0.015}
                  duration={0.95}
                  ease="power4.out"
                  blur
                  wipe={false}
                  reduceMotion={reduceMotion}
                  onComplete={onNameRevealComplete}
                />
              </div>
            </div>

            {/* Touch fallback: no cursor to stick to, so a static cue instead.
                Sits above the contact links row rather than sharing its
                bottom offset. */}
            {!pointerFine && (
              <p
                className="absolute bottom-28 left-1/2 -translate-x-1/2 text-xs text-center text-[var(--orchid-clear)]"
                style={{ fontFamily: FONT, fontStyle: 'italic', fontWeight: 500 }}
              >
                {'{ scroll down }'}
              </p>
            )}

            {/* ─── Flower motif — lives in the hero itself, not a section
                further down: it resolves in on the same timeline as the
                name's morph into the nav, arriving while that is still
                travelling rather than waiting for it. Sits absolute/right so it doesn't disturb
                the centered name's own layout. Sized to match the Figma
                frame — a real focal element, not a small accent.

                Filter's displacement scale is a fixed value, not scrubbed —
                re-rendering feTurbulence/feDisplacementMap every scroll
                tick at this element's (now uncapped, often 700px+) render
                size is genuinely expensive; a static scale still gives it
                the same rough/chalky edge as the name text, just computed
                once instead of every frame. xl+ only (not md+): below
                ~1280px there's no amount of right-shifting that keeps the
                flower's rotated bounding box (29.309deg tips the real
                on-screen footprint well past its unrotated CSS width) off
                the tldr; block's text.

                SIZED BY HEIGHT, not width, and this is the whole point:
                the binding constraint here is vertical — the flower has to
                clear the nav — and a vw width makes its on-screen height a
                function of window WIDTH, so a wide-and-short window blew it
                straight through the nav and off both ends of the viewport.
                At the old 57.7vw it stood 1368px tall in an 870px viewport,
                cropped top and bottom. 92vh with a -14% bottom keeps it
                dominant (~105% of viewport height) while clearing both the
                nav and the tldr; block, cropping off the BOTTOM instead —
                which is where it was already bleeding. Sizing by vh is what
                makes that hold at any aspect ratio.

                The rotation is what makes these numbers unobvious: at
                29.309deg the real on-screen footprint is
                w*sin + h*cos = 1.23x the element's own height, and the PNG
                is opaque almost edge to edge (alpha spans 0.063-0.912 of its
                width, 0.014-0.975 of its height), so there is no transparent
                margin absorbing any of it. Values were solved against the
                measured opaque corners, not the bounding box: at 1512x870
                this lands the petals at top 127 (nav ends at 65) and left 775
                (the tldr; block ends at 647), cropping ~19% off the bottom
                and 40px off the right.

                right is -1vw rather than the old -8vw because the anchor is
                the RIGHT edge: shrinking the image while pinning that edge
                walks its left side rightward, and at the old inset most of
                the smaller flower hung off-screen. ─── */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              <filter id="flower-texture" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="3" seed="4" result="grain" />
                <feDisplacementMap in="SourceGraphic" in2="grain" scale="7" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>
            {/* Hero furniture — the flower and tldr; both need to span the
                hero's full HEIGHT (they anchor to its bottom) while aligning
                to the hero SHELL's edges, and the shell above is only as tall
                as the name it wraps. Hence this overlay: a full-box layer
                carrying its own copy of the shell, with a content-box div
                inside it for these two to position against.

                It has to be a separate box rather than left-[--hero-pad] on
                each of them, because absolute positioning resolves against
                the padding box — a raw px offset would track the viewport
                edge, and past --hero-max the shell is centered and no longer
                sits there. */}
            <div
              className="absolute inset-0 pointer-events-none"
              /* Clipped on three sides only. The flower is meant to spill
                 40px off the right (that crop is the composition) and 121px
                 past the bottom (so it crosses into the grey section rather
                 than being cut at the seam) — but an unclipped right spill
                 grows the document's scroll width and gives the whole page a
                 horizontal scrollbar. overflow-hidden cannot express "clip
                 three sides", so: inset() with a negative bottom leaves that
                 one edge open and holds the other three at the hero's box.

                 On this wrapper rather than the hero itself, because
                 clip-path makes an element a containing block for fixed
                 descendants — on the hero that would re-anchor the
                 "{ scroll down }" cursor label, which is fixed and lives
                 outside this wrapper. */
              style={{ clipPath: 'inset(0px 0px -240px 0px)' }}
            >
              <div className="shell-hero h-full">
                <div className="relative h-full">
                  <img
                    ref={flowerImgRef}
                    src="/images/assets/orchid-logo-placeholder.png"
                    alt=""
                    className="hidden xl:block absolute right-[-1vw] bottom-[-14%] h-[92vh] w-auto max-w-none pointer-events-none opacity-0 will-change-[transform,opacity]"
                    style={{ filter: 'url(#flower-texture)' }}
                  />

                  {/* ─── tldr; — settles in lower-left on the same screen as
                      the nav-dock + flower, not a section further down (see
                      the scroll effect above: fades in on the same scrubbed
                      timeline). "01" prefix matches the site's established
                      numbered-list convention. ─── */}
                  <div
                    ref={tldrRef}
                    className="hidden xl:block absolute left-0 bottom-[6%] w-[594px] max-w-full opacity-0"
                  >
                    {/* The label and each word carry their own opacity-0 as
                        well as the container: the hidden resting state has to
                        exist in CSS, because the effect that would otherwise
                        establish it waits on heroLanded and so does not run
                        for the first couple of seconds of a load. Anything
                        relying on the effect alone is simply on screen until
                        then. gsap writes inline styles, which win over these. */}
                    <div ref={tldrLabelRef} className="flex items-baseline gap-3 mb-5 opacity-0">
                      <span
                        className="text-[16px] leading-[1.54] text-[var(--walnut-faint)]"
                        style={{ fontFamily: FONT, fontWeight: 400 }}
                      >
                        01
                      </span>
                      <span
                        className="text-[32px] leading-[1.54] text-[var(--walnut)]"
                        style={{ fontFamily: FONT, fontWeight: 700 }}
                      >
                        TLDR;
                      </span>
                    </div>
                    {/* Split per word so the paragraph resolves in a stagger
                        rather than as one block — the ring's heading does the
                        same thing per glyph. The space is a real text node
                        BETWEEN the spans, not inside them: a trailing space
                        at the end of an inline-block sits at the edge of its
                        own line box and gets collapsed away, which would run
                        every word together. */}
                    <p
                      className="text-[32px] leading-[1.54] text-[var(--walnut)]"
                      style={{ fontFamily: FONT, fontWeight: 500 }}
                    >
                      {TLDR_COPY.split(' ').map((word, i, all) => (
                        <Fragment key={i}>
                          <span className="tldr-word inline-block opacity-0">{word}</span>
                          {i < all.length - 1 ? ' ' : ''}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback for the tldr; content above: the in-hero version only
              shows xl+ (see the flower/tldr comment above — narrower than
              that, the two collide), so without this, that bio text would
              be lost entirely between 0 and 1280px rather than just
              presented differently. Plain static block, no scroll-tied
              reveal. */}
          <div className="xl:hidden relative w-full bg-[var(--ivory)] py-16">
            <div className="shell">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-sm text-[var(--walnut-faint)]" style={{ fontFamily: FONT }}>01</span>
              <span className="text-sm text-[var(--walnut)]" style={{ fontFamily: FONT, fontWeight: 600 }}>
                TLDR;
              </span>
            </div>
            <p
              className="text-[clamp(1.3rem,5vw,1.8rem)] leading-[1.4] text-[var(--walnut)]"
              style={{ fontFamily: FONT, fontWeight: 400 }}
            >
              {TLDR_COPY}
            </p>
            </div>
          </div>

          {/* Disciplines — the rebuilt replacement for the old Skills &
              Toolbox list. Everything else that used to sit below the hero
              (the rest of About, and the site footer) is still removed
              pending its own rebuild. */}
          <Disciplines reduceMotion={reduceMotion} />
          {/* Record before narrative. "How I got here" closes on a grateful
              sign-off that is written as an ending — stranded mid-page it
              reads oddly, and it only works as the last thing on the page. */}
          <WhereIveBeen reduceMotion={reduceMotion} />
          <HowIGotHere reduceMotion={reduceMotion} />
          <SiteFooter reduceMotion={reduceMotion} />
        </main>
      </div>
    </>
  )
}
