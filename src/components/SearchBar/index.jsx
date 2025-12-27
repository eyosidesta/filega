import './style.css'

function SearchBar({ value, onChange, placeholder = 'Search businesses...' }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search businesses"
      />
    </div>
  )
}

export default SearchBar

