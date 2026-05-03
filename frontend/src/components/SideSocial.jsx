import { useRef, useCallback, useEffect } from 'react'

const LINKS = [
  { href: 'mailto:ksungkamee@sfsu.edu',                          icon: '/images/email_icon.png',    label: 'Email'    },
  { href: 'https://linkedin.com/in/katsaliya', target: '_blank', icon: '/images/linkedin_icon.png', label: 'LinkedIn' },
  { href: 'https://github.com/katsaliya',      target: '_blank', icon: '/images/github_icon.png',   label: 'GitHub'   },
  { href: 'https://tiktok.com/@katsaliya',     target: '_blank', icon: '/images/tiktok_icon.png',   label: 'TikTok'   },
]

const MAX_SCALE = 2.2   // peak scale of icon under cursor
const LERP   = 0.25  // was 0.16 — snappier response
const RADIUS = 130   // was 110 — slightly wider spread

export default function SideSocial() {
  const linkRefs     = useRef([])
  const targetScales = useRef(LINKS.map(() => 1))
  const current      = useRef(LINKS.map(() => 1))
  const rafRef       = useRef(null)
  const hovering     = useRef(false)

  const animate = useCallback(() => {
    let settled = true
    linkRefs.current.forEach((link, i) => {
      if (!link) return
      const t    = targetScales.current[i]
      const next = current.current[i] + (t - current.current[i]) * LERP
      current.current[i] = next
      link.style.transform = `scale(${next.toFixed(4)})`
      /*link.style.transform = `translateX(${((next - 1) * 40).toFixed(2)}px) scale(${next.toFixed(4)})`*/
      link.style.marginBottom = `${((next - 1) * 12).toFixed(2)}px`
      if (Math.abs(next - t) > 0.001) settled = false  // was 0.0015
    })

    rafRef.current = (!settled || hovering.current)
      ? requestAnimationFrame(animate)
      : null
  }, [])

  const startLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
  }, [animate])

  const handleMouseMove = useCallback((e) => {
    hovering.current = true
    const mouseY = e.clientY
    linkRefs.current.forEach((link, i) => {
      if (!link) return
      const rect = link.getBoundingClientRect()
      const dist = Math.abs(mouseY - (rect.top + rect.height / 2))
      targetScales.current[i] = dist < RADIUS
        ? 1 + (MAX_SCALE - 1) * Math.cos((dist / RADIUS) * (Math.PI / 2))
        : 1
    })
    startLoop()
  }, [startLoop])

  const handleMouseLeave = useCallback(() => {
    hovering.current = false
    targetScales.current = LINKS.map(() => 1)
    startLoop()
  }, [startLoop])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className="side-social"
      id="sideSocial"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {LINKS.map(({ href, target, icon, label }, i) => (
        <a
          key={label}
          href={href}
          target={target}
          rel={target ? 'noopener noreferrer' : undefined}
          aria-label={label}
          ref={el => linkRefs.current[i] = el}
        >
          <span
            className="side-social__icon"
            style={{ maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})` }}
          />
        </a>
      ))}
    </div>
  )
}
