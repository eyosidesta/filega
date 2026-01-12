import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BusinessList from '../../components/BusinessList'
import { API_BASE } from '../../utils/api'
import './style.css'

function PremiumBusinesses() {
  const navigate = useNavigate()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(`${API_BASE}/businesses/all`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (ignore) return
        setAll(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [API_BASE])

  const premium = useMemo(
    () => all.filter((b) => b.subscription === 'PREMIUM'),
    [all]
  )

  return (
    <div className="container section premium">
      <div className="premium__header">
        <div>
          <p className="text-dim">Premium Businesses</p>
          <h1>Featured Ethiopian Businesses</h1>
          <p className="text-dim">
            Premium listings appear first, with enhanced visibility across the platform.
          </p>
        </div>
      </div>
      {loading ? (
        <p className="text-dim">Loading...</p>
      ) : (
        <BusinessList items={premium} onView={(b) => navigate(`/business/${b.id}`)} />
      )}
    </div>
  )
}

export default PremiumBusinesses



