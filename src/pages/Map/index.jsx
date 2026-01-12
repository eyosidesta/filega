import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import MapPlaceholder from '../../components/MapPlaceholder'
import { API_BASE } from '../../utils/api'
import './style.css'

const countryOptions = [
  { label: 'All', value: 'all' },
  { label: 'US', value: 'US' },
  { label: 'Canada', value: 'CA' },
]

function MapPage() {
  const navigate = useNavigate()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [mapLoading, setMapLoading] = useState(false)
  const [mapError, setMapError] = useState('')
  const [term, setTerm] = useState('')
  const [country, setCountry] = useState('all')
  const [category, setCategory] = useState('All')
  const [mapReady, setMapReady] = useState(false)

  const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const clusterRef = useRef(null)

  const loadGoogleMaps = (apiKey) => {
    if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
    if (window.google?.maps) return Promise.resolve(window.google.maps)
    if (window.__googleMapsPromise) return window.__googleMapsPromise

    const existing = document.getElementById('google-maps-sdk')
    if (existing) {
      return new Promise((resolve, reject) => {
        if (window.google?.maps) {
          resolve(window.google.maps)
          return
        }
        const onLoad = () => resolve(window.google.maps)
        const onError = () => reject(new Error('Failed to load Google Maps'))
        existing.addEventListener('load', onLoad, { once: true })
        existing.addEventListener('error', onError, { once: true })
      })
    }

    window.__googleMapsPromise = new Promise((resolve, reject) => {
      window.__initMap = () => resolve(window.google.maps)
      const script = document.createElement('script')
      script.id = 'google-maps-sdk'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__initMap`
      script.async = true
      script.defer = true
      script.onerror = () => reject(new Error('Failed to load Google Maps'))
      document.head.appendChild(script)
    })
    return window.__googleMapsPromise
  }

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

  useEffect(() => {
    if (!MAPS_KEY) return
    let cancelled = false
    setMapError('')
    setMapLoading(true)
    setMapReady(false)
    loadGoogleMaps(MAPS_KEY)
      .then((googleMaps) => {
        if (cancelled) return
        if (!mapRef.current) return
        mapInstanceRef.current = new googleMaps.Map(mapRef.current, {
          center: { lat: 56, lng: -97 }, // midpoint of US/CA
          zoom: 4,
          mapId: 'filega-map',
          gestureHandling: 'greedy',
        })
        setMapReady(true)
      })
      .catch((err) => {
        if (!cancelled) setMapError(err.message || 'Unable to load map')
      })
      .finally(() => {
        if (!cancelled) setMapLoading(false)
      })

    return () => {
      cancelled = true
      try {
        if (clusterRef.current) {
          clusterRef.current.clearMarkers()
          clusterRef.current = null
        }
        markersRef.current.forEach((m) => m.setMap(null))
        markersRef.current = []
        if (mapInstanceRef.current) {
          window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current)
        }
      } catch (_) {
        // swallow cleanup errors
      } finally {
        mapInstanceRef.current = null
      }
    }
  }, [MAPS_KEY])

  const categories = useMemo(() => {
    const set = new Set()
    all.forEach((b) => b.category && set.add(b.category))
    return ['All', ...Array.from(set).sort()]
  }, [all])

  const filtered = useMemo(() => {
    const t = term.toLowerCase().trim()
    return all
      .filter((b) => (country === 'all' ? true : (b.country || '').toUpperCase() === country))
      .filter((b) => (category === 'All' ? true : b.category === category))
      .filter((b) => {
        if (!t) return true
        return (
          b.name.toLowerCase().includes(t) ||
          (b.city || '').toLowerCase().includes(t) ||
          (b.provinceOrState || '').toLowerCase().includes(t) ||
          (b.category || '').toLowerCase().includes(t)
        )
      })
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  }, [all, country, category, term])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!mapReady || !map || !window.google || !window.google.maps) return

    if (clusterRef.current) {
      clusterRef.current.clearMarkers()
      clusterRef.current = null
    }
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const withCoords = filtered.filter((b) => {
      const lat = Number(b.lat)
      const lng = Number(b.lng)
      if (Number.isNaN(lat) || Number.isNaN(lng)) return false
      if (lat === 0 && lng === 0) return false
      return true
    })

    if (withCoords.length === 0) return

    const bounds = new window.google.maps.LatLngBounds()
    markersRef.current = withCoords.map((b) => {
      const position = { lat: Number(b.lat), lng: Number(b.lng) }
      const marker = new window.google.maps.Marker({
        position,
        title: b.name,
      })
      marker.addListener('click', () => navigate(`/business/${b.id}`))
      bounds.extend(position)
      return marker
    })

    clusterRef.current = new MarkerClusterer({ map, markers: markersRef.current })

    map.fitBounds(bounds)
    if (map.getZoom() > 12) {
      map.setZoom(12)
    }
  }, [filtered, navigate, mapReady])

  const grouped = useMemo(() => {
    const map = new Map()
    filtered.forEach((b) => {
      const key = b.category || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(b)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  return (
    <div className="map-page section">
      <div className="container map-page__header">
        <div>
          <p className="text-dim">Map & Directory</p>
          <h1>Explore businesses across Canada and the US</h1>
        </div>
        <div className="map-page__filters">
          <div className="map-page__radios">
            {countryOptions.map((opt) => (
              <label key={opt.value} className="radio-chip">
                <input
                  type="radio"
                  name="country"
                  value={opt.value}
                  checked={country === opt.value}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="map-page__inputs">
            <input
              className="input"
              placeholder="Search name, city, province/state, category..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="map-page__map-wrap">
        <div className="map-canvas-wrap">
          <div className="map-canvas glass-card" ref={mapRef} />
          {!MAPS_KEY && <div className="map-canvas__overlay">Add VITE_GOOGLE_MAPS_API_KEY to enable the map.</div>}
          {MAPS_KEY && mapError && <div className="map-canvas__overlay">Map unavailable: {mapError}</div>}
          {MAPS_KEY && mapLoading && !mapError && <div className="map-canvas__overlay">Loading map...</div>}
        </div>
      </div>

      <div className="container map-page__list-wrap">
        <div className="map-page__meta text-dim">
          {loading ? 'Loading...' : `Showing ${filtered.length} businesses in ${country === 'all' ? 'US & Canada' : country === 'US' ? 'United States' : 'Canada'}`}
        </div>

        {grouped.length === 0 && !loading ? (
          <div className="glass-card map-page__empty">No businesses found for the current filters.</div>
        ) : (
          <div className="category-grid">
            {grouped.map(([cat, list]) => (
              <div className="category-card glass-card" key={cat}>
                <div className="category-card__header">
                  <h3>{cat}</h3>
                  <span className="pill">{list.length}</span>
                </div>
                <ul className="category-card__list">
                  {list.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        className="category-card__item"
                        onClick={() => navigate(`/business/${b.id}`)}
                      >
                        <div className="category-card__item-main">
                          <div className="category-card__name">
                            {b.name} {b.subscription === 'PREMIUM' && <span className="premium-mini">Premium</span>}
                          </div>
                          <div className="category-card__meta">
                            <span>{b.city}</span>
                            {b.provinceOrState && <span>{b.provinceOrState}</span>}
                            {b.phone && <span>{b.phone}</span>}
                          </div>
                        </div>
                        <span className="category-card__chevron">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage



