/* ═══════════════════════════════════════════════════════════════════════════
   JOURNEYMILESTONES.JSX — the approach as a milestone chain

   Replaces the four-move stepper. That showed four moves; this shows the
   eleven things those moves were actually made of, grouped under them — so
   the section reads as a record rather than a summary.

   TWO RENDERINGS, ONE SOURCE. The horizontal chain is SVG, because a rail
   with leader lines angling to alternating labels is drawing, not layout.
   Below 900px it is replaced by a stacked DOM list rather than a squeezed
   SVG: at phone width the chain would compress to eleven circles about 20px
   apart with 12px labels on top of each other. Both read from the same
   JOURNEY array, so they cannot drift.

   COLOUR COMES FROM TOKENS, never from a hex in this file. Each phase group
   sets `color` from a --jm-* token in case-study.css and everything inside it
   paints with currentColor. Two of the four had to be added: the palette has
   gold and jade but no coral and no navy — see the token block there.

   NOTE ON THE OVERLAP. The brief asked for circles that overlap their
   neighbours within a phase. At the specified sizes that is geometrically
   incompatible with readable labels: 32px and 26px circles overlap only when
   their centres are under 29px apart, which leaves three 12px two-line
   labels sharing 58px of width. The circles are grouped tightly and linked by
   a weighted rail segment in the phase colour instead — the grouping reads,
   and the labels can be read. ═══════════════════════════════════════════ */

const BLUECORE_JOURNEY = [
  {
    phase: 'Research',
    tone: 'research',
    items: [
      { label: ['Onboarding &', 'field scoping'] },
      { label: ['Stakeholder', 'interviews'], key: true },
      { label: ['Vessel & bridge', 'tours'] },
    ],
  },
  {
    phase: 'Prototype & Test',
    tone: 'prototype',
    items: [
      { label: ['Prototype', 'sketching'] },
      { label: ['SF Hacks build,', '48hrs'], key: true },
      { label: ['Mariner', 'feedback'] },
    ],
  },
  {
    phase: 'Reposition',
    tone: 'reposition',
    items: [
      { label: ['Findings', 'synthesis'] },
      { label: ['Precision over', 'wellness pivot'], key: true },
      { label: ['Visual identity'] },
    ],
  },
  {
    phase: 'Build & Ship',
    tone: 'build',
    items: [
      { label: ['Screen & copy', 'design'], key: true },
      { label: ['Frontend build', '& ship'], key: true },
    ],
  },
]

/* ── the drawing's geometry, in one place ────────────────────────────────
   viewBox width is close to the panel's real inner width at desktop, so a
   radius of 16 renders at about 32px — the size the brief names. */
const VB_W = 1240
/* The drawing is one row of circles with a label band above and below it. It
   was laid out on 310 units with the rail at 200, which put ~60 units of
   nothing between the phase headers and the labels under them and rendered
   the panel 280px tall for what is, in the end, eleven dots. Tightened to the
   ink: headers, band, rail, band. Nothing about the horizontal solve changes,
   so VB_W stays 1240 and the labels still render at their intended 12px. */
const VB_H = 216
const ROW_Y = 138
const R_KEY = 16
const R_SUP = 13
const STEP = 74 /* between circles inside a phase */
const PHASE_GAP = 132 /* between the last of one phase and the first of the next */

/* Solve the x of every circle once, so the rail, the leaders, the labels and
   the phase headers all read the same numbers. */
function layout(JOURNEY) {
  const total = JOURNEY.reduce((n, p) => n + p.items.length, 0)
  const steps = total - JOURNEY.length /* within-phase gaps */
  const span = steps * STEP + (JOURNEY.length - 1) * PHASE_GAP
  let x = (VB_W - span) / 2
  let i = 0
  const phases = JOURNEY.map((p) => {
    const items = p.items.map((it, j) => {
      if (j > 0) x += STEP
      const node = { ...it, x, r: it.key ? R_KEY : R_SUP, index: i++ }
      return node
    })
    const out = { ...p, items, from: items[0].x, to: items[items.length - 1].x }
    x += PHASE_GAP
    return out
  })
  return { phases, first: phases[0].items[0].x, last: x - PHASE_GAP }
}


