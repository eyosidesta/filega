import { useMemo, useState } from 'react'
import BusinessList from '../../components/BusinessList'
import FilterPanel from '../../components/FilterPanel'
import MapPlaceholder from '../../components/MapPlaceholder'
import { useFilters } from '../../hooks/useFilters'
import { useMockSearch } from '../../hooks/useMockSearch'
import { filterByBounds, mockBounds } from '../../utils/mapUtils'
import './style.css'

function MapPage() {
  const { filters, updateFilter, clearFilters } = useFilters()
  const [bounds] = useState(mockBounds())
  const results = useMockSearch({ ...filters, term: filters.term || '' })
  const bounded = useMemo(() => filterByBounds(results, bounds), [results, bounds])

  return (
    <div className="container section map-page">
      <div className="map-page__filters">
        <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} />
      </div>

      <div className="map-page__layout">
        <div className="map-page__list">
          <div className="map-page__meta text-dim">Showing {bounded.length} businesses in view</div>
          <BusinessList items={bounded} />
        </div>
        <div className="map-page__map">
          <MapPlaceholder label="Map placeholder — Google Maps SDK to be integrated later" />
        </div>
      </div>
    </div>
  )
}

export default MapPage



