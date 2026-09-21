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
import { CHALK_TEXTURE } from './ChalkTexture'

const FONT = "'DM Sans', sans-serif"
const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

export default function MarqueeTitle({
  /* The script half, e.g. "Disciplines" / "How" */
  script,
  /* The sans half, e.g. "by Kataliya Sungkamee" / "I got here" */
  sans,
  /* Optional superscript section number, e.g. "02". Fixed at 16px in the
     frame — a mark, not a scaled superscript, so it stays the same size as
     every other micro-label on the page. */
  number,
  /* Optional trailing mark that separates one cycle from the next, e.g. "-" */
  trailing,
  /* Spoken once, since the visible text repeats */
  ariaLabel,
  reduceMotion = false,
  className = '',
  /* Callers that sit under a page title pass their own, so the running
     head cannot end up larger than the name of the thing it heads. */
  size = 'clamp(2.75rem, 11.4vw, 172.533px)',
  /* Swaps which half gets the script face. Only the faces trade places —
     both runs stay chalked, as they already were. */
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
          {/* Textured per RUN, not on a wrapper around the whole lockup: a
              filter on the parent would drag the number and the orchid in
              with it. The number is 16px, and the chalk filter's 10px
              displacement at that size dismantles the glyph rather than
              roughening it. */}
          <span
            style={{
              fontFamily: firstFace,
              fontSize: 'var(--m)',
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
              filter: CHALK_TEXTURE,
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
                marginLeft: 'calc(var(--m) * 0.09)',
              }}
            >
              {number}
            </span>
          )}

          <img
            src="/images/assets/orchid-logo-placeholder.png"
            alt=""
            className="w-auto shrink-0"
            style={{
              height: 'calc(var(--m) * 0.74)',
              marginTop: 'calc(var(--m) * 0.1855)',
              marginLeft: 'calc(var(--m) * 0.348)',
              transform: 'rotate(-0.2deg)',
            }}
          />

          <span
            style={{
              fontFamily: secondFace,
              fontWeight: 400,
              fontSize: 'var(--m)',
              lineHeight: 1.14,
              letterSpacing: '-0.01em',
              marginLeft: 'calc(var(--m) * 0.348)',
              filter: CHALK_TEXTURE,
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
