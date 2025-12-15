import { useEffect, useRef, useCallback } from 'react'

export interface SwipeState {
  isAvailable: boolean
  lastSwipeTime: number
}

export function useSwipeControls(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  minSwipeDistance: number = 50
) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const swipeTimeoutRef = useRef<number | null>(null)
  const lastSwipeTimeRef = useRef<number>(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }

    const now = Date.now()
    const timeDiff = now - lastSwipeTimeRef.current
    
    // Prevent rapid-fire swipes (cooldown 400ms)
    if (timeDiff < 400) {
      touchStartRef.current = null
      return
    }

    const diffY = touchStartRef.current.y - touchEnd.y // Negative = swipe down, Positive = swipe up
    const diffX = Math.abs(touchStartRef.current.x - touchEnd.x)

    // Check if it's primarily vertical (not horizontal scrolling)
    if (Math.abs(diffY) > minSwipeDistance && diffX < minSwipeDistance) {
      lastSwipeTimeRef.current = now

      if (diffY > 0) {
        // Swipe UP = SKIP
        console.log('[SWIPE] Swipe UP → SKIP')
        onSwipeUp()
      } else {
        // Swipe DOWN = CORRECT
        console.log('[SWIPE] Swipe DOWN → CORRECT')
        onSwipeDown()
      }
    }

    touchStartRef.current = null
  }, [onSwipeUp, onSwipeDown, minSwipeDistance])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, true)
    window.addEventListener('touchend', handleTouchEnd, true)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, true)
      window.removeEventListener('touchend', handleTouchEnd, true)
      if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current)
    }
  }, [handleTouchStart, handleTouchEnd])

  return {
    isAvailable: true
  }
}
