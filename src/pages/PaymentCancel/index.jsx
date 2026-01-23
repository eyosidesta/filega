import { Link, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import GlassCard from '../../components/GlassCard'
import './style.css'

function PaymentCancel() {
  const [searchParams] = useSearchParams()
  const businessId = searchParams.get('businessId')

  return (
    <div className="container section payment-status">
      <div className="payment-status__header">
        <h1>Payment canceled</h1>
        <p className="text-dim">
          Your Stripe payment was canceled. You can try again or return home.
        </p>
      </div>

      <GlassCard className="payment-status__card">
        <div className="pill pill--pending">Payment not completed</div>
        <div className="payment-status__actions">
          {businessId && (
            <Link to={`/business/${businessId}`}>
              <Button variant="secondary" type="button">
                View business
              </Button>
            </Link>
          )}
          <Link to="/submit">
            <Button variant="primary" type="button">
              Try payment again
            </Button>
          </Link>
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

export default PaymentCancel
