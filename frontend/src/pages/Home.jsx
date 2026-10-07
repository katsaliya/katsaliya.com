/* ═══════════════════════════════════════════════════════════════════════════
   HOME.JSX — /

   The site root, and the about page: the bio hero, the disciplines, where
   she has been, how she got here. There is no separate About route — /about
   redirects here (see App.jsx). It briefly rendered this same component and
   scrolled into an About section; that section was removed, which left two
   URLs doing exactly the same thing, so one of them went.

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
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav, { NAV_NAME_FONT_SIZE } from '../components/Nav'
import SideSocial from '../components/SideSocial'
import SelectedWork from '../components/SelectedWork'
import Disciplines from '../components/Disciplines'
import HowIGotHere from '../components/HowIGotHere'
import WhereIveBeen from '../components/WhereIveBeen'
import SiteFooter from '../components/SiteFooter'
import { CHALK_TEXTURE } from '../components/ChalkTexture'
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

/* ─── Intro copy — held here rather than inline in the JSX because it is
   rendered split into per-word spans (the paragraph's entrance staggers
   across words, see the hero-scene timeline), and a single source keeps
   the in-hero version and the narrow-viewport fallback from drifting.

   THE NAME TLDR_COPY IS HISTORICAL. The label above this paragraph read
   "TLDR;" until it became "+ (Liya)"; the constant, the refs (tldrRef,
   tldrLabelRef) and the .tldr-word class the timeline selects on all still
   carry the old word. They are renamed together or not at all — .tldr-word
   in particular is a GSAP selector, so changing it here without changing
   the hero-scene timeline silently drops the paragraph's stagger. ─── */
const TLDR_COPY =
  'I bridge tech and storytelling, from leading social growth at an AI startup to running creative for a family restaurant brand in LA. My work spans product design, growth marketing, and social media, and launch day is always my favorite: making something new feel impossible to miss.'

