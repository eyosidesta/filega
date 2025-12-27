import { NavLink } from 'react-router-dom'
import './style.css'

function Header() {
  return (
    <header className="header">
      <div className="container header__content">
        <div className="header__brand">Filega</div>
        <nav className="header__nav hide-mobile">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/businesses">Businesses</NavLink>
          <NavLink to="/premium">Premium</NavLink>
          <NavLink to="/map">Map</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <NavLink className="header__cta" to="/submit">
          Submit Business
        </NavLink>
      </div>
    </header>
  )
}

export default Header

