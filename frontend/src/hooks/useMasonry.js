import { useState, useEffect, useCallback } from 'react'

/**
 * useMasonry Hook
 * Implements Pinterest-style bin-packing masonry layout
 * Places each card into the column with the shortest current height
 *
 * @param {array} cards - Array of card data objects
 * @param {number} columnCount - Number of columns to distribute cards across
 * @param {object} cardHeights - Map of card index to measured height: { 0: 450, 1: 320, ... }
 * @param {number} gap - Gap between cards in pixels
 * @returns {array} Array of column arrays: [[card, card], [card], ...]
 */
export function useMasonry(cards, columnCount, cardHeights = {}, gap = 16) {
  const [columns, setColumns] = useState([])

  // Calculate which card goes into which column
  const calculateLayout = useCallback(() => {
    if (!cards || cards.length === 0) {
      setColumns(Array(columnCount).fill(null).map(() => []))
      return
    }

    // Initialize empty columns
    const newColumns = Array(columnCount).fill(null).map(() => [])
    const columnHeights = Array(columnCount).fill(0)

    // Place each card into the shortest column (bin-packing)
    cards.forEach((card, index) => {
      // Find the column with the shortest height
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

      // Add card to that column
      newColumns[shortestColumnIndex].push(card)

      // Update that column's height (add card height + gap)
      const cardHeight = cardHeights[index] || 0
      columnHeights[shortestColumnIndex] += cardHeight + gap
    })

    setColumns(newColumns)
  }, [cards, columnCount, cardHeights, gap])

  // Recalculate layout when inputs change
  useEffect(() => {
    calculateLayout()
  }, [calculateLayout])

  return columns
}
