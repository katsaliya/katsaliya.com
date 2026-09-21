# Redesign spec — nav, chrome, hero, work section

This is a multi-part restyle. Implement one numbered part at a time, only 
when explicitly instructed to (e.g. "implement only Part 1"). Read the 
entire spec before starting any part, since later parts depend on earlier 
ones and the OUT OF SCOPE list at the bottom applies throughout.

---

## Part 1 — Design tokens + container system

Add these as CSS custom properties on `:root` in shared.css (or wherever 
the global stylesheet/token file already lives — check for an existing 
`:root` block before creating a new one):

```css
:root {
  --ivory: #FAF8F3;
  --ivory-deep: #F3EFE4;
  --walnut: #2B231C;
  --walnut-soft: #55493c;
  --walnut-faint: rgba(43,35,28,0.5);
  --gold: #C9A227;
  --orchid: #A8558F;
  --jade: #2F6E64;
  --border: rgba(43,35,28,0.1);
  --glass-bg: rgba(255,255,255,0.5);
  --glass-border: rgba(255,255,255,0.7);

  --container-max: 1280px;
  --container-pad: clamp(24px, 5vw, 80px);
}
```

Do not remove or rename any existing CSS custom properties already 
defined on `:root` — add these alongside them. If any of these variable 
names already exist with different values, flag the conflict rather than 
silently overwriting.

Add a reusable container class:

```css
/* Breakpoint scale: sm 640px / md 768px / lg 1024px / xl 1280px / 2xl 1536px */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-inline: var(--container-pad);
}
```

Don't apply `.container` to any existing markup yet — later parts do that 
as each section is touched.

**Verify:** confirm no variable-name collisions with existing tokens; test 
`.container` in isolation on one throwaway element then remove the test 
usage; screenshot the site to confirm nothing visually changed (this part 
is additive only); report which file(s) these were added to.

---

## Part 2 — Hero

Critical requirement: on first paint, the visitor must see ONLY the hero 
content (name, tagline, scroll hint) — zero pixels of the work section 
visible or peeking in, regardless of viewport height or browser chrome.

- Hero section: `height: 100vh` (NOT `min-height` — must be an exact cap), 
  `overflow: hidden`.
- Structure: full-bleed outer section (background can extend edge-to-edge, 
  no max-width) with a `.container` wrapping the actual hero content 
  (name, tagline, kicker row, scroll hint), centered per Part 1's pattern.
- Keep the existing typewriter animation (name variants cycling) exactly 
  as-is — do not modify `useTypewriter.js` or its timing/accessibility 
  handling.
- Scroll hint element at the bottom of the hero is the only affordance 
  suggesting more content exists below.

**Verify:** reload at a few different viewport heights and confirm 
literally zero work-section pixels are visible on first paint.

---

## Part 3 — Nav

Behavior:
- At scroll position 0 (over the hero): transparent background, no 
  border, no blur.
- Past ~60px of scroll: crossfade (0.4s ease) to a frosted glass state — 
  `background: rgba(250,248,243,0.72)`, `backdrop-filter: blur(16px)`, 
  `border-bottom: 1px solid var(--border)`. Also reduce vertical padding 
  slightly (26px → 18px) so the nav visually "settles" once it's glass.
- Implement via a scroll listener toggling a `.scrolled` class — reuse 
  the existing IntersectionObserver setup if one is already wired to the 
  nav; otherwise add a lightweight scroll listener. Do NOT touch any 
  IntersectionObserver logic used for other fade-in effects elsewhere on 
  the page.

Active-section indicator:
- Whichever nav link corresponds to the section currently in view gets a 
  thin gold underline (1px, `var(--gold)`) that slides in from the left 
  via a `::after` pseudo-element transition (`right: 100%` → `right: 0`, 
  0.3s ease). Same treatment on `:hover` regardless of active state.
- Wordmark stays as the text "kataliya" (Cormorant Garamond italic, 
  ~21px) for now — do NOT replace this with an icon or logo mark, that's 
  separate work landing later.

Nav content (links, wordmark) sits inside a `.container` per Part 1 — the 
frosted background can span full width, but nav items align to the same 
max-width column as the rest of the page.

