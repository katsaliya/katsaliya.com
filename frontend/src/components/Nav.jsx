import { Link, useLocation } from 'react-router-dom'

export default function Nav({ scriptRef }) {
  const { pathname } = useLocation()

  /* script logo is always shown on about + play; hidden on contact;
     on work it starts hidden and is faded in by the scroll effect in Work.jsx */
  const scriptVisible = pathname === '/about' || pathname === '/play'

  return (
    <nav className="main-nav" id="mainNav">
      <div
        className={`nav-script${scriptVisible ? ' visible' : ''}`}
        id="navScript"
        ref={scriptRef}
      >
        Kataliya!
      </div>
      <div className="nav-links">
        <Link to="/"        className={pathname === '/'        ? 'active' : ''}>WORK</Link>
        <Link to="/about"   className={pathname === '/about'   ? 'active' : ''}>ABOUT</Link>
        <Link to="/play"    className={pathname === '/play'    ? 'active' : ''}>PLAY</Link>
        <Link to="/contact" className={pathname === '/contact' ? 'active' : ''}>CONTACT</Link>
      </div>
    </nav>
  )
}
