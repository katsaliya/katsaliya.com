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

export const KNOWN = {
  slug: 'known',
  title: 'Known',

  /* The real wordmark, so no font substitution is involved. */
  brand: {
    logo: '/images/case-studies/known-logo.png',
  },

  tagline: 'Brand voice for a Series A startup, built from nothing.',
  description:
    'Content, marketing and graphics for an AI-matchmaking startup — a brand voice built from nothing, by testing until it worked.',

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
      { meta: 'LinkedIn', title: 'Celeste Amadon', href: 'https://www.linkedin.com/in/celeste-amadon/' },
      { meta: 'Archive', title: 'More content & materials — full drive', href: 'https://drive.google.com/drive/u/0/folders/1H9y6vbSxJSMMf4cVOHMhbosSjQcYLcZx' },
    ],
  },

  movements: [
    { id: 'overview', number: '01', script: 'The', sans: 'overview', sections: ['overview', 'work'] },
    { id: 'approach', number: '02', script: 'My',  sans: 'approach', sections: ['system'] },
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
                    'Known needed an audience before it had a product to sell — and started with no followers, no playbook and no accounts set up.',
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
                    'I took on the content, strategy and design: found the brand’s voice, tested formats until the numbers moved, built a weekly system the team could sustain — and learned the tools as I needed them.',
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
      title: 'Testing until it worked',
      blocks: [
        {
          type: 'journey',
          title: 'Test, measure, keep what works',
          label: 'How the content loop was found: from daily posting to a sustainable weekly rhythm',
          phases: [
            {
              phase: 'Test',
              tone: 'research',
              items: [
                { label: ['Daily posting,', 'for as long as it held'] },
                { label: ['Formats, hooks,', 'lengths & tone'], key: true },
                { label: ['Editing styles', 'per series'] },
              ],
            },
            {
              phase: 'Measure',
              tone: 'prototype',
              items: [
                { label: ['Signups, RSVPs', '& follower growth'], key: true },
                { label: ['Week to week,', 'event to event'] },
              ],
            },
            {
              phase: 'Settle',
              tone: 'reposition',
              items: [
                { label: ['DIML, founder series', '& events rotation'], key: true },
                { label: ['Reuse footage', 'across accounts'] },
              ],
            },
            {
              phase: 'Scale',
              tone: 'build',
              items: [
                { label: ['High-fidelity', 'campaigns when needed'], key: true },
                { label: ['Trends handed', 'to the interns'] },
              ],
            },
          ],
        },

        {
          type: 'phases',
          items: [
            {
              title: 'Test everything',
              lead: 'With no playbook, I posted daily and kept changing the series, the edit, the hook, the length, and whether a piece played funny or serious — then kept what moved the numbers.',
              details: [
                {
                  title: 'What I tested',
                  subtitle: 'Formats, edits and tone',
                  points: [
                    'New founder series, like the dos and don’ts of a date',
                    'Editing styles, hooks, lengths, funny against serious',
                  ],
                },
                {
                  title: 'What we watched',
                  subtitle: 'Attention versus acquisition',
                  points: [
                    'Signups, RSVPs and follower growth, week to week and event to event',
                    'Attention and signups came from different content — so each got its own job',
                  ],
                },
              ],
            },
            {
              title: 'Find the voice',
              lead: 'The founder isn’t a performer, so the script became the way she already talks. Two audiences showed up — people waiting for the app, and people there for her life — and the content served both.',
              details: [
                {
                  title: 'Day in my life',
                  subtitle: 'Humanise the founder',
                  points: [
                    'One core moment a day, with recycled GRWM, routine and commute clips cut underneath',
                    'It clicked when it created FOMO: quick chops, plus one lesson or opinion unique to that day',
                  ],
                },
                {
                  title: 'Founder series',
                  subtitle: 'Establish credibility',
                  points: [
                    'A 21-year-old woman founder in San Francisco — the position was the angle, not a caveat',
                    'It clicked as out of pocket and silly but real, amplified with CapCut sound effects, text and stickers',
                  ],
                },
              ],
            },
            {
              title: 'Build a rhythm we could keep',
              lead: 'Daily posting wasn’t sustainable. I replaced it with a rotation — day in my life, founder series, events — shared across every account, with interns covering trends.',
              details: [
                {
                  title: 'Events',
                  subtitle: 'Drive in-person signups',
                  points: [
                    'Marketing and recaps made our events feel exclusive — like the whole city was going',
                  ],
                },
                {
                  title: 'Reuse and recycle',
                  subtitle: 'One shoot, many posts',
                  points: [
                    'Footage recut across all three series and every account',
                    'The time saved went into high-fidelity campaigns',
                  ],
                },
              ],
            },
          ],
        },

        {
          type: 'prose',
          items: [
            'Graphics for our events — flyers, date cards and playing cards.',
          ],
        },

        /* A selection, not the inventory — three of each repeated kind. The
           full drive is one click away in the outro. */
        {
          type: 'strip',
          items: [
            '/known/print/flyer-car-show.jpg',
            '/known/print/welcome-print.jpg',
            '/known/print/aps-4.jpg',
            '/known/print/aps-8.jpg',
            '/known/print/blind-match-1.jpg',
            '/known/print/blind-match-2.jpg',
            '/known/print/blind-match-3.jpg',
            '/known/print/first-date-fund-1.jpg',
            '/known/print/first-date-fund-2.jpg',
            '/known/print/match-mixer-1.jpg',
            '/known/print/match-mixer-2.jpg',
            '/known/print/match-mixer-3.jpg',
            '/known/print/match-mixer-4.jpg',
            '/known/print/sf-dating-1.jpg',
            '/known/print/sf-dating-2.jpg',
            '/known/print/summer-i-1.jpg',
            '/known/print/summer-i-2.jpg',
            '/known/print/summer-i-3.jpg',
            '/known/print/summer-i-4.jpg',
            '/known/print/date-card-1.jpg',
            '/known/print/date-card-5.jpg',
            '/known/print/date-card-9.jpg',
            '/known/print/playing-card-1.jpg',
            '/known/print/playing-card-2.jpg',
            '/known/print/playing-card-3.jpg',
            '/known/print/playing-card-4.jpg',
            '/known/print/playing-card-5.jpg',
          ],
        },
      ],
    },

    {
      id: 'work',
      label: 'The work',
      title: 'Featured work',
      blocks: [
        /* One clip per pillar of the rotation in the System section:
           founder, founder series, social, then an event from launch to
           recap. Re-encoded from the originals to 540px H.264 (~25MB for all
           five, from 107MB). No `href` — the accounts went private. */
        {
          type: 'reels',
          items: [
            { label: 'Founder intro', video: '/video/known-founder-intro.mp4', poster: '/video/known-founder-intro-poster.jpg' },
            { label: 'First Date Code, ep. 1', video: '/video/known-first-date-code-ep1.mp4', poster: '/video/known-first-date-code-ep1-poster.jpg' },
            { label: 'Summer series', video: '/video/known-summer-series.mp4', poster: '/video/known-summer-series-poster.jpg' },
            { label: '1000 Singles \u2014 soft launch', video: '/video/known-1000-singles-soft-launch.mp4', poster: '/video/known-1000-singles-soft-launch-poster.jpg', fit: 'contain' },
            { label: '1000 Singles \u2014 party recap', video: '/video/known-1000-singles-recap.mp4', poster: '/video/known-1000-singles-recap-poster.jpg' },
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
          type: 'ledger',
          wide: true,
          headers: ['Dimension', 'Outcome'],
          rows: [
            ['Audience', '10K+ followers across TikTok and Instagram, from zero'],
            ['Users', '5K+ user growth in four months'],
            ['Reach', '3M+ impressions across social platforms'],
            ['Ownership', 'Led day in my life, founder series and event content; promoted from intern to Growth Associate'],
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
              title: 'Test before you trust it',
              body: 'No format worked on the first try. Treating every post as an experiment \u2014 and reading signups next to followers \u2014 is what found the ones that did.',
            },
            {
              title: 'Consistent beats constant',
              body: 'Daily posting got attention but couldn\u2019t last. A rotation built on recycled footage kept us consistent and left room for bigger campaigns.',
            },
            {
              title: 'Learn it when the work needs it',
              body: 'Every new format asked for a new skill \u2014 a new edit, a new sound, a new print piece. I learned each one as the work called for it.',
            },
          ],
        },
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATES — the four studies that are not written yet

   Every card on the ring has to go somewhere. These four exist so that
   clicking them lands on a real page in the site's own shape rather than on
   a "coming soon" note: the masthead, the meta table, and the three
   movements the written studies use, with the prose still to come.

   WHY A FACTORY AND NOT FOUR OBJECTS. BLUECORE and KNOWN are ~300 lines
   each because they have real content; four more skeletons of that length,
   identical but for a handful of facts, would be four places to fix the
   same typo. The facts that differ are arguments; the shape is shared.

   WHEN ONE GETS WRITTEN, stop calling this and give it a literal object
   like BLUECORE's. The factory is scaffolding for the empty state, not a
   format to grow a real case study inside — the written ones diverge
   heavily in their blocks and should be free to.

   Every placeholder line is marked PLACEHOLDER, so a page that has not been
   filled in is obvious in the source and greppable.
   ═══════════════════════════════════════════════════════════════════════════ */

const templateStudy = ({ slug, title, tagline, meta, brand, intro }) => ({
  slug,
  title,
  brand,
  tagline,
  description: tagline,
  meta,
  movements: [
    { id: 'overview', number: '01', script: 'The', sans: 'overview', sections: ['overview'] },
    { id: 'approach', number: '02', script: 'My',  sans: 'approach', sections: ['approach'] },
    { id: 'impact',   number: '03', script: 'The', sans: 'impact',   sections: ['impact'], tone: 'plum' },
  ],
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      bare: true,
      blocks: [
        { type: 'prose', items: [intro, '/* PLACEHOLDER */ What the brief actually was, and what made it hard.'] },
      ],
    },
    {
      id: 'approach',
      label: 'My approach',
      blocks: [
        { type: 'prose', items: [
          '/* PLACEHOLDER */ How the work was done — the research, the decisions, and the one that mattered most.',
        ] },
      ],
    },
    {
      id: 'impact',
      label: 'The impact',
      blocks: [
        { type: 'prose', items: [
          '/* PLACEHOLDER */ What changed because of it, and what it is worth saying about the result.',
        ] },
      ],
    },
  ],
})