**Verify:** scroll and confirm the crossfade timing feels right, active-link 
underline tracks correctly as you scroll between sections.

---

## Part 4 — Section rhythm

Applies to hero + work section + any other top-level sections:

- Alternate background between `var(--ivory)` and `var(--ivory-deep)` 
  section by section, for rhythm without adding borders/shadows between 
  sections.
- Between sections, add a thin repeating divider mark: a soft wave-and-dot 
  SVG, centered, alternating its accent dot color between gold / orchid / 
  jade going down the page.

```html
<svg viewBox="0 0 160 20" fill="none">
  <path d="M0 10 Q13 0 26 10 T52 10 T78 10 T104 10 T130 10 T160 10" 
        stroke="var(--gold)" stroke-width="1"/>
  <circle cx="80" cy="10" r="2.5" fill="[alternating accent]"/>
</svg>
```

---

## Part 5 — Work section: structure and static states

Layout: single vertical column of case-study cards inside a `.container` 
(don't force a fixed pixel width — let it respect the container system's 
max-width and padding), gap ~56px between cards.

**⚠️ Scope note:** only restyle the card presentation in this part — no 
hover animation yet (that's Part 6). Do NOT touch the existing 
bin-packing/masonry algorithm in `useMasonry.js` — if the grid is moving 
to single-column, that hook may become unused for this view; confirm 
before deleting it rather than removing outright, since it may still be 
used elsewhere (e.g. `Play.jsx`).

Card shell:

```css
.card {
  position: relative;
  border-radius: 18px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(43,35,28,0.06);
  overflow: visible;   /* critical — allows pills/preview to escape card bounds later */
  padding: 18px;
}
.card:hover { z-index: 20; }
```

Inside each card, a `.media-stage` wrapper (`position: relative`, 
`height: 340px`, `overflow: visible`) contains three separate layers — 
build all three now in their RESTING state only, no hover motion yet:

**a) `.media`** — static background (project screenshot/thumbnail). 
`position: absolute`, `inset: 0`, `border-radius: 12px`, `overflow: hidden`.

**b) `.media-preview`** — the demo photo/video slot. At rest: small 
(~220×138px), centered via `top/left: 50%` + 
`transform: translate(-50%,-50%) scale(0.35)`, `opacity: 0` — hidden, 
combined into the center of the background.

**c) Tag pills** — 3-4 per card, `position: absolute`, centered 
(`top/left: 50%`), hidden at rest: `opacity: 0`, `scale(0.4)`. Each pill 
declares its destination via inline custom properties for later use: 
`style="--tx:[x]px; --ty:[y]px; --rot:[deg]deg;"`. Color-code by meaning:
  - gold (`#6b551a` text on `var(--ivory)` bg) → tools/format tags
  - jade (`#1c443d` text) → methodology/context tags
  - orchid (`#6e3a5b` text) → achievement/recognition tags

**d)** A round arrow badge (↗), same center-hidden resting state.

Card body (title, static tag list, description) sits below the 
media-stage as normal document flow, full opacity at rest.

