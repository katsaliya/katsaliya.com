import { useState, useEffect, useRef } from 'react'
import ProjectCard from './ProjectCard'
import { useMasonry } from '../hooks/useMasonry'

export default function MasonryGrid({ cards, onCaseStudyClick, onComingSoonClick }) {
  const [columnCount, setColumnCount] = useState(5)
  const [cardHeights, setCardHeights] = useState({})
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Determine column count based on viewport width
  const updateColumnCount = () => {
    if (!containerRef.current) return

    const width = containerRef.current.offsetWidth
    setContainerWidth(width)

    if (width < 640) setColumnCount(2)
    else if (width < 1024) setColumnCount(3)
    else if (width < 1440) setColumnCount(4)
    else setColumnCount(5)
  }

  // Handle window resize
  useEffect(() => {
    updateColumnCount()

    const handleResize = () => updateColumnCount()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate actual gap from computed styles
  const getGapValue = () => {
    if (!containerRef.current) return 16
    const styles = window.getComputedStyle(containerRef.current)
    const gapStr = styles.getPropertyValue('gap')
    if (!gapStr) return 16
    // Extract numeric value from gap (e.g., "24px" → 24)
    const match = gapStr.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 16
  }

  const gap = getGapValue()

  // Calculate columns using masonry algorithm
  const columns = useMasonry(cards, columnCount, cardHeights, gap)

  // Handle card height measurement
  const handleCardHeightChange = (cardIndex, height) => {
    setCardHeights((prev) => {
      if (prev[cardIndex] !== height) {
        return { ...prev, [cardIndex]: height }
      }
      return prev
    })
  }

  // Filter out empty columns to make rows fill width
  const nonEmptyColumns = columns.filter((column) => column.length > 0)

  return (
    <div className="masonry-grid" ref={containerRef}>
      {nonEmptyColumns.map((column, columnIndex) => (
        <div key={columnIndex} className="masonry-column">
          {column.map((card, cardPosition) => {
            const cardIndex = cards.indexOf(card)
            return (
              <ProjectCardWithHeight
                key={`${columnIndex}-${cardPosition}`}
                card={card}
                cardIndex={cardIndex}
                onHeightChange={handleCardHeightChange}
                onCaseStudyClick={onCaseStudyClick}
                onComingSoonClick={onComingSoonClick}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Helper component to measure and report card height
function ProjectCardWithHeight({ card, cardIndex, onHeightChange, onCaseStudyClick, onComingSoonClick }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return

    const updateHeight = () => {
      const height = cardRef.current.offsetHeight
      onHeightChange(cardIndex, height)
    }

    // Measure after layout
    const timer = setTimeout(updateHeight, 0)

    // Also measure on image/video load
    const img = cardRef.current.querySelector('img')
    const video = cardRef.current.querySelector('video')

    const handleLoad = () => setTimeout(updateHeight, 100)

    if (img && !img.complete) {
      img.addEventListener('load', handleLoad)
      return () => {
        clearTimeout(timer)
        img.removeEventListener('load', handleLoad)
      }
    }

    if (video) {
      video.addEventListener('loadedmetadata', handleLoad)
      return () => {
        clearTimeout(timer)
        video.removeEventListener('loadedmetadata', handleLoad)
      }
    }

    return () => clearTimeout(timer)
  }, [cardIndex, onHeightChange])

  const handleCardClick = () => {
    if (card.handler) {
      card.handler()
    } else {
      onCaseStudyClick(card.caseStudyLink)
    }
  }

  return (
    <div ref={cardRef} style={{ width: '100%' }}>
      <ProjectCard
        media={card.media}
        mediaType={card.mediaType}
        projectName={card.projectName}
        description={card.description}
        ribbonImage={card.ribbonImage}
        caseStudyLink={card.caseStudyLink}
        onCaseStudyClick={handleCardClick}
        onComingSoonClick={onComingSoonClick}
      />
    </div>
  )
}
