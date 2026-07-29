import { useLayoutEffect, useRef } from 'react'
import { FaArrowRight, FaCalendarDays, FaLocationDot, FaFlag, FaChevronDown } from 'react-icons/fa6'
import { gsap } from 'gsap'
import Button from '../../common/Button'

/* ─── Hero assets ─────────────────────────────────────────────────── */
import heroImage from '../../../assets/images/hero/marathon-start.webp'

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
        alt="Thousands of marathon runners at the start line on Marina Beach, Chennai at golden hour sunrise"
        className="absolute inset-0 size-full object-cover object-[50%_60%] select-none pointer-events-none"
        fetchPriority="high"
        src={heroImage}
      />

      {/* ── Gradient overlays for contrast & premium feel ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/80 to-obsidian/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent"
      />

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl px-5 sm:px-8 lg:px-10 flex flex-col justify-center h-full pt-16"
      >
        <div className="max-w-4xl">
          {/* Tagline */}
          <div data-hero-item className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm tracking-wider uppercase mb-6">
            <span className="size-1.5 rounded-full bg-ember animate-pulse" />
            Strideforge Endurance Series
          </div>

          <h1
            id="hero-heading"
            data-hero-item
            className="font-display font-black italic leading-[0.88] tracking-tight text-sf-white uppercase select-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7.5rem)' }}
          >
            ONE ROAD.<br />
            <span className="ember-gradient-text">THOUSANDS</span><br />
            OF STORIES.
          </h1>

          <p
            data-hero-item
            className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
          >
            India's premium marathon event series. Run the city. Feel the crowd.{' '}
            <span className="text-sf-white/85 font-medium">Push past your boundaries and claim your victory.</span>
          </p>

          {/* Quick info row */}
          <div
            data-hero-item
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/5 pt-6"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-sf-white/80">
              <FaCalendarDays className="text-ember text-xs" />
              {NEXT_EVENT.date}
            </span>
            <span className="h-3.5 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
            <span className="flex items-center gap-2 text-sm font-medium text-sf-white/80">
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
            <Button to="/events" variant="ghost" className="h-12 px-8 text-sm uppercase tracking-wider font-bold border border-white/20 text-sf-white hover:border-ember hover:text-ember bg-transparent">
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
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sf-white/30 max-sm:hidden">
          Scroll
        </span>
        <div className="relative h-8 w-px overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 w-full rounded-full bg-ember/50"
            style={{
              height: '40%',
              animation: 'heroScrollBounce 1.6s ease-in-out infinite',
            }}
          />
        </div>
        <FaChevronDown
          aria-hidden="true"
          className="text-ember/50 -mt-1"
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
