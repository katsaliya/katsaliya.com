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
// The two "Coming Soon" entries are flat colour placeholders, not real
// projects — interleaved with the photographic thumbnails on purpose. The
// ring's goo/crossfade reads far more clearly between two high-contrast flat
// colours than between two similar light-UI screenshots, so spacing them out
// does double duty: pads the ring toward its fuller 18-card feel now, and
// gives the melt effect something more legible to work with at each seam.
// Replace them with real projects as you build more case studies — same
// requirement as any other entry: name, type, year, and your own thumbnail.
export const PROJECTS = [
  {
    file: 'images/cards/demo-bluecore.png',
    name: 'BlueCore',
    type: 'Product Design',
    year: '2025',
  },
  {
    file: 'work-carousel/coming-soon-1.webp',
    name: 'Coming Soon',
    type: 'TBD',
    year: '2026',
  },
  {
    file: 'images/cards/demo-known.png',
    name: 'Known',
    type: 'Content & Design',
    year: '2025',
  },
  {
    file: 'work-carousel/coming-soon-2.webp',
    name: 'Coming Soon',
    type: 'TBD',
    year: '2026',
  },
  {
    file: 'images/cards/demo-aidentity.png',
    name: 'AIdentity',
    type: 'Product Design',
    year: '2026',
  },
  {
    file: 'work-carousel/emporium-placeholder.webp', // TODO: replace with real art
    name: 'Emporium Thai Market',
    type: 'Brand & Web',
    year: '2026',
  },
]

export const IMAGE_FILES = PROJECTS.map((p) => p.file)
