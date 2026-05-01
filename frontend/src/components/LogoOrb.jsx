import { useState, useRef, useEffect } from 'react'
import { useMotionValue, useSpring, motion } from 'motion/react'

function useAcousticAmplitude(state) {
  const amp = useMotionValue(0)
  const smoothAmp = useSpring(amp, { stiffness: 20, damping: 18 })
  const frameRef = useRef(0)

  useEffect(() => {
    let t = 0
    const tick = () => {
      t += 0.04
      let val = 0
      if (state === 'listening') {
        val = Math.abs(Math.sin(t * 3.1) * 0.5 + Math.sin(t * 7.3) * 0.3 + Math.sin(t * 11.7) * 0.2) *
          (0.5 + Math.random() * 0.5)
      } else if (state === 'speaking') {
        val = Math.abs(Math.sin(t * 2.2) * 0.55 + Math.sin(t * 5.1) * 0.28 + Math.sin(t * 9.4) * 0.17) *
          (0.4 + Math.random() * 0.35)
      } else {
        val = Math.abs(Math.sin(t * 0.7) * 0.08)
      }
      amp.set(val)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [state, amp])

  return smoothAmp
}

function WireframeOrb({ state, ampRef, orbColor }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const CSS = 280
    canvas.style.width = CSS + 'px'
    canvas.style.height = CSS + 'px'
    canvas.width = CSS * DPR
    canvas.height = CSS * DPR
    ctx.scale(DPR, DPR)

    const CX = CSS / 2
    const CY = CSS / 2
    const BASE_R = 82
    const ROWS = 36
    const COLS = 52

    let time = 0
    let rotX = 0
    let rotY = 0
    let frame

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

    function rotatePoint(x, y, z, rx, ry) {
      const x1 =  x * Math.cos(ry) + z * Math.sin(ry)
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
      const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx)
      return [x1, y2, z2]
    }

    const draw = () => {
      ctx.clearRect(0, 0, CSS, CSS)

      const amp = ampRef.current ?? 0
      const st = stateRef.current

      const rotSpeed = st === 'listening' ? 0.007 : st === 'speaking' ? 0.005 : 0.0018
      rotY += rotSpeed
      rotX += rotSpeed * 0.4
      time += st === 'listening' ? 0.028 : st === 'speaking' ? 0.020 : 0.008

      const deformBase = st === 'idle' ? 0.22 : st === 'speaking' ? 0.38 : 0.52
      const deform = deformBase + amp * 0.55

      const pts = []
      for (let i = 0; i <= ROWS; i++) {
        const phi = (i / ROWS) * Math.PI
        for (let j = 0; j <= COLS; j++) {
          const theta = (j / COLS) * Math.PI * 2
          const n = noise(phi, theta, time)
          const r = BASE_R * (1 + n * deform)
          const x0 = r * Math.sin(phi) * Math.cos(theta)
          const y0 = r * Math.sin(phi) * Math.sin(theta)
          const z0 = r * Math.cos(phi)
          const [x, y, z] = rotatePoint(x0, y0, z0, rotX, rotY)
          pts.push([x, y, z])
        }
      }

      const idx = (i, j) => i * (COLS + 1) + j

      const lineColor = (z, baseAlpha) => {
        const depth = (z + BASE_R * 1.8) / (BASE_R * 3.6)
        const a = baseAlpha * (0.25 + depth * 0.75)
        return `${orbColor}${Math.floor(Math.min(a, 1) * 255).toString(16).padStart(2, '0')}`
      }

      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath()
        let started = false
        for (let j = 0; j <= COLS; j++) {
          const [x, y] = pts[idx(i, j)]
          if (!started) { ctx.moveTo(CX + x, CY + y); started = true }
          else ctx.lineTo(CX + x, CY + y)
        }
        ctx.strokeStyle = lineColor(pts[idx(i, 0)][2], 0.55)
        ctx.lineWidth = 0.45
        ctx.stroke()
      }

      for (let j = 0; j <= COLS; j++) {
        ctx.beginPath()
        let started = false
        for (let i = 0; i <= ROWS; i++) {
          const [x, y] = pts[idx(i, j)]
          if (!started) { ctx.moveTo(CX + x, CY + y); started = true }
          else ctx.lineTo(CX + x, CY + y)
        }
        ctx.strokeStyle = lineColor(pts[idx(ROWS / 2, j)][2], 0.45)
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

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

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [orbColor, ampRef])

  return <canvas ref={canvasRef} style={{ display: 'block' }} />
}

export default function LogoOrb() {
  const [orbState, setOrbState] = useState('idle')

  const amp = useAcousticAmplitude(orbState)
  const ampRef = useRef(0)
  useEffect(() => {
    return amp.on('change', (v) => { ampRef.current = v })
  }, [amp])

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
    }}>
      {/* Background gradients */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 5%, rgba(37,70,127,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 15% 85%, rgba(99,130,200,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 45% 35% at 85% 80%, rgba(147,180,240,0.08) 0%, transparent 60%)
          `,
        }} />
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

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 42, position: 'relative', zIndex: 10,
      }}>
        <motion.div
          style={{position: 'relative', zIndex: 2}}
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

        <motion.div 
          style={{ position: 'relative', cursor: 'pointer', marginTop: -60 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          onMouseEnter={() => setOrbState('listening')}
          onMouseLeave={() => setOrbState('idle')}
        >
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(37,70,127,0.12) 30%, transparent 70%)',
            filter: 'blur(20px)', transform: 'scale(1.2)',
          }} />
          <WireframeOrb state={orbState} ampRef={ampRef} orbColor="#25467F" />
        </motion.div>
      </div>
    </div>
  )
}
