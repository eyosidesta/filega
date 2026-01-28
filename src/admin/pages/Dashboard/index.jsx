import { useEffect, useMemo, useState } from 'react'
import GlassCard from '../../../components/GlassCard'
import { adminFetch } from '../../utils/adminApi'
import './style.css'

const buildCounts = (items = []) => {
  return items.reduce(
    (acc, item) => {
      acc.total += 1
      if (item.status === 'active') acc.active += 1
      if (item.status === 'pending') acc.pending += 1
      if (item.status === 'rejected') acc.rejected += 1
      if (item.payment_status === 'pending_payment') acc.pendingPayment += 1
      if (item.payment_status === 'overdue') acc.overdue += 1
      if (item.subscription === 'PREMIUM') acc.premium += 1
      if (item.subscription === 'BASIC') acc.basic += 1
      return acc
    },
    {
      total: 0,
      active: 0,
      pending: 0,
      rejected: 0,
      pendingPayment: 0,
      overdue: 0,
      premium: 0,
      basic: 0,
    },
  )
}

function AdminDashboard() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const counts = useMemo(() => buildCounts(businesses), [businesses])

  const loadBusinesses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/admin/businesses')
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

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Admin Overview</h1>
        <p className="text-dim">High-level business, payment, and plan status.</p>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {loading && <div className="admin-loading">Loading...</div>}

      <div className="admin-dashboard__grid">
        <GlassCard className="admin-metric">
          <h3>Total Businesses</h3>
          <strong>{counts.total}</strong>
          <span>All registrations</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Active</h3>
          <strong>{counts.active}</strong>
          <span>Live listings</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Pending</h3>
          <strong>{counts.pending}</strong>
          <span>Awaiting activation</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Pending Payment</h3>
          <strong>{counts.pendingPayment}</strong>
          <span>Unpaid businesses</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Overdue</h3>
          <strong>{counts.overdue}</strong>
          <span>Renewals past due</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Premium</h3>
          <strong>{counts.premium}</strong>
          <span>Premium plan</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Basic</h3>
          <strong>{counts.basic}</strong>
          <span>Basic plan</span>
        </GlassCard>
        <GlassCard className="admin-metric">
          <h3>Rejected</h3>
          <strong>{counts.rejected}</strong>
          <span>Rejected listings</span>
        </GlassCard>
      </div>
    </div>
  )
}

export default AdminDashboard
