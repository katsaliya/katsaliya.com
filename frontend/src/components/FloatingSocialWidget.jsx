import { useState, useEffect, useRef } from 'react'

const LINKS = [
  { href: 'mailto:kataliyasun@gmail.com', icon: '/images/email_icon.png', label: 'Email' },
  { href: 'https://github.com/katsaliya', target: '_blank', icon: '/images/github_icon.png', label: 'GitHub' },
  { href: 'https://linkedin.com/in/katsaliya', target: '_blank', icon: '/images/linkedin_icon.png', label: 'LinkedIn' },
]

const STORAGE_KEY_FIRST_VISIT = 'social-widget-first-visit'
const STORAGE_KEY_STATE = 'social-widget-collapsed'
const AUTO_COLLAPSE_DELAY = 2500 // 2.5 seconds

export default function FloatingSocialWidget() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef(null)
  const autoCollapseTimer = useRef(null)

  // Initialize state from localStorage on mount
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem(STORAGE_KEY_FIRST_VISIT)
    const savedCollapsedState = localStorage.getItem(STORAGE_KEY_STATE)

    if (!hasVisitedBefore) {
      // First visit: start expanded
      setIsCollapsed(false)
      setIsFirstVisit(true)
      localStorage.setItem(STORAGE_KEY_FIRST_VISIT, 'true')
    } else {
      // Subsequent visits: restore saved state or default to collapsed
      const shouldBeCollapsed = savedCollapsedState === 'true'
      setIsCollapsed(shouldBeCollapsed)
      setIsFirstVisit(false)
    }

    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-collapse on first visit after delay
  useEffect(() => {
    if (isFirstVisit && !isCollapsed) {
      autoCollapseTimer.current = setTimeout(() => {
        setIsCollapsed(true)
        localStorage.setItem(STORAGE_KEY_STATE, 'true')
      }, AUTO_COLLAPSE_DELAY)
    }

    return () => {
      if (autoCollapseTimer.current) clearTimeout(autoCollapseTimer.current)
    }
  }, [isFirstVisit, isCollapsed])

  // Handle toggle
  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem(STORAGE_KEY_STATE, newState ? 'true' : 'false')
    setIsFirstVisit(false) // Disable first-visit auto-collapse after manual interaction
  }

  // Handle touch swipe (mobile only)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    // Swipe right (toward edge) to collapse
    if (diff > 50 && !isCollapsed) {
      handleToggle()
    }

    touchStartX.current = null
  }

  return (
    <div
      className={`floating-social-widget ${isCollapsed ? 'collapsed' : 'expanded'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Expanded content */}
      <div className="floating-social-widget__content">
        {/* Social icons */}
        <div className="floating-social-widget__icons">
          {LINKS.map(({ href, target, icon, label }) => (
            <a
              key={label}
              href={href}
              target={target}
              rel={target ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="floating-social-widget__icon-link"
            >
              <span
                className="floating-social-widget__icon"
                style={{ backgroundImage: `url(${icon})` }}
              />
            </a>
          ))}
        </div>

        {/* Collapse button */}
        <button
          className="floating-social-widget__toggle"
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand social links' : 'Collapse social links'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <span className="floating-social-widget__arrow" />
        </button>
      </div>

      {/* Collapsed pull-tab */}
      {isCollapsed && (
        <button
          className="floating-social-widget__tab"
          onClick={handleToggle}
          aria-label="Expand social links"
          title="Social links"
        >
          <span className="floating-social-widget__arrow" />
        </button>
      )}
    </div>
  )
}
