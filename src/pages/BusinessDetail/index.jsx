import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Gallery from '../../components/Gallery'
import GlassCard from '../../components/GlassCard'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import MapPlaceholder from '../../components/MapPlaceholder'
import './style.css'

function BusinessDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(`${API_BASE}/businesses/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (ignore) return
        setBusiness(data)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id, API_BASE])

  if (loading) {
    return (
      <div className="container section">
        <p>Loading...</p>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="container section">
        <p>Business not found.</p>
        <Button variant="secondary" onClick={() => navigate('/businesses')}>
          Back to list
        </Button>
      </div>
    )
  }

  const isPremium = business.subscription === 'PREMIUM'

  return (
    <div className="container section detail">
      <div className="detail__header">
        <div>
          <p className="text-dim">Business Detail</p>
          <h1 className="detail__title">
            {business.name} {isPremium && <Badge variant="premium">Premium</Badge>}
          </h1>
          <div className="detail__meta">
            <span className="pill">{business.category}</span>
            <span className="pill">{business.city}</span>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="detail__grid">
        <div className="detail__main">
          <Gallery images={business.images} />

          <GlassCard className="detail__card">
            <h3>Contact</h3>
            <div className="text-dim">{business.phone}</div>
            {business.website && (
              <a href={business.website} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
          </GlassCard>

          <GlassCard className="detail__card">
            <h3>Address</h3>
            <div className="text-dim">
              {business.street}, {business.city}, {business.provinceOrState} {business.postalCode},{' '}
              {business.country}
            </div>
          </GlassCard>
        </div>

        <div className="detail__side">
          <GlassCard className="detail__card">
            <h3>Location</h3>
            <MapPlaceholder label="Single-business map placeholder" />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default BusinessDetail












