/* ═══════════════════════════════════════════════════════════════════════════
   CASESTUDY.JSX — one template, every case study

   Replaces two hand-built pages (Bluecore 582 lines, Known 396) and their two
   private stylesheets (441 + 462). Those had the same intent and had drifted
   into different designs; this is the intent written once.

   It is assembled from the parts the rest of the site is made of, because a
   case study should read as another chapter of the same document rather than
   a template that happens to share a palette:

     Home  the chalk-textured script name, the marquee that opens a movement
           (MarqueeTitle), the sticky numeral rail and the "+ (label)"
           micro-label from Disciplines, the alternating media/text entries
           from Where I've been, the hairline ledger rows
     Work  the chalk-textured script display face, the glass magnifier that
           follows the cursor over media (CursorTag), and DragStrip's momentum,
           which is the ring's own decay curve

   Layout is a RAIL, not a split. The rail is --cs-rail wide — the numeral and
   nothing else — because a 1fr rail beside a numeral leaves half the page
   empty and squeezes every layout inside the section to half width. Prose is
   capped at --prose-max independently, so the measure does not follow the
   column.

   Media BREAKS the rail. A photo run is the one thing that wants the whole
   page, and because the rail is a known width rather than max-content, a
   .cs-bleed block can give it back exactly. The numeral stays sticky in its
   own column and never collides.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

import Nav from './Nav'
import GoldStar from './GoldStar'
import SiteFooter from './SiteFooter'
import MarqueeTitle from './MarqueeTitle'
import DragStrip from './DragStrip'
import CursorTag from './CursorTag'
import LogoOrb from './LogoOrb'
import JourneyMilestones from './JourneyMilestones'
import CaseStudyNav from './CaseStudyNav'
import useCaseStudyMotion from './useCaseStudyMotion'

import '../styles/case-study.css'

const SCRIPT_FONT = "'Coneria Script Slanted', cursive"

/* The site's micro-label. The plus and brackets are CSS (see .cs-label), so
   the convention lives in one place. */
function Label({ children }) {
  return <span className="cs-label">{children}</span>
}

/* ── Media with the work page's glass magnifier ───────────────────────────
   The tag is the same object the ring and the disciplines use — a real
   backdrop-filter lens, not a text follower — so hovering a photo here does
   what hovering a card does on /work. */
function Magnified({ children, label = 'View', className = '' }) {
  const ref = useRef(null)
  return (
    <div ref={ref} className={`cs-magnified ${className}`}>
      <CursorTag targetRef={ref} label={label} />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCKS
   ═══════════════════════════════════════════════════════════════════════════ */

function Prose({ items }) {
  return (
    <div className="cs-prose">
      {items.map((p, i) => (
        <p key={i} className="cs-body">{p}</p>
      ))}
    </div>
  )
}

/* One display line, split to words so it can arrive the way the hero's tldr;
   does — staggered, unblurring. The split happens here rather than in the
   motion hook so the markup is the same whether or not motion runs. */
function Statement({ text }) {
  return (
    <p className="cs-statement">
      {text.split(' ').map((w, i) => (
        <span key={i} className="cs-word">{w}&nbsp;</span>
      ))}
    </p>
  )
}

/* The figure INLINE with its claim, so the sentence flows around it and wraps
   underneath. It was a flex row — figure in one cell, claim in another, a
   hairline under each — which forced the sentence into a narrow column beside
   a very large number and made the number read as a label for it. Inline, the
   number is the first word of the sentence, which is what it actually is. */
function Stat({ figure, claim, secondary, row }) {
  return (
    <div className={`cs-stat ${row && secondary ? 'cs-stat--row' : ''}`}>
      <p className="cs-stat-line">
        <span className="cs-stat-figure">{figure}</span>
        {claim}
      </p>
      {secondary && (
        <p className="cs-stat-line">
          <span className="cs-stat-figure">{secondary.figure}</span>
          {secondary.claim}
        </p>
      )}
    </div>
  )
}

/* ── DEVICE — a phone frame with something in it ──────────────────────────
   The bezel is CSS, not the phone-frame.png this repo carries: a PNG frame
   has to be aligned pixel-for-pixel with whatever sits inside it, and the
   content here will be swapped for a video later. A drawn frame scales, and
   the screen is a real box the content simply fills.

   Renders a video, an image, or a labelled placeholder, in that order — so
   dropping in a clip later is one field in the data. */
function Device({ video, src, alt, placeholder = 'Demo coming soon', poster }) {
  return (
    <div className="cs-device">
      <div className="cs-device-screen">
        {video ? (
          <video src={video} poster={poster} autoPlay loop muted playsInline aria-label={alt} />
        ) : src ? (
          <img src={src} alt={alt || ''} loading="lazy" />
        ) : (
          <span className="cs-device-placeholder">{placeholder}</span>
        )}
      </div>
    </div>
  )
}

/* Two shapes, one component.

   NARROW (default) is the hero's meta and the workflow list: a short term, a
   short value, pushed apart. WIDE is a what/why table — the value is a
   sentence, so it left-aligns and takes the room, and the term gets a fixed
   column so the rows read as a table rather than as ragged pairs.

   dl/dt/dd rather than <table> because these are term/description pairs, not
   tabular data with meaningful row-column intersections. Screen readers get
   the better structure and the CSS stays simpler. */
/* A star, not a bullet. A filled gold dot reads as a list marker; the shape
   is what says "this is a prize" before the sentence is read. */
function Ledger({ eyebrow, rows, headers, wide, note }) {
  return (
    <div className={`cs-ledger ${wide ? 'cs-ledger--wide' : ''}`}>
      {eyebrow && <Label>{eyebrow}</Label>}
      {headers && (
        <div className="cs-ledger-head" aria-hidden="true">
          <span>{headers[0]}</span>
          <span>{headers[1]}</span>
        </div>
      )}
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="cs-ledger-row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {note && (
        <p className="cs-caption">
          {/* A note is either a plain string or a run of parts, so one word
              inside it can be a link without the sentence being split into
              three fields at the data layer. */}
          {(Array.isArray(note) ? note : [note]).map((part, i) =>
            typeof part === 'string' ? (
              part
            ) : (
              <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className="cs-caption-link">
                {part.label}
              </a>
            ),
          )}
        </p>
      )}
    </div>
  )
}

/* `stack` is single-column. A 2x2 grid is right for findings that are peers
   — four insights you can read in any order. It is wrong for a sequence,
   where the second step only makes sense after the first, so an approach
   reads as a column. */
