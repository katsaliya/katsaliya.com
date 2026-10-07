/* ═══════════════════════════════════════════════════════════════════════════
   MICROLABEL.JSX — the site's "+ (Label)" mark

   One glyph, one parenthesised word, used wherever a block needs naming
   without a heading: the category above each discipline, the discipline
   above each selected work. The hero's "+ TLDR;" is the same device with
   the parentheses dropped, since it labels a paragraph rather than a block.

   IT LIVES HERE RATHER THAN IN DISCIPLINES because it is now used in two
   sections, and a copy in each is a copy that drifts — the gap, the colour
   and the weight have to stay identical or the two blocks stop reading as
   one system. Disciplines defined it first and Selected work is the second
   caller; the next one imports rather than retypes.

   gap-2 is the spacing the whole convention is set from. The hero's version
   reproduces it with a w-4 box instead, because there the glyph hangs in the
   margin and needs a fixed hang rather than an intrinsic gap.

   ITEMS-BASELINE, NOT ITEMS-CENTER, and the difference only shows when the
   label wraps. Both runs are the same size, so for a single-line label the
   two are identical — but Selected work puts these in a 222px column where
   "(Product Strategy & Design)" takes two lines, and centring floated the
   "+" into the gap between them. Baseline alignment uses a flex item's FIRST
   line, so the glyph stays with the start of the label however many lines it
   runs to. The hero's "+ TLDR;" does the opposite and centres, because there
   the two runs are 16px against 28px and a baseline drops the glyph.
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT = "'DM Sans', sans-serif"

/* `color` is applied INLINE rather than as a class, and that is deliberate.
   A caller passing text-[var(--jade-ink)] through className would be handing
   Tailwind a second colour utility at the same specificity as the default
   one baked in below, and which of the two wins is decided by their order in
   the generated stylesheet, not by the order of the class string. Inline
   style wins outright, every time, whatever Tailwind emits. */
export default function MicroLabel({ children, className = '', color = 'var(--walnut-soft)' }) {
  return (
    <div
      className={`flex items-baseline gap-2 text-[16px] leading-[1.54] ${className}`}
      /* 300, lighter than the body it sits over. The mark is an
         annotation; at the body's own 400 the only thing distinguishing it
         was the brackets. Matches .cs-label on the case studies. */
      style={{ fontFamily: FONT, fontWeight: 300, color }}
    >
      <span aria-hidden="true">+</span>
      <span>({children})</span>
    </div>
  )
}
