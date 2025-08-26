import { useState, useEffect } from 'react'

// Custom hook for responsive behavior
export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({ width, height })
      setIsMobile(width <= 640)
      setIsTablet(width > 640 && width <= 1024)
      setIsDesktop(width > 1024)
      
      // Detect touch device
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0
      )
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  }
}

// Utility function to prevent zoom on iOS
export function preventZoom(element) {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }, { passive: false })
  }
}

// Utility function for better touch handling
export function handleTouch(onTap, onLongPress, delay = 500) {
  let touchStart = 0
  let touchTimer = null
  
  return {
    onTouchStart: (e) => {
      touchStart = Date.now()
      touchTimer = setTimeout(() => {
        if (onLongPress) onLongPress(e)
      }, delay)
    },
    onTouchEnd: (e) => {
      const touchDuration = Date.now() - touchStart
      
      if (touchTimer) {
        clearTimeout(touchTimer)
        touchTimer = null
      }
      
      if (touchDuration < delay && onTap) {
        onTap(e)
      }
    },
    onTouchCancel: () => {
      if (touchTimer) {
        clearTimeout(touchTimer)
        touchTimer = null
      }
    }
  }
}