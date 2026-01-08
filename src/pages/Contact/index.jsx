import { useState } from 'react'
import Button from '../../components/Button'
import GlassCard from '../../components/GlassCard'
import './style.css'

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    reason: 'General inquiry',
    message: ''
  })

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message submitted (placeholder). No backend connected yet.')
  }

  return (
    <div className="container section contact">
      <div className="contact__header">
        <h1>Contact Us</h1>
        <p className="text-dim">
          Business owners can reach out for support, premium inquiries, or listing updates.
        </p>
      </div>

      <GlassCard className="contact__card">
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="contact__field">
            <label htmlFor="reason">Reason</label>
            <select
              id="reason"
              value={form.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
            >
              <option>General inquiry</option>
              <option>Premium listing</option>
              <option>Listing update</option>
              <option>Technical issue</option>
            </select>
          </div>

          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              required
            />
          </div>

          <Button type="submit" fullWidth>
            Send Message
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}

export default Contact
























