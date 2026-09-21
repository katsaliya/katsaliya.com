/* ═══════════════════════════════════════════════════════════════════════════
   CASESTUDIES.JS — every case study, as content

   The old pages were markup: 582 lines of JSX for BlueCore and 396 for Known,
   each carrying its own hero, its own section shapes, its own CSS file. Two
   pages that were supposed to be one template had drifted into two designs,
   and a third case study meant a third drift.

   The template is now the code and this is the content. A section is a title
   and a list of typed BLOCKS; CaseStudy.jsx knows how to render each type and
   nothing else. Adding a case study is adding an entry here.

   Block types — see CaseStudy.jsx for the renderers:

     prose      paragraphs at the 725px measure
     statement  one display line, revealed per word like the hero's tldr;
     stat       an oversized figure in the textured script, plus its claim
     ledger     label/value hairline rows, the Disciplines dl
     cards      the numbered card grid — insights, takeaways
     feature    media and text as a pair, alternating like Where I've been
     figure     one image, captioned
     strip      a draggable photo run — DragStrip, with the ring's physics
     links      outbound cards for posts, profiles, repos

   Every string here was on the page before. Nothing is invented; the sections
   are regrouped so each one makes a single point, which is the one editorial
   change.
   ═══════════════════════════════════════════════════════════════════════════ */

