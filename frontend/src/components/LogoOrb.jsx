/* ═══════════════════════════════════════════════════════════════════════════
   LOGO ORB.JSX — 3D Animated Wireframe Orb with Responsive States

   This is an advanced visual component that displays an animated 3D orb.
   The orb reacts to hover interactions with different "states" (idle, listening).

   Used on the BlueCore case study page as a hero visual.

   The component uses:
   - Canvas 2D API for 3D rendering (wireframe effect)
   - Perlin-like noise for organic deformation
   - Motion library for smooth animations
   - Responsive amplitude animations based on state changes

   This is a premium interaction that showcases technical design skills.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import React hooks for state management and lifecycle */
import { useState, useRef, useEffect } from 'react'

/* Import Motion library for smooth animations */
/* useMotionValue = track numeric values that animate smoothly */
/* useSpring = apply physics-based spring animations */
/* motion = create animated components with declarative syntax */
import { useMotionValue, useSpring, motion } from 'motion/react'

/* ─────────────────────────────────────────────────────────────────────
   CUSTOM HOOK: useAcousticAmplitude

   Generates animated amplitude values that respond to the orb's state.
   Creates different wave patterns for idle, listening, and speaking states.
   ───────────────────────────────────────────────────────────────────── */

function useAcousticAmplitude(state) {
  /* Motion value: numeric value that can animate smoothly */
  const amp = useMotionValue(0)

  /* Spring: applies physics-based motion to amp value */
  /* stiffness: 20 = bouncy, lower = slower and smoother */
  /* damping: 18 = resistance, higher = less bouncy */
  const smoothAmp = useSpring(amp, { stiffness: 20, damping: 18 })

  /* Reference to store animation frame ID for cleanup */
  const frameRef = useRef(0)

  /* Animation loop that runs continuously */
  useEffect(() => {
    let t = 0 /* Time variable for sine waves */

    const tick = () => {
      t += 0.04 /* Increment time */

      let val = 0 /* Amplitude value to set */

      /* Different wave patterns based on state */
      if (state === 'listening') {
        /* Listening state: complex overlapping sine waves with random variation */
        /* Creates organic "listening" animation effect */
        val = Math.abs(Math.sin(t * 3.1) * 0.5 + Math.sin(t * 7.3) * 0.3 + Math.sin(t * 11.7) * 0.2) *
          (0.5 + Math.random() * 0.5)
      } else if (state === 'speaking') {
        /* Speaking state: slightly different frequencies for "speaking" feel */
        val = Math.abs(Math.sin(t * 2.2) * 0.55 + Math.sin(t * 5.1) * 0.28 + Math.sin(t * 9.4) * 0.17) *
          (0.4 + Math.random() * 0.35)
      } else {
        /* Idle state: slow subtle sine wave for gentle breathing effect */
        val = Math.abs(Math.sin(t * 0.7) * 0.08)
      }

      /* Set the amplitude value (triggers smooth animation) */
      amp.set(val)

      /* Queue next frame */
      frameRef.current = requestAnimationFrame(tick)
    }

    /* Start animation loop */
    frameRef.current = requestAnimationFrame(tick)

    /* Cleanup: stop animation when component unmounts or state changes */
    return () => cancelAnimationFrame(frameRef.current)
  }, [state, amp])

  /* Return the smoothly animated amplitude value */
  return smoothAmp
}

/* ─────────────────────────────────────────────────────────────────────
   WIREFRAME ORB COMPONENT

   Renders a 3D wireframe sphere using HTML5 Canvas.
   Uses 3D math (rotation matrices) to create the illusion of depth.
   ───────────────────────────────────────────────────────────────────── */

