import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminRole, setAdminRole } from '../../utils/adminApi'
import Button from '../../../components/Button'
import './style.css'

function AdminLayout() {
  const [role, setRole] = useState(getAdminRole())

  useEffect(() => {
    setAdminRole(role)
  }, [role])

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-title">Filega Admin</span>
          <span className="admin-subtitle">Operations Dashboard</span>
        </div>
        <div className="admin-header__actions">
          <label className="admin-role">
            <span>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="MASTER_ADMIN">Master Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </header>

      <nav className="admin-nav">
        <NavLink to="/admin" end className="admin-nav__link">
          Dashboard
        </NavLink>
        <NavLink to="/admin/businesses" className="admin-nav__link">
          Businesses
        </NavLink>
        <NavLink to="/admin/businesses/new" className="admin-nav__link">
          New Business
        </NavLink>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