/* ── EMPORIUM THAI MARKET ─────────────────────────────────────────────────
   Written, so it is a literal object rather than a templateStudy() call —
   see the factory's note above. It diverges from the three-movement shape
   the templates use, which is the whole reason the factory says to stop
   calling it once a study has real content. */
export const EMPORIUM = {
  slug: 'emporium-thai-market',
  title: 'Emporium Thai Market',
  /* SET, NOT PLACED. The supplied logotype is a 17:1 strip, and
     .cs-brand--logo gives an image a fixed height with max-width: 100% —
     so the moment the strip is wider than the 58% column the width is
     clamped while the height is not, and the wordmark is literally
     squashed. Reproducing it as text removes the failure mode entirely
     and keeps the name selectable and scalable.

     DM Sans 500 is the match: of the families the site already loads it
     scored highest against the artwork on a glyph-overlap test, and its
     caps run 6.4% narrow against the original, which the tracking below
     puts back. #272160 is sampled from the artwork's ink. */
  brand: {
    font: "'DM Sans', sans-serif",
    weight: 500,
    color: '#272160',
    letterSpacing: '0.038em',
    uppercase: true,
  },
  /* The second location, as rendered. Cropped to the building — the
     export carried ~50px of empty canvas, and trimming it means the
     hero's height cap applies to the building rather than to blank space.
     The supplied cutout is already clean: no white fringe against a dark
     ground, and the gaps between the gable slats are genuinely
     transparent, so the page shows through them.

     No size or position override: the hero spacing is BlueCore's and
     every study shares it, and the motif holds the page margin by
     default — see the note in CaseStudy.jsx. */
  motif: { src: '/images/case-studies/emporium-storefront.webp' },
  tagline:
    'Brand, social and growth for a second restaurant on Sawtelle — built while the doors are open.',
  description:
    'Brand, social and growth for a second restaurant on Sawtelle — built while the doors are open.',
  meta: [
    ['Client', 'Emporium Thai LLC'],
    ['My role', 'Creative & Growth Lead'],
    ['Timeline', 'June 2026 — present'],
    ['Tools', 'Figma, CapCut, Adobe CC, Meta Business Suite, SwiftUI, Canva'],
  ],
  /* NOT THE THREE-ACT RETROSPECTIVE. overview -> approach -> impact is a
     shape for finished work, and this engagement started in June 2026 and
     is still running. So: what it is, the four workstreams side by side as
     sections of one movement, and the team being built to take them over.

     Kept short on purpose — each section is one or two sentences and the
     photos. Pieces with no photo yet (bag inserts, review cards, the
     colouring page, dish photography, the delivery listings) are left out
     rather than held open, and so are metrics until there are real ones. */
  movements: [
    { id: 'overview', number: '01', script: 'The', sans: 'overview', sections: ['overview'] },
    { id: 'work',     number: '02', script: 'The', sans: 'work',     sections: ['brand', 'socials', 'photobooth', 'growth'] },
    { id: 'plan',     number: '03', script: 'The', sans: 'plan',     sections: ['plan'], tone: 'plum' },
  ],
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      bare: true,
      blocks: [
        {
          type: 'prose',
          items: [
            'Emporium Thai has fed LA for 25+ years. Its second restaurant, Emporium Thai Market on Sawtelle, opened in January 2026, and I joined that summer to build its brand, social and growth from the ground up — while the doors were already open.',
          ],
        },
        {
          type: 'slot',
          wide: true,
          items: [{ src: '/images/case-studies/emporium/dining-room.jpg', label: 'The dining room on Sawtelle' }],
          ratio: '16 / 9',
        },
      ],
    },

    {
      id: 'brand',
      label: 'Brand',
      title: 'Two identities, one restaurant',
      blocks: [
        {
          type: 'prose',
          items: [
            'Dine-in is deep red and understated, to match the room — I turned down a louder pop-art menu because it looked cheap next to the interior. Online ordering gets a pop-art elephant herd, built to stand out on a phone.',
          ],
        },
        {
          type: 'slot',
          narrow: true,
          items: [{ src: '/images/case-studies/emporium/dine-in-menu.jpg', label: 'The dine-in and happy hour menus' }],
          ratio: '3 / 4',
        },
      ],
    },

    {
      id: 'socials',
      label: 'Social',
      title: 'A playbook anyone can post from',
      blocks: [
        {
          type: 'prose',
          items: [
            'Repeatable formats, voice rules and a weekly rhythm, so anyone on the team can pick up a post. Every event we cater or host doubles as a shoot.',
          ],
        },
        {
          type: 'reels',
          items: [
            { label: 'Mango sticky rice', video: '/video/emporium-mango-sticky-rice.mp4', poster: '/video/emporium-mango-sticky-rice-poster.jpg' },
            { label: 'Honey ribs', video: '/video/emporium-honey-ribs.mp4', poster: '/video/emporium-honey-ribs-poster.jpg' },
            { label: 'Event recap', video: '/video/emporium-event-recap.mp4', poster: '/video/emporium-event-recap-poster.jpg' },
          ],
        },
      ],
    },

    {
      id: 'photobooth',
      label: 'Photobooth',
      title: 'Something guests take home',
      blocks: [
        {
          type: 'prose',
          items: [
            'I designed and built a photobooth from scratch, so every visit leaves with a print that gets posted — and points back to us.',
          ],
        },
        {
          type: 'slot',
          items: [
            { src: '/images/case-studies/emporium/booth-front.jpg', label: 'The booth' },
            { src: '/images/case-studies/emporium/booth-app.jpg', label: 'The app, built at the bar' },
          ],
          ratio: '4 / 3',
        },
        {
          /* noIndex: three parts of one object, not three steps. */
          type: 'cards',
          noIndex: true,
          items: [
            { title: 'The booth', body: 'Built by hand to sit in the dining room.' },
            { title: 'The app', body: 'Runs the camera, with filters and effects that change with the seasons.' },
            { title: 'The strip', body: 'Printed on the spot on receipt paper — cheap enough to give away, with a look of its own.' },
          ],
        },
        {
          type: 'slot',
          items: [
            { src: '/images/case-studies/emporium/booth-build.jpg', label: 'The build' },
            { src: '/images/case-studies/emporium/booth-printing.jpg', label: 'A strip printing' },
            { src: '/images/case-studies/emporium/booth-strips-in-hand.jpg', label: 'Taken home' },
          ],
          ratio: '3 / 4',
        },
        {
          type: 'strip',
          caption: 'Strips from the booth',
          items: [
            '/images/case-studies/emporium/strip-1.jpg',
            '/images/case-studies/emporium/strip-2.jpg',
            '/images/case-studies/emporium/strip-3.jpg',
            '/images/case-studies/emporium/strip-4.jpg',
            '/images/case-studies/emporium/strip-5.jpg',
            '/images/case-studies/emporium/strip-6.jpg',
          ],
        },
      ],
    },

    {
      id: 'growth',
      label: 'Growth',
      title: 'Grow on the apps, move regulars to direct',
      blocks: [
        {
          type: 'cards',
          noIndex: true,
          items: [
            {
              title: 'Make the apps work harder',
              body: 'Reviews first, bundles and add-ons instead of deep discounts, clearer dish names for search, and a win-back offer for lapsed customers.',
            },
            {
              title: 'Move regulars to direct',
              body: 'A Square Online site, and a 10%-off pickup code in every bag — because the apps take a cut of every order.',
            },
          ],
        },
        {
          type: 'slot',
          wide: true,
          items: [{ src: '/images/case-studies/emporium/square-online.jpg', label: 'The Square Online storefront' }],
          ratio: '2000 / 1127',
        },
      ],
    },

    {
      id: 'plan',
      label: 'The team',
      title: 'A team, so the brand doesn’t depend on me',
      blocks: [
        {
          type: 'prose',
          items: [
            'The marketing team I’m building across both restaurants: four pods, each owning one metric reported weekly. It starts with one or two people on two-week trials, working alongside me.',
          ],
        },
        {
          type: 'cards',
          noIndex: true,
          items: [
            { title: 'Content & Social', body: 'Video, posts, and keeping the playbook current.' },
            { title: 'Community', body: 'Comments, DMs, reviews and reposts.' },
            { title: 'Events & Partnerships', body: 'Catering, collabs and local organisations.' },
            { title: 'Guerrilla & Outreach', body: 'Flyers, street-level ideas and email.' },
          ],
        },
        {
          type: 'statement',
          text: 'Year one: lines out the door from Instagram, a presence at LA food events, and one look from the feed to the dining room.',
        },
      ],
    },
  ],
}

