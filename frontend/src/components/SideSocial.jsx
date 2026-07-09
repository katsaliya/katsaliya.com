/* ═══════════════════════════════════════════════════════════════════════════
   SIDE SOCIAL.JSX — Social Media Icons Sidebar

   This component displays social media links (Email, LinkedIn, GitHub)
   fixed on the left side of the page.

   On hover, icon color changes to teal (handled via CSS).
   ═══════════════════════════════════════════════════════════════════════════ */

/* Social media links: Email, LinkedIn, GitHub */
const LINKS = [
  /* Email link (opens email client) */
  { href: 'mailto:kataliyasun@gmail.com',                          icon: '/images/email_icon.png',    label: 'Email'    },

  /* LinkedIn link (opens in new tab) */
  { href: 'https://linkedin.com/in/katsaliya', target: '_blank', icon: '/images/linkedin_icon.png', label: 'LinkedIn' },

  /* GitHub link (opens in new tab) */
  { href: 'https://github.com/katsaliya',      target: '_blank', icon: '/images/github_icon.png',   label: 'GitHub'   },
]

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────────── */

export default function SideSocial() {
  /* Magnification animation removed - icons now display statically */
  /* Only color change on hover (handled in CSS) */

  /* ─────────────────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────────────────── */

  return (
    /* Container for social icons */
    /* className="side-social" = CSS styling (fixed on left side) */
    <div className="side-social" id="sideSocial">

      {/* Loop through each social link and render an icon */}
      {LINKS.map(({ href, target, icon, label }) => (
        /* Individual social icon link */
        <a
          key={label}
          href={href}
          target={target}
          rel={target ? 'noopener noreferrer' : undefined} /* Security: prevent window.opener access */
          aria-label={label}
        >
          {/* Icon image using background-image (works with PNG files) */}
          {/* TO CHANGE: Edit icon colors in shared.css: .side-social__icon { background-color: ... } */}
          <span
            className="side-social__icon"
            style={{ backgroundImage: `url(${icon})` }}
          />
        </a>
      ))}

    </div>
  )
}
