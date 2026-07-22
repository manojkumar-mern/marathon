import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { hash, pathname } = useLocation()

  useLayoutEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1))

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      window.scrollTo(0, 0)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [hash, pathname])

  return null
}

export default ScrollToTop
