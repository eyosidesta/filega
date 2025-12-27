import './style.css'

function Skeleton({ height = 16, width = '100%' }) {
  return <div className="skeleton" style={{ height, width }} />
}

export default Skeleton

