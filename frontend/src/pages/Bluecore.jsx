import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import '../styles/bluecore.css'

const SECTIONS = ['context','problem','research','process','solution','nextsteps','takeaways','learnmore']

/* ── Orb SVG (wireframe rings, Figma "OrbLogo") ── */
function OrbRings({ color = '#E7F1FF', size = 290, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 290 290" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className} style={style}>
      <ellipse cx="145" cy="145" rx="130" ry="130" stroke={color} strokeWidth="2.32" opacity="0.6" />
      <ellipse cx="145" cy="145" rx="130" ry="60"  stroke={color} strokeWidth="1.74" opacity="0.4" />
      <ellipse cx="145" cy="145" rx="130" ry="95"  stroke={color} strokeWidth="1.74" opacity="0.4" />
      <ellipse cx="145" cy="145" rx="118" ry="130" stroke={color} strokeWidth="1.74" opacity="0.35" />
      <line x1="145" y1="15"  x2="145" y2="275" stroke={color} strokeWidth="1.74" opacity="0.5" />
      <line x1="15"  y1="145" x2="275" y2="145" stroke={color} strokeWidth="1.74" opacity="0.5" />
    </svg>
  )
}

/* ── Phone frame (simplified for feature sections) ── */
function PhoneDemo({ screenImg, screenColor = '#0c1a35' }) {
  return (
    <div className="bc-demo-card">
      <div className="bc-demo-glow" />
      <OrbRings color="#4B82C3" size={290} className="bc-demo-orb bc-demo-orb--small" />
      <div className="bc-demo-phone">
        <img
          className="bc-phone-frame-img"
          src="/images/assets/phone-frame.png"
          alt=""
        />
        <div className="bc-demo-screen">
          {screenImg
            ? <img src={screenImg} alt="" />
            : <div className="bc-demo-screen--placeholder" style={{ background: `linear-gradient(160deg, #0c1a35 0%, ${screenColor} 100%)` }} />
          }
        </div>
      </div>
      <OrbRings color="#4B82C3" size={323} className="bc-demo-orb bc-demo-orb--large" />
    </div>
  )
}

