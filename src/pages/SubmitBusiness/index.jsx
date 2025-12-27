import { useState } from 'react'
import GlassCard from '../../components/GlassCard'
import Button from '../../components/Button'
import categories from '../../data/categories.json'
import './style.css'

function SubmitBusiness() {
  const [form, setForm] = useState({
    name: '',
    category: 'Restaurant',
    phone: '',
    website: '',
    street: '',
    city: '',
    provinceOrState: '',
    postalCode: '',
    country: 'CA',
    subscription: 'BASIC'
  })

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Submission received (placeholder). Payment and backend to be added later.')
  }

  return (
    <div className="container section submit">
      <div className="submit__header">
        <h1>List Your Business</h1>
        <p className="text-dim">
          Provide your business details. Payment and admin approval will be added later.
        </p>
      </div>

      <GlassCard className="submit__card">
        <form className="submit__form" onSubmit={handleSubmit}>
          <div className="submit__field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>

          <div className="submit__field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="submit__field two-col">
            <div>
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
            </div>
            <div>
              <label>Website (optional)</label>
              <input value={form.website} onChange={(e) => handleChange('website', e.target.value)} />
            </div>
          </div>

          <div className="submit__field two-col">
            <div>
              <label>Street</label>
              <input
                value={form.street}
                onChange={(e) => handleChange('street', e.target.value)}
                required
              />
            </div>
            <div>
              <label>City</label>
              <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} required />
            </div>
          </div>

          <div className="submit__field two-col">
            <div>
              <label>Province/State</label>
              <input
                value={form.provinceOrState}
                onChange={(e) => handleChange('provinceOrState', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Postal/ZIP</label>
              <input
                value={form.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="submit__field two-col">
            <div>
              <label>Country</label>
              <select value={form.country} onChange={(e) => handleChange('country', e.target.value)}>
                <option value="CA">Canada (CAD)</option>
                <option value="US">United States (USD)</option>
              </select>
            </div>
            <div>
              <label>Subscription</label>
              <select
                value={form.subscription}
                onChange={(e) => handleChange('subscription', e.target.value)}
              >
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
          </div>

          <Button type="submit" fullWidth>
            Submit (placeholder)
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}

export default SubmitBusiness



