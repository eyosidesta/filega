import categories from '../../data/categories.json'
import cities from '../../data/cities.json'
import Button from '../Button'
import './style.css'

function FilterPanel({ filters, onChange, onClear }) {
  return (
    <div className="filter-panel glass-card">
      <div className="filter-panel__group">
        <label>Category</label>
        <select value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-panel__group">
        <label>City</label>
        <select value={filters.city} onChange={(e) => onChange('city', e.target.value)}>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-panel__actions">
        <Button variant="secondary" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

export default FilterPanel

