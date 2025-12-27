import businesses from '../data/businesses.json'

export function getAllBusinesses() {
  return businesses.filter((b) => b.status === 'active')
}

export function getPremiumBusinesses() {
  return getAllBusinesses().filter((b) => b.subscription === 'PREMIUM')
}

export function getBusinessById(id) {
  return businesses.find((b) => b.id === id)
}

export function searchBusinesses({ term = '', category = 'All', city = 'All' }) {
  const normalizedTerm = term.toLowerCase().trim()
  return getAllBusinesses()
    .filter((b) => (category === 'All' ? true : b.category === category))
    .filter((b) => (city === 'All' ? true : b.address.city === city))
    .filter((b) => {
      if (!normalizedTerm) return true
      const haystack = `${b.name} ${b.category} ${b.address.city} ${(b.keywords || []).join(' ')}`.toLowerCase()
      return haystack.includes(normalizedTerm)
    })
    .sort((a, b) => {
      if (a.subscription === b.subscription) return a.name.localeCompare(b.name)
      return a.subscription === 'PREMIUM' ? -1 : 1
    })
}

export function paginate(items, page = 1, pageSize = 9) {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize
  }
}

