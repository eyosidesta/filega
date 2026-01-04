import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import FilterButton from '../../components/FilterButton'
import FeaturedCarousel from '../../components/FeaturedCarousel'
import BusinessList from '../../components/BusinessList'
import GlassCard from '../../components/GlassCard'
import Button from '../../components/Button'
import './style.css'

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

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
    if (!search) return all
    const t = search.toLowerCase()
    return all.filter(
      (b) =>
        b.name.toLowerCase().includes(t) ||
        (b.category || '').toLowerCase().includes(t) ||
        (b.city || '').toLowerCase().includes(t)
    )
  }, [all, search])

  const premium = useMemo(
    () => filtered.filter((b) => b.subscription === 'PREMIUM').slice(0, 6),
    [filtered]
  )
  const recent = useMemo(() => filtered.slice(0, 6), [filtered])

  return (
    <div className="home">
      <section className="hero section">
        <div className="container hero__content glass-card">
          <div>
            <p className="hero__eyebrow">Ethiopian Businesses · Canada &amp; US</p>
            <h1 className="hero__title">Discover authentic Ethiopian businesses near you.</h1>
            <p className="hero__subtitle">
              Search, filter, and explore trusted listings. Premium businesses appear at the top.
            </p>
            <div className="hero__actions">
              <SearchBar value={search} onChange={setSearch} placeholder="Search by name, keyword..." />
              <FilterButton onClick={() => navigate('/businesses')} />
            </div>
            <div className="hero__cta-row">
              <Button onClick={() => navigate('/map')}>See on Map</Button>
              <Button variant="secondary" onClick={() => navigate('/submit')}>
                Submit Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section__header">
          <h2>Featured Premium</h2>
          <Button variant="secondary" onClick={() => navigate('/premium')}>
            View all
          </Button>
        </div>
        <div className="container">
          {loading ? (
            <p className="text-dim">Loading...</p>
          ) : (
            <FeaturedCarousel items={premium} onView={(b) => navigate(`/business/${b.id}`)} />
          )}
        </div>
      </section>

      <section className="section">
        <div className="container section__header">
          <h2>Recently Added</h2>
          <Button variant="secondary" onClick={() => navigate('/businesses')}>
            Browse all
          </Button>
        </div>
        <div className="container">
          {loading ? (
            <p className="text-dim">Loading...</p>
          ) : (
            <BusinessList items={recent} onView={(b) => navigate(`/business/${b.id}`)} />
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

