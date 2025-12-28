import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import FilterButton from '../../components/FilterButton'
import FilterPanel from '../../components/FilterPanel'
import BusinessList from '../../components/BusinessList'
import Pagination from '../../components/Pagination'
import { useFilters } from '../../hooks/useFilters'
import { useMockSearch } from '../../hooks/useMockSearch'
import { usePagination } from '../../hooks/usePagination'
import './style.css'

function Businesses() {
  const navigate = useNavigate()
  const { filters, updateFilter, clearFilters } = useFilters()
  const [showFilters, setShowFilters] = useState(false)
  const results = useMockSearch({ ...filters, term: filters.term || '' })
  const { page, pageSize, nextPage, prevPage } = usePagination(1, 9)
  const paginated = results.slice((page - 1) * pageSize, page * pageSize)

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
        Showing {paginated.length} of {results.length} businesses
      </div>

      <BusinessList items={paginated} onView={(b) => navigate(`/business/${b.id}`)} />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={results.length}
        onPrev={prevPage}
        onNext={nextPage}
      />
    </div>
  )
}

export default Businesses