**Verify:** confirm resting state looks right (pills genuinely invisible/
collapsed, preview hidden, layout doesn't break at different widths) 
before Part 6 adds motion on top of it.

---

## Part 6 — Work section: hover interaction

Layer the actual transitions onto the structure from Part 5.

**`.media`** (background): on card hover, only dims — 
`filter: brightness(0.6)`, `transition: filter 0.5s ease`. Never scales 
or moves.

**`.media-preview`**: on card hover — `opacity: 1`, 
`transform: translate(-50%,-50%) scale(1.75)`, box-shadow lift 
(`0 30px 70px rgba(43,35,28,0.3)`), `z-index: 4`. Transition: 
`transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease`.

If real video assets are used here: `muted autoplay loop playsinline` 
attributes, and trigger `.play()` on card `mouseenter` / `.pause()` on 
`mouseleave` rather than relying on autoplay alone.

**Pills**: on card hover — 
`opacity: 1; transform: translate(-50%,-50%) translate(var(--tx),var(--ty)) rotate(var(--rot)) scale(1.05)`. 
Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (deliberate overshoot). 
`z-index: 10`, with `box-shadow: 0 8px 20px rgba(43,35,28,0.12)` so they 
read as lifted above the media-preview. Stagger via `nth-child` 
`transition-delay`, starting AFTER the preview begins growing (0.06s, 
0.10s, 0.14s, 0.18s) so the preview reads as the anchor the pills burst 
outward from, not a parallel animation.

**Arrow badge**: same center-hidden/hover-reveal pattern, appearing last 
(`transition-delay` ~0.2s after the pills), `scale(0.6)` → `scale(1)` with 
the same overshoot easing. Wire its click (or the whole card's click) to 
navigate to that project's case study route.

**Card body**: on hover, fade to `opacity: 0.25` 
(`transition: opacity 0.4s ease`) so it steps back while the enlarged 
preview takes focus — don't hide it entirely, just recede it.

**Spread distances**: `--tx`/`--ty` values need to scale with actual card 
width at whatever breakpoint you're rendering — recompute proportionally 
for the real container width rather than hardcoding one set of values, 
and reduce spread on mobile widths so pills don't fly off-screen (consider 
capping spread or switching to the Part 7 fallback below ~640px).

**Verify:** hover a few cards, confirm the preview grows first, pills 
cascade outward after with visible stagger, arrow appears last, body text 
recedes without disappearing entirely.

---

## Part 7 — Touch/mobile fallback

`:hover` has no equivalent on touch devices, so the Part 6 interaction 
needs a second trigger path — detect via `@media (hover: none)` or a 
touch-capability check in JS, not just a viewport-width breakpoint, since 
some touch devices (iPads with a trackpad/mouse attached) DO support 
hover and should keep the Part 6 behavior as-is.

On hover-incapable devices, replace the `:hover` trigger with a 
scroll-based trigger using IntersectionObserver:

- Observe each `.card` (or its `.media-stage`) with a threshold tuned so 
  the callback fires when the card is centered in the viewport — e.g. 
  `rootMargin: "-40% 0px -40% 0px"` (fires once the card's midpoint 
  crosses the middle 20% band of the screen).
- When a card enters that center band: add the same `.is-active` state 
  that `:hover` drives in Part 6 — trigger the preview grow, pill spread, 
  arrow reveal, body-text fade, using the exact same CSS transitions/
  easing/stagger already defined (don't fork a separate animation — just 
  swap what class/state name is driving it).
- When the card scrolls back out of that center band (either direction): 
  remove `.is-active`, returning it to the hidden/collapsed resting state. 
  Only one card should be active at a time as the user scrolls through 
  the list.
- Guard against re-triggering during minor scroll jitter at the threshold 
  boundary — debounce or use a slightly wider rootMargin band on the way 
  out than the way in (hysteresis) so state doesn't flicker at the edge.
- On mobile, use a tighter spread radius for the pills than desktop 
  (don't reuse the same `--tx`/`--ty` values as a wide viewport) — flag 
  the specific values you choose rather than guessing silently, since 
  this wasn't pinned down in advance.

Reuse the existing IntersectionObserver pattern already in the codebase 
if there's precedent for it (check for existing fade-in-on-scroll logic 
before writing a new observer from scratch) — but this touch-fallback 
logic must not interfere with or fire on desktop hover-capable devices.

---

## OUT OF SCOPE — do not touch, in any part

- `useTypewriter.js` and its animation timing/accessibility handling
- `useMasonry.js` logic itself (only ask before removing if it becomes unused)
- The orchid/logo motif — not built yet, nav wordmark stays as text
- `Known.jsx`, `Play.jsx`, `About.jsx`, `Bluecore.jsx`, `Contact.jsx` and 
  their associated CSS files — this spec is nav/chrome/hero/work-section only
- Any existing venetian-blind card reveal or scroll-triggered fade logic 
  not directly part of the hover interaction described in Part 6

After each part, take a screenshot at 1280px, 768px, and 390px widths and 
flag anything that breaks the container/spread-distance assumptions above 
before considering that part done.