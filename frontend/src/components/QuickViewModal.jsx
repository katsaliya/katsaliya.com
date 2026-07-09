import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function QuickViewModal({
  projectName,
  media,
  mediaType = 'image',
  description,
  onClose,
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const renderMedia = () => {
    if (mediaType === 'component') {
      return media
    } else if (mediaType === 'video') {
      return (
        <video
          src={media}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )
    } else {
      return <img src={media} alt={projectName} />
    }
  }

  return createPortal(
    <div className="quick-view-modal-backdrop" onClick={handleBackdropClick}>
      <div className="quick-view-modal">
        <button
          className="quick-view-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="quick-view-modal__content">
          {/* Media preview */}
          <div className="quick-view-modal__media">
            {renderMedia()}
          </div>

          {/* Text content */}
          <div className="quick-view-modal__text">
            <h2>{projectName}</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
