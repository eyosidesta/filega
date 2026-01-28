import { useState } from 'react'
import { Link } from 'react-router-dom'
import GlassCard from '../../../components/GlassCard'
import Button from '../../../components/Button'
import { adminFetch } from '../../utils/adminApi'
import '../BusinessDetail/style.css'
import './style.css'

const parseImages = (value) =>
  value
    .split(',')
    .map((img) => img.trim())
    .filter(Boolean)

const emptyForm = {
  name: '',
  category: '',
  phone: '',
  email: '',
  website: '',
  street: '',
  unit: '',
  city: '',
  provinceOrState: '',
  postalCode: '',
  country: 'CA',
  subscription: 'BASIC',
  status: 'pending',
  heroImage: '',
  imagesInput: '',
  payment_status: 'pending_payment',
  payment_method: '',
  paidAmountCents: '',
  currency: '',
  paidAt: '',
  renewalDueAt: '',
  paymentReference: '',
  paymentNotes: '',
}

function AdminNewBusiness() {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        name: form.name,
        category: form.category,
        phone: form.phone,
        email: form.email || undefined,
        website: form.website || undefined,
        street: form.street,
        unit: form.unit || undefined,
        city: form.city,
        provinceOrState: form.provinceOrState,
        postalCode: form.postalCode,
        country: form.country,
        subscription: form.subscription,
        status: form.status,
        heroImage: form.heroImage || undefined,
        images: parseImages(form.imagesInput),
        payment_status: form.payment_status,
        payment_method: form.payment_method || undefined,
        paidAmountCents: form.paidAmountCents ? Number(form.paidAmountCents) : undefined,
        currency: form.currency || undefined,
        paidAt: form.paidAt || undefined,
        renewalDueAt: form.renewalDueAt || undefined,
        paymentReference: form.paymentReference || undefined,
        paymentNotes: form.paymentNotes || undefined,
      }

      const res = await adminFetch('/admin/businesses', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create business')
      setSuccess('Business created successfully.')
      setForm(emptyForm)
    } catch (err) {
      setError(err.message || 'Failed to create business')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-new">
      <div className="admin-detail__header">
        <div>
          <h1>Create Business</h1>
          <p className="text-dim">Add a business on behalf of a client.</p>
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
          <div className="admin-form">
            <label>
              Name
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </label>
            <label>
              Category
              <input value={form.category} onChange={(e) => updateField('category', e.target.value)} />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </label>
            <label>
              Email
              <input value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </label>
            <label>
              Website
              <input value={form.website} onChange={(e) => updateField('website', e.target.value)} />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
            <label>
              Subscription
              <select value={form.subscription} onChange={(e) => updateField('subscription', e.target.value)}>
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </label>
            <label>
              Street
              <input value={form.street} onChange={(e) => updateField('street', e.target.value)} />
            </label>
            <label>
              Unit
              <input value={form.unit} onChange={(e) => updateField('unit', e.target.value)} />
            </label>
            <label>
              City
              <input value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            </label>
            <label>
              Province/State
              <input
                value={form.provinceOrState}
                onChange={(e) => updateField('provinceOrState', e.target.value)}
              />
            </label>
            <label>
              Postal/Zip
              <input value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
            </label>
            <label>
              Country
              <select value={form.country} onChange={(e) => updateField('country', e.target.value)}>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
              </select>
            </label>
            <label>
              Hero Image URL
              <input value={form.heroImage} onChange={(e) => updateField('heroImage', e.target.value)} />
            </label>
            <label className="admin-form__full">
              Gallery Images (comma-separated URLs)
              <textarea
                rows={3}
                value={form.imagesInput}
                onChange={(e) => updateField('imagesInput', e.target.value)}
              />
            </label>
          </div>
        </GlassCard>

        <GlassCard className="admin-card">
          <h2>Payment Details</h2>
          <div className="admin-form">
            <label>
              Payment Status
              <select
                value={form.payment_status}
                onChange={(e) => updateField('payment_status', e.target.value)}
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
                value={form.payment_method}
                onChange={(e) => updateField('payment_method', e.target.value)}
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
                value={form.paidAmountCents}
                onChange={(e) => updateField('paidAmountCents', e.target.value)}
              />
            </label>
            <label>
              Currency
              <input value={form.currency} onChange={(e) => updateField('currency', e.target.value)} />
            </label>
            <label>
              Paid At
              <input type="date" value={form.paidAt} onChange={(e) => updateField('paidAt', e.target.value)} />
            </label>
            <label>
              Renewal Due At
              <input
                type="date"
                value={form.renewalDueAt}
                onChange={(e) => updateField('renewalDueAt', e.target.value)}
              />
            </label>
            <label className="admin-form__full">
              Payment Reference
              <input
                value={form.paymentReference}
                onChange={(e) => updateField('paymentReference', e.target.value)}
              />
            </label>
            <label className="admin-form__full">
              Payment Notes
              <textarea
                rows={3}
                value={form.paymentNotes}
                onChange={(e) => updateField('paymentNotes', e.target.value)}
              />
            </label>
          </div>
        </GlassCard>
      </div>

      <div className="admin-form__actions admin-new__actions">
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          Create Business
        </Button>
        <Button variant="secondary" onClick={() => setForm(emptyForm)} disabled={saving}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default AdminNewBusiness
