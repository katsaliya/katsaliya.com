/* ═══════════════════════════════════════════════════════════════════════════
   CHALKTEXTURE.JSX — the site's chalky-edge SVG filter, defined once

   feTurbulence generates fractal noise; feDisplacementMap then pushes each
   pixel of the source by the red/green channels of that noise. The result is
   an edge that wanders very slightly instead of running clean, which is what
   reads as chalk or letterpress rather than vector type.

   Mounted ONCE, at the app root, because an SVG filter id is document-global
   and the things referencing it are scattered: the Home hero name, the nav
   wordmark that name docks into, and the footer's "Let's work together".
   Those three are now the whole list — the section marquees used it too
   until the texture was taken off them deliberately (see MarqueeTitle.jsx),
   which leaves it marking the opening and the close rather than every
   heading in between. It previously
   lived inside the hero's JSX, which already meant the nav — an element
   outside the hero entirely — depended on a def buried in a section it has
   no relationship to. Removing or restructuring the hero would have silently
   stripped the texture off the nav.

   Two defs would be worse than one in the wrong place: duplicate ids in a
   document resolve to whichever the renderer sees first, so the second copy
   is dead weight that looks like it works.

   Scale is tuned for large display type (the hero name at ~200px, the
   footer CTA at ~112px). It does NOT survive being pointed at small text: a
   10px displacement on a 16px glyph destroys the letterform rather than
   texturing it — so anything at label size stays plain.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import this rather than retyping the url() — the id is an implementation
   detail and callers should not each hardcode it. */
export const CHALK_TEXTURE = 'url(#name-chalk-texture)'

export default function ChalkTexture() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <filter id="name-chalk-texture" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.06 0.19"
          numOctaves="3"
          seed="7"
          result="grain"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="grain"
          scale="10"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}