export default function Home() {
  const { pathname } = useLocation()
  const nameGroupRef = useRef(null)
  const navNameSlotRef = useRef(null)
  const navLinksGroupRef = useRef(null)
  const flowerImgRef = useRef(null)
  const tldrRef = useRef(null)
  const tldrLabelRef = useRef(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [heroLanded, setHeroLanded] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  /* ─── Page setup: body class + reduced-motion + land at the top ─── */
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
    /* Always the top. This used to scroll into an About section on /about;
       that section is gone and /about now redirects here, so there is only
       ever one landing position. */
    requestAnimationFrame(() => {
      window.__lenis?.scrollTo(0, { immediate: true })
    })

    return () => {
      document.body.className = ''
      mq.removeEventListener('change', onChange)
    }
  }, [pathname])

  /* hasScrolled is the page's "they have worked out that this scrolls"
     signal. It drove two things and now drives one: the hover pill that used
     to follow the cursor across the hero is gone, and the nav links below
     are what is left. It never resets, so whatever it gates is one-way for
     the rest of the visit rather than reappearing on every return to the
     top. The listener is `once`, so it costs nothing after the first
     scroll. */
  /* The landing runs on a bare timeline rather than inside an effect, so
     nothing cleans it up on its own. */
  useEffect(() => () => landingRef.current?.kill(), [])

  useEffect(() => {
    const onFirstScroll = () => setHasScrolled(true)
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onFirstScroll)
  }, [])

  /* The nav links arrive on the first scroll. That used to be a handover —
     the "Scroll" pill retired on the same signal, so the cue left exactly as
     the navigation appeared — and with the pill removed this is simply when
     the links show up. One-way, like everything else on this page: scrolling
     back to the top does not take them away again. Held behind heroLanded so
     they cannot beat the landing to it. */
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

    /* AND TELL SCROLLTRIGGER. fit() changes the name's font-size, which
       changes the hero's height, which moves every section on the page —
       and ScrollTrigger caches each trigger's start as a scroll position
       computed from the layout as it stood when the trigger was created.
       Nothing here invalidated that, so from the first re-fit onward every
       reveal below the hero was keyed to a hero that no longer existed.

       It survived this long because the error is small (tens of pixels) and
       everything affected used to sit a full viewport below the fold, where
       being a few pixels early or late is invisible. Shortening the mobile
       hero brought Selected work's first card to 671px in an 844px window,
       four pixels inside its own `top 80%` start — so the stale value was
       suddenly the difference between the card being there at rest and
       being an empty screen that only filled in once you scrolled. */
    const fitAndRepark = () => {
      fit()
      parkAtLoaderStateRef.current?.()
      ScrollTrigger.refresh()
    }

    fit()
    const ro = new ResizeObserver(fitAndRepark)
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
    document.fonts?.ready.then(() => { if (alive) fitAndRepark() })

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
  const landingStartedRef = useRef(false)
  const curtainRef = useRef(null)

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

  /* Small and centred in the VIEWPORT, expressed from the natural box.

     Viewport, not hero, on every width. From md up the two coincide anyway
     because the hero is a full screen. Below that the hero is a short band
     and the centring is what makes the load read as a page-wide moment
     rather than a small animation in a corner — the curtain below is what
     makes that safe, by covering the content the name would otherwise be
     floating over. */
  const loaderState = (nat) => ({
    x: window.innerWidth / 2 - (nat.width * NAME_LOADER_SCALE) / 2 - nat.left,
    y: window.innerHeight / 2 - nat.centerY,
    scale: NAME_LOADER_SCALE,
  })

  /* Docked in the nav slot, expressed from the same box. */
  const navState = (nat) => {
    const el = navNameSlotRef.current
    const slot = el?.getBoundingClientRect()
    if (!slot) return null
    /* READ THE SLOT'S LIVE FONT-SIZE, do not assume it. This used to divide
       by the NAV_NAME_FONT_SIZE constant, which silently required the nav
       wordmark to be that exact size on every screen — so making it smaller
       on mobile would have landed the flying name at the wrong scale and
       left it overlapping the bar. The constant stays as the fallback for a
       slot that has not been styled yet. */
    const target = parseFloat(getComputedStyle(el).fontSize) || NAV_NAME_FONT_SIZE
    return {
      x: slot.left - nat.left,
      y: slot.top + slot.height / 2 - nat.centerY,
      scale: target / nat.fontSize,
    }
  }

  /* RE-PARK AFTER A RE-FIT, not just re-fit. fit() changes the font-size,
     which changes the natural box that every measurement here is expressed
     from — so any fit running after the starting transform was set leaves
     the name parked against a box that no longer exists. Measured on a cold
     cache at 1024px: the name held 49px left of centre, because it had been
     centred against a 1324px natural width that became 1088px the moment
     Coneria replaced the fallback face. A warm cache hides it, which is what
     made it survive this long.

     Guarded on the flight: once that starts, its tween owns the transform
     and re-parking would snatch the name back to the middle mid-travel. */
  const parkAtLoaderState = () => {
    if (landingStartedRef.current || reduceMotion) return
    const container = nameGroupRef.current
    if (!container) return
    const nat = measureNatural()
    if (!nat) return
    naturalRef.current = nat
    gsap.set(container, { ...loaderState(nat), transformOrigin: 'left center' })
  }

  /* The fit effect runs with [] deps, so a direct reference would freeze
     render zero's closure — and with it a stale reduceMotion. The ref is
     re-pointed every render, so the effect always calls the current one. */
  const parkAtLoaderStateRef = useRef(null)
  parkAtLoaderStateRef.current = parkAtLoaderState

  useLayoutEffect(() => {
    const container = nameGroupRef.current
    if (!container) return
    if (reduceMotion) {
      setHeroLanded(true)
      return
    }
    parkAtLoaderState()
  }, [reduceMotion])

  /* FAIL OPEN. The curtain is opaque in the markup, and every route that
     takes it down runs off the reveal's onComplete. That is a single point
     of failure with the worst possible blast radius: if the reveal throws,
     or never fires because a webfont request hangs past LineReveal's own
     waiting, the phone gets a blank ivory screen and no way out of it. The
     desktop would be fine, so it is also the kind of thing that ships.

     Four seconds is roughly three times the longest honest path to the
     landing (a ~0.95s reveal, then a 1.15s flight) and well short of a
     visitor deciding the site is broken. If the timeline is already running
     this finds the curtain hidden and does nothing. */
  useEffect(() => {
    const t = setTimeout(() => {
      const curtain = curtainRef.current
      if (curtain) gsap.set(curtain, { autoAlpha: 0 })
    }, 4000)
    return () => clearTimeout(t)
  }, [])

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
    /* From here the timeline owns the transform — see parkAtLoaderState. */
    landingStartedRef.current = true
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
      if (curtainRef.current) gsap.set(curtainRef.current, { autoAlpha: 0 })
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

    /* Disable scroll during the name morph animation */
    const lenis = window.__lenis
    if (lenis) lenis.stop()

    tl.to(nameGroup, { ...to, duration: 1.15, ease: 'power3.inOut' }, 0)

    /* The curtain lifts WHILE the name is still travelling, not after it has
       landed. Same rule the flower and the tldr; follow — each one starts
       under the one before it rather than queueing — and here it also means
       the page is already there to receive the wordmark when the crossfade
       happens at 0.92, instead of the bar appearing against ivory and the
       content arriving a beat later. autoAlpha so it ends up
       visibility:hidden and stops intercepting taps. */
    if (curtainRef.current) {
      tl.to(curtainRef.current, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0.7)
    }
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

    /* Re-enable scroll after the morph animation completes (1.15s) */
    tl.call(() => {
      if (lenis) lenis.start()
    }, null, 1.15)

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
        wordmarkClassName="opacity-0"
        wordmarkAriaHidden
      />

      {/* ─── Loader curtain — PHONE ONLY (md:hidden).

          On a wide screen the hero is a full viewport of ivory, so the name
          revealing in the middle of it IS a full-screen loader; there is
          nothing to cover because everything else is below the fold.

          On a phone the hero is a 214px band, so the intro and the first
          work card sit inside the first screen — which is what we wanted
          for the resting page, and exactly wrong during the load: the
          viewport-centred name came down on top of the intro paragraph.
          This covers the lot, including the nav's own bar, so the first two
          seconds are the name on ivory and nothing else.

          z-[55] sits between the nav (z-50) and the name group (z-[60]), so
          the name paints over the curtain and everything else paints under
          it. It renders opaque — no entrance — because it has to be there
          on the very first frame, before any effect has run.

          Starts as a plain div rather than a GSAP-set one for the same
          reason: a transparent-until-JS curtain is no curtain at all on a
          slow first paint. ─── */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-[55] bg-[var(--ivory)]"
      />

      <SideSocial />
      <div className="relative min-h-screen w-full bg-[var(--ivory)]">
        <main>
          {/* ═══════════════════════════════════════════════════════
              HOME — full-width script name hero, matching the Figma redesign
              ═══════════════════════════════════════════════════════ */}
          <div
            /* No overflow-hidden. The flower deliberately runs ~121px past
               the hero's bottom edge, and clipping it there guillotined it
               along the exact line where the page turns grey — the worst
               possible place for a cut, because the colour change draws the
               eye straight to it. Letting it bleed reads as one composition
               crossing a section boundary instead.

               NO z-index ON THE HERO. It carried z-[1], which made it a
               stacking context and pinned everything inside it below the
               nav's z-50 — which is why the name flew UNDER the bar. Raising
               the hero above 50 instead does not work: it paints an opaque
               --ivory background, so it would cover the nav whole and hide
               the wordmark the name hands off to. The z-[1] moved to the
               flower wrapper, the only part that needed it, and the name
               lifts itself to z-[60].

               Safe to drop here specifically: the flower wrapper's z-[1] beats the
               Disciplines section's z-auto, so the overflow paints OVER the
               grey rather than under it; the bleed lands in that section's
               128px of top padding, so it never reaches the marquee; body
               already carries overflow-x:hidden for the sideways spill; and
               while the hero is pinned it is position:fixed at viewport
               height, so anything below its box is off-screen anyway. */
            /* A STAGE ON DESKTOP, A BAND UNDER THE NAV ON A PHONE.

               From md up this is a full viewport centred on the name, and
               the height is doing real work: the flower and the tldr; block
               live in here too. Below xl both are hidden, so the same rule
               gave a phone a whole screen holding nothing — the name flies
               out to the nav within two seconds and what is left is white.

               So on a phone it takes its natural height and top-aligns.
               That height is really the name's own layout box, which stays
               reserved after the name has transformed away to the nav, so
               it is a short band rather than nothing — the name appears
               under the nav, lifts into it, and the intro follows directly
               underneath instead of a screen later. */
            className="relative w-full min-h-0 md:min-h-screen bg-[var(--ivory)] flex flex-col justify-start md:justify-center pt-20 pb-6 md:py-0"
          >
            {/* .shell-hero, not .shell — the readability cap exists to
                protect measure, and there is no prose here, just a two-line
                wordmark. It doubles as the name's size ceiling: the fit
                effect below solves font-size from this element's own
                clientWidth, so capping the shell at --hero-max is what stops
                a script face growing unbounded on an ultrawide display. */}
            <div className="page-content-shell">
              {/* COLLAPSED ON A PHONE, and this wrapper exists only to do
                  that. The name below is in normal flow, so its two lines
                  reserve ~146px of hero whether or not anything is painted
                  there — and on a phone nothing ever is. The loader stages
                  the name at the centre of the VIEWPORT and the landing then
                  parks it in the nav at opacity 0, so from the first frame to
                  the last that box is empty space the page scrolls past. It
                  is the band the "{ scroll down }" cue used to sit in, left
                  behind when the cue went.

                  h-0 drops the reservation without touching the name itself:
                  it keeps its own width (so the fit still solves against the
                  shell) and its own height and position (so measureNatural
                  still has a real box to express the loader and nav states
                  from). It simply overflows a parent with no height, which
                  costs nothing because it is never visible in flow.

                  The overflow cannot grow the page either — the name's only
                  two transformed positions are the centre of the first
                  screen and the nav, both above the fold.

                  md:h-auto because above that the hero IS a full viewport
                  centred on this name, and there the box is the whole
                  point. ─── */}
              <div className="h-0 md:h-auto">
              {/* ─── Name — sized to fill the full container width (see the
                  fit useLayoutEffect above; clamp() alone can't solve this
                  for an arbitrary script font's glyph metrics) ─── */}
              <div
                ref={nameGroupRef}
                className="relative z-[60] pointer-events-none leading-[1.14] tracking-[-0.01em] text-[var(--walnut)] text-[clamp(3rem,15vw,14rem)] will-change-[transform,opacity]"
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
            </div>

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
              className="absolute inset-0 z-[1] pointer-events-none"
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
                 descendants. The label that used to rely on that is gone,
                 but the rule it depended on is not: put this on the hero and
                 any fixed child of the hero re-anchors to it. */
              style={{ clipPath: 'inset(0px 0px -240px 0px)' }}
            >
              <div className="page-content-shell h-full">
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
                      timeline). ─── */}
                  <div
                    ref={tldrRef}
                    className="hidden xl:block absolute left-0 bottom-[6%] w-[594px] max-w-full pl-4 opacity-0"
                  >
                    {/* The label and each word carry their own opacity-0 as
                        well as the container: the hidden resting state has to
                        exist in CSS, because the effect that would otherwise
                        establish it waits on heroLanded and so does not run
                        for the first couple of seconds of a load. Anything
                        relying on the effect alone is simply on screen until
                        then. gsap writes inline styles, which win over these. */}
                    {/* HANGING "+", where a hanging "01" used to be. The
                        numeral went because the numbered series now starts
                        at the first marquee title (Disciplines = 01) and
                        this intro sits outside the count — it is the
                        preamble, not the first item. The marker itself
                        stays, as the site's "+ (Label)" micro-label glyph:
                        see MicroLabel.jsx, whose own comment cites this
                        block as the precedent it grafts onto. So the two
                        point at each other rather than at a numbering
                        scheme neither of them uses any more.

                        THE HANG IS WHAT KEEPS THE BODY ALIGNED TO THE LABEL
                        RATHER THAN TO THE MARKER — "(Liya)" and the
                        paragraph share a left edge while the "+" sits out in
                        the margin. Three parts, and they only work together:
                        pl-4 on this block, -ml-4 on this row, w-4 on the
                        marker. Drop any one and the label lands a rem off
                        the paragraph it heads.

                        This is also the one place the micro-label hangs.
                        Disciplines and Selected work both set "+ (Label)"
                        flush with the content under it; here the content is
                        a paragraph rather than a heading, and a marker in
                        the margin keeps the text block's edge unbroken.

                        w-4 = 16px, against a "+" measured at 8.8px here, so
                        the gap after it lands at ~7px — the 8px that
                        MicroLabel sets with gap-2, near enough that the two
                        read as one device. It was w-8 for "01", which is
                        twice the glyph and was a numeral's gap, not this
                        one's.

                        ITEMS-CENTER, NOT ITEMS-BASELINE. The row held a
                        numeral before, and digits belong on a baseline. A
                        "+" does not — it is centred on the maths axis, so
                        sitting it on the baseline of a 28px word dropped it
                        4.3px below that word's optical middle. That
                        mismatch is gone now that both runs are 16px — the
                        label is "(Liya)", not a 28px "TLDR;" — so centring
                        and baseline resolve identically here. It stays
                        centred because it is the arrangement that survives
                        the label being restyled again.

                        THE TWO RUNS MATCH, which is the point: this is the
                        site's "+ (Label)" micro-label, the same device as
                        MicroLabel.jsx, and it reads as one phrase only while
                        the glyph and the word share size, weight and colour.
                        It is written out here rather than importing
                        MicroLabel because this is the one instance that
                        HANGS — the "+" sits in the margin so the paragraph
                        below aligns to "(Liya)" and not to the marker, and
                        MicroLabel has no hang. */}
                    <div ref={tldrLabelRef} className="-ml-4 flex items-center mb-5 opacity-0">
                      <span
                        aria-hidden="true"
                        className="w-4 shrink-0 text-[16px] leading-[1.54] text-[var(--walnut-soft)]"
                        style={{ fontFamily: FONT, fontWeight: 400 }}
                      >
                        +
                      </span>
                      <span
                        className="text-[16px] leading-[1.54] text-[var(--walnut-soft)]"
                        style={{ fontFamily: FONT, fontWeight: 400 }}
                      >
                        (Kataliya Sungkamee)
                      </span>
                    </div>
                    {/* Split per word so the paragraph resolves in a stagger
                        rather than as one block — the ring's heading does the
                        same thing per glyph. The space is a real text node
                        BETWEEN the spans, not inside them: a trailing space
                        at the end of an inline-block sits at the edge of its
                        own line box and gets collapsed away, which would run
                        every word together. */}
                    {/* 25 against the label's 28 — a step the eye reads as
                        hierarchy without the sentence losing presence. Weight
                        already separates the two (700 vs 500); this is the
                        size doing the same thing quietly rather than dropping
                        a whole tier, which at 21.6 would have made the one
                        paragraph on the first screen look like a caption. */}
                    <p
                      className="text-[25px] leading-[1.5] text-[var(--walnut)]"
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
          {/* pt is smaller than pb below md on purpose. Above it, this block
    follows a full-viewport hero and 64px of lead-in is the gap
    between two sections. On a phone the hero is now a 214px band
    directly overhead, so the same 64px landed on top of the hero
    band's own 24px of bottom padding and read as a second, unasked
    for empty screen before the first words. */}
          <div className="xl:hidden relative w-full bg-[var(--ivory)] pt-4 pb-16 md:pt-16">
            <div className="page-content-shell">
            {/* Same "+" and the same hang as the xl version above, at the
                same w-4: the marker is 16px there and 14px here, and the
                box is a hair generous at both rather than two values to
                keep in step for a 1px difference in the glyph. Centred
                rather than on the baseline, same as above. */}
            <div className="pl-4">
              <div className="-ml-4 flex items-center mb-4">
                <span aria-hidden="true" className="w-4 shrink-0 text-sm text-[var(--walnut-soft)]" style={{ fontFamily: FONT }}>+</span>
                <span className="text-sm text-[var(--walnut-soft)]" style={{ fontFamily: FONT, fontWeight: 400 }}>
                  (Liya)
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
          </div>

          {/* PROOF, PERSON, RECORD, CAPABILITY — then the ask.

              This ran Disciplines -> Where I've been -> How I got here, which
              opened a portfolio on a capability matrix and put no work on the
              home page at all. Three things changed together and each depends
              on the others:

                01 Selected work   new. One project per discipline.
                02 How I got here  moved UP, so the narrative runs before the
                                   receipts. It used to sit after Where I've
                                   been, which made a reader traverse the same
                                   five jobs twice in opposite directions —
                                   the timeline newest-first, then the prose
                                   oldest-first — and the second pass read as
                                   a re-tell.
                03 Where I've been now backs a story already told.
                04 Disciplines     moved DOWN, to land beside the footer's
                                   "Let's work together" as the answer to
                                   "so what can you do", not as an opening
                                   assertion.

              THE BACKGROUNDS STILL ALTERNATE AND NO SEAM CHANGED. Each
              component owns its own fill and seam class, and the sequence
              needed here is white -> grey -> white -> grey -> white. Selected
              work is --ivory with no seam (it continues the hero's white
              field), then How I got here and Disciplines are both
              --ivory-deep + seam-under-ivory and Where I've been is --ivory +
              seam-under-deep, so swapping their order preserves the
              alternation exactly. Insert anything else here and check that
              still holds. */}
          <SelectedWork reduceMotion={reduceMotion} />
          <HowIGotHere reduceMotion={reduceMotion} />
          <WhereIveBeen reduceMotion={reduceMotion} />
          <Disciplines reduceMotion={reduceMotion} />
          <SiteFooter reduceMotion={reduceMotion} seamClassName="seam-under-deep" />
        </main>
      </div>
    </>
  )
}
