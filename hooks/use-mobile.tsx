import * as React from "react"

const BREAKPOINTS = {
  mobile: 640,    // sm
  tablet: 768,    // md
  laptop: 1024,   // lg
  desktop: 1280,  // xl
} as const

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < BREAKPOINTS.tablet)
    }

    // Initial check
    handleResize()

    // Add event listener with debounce for better performance
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isTablet: windowWidth >= BREAKPOINTS.mobile && windowWidth < BREAKPOINTS.laptop,
    isDesktop: windowWidth >= BREAKPOINTS.laptop,
    windowWidth,
    breakpoints: BREAKPOINTS
  }
}
