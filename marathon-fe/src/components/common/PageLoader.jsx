import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BRAND } from '../../config/brand'
import logoSvg from "../../assets/images/logos/marathon-logo.webp"

function PageLoader({ onComplete }) {
  const rootRef = useRef(null)
  const runnerRef = useRef(null)
  const trail1Ref = useRef(null)
  const trail2Ref = useRef(null)
  const trail3Ref = useRef(null)
  const barRef = useRef(null)
  const percentRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const progressObj = { value: 0 }

    // Create the master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Smooth fade out and scale down to reveal homepage
        gsap.to(rootRef.current, {
          opacity: 0,
          scale: 0.98,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete
        })
      }
    })

    // Initialize positions
    gsap.set(barRef.current, { width: '0%' })

    // Progress counting animation (2.6 seconds for premium feel)
    tl.to(progressObj, {
      value: 100,
      duration: 2.6,
      ease: 'power2.inOut', // Smooth acceleration, cruise, deceleration
      onUpdate: () => {
        const val = Math.round(progressObj.value)
        if (percentRef.current) percentRef.current.innerText = `${val}%`
        if (barRef.current) barRef.current.style.width = `${val}%`
      }
    }, 0)

    if (!prefersReducedMotion) {
      // Initialize runner positions
      gsap.set([runnerRef.current, trail1Ref.current, trail2Ref.current, trail3Ref.current], { 
        left: '0%',
        xPercent: -50 
      })

      // Animate main runner and trails with staggered starts to create physical lag
      tl.to(runnerRef.current, {
        left: '100%',
        duration: 2.6,
        ease: 'power2.inOut'
      }, 0)

      tl.to(trail1Ref.current, {
        left: '100%',
        duration: 2.6,
        ease: 'power2.inOut'
      }, 0.04)

      tl.to(trail2Ref.current, {
        left: '100%',
        duration: 2.6,
        ease: 'power2.inOut'
      }, 0.08)

      tl.to(trail3Ref.current, {
        left: '100%',
        duration: 2.6,
        ease: 'power2.inOut'
      }, 0.12)
    } else {
      // Simplified loader for prefers-reduced-motion (centered static elements)
      if (runnerRef.current) {
        gsap.set(runnerRef.current, { left: '50%', xPercent: -50 })
      }
    }

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white select-none overflow-hidden"
    >
      {/* Styles for animations, gait, shadow, and blur trails */}
      <style>{`
        @keyframes runnerGait {
          0%, 100% {
            transform: translateY(0px) rotate(-4deg) scaleY(1);
          }
          25% {
            transform: translateY(-4px) rotate(0deg) scaleY(0.96);
          }
          50% {
            transform: translateY(0px) rotate(4deg) scale(1.02, 0.96);
          }
          75% {
            transform: translateY(-5px) rotate(0deg) scaleY(0.96);
          }
        }

        @keyframes shadowBounce {
          0%, 100% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.25;
          }
          25% {
            transform: scaleX(0.85) scaleY(0.8);
            opacity: 0.15;
          }
          50% {
            transform: scaleX(1.05) scaleY(1);
            opacity: 0.3;
          }
          75% {
            transform: scaleX(0.75) scaleY(0.7);
            opacity: 0.1;
          }
        }

        @keyframes windParticle {
          0% {
            transform: translateX(0) scaleX(0.5);
            opacity: 0;
          }
          50% {
            transform: translateX(-15px) scaleX(1.5);
            opacity: 0.7;
          }
          100% {
            transform: translateX(-35px) scaleX(0.2);
            opacity: 0;
          }
        }

        .animate-gait {
          animation: runnerGait 0.65s infinite ease-in-out;
        }

        .animate-shadow {
          animation: shadowBounce 0.65s infinite ease-in-out;
        }

        .speed-line-1 { animation: windParticle 0.4s infinite linear; }
        .speed-line-2 { animation: windParticle 0.3s infinite linear 0.1s; }
        .speed-line-3 { animation: windParticle 0.5s infinite linear 0.2s; }
      `}</style>

      {/* Brand Branding — Centered & Static */}
      <div className="mb-12 flex flex-col items-center gap-1.5 text-center">
        <h1 className="font-display text-3xl font-black italic tracking-[0.15em] text-slate-950">
          {BRAND.name}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          {BRAND.tagline}
        </p>
      </div>

      {/* Interactive Animation Track */}
      <div className="relative w-72 md:w-96 px-4">
        
        {/* Runner & Trails Area */}
        <div className="relative h-20 w-full mb-3">
          
          {/* Echo Trails (Motion Blur) */}
          <div
            ref={trail3Ref}
            className="absolute bottom-0 pointer-events-none opacity-[0.03] select-none filter blur-[3px]"
            style={{ height: '52px' }}
          >
            <img src={logoSvg} alt="" className="h-full w-auto object-contain" />
          </div>
          
          <div
            ref={trail2Ref}
            className="absolute bottom-0 pointer-events-none opacity-[0.07] select-none filter blur-[1.5px]"
            style={{ height: '52px' }}
          >
            <img src={logoSvg} alt="" className="h-full w-auto object-contain" />
          </div>

          <div
            ref={trail1Ref}
            className="absolute bottom-0 pointer-events-none opacity-[0.15] select-none filter blur-[0.5px]"
            style={{ height: '52px' }}
          >
            <img src={logoSvg} alt="" className="h-full w-auto object-contain" />
          </div>

          {/* Active Runner */}
          <div
            ref={runnerRef}
            className="absolute bottom-0 pointer-events-none select-none"
            style={{ height: '52px' }}
          >
            {/* Gait animation wrapper */}
            <div className="relative h-full w-full animate-gait">
              <img
                src={logoSvg}
                alt={BRAND.logoAlt}
                className="h-full w-auto object-contain"
              />

              {/* Wind Speed Trails */}
              <div className="absolute right-[85%] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 items-end pointer-events-none">
                <div className="h-[1.5px] w-6 bg-slate-300/60 rounded-full speed-line-1 origin-right"></div>
                <div className="h-[1.5px] w-8 bg-slate-400/50 rounded-full speed-line-2 origin-right"></div>
                <div className="h-[1.5px] w-5 bg-slate-300/40 rounded-full speed-line-3 origin-right"></div>
              </div>
            </div>

            {/* Soft Shadow Underneath Runner */}
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-slate-900/15 rounded-full filter blur-[1px] pointer-events-none animate-shadow"
            />
          </div>

        </div>

        {/* Minimal Progress Bar */}
        <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-slate-950 rounded-full"
            style={{ width: '0%' }}
          />
        </div>

        {/* Live Percentage counter */}
        <div className="absolute top-full mt-3 right-4">
          <span
            ref={percentRef}
            className="font-display text-xs font-bold tracking-wider text-slate-400"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  )
}

export default PageLoader
