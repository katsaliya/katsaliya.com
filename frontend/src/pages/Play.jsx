import { useEffect } from 'react'
import Nav from '../components/Nav'
import '../styles/play.css'

export default function Play() {
  useEffect(() => {
    document.body.className = 'page-light-body'
    return () => { document.body.className = '' }
  }, [])

  return (
    <div className="site-wrapper" id="siteWrapper">
      <Nav />

      <main className="page page-play" id="page-play">
        <div className="play-inner">
          <div className="play-intro">
            <span className="play-sandbox-label">welcome to the<br />sandbox!</span>
          </div>
          <div className="play-blush">
            <div className="play-coming-soon">Coming Soon!</div>
          </div>
        </div>

        <div className="site-footer">
          <div>kataliya sungkamee · 2026</div>
        </div>
      </main>
    </div>
  )
}