const SANS = "'DM Sans', sans-serif"
const SERIF = "'Cormorant Garamond', serif"

/* The chain is a component, not a picture of one project. `phases` lets a
   second case study draw its own milestones through the same geometry
   instead of copying the file. */
export default function JourneyMilestones({ phases = BLUECORE_JOURNEY, label }) {
  const LAYOUT = layout(phases)
  return (
    <div className="jm">
      {/* ── horizontal chain ─────────────────────────────────────────── */}
      <svg
        className="jm-chain"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={label || 'The approach as a chain of milestones'}
      >
        {/* the through-line, behind everything */}
        <line x1={LAYOUT.first} y1={ROW_Y} x2={LAYOUT.last} y2={ROW_Y}
          stroke="var(--walnut-faint)" strokeWidth="1" />

        <text x={LAYOUT.first - 66} y={ROW_Y + 4} className="jm-marker"
          fontFamily={SANS} textAnchor="start">Start</text>
        <text x={LAYOUT.last + 66} y={ROW_Y + 4} className="jm-marker"
          fontFamily={SANS} textAnchor="end">End</text>

        {LAYOUT.phases.map((p) => (
          <g key={p.phase} className={`jm-phase jm-phase--${p.tone}`}>
            {/* phase header, and the bar that measures its span */}
            <text x={(p.from + p.to) / 2} y="24" className="jm-phase-name"
              fontFamily={SERIF} textAnchor="middle">{p.phase}</text>
            <rect x={(p.from + p.to) / 2 - 23} y="34" width="46" height="3" rx="1.5"
              fill="currentColor" />

            {/* the phase's own weight on the rail — this is what groups it */}
            <line x1={p.from} y1={ROW_Y} x2={p.to} y2={ROW_Y}
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />

            {p.items.map((it) => {
              const above = it.index % 2 === 0
              const leadFrom = above ? ROW_Y - it.r - 4 : ROW_Y + it.r + 4
              const leadTo = above ? 96 : 176
              const lineY = above ? [74, 88] : [190, 204]
              return (
                <g key={it.label.join(' ')}>
                  <line x1={it.x} y1={leadFrom} x2={it.x} y2={leadTo}
                    stroke="var(--walnut-faint)" strokeWidth="0.8" />
                  <circle cx={it.x} cy={ROW_Y} r={it.r + 7}
                    fill="currentColor" opacity="0.12" />
                  <circle cx={it.x} cy={ROW_Y} r={it.r} fill="currentColor" />
                  {/* the key moments are ringed, so the size difference is
                      not the only thing carrying it */}
                  {it.key && (
                    <circle cx={it.x} cy={ROW_Y} r={it.r - 5}
                      fill="none" stroke="var(--ivory)" strokeWidth="1.5" opacity="0.9" />
                  )}
                  {it.label.map((ln, k) => (
                    <text key={ln} x={it.x} y={lineY[k]} className="jm-label"
                      fontFamily={SANS} textAnchor="middle">{ln}</text>
                  ))}
                </g>
              )
            })}
          </g>
        ))}
      </svg>

      {/* ── stacked, for phones ──────────────────────────────────────── */}
      <ol className="jm-stack">
        {phases.map((p) => (
          <li key={p.phase} className={`jm-group jm-phase--${p.tone}`}>
            <h4 className="jm-group-name">{p.phase}</h4>
            <span className="jm-group-bar" aria-hidden="true" />
            <ul className="jm-group-items">
              {p.items.map((it) => (
                <li key={it.label.join(' ')} className={it.key ? 'is-key' : ''}>
                  {it.label.join(' ')}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
