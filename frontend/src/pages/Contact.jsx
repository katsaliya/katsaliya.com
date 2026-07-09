/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT.JSX — Contact Page

   Simple contact page with a heading, introduction text, and form placeholder.
   Allows visitors to reach out for projects, collaborations, or conversations.

   Currently has a placeholder for a contact form that can be replaced with
   a real form component (e.g., Formspree, custom backend, email service).
   ═══════════════════════════════════════════════════════════════════════════ */

/* Import useState for form handling (when form is implemented) */
import { useEffect } from 'react'

/* Import global navigation component */
import Nav from '../components/Nav'

/* Import page-specific styles */
import '../styles/contact.css'

/* Main Contact page component */
export default function Contact() {
  /* ─── PAGE SETUP ─── */
  /* Add CSS class to body for page-specific styling */
  /* This effect runs once when page loads and cleans up when leaving */
  useEffect(() => {
    /* Add light body styling to this page */
    /* 'page-light-body' applies white background and light theme */
    document.body.className = 'page-light-body'

    /* Cleanup function: remove class when user leaves page */
    return () => { document.body.className = '' }
  }, []) /* Empty array = run only once on mount */

  return (
    /* Main site wrapper */
    /* className="site-wrapper" = container with min-height: 100vh */
    /* id="siteWrapper" = for JavaScript reference if needed */
    <div className="site-wrapper" id="siteWrapper">

      {/* Global navigation bar (appears on all pages) */}
      <Nav />

      {/* Main page content area */}
      {/* className="page page-contact" = semantic HTML + CSS selector */}
      {/* id="page-contact" = unique identifier for this page */}
      <main className="page page-contact" id="page-contact">

        {/* Contact section: intro + form */}
        {/* className="contact-body" = flex layout with left/right columns */}
        <div className="contact-body">

          {/* Left column: heading + introduction text */}
          {/* className="contact-left" = left column styling */}
          <div className="contact-left">

            {/* Page heading */}
            {/* TO CHANGE: Edit text "contact me" to different heading */}
            <h2>contact me</h2>

            {/* Introduction paragraph */}
            {/* Explains the purpose of the page and invites contact */}
            {/* TO CHANGE: Edit this text to personalize the message */}
            <p>
              I'm always open to new projects, collaborations, and conversations.
              Whether you have a question or just want to say hi — my inbox is always open.
            </p>
          </div>

          {/* Right column: contact form */}
          {/* Currently a placeholder - replace with actual form component */}
          {/* className="contact-right" = right column styling, flex: 1 to fill space */}
          <div className="contact-right">
            {/* TODO: FORM IMPLEMENTATION */}
            {/* Replace "form placeholder" with actual form component */}
            {/* Option 1: Use Formspree (easiest) */}
            {/*   <form action="https://formspree.io/f/YOUR_ID" method="POST"> */}
            {/*     <input type="email" name="email" placeholder="Your email" required /> */}
            {/*     <textarea name="message" placeholder="Your message" required></textarea> */}
            {/*     <button type="submit">Send</button> */}
            {/*   </form> */}
            {/* */}
            {/* Option 2: Create custom form component (more control) */}
            {/*   <ContactForm onSubmit={handleSubmit} /> */}
            {/* */}
            {/* Option 3: Email link (simplest) */}
            {/*   <a href="mailto:kataliyasun@gmail.com" className="contact-button"> */}
            {/*     Send Email */}
            {/*   </a> */}
            form placeholder
          </div>

        </div>

        {/* Footer with copyright info */}
        {/* className="site-footer" = shared footer styling */}
        <footer className="site-footer">
          {/* Copyright year and name */}
          {/* TO CHANGE: Update year if needed (2026) or personalize message */}
          <div>kataliya sungkamee · 2026</div>
        </footer>

      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW TO IMPLEMENT THE CONTACT FORM:

   EASY (Formspree):
   1. Go to formspree.io and sign up
   2. Create a form for your domain
   3. Replace the placeholder with:
      <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
        <input type="email" name="email" placeholder="Your email" required />
        <textarea name="message" placeholder="Your message" required></textarea>
        <button type="submit">Send</button>
      </form>

   FLEXIBLE (Custom Form Component):
   1. Create src/components/ContactForm.jsx
   2. Build form with your desired fields
   3. Replace placeholder with: <ContactForm />
   4. Add validation, success/error states, backend integration

   SIMPLE (Email Link):
   1. Replace placeholder with:
      <a href="mailto:kataliyasun@gmail.com" className="contact-cta">
        Send me an email
      </a>
   2. Add CSS to style the button

   STYLING:
   - Edit contact.css for layout, colors, fonts
   - Form inputs inherit base styles from shared.css
   - Add form-specific styles to contact.css
   ═══════════════════════════════════════════════════════════════════════════ */
