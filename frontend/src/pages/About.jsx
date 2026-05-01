import { useEffect } from 'react'
import Nav from '../components/Nav'
import '../styles/about.css'

export default function About() {
  useEffect(() => {
    document.body.className = 'page-light-body'
    return () => { document.body.className = '' }
  }, [])

  return (
    <div className="site-wrapper" id="siteWrapper">
      <Nav />

      <main className="page page-about" id="page-about">
        <div className="about-body">

          {/* Left: long-form text */}
          <div className="about-text">
            <div className="about-section">
              <div className="about-section-heading">HOW I GOT HERE</div>
              <p className="about-section-body">
                I grew up in the kitchen of Emporium Thai in Los Angeles — my Thai-Chinese
                immigrant parent's restaurant, and by our very unbiased opinion, the best Thai
                restaurant in the world. Between tables 4 and 9 is where I practiced my
                competitive dance numbers, and swim practice was a 15-minute walk away four
                times a week. That upbringing — between cultures, languages, and creative
                worlds — taught me to move fluidly between things, which probably explains why
                I've never been able to stay in just one lane.<br /><br />
                I consider myself a creative at heart. It's how I think, communicate, and make
                sense of the world. I studied abroad in Madrid and Seoul, and am soon graduating
                with dual degrees in Computer Science and Marketing from San Francisco State
                University — somewhere along the way falling deep into the overlap between
                technology, design, and people.
              </p>
            </div>

            <div className="about-section">
              <div className="about-section-heading">WHAT I'VE BEEN UP TO</div>
              <p className="about-section-body">
                Researching and designing at <a href="#">SUGAR Network</a> — across San Francisco and Paris.<br /><br />
                Wrapping up my final projects before I walk across that stage at San Francisco State University (ahhh!)<br /><br />
                Somewhere between my 500th job application and a full night's sleep 🤞<br /><br />
                Romanticizing it all — with a side of dance break — on <a href="#">TikTok</a><br /><br />
                For more details, checkout my <a href="#">LinkedIn</a><br /><br />
                I love working with and learning from people who are deeply passionate about
                what they make — and San Francisco has not disappointed. Always feel free to
                reach out — for projects, collabs, cool ideas, or just coffee<br /><br />
                K☆
              </p>
            </div>
          </div>

          {/* Right: photo collage
              Positions set via .ph-a through .ph-i in about.css */}
          <div className="about-photos">
            <img className="about-photo-item ph-a" src="/images/about/photo-c.png" alt="" />
            <img className="about-photo-item ph-b" src="/images/about/photo-g.png" alt="" />
            <img className="about-photo-item ph-c" src="/images/about/photo-i.png" alt="" />
            <img className="about-photo-item ph-d" src="/images/about/photo-h.png" alt="" />
            <img className="about-photo-item ph-e" src="/images/about/photo-d.png" alt="" />
            <img className="about-photo-item ph-f" src="/images/about/photo-f.png" alt="" />
            <img className="about-photo-item ph-g" src="/images/about/photo-e.png" alt="" />
            <img className="about-photo-item ph-h" src="/images/about/photo-a.png" alt="" />
            <img className="about-photo-item ph-i" src="/images/about/photo-b.png" alt="" />
          </div>

        </div>{/* /about-body */}

        <div className="site-footer">
          <div>kataliya sungkamee · 2026</div>
        </div>
      </main>
    </div>
  )
}
