import { useParams, useNavigate } from 'react-router-dom'
import Gallery from '../../components/Gallery'
import GlassCard from '../../components/GlassCard'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import MapPlaceholder from '../../components/MapPlaceholder'
import { getBusinessById } from '../../utils/dataHelpers'
import './style.css'

function BusinessDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const business = getBusinessById(id)

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
            <span className="pill">{business.address.city}</span>
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
              {business.address.street}, {business.address.city}, {business.address.provinceOrState}{' '}
              {business.address.postalCode}, {business.address.country}
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



