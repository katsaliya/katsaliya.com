import { useRef } from 'react'
import ProjectCard from './ProjectCard'

/* Part 5: Single vertical column layout */
export default function MasonryGrid({ cards, onCaseStudyClick, onComingSoonClick }) {
  const containerRef = useRef(null)

  return (
    <div className="single-column-grid" ref={containerRef}>
      {cards.map((card, index) => {
        const handleCardClick = () => {
          if (card.handler) {
            card.handler()
          } else {
            onCaseStudyClick(card.caseStudyLink)
          }
        }

        return (
          <div key={index} className="card-wrapper">
            <ProjectCard
              media={card.media}
              mediaType={card.mediaType}
              projectName={card.projectName}
              description={card.description}
              ribbonImage={card.ribbonImage}
              caseStudyLink={card.caseStudyLink}
              onCaseStudyClick={handleCardClick}
              onComingSoonClick={onComingSoonClick}
              colorTheme={card.colorTheme}
            />
          </div>
        )
      })}
    </div>
  )
}
