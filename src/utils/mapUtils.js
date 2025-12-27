export function filterByBounds(items, bounds) {
  if (!bounds) return items
  const { north, south, east, west } = bounds
  return items.filter((item) => {
    const { lat, lng } = item.address
    return lat <= north && lat >= south && lng <= east && lng >= west
  })
}

export function mockBounds() {
  return {
    north: 90,
    south: -90,
    east: 180,
    west: -180
  }
}

