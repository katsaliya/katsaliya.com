import { useEffect } from 'react'
import Nav from '../components/Nav'
import SideSocial from '../components/SideSocial'
import Footer from '../components/Footer'
import '../styles/play.css'

export default function Play() {
  useEffect(() => {
    document.body.className = 'page-play-body'
    return () => { document.body.className = '' }
  }, [])

  return (
    <>
      <SideSocial />
      <div className="site-wrapper" id="siteWrapper">
      <Nav />

      <main className="page page-play" id="page-play">
        <div className="play-blush" />
        <div className="play-inner">
          <div className="play-intro">
            <span className="play-sandbox-label">welcome to the<br />sandbox!</span>
          </div>
          <div className="play-coming-soon">Coming Soon!</div>
        </div>

        <Footer />
      </main>
    </div>
    </>
  )
}
