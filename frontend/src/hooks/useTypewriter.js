import { useState, useEffect } from 'react'

/**
 * useTypewriter Hook
 * Cycles through an array of text strings with typewriter effect
 * Respects prefers-reduced-motion for accessibility
 *
 * @param {string[]} words - Array of text strings to cycle through
 * @param {object} config - Configuration object
 * @param {number} config.typeSpeed - ms per character when typing (default: 100)
 * @param {number} config.deleteSpeed - ms per character when deleting (default: 50)
 * @param {number} config.pauseAfterType - ms to pause after typing completes (default: 1500)
 * @param {number} config.pauseAfterDelete - ms to pause after deleting (default: 300)
 * @returns {object} { displayText, isDeleting, wordIndex }
 */
export function useTypewriter(
  words,
  config = {}
) {
  const {
    typeSpeed = 100,
    deleteSpeed = 50,
    pauseAfterType = 1500,
    pauseAfterDelete = 300,
  } = config

  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTyping, setIsTyping] = useState(true)

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  useEffect(() => {
    // If prefers-reduced-motion, just show first word and exit
    if (prefersReducedMotion) {
      setDisplayText(words[0])
      setIsTyping(false)
      return
    }

    if (!isTyping) return

    const currentWord = words[wordIndex]
    let timeout

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, typeSpeed)
      } else {
        // Typing complete, pause then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseAfterType)
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, displayText.length - 1))
        }, deleteSpeed)
      } else {
        // Deleting complete, move to next word
        setWordIndex((prev) => (prev + 1) % words.length)
        setIsDeleting(false)
        // Brief pause before typing next word
        timeout = setTimeout(() => {}, pauseAfterDelete)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex, isTyping, prefersReducedMotion, words, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete])

  return {
    displayText,
    isDeleting,
    wordIndex,
    isPaused: displayText === words[wordIndex] && !isDeleting,
  }
}
