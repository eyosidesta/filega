import { useMemo } from 'react'
import { searchBusinesses } from '../utils/dataHelpers'

export function useMockSearch(filters) {
  const results = useMemo(() => searchBusinesses(filters), [filters])
  return results
}

