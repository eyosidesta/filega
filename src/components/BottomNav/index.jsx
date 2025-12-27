import { NavLink } from 'react-router-dom'
import './style.css'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/businesses">List</NavLink>
      <NavLink to="/map">Map</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  )
}

export default BottomNav

