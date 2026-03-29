import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand">
        <img src="/AI.png" alt="ZamAi" style={{ height: 22, display: 'block' }} />
      </NavLink>
      <NavLink to="/" end>Vision</NavLink>
      <NavLink to="/model">Numbers</NavLink>
      <NavLink to="/how-it-works">How It Works</NavLink>
      <NavLink to="/governance">Governance</NavLink>
      <NavLink to="/regulation">Legal</NavLink>
    </nav>
  )
}
