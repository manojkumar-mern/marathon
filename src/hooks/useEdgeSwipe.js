import { useEffect, useRef } from 'react'

const EDGE_THRESHOLD = 30

function getMinSwipeDistance() {
  return Math.max(60, window.innerWidth * 0.25)
}

export default function useEdgeSwipe(onOpen, onClose, isOpen) {
  const startRef = useRef(null)
  const swipingRef = useRef(false)
  const isOpenRef = useRef(isOpen)
  const onOpenRef = useRef(onOpen)
  const onCloseRef = useRef(onClose)

  isOpenRef.current = isOpen
  onOpenRef.current = onOpen
  onCloseRef.current = onClose

  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024

    const handleTouchStart = (e) => {
      if (!isMobile()) return

      const touch = e.touches[0]
      const x = touch.clientX
      const y = touch.clientY
      const w = window.innerWidth

      if (!isOpenRef.current && w - x <= EDGE_THRESHOLD) {
        swipingRef.current = true
        startRef.current = { x, y }
        return
      }

      if (isOpenRef.current && e.target.closest('#mobile-menu')) {
        swipingRef.current = true
        startRef.current = { x, y }
        return
      }

      swipingRef.current = false
    }

    const handleTouchMove = (e) => {
      if (!swipingRef.current) return

      const touch = e.touches[0]
      const dx = touch.clientX - startRef.current.x
      const absDx = Math.abs(dx)
      const dy = Math.abs(touch.clientY - startRef.current.y)

      if (dy > absDx * 1.5) {
        if (absDx < 30) {
          swipingRef.current = false
          return
        }
      }

      if (absDx > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      if (!swipingRef.current) return

      const touch = e.changedTouches[0]
      const dx = touch.clientX - startRef.current.x
      const absDx = Math.abs(dx)
      const dy = Math.abs(touch.clientY - startRef.current.y)
      const minSwipe = getMinSwipeDistance()

      const isHorizontal = absDx > dy * 1.5 || (absDx > minSwipe && dy < minSwipe * 0.5)

      if (isHorizontal && absDx >= minSwipe) {
        if (dx < 0 && !isOpenRef.current) {
          onOpenRef.current()
        } else if (dx > 0 && isOpenRef.current) {
          onCloseRef.current()
        }
      }

      swipingRef.current = false
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])
}
