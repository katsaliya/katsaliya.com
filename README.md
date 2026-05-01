# katsaliya.com

Personal portfolio, still in progress and not yet published. Built as a playground for UX/UI experimentation and animation work alongside real project showcases.

---

## Viewing Locally

```bash
cd katsaliya.com/frontend
python3 -m http.server 8000
```

Then open `http://localhost:8000/kataliya-portfolio.html` in your browser.

---

## What's Inside

Static HTML portfolio split into separate pages: **Work**, **About**, **Play**, and **Contact**.

### Current Design

The work page has been rebuilt from the Figma frames as an absolute-positioned 1440px desktop canvas. Project cards are fully open, use exported demo images, and no longer use the old Venetian blind reveal system. The animation pass is intentionally deferred.

### Pages

| Page | Status |
|---|---|
| Work | In progress — 7 Figma-positioned project cards |
| About | In progress — text and photo collage restored from Figma |
| Play | In progress — coming-soon sandbox frame restored from Figma |
| Contact | In progress — layout done, form placeholder |

---

## File Structure

```text
frontend/
  kataliya-portfolio.html   # Work page
  about.html                # About page
  play.html                 # Play page
  contact.html              # Contact page
  styles/
    shared.css              # Fonts, reset, nav, footer, shared layout
    work.css                # Work page only
    about.css               # About page only
    play.css                # Play page only
    contact.css             # Contact page only
  scripts/
    work.js                 # Work page scaling + nav script fade
```

---

## Stack

Vanilla HTML, CSS, and JavaScript. No framework or build step.

**Fonts:** Kapakana · Afacad Flux · 42dot Sans (Google Fonts) and Courier Prime Code (self-hosted in `frontend/fonts/`).
