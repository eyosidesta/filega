import './style.css'

function Gallery({ images = [] }) {
  if (!images.length) return null
  return (
    <div className="gallery">
      <img className="gallery__main" src={images[0]} alt="" />
      <div className="gallery__thumbs">
        {images.slice(0, 4).map((img, idx) => (
          <img key={img + idx} src={img} alt="" />
        ))}
      </div>
    </div>
  )
}

export default Gallery

