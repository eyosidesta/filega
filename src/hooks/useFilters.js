import { useState } from 'react'

export function useFilters(initial = { term: '', category: 'All', city: 'All' }) {
  const [filters, setFilters] = useState(initial)

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => setFilters(initial)

  return { filters, updateFilter, clearFilters }
}

