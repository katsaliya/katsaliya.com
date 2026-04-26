# katsaliya.com

Personal portfolio — still in progress, not yet published. Built as a playground for UX/UI experimentation and animation work alongside real project showcases.

---

## Viewing Locally

```bash
cd katsaliya.com/frontend
python3 -m http.server 8000
```

Then open `http://localhost:8000/kataliya-portfolio.html` in your browser.

---

## What's Inside

Single-page HTML portfolio with four sections: **Work**, **Play**, **About**, and **Contact**.

### Venetian Blind Interaction (Work page)

The main feature of the work page is a custom Venetian blind reveal system. Project cards sit in a masonry grid, each covered by a full-bleed image panel. A draggable cord on the right side of the screen pulls the covers open row by row — using 3D CSS transforms (`rotateX`, `translateY`, `translateZ`) with per-card perspective, cast shadows, and a specular light effect during the lift. Snaps to the nearest row boundary on release.

### Pages

| Page | Status |
|---|---|
| Work | Done — 9 project cards with Venetian blind animation |
| Play | In progress — sandbox for UI/animation experiments |
| About | In progress — layout scaffolded, content being filled |
| Contact | In progress — layout done, form placeholder |

---

## Stack

Vanilla HTML, CSS, and JavaScript — no framework, no build step.

**Fonts:** Gelasio · Nunito · Syne · DM Sans (Google Fonts)
