import { useState, useEffect, useRef } from 'react'

const LINKS = [
  { href: 'mailto:kataliyasun@gmail.com', icon: '/images/email_icon.png', label: 'Email' },
  { href: 'https://github.com/katsaliya', target: '_blank', icon: '/images/github_icon.png', label: 'GitHub' },
  { href: 'https://linkedin.com/in/katsaliya', target: '_blank', icon: '/images/linkedin_icon.png', label: 'LinkedIn' },
]

const STORAGE_KEY_EXPANDED = 'social-bubble-expanded'

export default function FloatingSocialBubble() {
  const [isExpanded, setIsExpanded] = useState(false)
  const bubbleRef = useRef(null)

  // Initialize expanded state from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem(STORAGE_KEY_EXPANDED)
    if (savedExpanded) {
      setIsExpanded(JSON.parse(savedExpanded))
    }
  }, [])

  // Handle toggle
  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(newState))
  }

  // Icon positions for bottom-right corner (expand vertically upward in single column)
  const iconPositions = {
    0: { bottom: '160px', left: '0px' }, // Email
    1: { bottom: '250px', left: '0px' }, // GitHub
    2: { bottom: '340px', left: '0px' }, // LinkedIn
  }

  return (
    <div
      ref={bubbleRef}
      className={`floating-social-bubble ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        position: 'fixed',
        bottom: '3.5rem',
        right: '2rem',
        zIndex: 50,
      }}
    >
      {/* Speech bubble icon - always visible */}
      <button
        className="floating-social-bubble__trigger"
        onClick={handleToggle}
        aria-label="Toggle social links"
        title="Social links"
      >
        <img src="/images/speech-bubble.png" alt="" />
      </button>

      {/* Expanded social icons */}
      {isExpanded && (
        <div className="floating-social-bubble__icons">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.target}
              rel={link.target ? 'noopener noreferrer' : undefined}
              className="floating-social-bubble__icon-link"
              aria-label={link.label}
              style={{
                ...iconPositions[i],
                position: 'absolute',
              }}
            >
              <span
                className="floating-social-bubble__icon"
                style={{
                  backgroundImage: `url(${link.icon})`,
                }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
