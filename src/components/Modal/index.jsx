import './style.css'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content">
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal












