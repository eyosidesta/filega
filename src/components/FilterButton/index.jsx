import './style.css'

function FilterButton({ onClick, active }) {
  return (
    <button className={`filter-btn ${active ? 'filter-btn--active' : ''}`} onClick={onClick}>
      <span>Filters</span>
    </button>
  )
}

export default FilterButton

