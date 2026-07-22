import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BRAND } from '../../config/brand'

function PageLoader({ onComplete }) {
  const rootRef = useRef(null)
  const barRef  = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete })
    tl
      .fromTo(
        textRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0
      )
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left' },
        0.15
      )
      .to(rootRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, '+=0.2')
    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian"
    >
      {/* Logo + wordmark */}
      <div ref={textRef} className="mb-8 flex flex-col items-center gap-4">
        <svg
          fill="none"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          className="size-14"
        >
          <defs>
            <linearGradient
              id="plGrad"
              gradientUnits="userSpaceOnUse"
              x1="20"
              x2="20"
              y1="2"
              y2="38"
            >
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <polygon fill="url(#plGrad)" points="20,2 38,36 2,36" />
          <polygon fill="#080C10" fillOpacity="0.45" points="20,13 30,34 10,34" />
        </svg>

        <p className="font-display text-2xl font-black italic tracking-[0.1em] text-sf-white">
          {BRAND.name}
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
          {BRAND.tagline}
        </p>
      </div>

      {/* Loading bar */}
      <div className="w-52">
        <div className="h-px overflow-hidden bg-steel">
          <span
            ref={barRef}
            className="block h-full"
            style={{ background: 'linear-gradient(90deg, #FACC15, #F97316)' }}
          />
        </div>
      </div>
    </div>
  )
}

export default PageLoader
