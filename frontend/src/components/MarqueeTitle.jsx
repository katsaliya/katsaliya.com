/* ═══════════════════════════════════════════════════════════════════════════
   MARQUEETITLE.JSX — a section title as a looping ruled strip

   The site's section-heading device: a script word, the orchid, and a sans
   phrase, repeating forever across three ruled lines.

   Two Figma frames define it (Frame 10 "Disciplines", Frame 6 "How I got
   here") and they are the SAME lockup — the frames only differ in where
   their box is drawn. Frame 10 includes padding around the rules, Frame 6
   measures from rule 1 to rule 3. Reduced to ratios of the 172.533px type
   size they agree exactly:

     rule spacing        63px -> 0.3651
     logo height     127.67px -> 0.7400   (= the rule 1 -> rule 3 span, 126px)
     text top vs rule 1  -32px -> -0.1855

   That is why this is one component and not two. Everything derives from
   --m, so the whole lockup scales as a unit.

   The rules live on the CONTAINER rather than inside the repeating unit:
   they are continuous lines, and repeating them per unit would put a visible
   seam every cycle where two 1px rules butt together.

   The orchid's height is exactly the rule 1 -> rule 3 span, so it is inset
   to the guide rather than floated near it — a relationship that has to
   survive scaling, hence the ratio rather than a fixed height.

   Figma reports the text layers as italic 500 Coneria Script Slanted Demo.
   Neither is applied: the licensed file loaded here is a single normal-weight
   cut and the face is already slanted by design, so italic 500 would
   synthesise a second slant and a fake bold on top of it.

   Both runs are the SAME size. A script reads larger than a sans at equal
   size, which is why the frames look like two sizes and are not.
   ═══════════════════════════════════════════════════════════════════════════ */

import Marquee from './Marquee'

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

export default function MarqueeTitle({
  /* The script half, e.g. "Disciplines" / "How" */
  script,
  /* The sans half, e.g. "by Kataliya Sungkamee" / "I got here" */
  sans,
  /* Optional section number, passed bare ("02") and rendered bracketed as
     "(02)". Fixed at 16px in the frame — a mark, not a scaled superscript,
     so it stays the same size as every other micro-label on the page.

     THE BRACKETS ARE ADDED HERE, NOT BY CALLERS, for the same reason
     MicroLabel writes its own: the site has one parenthetical grammar —
     "+ (Liya)", "+ (Product Strategy & Design)", and now "(02)" — and it
     only stays one if a single place decides it. Callers pass the digits. */
  number,
  /* How far the numeral sits after the script word, as a ratio of --m.

     IT IS A PROP BECAUSE THE GAP HAS TO BE OPTICAL, NOT METRIC. This face
     swashes, and a swash paints well past the glyph's advance width — which
     is the only width the layout knows about. So a fixed gap puts the
     numeral in clear space after one word and directly underneath the
     flourish of another.

     Measured per word by rendering it to a canvas and finding the rightmost
     non-transparent pixel, then subtracting measureText().width. As a ratio
     of font size: Disciplines 0.02, Where 0.18, How 0.25, Selected 0.82.
     The default clears the first three — their overhang is either tiny or at
     a height the numeral does not occupy, and all three were checked by eye
     at 1440. "Selected" ends in a d whose ascender sweeps up and to the
     right through exactly the numeral's band, which buried it; hence the
     override on that caller. Re-measure the same way before changing any
     script word. */
  numberOffset = 0.09,
  /* Optional trailing mark that separates one cycle from the next, e.g. "-" */
  trailing,
  /* Spoken once, since the visible text repeats */
  ariaLabel,
  reduceMotion = false,
  className = '',
  /* Callers that sit under a page title pass their own, so the running
     head cannot end up larger than the name of the thing it heads. */
  size = 'clamp(2.75rem, 11.4vw, 172.533px)',
  /* Swaps which half gets the script face. Only the faces trade places. */
  swapFaces = false,
}) {
  const firstFace = swapFaces ? FONT : SCRIPT_FONT
  const secondFace = swapFaces ? SCRIPT_FONT : FONT
  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        '--m': size,
        height: 'calc(var(--m) * 1.5765)',
      }}
    >
      {[0.313, 0.6781, 1.0433].map((t) => (
        <div
          key={t}
          aria-hidden="true"
          className="absolute left-0 w-full h-px bg-[rgba(43,35,28,0.39)]"
          style={{ top: `calc(var(--m) * ${t})` }}
        />
      ))}

      <Marquee
        reduceMotion={reduceMotion}
        className="absolute inset-0"
        ariaLabel={ariaLabel}
      >
        <span
          aria-hidden="true"
          className="flex items-start whitespace-nowrap text-[var(--walnut)]"
          style={{
            height: 'calc(var(--m) * 1.5765)',
            paddingTop: 'calc(var(--m) * 0.1275)',
            /* Air between the end of one cycle and the start of the next,
               matching the frame's own left and right insets combined. */
            paddingRight: 'calc(var(--m) * 1.04)',
          }}
        >
          {/* NO CHALK FILTER ON EITHER RUN. Both were textured through
              CHALK_TEXTURE until it was removed here deliberately: at
              marquee scale the displacement roughened the script face into
              something closer to a scan than a drawn letter, and repeating
              it across a looping strip multiplied the effect. The texture
              still belongs to the site — it is what the hero name, the nav
              wordmark it docks into and the footer's "Let's work together"
              are built from — so the running heads are now the plain voice
              between those two chalked moments. Re-adding it means the
              filter goes on each RUN, never on a wrapper: a filter on the
              parent drags the number and the orchid in with it, and the
              number is 16px, where a 10px displacement dismantles the glyph
              rather than roughening it. */}
          <span
            style={{
              fontFamily: firstFace,
              fontSize: 'var(--m)',
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
            }}
          >
            {script}
          </span>

          {number && (
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 'calc(var(--m) * 0.0927)',
                lineHeight: 1.54,
                marginTop: 'calc(var(--m) * 0.1855)',
                marginLeft: `calc(var(--m) * ${numberOffset})`,
              }}
            >
              ({number})
            </span>
          )}

          {/* The orchid that used to ride between the title and the next
              repeat has been taken out, to be replaced. Nothing stands in
              for it: the gap it leaves is the run's own spacing, so the
              marquee reads as words with air between them rather than as a
              row with a hole in it. */}

          <span
            style={{
              fontFamily: secondFace,
              fontWeight: 400,
              fontSize: 'var(--m)',
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
              marginLeft: 'calc(var(--m) * 0.348)',
            }}
          >
            {sans}
            {trailing ? ` ${trailing}` : ''}
          </span>
        </span>
      </Marquee>
    </div>
  )
}
