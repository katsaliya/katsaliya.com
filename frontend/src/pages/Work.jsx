import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Nav from '../components/Nav'
import SideSocial from '../components/SideSocial'
import LogoOrb from '../components/LogoOrb'
import Footer from '../components/Footer'
import '../styles/work.css'

export default function Work() {
  const navigate = useNavigate()
  const navScriptRef  = useRef(null)
  const workStageRef  = useRef(null)
  const workCanvasRef = useRef(null)
  const heroPreRef    = useRef(null)
  const heroNameRef   = useRef(null)
  const heroBioRef    = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })

  /* ── body background ── */
  useEffect(() => {
    document.body.className = 'page-work-body'
    return () => { document.body.className = '' }
  }, [])

  /* ── canvas scaling ──
     Scales the 1440px work-canvas to the available stage width
     so the pixel-exact Figma card layout fills the screen. */
  useEffect(() => {
    function updateWorkScale() {
      const stage  = workStageRef.current
      const canvas = workCanvasRef.current
      if (!stage || !canvas) return

      const stageWidth = stage.clientWidth || window.innerWidth
      const scale = stageWidth > 900 ? stageWidth / 1440 : 1

      canvas.style.height = 'auto'
      const contentHeight = canvas.scrollHeight

      document.documentElement.style.setProperty('--work-scale', scale)
      canvas.style.height = `${contentHeight}px`
      stage.style.height  = `${contentHeight * scale}px`
    }

    updateWorkScale()
    window.addEventListener('resize', updateWorkScale)
    return () => window.removeEventListener('resize', updateWorkScale)
  }, [])

  /* ── nav script scroll fade ──
     "Kataliya!" in the nav fades in as you scroll the hero name up past it. */
  useEffect(() => {
    const navScript = navScriptRef.current
    const heroName  = heroNameRef.current
    const mainNav   = document.getElementById('mainNav')
    if (!navScript || !heroName || !mainNav) return

    function updateNavScript() {
      navScript.classList.add('visible')
      const navRect  = mainNav.getBoundingClientRect()
      const nameRect = heroName.getBoundingClientRect()
      const navCenter  = navRect.top  + navRect.height  / 2
      const nameCenter = nameRect.top + nameRect.height / 2
      const fadeDistance = 90
      const progress = Math.min(1, Math.max(0, (navCenter - nameCenter + fadeDistance) / fadeDistance))
      navScript.style.opacity = progress.toFixed(3)
    }

    updateNavScript()
    window.addEventListener('scroll', updateNavScript, { passive: true })
    return () => window.removeEventListener('scroll', updateNavScript)
  }, [])

  /* ── card entrance animations ──
     Delay starting the observer so cards visible on load appear
     0.15s after the hero starts fading in (hero delay 0.5s + 0.15s = 650ms).
     Cards scrolled to later fire normally whenever they enter the viewport. */
  useEffect(() => {
    const cards = workCanvasRef.current?.querySelectorAll('.project-card, .row-label')
    if (!cards) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4}
    )

    const timer = setTimeout(() => {
      cards.forEach((card) => observer.observe(card))
    }, 900)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const handleCardClick = (e) => {
    setPopupPos({ x: e.clientX, y: e.clientY })
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 1500)
  }

  const handleBluecoreClick = () => navigate('/bluecore')
    
  return (
    <>
      <SideSocial />

      <div className="site-wrapper" id="siteWrapper">
        <Nav scriptRef={navScriptRef} />

        <main className="page page-work" id="page-work">
          {showPopup && createPortal(
            <div className="coming-soon-popup" style={{ left: popupPos.x, top: popupPos.y }}>
              case study coming soon!!
            </div>,
            document.body
          )}

          <div className="work-stage" ref={workStageRef}>
            <div className="work-canvas" ref={workCanvasRef}>

              {/* ── Hero bio ── */}
              <div className="face-hero">
                <p className="face-pre" ref={heroPreRef}>Hi, I'm</p>
                <div className="face-name" ref={heroNameRef}>Kataliya!</div>
                <p className="face-bio" ref={heroBioRef}>
                  a multidisciplinary <em>builder</em> passionate
                  about creating at the intersection of technology,
                  people, and storytelling with <span className="teal">AI</span>.<br /><br />
                  Recently completed dual degrees in <span className="teal">Computer Science
                  and Business Administration: Marketing</span> at <em>San Francisco
                  State University</em> — designing, coding, and shipping things that matter along the way.
                </p>
              </div>

              {/* ── CARDS SECTION ── */}
              <div className="cards-section">
                <p className="row-label">some of my recent work</p>

                <div className="cards-layout">

                  {/* Left column: bluecore on top, steady+maisonid below */}
                  <div className="cards-col">
                    <div className="project-card project-card--bluecore" onClick={handleBluecoreClick}>
                      <div className="project-card__media project-card__media--bluecore">
                        <LogoOrb />
                      </div>
                      <div className="project-card__body">
                        <p className="card-desc">
                          Bringing <span className="teal">wellbeing</span> infrastructure to the{' '}
                          <em>world's most isolated workforce</em> — through{' '}
                          <span className="teal">AI, quiet documentation, </span>and{' '}
                          <span className="teal">design</span> built around the <em>people</em> the
                          industry <em>forgot</em>. Eight months of field research across two continents,
                          still iterating with the people it's built for.
                        </p>
                        <div className="card-tags">
                          <span>Figma</span><span>React</span><span>Qualitative Research</span>
                          <span>JavaScript</span><span>Claude</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-row">
                      <div className="project-card project-card--steady" onClick={handleCardClick}>
                        <div className="project-card__media">
                          <img src="/images/cards/demo-steady.png" alt="Steady app demo" />
                        </div>
                        <div className="project-card__body">
                          <p className="card-desc">
                            Making <span className="teal">stability accessible</span> for{' '}
                            <span className="teal">aging adults</span> through passive sensing,
                            personalized insights, and quiet, dignified design.
                          </p>
                          <div className="card-tags">
                            <span>Figma</span><span>UI/UX</span><span>Mobile</span><span>Product</span>
                          </div>
                        </div>
                      </div>

                      <div className="project-card project-card--maisonid" onClick={handleCardClick}>
                        <div className="project-card__media">
                          <img src="/images/cards/demo-maisonid.png" alt="MaisonId demo" />
                        </div>
                        <div className="project-card__body">
                          <p className="card-desc">
                            A <span className="teal">biologically guided fragrance ritual</span> for{' '}
                            <em>L'Oréal Luxe</em>, where skin chemistry <em>replaces</em> guesswork
                            and <em>refill</em> becomes identity.
                          </p>
                          <div className="card-tags">
                            <span>Illustrator</span><span>Express</span><span>Strategy</span><span>Product</span>
                          </div>
                        </div>
                      </div>
                    </div>{/* /sub-row */}
                  </div>{/* /left col */}

                  {/* Right column: known on top, aidentity below */}
                  <div className="cards-col cards-col--right">
                    <div className="project-card project-card--known" onClick={handleCardClick}>
                      <div className="project-card__media">
                        <video
                          src="/images/cards/KnownTV.mp4"
                          autoPlay loop muted playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div className="project-card__body">
                        <p className="card-desc">
                          A collection of{' '}
                          <span className="teal">content, marketing materials, and graphics</span> for a
                          Series A <em>AI-matchmaking startup</em> — prelaunch.
                        </p>
                        <div className="card-tags">
                          <span>Content</span><span>Graphics</span><span>GTM</span><span>CapCut</span>
                        </div>
                      </div>
                    </div>

                    <div className="project-card project-card--aidentity" onClick={handleCardClick}>
                      <div className="project-card__media">
                        <img src="/images/cards/demo-aidentity.png" alt="AIdentity demo" />
                      </div>
                      <div className="project-card__body">
                        <p className="card-desc">
                          Reimagining how{' '}
                          <span className="teal">immigrant families access legal guidance</span> — through{' '}
                          <span className="teal">AI</span>, plain language, and tools built for the
                          communities attorneys can't reach.
                        </p>
                        <div className="card-tags">
                          <span>React</span><span>JavaScript</span><span>UX/UI</span><span>Whisper</span>
                        </div>
                      </div>
                    </div>
                  </div>{/* /right col */}

                </div>{/* /cards-layout */}
              </div>{/* /cards-section */}

            </div>{/* /work-canvas */}
          </div>{/* /work-stage */}

          <Footer showHeadline />
        </main>
      </div>
    </>
  )
}
