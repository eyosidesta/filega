import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import GlassCard from '../../components/GlassCard'
import { API_BASE } from '../../utils/api'
import './style.css'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [status, setStatus] = useState('loading')
  const [business, setBusiness] = useState(null)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const statusCopy = useMemo(() => {
    if (status === 'loading') return 'Checking payment status...'
    if (status === 'active') return 'Payment confirmed. Your business is live.'
    if (status === 'pending') return 'Payment received. Finalizing activation...'
    if (status === 'pending_payment') return 'Awaiting payment confirmation...'
    if (status === 'rejected') return 'Payment failed. Please try again.'
    return 'Unable to verify payment.'
  }, [status])

  const fetchStatus = async () => {
    if (!businessId) {
      setError('Missing businessId in URL')
      setStatus('error')
      return
    }
    setChecking(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/businesses/${businessId}`)
      if (!res.ok) throw new Error('Failed to load business')
      const data = await res.json()
      setBusiness(data)
      setStatus(data.status === 'active' ? 'active' : data.payment_status || data.status)
    } catch (err) {
      setError(err.message || 'Failed to verify payment')
      setStatus('error')
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  return (
    <div className="container section payment-status">
      <div className="payment-status__header">
        <h1>Payment Status</h1>
        <p className="text-dim">
          We&apos;re confirming your payment with Stripe and activating your business.
        </p>
      </div>

      <GlassCard className="payment-status__card">
        <div className={`pill pill--${status}`}>
          {status === 'loading' || checking ? 'Checking...' : statusCopy}
        </div>

        {error && <div className="payment-status__error">{error}</div>}

        {business && (
          <div className="payment-status__details">
            <div>
              <span className="label">Business</span>
              <strong>{business.name}</strong>
            </div>
            <div>
              <span className="label">Plan</span>
              <strong>{business.subscription}</strong>
            </div>
            <div>
              <span className="label">Status</span>
              <strong>{status}</strong>
            </div>
          </div>
        )}

        <div className="payment-status__actions">
          <Button variant="secondary" onClick={fetchStatus} disabled={checking}>
            {checking ? 'Refreshing...' : 'Refresh status'}
          </Button>
          {businessId && (
            <Link to={`/business/${businessId}`}>
              <Button variant="primary" type="button">
                View business
              </Button>
            </Link>
          )}
          <Link to="/">
            <Button variant="ghost" type="button">
              Back home
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}

export default PaymentSuccess
