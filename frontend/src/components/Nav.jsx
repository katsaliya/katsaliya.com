import { Link, useLocation } from 'react-router-dom'

export default function Nav({ scriptRef }) {
  const { pathname } = useLocation()

  const scriptVisible = pathname === '/about' || pathname === '/play'

  return (
    <nav className="main-nav" id="mainNav">
      <Link
        to="/"
        className={`nav-script${scriptVisible ? ' visible' : ''}`}
        id="navScript"
        ref={scriptRef}
      >
        Kataliya!
      </Link>
      <div className="nav-links">
        <Link to="/"      className={pathname === '/'      ? 'active' : ''}>WORK</Link>
        <Link to="/about" className={pathname === '/about' ? 'active' : ''}>ABOUT</Link>
        <Link to="/play"  className={pathname === '/play'  ? 'active' : ''}>PLAY</Link>
        <a href="mailto:ksungkamee@sfsu.edu">CONTACT</a>
      </div>
    </nav>
  )
}
