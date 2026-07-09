export default function ProjectCard({
  media,
  mediaType = 'image',
  projectName,
  description,
  ribbonImage,
  caseStudyLink,
  onCaseStudyClick,
  onComingSoonClick,
}) {

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
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      )
    } else {
      return <img src={media} alt={projectName} style={{ width: '100%', height: 'auto', display: 'block' }} />
    }
  }

  return (
    <>
      <div className="project-card" onClick={onCaseStudyClick} style={{ cursor: 'pointer' }}>
        {/* Ribbon image for awards/badges - positioned relative to card */}
        {ribbonImage && <img src={ribbonImage} alt="Award" className="project-card__ribbon" />}

        {/* Media: fills entire top edge-to-edge at natural aspect ratio */}
        <div className="project-card__media">
          {renderMedia()}

          {/* Hover overlay */}
          <div className="project-card__overlay">
            <p className="project-card__overlay-desc">{description}</p>
          </div>
        </div>

        {/* Title strip: fixed height, single line */}
        <div className="project-card__title">
          <h3>{projectName}</h3>
        </div>
      </div>
    </>
  )
}
