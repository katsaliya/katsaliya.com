import { useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import SideSocial from '../components/SideSocial'
import LogoOrb from '../components/LogoOrb'
import '../styles/work.css'

export default function Work() {
  const navScriptRef  = useRef(null)
  const workStageRef  = useRef(null)
  const workCanvasRef = useRef(null)
  const heroPreRef    = useRef(null)
  const heroNameRef   = useRef(null)
  const heroBioRef    = useRef(null)
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

      let contentHeight = 0
      canvas.querySelectorAll('.project-card').forEach((card) => {
        const bottom = card.offsetTop + card.offsetHeight
        if (bottom > contentHeight) contentHeight = bottom
      })
      contentHeight += 64

      document.documentElement.style.setProperty('--work-scale', scale)
      canvas.style.height    = `${contentHeight}px`
      stage.style.height     = `${contentHeight * scale}px`
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

  /* ── hero typewriter ──
     Types out face-pre → face-name → face-bio on mount.
     Respects prefers-reduced-motion. */
  /* useEffect(() => {
    const heroLines = [heroPreRef.current, heroNameRef.current, heroBioRef.current].filter(Boolean)
    if (!heroLines.length) return
    if (heroLines.every((el) => el.dataset.typed === 'true')) return

    // Save original HTML so StrictMode's cleanup→remount cycle starts clean.
    // Without this, the second mount sees the already-modified DOM (empty text
    // nodes) and the typewriter never finds characters to type.
    const savedHTML = heroLines.map((el) => el.innerHTML)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function prepareTypingLayer(sourceEl) {
      const isBio = sourceEl.classList.contains('face-bio')

      const staticLayer = document.createElement('span')
      staticLayer.className = 'face-type__static'
      staticLayer.innerHTML = sourceEl.innerHTML

      const typingLayer = document.createElement('span')
      typingLayer.className = 'face-type__typing'
      typingLayer.setAttribute('aria-hidden', 'true')
      typingLayer.innerHTML = sourceEl.innerHTML
      typingLayer.style.padding = getComputedStyle(sourceEl).padding
      typingLayer.classList.add(isBio ? 'face-type__typing--bio' : 'face-type__typing--line')

      const textNodes = []
      const walker = document.createTreeWalker(typingLayer, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const node = walker.currentNode
        const text = node.textContent.replace(/\s+/g, ' ')
        if (!text.trim()) { node.remove(); continue }
        node.textContent = ''
        textNodes.push({ node, text })
      }

      sourceEl.innerHTML = ''

      if (isBio) {
        sourceEl.append(staticLayer, typingLayer)
      } else {
        // Wrap both layers in an inline-grid so they share the same grid cell.
        // The cell is always sized by the static layer (full text), so the
        // typing layer is pinned to the exact same left edge with no JS
        // measurement. Font loading automatically repositions both together.
        const wrapper = document.createElement('span')
        wrapper.className = 'face-type__line-wrapper'
        wrapper.append(staticLayer, typingLayer)
        sourceEl.appendChild(wrapper)
      }

      return { sourceEl, staticLayer, typingLayer, textNodes }
    }

    const sequences = heroLines.map(prepareTypingLayer)

    if (prefersReduced) {
      sequences.forEach(({ typingLayer, staticLayer, sourceEl }) => {
        typingLayer.remove()
        staticLayer.style.visibility = 'visible'
        sourceEl.dataset.typed = 'true'
      })
      return
    }

    const cursor = document.createElement('span')
    cursor.className = 'type-cursor'
    cursor.setAttribute('aria-hidden', 'true')

    let lineIndex = 0
    let nodeIndex = 0
    let charIndex = 0
    let currentLayer = null
    const timeouts = []

    function schedule(fn, ms) {
      const id = window.setTimeout(fn, ms)
      timeouts.push(id)
      return id
    }

    function attachCursor(layer) {
      if (!layer) return
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor)
      layer.appendChild(cursor)
      currentLayer = layer
    }

    function finishLine(sequence) {
      if (cursor.parentNode === sequence.typingLayer) {
        sequence.typingLayer.removeChild(cursor)
      }
      sequence.typingLayer.remove()
      sequence.staticLayer.style.visibility = 'visible'
      sequence.sourceEl.dataset.typed = 'true'
    }

    function step() {
      const sequence = sequences[lineIndex]
      if (!sequence) {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor)
        return
      }

      if (currentLayer !== sequence.typingLayer) attachCursor(sequence.typingLayer)

      const current = sequence.textNodes[nodeIndex]
      if (!current) {
        finishLine(sequence)
        lineIndex += 1
        nodeIndex = 0
        charIndex = 0
        const next = sequences[lineIndex]
        if (next) schedule(() => { attachCursor(next.typingLayer); step() }, 200)
        return
      }

      current.node.textContent += current.text.charAt(charIndex)
      const typedChar = current.text.charAt(charIndex)
      charIndex += 1
      if (charIndex >= current.text.length) { nodeIndex += 1; charIndex = 0 }

      const delay = /[.,—:;!?]/.test(typedChar) ? 42 : /\s/.test(typedChar) ? 26 : 12
      schedule(step, delay)
    }

    attachCursor(sequences[0].typingLayer)
    schedule(step, 120)

    return () => {
      timeouts.forEach(window.clearTimeout)
      // Restore original DOM so a remount (StrictMode or page revisit) starts clean
      heroLines.forEach((el, i) => {
        el.innerHTML = savedHTML[i]
        delete el.dataset.typed
      })
    }
  }, []) */

  return (
    <>
      <SideSocial />

      <div className="site-wrapper" id="siteWrapper">
        <Nav scriptRef={navScriptRef} />

        <main className="page page-work" id="page-work">
          <div className="work-stage" ref={workStageRef}>
            <div className="work-canvas" ref={workCanvasRef}>

              {/* ── Hero bio ── */}
              <div className="face-hero">
                <p className="face-pre" ref={heroPreRef}>Hi, I'm</p>
                <div className="face-name" ref={heroNameRef}>Kataliya!</div>
                <p className="face-bio" ref={heroBioRef}>
                  a multidisciplinary <em>designer</em> and <em>builder</em> passionate
                  about creating at the intersection of technology,
                  people, and storytelling with <span className="teal">AI</span>.<br /><br />
                  Currently completing dual degrees in <span className="teal">Computer Science
                  and Business Administration: Marketing</span> at <em>San Francisco
                  State University</em> — designing, coding, and shipping things that matter along the way.
                </p>
              </div>

              {/* ── ROW 0 ── */}

              {/* BluecoreAI · canvas(255,694) → frame(129,661) · 775×538 */}
              <div className="project-card project-card--bluecore">
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

              {/* Known · canvas(1053,694) → frame(927,661) · 373×498 */}
              <div className="project-card project-card--known">
                <div className="project-card__media">
                  <video
                    src="/images/cards/KnownTV.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
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

              {/* ── ROW 1 ── */}

              {/* Steady · canvas(255,1258) → frame(129,1225) · 378×498 */}
              <div className="project-card project-card--steady">
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

              {/* MaisonId · canvas(653,1258) → frame(527,1225) · 378×498 */}
              <div className="project-card project-card--maisonid">
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

              {/* AIdentity · canvas(1053,1221) → frame(927,1188) · 373×538 */}
              <div className="project-card project-card--aidentity">
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

            </div>{/* /work-canvas */}
          </div>{/* /work-stage */}

          <footer className="site-footer">
            <div>kataliya sungkamee · 2026</div>
          </footer>
        </main>
      </div>
    </>
  )
}
