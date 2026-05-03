import { useEffect, useRef, useCallback } from 'react'
import Nav from '../components/Nav'
import SideSocial from '../components/SideSocial'
import Footer from '../components/Footer'
import '../styles/about.css'

export default function About() {
  const dragRef = useRef(null)

  useEffect(() => {
    document.body.className = 'page-light-body'
    return () => { document.body.className = '' }
  }, [])

  const onMouseDown = useCallback((e) => {
    const el = e.currentTarget
    e.preventDefault()

    const parent = el.offsetParent
    const rect       = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()
    const initLeft   = rect.left - parentRect.left
    const initTop    = rect.top  - parentRect.top

    el.style.left      = `${initLeft}px`
    el.style.top       = `${initTop}px`
    el.style.right     = 'auto'
    el.style.transform = 'none'
    el.style.zIndex    = '200'
    el.style.cursor    = 'grabbing'

    dragRef.current = { el, startX: e.clientX, startY: e.clientY, initLeft, initTop }
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    const { el, startX, startY, initLeft, initTop } = dragRef.current
    el.style.left = `${initLeft + e.clientX - startX}px`
    el.style.top  = `${initTop  + e.clientY - startY}px`
  }, [])

  const onMouseUp = useCallback(() => {
    if (!dragRef.current) return
    dragRef.current.el.style.zIndex = ''
    dragRef.current.el.style.cursor = 'grab'
    dragRef.current = null
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const dragProps = { onMouseDown, draggable: false }

  return (
    <>
      <SideSocial />
      <div className="site-wrapper" id="siteWrapper">
        <Nav />

        <main className="page page-about" id="page-about">
          <div className="about-body">

            <div className="about-text">
              <div className="about-section">
                <img className="about-photo-item ph-g" src="/images/about/photo-g.png" alt="" {...dragProps} />
                <div className="about-section-heading">HOW I GOT HERE</div>
                <p className="about-section-body">
                  I grew up in the kitchen of <a href="https://www.emporiumthaimarket.com" target="_blank" rel="noopener noreferrer" style={{ color: '#B40000' }}>Emporium Thai</a> in 
                  Los Angeles — my Thai-Chinese immigrant parent's restaurant, and by our very unbiased opinion, <a style={{ color: '#D19600' }}> the best Thai
                  restaurant in the world.</a> Between <a style={{ color: '#B70FFF' }}>tables 4 and 16</a> is where I practiced my competitive <a style={{ color: '#00DBA8'}}>dance </a> 
                  numbers. I'd walk past the line of delivery drivers on my way to <a style={{color: '#0115EC'}}>swim</a> practice four times a week and come back to pack their orders 
                  at the door. That upbringing — <a style={{color: '#FF75ED'}}>between cultures, languages, and creative
                  worlds</a> — taught me to move fluidly between things, which probably explains why
                  I've never been able to stay in just one lane.<br /><br />
                  I consider myself a creative at heart. It's how I think, communicate, and make
                  sense of the world. I studied abroad in <a style={{color: '#FF0000'}}>Madrid</a> and 
                  <a style={{color:'#9500FF}'}}> Seoul</a>, and am soon graduating
                  with dual degrees in <a style={{color: '#FFA600'}}>Computer Science</a> and <a style={{color: '#FF5500'}}>Marketing</a> from San Francisco State
                  University — somewhere along the way falling deep into the overlap between
                  <a style={{color: 'var(--teal'}}> technology, design, and people.</a>
                </p>
              </div>

              <div className="about-section">
                <div className="about-section-heading">WHAT I'VE BEEN UP TO</div>
                <p className="about-section-body">
                  Researching and designing at <a href="https://sugar-network.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>SUGAR Network</a> — across San Francisco and Paris.<br />
                  <br />Wrapping up my final projects before I walk across that stage at <a href="https://cose.sfsu.edu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>San Francisco State University</a> (ahhh!)<br /><br />
                  Somewhere between another job application and a full night's sleep!<br /><br />
                  Romanticizing it all — with a side of dance break — on <a href="https://www.tiktok.com/@katsaliya" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>TikTok</a><br /><br />
                  For more details, checkout my <a href="https://www.linkedin.com/in/katsaliya/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>LinkedIn</a><br /><br />
                  I love working with and learning from people who are deeply passionate about
                  what they make — and San Francisco has not disappointed. Always feel free to
                  reach out — for projects, collabs, cool ideas, or just coffee<br /><br />
                  <a style={{color:'var(--teal)'}}>K☆</a>
                </p>
              </div>
            </div>

            <div className="about-photos">
              <img className="about-photo-item ph-a" src="/images/about/photo-c.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-b" src="/images/about/photo-e.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-c" src="/images/about/photo-i.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-d" src="/images/about/photo-h.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-e" src="/images/about/photo-d.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-f" src="/images/about/photo-f.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-h" src="/images/about/photo-a.png" alt="" {...dragProps} />
              <img className="about-photo-item ph-i" src="/images/about/photo-b.png" alt="" {...dragProps} />
            </div>

          </div>

          <Footer />
        </main>
      </div>
    </>
  )
}