function WireframeOrb({ state, ampRef, orbColor, size = 280 }) {
  /* Reference to canvas element */
  const canvasRef = useRef(null)

  /* Reference to current state (for use in animation loop without re-rendering) */
  const stateRef = useRef(state)
  stateRef.current = state

  /* Initialize canvas and set up rendering loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* Get 2D rendering context */
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* ─── CANVAS SETUP ─── */

    /* Device pixel ratio: handle high-DPI displays (Retina) */
    /* Cap at 2 to avoid excessive memory usage */
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    /* Canvas size in CSS pixels. 280 by default — the size this was written
       against — but the case-study masthead renders it far larger, and a
       canvas cannot simply be stretched with CSS without going soft. */
    const CSS = size

    /* Set CSS size and actual pixel size for proper scaling */
    canvas.style.width = CSS + 'px'
    canvas.style.height = CSS + 'px'
    canvas.width = CSS * DPR
    canvas.height = CSS * DPR

    /* Scale canvas for high-DPI displays */
    ctx.scale(DPR, DPR)

    /* ─── 3D SPHERE PARAMETERS ─── */

    /* Center of canvas */
    const CX = CSS / 2
    const CY = CSS / 2

    /* Base radius, PROPORTIONAL to the canvas. It was a flat 82, which is
       correct only at the original 280: at any larger size the orb stayed
       82px and sat marooned in the middle of an empty canvas. */
    const BASE_R = 82 * (CSS / 280)

    /* Grid dimensions (more rows/cols = smoother sphere) */
    const ROWS = 36 /* Latitude divisions */
    const COLS = 52 /* Longitude divisions */

    /* ─── ANIMATION STATE ─── */

    let time = 0 /* Time for noise function */
    let rotX = 0 /* Rotation around X axis */
    let rotY = 0 /* Rotation around Y axis */
    let frame /* Animation frame ID */

    /* ─── NOISE FUNCTION ─── */
    /* Creates organic deformation using overlapping sine waves */
    /* Perlin-like noise for smooth variation across sphere surface */
    function noise(phi, theta, t) {
      return (
        Math.sin(phi * 2.3 + t * 0.55) * 0.28 +
        Math.sin(theta * 3.7 + t * 0.42) * 0.22 +
        Math.sin(phi * 4.1 - theta * 2.8 + t * 0.78) * 0.18 +
        Math.sin(phi * 1.5 + theta * 5.2 + t * 0.31) * 0.14 +
        Math.sin(phi * 6.3 + theta * 1.4 - t * 0.63) * 0.10 +
        Math.sin(phi * 3.2 - theta * 4.1 + t * 0.88) * 0.08
      )
    }

    /* ─── 3D ROTATION FUNCTION ─── */
    /* Applies rotation matrices to 3D points */
    /* Rotates around X axis first, then Y axis */
    function rotatePoint(x, y, z, rx, ry) {
      /* Rotate around Y axis */
      const x1 = x * Math.cos(ry) + z * Math.sin(ry)
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry)

      /* Rotate around X axis */
      const y2 = y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)

      return [x1, y2, z2]
    }

    /* ─── MAIN DRAW FUNCTION ─── */
    /* Runs every frame (~60fps) to redraw the orb */
    const draw = () => {
      /* Clear canvas */
      ctx.clearRect(0, 0, CSS, CSS)

      /* Get current amplitude and state */
      const amp = ampRef.current ?? 0
      const st = stateRef.current

      /* ─── ROTATION SPEEDS ─── */
      /* Different rotation speeds based on state */
      const rotSpeed = st === 'listening' ? 0.007 : st === 'speaking' ? 0.005 : 0.0018
      rotY += rotSpeed
      rotX += rotSpeed * 0.4

      /* ─── TIME INCREMENT ─── */
      /* Different time increments for different deformation frequencies */
      time += st === 'listening' ? 0.028 : st === 'speaking' ? 0.020 : 0.008

      /* ─── DEFORMATION AMOUNT ─── */
      /* How much the sphere bulges outward based on state and amplitude */
      const deformBase = st === 'idle' ? 0.22 : st === 'speaking' ? 0.38 : 0.52
      const deform = deformBase + amp * 0.55

      /* ─── GENERATE 3D POINTS ─── */
      /* Create a grid of points on the sphere surface */
      const pts = []

      for (let i = 0; i <= ROWS; i++) {
        /* Latitude (phi) goes from 0 (top) to π (bottom) */
        const phi = (i / ROWS) * Math.PI

        for (let j = 0; j <= COLS; j++) {
          /* Longitude (theta) goes around 0 to 2π */
          const theta = (j / COLS) * Math.PI * 2

          /* Get noise value for this point */
          const n = noise(phi, theta, time)

          /* Calculate radius with deformation applied */
          const r = BASE_R * (1 + n * deform)

          /* Convert spherical to Cartesian coordinates */
          const x0 = r * Math.sin(phi) * Math.cos(theta)
          const y0 = r * Math.sin(phi) * Math.sin(theta)
          const z0 = r * Math.cos(phi)

          /* Apply rotation */
          const [x, y, z] = rotatePoint(x0, y0, z0, rotX, rotY)

          pts.push([x, y, z])
        }
      }

      /* ─── HELPER: 2D ARRAY INDEX ─── */
      /* Converts 2D grid index to 1D array index */
      const idx = (i, j) => i * (COLS + 1) + j

      /* ─── HELPER: LINE COLOR ─── */
      /* Calculates color with depth-based opacity */
      /* Points further from camera (lower z) appear more transparent */
      const lineColor = (z, baseAlpha) => {
        const depth = (z + BASE_R * 1.8) / (BASE_R * 3.6)
        const a = baseAlpha * (0.25 + depth * 0.75)
        return `${orbColor}${Math.floor(Math.min(a, 1) * 255).toString(16).padStart(2, '0')}`
      }

      /* ─── DRAW LATITUDE LINES ─── */
      /* Horizontal rings around the sphere */
      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath()
        let started = false

        for (let j = 0; j <= COLS; j++) {
          const [x, y] = pts[idx(i, j)]
          if (!started) {
            ctx.moveTo(CX + x, CY + y)
            started = true
          } else {
            ctx.lineTo(CX + x, CY + y)
          }
        }

        ctx.strokeStyle = lineColor(pts[idx(i, 0)][2], 0.55)
        ctx.lineWidth = 0.45
        ctx.stroke()
      }

      /* ─── DRAW LONGITUDE LINES ─── */
      /* Vertical lines around the sphere */
      for (let j = 0; j <= COLS; j++) {
        ctx.beginPath()
        let started = false

        for (let i = 0; i <= ROWS; i++) {
          const [x, y] = pts[idx(i, j)]
          if (!started) {
            ctx.moveTo(CX + x, CY + y)
            started = true
          } else {
            ctx.lineTo(CX + x, CY + y)
          }
        }

        ctx.strokeStyle = lineColor(pts[idx(ROWS / 2, j)][2], 0.45)
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      /* ─── DRAW DIAGONAL LINES (diagonal 1) ─── */
      /* Extra detail lines for visual complexity */
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const [x1, y1, z1] = pts[idx(i, j)]
          const [x2, y2, z2] = pts[idx(i + 1, j + 1 <= COLS ? j + 1 : 0)]

          ctx.beginPath()
          ctx.moveTo(CX + x1, CY + y1)
          ctx.lineTo(CX + x2, CY + y2)
          ctx.strokeStyle = lineColor((z1 + z2) / 2, 0.22)
          ctx.lineWidth = 0.35
          ctx.stroke()
        }
      }

      /* ─── DRAW DIAGONAL LINES (diagonal 2) ─── */
      /* Additional cross-hatch for even more detail */
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j += 2) {
          const [x1, y1, z1] = pts[idx(i + 1, j)]
          const [x2, y2, z2] = pts[idx(i, j + 1 <= COLS ? j + 1 : 0)]

          ctx.beginPath()
          ctx.moveTo(CX + x1, CY + y1)
          ctx.lineTo(CX + x2, CY + y2)
          ctx.strokeStyle = lineColor((z1 + z2) / 2, 0.15)
          ctx.lineWidth = 0.3
          ctx.stroke()
        }
      }

      /* Queue next frame */
      frame = requestAnimationFrame(draw)
    }

    /* Start animation */
    frame = requestAnimationFrame(draw)

    /* Cleanup on unmount */
    return () => cancelAnimationFrame(frame)
  }, [orbColor, ampRef, size])

  return <canvas ref={canvasRef} style={{ display: 'block' }} />
}

