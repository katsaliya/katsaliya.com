/* ═══════════════════════════════════════════════════════════════════════════
   USECASESTUDYMOTION.JS — the site's reveal vocabulary, for a case study

   Every constant here is the /work ring's, because the ring is where this
   site's motion was decided and everything since has been made to agree with
   it. params.js: textTime 0.95, textEase power4.out, textStagger 0.015.
   Disciplines runs 0.8 / power3.out for its heads. Nothing new is invented.

   Three things arrive, always in this order, per section:
     head    the numeral, the label, the section title
     body    prose, statements, cards, ledgers, features
     media   photo strips, covers, feature imagery

   The statement block is the exception and gets the hero's treatment — split
   to words, unblurring on a 0.018 stagger, which is the tldr; reveal from
   Home. It is the one place on the page where the type is the event.

   Reveals fire ONCE. A case study is read top to bottom; re-animating on the
   way back up is the page arguing with the reader.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── the ring's own numbers ── */
const TEXT_TIME = 0.95
const TEXT_EASE = 'power4.out'
const HEAD_TIME = 0.8
const HEAD_EASE = 'power3.out'

const HEAD = '.cs-numeral, .cs-label, .cs-section-title'
const BODY = '.cs-body, .cs-card, .cs-ledger-row, .cs-stat-row, .cs-link-card, .cs-feature-heading'
const MEDIA = '.cs-feature-media, .cs-strip-block, .cs-caption'

export default function useCaseStudyMotion(rootRef, reduceMotion = false) {
  useEffect(() => {
    const root = rootRef?.current
    if (!root) return
    const q = (sel, scope) => [...(scope || root).querySelectorAll(sel)]

    const heroItems = q('.cs-hero-item')
    const words = q('.cs-statement .cs-word')
    const sections = q('.cs-section')

    if (reduceMotion) {
      gsap.set(
        [...heroItems, ...words, ...q(HEAD), ...q(BODY), ...q(MEDIA)],
        { opacity: 1, y: 0, filter: 'blur(0px)' },
      )
      return
    }

    const ctx = gsap.context(() => {
      /* ── the hero, on load ───────────────────────────────────────────
         One timeline with positions rather than four hardcoded delays on
         separate elements, which drift apart the moment one is edited. */
      if (heroItems.length) {
        gsap.set(heroItems, { opacity: 0, y: 26 })

        /* Wordmark, then its facts, with the motif arriving alongside rather
           than queueing behind — the same overlap Home's flower has. */
        const motif = root.querySelector('.cs-hero-motif')
        if (motif) gsap.set(motif, { opacity: 0, scale: 1.04, y: 18 })

        const tl = gsap.timeline({ delay: 0.15 })
        tl.to(heroItems, {
          opacity: 1, y: 0, duration: 1.1, ease: HEAD_EASE, stagger: 0.14,
        }, 0)
        if (motif) {
          tl.to(motif, {
            opacity: 1, scale: 1, y: 0, duration: 1.3, ease: HEAD_EASE,
          }, 0.25)
        }
      }

      /* ── statements: the hero's tldr; reveal ─────────────────────────
         Per word, unblurring. Scoped to its own statement so a section with
         two of them does not stagger across both as one run. */
      root.querySelectorAll('.cs-statement').forEach((stmt) => {
        const w = stmt.querySelectorAll('.cs-word')
        if (!w.length) return
        gsap.set(w, { opacity: 0, y: 20, filter: 'blur(8px)' })
        gsap.to(w, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: TEXT_TIME, ease: TEXT_EASE, stagger: 0.018,
          scrollTrigger: { trigger: stmt, start: 'top 82%', once: true },
        })
      })

      /* ── each section, on scroll ─────────────────────────────────────
         Per section rather than one trigger for the page: a case study is
         long enough that a single stagger would leave the last item waiting
         minutes for its turn. */
      sections.forEach((section) => {
        const head = q(HEAD, section)
        const body = q(BODY, section)
        const media = q(MEDIA, section)
        if (!head.length && !body.length && !media.length) return

        gsap.set(head, { opacity: 0, y: 18 })
        gsap.set(body, { opacity: 0, y: 16 })
        gsap.set(media, { opacity: 0, y: 28 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        })
        tl.to(head, { opacity: 1, y: 0, duration: HEAD_TIME, ease: HEAD_EASE, stagger: 0.08 }, 0)
        tl.to(body, { opacity: 1, y: 0, duration: TEXT_TIME, ease: TEXT_EASE, stagger: 0.06 }, 0.18)
        tl.to(media, { opacity: 1, y: 0, duration: 0.9, ease: HEAD_EASE, stagger: 0.08 }, 0.3)
      })
    }, root)

    /* Images settle after the timelines are built, and every start position
       below them is wrong until they do. */
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      ctx.revert()
    }
  }, [rootRef, reduceMotion])
}
