import Button from '../Button'
import './style.css'

function Pagination({ page, pageSize, total, onPrev, onNext }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="pagination">
      <Button variant="secondary" onClick={onPrev} disabled={page <= 1}>
        Prev
      </Button>
      <span className="pagination__info">
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" onClick={onNext} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  )
}

export default Pagination

