import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand">ZAMAI</NavLink>
      <NavLink to="/" end>Vision</NavLink>
      <NavLink to="/model">The Numbers</NavLink>
      <NavLink to="/how-it-works">How It Works</NavLink>
      <NavLink to="/regulation">Is It Legal?</NavLink>
    </nav>
  )
}
