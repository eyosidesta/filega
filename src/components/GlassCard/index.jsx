import './style.css'

function GlassCard({ children, variant = 'default', className = '' }) {
  return <div className={`glass-card glass-card--${variant} ${className}`.trim()}>{children}</div>
}

export default GlassCard

