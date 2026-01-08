import { useRef, useState } from 'react'
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
  const [images, setImages] = useState([]) // { url, name }
  const [heroImage, setHeroImage] = useState(null) // { url, name }
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroUploadError, setHeroUploadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const fileInputRef = useRef(null)
  const heroFileInputRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const presignRes = await fetch(`${API_BASE}/media/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'businesses'
        })
      })
      if (!presignRes.ok) throw new Error('Failed to presign upload')
      const { uploadUrl, publicUrl } = await presignRes.json()

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': file.type,
          'x-amz-acl': 'public-read',
         },
        body: file
      })
      if (!putRes.ok) throw new Error('Failed to upload to storage')

      setImages((prev) => [...prev, { url: publicUrl, name: file.name }])
    } catch (err) {
      console.log('error is: ', err)
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')
    setSubmitting(true)
    const payload = {
      ...form,
      images: images.map((i) => i.url),
      heroImage: heroImage?.url,
    }
    fetch(`${API_BASE}/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-amz-acl': 'public-read' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Submission failed')
        return res.json()
      })
      .then(() => {
        setSubmitSuccess('Submitted for review.')
      })
      .catch((err) => {
        setSubmitError(err.message || 'Submission failed')
      })
      .finally(() => setSubmitting(false))
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
              <label>Email (optional)</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="submit__field two-col">
            <div>
              <label>Website (optional)</label>
              <input value={form.website} onChange={(e) => handleChange('website', e.target.value)} />
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
              <label>Postal/ZIP</label>
              <input
                value={form.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="submit__field">
            <label>Hero Image (main)</label>
            <div className="upload-box">
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setHeroUploadError('')
                  setHeroUploading(true)
                  try {
                    const presignRes = await fetch(`${API_BASE}/media/presign`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                        folder: 'businesses'
                      })
                    })
                    if (!presignRes.ok) throw new Error('Failed to presign upload')
                    const { uploadUrl, publicUrl } = await presignRes.json()

                    const putRes = await fetch(uploadUrl, {
                      method: 'PUT',
                      headers: { 'Content-Type': file.type },
                      body: file
                    })
                    if (!putRes.ok) throw new Error('Failed to upload to storage')

                    setHeroImage({ url: publicUrl, name: file.name })
                  } catch (err) {
                    setHeroUploadError(err.message || 'Upload failed')
                  } finally {
                    setHeroUploading(false)
                    if (heroFileInputRef.current) heroFileInputRef.current.value = ''
                  }
                }}
                className="hidden-file"
              />
              <Button type="button" variant="secondary" onClick={() => heroFileInputRef.current?.click()}>
                Select hero image
              </Button>
              <div className="upload-help text-dim">One main image; shown as the hero on detail.</div>
              {heroUploading && <div className="upload-status">Uploading...</div>}
              {heroUploadError && <div className="upload-error">{heroUploadError}</div>}
              {heroImage && (
                <div className="upload-list">
                  <div className="upload-item">
                    <span className="pill">Hero</span>
                    <span className="upload-name">{heroImage.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="submit__field">
            <label>Images</label>
            <div className="upload-box">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file"
              />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Select image
              </Button>
              <div className="upload-help text-dim">Upload one image at a time; stored in Spaces.</div>
              {uploading && <div className="upload-status">Uploading...</div>}
              {uploadError && <div className="upload-error">{uploadError}</div>}
              {images.length > 0 && (
                <div className="upload-list">
                  {images.map((img) => (
                    <div key={img.url} className="upload-item">
                      <span className="pill">Image</span>
                      <span className="upload-name">{img.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" fullWidth>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
          {submitSuccess && <div className="submit-success">{submitSuccess}</div>}
          {submitError && <div className="submit-error">{submitError}</div>}
        </form>
      </GlassCard>
    </div>
  )
}

export default SubmitBusiness











