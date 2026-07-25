import { useEffect, useState } from 'react'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #FACC15, #F97316)',
        boxShadow: '0 0 10px rgba(249, 115, 22, 0.65)',
        transition: 'width 100ms linear',
      }}
    />
  )
}

export default ScrollProgress
