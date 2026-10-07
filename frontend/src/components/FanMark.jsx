/* ═══════════════════════════════════════════════════════════════════════════
   FANMARK.JSX — the nav's menu trigger: a brisé fan that folds

   OPEN WHEN THE MENU IS CLOSED, and shut when it is open. That is the way
   round it was asked for and it is also the right way round: the fan is the
   resting state of the bar, and it folds itself away to hand the screen to
   the menu it opens.

   ── The fold is real, not a sprite ─────────────────────────────────────
   Thirteen slats, each a path rotated about the rivet. Open they splay
   across 172 degrees; shut they stack on 9, which is the few degrees a real
   brisé fan keeps when it is closed — a true 0 would read as a single flat
   stick. Everything between the two states is the browser interpolating one
   rotation per slat, so it folds through every intermediate position the way
   the object does.

   ── Why the slats are staggered ────────────────────────────────────────
   A fan does not open all at once; the motion runs out from the middle and
   the outermost slats arrive last. Each slat carries its index and takes a
   delay from it, so the open cascades outward and the close runs back in.
   Without it the thing opens like a pair of scissors.

   ── The tassel is a travelling wave, not a pendulum ────────────────────
   A cat's tail — the reference for this — does not swing rigidly. The base
   leads, each section follows late, and the tip describes the widest arc and
   arrives last. So the cord is nested groups rather than siblings: each one
   carries the same sway and a later start, and because they nest, the
   rotations compound down the length. The tip is the sum of all of them.

   Negative delays, so every segment is already mid-cycle on the first frame
   rather than the whole tail starting from straight.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function FanMark({ open = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 200 186"
      className={`fan-mark ${className}`}
      data-open={open ? 'true' : 'false'}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Three tones across the fan rather than one flat fill, so the
            spread reads as a curved surface catching light from upper left.
            Sampled from the reference: #96575D near the rivet up to #85283A
            at the outer slats. */}
        <linearGradient id="fanBladeC" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#9E5560" />
          <stop offset="1" stopColor="#99304F" />
        </linearGradient>
        <linearGradient id="fanBladeB" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#94454F" />
          <stop offset="1" stopColor="#8E2A46" />
        </linearGradient>
        <linearGradient id="fanBladeA" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="#8A3A45" />
          <stop offset="1" stopColor="#85283A" />
        </linearGradient>
      </defs>

      {/* The tassel hangs BEHIND the fan, so the cord disappears under the
          rivet instead of crossing the slats.

          EACH LINK IS TWO GROUPS, and it has to be. The outer one carries a
          static translate down the cord; the inner one carries the sway. A
          CSS `transform` REPLACES an element's SVG transform attribute
          rather than adding to it, so putting both on one group silently
          discarded every translate and stacked the whole tassel on the
          rivet as a single blob. Split, the offset survives and the
          rotation composes with it. */}
      <g className="fan-tassel">
        <g className="fan-seg">
          <path d="M100 110 L100 125" />
            <g transform="translate(0 14)">
              <g className="fan-seg" style={{ "--d": 1 }}>
                <path d="M100 110 L100 125" />
              <g transform="translate(0 13)">
                <g className="fan-seg" style={{ "--d": 2 }}>
                  <path d="M100 110 L100 124" />
                <g transform="translate(0 12)">
                  <g className="fan-seg" style={{ "--d": 3 }}>
                    <path d="M100 110 L100 123" />
                  <g transform="translate(0 11)">
                    <g className="fan-seg" style={{ "--d": 4 }}>
                      <path d="M100 110 L100 122" />
                  {/* The knot, then the two pom-poms the reference has. */}
                  <circle cx="100" cy="112" r="3.2" className="fan-knot" />
                  <circle cx="96.2" cy="121" r="7.6" className="fan-pom fan-pom--back" />
                  <circle cx="104.4" cy="123.4" r="6.6" className="fan-pom" />
                    </g>
                  </g>
                  </g>
                </g>
                </g>
              </g>
              </g>
            </g>
        </g>
      </g>

      <g className="fan-blades">
        <g className="fan-blade" style={{ "--o": "-78.00deg", "--s": "-4.50deg", "--i": 0 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "-65.00deg", "--s": "-3.75deg", "--i": 1 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "-52.00deg", "--s": "-3.00deg", "--i": 2 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "-39.00deg", "--s": "-2.25deg", "--i": 3 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeB)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "-26.00deg", "--s": "-1.50deg", "--i": 4 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeB)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "-13.00deg", "--s": "-0.75deg", "--i": 5 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeC)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "0.00deg", "--s": "0.00deg", "--i": 6 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeC)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "13.00deg", "--s": "0.75deg", "--i": 7 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeC)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "26.00deg", "--s": "1.50deg", "--i": 8 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeB)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "39.00deg", "--s": "2.25deg", "--i": 9 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeB)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "52.00deg", "--s": "3.00deg", "--i": 10 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "65.00deg", "--s": "3.75deg", "--i": 11 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
        <g className="fan-blade" style={{ "--o": "78.00deg", "--s": "4.50deg", "--i": 12 }}>
          <path d="M97.00 94.00L92.00 32.00A8.00 8.00 0 0 1 108.00 32.00L103.00 94.00A3.00 3.00 0 0 1 97.00 94.00Z" fill="url(#fanBladeA)" stroke="var(--fan-edge)" strokeWidth="0.6" />
        </g>
      </g>

      {/* The rivet, over the slats — it is what they turn on. */}
      <circle cx="100" cy="112" r="4.6" className="fan-rivet" />
      <circle cx="100" cy="112" r="1.7" className="fan-rivet-pin" />
    </svg>
  )
}