export default function Bluecore() {
  const sidenavRef      = useRef(null)
  const bannerFrameRef  = useRef(null)
  const [activeSection, setActiveSection] = useState('context')

  useEffect(() => {
    document.body.className = 'page-light-body page-case-study'
    window.scrollTo(0, 0)
    return () => { document.body.className = '' }
  }, [])

  /* ── Scrollspy: highlight whichever section's label has passed the nav anchor ── */
  useEffect(() => {
    const getNavTop = () => {
      const first = sidenavRef.current?.querySelector('a')
      return first ? first.getBoundingClientRect().top : 30
    }

    const onScroll = () => {
      const navTop = getNavTop()
      let current = SECTIONS[0]
      for (const id of SECTIONS) {
        const label = document.querySelector(`#${id} .bc-label`)
        if (!label) continue
        if (label.getBoundingClientRect().top <= navTop + 4) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Banner drag-to-scroll ── */
  useEffect(() => {
    const frame = bannerFrameRef.current
    if (!frame) return
    let isDown = false, startX = 0, scrollLeft = 0

    const onDown = (e) => {
      isDown = true
      frame.classList.add('is-dragging')
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - frame.offsetLeft
      scrollLeft = frame.scrollLeft
    }
    const onUp = () => { isDown = false; frame.classList.remove('is-dragging') }
    const onMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - frame.offsetLeft
      frame.scrollLeft = scrollLeft - (x - startX) * 1.4
    }

    frame.addEventListener('mousedown', onDown)
    frame.addEventListener('mouseleave', onUp)
    frame.addEventListener('mouseup', onUp)
    frame.addEventListener('mousemove', onMove)
    frame.addEventListener('touchstart', onDown, { passive: true })
    frame.addEventListener('touchend', onUp)
    frame.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      frame.removeEventListener('mousedown', onDown)
      frame.removeEventListener('mouseleave', onUp)
      frame.removeEventListener('mouseup', onUp)
      frame.removeEventListener('mousemove', onMove)
      frame.removeEventListener('touchstart', onDown)
      frame.removeEventListener('touchend', onUp)
      frame.removeEventListener('touchmove', onMove)
    }
  }, [])

  /* ── Scroll entrance animations for banner + sections ── */
  useEffect(() => {
    const els = document.querySelectorAll('.bc-banner, .bc-section')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* ── Click: scroll so the section's bc-label aligns with the CONTEXT line ── */
  const handleNavClick = useCallback((e, id) => {
    e.preventDefault()
    const label = document.querySelector(`#${id} .bc-label`)
    if (!label) return
    const navTop  = sidenavRef.current?.querySelector('a')?.getBoundingClientRect().top ?? 30
    const labelTop = label.getBoundingClientRect().top
    window.scrollTo({ top: window.scrollY + labelTop - navTop, behavior: 'smooth' })
    setActiveSection(id)
  }, [])

  return (
    <>
      <div className="site-wrapper">
        <Nav />
        <main className="bc-page">

          {/* ── HERO ── */}

          <div className="bc-hero">
            <div className="bc-awards">
              <span className="bc-award">🥇 1st Place @ SF HACKS 2026</span>
              <span className="bc-award">🥇 1st Place @ SFSU&rsquo;S STUDENT AI AWARDS 2026</span>
            </div>
            <h1 className="bc-title">BlueCore: AI Paperwork Automation</h1>
            <p className="bc-description">
              A voice-first maritime documentation tool crafted for the SUGAR Network for Design Innovation,
              a global innovation collaboration program focused on human-centered design.
              Shoutout to d.School Paris and the Deep Blue Foundation.
            </p>
            <div className="bc-meta">
              <div className="bc-meta-item">
                <span className="bc-meta-label">ROLE</span>
                <span className="bc-meta-value">Product Design &amp; Engineer Lead</span>
              </div>
              <div className="bc-meta-item">
                <span className="bc-meta-label">TIMELINE</span>
                <span className="bc-meta-value">September 2025 – Present</span>
              </div>
              <div className="bc-meta-item">
                <span className="bc-meta-label">CLIENT</span>
                <span className="bc-meta-value">Mariners (Engineers, Deck Crew, Captains, Operators)</span>
              </div>
              <div className="bc-meta-item">
                <span className="bc-meta-label">TOOLS</span>
                <span className="bc-meta-value">Figma, Figma Make, React, TypeScript, Claude, Cursor</span>
              </div>
            </div>
          </div>

          {/* ── BANNER ── */}
          <div className="bc-banner">
            <div className="bc-banner-frame" ref={bannerFrameRef}>
              <img className="bc-banner-demo" src="/images/case-studies/bluecore-banner-demo.png" alt="BlueCore app demo" />
            </div>
          </div>

          {/* ── BODY: sidebar + content ── */}
          <div className="bc-body-layout">

            {/* Sidebar nav */}
            <aside className="bc-sidebar">
              <nav className="bc-sidenav" ref={sidenavRef}>
                {[
                  ['context',   'CONTEXT'],
                  ['problem',   'THE PROBLEM'],
                  ['research',  'THE RESEARCH'],
                  ['process',   'PROCESS + KEY INSIGHTS'],
                  ['solution',  'THE SOLUTION'],
                  ['nextsteps', 'NEXT STEPS'],
                  ['takeaways', 'TAKEAWAYS'],
                  ['learnmore', 'LEARN MORE'],
                ].map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={activeSection === id ? 'active' : ''}
                    onClick={e => handleNavClick(e, id)}
                  >{label}</a>
                ))}
              </nav>
              <Link to="/" className="bc-back-link">← BACK</Link>
            </aside>

            <div className="bc-divider" />

            {/* ── SECTIONS ── */}
            <div className="bc-sections">

              {/* CONTEXT */}
              <section id="context" className="bc-section">
                <span className="bc-label">CONTEXT</span>
                <p className="bc-body-text">
                  The Deep Blue Foundation — a French think tank — brought our team on in partnership
                  with d.School Paris, to pose a deceptively simple question:
                </p>
                <blockquote className="bc-question">
                  How do we make the mariner workforce more attractive — not for recruitment, but for longevity?
                </blockquote>
                <p className="bc-body-text">
                  Inspired by how little technology has been built for the people keeping global trade moving,
                  we wanted to design something that felt like it belonged at sea — not software imported from
                  a boardroom. BlueCore was built around a single moment: a crew member at the end of a long
                  shift, with one last thing standing between them and rest. We wanted to make that moment effortless.
                </p>
              </section>

              {/* THE PROBLEM */}
              <section id="problem" className="bc-section">
                <span className="bc-label">THE PROBLEM</span>
                <p className="bc-body-text">
                  The maritime industry is quietly losing its workforce — not to layoffs, but to burnout
                  and disconnection. Newer generation mariners enter the field and leave within 5 years.{' '}
                  <strong><em>Not because the work isn&rsquo;t meaningful, but because the conditions make it hard to stay.</em></strong>
                </p>
              </section>

              {/* THE RESEARCH */}
              <section id="research" className="bc-section">
                <span className="bc-label">THE RESEARCH</span>
                <h2 className="bc-stat-big">
                  <span className="bc-blue-text">90%</span>{' '}
                  <span className="bc-navy-text">of world trade<br />moves by sea.</span>
                </h2>

                <div className="bc-research-split">
                  <div className="bc-research-img">
                    <img src="/images/case-studies/bluecore-research-ship.png" alt="Abandoned maritime vessel" />
                  </div>
                  <div className="bc-research-right">
                    <p className="bc-research-intro">Yet as of 2024,</p>
                    <p className="bc-research-display">
                      <span className="bc-navy-text">only </span>
                      <span className="bc-blue-text">28%</span>
                      <span className="bc-navy-text"> of maritime crews have </span>
                      <span className="bc-blue-text">fully let paper<br />logbooks behind.</span>
                    </p>
                  </div>
                </div>

                <div className="bc-research-split">
                  <p className="bc-research-interviews">
                    Across<br />50+<br />stakeholder interviews<br />
                    with captains, deck crew, engineers,<br />
                    ship companies, and navy veterans
                  </p>
                  <div className="bc-research-img">
                    <img src="/images/case-studies/bluecore-research-img.png" alt="Stakeholder interviews" />
                  </div>
                </div>

                <div className="bc-stat-large">
                  <span className="bc-stat-line">
                    <span className="bc-blue-text">70%</span>
                    <span className="bc-navy-text"> mentioned paperwork</span>
                  </span>
                  <span className="bc-stat-and">and</span>
                  <span className="bc-stat-line">
                    <span className="bc-blue-text">30%</span>
                    <span className="bc-navy-text"> explicitly linked paperwork to fatigue</span>
                  </span>
                </div>
              </section>

              {/* PROCESS + KEY INSIGHTS */}
              <section id="process" className="bc-section">
                <span className="bc-label">THE PROCESS + KEY INSIGHTS</span>
                <p className="bc-body-text">
                  I co-led product strategy, research, and design — 8 months of desk research, field
                  interviews, and on-site visits, mapping the gap between what the industry demands
                  and what tools actually exist to support that.
                </p>

                <div className="bc-photo-row">
                  <div className="bc-photo">
                    <img src="/images/case-studies/bluecore-photo-row-1.png" alt="Field research" />
                  </div>
                  <div className="bc-photo">
                    <img src="/images/case-studies/bluecore-photo-row-2.png" alt="Field research" />
                  </div>
                  <div className="bc-photo">
                    <img src="/images/case-studies/bluecore-photo-row-3.png" alt="Field research" />
                  </div>
                </div>

                <div className="bc-sfhacks">
                  <div className="bc-sfhacks-text">
                    <p className="bc-body-text" style={{ marginBottom: 24 }}>
                      Mid-research, we jumped into SF Hacks 2026. Because we had 72 hours and a
                      constrained toolset, we jumped straight to high-fidelity — no time for detailed
                      front-end work. My role focused on backend and risk logic engineering.
                    </p>
                    <p className="bc-body-text" style={{ marginBottom: 24 }}>
                      What came out was GreenWatch AI, an AI-powered voice interface that filled
                      paperwork through conversation, detected crew fatigue through acoustic patterns,
                      and responded to distress the way a therapist would.{' '}
                      <a href="#learnmore" style={{ color: 'var(--bc-link)' }}>For more info click here</a>,
                      or feel free to reach out!
                    </p>
                    <div className="bc-devpost-links">
                      <a href="#learnmore">Devpost ↗</a>
                      <a href="#learnmore">Github ↗</a>
                    </div>
                  </div>
                  <div className="bc-sfhacks-visual">
                    <figure className="bc-greenwatch-figure">
                      <div className="bc-greenwatch-bg">
                        <img src="/images/case-studies/bluecore-sfhacks-bg.png" alt="" />
                      </div>
                      <img className="bc-greenwatch-person" src="/images/case-studies/bluecore-sfhacks-person.png" alt="GreenWatch AI at SF Hacks 2026" />
                    </figure>
                  </div>
                </div>

                <p className="bc-greenwatch-note">
                  It won 1st place for HCL&rsquo;s Actian VectorAI DB track. But when we brought it back
                  to our interviewees, their feedback revealed gaps we hadn&rsquo;t fully solved for yet.
                </p>

                <div className="bc-ki-grid">
                  <div className="bc-ki-card">
                    <span className="bc-ki-label">KEY INSIGHT #1</span>
                    <h3 className="bc-ki-title">Monitoring threatens autonomy.</h3>
                    <p className="bc-ki-body">
                      Flagging fatigue to management risks crew schedules and control.
                      It&rsquo;s a threat, not a feature.
                    </p>
                  </div>
                  <div className="bc-ki-card">
                    <span className="bc-ki-label">KEY INSIGHT #2</span>
                    <h3 className="bc-ki-title">Wellbeing can&rsquo;t be the pitch.</h3>
                    <p className="bc-ki-body">
                      Maritime workers are self-sufficient and skeptical of anything that reads as soft.
                      Positioning kills adoption before the product gets a chance.
                    </p>
                  </div>
                  <div className="bc-ki-card">
                    <span className="bc-ki-label">KEY INSIGHT #3</span>
                    <h3 className="bc-ki-title">We weren&rsquo;t qualified to consult.</h3>
                    <p className="bc-ki-body">
                      Without clinical expertise, a chatbot assessing mental state isn&rsquo;t a feature
                      — it&rsquo;s a liability.
                    </p>
                  </div>
                  <div className="bc-ki-card">
                    <span className="bc-ki-label">KEY INSIGHT #4</span>
                    <h3 className="bc-ki-title">Efficiency is the real entry point.</h3>
                    <p className="bc-ki-body">
                      Eliminate the most painful part of their day and you earn the right to be on their
                      device. Wellbeing follows utility — not the other way around.
                    </p>
                  </div>
                </div>
              </section>

              {/* THE SOLUTION */}
              <section id="solution" className="bc-section">
                <span className="bc-label">THE SOLUTION</span>

                <div className="bc-visual-identity">
                  <div className="bc-visual-text">
                    <h2 className="bc-section-heading">Visual Identity</h2>
                    <p className="bc-body-text">
                      BlueCore&rsquo;s visual identity pairs deep navy with electric blue, centered around
                      an animated wireframe orb that breathes and responds to voice — designed to signal
                      precision and intelligence, not wellness or softness.
                    </p>
                  </div>
                  <div className="bc-visual-img">
                    <img src="/images/case-studies/bluecore-visual-identity.png" alt="BlueCore visual identity" />
                  </div>
                </div>

                {/* FEATURE 1 */}
                <div className="bc-feature">
                  <span className="bc-feature-label">FEATURE #1: A VOICE THAT KNOWS YOUR WATCH</span>
                  <h2 className="bc-section-heading">Your orb is <span className="bc-blue-text">your co-pilot.</span></h2>
                  <div className="bc-feature-layout">
                    <div className="bc-feature-demo">
                      <PhoneDemo screenImg="/images/case-studies/bluecore-screen-feature1.png" />
                    </div>
                    <div className="bc-feature-text">
                      <p className="bc-body-text">
                        Vessel, role, watch window, and voyage context — all detected before you even say a
                        word. Tap to speak, and BlueCore handles the rest.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FEATURE 2 */}
                <div className="bc-feature">
                  <span className="bc-feature-label">FEATURE #2: KNOW WHAT NEEDS TO BE DONE</span>
                  <h2 className="bc-section-heading">Your document queue.<br /><span className="bc-blue-text">Always one tap away.</span></h2>
                  <div className="bc-feature-layout">
                    <div className="bc-feature-demo">
                      <PhoneDemo screenImg="/images/case-studies/bluecore-screen-feature2.png" />
                    </div>
                    <div className="bc-feature-text">
                      <p className="bc-body-text">
                        Assigned logs, overdue entries, and in-progress forms — organized and ready before
                        your watch ends. Known information is already filled. What&rsquo;s left becomes a
                        conversation — and when it&rsquo;s done, your document is signed and ready to export.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FEATURE 3 */}
                <div className="bc-feature">
                  <span className="bc-feature-label">FEATURE #3: NOTHING GETS LOST</span>
                  <h2 className="bc-section-heading bc-section-heading--bold">Your paper trail, <span className="bc-blue-text">always on record.</span></h2>
                  <div className="bc-feature-layout">
                    <div className="bc-feature-demo">
                      <PhoneDemo screenImg="/images/case-studies/bluecore-screen-feature3.png" />
                    </div>
                    <div className="bc-feature-text">
                      <p className="bc-body-text">
                        Every completed log, every in-progress entry — stored, reviewable, and exportable
                        whenever you need it. Pick up where you left off or pull a submission from three
                        voyages ago.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FEATURE 4 */}
                <div className="bc-feature">
                  <span className="bc-feature-label">FEATURE #4: BUILT FOR THE WHOLE PERSON</span>
                  <h2 className="bc-section-heading">Your world doesn&rsquo;t stop when you&rsquo;re at sea.</h2>
                  <div className="bc-feature-layout">
                    <div className="bc-feature-demo">
                      <PhoneDemo screenImg="/images/case-studies/bluecore-screen-feature4.png" />
                    </div>
                    <div className="bc-feature-text">
                      <p className="bc-body-text">
                        Layer your own plans on top of your assigned schedule so your day feels like yours,
                        not just the vessel&rsquo;s. Your news feed surfaces the stories and moments that
                        matter to you personally.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* NEXT STEPS */}
              <section id="nextsteps" className="bc-section">
                <span className="bc-label">WHAT&rsquo;S NEXT FOR BLUECORE</span>
                <h2 className="bc-next-heading">
                  We&rsquo;re currently continuing BlueCore iterations as we prepare to present at the{' '}
                  <span className="bc-highlight">SUGARetwork Expo</span> at SAP in Palo Alto this June.
                </h2>
                <p className="bc-body-text">
                  The immediate next step is industry validation — partnering with shipping companies and
                  port operators to test BlueCore against real workflows at sea. From there, we&rsquo;d
                  expand into adjacent sectors where hands-busy work and mandatory paperwork collide:
                  logistics, aviation, and industrial operations. Further out, the same principle holds
                  anywhere the stakes are highest and the systems have historically been the weakest.
                </p>
              </section>

              {/* KEY TAKEAWAYS */}
              <section id="takeaways" className="bc-section">
                <span className="bc-label">Key Takeaways</span>
                <div className="bc-kt-stack">
                  <div className="bc-kt-card">
                    <span className="bc-kt-label">ON AI AS A TOOL</span>
                    <p className="bc-kt-body">
                      This project pushed me further than I thought I could go as an entry-level designer.
                      AI became the bridge between where my skills were and where the project needed them
                      to be — accelerating my growth in Figma, introducing me to real development workflows
                      through Cursor and Claude Code, and giving me the confidence to pick up Framer and
                      GSAP mid-project and actually ship with them. What surprised me most was how much I
                      learned in the process. AI didn&rsquo;t do the work for me. It made me capable of
                      doing more of it myself.
                    </p>
                  </div>
                  <div className="bc-kt-card">
                    <span className="bc-kt-label">ON RESEARCH</span>
                    <p className="bc-kt-body">
                      You can&rsquo;t design for a culture you don&rsquo;t understand. Eight months of field
                      research across vessels, schools, and offices shaped every decision — from the visual
                      identity to the feature set. The product only works because the research was honest
                      enough to kill the first idea.
                    </p>
                  </div>
                  <div className="bc-kt-card">
                    <span className="bc-kt-label">ON SCOPE</span>
                    <p className="bc-kt-body">
                      Knowing what to cut is as important as knowing what to build. Removing the wellbeing
                      dashboard, narrowing to documentation, and leading with utility over care — those
                      subtractive decisions defined the product more than any feature did.
                    </p>
                  </div>
                </div>
              </section>

              {/* LEARN MORE */}
              <section id="learnmore" className="bc-section">
                <span className="bc-label">learn more</span>
                <div className="bc-posts-row">
                  <div className="bc-post-card">
                    <div className="bc-post-img">
                      <img src="/images/case-studies/bluecore-post-flown.png" alt="Flown post" />
                    </div>
                    <div className="bc-post-content">
                      <span className="bc-post-title">Flown — Designing for Maritime Wellbeing</span>
                      <span className="bc-post-url">linkedin.com/in/katsaliya — view post</span>
                    </div>
                  </div>
                  <div className="bc-post-card">
                    <div className="bc-post-img">
                      <img src="/images/case-studies/bluecore-post-blackrock.png" alt="BlackRock post" />
                    </div>
                    <div className="bc-post-content">
                      <span className="bc-post-title">BlackRock — Design Thinking Session</span>
                      <span className="bc-post-url">linkedin.com/in/katsaliya — view post</span>
                    </div>
                  </div>
                  <div className="bc-post-card">
                    <div className="bc-post-img">
                      <img src="/images/case-studies/bluecore-post-aiawards.png" alt="SFSU AI Awards post" />
                    </div>
                    <div className="bc-post-content">
                      <span className="bc-post-title">SFSU Student AI Awards 2026 — 1st Place</span>
                      <span className="bc-post-url">linkedin.com/in/katsaliya — view post</span>
                    </div>
                  </div>
                  <div className="bc-post-card">
                    <div className="bc-post-img">
                      <img src="/images/case-studies/bluecore-post-sfhacks.png" alt="SF Hacks post" />
                    </div>
                    <div className="bc-post-content">
                      <span className="bc-post-title">SF Hacks 2026 — GreenWatch AI</span>
                      <span className="bc-post-url">devpost.com/software/greenwatch — view submission</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>{/* end bc-sections */}
          </div>{/* end bc-body-layout */}

        </main>
        <Footer />
      </div>
    </>
  )
}
