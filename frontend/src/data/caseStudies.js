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
      title: 'Testing until it worked.',
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
      title: 'Featured work.',
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
    'Design, social and growth for a second restaurant on Sawtelle — built while the doors are open.',
  description:
    'Design, social and growth for a second restaurant on Sawtelle — built while the doors are open.',
  meta: [
    ['Client', 'Emporium Thai LLC'],
    ['My role', 'Creative & Growth Lead'],
    ['Timeline', 'June 2026 — present'],
    ['Tools', 'Figma, CapCut, Adobe CC, Meta Business Suite, SwiftUI, Canva'],
  ],
  /* NOT THE THREE-ACT RETROSPECTIVE. overview -> approach -> impact is a
     shape for finished work: it promises a problem, a method and a result,
     in that order and all in the past tense. This engagement started in
     June 2026 and is still running, so two of those three acts would have
     to be invented.

     The movements are the workstreams instead, because that is how the
     work is actually organised — five things running at once, each at a
     different stage, plus the team being built to take them over. Being
     visibly in progress is a position; imitating a finished case study
     and coming up short is not.

     The two "Where it stands" ledgers carry PLACEHOLDER values. They are
     the metrics only Kataliya can supply, and they are marked with the
     same token the unwritten template studies use so they stay
     greppable. */
  movements: [
    { id: 'overview',   number: '01', script: 'The', sans: 'overview' ,  sections: ['overview'] },
    { id: 'brand',      number: '02', script: 'The', sans: 'brand',      sections: ['brand'] },
    { id: 'socials',    number: '03', script: 'The', sans: 'socials',    sections: ['socials'] },
    { id: 'photobooth', number: '04', script: 'The', sans: 'photobooth', sections: ['photobooth'] },
    { id: 'growth',     number: '05', script: 'The', sans: 'growth',     sections: ['growth'] },
    { id: 'plan',       number: '06', script: 'The', sans: 'plan',       sections: ['plan'], tone: 'plum' },
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
            'Emporium Thai opened its second restaurant, Emporium Thai Market on Sawtelle, in January 2026. I joined a few months later to build a brand around it. The restaurant was already trading — my job was not to fix it, but to give it the structure to grow on its own.',
            'My work sits where design, social and growth meet: how the brand looks, how it shows up online, and how that turns into orders and people through the door. All of it is being built while the doors are open, so what follows is where each piece stands now, not a finished account.',
          ],
        },
        {
          type: 'slot',
          wide: true,
          label: 'The room on Sawtelle',
          note: 'One wide establishing shot of the dining room, lit as it actually is in service. This is the thing every other decision on the page is matched to.',
          ratio: '16 / 9',
        },
      ],
    },
    {
      id: 'brand',
      label: 'Brand and graphic design',
      blocks: [
        {
          type: 'prose',
          items: [
            'The brand runs on two identities. The dine-in side is deep red and deliberately understated, to match the room — I turned down a louder pop-art menu direction because it looked cheap next to the interior. The online ordering side uses a brighter pop-art elephant herd, built to stand out on a phone screen.',
            'From there I designed the pieces customers actually handle.',
          ],
        },
        {
          type: 'slot',
          items: [
            {
              label: 'Dine-in identity',
              note: 'The deep red system as it appears in the room — menu cover, type, the restrained palette.',
            },
            {
              label: 'Online-ordering identity',
              note: 'The pop-art elephant herd as it appears on a phone. Shown at phone scale, since that is the argument.',
            },
          ],
          ratio: '4 / 5',
          caption: 'Side by side, because the two-identity decision is the one that needs showing rather than telling',
        },
        {
          type: 'ledger',
          headers: ['Piece', 'What it carries'],
          rows: [
            ['Dine-in menu', 'With a separate lunch menu'],
            ['To-go bag inserts', 'A direct-ordering discount code'],
            ['Review cards', 'Dropped into delivery bags'],
            ['Colouring page', 'For families with kids'],
          ],
        },
        {
          type: 'slot',
          items: [
            { label: 'Dine-in menu', note: 'Flat scan or a shot on the table.' },
            { label: 'To-go bag insert', note: 'The discount code legible.' },
            { label: 'Review card', note: 'As it sits in a delivery bag.' },
            { label: 'Colouring page', note: 'Ideally in use, crayons and all.' },
          ],
          ratio: '4 / 5',
        },
        {
          type: 'stat',
          figure: '55',
          claim: ' delivery menu photos art-directed to one house look',
        },
        {
          type: 'prose',
          items: [
            'Black background, vintage china, orchids — so the menu reads as one brand instead of a mix of old shoots.',
          ],
        },
        {
          type: 'slot',
          wide: true,
          label: 'Dish photography',
          count: 4,
          note: 'Four of the 55, square-cropped as the delivery apps show them. If any old shots survive, one before/after pair would make the point faster than four new ones.',
          ratio: '1 / 1',
        },
        {
          type: 'ledger',
          eyebrow: 'Where it stands',
          rows: [
            ['Menu photos reshot', '55 of 55'],
            ['Pieces in circulation', '/* PLACEHOLDER */'],
            ['Discount-code redemptions from bag inserts', '/* PLACEHOLDER */'],
            ['Reviews attributable to the review card', '/* PLACEHOLDER */'],
          ],
        },
      ],
    },
    {
      id: 'socials',
      label: 'Social media',
      blocks: [
        {
          type: 'prose',
          items: [
            'Social was the first piece I took on, and the challenge was making it last. I studied how Kei Concepts and Nude Project run content across a team, and built a playbook from it: a library of repeatable formats — how to eat a dish, process to result, the family kitchen — plus brand voice rules and a weekly rhythm, so anyone on the team can pick up a post.',
            'Events are treated as content shoots. Our catering appearance at LA Magazine’s The Food Event became a recap reel and a run of posts out of one night.',
          ],
        },
        {
          type: 'slot',
          items: [
            { label: 'How to eat a dish', note: 'One frame, or the cover of the reel.' },
            { label: 'Process to result', note: 'Same format, different dish.' },
            { label: 'The family kitchen', note: 'The one that carries the story.' },
          ],
          ratio: '9 / 16',
          caption: 'One frame from each repeatable format — the library is the deliverable, so it has to be visible',
        },
        {
          type: 'slot',
          items: [
            { label: 'The playbook itself', note: 'A spread or two from the document: the calendar grid and the voice rules. This is what makes it a system rather than a feed.', ratio: '4 / 3' },
            { label: 'The Food Event', note: 'Catering stand, or the recap reel cover.', ratio: '4 / 3' },
          ],
        },
        {
          type: 'ledger',
          eyebrow: 'Where it stands',
          rows: [
            ['Followers, start to now', '/* PLACEHOLDER */'],
            ['Posting cadence, before and after the playbook', '/* PLACEHOLDER */'],
            ['Best-performing post', '/* PLACEHOLDER */'],
            ['Saves and shares', '/* PLACEHOLDER */'],
            ['Reach on the event recap', '/* PLACEHOLDER */'],
            ['Profile visits to website taps', '/* PLACEHOLDER */'],
          ],
        },
      ],
    },
    {
      id: 'photobooth',
      label: 'The photobooth',
      blocks: [
        {
          type: 'prose',
          items: [
            'I wanted guests to leave with something they could keep and share — something that ties back to us every time it is posted. So I designed and built a photobooth for Emporium Thai Market from scratch.',
          ],
        },
        {
          type: 'slot',
          wide: true,
          label: 'The booth in the dining room',
          note: 'In place, in service, with people using it. The hero shot of this section — it is the one thing on the page that physically exists and that nobody else has.',
          ratio: '16 / 9',
        },
        {
          /* noIndex: three parts of one object, not three steps. */
          type: 'cards',
          noIndex: true,
          items: [
            {
              title: 'The booth',
              body: 'I built the box by hand to sit in the dining room.',
            },
            {
              title: 'The app',
              body: 'It runs the camera and lets us swap filters and effects, so the booth can change with the seasons.',
            },
            {
              title: 'The strip',
              body: 'A thermal receipt printer prints each strip on the spot, in a layout I designed and can update whenever I like.',
            },
          ],
        },
        {
          type: 'prose',
          items: [
            'Receipt paper keeps each print cheap enough to give away, and it gives the strip a look of its own. The result is something people take home, put on Instagram, and come back for when the next season’s design drops.',
          ],
        },
        {
          type: 'slot',
          items: [
            { label: 'The box', note: 'The build — ideally one in-progress shot as well as the finished cabinet.' },
            { label: 'The app', note: 'A screen capture mid-session, filters visible.' },
            { label: 'The strips', note: 'Several real prints, overlapped. Show the seasonal variants together if more than one exists.' },
          ],
          ratio: '4 / 5',
        },
        {
          type: 'ledger',
          eyebrow: 'Where it stands',
          rows: [
            ['Strips printed since launch', '/* PLACEHOLDER */'],
            ['Posts and stories tagging the booth', '/* PLACEHOLDER */'],
            ['Seasonal strip designs shipped', '/* PLACEHOLDER */'],
            ['Cost per strip', '/* PLACEHOLDER */'],
          ],
        },
      ],
    },
    {
      id: 'growth',
      label: 'Marketing growth',
      blocks: [
        {
          type: 'prose',
          items: [
            'Delivery apps take a cut of every order, so growth meant two things at once.',
          ],
        },
        {
          type: 'cards',
          noIndex: true,
          items: [
            {
              title: 'Make the apps work harder',
              body: 'A reviews-first plan, bundles and add-ons in place of deep discounts, clearer dish names for search, and a win-back offer for lapsed customers.',
            },
            {
              title: 'Move regulars to direct',
              body: 'A Square Online site, and a 10%-off pickup code that goes home in every bag.',
            },
          ],
        },
        {
          type: 'slot',
          items: [
            { label: 'A delivery-app listing', note: 'The refreshed photography and dish names in situ, as a customer meets them.', ratio: '9 / 16' },
            { label: 'The Square Online storefront', note: 'The direct-ordering site.', ratio: '16 / 10' },
          ],
        },
        {
          type: 'ledger',
          eyebrow: 'Where it stands',
          rows: [
            ['Sales change, period over period', '/* PLACEHOLDER */'],
            ['Delivery-app rating, before and now', '/* PLACEHOLDER */'],
            ['Review volume', '/* PLACEHOLDER */'],
            ['Share of orders now direct', '/* PLACEHOLDER */'],
            ['Redemptions of the 10% pickup code', '/* PLACEHOLDER */'],
            ['Repeat-order rate', '/* PLACEHOLDER */'],
          ],
        },
      ],
    },
    {
      id: 'plan',
      label: '310table: the plan',
      blocks: [
        {
          type: 'prose',
          items: [
            '310table is the marketing team I am building to run across both restaurants, so the brand does not depend on me.',
            'The brand works in layers. Emporium Thai is the umbrella that lives online, carrying the family story, our Southern Thai roots and the elephant. Market and Cuisine each keep their own look in person.',
            'The team is organised into four pods, borrowed from a growth internship I did at a startup.',
          ],
        },
        {
          type: 'cards',
          noIndex: true,
          items: [
            { title: 'Content & Social', body: 'Video, posts, and keeping the playbook current.' },
            { title: 'Community', body: 'Comments, DMs, reviews, and customer reposts.' },
            { title: 'Events & Partnerships', body: 'Catering, collabs, and local organisations.' },
            { title: 'Guerrilla & Outreach', body: 'Flyers, street-level ideas, and email.' },
          ],
        },
        {
          type: 'prose',
          items: [
            'Each pod owns one metric and reports it weekly. I am starting with one or two people on two-week trials, working alongside them rather than managing from above. We are also turning a space above the Westwood restaurant into the team’s workroom.',
          ],
        },
        {
          type: 'ledger',
          eyebrow: 'The number each pod reports',
          headers: ['Pod', 'Its one metric'],
          rows: [
            ['Content & Social', '/* PLACEHOLDER */'],
            ['Community', '/* PLACEHOLDER */'],
            ['Events & Partnerships', '/* PLACEHOLDER */'],
            ['Guerrilla & Outreach', '/* PLACEHOLDER */'],
          ],
        },
        {
          type: 'slot',
          items: [
            { label: 'The brand layers', note: 'Emporium Thai as the online umbrella, Market and Cuisine under it. A drawn diagram, not a photo — this is the part of the plan that is hardest to say in a sentence.', ratio: '4 / 3' },
            { label: 'The workroom above Westwood', note: 'As it is now, before the fit-out.', ratio: '4 / 3' },
          ],
        },
        {
          type: 'statement',
          text: 'Year one: lines out the door driven by Instagram, a presence at LA food and entertainment events, and one coherent look from the feed to the dining room.',
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
