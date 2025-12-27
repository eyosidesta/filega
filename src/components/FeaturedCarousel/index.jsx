import BusinessCard from '../BusinessCard'
import './style.css'

function FeaturedCarousel({ items = [], onView }) {
  return (
    <div className="featured-carousel">
      {items.map((b) => (
        <div key={b.id} className="featured-carousel__item">
          <BusinessCard business={b} onView={onView} />
        </div>
      ))}
    </div>
  )
}

export default FeaturedCarousel