/* ─────────────────────────────────────────────────────────────────────
   MAIN LOGO ORB COMPONENT
   ───────────────────────────────────────────────────────────────────── */

/* `bare` renders the ORB AND NOTHING ELSE — no wordmark, no decorative
   gradients, no padded column. The full composition is a page hero: it ships
   its own <h1>, rings offset well outside their box, and a flex column with
   42px of padding that flex-shrinks the canvas when the container is only as
   tall as the orb itself. Embedding it meant fighting all of that from
   outside with !important. This is the same animation, on its own. */
export default function LogoOrb({ size = 280, bare = false }) {
  /* State: idle (default), listening (on hover), or speaking */
  const [orbState, setOrbState] = useState('idle')

  /* Get animated amplitude value from custom hook */
  const amp = useAcousticAmplitude(orbState)

  /* Reference to current amplitude (for passing to canvas) */
  const ampRef = useRef(0)

  /* Sync amplitude value from motion value to ref */
  useEffect(() => {
    return amp.on('change', (v) => { ampRef.current = v })
  }, [amp])

  if (bare) {
    return (
      <div
        style={{ width: size, height: size, position: 'relative' }}
        onMouseEnter={() => setOrbState('listening')}
        onMouseLeave={() => setOrbState('idle')}
      >
        <WireframeOrb state={orbState} ampRef={ampRef} orbColor="#25467F" size={size} />
      </div>
    )
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
    }}>

      {/* ─── BACKGROUND GRADIENTS ─── */}
      {/* Non-interactive decorative gradients */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* Static gradient layers */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 5%, rgba(37,70,127,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 15% 85%, rgba(99,130,200,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 45% 35% at 85% 80%, rgba(147,180,240,0.08) 0%, transparent 60%)
          `,
        }} />

        {/* Animated floating gradient blur (top left) */}
        <motion.div
          style={{
            position: 'absolute', borderRadius: '50%',
            width: 320, height: 320, top: -80, left: -100,
            background: 'radial-gradient(circle, rgba(37,70,127,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.08, 1], x: [0, 12, 0], y: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Animated floating gradient blur (bottom right) */}
        <motion.div
          style={{
            position: 'absolute', borderRadius: '50%',
            width: 280, height: 280, bottom: -50, right: -70,
            background: 'radial-gradient(circle, rgba(99,130,210,0.07) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, -8, 0], y: [0, -6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* ─── CONTENT: TITLE + ORB ─── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 42, position: 'relative', zIndex: 10,
      }}>

        {/* "BlueCore" title with fade-in animation */}
        <motion.div
          style={{ position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: '4rem',
            fontWeight: 600,
            color: '#1e334c',
            letterSpacing: '-0.04em',
            margin: 0,
            lineHeight: 1,
          }}>
            BlueCore
          </h1>
        </motion.div>

        {/* Orb with hover interaction */}
        {/* onMouseEnter/Leave changes state to trigger different animations */}
        <motion.div
          style={{ position: 'relative', cursor: 'pointer', marginTop: -60 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          onMouseEnter={() => setOrbState('listening')}
          onMouseLeave={() => setOrbState('idle')}
        >
          {/* Glow effect around orb */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(37,70,127,0.12) 30%, transparent 70%)',
            filter: 'blur(20px)', transform: 'scale(1.2)',
          }} />

          {/* The actual 3D wireframe orb */}
          <WireframeOrb state={orbState} ampRef={ampRef} orbColor="#25467F" size={size} />
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOMIZATION:

   - Change title: Edit "BlueCore" text in h1 element
   - Change orb color: Edit orbColor prop in WireframeOrb component
   - Change rotation speeds: Edit rotSpeed values in draw function
   - Change deformation: Edit deformBase values
   - Adjust noise complexity: Edit noise function coefficients
   - Change animation states: Add more states in useAcousticAmplitude
   ═══════════════════════════════════════════════════════════════════════════ */
