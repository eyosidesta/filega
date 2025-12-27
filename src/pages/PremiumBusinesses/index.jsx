import BusinessList from '../../components/BusinessList'
import { getPremiumBusinesses } from '../../utils/dataHelpers'
import './style.css'

function PremiumBusinesses() {
  const items = getPremiumBusinesses()
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
      <BusinessList items={items} />
    </div>
  )
}

export default PremiumBusinesses



