import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GlassCard from '../../../components/GlassCard'
import Button from '../../../components/Button'
import { adminFetch } from '../../utils/adminApi'
import './style.css'

const toDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

const parseImages = (value) =>
  value
    .split(',')
    .map((img) => img.trim())
    .filter(Boolean)

function AdminBusinessDetail() {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [form, setForm] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const imageValue = useMemo(() => (form?.images || []).join(', '), [form?.images])

  const loadBusiness = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch(`/admin/businesses/${id}`)
      if (!res.ok) throw new Error('Failed to load business')
      const data = await res.json()
      setBusiness(data)
      setForm({
        name: data.name || '',
        category: data.category || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        street: data.street || '',
        unit: data.unit || '',
        city: data.city || '',
        provinceOrState: data.provinceOrState || '',
        postalCode: data.postalCode || '',
        country: data.country || 'CA',
        lat: data.lat ?? '',
        lng: data.lng ?? '',
        status: data.status || 'pending',
        subscription: data.subscription || 'BASIC',
        heroImage: data.heroImage || '',
        images: data.images || [],
      })
      setPayment({
        payment_status: data.payment_status || 'pending_payment',
        payment_method: data.payment_method || '',
        paidAmountCents: data.paidAmountCents ?? '',
        currency: data.currency || '',
        paidAt: toDateInput(data.paidAt),
        renewalDueAt: toDateInput(data.renewalDueAt),
        paymentReference: data.paymentReference || '',
        paymentNotes: data.paymentNotes || '',
      })
    } catch (err) {
      setError(err.message || 'Failed to load business')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBusiness()
  }, [id])

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updatePayment = (key, value) => {
    setPayment((prev) => ({ ...prev, [key]: value }))
  }

  const saveBusiness = async () => {
    if (!form) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        ...form,
        lat: form.lat === '' ? undefined : Number(form.lat),
        lng: form.lng === '' ? undefined : Number(form.lng),
        images: Array.isArray(form.images) ? form.images : parseImages(form.images || ''),
      }
      const res = await adminFetch(`/admin/businesses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update business')
      setSuccess('Business updated successfully.')
      await loadBusiness()
    } catch (err) {
      setError(err.message || 'Failed to update business')
    } finally {
      setSaving(false)
    }
  }

  const savePayment = async () => {
    if (!payment) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        ...payment,
        paidAmountCents: payment.paidAmountCents === '' ? undefined : Number(payment.paidAmountCents),
        paidAt: payment.paidAt || undefined,
        renewalDueAt: payment.renewalDueAt || undefined,
      }
      const res = await adminFetch(`/admin/businesses/${id}/payment`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update payment')
      setSuccess('Payment updated successfully.')
      await loadBusiness()
    } catch (err) {
      setError(err.message || 'Failed to update payment')
    } finally {
      setSaving(false)
    }
  }

  const runAction = async (path) => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await adminFetch(path, { method: 'POST' })
      if (!res.ok) throw new Error('Action failed')
      setSuccess('Action completed.')
      await loadBusiness()
    } catch (err) {
      setError(err.message || 'Action failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !business) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-detail">
      <div className="admin-detail__header">
        <div>
          <h1>{business?.name || 'Business detail'}</h1>
          <p className="text-dim">Review, update details, and manage payment status.</p>
        </div>
        <Link to="/admin/businesses">
          <Button variant="secondary">Back to list</Button>
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-detail__grid">
        <GlassCard className="admin-card">
          <h2>Business Details</h2>
          {form && (
            <div className="admin-form">
              <label>
                Name
                <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
              </label>
              <label>
                Category
                <input value={form.category} onChange={(e) => updateForm('category', e.target.value)} />
              </label>
              <label>
                Phone
                <input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
              </label>
              <label>
                Website
                <input value={form.website} onChange={(e) => updateForm('website', e.target.value)} />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>
              <label>
                Subscription
                <select value={form.subscription} onChange={(e) => updateForm('subscription', e.target.value)}>
                  <option value="BASIC">Basic</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </label>
              <label>
                Street
                <input value={form.street} onChange={(e) => updateForm('street', e.target.value)} />
              </label>
              <label>
                Unit
                <input value={form.unit} onChange={(e) => updateForm('unit', e.target.value)} />
              </label>
              <label>
                City
                <input value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
              </label>
              <label>
                Province/State
                <input
                  value={form.provinceOrState}
                  onChange={(e) => updateForm('provinceOrState', e.target.value)}
                />
              </label>
              <label>
                Postal/Zip
                <input value={form.postalCode} onChange={(e) => updateForm('postalCode', e.target.value)} />
              </label>
              <label>
                Country
                <select value={form.country} onChange={(e) => updateForm('country', e.target.value)}>
                  <option value="CA">Canada</option>
                  <option value="US">United States</option>
                </select>
              </label>
              <label>
                Latitude
                <input value={form.lat} onChange={(e) => updateForm('lat', e.target.value)} />
              </label>
              <label>
                Longitude
                <input value={form.lng} onChange={(e) => updateForm('lng', e.target.value)} />
              </label>
              <label>
                Hero Image URL
                <input value={form.heroImage} onChange={(e) => updateForm('heroImage', e.target.value)} />
              </label>
              <label className="admin-form__full">
                Gallery Images (comma-separated URLs)
                <textarea
                  rows={3}
                  value={imageValue}
                  onChange={(e) => updateForm('images', parseImages(e.target.value))}
                />
              </label>
              <div className="admin-form__actions">
                <Button variant="primary" onClick={saveBusiness} disabled={saving}>
                  Save Business
                </Button>
                <Button variant="secondary" onClick={() => runAction(`/admin/businesses/${id}/approve`)}>
                  Approve
                </Button>
                <Button variant="secondary" onClick={() => runAction(`/admin/businesses/${id}/reject`)}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="admin-card">
          <h2>Payment Details</h2>
          {payment && (
            <div className="admin-form">
              <label>
                Payment Status
                <select
                  value={payment.payment_status}
                  onChange={(e) => updatePayment('payment_status', e.target.value)}
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="active">Active</option>
                  <option value="overdue">Overdue</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label>
                Payment Method
                <select
                  value={payment.payment_method}
                  onChange={(e) => updatePayment('payment_method', e.target.value)}
                >
                  <option value="">Select method</option>
                  <option value="stripe">Stripe</option>
                  <option value="etransfer">E-Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Paid Amount (cents)
                <input
                  type="number"
                  value={payment.paidAmountCents}
                  onChange={(e) =>
                    updatePayment('paidAmountCents', e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </label>
              <label>
                Currency
                <input value={payment.currency} onChange={(e) => updatePayment('currency', e.target.value)} />
              </label>
              <label>
                Paid At
                <input
                  type="date"
                  value={payment.paidAt}
                  onChange={(e) => updatePayment('paidAt', e.target.value)}
                />
              </label>
              <label>
                Renewal Due At
                <input
                  type="date"
                  value={payment.renewalDueAt}
                  onChange={(e) => updatePayment('renewalDueAt', e.target.value)}
                />
              </label>
              <label className="admin-form__full">
                Payment Reference
                <input
                  value={payment.paymentReference}
                  onChange={(e) => updatePayment('paymentReference', e.target.value)}
                />
              </label>
              <label className="admin-form__full">
                Payment Notes
                <textarea
                  rows={3}
                  value={payment.paymentNotes}
                  onChange={(e) => updatePayment('paymentNotes', e.target.value)}
                />
              </label>
              <div className="admin-form__actions">
                <Button variant="primary" onClick={savePayment} disabled={saving}>
                  Save Payment
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default AdminBusinessDetail
