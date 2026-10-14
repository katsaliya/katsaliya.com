// Ring order, not filename order — reordering these rows moves the ring, the
// column, and the numbering together, per AGENTS.md. Do not use imageOffset
// to reorder.
//
// Thumbnails point at existing site assets (already used elsewhere as each
// project's representative image), except Emporium Thai Market: there is no
// real thumbnail for it in the repo yet — /work-carousel/emporium-placeholder.webp
// is a flagged stand-in, swap it for a real image when you have one.
//
// `type` is a best-guess short discipline label for each, not pulled from a
// canonical source — check these before treating them as final copy.
//
// `href` is the case study a card opens. Only the two that have one carry
// it; everything else answers a click with the same "Coming soon" note the
// Selected work cards use, rather than with silence. Add the route here
// when a case study lands and the card starts working with no other change.
//
// THE "COMING SOON" PLACEHOLDERS ARE GONE, and with them the one argument
// for keeping them: they were flat colour interleaved between photographs
// because the ring's goo/crossfade reads more clearly between two
// high-contrast fills than between two similar images. All six cards are
// photographic now, so each seam melts between two mid-tone images and the
// effect is quieter than it was. That is the cost of a ring with no filler
// in it, and it is the right trade — every card goes somewhere.
export const PROJECTS = [
  {
    /* The real market shot, not the flagged stand-in. The placeholder
       carried a "replace with real art" TODO and there was real art two
       folders away, already serving this project on the home page. */
    file: 'images/about/emporium-thai-market.jpg',
    name: 'Emporium Thai Market',
    type: 'Brand & Web',
    year: '2026',
    href: '/emporium-thai-market',
  },
  {
    /* The Where I've been photograph, replacing the monitor mock-up. */
    file: 'images/about/known.jpg',
    name: 'Known',
    type: 'Content & Design',
    year: '2025',
    href: '/known',
  },
  {
    file: 'images/about/allied-global-marketing.jpg',
    name: 'Allied Global Marketing',
    type: 'Entertainment Marketing',
    year: '2025',
    href: '/allied-global-marketing',
  },
  {
    file: 'images/cards/demo-bluecore.webp',
    name: 'BlueCore',
    type: 'Product Design',
    year: '2025',
    href: '/bluecore',
  },
  {
    file: 'images/cards/demo-aidentity.png',
    name: 'AIdentity',
    type: 'Product Design',
    year: '2026',
    href: '/aidentity',
  },
  {
    file: 'images/selected-work/katsaliya.jpg',
    name: 'katsaliya.com',
    type: 'Front-End Development',
    year: '2026',
    href: '/katsaliya',
  },
]


export const IMAGE_FILES = PROJECTS.map((p) => p.file)
