import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BRAND } from '../../config/brand'
import logoSvg from "../../assets/images/logos/marathon-logo.webp";

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
        <img
          src={logoSvg}
          alt="Kauvery Marathon runner logo"
          className="h-20 w-auto object-contain"
        />

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
