/* ═══════════════════════════════════════════════════════════════════════════
   GLASSLENS.JSX — the refraction the /work tag has, for a DOM element

   On the carousel the "View" tag is drawn inside the ring's shader, so it can
   sample the pixels behind it and bend them (params.tagRefract). CSS has no
   equivalent: backdrop-filter offers blur, saturate, brightness and friends,
   but there is no scale, and nothing that displaces the backdrop.

   There is one route, and this is it — backdrop-filter accepts url(), so an
   SVG filter can be pointed at the backdrop and feDisplacementMap can bend
   it. Verified supported here before building:
     CSS.supports('backdrop-filter', 'url(#x)') === true

   ── How the magnification works ─────────────────────────────────────────
   feDisplacementMap resolves to

     P'(x, y) = P( x + S*(R - 0.5), y + S*(G - 0.5) )

   so if R ramps 0 -> 1 across the pill, a NEGATIVE S makes each edge sample
   from further in toward the centre. The centre is stretched over the whole
   pill, which is magnification rather than distortion:

     magnification = W / (W - S) = 104 / 78 = 1.33x

   ── Why the green ramp is not full range ────────────────────────────────
   S is a single px value applied to both channels, but the pill is 104 x 40.
   The same 13px shift is 12.5% of the width and 32.5% of the height, so a
   full-range green ramp magnifies vertically about 2.6x too hard and the
   thing reads as a squashed fisheye. Compressing green's range by H/W
   (0.3846) — stops at 78 and 177 rather than 0 and 255 — brings the vertical
   shift to 12.5% of the height and makes the magnification uniform.

   ── Why two feImages ────────────────────────────────────────────────────
   SVG filters have no gradient primitive, so the ramps arrive as images. They
   are separate rather than one image with mix-blend-mode because blending
   inside an SVG used as a filter input is inconsistently supported;
   feComposite arithmetic adds the two channels reliably.
   ═══════════════════════════════════════════════════════════════════════════ */

const W = 104
const H = 40

const ramp = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`

/* R = x / W */
const MAP_X = ramp(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="rgb(0,0,0)"/>` +
    `<stop offset="1" stop-color="rgb(255,0,0)"/>` +
    `</linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
)

/* G = y / H, compressed to H/W of full range — see the note above */
const MAP_Y = ramp(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="rgb(0,78,0)"/>` +
    `<stop offset="1" stop-color="rgb(0,177,0)"/>` +
    `</linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
)

export const GLASS_LENS = 'url(#glass-lens)'

export default function GlassLens() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <filter
        id="glass-lens"
        /* userSpaceOnUse with the pill's own box, so the ramps map 1:1 onto it
           rather than being rescaled by a percentage region. */
        filterUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={W}
        height={H}
        colorInterpolationFilters="sRGB"
      >
        <feImage href={MAP_X} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="mx" />
        <feImage href={MAP_Y} x="0" y="0" width={W} height={H} preserveAspectRatio="none" result="my" />
        {/* k2 + k3 adds the two ramps, giving one map with x in R and y in G */}
        <feComposite in="mx" in2="my" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="map" />
        {/* negative scale = sample inward = magnify */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="-26"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}
