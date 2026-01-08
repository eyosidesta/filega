import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Phone, MapPin, Globe, Mail } from 'lucide-react'
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
  const hero = business.heroImage || null
  const addressString = `${business.street}, ${business.city}, ${business.provinceOrState} ${business.postalCode}, ${business.country}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`
  const telUrl = business.phone ? `tel:${business.phone}` : null
  const mailUrl = business.email ? `mailto:${business.email}` : null
  const websiteUrl = business.website || null

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

      <div className="detail__hero-grid">
        <div className="detail__hero glass-card">
          {hero ? (
            <div className="detail__hero-img">
              <img src={hero} alt={`${business.name} hero`} />
              {isPremium && <Badge variant="premium">Premium</Badge>}
            </div>
          ) : (
            <div className="detail__hero-placeholder">
              <div className="detail__hero-logo">
                {business.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="detail__hero-info">
                <div className="detail__hero-name">{business.name}</div>
                <div className="text-dim">{business.phone}</div>
                {business.email && <div className="text-dim">{business.email}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="detail__info glass-card">
          <div className="detail__info-grid">
            {business.phone && (
              <div className="detail__info-chip">
                <Phone size={16} />
                <span className="label">Phone:</span>
                {telUrl ? (
                  <a className="link" href={telUrl}>
                    {business.phone}
                  </a>
                ) : (
                  <span className="text-dim">{business.phone}</span>
                )}
              </div>
            )}
            <div className="detail__info-chip full-row">
              <MapPin size={16} />
              <span className="label">Address:</span>
              <a className="link" href={mapsUrl} target="_blank" rel="noreferrer">
                {addressString}
              </a>
            </div>
            {websiteUrl && (
              <div className="detail__info-chip">
                <Globe size={16} />
                <span className="label">Website:</span>
                <a className="link" href={websiteUrl} target="_blank" rel="noreferrer">
                  {websiteUrl}
                </a>
              </div>
            )}
            {mailUrl && (
              <div className="detail__info-chip">
                <Mail size={16} />
                <span className="label">Email:</span>
                <a className="link" href={mailUrl}>
                  {business.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="detail__grid">
        <div className="detail__main">
          <GlassCard className="detail__card">
            <h3>Business Overview</h3>
            <ul className="detail__list">
              <li>Trusted Ethiopian business serving the local community.</li>
              <li>Located at {addressString}.</li>
              <li>Contact us at {business.phone}{business.email ? ` or ${business.email}` : ''}.</li>
            </ul>
          </GlassCard>

          <GlassCard className="detail__card">
            <h3>Services &amp; Solutions</h3>
            <ul className="detail__list">
              <li>Premium service experience for our customers.</li>
              <li>Locally focused offerings tailored to {business.city}.</li>
              <li>Reach out for more details on our current services.</li>
            </ul>
          </GlassCard>
        </div>

        <div className="detail__side">
          <GlassCard className="detail__card">
            <h3>Location</h3>
            {business.lat && business.lng && business.lat !== 0 && business.lng !== 0 ? (
              <iframe
                title="Location Map"
                className="detail__map"
                src={`https://www.google.com/maps?q=${business.lat},${business.lng}&z=15&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <MapPlaceholder label="Map unavailable" />
            )}
          </GlassCard>
        </div>
      </div>

      {business.images?.length > 0 ? (
        <section className="detail__gallery">
          <h3>Gallery</h3>
          <Gallery images={business.images.slice(0, 12)} name={business.name} />
        </section>
      ) : (
        <GlassCard className="detail__card text-dim">No gallery images provided.</GlassCard>
      )}

      <section className="detail__cta-bottom">
        <div className="cta-card glass-card">
          <h3>Want your business featured like this?</h3>
          <p>Promote your business to our community across Canada and the U.S.</p>
          <div className="cta-actions">
            <Button variant="primary" onClick={() => navigate('/contact')}>
              Advertise with Filega
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BusinessDetail












