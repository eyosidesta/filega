import './style.css'

function MapPlaceholder({ label = 'Map coming soon', children }) {
  return (
    <div className="map-placeholder">
      <div className="map-placeholder__badge">Placeholder</div>
      <div className="map-placeholder__text">{label}</div>
      {children}
    </div>
  )
}

export default MapPlaceholder

