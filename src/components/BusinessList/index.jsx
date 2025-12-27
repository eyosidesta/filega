import BusinessCard from '../BusinessCard'
import './style.css'

function BusinessList({ items = [], onView }) {
  return (
    <div className="business-list">
      {items.map((b) => (
        <BusinessCard key={b.id} business={b} onView={onView} />
      ))}
    </div>
  )
}

export default BusinessList