function Cards({ eyebrow, items, stack, noIndex }) {
  return (
    <div className="cs-cards-wrap">
      {eyebrow && <Label>{eyebrow}</Label>}
      <div className={`cs-cards ${stack ? 'cs-cards--stack' : ''}`}>
        {items.map((c, i) => (
          <article key={c.title} className="cs-card">
            {/* An index earns its place when the order is the point. These
                three are peers you can read in any order, so numbering them
                only competed with the numerals that DO carry meaning — the
                section and phase counters. */}
            {!noIndex && (
              <span className="cs-card-index" style={{ fontFamily: SCRIPT_FONT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            <h3 className="cs-card-title">{c.title}</h3>
            <p className="cs-card-body">{c.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

/* Media and text as a pair, alternating down the page — the Where I've been
   arrangement. `flip` puts the media on the right. */
function Feature({ media, placeholder, eyebrow, heading, text, links, flip }) {
  /* A phone screenshot is ~0.47:1. Dropped into a media column at the same
     width as a landscape photo it renders over 1000px tall and swamps the
     sentence it is meant to illustrate, so it is capped and centred on its
     own ground instead. The bezel is already in the asset. */
  const visual = media
    ? (
      <Magnified className={`cs-feature-media ${media.phone ? 'cs-feature-media--phone' : ''}`}>
        <img src={media.src} alt={media.alt || ''} loading="lazy" />
      </Magnified>
    )
    : placeholder
      ? <div className="cs-feature-media cs-placeholder"><span>{placeholder}</span></div>
      : null

  return (
    <div className={`cs-feature ${flip ? 'is-flipped' : ''} ${visual ? '' : 'is-textonly'}`}>
      {visual}
      <div className="cs-feature-text">
        {eyebrow && <Label>{eyebrow}</Label>}
        {heading && <h3 className="cs-feature-heading">{heading}</h3>}
        <p className="cs-body">{text}</p>
        {links && (
          <div className="cs-inline-links">
            {links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* One image, captioned, allowed to take the whole page. This is where a
   process artifact goes — a synthesis board, a decision flow, an iteration
   set. It differs from `feature` in that the image is the argument rather
   than support for a sentence beside it, so it gets the rail back. */
function Figure({ src, video, poster, alt, caption, contain, phone, reduceMotion }) {
  return (
    <figure className={`cs-bleed cs-figure ${phone ? 'cs-figure--phone' : ''}`}>
      <Magnified label="Look">
        {video ? (
          /* A silent looping clip is motion the reader did not ask for, so
             under prefers-reduced-motion it holds on the poster and offers
             controls instead of playing itself. */
          <video
            src={video}
            poster={poster}
            aria-label={alt || ''}
            className={contain ? 'is-contained' : ''}
            autoPlay={!reduceMotion}
            loop={!reduceMotion}
            controls={reduceMotion}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            className={contain ? 'is-contained' : ''}
          />
        )}
      </Magnified>
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  )
}

/* Breaks the rail. A photo run is the one thing that wants the whole page. */
function Strip({ items, caption, reduceMotion }) {
  return (
    <div className="cs-bleed cs-strip-block">
      <DragStrip
        items={items}
        reduceMotion={reduceMotion}
        height="clamp(180px, 22vw, 340px)"
        className="cs-strip"
      />
      {caption && <p className="cs-caption">{caption} — drag to explore</p>}
    </div>
  )
}

function LinkGrid({ kind, items }) {
  return (
    <div className={`cs-links cs-links--${kind}`}>
      {items.map((l, i) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="cs-link-card">
          <span className="cs-link-index" style={{ fontFamily: SCRIPT_FONT }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="cs-link-label">{l.label}</span>
          {l.detail && <span className="cs-link-detail">{l.detail}</span>}
          <span className="cs-link-arrow" aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  )
}

function Orb({ text }) {
  return (
    <div className="cs-feature">
      <div className="cs-feature-media cs-orb"><LogoOrb /></div>
      <div className="cs-feature-text">
        <p className="cs-body">{text}</p>
      </div>
    </div>
  )
}

/* ── SPLIT — two labelled columns, side by side ───────────────────────────
   Problem and solution are a PAIR: the second only means anything against the
   first, and reading them as two stacked sections makes the reader hold the
   first in their head while they scroll. Beside each other, the comparison is
   the layout.

   Each column carries the same "+ (label)" micro-label the sections use, and
   its own nested blocks — so a column can hold prose, a figure, whatever the
   argument needs, rather than being a fixed prose slot. */
function Split({ columns, reduceMotion }) {
  return (
    <div className="cs-split">
      {columns.map((col, i) => (
        <div key={col.label || i} className="cs-split-col">
          {col.label && <Label>{col.label}</Label>}
          {col.blocks.map((b, j) => (
            <Block key={j} block={b} reduceMotion={reduceMotion} />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── STEPS — a process rail ───────────────────────────────────────────────
   Four moves on a line, read left to right, each on a numbered node.

   THE ICONS ARE DRAWN FOR THESE FOUR STEPS, not chosen from a set. The
   reference this came from used a magnifier, a flask and a wrench — stock
   process glyphs that would say the same thing on any case study ever
   written, which is another way of saying they say nothing. These are about
   BlueCore: the vessel the research happened on, the voice interface that
   was built and rejected, the rejection itself, and the orb the product was
   rebuilt around. The last one is literally the product's own mark.

   One stroke weight, currentColor, no fills — the same hairline the ledgers
   and the connector rail are drawn with, so they read as part of the page's
   line work rather than as imported artwork. */
const STEP_ICONS = {
  /* Eight months at sea: a hull, a mast, and the waterline under it. */
  vessel: (
    <>
      <path d="M3.5 13.5h17l-2.7 5.2a1.5 1.5 0 0 1-1.33.8H7.53a1.5 1.5 0 0 1-1.33-.8z" />
      <path d="M12 13.5V4.5" />
      <path d="M12 6.2l4.6 5.1H12" />
      <path d="M2.5 21.5c1.6 0 1.6-1 3.2-1s1.6 1 3.2 1 1.6-1 3.1-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.1 1" />
    </>
  ),
  /* GreenWatch was a voice interface — this is what one looks like. */
  voice: (
    <>
      <path d="M4 10.5v3" />
      <path d="M8 6.5v11" />
      <path d="M12 3.5v17" />
      <path d="M16 7.5v9" />
      <path d="M20 11v2" />
    </>
  ),
  /* What the mariners said when we brought it back. */
  rejected: (
    <>
      <path d="M20.5 11.6a7.1 7.1 0 0 1-7.1 7.1h-4.2L4.5 21.5v-4a7.1 7.1 0 0 1-1-3.9 7.1 7.1 0 0 1 7.1-7.1h2.8a7.1 7.1 0 0 1 7.1 7.1z" />
      <path d="M9.9 9.6l5 5" />
      <path d="M14.9 9.6l-5 5" />
    </>
  ),
  /* The mark the product was rebuilt around. */
  orb: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <ellipse cx="12" cy="12" rx="8.2" ry="3.5" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8.2" />
    </>
  ),
}

/* The rail sits in a PANEL with the section's own heading inside it. That
   heading used to be the section title, sitting left-aligned above a rail
   that spanned the full width — so the two read as unrelated objects. Boxed
   together, the title names the diagram it belongs to. */
function Journey({ title, subtitle, phases, label }) {
  return (
    <div className="cs-steps-panel">
      {title && <h3 className="cs-steps-title">{title}</h3>}
      {subtitle && <p className="cs-steps-sub">{subtitle}</p>}
      <JourneyMilestones phases={phases} label={label} />
    </div>
  )
}

function Steps({ items, title, subtitle }) {
  return (
    <div className="cs-steps-panel">
      {title && <h3 className="cs-steps-title">{title}</h3>}
      {subtitle && <p className="cs-steps-sub">{subtitle}</p>}
      <ol className="cs-steps">
      {items.map((step, i) => (
        <li key={step.title} className="cs-step">
          {/* The connector is two flex hairlines that are SIBLINGS of the
              mark, not a line running behind the row. That is what lets the
              mark stay unfilled: the segments simply stop at its edge, so
              nothing has to be masked, and nothing breaks when a movement
              changes ground colour. First and last hide their outer half so
              the rail begins and ends on a node. */}
          <div className="cs-step-node">
            <span className="cs-step-mark">
              <svg
                className="cs-step-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {STEP_ICONS[step.icon] || STEP_ICONS.orb}
              </svg>
              <span className="cs-step-badge" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </span>
          </div>
          <h3 className="cs-step-title">{step.title}</h3>
          {step.note && <p className="cs-step-note">{step.note}</p>}
        </li>
        ))}
      </ol>
    </div>
  )
}

/* ── DETAIL ARTWORK — the process artifacts, drawn ────────────────────────
   Diagrams rather than screenshots. A Figma export of a working board is a
   photograph of a mess — placeholder lorem, cursors, comment pins, whatever
   zoom it was captured at — and it goes soft the moment the card is wider
   than the export. These are vector, at the same hairline weight as the
   ledgers and the step rail, so they read as part of the page.

   They are drawn from BLUECORE'S OWN PARTS, not from a generic UI kit: the
   wireframe orb, the "on watch" status line, the conversation bubble, the
   four-tab pill. Anyone who has seen the product screens recognises them,
   which is the difference between an illustration of a process and a record
   of one.

   The palettes keep the structure of the real style boards — Primary,
   Neutrals, Gradient, stacked on a white card — because that structure is
   what makes two colourways read as two DIRECTIONS rather than two swatch
   sets that happen to sit side by side. ── */

/* The wireframe run, rebuilt from the real boards.

   Kept from the originals, because they are what makes them recognisable as
   THESE wireframes: the striped placeholder fill, the folded top-right
   corner, the "break status" label, the scribble standing in for the orb
   before it existed, the alternating left/right message runs, and the
   persistent bottom bar. Dropped: the lorem, which at card size is texture
   pretending to be text.

   Recoloured to the page — walnut at low opacity instead of pink — so six
   working files read as one considered diagram rather than as a screenshot
   of somebody else's canvas. */
const WF_STEPS = [
  { L: [3], R: 0, scribble: true },
  { top: 'block', L: [3, 1], R: 2, scribble: true, bubble: true },
  { L: [3, 1], R: 2, scribble: true },
  { top: 'block', L: [3, 1], R: 2, scribble: true, bubble: true },
  { top: 'bleed', L: [3, 1], R: 2, bubble: true, tail: 3, avatars: true },
  { top: 'video', L: [3], bubble: true },
]

function WireStripes({ x, y, w, h }) {
  /* The placeholder fill. Four bands rather than twelve: at 46px wide the
     original's stripe pitch turns to moiré. */
  return (
    <g opacity="0.05">
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={x + 3 + i * 9} y={y + 1} width="4.5" height={h - 2} fill="currentColor" />
      ))}
    </g>
  )
}

/* The orb before it was the orb.

   Evenly rotated ellipses of one size make a ROSETTE — a regular flower, the
   opposite of a scribble. A tangle needs irregularity, so each loop varies in
   angle, radius and centre. The offsets are a fixed table rather than
   Math.random so the shape is identical on every render. */
const SCRIBBLE_LOOPS = [
  [0, 1.0, 0.52, 0, 0],
  [41, 0.86, 0.44, 1.4, -1.1],
  [79, 1.04, 0.6, -1.2, 0.9],
  [113, 0.78, 0.4, 0.8, 1.6],
  [148, 0.94, 0.55, -1.6, -0.7],
  [22, 0.68, 0.36, 0.5, 0.4],
  [132, 0.6, 0.3, -0.6, -1.4],
]

function Scribble({ cx, cy, r }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="0.55" opacity="0.32">
      {SCRIBBLE_LOOPS.map(([a, rx, ry, dx, dy], i) => (
        <ellipse key={i} cx={cx + dx} cy={cy + dy} rx={r * rx} ry={r * ry}
          transform={`rotate(${a} ${cx + dx} ${cy + dy})`} />
      ))}
    </g>
  )
}

function TextRun({ x, y, lines, align = 'left', w = 30 }) {
  const widths = [w, w * 0.86, w * 0.62]
  return (
    <g fill="currentColor" opacity="0.3">
      {Array.from({ length: lines }, (_, i) => {
        const lw = widths[i % 3]
        return <rect key={i} x={align === 'right' ? x - lw : x} y={y + i * 5}
          width={lw} height="2" rx="1" />
      })}
    </g>
  )
}

/* BlueCore's orb, small. Shared between the component grid and anywhere else
   the product's own mark is called for. */
function MiniOrb({ cx, cy, r, o = 0.5 }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity={o}>
      <circle cx={cx} cy={cy} r={r} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.42} />
      <ellipse cx={cx} cy={cy} rx={r * 0.42} ry={r} />
    </g>
  )
}

/* Lifted off the BlueCore screens in this repo — the ground, the two bubble
   fills and their two text colours, the blue-tinted active states, and the
   pale-green completion pill. Named here rather than inline so the component
   sheet cannot drift from the product it documents. */
const BC = {
  bg: '#0B111A',
  cardDark: '#151A22',
  cardBlue: '#17335E',
  chip: '#1E242E',
  activeFill: 'rgba(59,130,246,0.16)',
  activeTab: '#2563EB',
  /* Lifted straight off the screen this was #1B2430, which against the
     #151A22 card it sits on is a 1.1:1 difference — the badge simply did not
     appear. Raised until the circle reads as a circle. */
  iconBadge: '#26313F',
  accent: '#4A9EFF',
  aiBubble: '#12181F',
  aiText: '#5FA8E8',
  userBubble: '#1E242E',
  orb: '#3A6FC4',
  violet: '#8B8BD8',
  green: '#4ADE80',
  greenFill: 'rgba(74,222,128,0.14)',
}

const PALETTES = [
  { name: 'Aqua', primary: ['#B0424A', '#EDF6F0', '#ADD8DC', '#4A7BA7', '#1E3352'] },
  { name: 'Sage', primary: ['#C5D3C5', '#86A98A', '#57827A', '#34515A', '#2E404E'] },
]
const NEUTRALS = ['#D9C7AE', '#C0A78A', '#8A7050', '#5C4526', '#2A1D0C']

const DETAIL_ART = {
  wireframes: (
    <>
      {WF_STEPS.map((f, i) => {
        const x = 12 + i * 51
        const y = 34
        const w = 46
        const h = 132
        return (
          <g key={i}>
            <WireStripes x={x} y={y} w={w} h={h} />
            <rect x={x} y={y} width={w} height={h} rx="3"
              fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />

            {/* the folded corner */}
            <path d={`M${x + w - 9} ${y} L${x + w} ${y} L${x + w} ${y + 9} Z`}
              fill="currentColor" opacity="0.28" />

            {/* "break status" */}
            <rect x={x + 4} y={y + 5} width="13" height="2" rx="1"
              fill="currentColor" opacity="0.4" />

            {f.top === 'block' && (
              <rect x={x + 5} y={y + 12} width={w - 10} height="18" rx="3"
                fill="currentColor" opacity="0.16" />
            )}
            {f.top === 'bleed' && (
              <rect x={x} y={y} width={w} height="16" rx="3"
                fill="currentColor" opacity="0.16" />
            )}
            {f.top === 'video' && (
              <>
                <rect x={x + 5} y={y + 14} width={w - 10} height="52" rx="3"
                  fill="currentColor" opacity="0.13" />
                <path d={`M${x + 20} ${y + 33} L${x + 30} ${y + 40} L${x + 20} ${y + 47} Z`}
                  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
              </>
            )}

            {f.scribble && <Scribble cx={x + w / 2} cy={y + (f.top ? 52 : 46)} r={13} />}

            {/* left run, then right run, then a second left run */}
            {f.L?.[0] && <TextRun x={x + 4} y={y + (f.top === 'bleed' ? 24 : 62)} lines={f.L[0]} w={30} />}
            {f.R > 0 && <TextRun x={x + w - 4} y={y + 78} lines={f.R} align="right" w={28} />}
            {f.L?.[1] && <TextRun x={x + 4} y={y + 92} lines={f.L[1]} w={32} />}

            {f.bubble && (
              <>
                <rect x={x + 5} y={y + 99} width={w - 10} height="16" rx="3"
                  fill="currentColor" opacity="0.15" />
                {[0, 1, 2].map((k) => (
                  <rect key={k} x={x + 8} y={y + 103 + k * 4} width={[28, 30, 24][k]} height="1.6"
                    rx="0.8" fill="currentColor" opacity="0.3" />
                ))}
              </>
            )}
            {f.tail && <TextRun x={x + w - 4} y={y + 99} lines={f.tail} align="right" w={26} />}
            {f.avatars && (
              <>
                <circle cx={x + 12} cy={y + 118} r="5" fill="currentColor" opacity="0.14" />
                <circle cx={x + 18} cy={y + 118} r="5" fill="currentColor" opacity="0.3" />
                <rect x={x + 26} y={y + 113} width="16" height="10" rx="5"
                  fill="currentColor" opacity="0.14" />
              </>
            )}

            {/* the small avatar, the rule, and the persistent bottom bar */}
            {!f.avatars && (
              <circle cx={x + 8} cy={y + 120} r="3" fill="currentColor" opacity="0.25" />
            )}
            <line x1={x} y1={y + h - 8} x2={x + w} y2={y + h - 8}
              stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
            <rect x={x + 10} y={y + h - 5} width="26" height="1.8" rx="0.9"
              fill="currentColor" opacity="0.28" />
          </g>
        )
      })}
    </>
  ),

  palettes: (
    <>
      {PALETTES.map((pal, g) => {
        const cx = 8 + g * 156
        const sx = cx + 8
        const row = (label, y) => (
          <text x={sx} y={y} fontSize="9.67" fill="currentColor" opacity="0.45"
            fontFamily="'DM Sans', sans-serif">{label}</text>
        )
        return (
          <g key={pal.name}>
            {/* This viewBox is 320 wide drawn at ~397, so units are multiplied
                by 1.241: 12.89 renders --cs-t-meta's 16px and the 9.67 on the
                swatch labels renders --cs-t-micro's 12. They were 10 and 6.5,
                which came out at 12.4 and 8.1 — the second well under the
                floor where a label is still readable. */}
            <text x={cx} y="14" fontSize="12.89" fill="currentColor" opacity="0.6"
              fontFamily="'DM Sans', sans-serif">{`Style — ${pal.name}`}</text>
            {/* the white board the swatches were laid out on */}
            <rect x={cx} y="22" width="148" height="164" rx="4"
              fill="#ffffff" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />

            {row('Primary', 38)}
            {pal.primary.map((c, i) => (
              <rect key={c + i} x={sx + i * 26} y="43" width="22" height="30" rx="2.5" fill={c} />
            ))}

            {row('Neutrals', 88)}
            {NEUTRALS.map((c, i) => (
              <rect key={c + i} x={sx + i * 26} y="93" width="22" height="30" rx="2.5" fill={c} />
            ))}

            {row('Gradient', 138)}
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={sx + i * 16.25} y="143" width="16.6" height="28"
                fill={pal.primary[4]} opacity={0.3 + i * 0.09} />
            ))}
            <rect x={sx} y="143" width="130" height="28" rx="2.5"
              fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.16" />
          </g>
        )
      })}
    </>
  ),

  /* BlueCore's own parts, in BlueCore's own colours, on the grid they were
     catalogued in.

     This is the second place on the page that breaks the walnut-on-ivory
     rule, and for the same reason the palette card does: a component sheet
     whose components have been recoloured to match the portfolio is not a
     record of the design system, it is a drawing of one. Every value here is
     lifted off the product screens — the AI's blue, the user bubble's white,
     the pale-green completion pill, the blue-tinted active states. */
  components: (
    <>
      <rect x="10" y="12" width="300" height="176" rx="8" fill={BC.bg} />
      <line x1="10" y1="100" x2="310" y2="100" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1" />
      {[110, 210].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="188" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1" />
      ))}

      {/* 1 — the orb */}
      <g fill="none" stroke={BC.orb} strokeWidth="1" opacity="0.9">
        <circle cx="60" cy="56" r="21" />
        <ellipse cx="60" cy="56" rx="21" ry="8.5" />
        <ellipse cx="60" cy="56" rx="8.5" ry="21" />
        <ellipse cx="60" cy="56" rx="21" ry="15" transform="rotate(38 60 56)" />
      </g>

      {/* 2 — filter chips, first one active */}
      <rect x="122" y="34" width="30" height="15" rx="7.5" fill={BC.activeFill}
        stroke={BC.accent} strokeWidth="0.9" />
      <rect x="129" y="40" width="16" height="3" rx="1.5" fill={BC.accent} />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={157 + i * 33} y="34" width="30" height="15" rx="7.5" fill={BC.chip} />
          <rect x={164 + i * 33} y="40" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.55" />
        </g>
      ))}
      {/* the "· ON WATCH" status line under them */}
      <circle cx="125" cy="66" r="2" fill={BC.violet} />
      <rect x="131" y="63.5" width="46" height="4" rx="2" fill={BC.violet} opacity="0.55" />

      {/* 3 — the conversation pair: AI left, user right */}
      <rect x="220" y="26" width="62" height="26" rx="6" fill={BC.aiBubble} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x="226" y={32 + k * 6} width={[50, 44, 30][k]} height="2.6" rx="1.3" fill={BC.aiText} />
      ))}
      <rect x="240" y="58" width="62" height="20" rx="6" fill={BC.userBubble} />
      {[0, 1].map((k) => (
        <rect key={k} x="246" y={64 + k * 6} width={[48, 34][k]} height="2.6" rx="1.3" fill="#ffffff" opacity="0.85" />
      ))}

      {/* 4 — an in-progress document card, with its progress bar */}
      <rect x="22" y="114" width="76" height="56" rx="7" fill={BC.cardBlue}
        stroke={BC.accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <rect x="29" y="122" width="6" height="7" rx="1.5" fill="none" stroke={BC.accent} strokeWidth="0.9" />
      <rect x="39" y="122" width="30" height="3.4" rx="1.7" fill="#ffffff" opacity="0.9" />
      <rect x="76" y="122" width="16" height="3" rx="1.5" fill={BC.accent} opacity="0.9" />
      <rect x="29" y="133" width="34" height="2.6" rx="1.3" fill="#ffffff" opacity="0.4" />
      <rect x="29" y="146" width="26" height="2.6" rx="1.3" fill="#ffffff" opacity="0.55" />
      <rect x="80" y="146" width="12" height="2.6" rx="1.3" fill="#ffffff" opacity="0.55" />
      <rect x="29" y="155" width="63" height="3.4" rx="1.7" fill="#ffffff" opacity="0.15" />
      <rect x="29" y="155" width="36" height="3.4" rx="1.7" fill={BC.accent} />

      {/* 5 — a completed row, with its status pill */}
      <rect x="122" y="118" width="76" height="48" rx="6" fill={BC.cardDark} />
      <circle cx="136" cy="142" r="9" fill={BC.iconBadge} />
      <rect x="133" y="138.5" width="6" height="7" rx="1.5" fill="none" stroke={BC.accent} strokeWidth="0.9" />
      <rect x="150" y="132" width="34" height="3.4" rx="1.7" fill="#ffffff" opacity="0.9" />
      <rect x="150" y="140" width="26" height="2.6" rx="1.3" fill="#ffffff" opacity="0.4" />
      <rect x="150" y="150" width="26" height="10" rx="5" fill={BC.greenFill} />
      <circle cx="156" cy="155" r="1.6" fill={BC.green} />
      <rect x="160" y="153.6" width="12" height="2.6" rx="1.3" fill={BC.green} />

      {/* 6 — the four-tab bar, first tab active */}
      <rect x="222" y="128" width="76" height="28" rx="14" fill={BC.cardDark} />
      <rect x="228" y="134" width="16" height="16" rx="8" fill={BC.activeTab} />
      <circle cx="236" cy="142" r="4.4" fill="none" stroke="#ffffff" strokeWidth="0.9" />
      {[0, 1, 2].map((d) => (
        <circle key={d} cx={258 + d * 15} cy="142" r="4.4"
          fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.9" />
      ))}
    </>
  ),
}

/* ── PHASES — the approach, opened out ────────────────────────────────────
   Each move gets a numeral, a title, a paragraph of narrative, and then two
   detail panels that break it into what was actually done.

   This replaced three disclosures. Folding detail away is right when it
   serves a second audience — the GreenWatch internals do, and those stay
   folded. It is wrong for the argument itself: the approach IS the case
   study, and a reader had to click three times to find out what happened.

   Two panels per phase rather than one list, because each move has two
   distinct halves — what was heard and where it was heard, what was built
   and what came back. Side by side, that pairing is the layout. */
function Phases({ items, reduceMotion }) {
  return (
    <ol className="cs-phases">
      {items.map((phase, i) => (
        <li key={phase.title} className="cs-phase">
          {/* The numeral hangs in column one; the title, the lead and every
              block of evidence below share column two. The phase is the grid,
              so that shared edge is structural — nothing here computes an
              indent, which is what the old build did in two different ways
              that landed 4px apart. */}
          <span className="cs-phase-numeral" style={{ fontFamily: SCRIPT_FONT }} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="cs-phase-body">
            <h3 className="cs-phase-title">{phase.title}</h3>
            {phase.lead && <p className="cs-phase-lead">{phase.lead}</p>}
          </div>

          {/* The one piece of evidence a phase can carry on its own, before
              the methods. It sits on the same grid as the cards below and
              takes one of their two columns, so the photograph reads as the
              first item in the exhibit rather than as a banner across it. */}
          {phase.artifacts?.length > 0 && (
            <div className="cs-phase-artifact">
              {phase.artifacts.map((a) => (
                <figure key={a.image || a.art}>
                  {a.image ? (
                    <img src={a.image} alt={a.imageAlt || ''} loading="lazy" />
                  ) : (
                    <div role="img" aria-label={a.artAlt || ''}>
                      {PHASE_FIGURES[a.art]}
                    </div>
                  )}
                  {a.caption && <figcaption>{a.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {phase.details?.length > 0 && (
            <div className="cs-phase-details">
              {phase.details.map((d) => (
                /* Cell, not card. The note under the last one sits on the
                   page ground rather than inside the tint, so the wrapper
                   holds the column and the card keeps its own edges. */
                <div key={d.title} className="cs-detail-cell">
                <div className="cs-detail">
                  <h4 className="cs-detail-title">{d.title}</h4>
                  {/* The artifact sits between the title and the findings —
                      the method named, the thing it produced, then what it
                      produced. Without it a card is an assertion; with it the
                      assertion has its evidence attached. */}
                  {d.image ? (
                    <div className="cs-detail-art">
                      <img src={d.image} alt={d.imageAlt || ''} loading="lazy" />
                    </div>
                  ) : d.art ? (
                    <div className="cs-detail-art cs-detail-art--drawn">
                      <svg viewBox="0 0 320 200" role="img" aria-label={d.artAlt || ''}>
                        {DETAIL_ART[d.art]}
                      </svg>
                    </div>
                  ) : null}
                  {d.subtitle && <p className="cs-detail-sub">{d.subtitle}</p>}
                  <ul className="cs-detail-points">
                    {/* A point is either a plain string or a run of parts, so
                        a claim can carry its own evidence inline instead of
                        the card needing a separate link row. Same shape the
                        ledger notes use. */}
                    {d.points.map((pt, pi) => (
                      <li key={pi}>
                        {(Array.isArray(pt) ? pt : [pt]).map((part, i) =>
                          typeof part === 'string' ? (
                            part
                          ) : (
                            <a key={i} href={part.href} target="_blank" rel="noopener noreferrer"
                              className="cs-caption-link">
                              {part.label} <span aria-hidden="true">&#8599;</span>
                            </a>
                          ),
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {d.note && (
                  <p className="cs-detail-note">
                    {d.note.text}
                    {d.note.link && (
                      <>
                        {' '}
                        <a href={d.note.link.href} target="_blank" rel="noreferrer">
                          {d.note.link.label} <span aria-hidden="true">&#8599;</span>
                        </a>
                      </>
                    )}
                  </p>
                )}
                </div>
              ))}
            </div>
          )}

          {phase.decision && <Decision {...phase.decision} />}

          {/* AFTER the methods, not before. The clusters are what the
              interviews and the tours produced — reading them first asks the
              reader to take the findings on trust and meet the work later. */}
          {phase.themes?.length > 0 && (
            <Themes items={phase.themes} title={phase.themesTitle} />
          )}

          {/* Closes the phase it belongs to. GreenWatch's internals used to
              sit three blocks further down the page, where a reader met them
              long after the story that made them interesting. */}
          {phase.disclosure && (
            <div className="cs-phase-disclosure">
              <Disclosure {...phase.disclosure} reduceMotion={reduceMotion} />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}

/* ── THEMES — what people said, and the question it produced ──────────────
   The output of an affinity map, which is a wall of hundreds of notes that
   cannot go on a page. Each column keeps the raw material — actual sentences
   people said — and ends on the "how might we" that came out of the cluster.

   The quotes are the evidence and the question is the conclusion, so a rule
   separates them: everything above it is theirs, the line below it is the
   team's. Without that break a reader cannot tell which is which. */
/* ═══════════════════════════════════════════════════════════════════════════
   PHASE_FIGURES — drawings a phase can hang beside its photograph

   FAILED is a mirror, not a decoration. The award photograph carries the
   judges' verdict; this carries the mariners'. Same box, same height, same
   weight on the page, opposite outcome — which is the whole argument of the
   phase, made in one glance before a word of the cards is read.

   DOM, NOT ONE FLAT SVG. Baking the copy into the drawing was the obvious
   build and it fails on phones: an SVG scales every glyph with its box, so
   the 16px caption that reads fine at 468px wide renders at 10.7px at 327px.
   Only the mark is drawn. The words are real elements at the site's own type
   tiers, so they hold their size at any width.

   Clay, not red. The palette has no red, and a browser red beside a warm
   photograph reads as an error state rather than as a finding. --cs-clay is
   the terracotta already carrying the research phase on the journey chain.

   The mark is stroked twice, the second pass offset a little and faded,
   because one geometric X reads as a UI glyph and two passes read as a mark
   somebody made.
   ═══════════════════════════════════════════════════════════════════════════ */
const PHASE_FIGURES = {
  failed: (
    <div className="cs-verdict">
      <svg className="cs-verdict-mark" viewBox="0 0 120 120" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="15" strokeLinecap="round" fill="none">
          <path d="M18 18 Q60 62 102 102" />
          <path d="M102 18 Q62 60 18 102" />
          <g strokeWidth="7" opacity="0.32">
            <path d="M21 14 Q63 58 105 98" />
            <path d="M99 15 Q59 57 15 105" />
          </g>
        </g>
      </svg>
      <p className="cs-verdict-word">Failed</p>
      <p className="cs-verdict-line">with the people it was built for</p>
    </div>
  ),
}

/* ── DECISION — the fork, drawn ──────────────────────────────────────────
   Was two panels carrying ten runs of text between them, three of which
   restated quotes already sitting in the Gap Mapping panel a phase earlier.
   The phase lead already explains WHY the pivot happened; what the page was
   missing is a picture of the pivot itself.

   So: one rail arriving, two branches leaving, one of them stopped. Four
   short runs instead of ten, in the same panel treatment as the journey
   diagram and Gap Mapping.

   The rail is CSS, not SVG. A drawn fork would need its geometry kept in
   step with two rows of DOM text at every width; borders on the rows do the
   same job and cannot fall out of alignment with the labels they belong to.
   ─────────────────────────────────────────────────────────────────────── */
function Decision({ rejected, chosen }) {
  return (
    <div className="cs-fork">
      {/* One rail in, two out. preserveAspectRatio="none" lets it stretch to
          whatever height the two rows resolve to, and non-scaling-stroke
          keeps the line an even weight while it does. */}
      <svg className="cs-fork-rail" viewBox="0 0 64 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 50 H24 Q32 50 32 42 V33 Q32 25 40 25 H64" />
        <path d="M32 58 V67 Q32 75 40 75 H64" />
      </svg>

      <div className="cs-fork-row cs-fork-row--rejected">
        <span className="cs-fork-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 7 17 17M17 7 7 17" />
          </svg>
        </span>
        <span className="cs-fork-name">{rejected.title}</span>
        <span className="cs-fork-status">{rejected.status}</span>
      </div>

      <div className="cs-fork-row cs-fork-row--chosen">
        <span className="cs-fork-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 12.5 10.5 17 18 8" />
          </svg>
        </span>
        <span className="cs-fork-name">{chosen.title}</span>
        <span className="cs-fork-status">{chosen.status}</span>
      </div>
    </div>
  )
}

/* ── OUTRO — the record written while it was happening ───────────────────
   Its own band below the movements, not a block inside one. It closes the
   page rather than belonging to the impact, so it gets its own ground and a
   script heading with no marquee and no running sans behind it.

   Listed, not carded. Four cards made four boxes competing for the same
   glance; a list has one entry point per row and reads top to bottom, which
   is how a reader treats a bibliography — which is what this is.

   Rebuilt from the old page's LinkedIn embeds. Those were four iframes:
   four third-party connections dropping tracking cookies on every visitor
   before anyone clicked, rendering LinkedIn's chrome inside a page that has
   its own. A link reaches the same post with none of that.

   Authorship is shown, not assumed. One of these was written about the work
   rather than by her, and that is the strongest of the four — coverage beats
   a self-report, but only if a reader can tell them apart. */
function Outro({ title, items }) {
  return (
    <section className="cs-outro">
      <div className="page-content-shell">
        <h2 className="cs-outro-title" style={{ fontFamily: SCRIPT_FONT }}>{title}</h2>
        <ul className="cs-outro-list">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} target="_blank" rel="noopener noreferrer" className="cs-outro-link">
                <span className="cs-outro-meta">{it.meta}</span>
                <span className="cs-outro-name">{it.title}</span>
                <span className="cs-outro-go" aria-hidden="true">&#8599;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Themes({ items, title }) {
  return (
    <div className="cs-themes-panel">
      {title && <h4 className="cs-themes-title">{title}</h4>}
      <div className="cs-themes">
      {items.map((t) => (
        <div key={t.title} className="cs-theme">
          <h4 className="cs-theme-title">{t.title}</h4>
          <div className="cs-theme-quotes">
            {t.quotes.map((q) => (
              <p key={q} className="cs-theme-quote">&ldquo;{q}&rdquo;</p>
            ))}
          </div>
          <p className="cs-theme-question">{t.question}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── NOTE — a labelled aside with its own links ───────────────────────────
   For the things a reader would otherwise have to ask about: why there is no
   hosted demo, where the code is. Quieter than a statement, louder than a
   caption. */
function Note({ label, text, links }) {
  return (
    <aside className="cs-note">
      {label && <Label>{label}</Label>}
      <p className="cs-note-text">{text}</p>
      {links?.length > 0 && (
        <div className="cs-inline-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}

/* ── DISCLOSURE — the long detail, folded away ─────────────────────────────
   A case study has two audiences at once: a recruiter scanning for the shape
   of the work, and a reviewer who wants the technical detail. Writing for
   one loses the other. Folding the detail lets the page read short and go
   deep on demand.

   The control is Disciplines' exactly — a full-width row, the title, and a
   `+` that rotates 45deg into a cross when open. Same glyph, same gesture,
   so a reader who has met it on the home page already knows what it does.

   `inert` on the collapsed panel matters: height 0 with overflow hidden
   hides content visually but leaves every link and heading inside it in the
   tab order and the a11y tree, so a keyboard user tabs into a panel they
   cannot see. */
function Disclosure({ summary, hint, blocks, star, reduceMotion }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const firstRun = useRef(true)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    /* No tween on mount — otherwise every disclosure animates itself shut on
       first paint, which reads as the page collapsing as you arrive. */
    if (firstRun.current || reduceMotion) {
      firstRun.current = false
      gsap.set(el, { height: open ? 'auto' : 0, opacity: open ? 1 : 0 })
      return
    }
    const tween = gsap.to(el, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.65,
      ease: 'power3.inOut',
    })
    return () => tween.kill()
  }, [open, reduceMotion])

  return (
    <div className={`cs-disclosure ${star ? 'cs-disclosure--starred' : ''} ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cs-disclosure-toggle"
      >
        {star && <GoldStar className="cs-disclosure-star" />}
        <span className="cs-disclosure-summary">{summary}</span>
        {hint && <span className="cs-disclosure-hint">{hint}</span>}
        <span aria-hidden="true" className="cs-disclosure-plus">+</span>
      </button>

      <div
        ref={panelRef}
        className="cs-disclosure-panel"
        aria-hidden={!open}
        inert={!open ? '' : undefined}
      >
        <div className="cs-disclosure-inner">
          {blocks.map((b, i) => (
            <Block key={i} block={b} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Block({ block, reduceMotion }) {
  switch (block.type) {
    case 'prose':     return <Prose items={block.items} />
    case 'statement': return <Statement text={block.text} />
    case 'stat':      return <Stat {...block} />
    case 'device':    return <Device {...block} />
    case 'ledger':    return <Ledger {...block} />
    case 'cards':     return <Cards {...block} />
    case 'steps':     return <Steps {...block} />
    case 'journey':   return <Journey {...block} />
    case 'phases':    return <Phases {...block} reduceMotion={reduceMotion} />
    case 'themes':    return <Themes {...block} />
    case 'note':      return <Note {...block} />
    case 'split':     return <Split {...block} reduceMotion={reduceMotion} />
    case 'feature':   return <Feature {...block} />
    case 'figure':    return <Figure {...block} />
    case 'strip':     return <Strip {...block} reduceMotion={reduceMotion} />
    case 'links':     return <LinkGrid {...block} />
    case 'disclosure': return <Disclosure {...block} reduceMotion={reduceMotion} />
    case 'orb':       return <Orb {...block} />
    default:          return null
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CaseStudy({ study, reduceMotion = false }) {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const motifRef = useRef(null)

  /* The orb is a CANVAS, so its size is a number, not a CSS length — it has
     to be recomputed rather than clamped in a stylesheet. Bounded on BOTH
     axes: height because the hero is now a full viewport and the orb has to
     sit inside it whole, width because it must not reach the wordmark.
     Starts at 520 so the first paint is not a resize. */
  const [orbSize, setOrbSize] = useState(520)
  useEffect(() => {
    const fit = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      /* Ignore degenerate readings. A resize can fire mid-transition with
         zero dimensions — a hidden iframe, a backgrounded tab, a pane being
         resized — and without this guard that reading sticks: the orb
         collapses to 0x0 and never recovers, because nothing fires again. */
      if (!vh || !vw) return
      /* Floored as well as capped, so an unusually short or narrow window
         shrinks the orb rather than erasing it. */
      setOrbSize(Math.round(Math.max(240, Math.min(560, vh * 0.55, vw * 0.34))))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  useCaseStudyMotion(rootRef, reduceMotion)

  /* The scroll cue is for someone who has not worked out that the page
     scrolls. The moment they do it has said everything it has to say, and
     this never resets — one-way, like the rest of the site. */
  const [hasScrolled, setHasScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setHasScrolled(true)
    window.addEventListener('scroll', onScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { title, meta, sections, motif, brand, outro, awards } = study
  /* The tldr; line. Defaults to the tagline, which is already written as the
     one sentence that has to land. */

  useEffect(() => {
    document.body.className = 'page-light-body page-case-study'
    /* With the title in a marquee below the fold, the tab is the only place
       the project is named on arrival. */
    const previousTitle = document.title
    document.title = `${title} — Kataliya Sungkamee`
    window.scrollTo(0, 0)
    return () => {
      document.body.className = ''
      document.title = previousTitle
    }
  }, [study.slug, title])

  /* Movements name their sections by id rather than nesting them, so the
     grouping can be re-cut in one line without moving any content. Anything
     a movement does not claim is appended to the last one instead of
     vanishing — a silent drop is the failure mode this shape invites. */
  const movements = (() => {
    const byId = new Map(sections.map((s) => [s.id, s]))
    const groups = (study.movements || []).map((m) => ({
      ...m,
      sections: m.sections.map((id) => byId.get(id)).filter(Boolean),
    }))
    if (!groups.length) {
      return [{ id: 'body', script: title, sans: 'case study', trailing: '-', sections }]
    }
    const claimed = new Set(study.movements.flatMap((m) => m.sections))
    const orphans = sections.filter((s) => !claimed.has(s.id))
    if (orphans.length) groups[groups.length - 1].sections.push(...orphans)
    return groups
  })()

  return (
    <div className="site-wrapper">
      <Nav />

      <main className="cs-page" ref={rootRef}>

        {/* ── HERO — the masthead ──────────────────────────────────────
            The project's own wordmark, its facts, and nothing else. This was
            a full-viewport "01 TLDR;" landing borrowed from Home, with the
            name in a marquee below it and the meta in a separate band below
            that — three screens before the first sentence of the actual case
            study.

            The name is set in the PRODUCT's typeface, not the site's script.
            A case study is about someone else's brand, and putting BlueCore
            in Coneria says more about this portfolio than about BlueCore.
            Falls back to the site's script face when a study declares no
            brand of its own.

            The motif keeps its overlay: it has to span the hero's full HEIGHT
            while aligning to the hero SHELL's edges, and the shell around the
            text is only as tall as the text. clip-path rather than
            overflow-hidden so the orb can spill past the bottom edge without
            an unclipped RIGHT spill growing the document's scroll width. */}
        <header ref={heroRef} className="cs-hero relative w-full flex flex-col justify-end">
          {motif && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: 'inset(0px 0px -240px 0px)' }}
            >
              <div className="page-content-shell h-full">
                {/* Centred with FLEX, not translate. GSAP animates transform
                    on the motif (opacity/scale/y), and an inline transform
                    replaces Tailwind's -translate-y-1/2 outright rather than
                    composing with it — so the moment the reveal touched it
                    the orb dropped half its own height and was clipped by the
                    hero's bottom edge. Nothing here uses transform for
                    layout, so the timeline can own it. */}
                <div className="relative h-full flex items-center justify-end">
                  {/* LIVE, not a still. The PNG was a frame of this same orb;
                      the real one breathes and responds to the cursor, which
                      is the thing the copy below claims about it. LogoOrb is
                      a whole hero composition, so .cs-hero-motif--live crops
                      it to the canvas and suppresses the <h1> it ships with —
                      that would otherwise be a second page heading. */}
                  {/* An EXPLICIT box, not max-content. LogoOrb's root is
                      width/height 100%, so against a max-content parent the
                      two size off each other and the canvas collapsed to
                      324px inside a 520px request. */}
                  <div
                    ref={motifRef}
                    className={`cs-hero-motif ${motif.live ? 'cs-hero-motif--live' : ''} ${motif.video ? 'cs-hero-motif--clip' : ''} hidden lg:block mr-[-2vw] opacity-0`}
                    style={motif.live ? { width: orbSize, height: orbSize } : undefined}
                  >
                    {/* Three kinds of motif: the live orb sizes itself to an
                        explicit box, a clip or a still hangs from its own
                        height. --live only belongs on the canvas — it crops to
                        the orb, which would crop a video too. */}
                    {motif.live ? (
                      <LogoOrb bare size={orbSize} />
                    ) : motif.video ? (
                      <video
                        src={motif.video}
                        poster={motif.poster}
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden="true"
                        className="block h-[46vh] w-auto max-w-none"
                      />
                    ) : (
                      <img src={motif.src} alt="" className="block h-[52vh] w-auto max-w-none" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="page-content-shell relative">
            <div className="cs-masthead">
              {/* Still an <h1> when it is a logo — the page needs one heading
                  and a screen reader needs the name, so the mark carries the
                  title as its alt rather than replacing it. */}
              {brand?.logo ? (
                <h1 className="cs-brand cs-brand--logo cs-hero-item">
                  <img src={brand.logo} alt={title} />
                </h1>
              ) : (
                <h1
                  className="cs-brand cs-hero-item"
                  style={
                    brand
                      ? {
                          fontFamily: brand.font,
                          fontWeight: brand.weight,
                          color: brand.color,
                          letterSpacing: brand.letterSpacing,
                        }
                      : { fontFamily: SCRIPT_FONT, filter: 'url(#name-chalk-texture)' }
                  }
                >
                  {title}
                </h1>
              )}

              {awards?.length > 0 && (
                <ul className="cs-awards cs-hero-item">
                  {awards.map((a) => (
                    <li key={a}>
                      {/* A star, not a bullet. A filled dot in gold reads as
                          a list marker; the shape is what says "this is a
                          prize" before the sentence is read. */}
                      <GoldStar className="cs-award-star" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}

              <dl className="cs-meta cs-hero-item">
                {meta.map(([k, v]) => (
                  <div key={k} className="cs-ledger-row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        {/* Placed AFTER the hero, so `position: sticky` alone decides when it
            appears — out of frame over the masthead, pinned under the shared
            bar the moment the body starts. */}
        <CaseStudyNav movements={movements} />

        {/* ── MOVEMENTS ─────────────────────────────────────────────────
            The home page's shape. There, the hero ends and the page proceeds
            as movements — Disciplines 02, Where I've been 03, How I got here
            04 — each opened by a full-bleed marquee carrying its own number,
            each on a ground that alternates against the one before it, each
            holding items numbered from 01 inside.

            A case study is the same document, so it is built the same way. It
            used to be one marquee and then nine sections in a flat run, which
            is a different rhythm from the rest of the site and gave the
            reader no sense of which part of the argument they were in.

            The two numbering levels are home's, not an invention: the marquee
            number is the movement, the rail numeral is the item within it.
            Disciplines is marquee 02 holding services 01–04. ── */}
        {movements.map((m, i) => (
          <section
            key={m.id}
            id={m.id}
            /* Alternating grounds, starting deep — the hero is ivory, so
               movement one contrasts against it exactly as Disciplines does
               against the home hero.

               NOTE: no `overflow: hidden` here, unlike the home sections.
               It would make each movement a scroll container and the rail's
               position:sticky would never fire. .cs-page carries overflow-x:
               clip instead, which clips the marquee without creating one. */
            /* The ground is also a CLASS, not just a utility. Anything inside
               that needs to know which ground it landed on — a tinted card, a
               tinted note — was keying off :nth-child, which counts every
               sibling in <main> including the header and the back-link, so
               the parity was one off and the fallback fired on the wrong
               movement. An explicit modifier cannot drift. */
            className={`cs-movement cs-movement--${m.id} ${
              m.tone
                ? `cs-movement--deep cs-movement--${m.tone}`
                : i % 2 === 0
                  ? 'cs-movement--deep bg-[var(--ivory-deep)]'
                  : 'cs-movement--light bg-[var(--ivory)]'
            } relative w-full pt-12 md:pt-16`}
          >
            <MarqueeTitle
              script={m.script}
              sans={m.sans}
              number={m.number}
              trailing={m.trailing}
              ariaLabel={`${m.script} ${m.sans}, part ${m.number}`}
              reduceMotion={reduceMotion}
              size="var(--cs-t-marquee)"
              swapFaces
              className="cs-marquee mb-10 md:mb-14"
            />

            <div className="cs-sections shell">
              {m.sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className={`cs-section ${s.bare ? 'cs-section--bare' : ''}`}
                >
                  {/* `bare` drops the numeral rail. A section whose own
                      content is already labelled — a split's two columns each
                      carry a "+ (label)" — does not also need a numeral
                      announcing it, and the rail would indent the whole thing
                      away from the marquee above it. */}
                  {!s.bare && (
                    <div className="cs-rail">
                      {/* A counter reading "01 of 1" is noise. Sections that
                          are the only one in their movement drop the numeral
                          and keep the label. */}
                      {!s.noNumeral && (
                        <span className="cs-numeral" style={{ fontFamily: SCRIPT_FONT }} aria-hidden="true" />
                      )}
                      <Label>{s.label}</Label>
                    </div>
                  )}

                  <div className="cs-content">
                    {s.title && <h2 className="cs-section-title">{s.title}</h2>}
                    {s.blocks.map((b, j) => (
                      <Block key={j} block={b} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ))}

        {outro && <Outro {...outro} />}

        <div className="cs-footer-link shell">
          <Link to="/work" className="cs-back-link">
            <span aria-hidden="true">←</span> back to work
          </Link>
        </div>
      </main>

      <SiteFooter reduceMotion={reduceMotion} />
    </div>
  )
}
