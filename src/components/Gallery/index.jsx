import { useMemo, useState, useEffect, useCallback } from 'react'
import './style.css'

function Gallery({ images = [], name = 'Gallery' }) {
  const pics = useMemo(() => images.filter(Boolean), [images])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const open = (idx) => {
    setCurrent(idx)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % pics.length)
  }, [pics.length])

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + pics.length) % pics.length)
  }, [pics.length])

  useEffect(() => {
    const onKey = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, next, prev])

  if (!pics.length) {
    return (
      <div className="gallery-empty glass-card">
        <p className="text-dim">No images provided.</p>
      </div>
    )
  }

  return (
    <>
      <div className="gallery-grid">
        {pics.map((img, idx) => (
          <button
            key={img + idx}
            className="gallery-item"
            type="button"
            onClick={() => open(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={img} alt={`${name} image ${idx + 1}`} loading="lazy" />
            <div className="gallery-overlay">
              <span className="zoom-icon">🔍</span>
            </div>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-label="Image viewer" onClick={close}>
          <button className="lightbox-close" aria-label="Close" onClick={close}>
            ×
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={pics[current]} alt={`${name} full view ${current + 1}`} />
          </div>
          {pics.length > 1 && (
            <>
              <button className="lightbox-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev() }}>
                ←
              </button>
              <button className="lightbox-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); next() }}>
                →
              </button>
              <div className="lightbox-counter">
                {current + 1} / {pics.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Gallery

