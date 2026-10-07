/* ═══════════════════════════════════════════════════════════════════════════
   GOLDSTAR.JSX — the site's "this is a prize" mark

   One filled five-point star in --gold. It was defined inside CaseStudy.jsx
   and used twice there; Selected work's BlueCore card is the third caller,
   so it lives here rather than being copied and left to drift.

   A STAR, NOT A BULLET, and not a ribbon or a medal either. The shape says
   prize before the sentence beside it is read, and it is the only award
   iconography on the site — which is what makes counting them meaningful.
   One star per win, everywhere, so two stars is two wins and needs no
   caption to say so.

   Sized in em and filled with currentColor's sibling token rather than
   currentColor itself, so it stays gold wherever it is dropped and takes
   its size from the type it sits beside. Callers that need a fixed size
   pass one through className.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function GoldStar({ className = '' }) {
  return (
    <svg className={`cs-star ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.8 14.9 8.7 22.4 9.3 16.7 14.2 18.4 21.5 12 17.6 5.6 21.5 7.3 14.2 1.6 9.3 9.1 8.7Z" />
    </svg>
  )
}
