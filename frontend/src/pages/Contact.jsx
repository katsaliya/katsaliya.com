import { useEffect } from 'react'
import Nav from '../components/Nav'
import '../styles/contact.css'

export default function Contact() {
  useEffect(() => {
    document.body.className = 'page-light-body'
    return () => { document.body.className = '' }
  }, [])

  return (
    <div className="site-wrapper" id="siteWrapper">
      <Nav />

      <main className="page page-contact" id="page-contact">
        <div className="contact-body">
          <div className="contact-left">
            <h2>contact me</h2>
            <p>
              I'm always open to new projects, collaborations, and conversations.
              Whether you have a question or just want to say hi — my inbox is always open.
            </p>
          </div>
          <div className="contact-right">form placeholder</div>
        </div>

        <footer className="site-footer">
          <div>kataliya sungkamee · 2026</div>
        </footer>
      </main>
    </div>
  )
}