export const BLUECORE = {
  slug: 'bluecore',
  title: 'BlueCore',
  /* The wins are named in the Impact table's Validation row. What is NOT in
     that table is that both belong to the prototype we retired — see the
     statement after the four approach steps, which is where that lands. */
  brand: {
    font: "'Unbounded', sans-serif",
    weight: 600,
    color: '#1e334c',
    letterSpacing: '-0.04em',
  },
  meta: [
    ['Client', 'The Deep Blue Foundation - Maritime Think Tank (Paris, FR)'],
    ['My role', 'Product Design & Engineering Lead'],
    ['Timeline', 'September 2025 — June 2026'],
    ['Tools', 'Figma, Figma Make, React, TypeScript, Claude, Cursor'],
  ],
  /* The LIVE orb, beside the wordmark. The still was a frame of this. */
  /* Sits under the name in the masthead: what it won, before the facts of
     who it was for and how long it took. */
  awards: [
    '1st Place at SF Hacks 2026 for VectorAI DB',
    '1st Place SFSU Student AI Awards for Problem Solving',
  ],

  motif: { live: true, size: 520 },

  /* THREE MOVEMENTS, and the detail folded inside them. The page used to run
     nine sections flat; a recruiter reads the shape of the work in three and
     a technical reviewer opens the four disclosures for the rest. */

  /* Closes the page on its own ground, outside the movements: a script
     heading and the writing itself, no marquee and no running sans. */
  outro: {
    title: 'Written along the way',
    items: [
      {
        meta: 'SF Hacks',
        title: 'My first hackathon, and what came out of it',
        href: 'https://www.linkedin.com/posts/katsaliya_my-first-hackathon-this-weekend-our-activity-7429732127572664320-aIuz',
      },
      {
        meta: 'Seven months in',
        title: 'On collaborating with Ana\u00EFs Barnab\u00E9',
        href: 'https://www.linkedin.com/posts/katsaliya_7-months-into-collaborating-with-ana%C3%AFs-barnab%C3%A9-activity-7447709274186813440-2bVb',
      },
      {
        meta: 'Project update',
        title: 'A note from the middle of the build',
        href: 'https://www.linkedin.com/posts/activity-7452053492816404480-iBVp',
      },
      {
        meta: 'Coverage \u00B7 by Alex Roderick',
        title: 'SFSU hosts its inaugural Student AI Awards',
        href: 'https://www.linkedin.com/posts/aroderick_san-francisco-state-university-hosted-its-activity-7459798114259058689-tCGn',
      },
    ],
  },

  movements: [
    { id: 'overview', number: '01', script: 'The', sans: 'overview', sections: ['overview'] },
    { id: 'approach', number: '02', script: 'My',  sans: 'approach', sections: ['approach'] },
    { id: 'impact',   number: '03', script: 'The', sans: 'impact',   sections: ['outcome', 'takeaways'], tone: 'plum' },
  ],

  sections: [
    /* ONE section, not two. Problem and solution are a pair — the second
       only means anything against the first — so they sit side by side and
       the comparison is the layout. `bare` drops the numeral rail: each
       column already carries its own "+ (label)". */
    {
      id: 'overview',
      label: 'Overview',
      bare: true,
      blocks: [
        {
          type: 'split',
          columns: [
            {
              label: 'Problem',
              blocks: [
                {
                  type: 'prose',
                  items: [
                    'The maritime industry is losing its workforce — not to layoffs, but to burnout. 90% of world trade moves by sea, yet only 28% of crews have left paper logbooks behind.',
                    'Mariners were spending 20–40 minutes by hand filling out required logs after long shifts, eating into rest time.',
                  ],
                },
                /* The headline number sits in the LEFT column, level with the
                   phone opposite it — problem on one side, proof on the
                   other. Full-width under both, it read as a footer to the
                   section rather than as the answer to the paragraph above
                   it. */
                {
                  type: 'stat',
                  figure: '80%',
                  claim: 'less time on paperwork — the same entry, from up to 40 minutes to under 4.',
                },
              ],
            },
            {
              label: 'Solution',
              blocks: [
                {
                  type: 'prose',
                  items: [
                    'BlueCore is a voice-first AI platform that turns paperwork into conversation - built particularly for the realities of the maritime industry. I led product strategy and design, then built the interface myself.',
                  ],
                },
                /* The real screen, which already ships its own bezel — so a
                   `figure`, not a `device`. Wrapping this in the drawn frame
                   would put a phone inside a phone. */
                {
                  type: 'figure',
                  video: '/video/bluecore-overview-demo.mp4',
                  poster: '/video/bluecore-overview-demo-poster.jpg',
                  alt: 'BlueCore closing out an Oil Record Book entry by conversation',
                  phone: true,
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'approach',
      label: 'My approach',
      /* The heading moved INTO the steps panel — see the `title` on the steps
         block below. `bare` drops the numeral rail with it, so the marquee
         runs straight into the diagram the way the design has it. */
      bare: true,
      blocks: [
        /* The rail is the five-second read; the phases under it carry the
           argument. Titles repeat between the two on purpose — the rail is an
           index into the detail, not a separate list. */
        /* The milestone chain replaces the four-move stepper — see
           JourneyMilestones.jsx. The panel heading stays. */
        {
          type: 'journey',
          title: 'Research-led designing for people who distrust being helped',
        },

        {
          type: 'phases',
          items: [
            {
              title: 'Live inside the problem',
              lead: "Eight months of field research. Before designing anything, we needed to understand not just the people we were designing for, but the environment we were adding to. Operations showed us what was risky. Interviews showed us what was stressful. The two rarely pointed at the same thing.",
              details: [
                {
                  title: 'Stakeholder interviews',
                  subtitle: 'What we heard',
                  image: '/images/case-studies/bluecore-research-interviews.png',
                  imageAlt: 'Crew boarding a docked vessel by the gangway, on the way to an interview',
                  points: [
                    '50+ interviews across captains, deck crew, engineers and operators',
                    '70% raised paperwork unprompted',
                    '30% linked it directly to fatigue',
                  ],
                },
                {
                  title: 'Field immersion',
                  subtitle: 'Getting inside the world',
                  image: '/images/case-studies/bluecore-research-immersion.png',
                  imageAlt: 'Three people on a vessel bridge among the consoles and controls',
                  points: [
                    'Toured bridges, engine rooms and vessels firsthand',
                    'Sat through simulators used in academy to prepare mariners',
                    'Mapped the gap between what the industry demands and what exists to support it',
                  ],
                },
              ],
              /* The affinity map's output. Hundreds of notes cannot go on a
                 page; three clusters, the sentences that defined them, and
                 the question each produced can. */
              themesTitle: 'Gap Mapping',
      themes: [
                {
                  title: 'Wellbeing',
                  quotes: [
                    'If you cry, you lose authority.',
                    'You lose parts of yourself at sea.',
                    'Nobody tells you that sea makes you emotionally unavailable.',
                  ],
                  question: "How might we support mariners' wellbeing across their career?",
                },
                {
                  title: 'Paperwork & communication',
                  quotes: [
                    'Paperwork and micromanagement are the two silent anchors driving people off ships.',
                    "Too many systems don't talk to each other.",
                    'AI increases surveillance.',
                  ],
                  question: 'How might we reduce admin burden so mariners can focus on seamanship?',
                },
                {
                  title: 'Operations & engineering',
                  quotes: [
                    "There's too much that can go wrong. You'll always need the human element.",
                    'Parts delays extend downtime and increase frustration.',
                    "We're too short-staffed to keep up.",
                  ],
                  question: 'How might we reduce downtime from missing parts and limited manpower?',
                },
              ],
            },
            {
              title: 'Test research in public',
              lead: "Mid-research, we had the chance to test our research at SF Hacks 2026, tackling two of the gaps we'd found — wellbeing and paperwork — in one tool. It won the favor of the judges, but not of the real users.",
              details: [
                {
                  title: 'Rapid prototyping',
                  subtitle: '48 hours, one build',
                  points: [
                    "Built GreenWatch's full orchestration layer between frontend and on-device ML",
                    'Voice interface that filled paperwork through conversation and detected fatigue acoustically',
                    ['Won its track at ',
                      { label: 'SF Hacks 2026',
                        href: 'https://shipyardhq.tech/projects/15b5bc0b-021a-4e80-9e34-e5868362c3e3' },
                      ' for the use of VectorAI DB'],
                  ],
                },
                {
                  title: 'Field validation',
                  subtitle: 'Bringing it back',
                  points: [
                    "Tested GreenWatch directly with the mariners we'd interviewed",
                    "Presented the new operational workflow to students entering the industry",
                    "Learned the feature they wanted least was the one we'd built first",
                  ],
                },
              ],
              /* GreenWatch's internals, closing the phase that built it. */
              disclosure: {
                star: true,
                summary: 'GreenWatch, under the hood',
                hint: 'for technical reviewers',
                blocks: [
                {
                  type: 'ledger',
                  wide: true,
                  headers: ['Component', 'Why it mattered'],
                  rows: [
                    ['Conversation orchestrator', 'Managed session state and slot-filling across PDF and free-chat modes — decided what to ask next.'],
                    ['Schema-first log engine', 'Defined the output structure before building the engine, forcing clean contracts and preventing integration mismatches.'],
                    ['Adapter pattern for ExecuTorch', 'Decoupled orchestration from the C++ runner, enabling testing against a stub before ML was ready.'],
                    ['API and runner contracts', 'Integration ground truth used by all three subteams — UI, backend, ML runner.'],
                  ],
                  note: [
                    'All commits under ',
                    { label: 'StressDetector',
                      href: 'https://github.com/katsaliya/GreenWatch---1st-Place-at-SF-Hacks-2026-/tree/main/StressDetector/brains' },
                    '.',
                  ],
                },
              ],
              },
            },
            {
              title: 'Let the research kill the idea',
              lead: 'Their feedback was direct, and it told us exactly how \u201Cwellbeing\u201D would land with the people we\u2019d built it for. This was never about mental health \u2014 it was about efficiency. Remove the most painful part of someone\u2019s day, and you earn the right to be on their device.',
              decision: {
                rejected: { title: 'Wellness & monitoring', status: 'Rejected' },
                chosen: { title: 'Precision & efficiency', status: 'Chosen' },
              },
            },
            {
              title: 'Rebuild around what they actually needed, with them',
              lead: 'We repositioned the entire product around precision over wellness. I was reviewing every structural and interface decision with our interviewees weekly — from pinpointing the operational gaps we needed to close, to translating a design mariners would actually trust.',
              details: [
                {
                  title: 'Wireframe exploration',
                  subtitle: 'Finding the conversation',
                  art: 'wireframes',
                  artAlt: 'Six chat-screen wireframe explorations side by side',
                  points: [
                    'Wireframed chat layouts broadly before committing to one',
                    'Tested where shift status, context and the conversation itself should sit',
                    'Landed on the one screen the rest of the product hangs off',
                  ],
                },
                {
                  title: 'Visual direction',
                  subtitle: 'Between calm and tactile',
                  art: 'palettes',
                  artAlt: 'Two palette directions, Aqua and Sage, over a shared neutral ramp',
                  points: [
                    'Ran two complete palette directions before choosing one',
                    'Chose precision over softness: deep navy and electric blue',
                    'Set neutrals and gradients that hold on a dark screen at sea',
                  ],
                },
                {
                  title: 'Component system',
                  subtitle: 'Built to scale',
                  art: 'components',
                  artAlt: 'The component set the screens are built from',
                  points: [
                    'Solidified components once the direction held',
                    'Designed small pieces that recombine into new screens',
                  ],
                },
                {
                  title: 'Frontend build',
                  subtitle: 'From Figma to product',
                  points: [
                    'Built the frontend in React and TypeScript, AI-assisted through Claude Code and Cursor',
                    'Targeted technical revisions from my own engineering background',
                    'My role was knowing what to change and why, not writing every line from scratch',
                  ],
                  /* Sits with the build card because that is the card it
                     answers: you have just read how it was made, so this is
                     where "can I run it?" gets asked. */
                  note: {
                    text: 'BlueCore runs locally by design. Maritime logs are regulated records, and the deployment path for this sector keeps data on the vessel. To check out the voice-to-documentation feature, clone the repo from GitHub and follow the readme instructions to run.',
                    link: { label: 'View the repo', href: 'https://github.com/katsaliya' },
                  },
                },
              ],
            },
          ],
        },

        /* Shown, not narrated. Replaced a four-item walkthrough that
           explained each screen in a paragraph beside it — by this point the
           reader has been told what the product does three times over. The
           three phones arrive as one export, frames included, so nothing
           here draws a device or lays them out. */
        {
          type: 'figure',
          src: '/images/case-studies/bluecore-screens-trio.png',
          alt: 'Three BlueCore screens side by side: a watch conversation with the voice orb, the launch screen, and a mariner profile',
          contain: true,
        },
      ],
    },

    {
      id: 'outcome',
      label: 'Impact',
      title: 'For mariners',
      blocks: [
        {
          type: 'ledger',
          wide: true,
          headers: ['Dimension', 'Outcome'],
          rows: [
            ['Documentation time', '20\u201340 minute manual log entry reduced to under 4 minutes in demo \u2014 80% reduction'],
            ['Repetitive re-entry', 'Vessel, rank, route, date and watch window pre-filled automatically \u2014 zero manual re-entry for known fields'],
            ['Compliance coverage', 'Built around actual federal requirements \u2014 MARPOL 73/78 and USCG CG-4602A \u2014 not generic templates'],
            ['Data privacy', 'Fully on-device \u2014 no cloud, no data leaving the vessel, compliant with government-contracted maritime operations'],
            ['Recognition & validation', '1st place SF Hacks 2026 \u00B7 1st place SFSU inaugural Student AI Awards \u00B7 selected to present at SUGAR Network Expo at SAP Palo Alto by Deep Blue Foundation and d.School Paris'],
          ],
        },
      ],
    },

    /* The second half of the impact, and a separate section rather than a
       disclosure. What she learned is not supplementary to what the product
       changed — for a portfolio read by recruiters it is the half they are
       actually hiring, and a reader should not have to click to find it. */
    {
      id: 'takeaways',
      label: 'Key takeaways',
      title: 'For myself',
      blocks: [
        {
          type: 'cards',
          stack: true,
          noIndex: true,
          items: [
            {
              title: 'On AI as a tool',
              body: 'AI became the bridge between where my skills were and where the project needed them \u2014 accelerating my growth in Figma, introducing me to real development workflows through Cursor and Claude Code, and giving me the confidence to pick up Framer and GSAP mid-project and actually ship with them. What surprised me most was how much I learned in the process: rather than feeling like a cheat code, it became a crutch to move forward faster.',
            },
            {
              title: 'On research',
              body: 'You can\u2019t design for a culture you don\u2019t understand. Eight months of field research across vessels, schools and offices shaped every decision \u2014 from the visual identity to the feature set. The product only works because the research was honest enough to kill the first idea.',
            },
            {
              title: 'On scope',
              body: 'Knowing what to cut is as important as knowing what to build. Removing the wellbeing dashboard, narrowing to documentation, and leading with utility over care \u2014 those subtractive decisions defined the product more than any feature did.',
            },
          ],
        },
      ],
    },
  ],
}

/* ── Known ────────────────────────────────────────────────────────────── */

const PRINT_ITEMS = [
  '/known/print/flyer-car-show.png',
  '/known/print/welcome-print.png',
  ...Array.from({ length: 10 }, (_, i) => `/known/print/aps-${i + 1}.png`),
  ...Array.from({ length: 3 }, (_, i) => `/known/print/blind-match-${i + 1}.png`),
  ...Array.from({ length: 2 }, (_, i) => `/known/print/first-date-fund-${i + 1}.png`),
  ...Array.from({ length: 4 }, (_, i) => `/known/print/match-mixer-${i + 1}.png`),
  ...Array.from({ length: 2 }, (_, i) => `/known/print/sf-dating-${i + 1}.png`),
  ...Array.from({ length: 4 }, (_, i) => `/known/print/summer-i-${i + 1}.png`),
  ...Array.from({ length: 10 }, (_, i) => `/known/print/date-card-${i + 1}.png`),
  ...Array.from({ length: 5 }, (_, i) => `/known/print/playing-card-${i + 1}.png`),
]

export const KNOWN = {
  slug: 'known',
  title: 'Known',

  /* The real wordmark, so no font substitution is involved. */
  brand: {
    logo: '/images/case-studies/known-logo.png',
  },

  tagline: 'Brand voice for a Series A startup, built from nothing.',
  description:
    'Content, marketing materials and graphics for an AI-matchmaking startup — ' +
    'building a voice from the ground up and shipping across social, pitch and product.',

  /* The two profile links used to be a whole block of link cards. As a meta
     row they cost nothing and sit where a reader looks for the facts. */
  meta: [
    ['My role', 'Growth Associate (Promoted from intern)'],
    ['Timeline', 'June — October 2025'],
    ['Tools', 'CapCut, Final Cut Pro, Canva, Illustrator, Photoshop'],
    ['Channels', '@known and @celesteamadon on TikTok and Instagram'],
  ],

  /* The reel itself, not a logo — this case study is about editing, so the
     masthead shows the craft rather than a mark. Re-encoded from the 12.8MB
     card asset to 179KB. */
  motif: {
    video: '/video/known-hero-loop.mp4',
    poster: '/video/known-hero-loop-poster.jpg',
  },

  outro: {
    title: 'Where it lives',
    items: [
      { meta: 'TikTok', title: '@known', href: 'https://www.tiktok.com/@known' },
      { meta: 'TikTok', title: '@celesteamadon', href: 'https://www.tiktok.com/@celesteamadon' },
      { meta: 'Instagram', title: '@known', href: 'https://www.instagram.com/known' },
      { meta: 'Instagram', title: '@celesteamadon', href: 'https://www.instagram.com/celesteamadon' },
      { meta: 'Archive', title: 'More content & materials — full drive', href: 'https://drive.google.com/drive/u/0/folders/1H9y6vbSxJSMMf4cVOHMhbosSjQcYLcZx' },
    ],
  },

  movements: [
    { id: 'overview', number: '01', script: 'The', sans: 'overview', sections: ['overview'] },
    { id: 'approach', number: '02', script: 'My',  sans: 'approach', sections: ['system', 'work'] },
    { id: 'impact',   number: '03', script: 'The', sans: 'impact',   sections: ['outcome', 'takeaways'], tone: 'plum' },
  ],

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      bare: true,
      blocks: [
        {
          type: 'split',
          columns: [
            {
              label: 'Problem',
              blocks: [
                {
                  type: 'prose',
                  items: [
                    'Known had no social presence pre-launch and needed an audience before it had a product to sell.',
                    /* PLACEHOLDER — what made that hard. */
                    'At the start, we had nothing to work from — no audience, no structure, not even the accounts set up yet.',
                  ],
                },
                {
                  /* One block, two figures. `row` sets them side by side —
                     stacked, the second reads as a footnote to the first;
                     level, they read as a pair. */
                  type: 'stat',
                  row: true,
                  figure: '5K+',
                  claim: '\nuser growth over four months',
                  secondary: {
                    figure: '3M+',
                    claim: '\nimpressions across social platforms',
                  },
                },
              ],
            },
            {
              label: 'Solution',
              blocks: [
                {
                  type: 'prose',
                  items: [
                    'I helped shape the brand voice across TikTok and Instagram as content creator, strategist and graphic designer - and planned and executed weekly activations and events to build traction with the community',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'system',
      label: 'System',
      title: 'A weekly loop that made content repeatable.',
      blocks: [
        {
          type: 'journey',
          title: 'PLACEHOLDER — a title for the loop, in the register of BlueCore\u2019s.',
          label: 'The weekly content loop, from brief to iteration',
          phases: [
            {
              phase: 'Set up',
              tone: 'research',
              items: [
                { label: ['Brief and', 'platform audit'] },
                { label: ['Content pillar', 'definition'], key: true },
              ],
            },
            {
              phase: 'Produce',
              tone: 'prototype',
              items: [
                { label: ['Shoot and direct,', 'same-day turnaround'], key: true },
                { label: ['Edit in CapCut —', 'music, captions, pacing'], key: true },
              ],
            },
            {
              phase: 'Ship',
              tone: 'build',
              items: [
                { label: ['Post and', 'monitor'] },
                { label: ['Iterate on', 'performance'], key: true },
              ],
            },
          ],
        },

        {
          type: 'phases',
          items: [
            {
              title: 'Finding the voice',
              lead: 'The tone came from what the founder could actually do on camera. A written hook read as inauthentic from someone who is not a performer, so the script became the way she already talks. Two audiences turned up \u2014 people waiting for the app, and people there for the founder\u2019s life \u2014 so the content romanticised both, and led with an opinion rather than narrating what was already on screen.',
              details: [
                {
                  title: 'Day in my life',
                  subtitle: 'Humanise the founder',
                  points: [
                    'Built parasocial trust \u2014 the audience followed the founder\u2019s life, not only the product behind it',
                    'Reused footage rather than shooting fresh \u2014 only the script and the voiceover had to be specific to that day',
                    'Shot one core moment per day and recut general clips (GRWM, routine, commute) underneath it',
                  ],
                },
                {
                  title: 'Founder series',
                  subtitle: 'Establish credibility',
                  points: [
                    'Built credibility with users and potential partners for a pre-launch company',
                    'Leaned into the founder being a 21-year-old woman rather than playing it down \u2014 the position was the angle, not a caveat',
                    'Part of the audience came for the process, not the product \u2014 founder grind as motivation and guidance, especially in San Francisco',
                  ],
                },
              ],
            },
            {
              title: 'PLACEHOLDER — build the system',
              lead: 'PLACEHOLDER — the move from one-off posts to a repeatable weekly cadence, and what that changed.',
              details: [
                {
                  title: 'Events',
                  subtitle: 'Drive in-person signups',
                  points: [
                    'Turned online audience into community proof at real events',
                    'PLACEHOLDER — signups or attendance driven',
                  ],
                },
                {
                  title: 'PLACEHOLDER — editing style',
                  subtitle: 'PLACEHOLDER — what makes a cut read as Known',
                  points: [
                    'PLACEHOLDER — pacing, music, caption treatment',
                    'PLACEHOLDER — what you standardised so it could scale',
                  ],
                },
              ],
            },
            {
              title: 'PLACEHOLDER — scale what worked',
              lead: 'PLACEHOLDER — what the data changed, and the brand system that grew out of it across print and digital.',
              details: [
                {
                  title: 'PLACEHOLDER — what performed',
                  subtitle: 'Reading the numbers',
                  points: [
                    'PLACEHOLDER — the format that outperformed and why',
                    'PLACEHOLDER — what you stopped making',
                  ],
                },
                {
                  title: 'PLACEHOLDER — the brand grew',
                  subtitle: 'From feed to print',
                  points: [
                    'Same voice carried into flyers, date cards, playing cards and magazine spreads',
                    'PLACEHOLDER — how the system held up off-screen',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'work',
      label: 'The work',
      title: 'Forty-two pieces in four months.',
      blocks: [
        /* PLACEHOLDER — four short clips, autoplaying muted in a row, replace
           these text links. That row is the point of the case study: it shows
           the editing rather than describing it. Four cards all reading
           "Featured" prove nothing, and are here only so the links survive
           until the clips exist. */
        {
          type: 'links',
          kind: 'tiktok',
          items: [
            { label: 'PLACEHOLDER — name the post', href: 'https://www.tiktok.com/video/7541552580887907615/' },
            { label: 'PLACEHOLDER — name the post', href: 'https://www.tiktok.com/video/7548243888914353439/' },
            { label: 'PLACEHOLDER — name the post', href: 'https://www.tiktok.com/video/7520841844310199582/' },
            { label: 'PLACEHOLDER — name the post', href: 'https://www.tiktok.com/video/7532327613310831903/' },
          ],
        },

        {
          type: 'prose',
          items: [
            'Flyers, date cards, playing cards, event collateral and magazine spreads — the same voice carried off-screen.',
          ],
        },

        /* Curated to 28 of 42. Ten near-identical `aps` and ten `date-card`
           variations were half the run and crowded out the other eight kinds
           of work; three of each shows the range without the inventory. The
           full set is one click away in the outro. */
        {
          type: 'strip',
          items: [
            '/known/print/flyer-car-show.png',
            '/known/print/welcome-print.png',
            '/known/print/aps-1.png',
            '/known/print/aps-4.png',
            '/known/print/aps-8.png',
            '/known/print/blind-match-1.png',
            '/known/print/blind-match-2.png',
            '/known/print/blind-match-3.png',
            '/known/print/first-date-fund-1.png',
            '/known/print/first-date-fund-2.png',
            '/known/print/match-mixer-1.png',
            '/known/print/match-mixer-2.png',
            '/known/print/match-mixer-3.png',
            '/known/print/match-mixer-4.png',
            '/known/print/sf-dating-1.png',
            '/known/print/sf-dating-2.png',
            '/known/print/summer-i-1.png',
            '/known/print/summer-i-2.png',
            '/known/print/summer-i-3.png',
            '/known/print/summer-i-4.png',
            '/known/print/date-card-1.png',
            '/known/print/date-card-5.png',
            '/known/print/date-card-9.png',
            '/known/print/playing-card-1.png',
            '/known/print/playing-card-2.png',
            '/known/print/playing-card-3.png',
            '/known/print/playing-card-4.png',
            '/known/print/playing-card-5.png',
          ],
        },

        {
          type: 'disclosure',
          summary: 'Print files',
          hint: 'five PDFs, as sent to the printer',
          blocks: [
            {
              type: 'links',
              kind: 'file',
              items: [
                { label: 'Blind Match', detail: 'PDF', href: '/known/print/blind-match.pdf' },
                { label: 'Flyer prints', detail: 'PDF', href: '/known/print/flyer-prints.pdf' },
                { label: 'Flyer variation', detail: 'PDF', href: '/known/print/flyer-variation.pdf' },
                { label: 'Magazine print', detail: 'PDF', href: '/known/print/magazine-print.pdf' },
                { label: 'Post', detail: 'PDF', href: '/known/print/post-2.pdf' },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'outcome',
      label: 'Impact',
      title: 'For Known',
      noNumeral: false,
      blocks: [
        {
          /* PLACEHOLDER — every row. This table is what a recruiter reads
             first and it is the only part of the page that can carry a growth
             claim. Even rough figures beat none. */
          type: 'ledger',
          wide: true,
          headers: ['Dimension', 'Outcome'],
          rows: [
            ['Audience', 'PLACEHOLDER — followers gained across TikTok and Instagram, from zero'],
            ['Reach', 'PLACEHOLDER — total views over four months, and the best-performing post'],
            ['Community', 'PLACEHOLDER — event signups or attendance driven by content'],
            ['Output', '42 pieces of print and graphic collateral in four months'],
            ['Ownership', 'Sole content creator, strategist and graphic designer'],
          ],
        },
      ],
    },

    {
      id: 'takeaways',
      label: 'Key takeaways',
      title: 'For myself',
      blocks: [
        {
          type: 'cards',
          stack: true,
          noIndex: true,
          items: [
            {
              title: 'PLACEHOLDER — on voice',
              body: 'PLACEHOLDER — what you learned about finding a brand voice with no brand to start from.',
            },
            {
              title: 'PLACEHOLDER — on cadence',
              body: 'PLACEHOLDER — what a weekly loop bought you, and what it cost.',
            },
            {
              title: 'PLACEHOLDER — on range',
              body: 'PLACEHOLDER — carrying one voice across video, print and pitch, and what held it together.',
            },
          ],
        },
      ],
    },
  ],
}

export const CASE_STUDIES = { bluecore: BLUECORE, known: KNOWN }
