import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import FilterButton from '../../components/FilterButton'
import FilterPanel from '../../components/FilterPanel'
import BusinessList from '../../components/BusinessList'
import { useFilters } from '../../hooks/useFilters'
import { API_BASE } from '../../utils/api'
import './style.css'

function Businesses() {
  const navigate = useNavigate()
  const { filters, updateFilter, clearFilters } = useFilters()
  const [showFilters, setShowFilters] = useState(false)
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(`${API_BASE}/businesses/all`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (ignore) return
        setAll(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [API_BASE])

  const filtered = useMemo(() => {
    return all
      .filter((b) => !filters.category || filters.category === 'All' || b.category === filters.category)
      .filter((b) => !filters.city || filters.city === 'All' || b.city === filters.city)
      .filter((b) => {
        if (!filters.term) return true
        const t = filters.term.toLowerCase()
        return b.name.toLowerCase().includes(t) || (b.category || '').toLowerCase().includes(t)
      })
  }, [all, filters])

  return (
    <div className="container section businesses">
      <div className="businesses__header">
        <SearchBar value={filters.term || ''} onChange={(v) => updateFilter('term', v)} />
        <FilterButton active={showFilters} onClick={() => setShowFilters((s) => !s)} />
      </div>

      {showFilters && (
        <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} />
      )}

      <div className="businesses__meta text-dim">
        {loading ? 'Loading...' : `Showing ${filtered.length} businesses`}
      </div>

      <BusinessList items={filtered} onView={(b) => navigate(`/business/${b.id}`)} />
    </div>
  )
}

export default Businesses

