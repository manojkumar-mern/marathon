import { useLayoutEffect, useRef } from 'react'
import { FaArrowRight, FaCalendarDays, FaLocationDot, FaFlag, FaChevronDown } from 'react-icons/fa6'
import { gsap } from 'gsap'
import Button from '../../common/Button'

/* ─── Hero assets ─────────────────────────────────────────────────── */
import heroImage from '../../../assets/images/hero/marathon-start.png'

/* ─── Next event info ─────────────────────────────────────────────── */
const NEXT_EVENT = {
  name:        'Chennai Marina 42K',
  city:        'Chennai',
  date:        'Jan 18, 2027',
  regDeadline: 'Jan 5, 2027',
  location:    'Marina Beach, Chennai',
  categories:  ['3K Fun Run', '5K Sprint', '21K Half', '42K Full'],
}

/* ─── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  const contentRef = useRef(null)

  /* Entrance animation */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        autoAlpha: 0,
        y: 40,
        duration: 1.0,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.2,
      })
    }, contentRef)
    return () => ctx.revert()
  }, [])

  /* Scroll to next section */
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-obsidian flex items-center justify-center"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* ── Cinematic background ── */}
      <img
        alt="Thousands of marathon runners at the start line on Marina Beach, Chennai"
        className="absolute inset-0 size-full object-cover object-[80%_center] select-none pointer-events-none"
        fetchPriority="high"
        src={heroImage}
      />

      {/* ── Gradient overlays for contrast & premium feel ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      />

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl px-5 sm:px-8 lg:px-10 flex flex-col justify-center h-full pt-[72px] lg:pt-24"
      >
        <div className="max-w-4xl">
          <h1
            id="hero-heading"
            data-hero-item
            className="font-display font-black italic uppercase select-none text-white"
            style={{
              fontSize: 'clamp(2.2rem, 6.8vw, 6.4rem)',
              lineHeight: '0.92',
              letterSpacing: '-0.03em',
              fontStretch: 'condensed',
            }}
          >
            ONE ROAD.<br />
            <span className="ember-gradient-text">THOUSANDS</span><br />
            OF STORIES.
          </h1>

          <p
            data-hero-item
            className="mt-7 max-w-xl text-[0.9375rem] leading-[1.7] tracking-wide text-white/70 sm:text-base sm:leading-8"
          >
            India's premium marathon event series. Run the city. Feel the crowd.{' '}
            <span className="text-white font-medium">Push past your boundaries and claim your victory.</span>
          </p>

          {/* Quick info row */}
          <div
            data-hero-item
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 pt-6"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-white/80">
              <FaCalendarDays className="text-ember text-xs" />
              {NEXT_EVENT.date}
            </span>
            <span className="h-3.5 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
            <span className="flex items-center gap-2 text-sm font-medium text-white/80">
              <FaLocationDot className="text-ember text-xs" />
              {NEXT_EVENT.location}
            </span>
            <span className="h-3.5 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
            <span className="flex items-center gap-2 text-sm font-semibold text-volt">
              <FaFlag className="text-xs" />
              Reg. closes {NEXT_EVENT.regDeadline}
            </span>
          </div>

          {/* Buttons */}
          <div data-hero-item className="mt-10 flex flex-wrap gap-4">
            <Button to="/register" className="h-12 px-8 text-sm uppercase tracking-wider font-bold">
              Register Now{' '}
              <FaArrowRight aria-hidden="true" className="text-xs ml-1" />
            </Button>
            <Button to="/events" variant="ghost" className="h-12 px-8 text-sm uppercase tracking-wider font-bold border border-white/20 text-white hover:border-ember hover:text-ember bg-transparent">
              Explore Events
            </Button>
          </div>
        </div>
      </div>

      {/* ── Animated scroll indicator ── */}
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll to next section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember z-20"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sf-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-sm:hidden">
          Scroll
        </span>
        <div className="relative h-8 w-0.5 overflow-hidden rounded-full bg-black/40 backdrop-blur-sm">
          <div
            className="absolute left-0 top-0 w-full rounded-full bg-ember-deep"
            style={{
              height: '40%',
              animation: 'heroScrollBounce 1.6s ease-in-out infinite',
            }}
          />
        </div>
        <FaChevronDown
          aria-hidden="true"
          className="text-ember-deep drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] -mt-1 text-sm"
          style={{ animation: 'heroChevronBounce 1.6s ease-in-out infinite' }}
        />
      </button>

      <style>{`
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        @keyframes heroChevronBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
      `}</style>
    </section>
  )
}

export default Hero
