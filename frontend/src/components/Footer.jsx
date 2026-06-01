import { useState, useEffect } from 'react'

export default function Footer({ showHeadline = false }) {
  const [visitorCount, setVisitorCount] = useState(null)

  useEffect(() => {
    fetch('/api/visit')
      .then(r => r.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => {})
  }, [])

  return (
    <footer className="site-footer work-footer">
      {showHeadline && <p className="work-footer__headline">more on the way</p>}
      <div className="work-footer__meta">
        <span>꒰ྀི১ Open to opportunities, collabs, and good conversations. ໒꒱ིྀ - KS </span>
        <span>THANK YOU, ENJOY</span>
        <span>LAST UPDATED: 05 01 26</span>
        <span className="teal">VISITOR # {visitorCount ?? '...'}</span>
      </div>
    </footer>
  )
}
