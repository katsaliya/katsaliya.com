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
      viewBox="0 0 200 232"
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
                  {/* ── THE PENDANT ──────────────────────────────────
                      bead, knot, bead, fringe — the order the reference
                      hangs them in. The knot is four loops on the
                      diagonals around a small barred square, which is the
                      pan chang the real cord is tied into; drawn as four
                      rotated rounded rects so it stays one stroke weight
                      with the cord above it. */}
                  <circle cx="100" cy="113" r="3.4" className="fan-bead" />

                  <g className="fan-knot-grp" transform="translate(0 6)">
                    <g transform="rotate(45 100 126)">
                      <rect x="86" y="112" width="28" height="28" rx="13" className="fan-knot-loop" />
                      <rect x="92.5" y="118.5" width="15" height="15" rx="7" className="fan-knot-loop" />
                    </g>
                    <rect x="94.6" y="120.6" width="10.8" height="10.8" className="fan-knot-sq" />
                    <path d="M97.4 120.6v10.8M102.6 120.6v10.8M94.6 123.4h10.8M94.6 128.6h10.8"
                          className="fan-knot-bar" />
                  </g>

                  <path d="M100 148v7" className="fan-cord-l" />
                  <circle cx="100" cy="158" r="3.2" className="fan-bead" />

                  {/* The fringe: a bound head, then strands that splay a
                      little and end at slightly different lengths, because
                      a cut tassel never ends level. */}
                  <path d="M93.4 163h13.2l-1.6 7H95z" className="fan-fringe-head" />
                  <path d="M94.2 165.4h11.6M94.6 167.8h10.8" className="fan-fringe-bind" />
                  <g className="fan-fringe">
                    <path d="M95.6 170c-1.6 7-2.6 13.4-2.4 20.4" />
                    <path d="M97.6 170c-1 7.4-1.6 14-1.5 21.6" />
                    <path d="M99.4 170c-.4 7.6-.5 14.4-.4 22.4" />
                    <path d="M101.2 170c.3 7.6.4 14.4.5 22.1" />
                    <path d="M103 170c.9 7.4 1.4 14 1.6 21.3" />
                    <path d="M104.8 170c1.5 7 2.5 13.4 2.5 20.1" />
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
