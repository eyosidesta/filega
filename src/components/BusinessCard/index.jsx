import GlassCard from '../GlassCard'
import Badge from '../Badge'
import Button from '../Button'
import './style.css'

function BusinessCard({ business, onView }) {
  const isPremium = business.subscription === 'PREMIUM'
  const cover = business.heroImage || business.images?.[0]
  return (
    <GlassCard
      variant={isPremium ? 'premium' : 'default'}
      className="business-card"
      onClick={() => onView?.(business)}
    >
      <div
        className="business-card__image"
        style={
          cover
            ? { backgroundImage: `url(${cover})` }
            : { backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.25))' }
        }
      >
        {isPremium && <Badge variant="premium">Premium</Badge>}
      </div>

      <div className="business-card__header">
        <div>
          <div className="business-card__name">{business.name}</div>
          <div className="business-card__meta">
            <span className="pill">{business.category}</span>
            <span className="pill">{business.city}</span>
          </div>
        </div>
      </div>

      <div className="business-card__contact">
        <span>{business.phone}</span>
        {business.website && (
          <a href={business.website} target="_blank" rel="noreferrer" className="text-dim">
            Website
          </a>
        )}
      </div>

      <Button
        variant={isPremium ? 'premium' : 'secondary'}
        onClick={(e) => {
          e.stopPropagation()
          onView?.(business)
        }}
      >
        View Details
      </Button>
    </GlassCard>
  )
}

export default BusinessCard