export const ALLIED = templateStudy({
  slug: 'allied-global-marketing',
  title: 'Allied Global Marketing',
  tagline: 'Entertainment campaign work for a global agency.',
  brand: { font: "'DM Sans', sans-serif", weight: 700, color: '#55493c', letterSpacing: '-0.035em' },
  meta: [
    ['Client', 'Allied Global Marketing'],
    ['My role', '/* PLACEHOLDER */ Role'],
    ['Timeline', '/* PLACEHOLDER */ Dates'],
    ['Tools', '/* PLACEHOLDER */ Tools'],
  ],
  intro: '/* PLACEHOLDER */ One sentence on what the work was.',
})

export const AIDENTITY = templateStudy({
  slug: 'aidentity',
  title: 'AIdentity',
  tagline: 'Product design for an AI identity tool.',
  brand: { font: "'Unbounded', sans-serif", weight: 600, color: '#693E5E', letterSpacing: '-0.04em' },
  meta: [
    ['Client', '/* PLACEHOLDER */ Team or client'],
    ['My role', 'Product Design'],
    ['Timeline', '2026'],
    ['Tools', 'Figma, React'],
  ],
  intro: '/* PLACEHOLDER */ One sentence on what AIdentity is and what you made.',
})

export const KATSALIYA = templateStudy({
  slug: 'katsaliya',
  title: 'katsaliya.com',
  tagline: 'This site — React and Vite, GSAP riding a Lenis ticker, built end to end in Claude Code and Cursor.',
  brand: { font: "'Coneria Script Slanted', cursive", weight: 400, color: '#000000', letterSpacing: '-0.01em' },
  meta: [
    ['Client', 'Self-initiated'],
    ['My role', 'Design & Build'],
    ['Timeline', '2026'],
    ['Tools', 'React, Vite, GSAP, Lenis, three.js, Claude Code, Cursor'],
  ],
  intro: 'The portfolio you are reading. Designed and built end to end, with the whole process run through Claude Code and Cursor.',
})

export const CASE_STUDIES = {
  bluecore: BLUECORE,
  known: KNOWN,
  'emporium-thai-market': EMPORIUM,
  'allied-global-marketing': ALLIED,
  aidentity: AIDENTITY,
  katsaliya: KATSALIYA,
}
