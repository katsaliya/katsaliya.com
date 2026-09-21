import { useEffect, useRef, useState } from 'react'

export default function ProjectCard({
  media,
  mediaType = 'image',
  projectName,
  description,
  ribbonImage,
  caseStudyLink,
  onCaseStudyClick,
  onComingSoonClick,
  colorTheme,
}) {

  /* CSS alone can't shrink-wrap a container to a child sized by percentage in both
     axes at once (percentage `height` needs a *definite* parent height, which a
     shrink-to-fit parent doesn't have — the classic circularity). So we measure the
     media's real intrinsic size in JS and compute its contain-fit box within the
     stage ourselves, then size .media-frame to that exact pixel box. Everything else
     (background, hover scale, pill corners) just follows .media-frame's real size. */
  const stageRef = useRef(null)
  const mediaRef = useRef(null)
  const [frameSize, setFrameSize] = useState(null) // { width, height } in px, or null until measured

  useEffect(() => {
    const stageEl = stageRef.current
    const mediaEl = mediaRef.current
    if (!stageEl || !mediaEl) return

    const computeFrameSize = () => {
      const naturalW = mediaType === 'video' ? mediaEl.videoWidth : mediaEl.naturalWidth
      const naturalH = mediaType === 'video' ? mediaEl.videoHeight : mediaEl.naturalHeight
      if (!naturalW || !naturalH) return

      const stageRect = stageEl.getBoundingClientRect()
      const scale = Math.min(stageRect.width / naturalW, stageRect.height / naturalH)
      setFrameSize({ width: naturalW * scale, height: naturalH * scale })
    }

    computeFrameSize()

    const loadEvent = mediaType === 'video' ? 'loadedmetadata' : 'load'
    mediaEl.addEventListener(loadEvent, computeFrameSize)

    // Re-measure when the card's own width changes (responsive breakpoints, window resize)
    const resizeObserver = new ResizeObserver(computeFrameSize)
    resizeObserver.observe(stageEl)

    return () => {
      mediaEl.removeEventListener(loadEvent, computeFrameSize)
      resizeObserver.disconnect()
    }
  }, [mediaType, media])

  const frameStyle = frameSize
    ? { width: `${frameSize.width}px`, height: `${frameSize.height}px` }
    : undefined

  return (
    <div className={`card${colorTheme ? ` card--${colorTheme}` : ''}`} onClick={onCaseStudyClick}>
      {/* Media stage: fixed-size region the media sits within */}
      <div className="media-stage" ref={stageRef}>
        {/* Centers the frame within the stage; never itself scales or shows a background */}
        <div className="media">
          {/* Frame: sized in JS to exactly the media's own contain-fit box (any aspect
              ratio) — this is what scales on hover, and everything inside it
              (background, pills, arrow) travels with it at whatever size it measures. */}
          <div className="media-frame" style={frameStyle}>
            {mediaType === 'video' ? (
              <video ref={mediaRef} src={media} autoPlay loop muted playsInline />
            ) : (
              <img ref={mediaRef} src={media} alt={projectName} />
            )}

            {/* Tag pills - hidden at rest, positioned at the frame's corners on hover */}
            <div className="card-pill gold" style={{ '--rot': '-8deg' }}>
              Product
            </div>
            <div className="card-pill jade" style={{ '--rot': '6deg' }}>
              Design
            </div>
            <div className="card-pill orchid" style={{ '--rot': '-4deg' }}>
              Engineering
            </div>
            <div className="card-pill gold" style={{ '--rot': '5deg' }}>
              Frontend
            </div>

            {/* Arrow badge - hidden at rest, appears on hover */}
            <div className="arrow-badge">↗</div>
          </div>
        </div>
      </div>

      {/* Card body: title and description */}
      <div className="card-body">
        <div className="tag-static">product · design · engineering</div>
        <h3 className="card-title">{projectName}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  )
}
