import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GlassCard from '../../../components/GlassCard'
import Button from '../../../components/Button'
import { adminFetch } from '../../utils/adminApi'
import './style.css'

const emptyFilters = {
  status: '',
  payment_status: '',
  payment_method: '',
  subscription: '',
  city: '',
  provinceOrState: '',
  country: '',
  renewalDueFrom: '',
  renewalDueTo: '',
}

function AdminBusinesses() {
  const [filters, setFilters] = useState(emptyFilters)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buildQuery = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    const query = params.toString()
    return query ? `?${query}` : ''
  }

  const loadBusinesses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch(`/admin/businesses${buildQuery()}`)
      if (!res.ok) throw new Error('Failed to load businesses')
      const data = await res.json()
      setBusinesses(data)
    } catch (err) {
      setError(err.message || 'Failed to load businesses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBusinesses()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
  }

  return (
    <div className="admin-businesses">
      <div className="admin-businesses__header">
        <div>
          <h1>Businesses</h1>
          <p className="text-dim">Filter and manage registrations, payments, and renewals.</p>
        </div>
        <div className="admin-businesses__actions">
          <Button variant="secondary" onClick={loadBusinesses}>
            Refresh
          </Button>
          <Link to="/admin/businesses/new">
            <Button variant="primary">Add Business</Button>
          </Link>
        </div>
      </div>

      <GlassCard className="admin-filters">
        <div className="admin-filters__grid">
          <label>
            Status
            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <label>
            Payment Status
            <select
              value={filters.payment_status}
              onChange={(e) => handleFilterChange('payment_status', e.target.value)}
            >
              <option value="">All</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label>
            Payment Method
            <select
              value={filters.payment_method}
              onChange={(e) => handleFilterChange('payment_method', e.target.value)}
            >
              <option value="">All</option>
              <option value="stripe">Stripe</option>
              <option value="etransfer">E-Transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Subscription
            <select
              value={filters.subscription}
              onChange={(e) => handleFilterChange('subscription', e.target.value)}
            >
              <option value="">All</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </label>
          <label>
            City
            <input value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} />
          </label>
          <label>
            Province/State
            <input
              value={filters.provinceOrState}
              onChange={(e) => handleFilterChange('provinceOrState', e.target.value)}
            />
          </label>
          <label>
            Country
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All</option>
              <option value="CA">Canada</option>
              <option value="US">United States</option>
            </select>
          </label>
          <label>
            Renewal Due From
            <input
              type="date"
              value={filters.renewalDueFrom}
              onChange={(e) => handleFilterChange('renewalDueFrom', e.target.value)}
            />
          </label>
          <label>
            Renewal Due To
            <input
              type="date"
              value={filters.renewalDueTo}
              onChange={(e) => handleFilterChange('renewalDueTo', e.target.value)}
            />
          </label>
        </div>
        <div className="admin-filters__actions">
          <Button variant="primary" onClick={loadBusinesses}>
            Apply Filters
          </Button>
          <Button variant="secondary" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </GlassCard>

      {error && <div className="admin-error">{error}</div>}
      {loading && <div className="admin-loading">Loading...</div>}

      <GlassCard className="admin-table">
        <div className="admin-table__head">
          <span>Business</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Plan</span>
          <span>City</span>
          <span>Renewal</span>
          <span>Action</span>
        </div>
        {businesses.map((business) => (
          <div className="admin-table__row" key={business.id}>
            <div className="admin-table__main">
              <strong>{business.name}</strong>
              <span>{business.category}</span>
            </div>
            <span className="admin-pill">{business.status}</span>
            <span className="admin-pill">
              {business.payment_status}
              {business.payment_method ? ` · ${business.payment_method}` : ''}
            </span>
            <span className="admin-pill">{business.subscription}</span>
            <span>{business.city}</span>
            <span>{business.renewalDueAt ? new Date(business.renewalDueAt).toLocaleDateString() : '-'}</span>
            <Link to={`/admin/businesses/${business.id}`}>
              <Button variant="secondary">Open</Button>
            </Link>
          </div>
        ))}
        {!loading && businesses.length === 0 && (
          <div className="admin-empty">No businesses match the current filters.</div>
        )}
      </GlassCard>
    </div>
  )
}

export default AdminBusinesses
