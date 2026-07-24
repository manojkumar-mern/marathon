import { useLayoutEffect, useRef, useState, useEffect } from 'react'
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
  dateISO:     '2027-01-18T00:00:00Z',
  regDeadline: 'Jan 5, 2027',
  location:    'Marina Beach, Chennai',
  categories:  ['3K Fun Run', '5K Sprint', '21K Half', '42K Full'],
}

/* ─── Animated stats ──────────────────────────────────────────────── */
const heroStats = [
  { endValue: 18000, suffix: '+', label: 'Runners' },
  { endValue: 6,     suffix: '',  label: 'Cities'  },
  { endValue: 12,    suffix: '',  label: 'Events'  },
  { endValue: 95,    suffix: '%', label: 'Satisfaction' },
]

/* ─── Countdown hook ──────────────────────────────────────────────── */
function getCountdown(targetISO) {
  const diff = new Date(targetISO) - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(diff / 1000)
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function useCountdown(targetISO) {
  const [time, setTime] = useState(() => getCountdown(targetISO))

  useEffect(() => {
    const id = setInterval(() => setTime(getCountdown(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return time
}

/* ─── CountdownUnit ───────────────────────────────────────────────── */
function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-display font-black italic leading-none text-sf-white"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontVariantNumeric: 'tabular-nums' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  )
}

function CountdownSep() {
  return (
    <span
      className="font-display font-black italic text-ember/60 select-none self-start pt-1"
      style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
    >
      :
    </span>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef(null)
  const nextRef = useRef(null)
  const contentRef = useRef(null)
  const statRefs   = useRef([])
  const countdown  = useCountdown(NEXT_EVENT.dateISO)

  /* Entrance animation */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        autoAlpha: 0,
        y: 44,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, contentRef)
    return () => ctx.revert()
  }, [])

  /* Stat count-up via IntersectionObserver */
  useEffect(() => {
    const observers = statRefs.current.map((el, i) => {
      if (!el) return null
      const stat = heroStats[i]
      const obs  = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          obs.disconnect()
          const proxy = { val: 0 }
          gsap.to(proxy, {
            val: stat.endValue,
            duration: 2.2,
            ease: 'power2.out',
            delay: i * 0.15,
            onUpdate() {
              if (el) el.textContent =
                Math.round(proxy.val).toLocaleString() + stat.suffix
            },
          })
        },
        { threshold: 0.5 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  /* Scroll to next section */
  const handleScrollDown = () => {
    nextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ── Hero (exactly 1 viewport) ──────────────────────────── */}
      <section
        ref={heroRef}
        aria-labelledby="hero-heading"
        className="relative isolate overflow-hidden bg-obsidian"
        style={{ minHeight: '100svh' }}
      >
        {/* ── Cinematic background ── */}
        <img
          alt="Thousands of marathon runners at the start line on Marina Beach, Chennai at golden hour sunrise"
          className="absolute inset-0 size-full object-cover object-[50%_60%]"
          fetchPriority="high"
          src={heroImage}
        />

        {/* ── Gradient overlays ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent"
        />
        <div
          aria-hidden="true"
          style={{ height: '18%', background: 'linear-gradient(to bottom, rgba(8,12,16,0.55), transparent)' }}
          className="absolute inset-x-0 top-0"
        />

        {/* ── Content ── */}
        <div
          ref={contentRef}
          className="relative flex flex-col"
          style={{ minHeight: '100svh' }}
        >
          <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20 max-sm:px-6 max-sm:pt-16 max-sm:pb-16">

            <h1
              id="hero-heading"
              data-hero-item
              className="font-display font-black italic leading-[0.88] tracking-tight text-sf-white"
              style={{ fontSize: 'clamp(2.6rem, 9vw, 7.75rem)' }}
            >
              ONE ROAD.
              <br />
              <span className="ember-gradient-text">THOUSANDS</span>
              <br />
              OF STORIES.
            </h1>

            <p
              data-hero-item
              className="mt-4 max-w-lg text-base leading-6 text-muted sm:text-lg sm:leading-7 max-sm:mt-6 max-sm:max-w-xs max-sm:leading-7"
            >
              India's premium marathon event series.{' '}
              <span className="text-sf-white/75">Run the city. Feel the crowd. Earn the medal.</span>
            </p>

            <div
              data-hero-item
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 max-sm:mt-8 max-sm:gap-y-3"
            >
              <span className="flex items-center gap-1.5 text-sm text-sf-white/80">
                <FaCalendarDays className="text-ember text-xs" />
                {NEXT_EVENT.date}
              </span>
              <span className="h-3 w-px bg-white/20 hidden sm:block" aria-hidden="true" />
              <span className="flex items-center gap-1.5 text-sm text-sf-white/80">
                <FaLocationDot className="text-ember text-xs" />
                {NEXT_EVENT.location}
              </span>
              <span className="h-3 w-px bg-white/20 hidden sm:block" aria-hidden="true" />
              <span className="flex items-center gap-1.5 text-sm text-amber-400/90">
                <FaFlag className="text-xs" />
                Reg. closes {NEXT_EVENT.regDeadline}
              </span>
            </div>

            <div data-hero-item className="mt-3 flex flex-wrap gap-2 max-sm:mt-5 max-sm:gap-x-3 max-sm:gap-y-2.5">
              {NEXT_EVENT.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-sf-white/70 backdrop-blur-sm"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div data-hero-item className="mt-6 flex flex-wrap gap-4 max-sm:mt-10 max-sm:gap-5">
              <Button to="/register">
                Register Now{' '}
                <FaArrowRight aria-hidden="true" className="text-xs" />
              </Button>
              <Button to="/events" variant="ghost" className="max-sm:border-2 max-sm:border-white/20 max-sm:text-sf-white/80">
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
          className="absolute bottom-14 sm:bottom-6 max-sm:bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
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

      {/* ── Next Event Countdown + Stats ───────────────────────── */}
      <section
        ref={nextRef}
        aria-label="Next event countdown and statistics"
        className="bg-obsidian"
      >
        <div className="mx-auto w-full max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:px-10 lg:pt-14 lg:pb-24">
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pt-6">
            {/* Countdown block */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Next event in
              </p>
              <div className="flex items-end gap-2.5">
                <CountdownUnit value={countdown.days}    label="Days"  />
                <CountdownSep />
                <CountdownUnit value={countdown.hours}   label="Hrs"   />
                <CountdownSep />
                <CountdownUnit value={countdown.minutes} label="Min"   />
                <CountdownSep />
                <CountdownUnit value={countdown.seconds} label="Sec"   />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden sm:block w-px self-stretch bg-white/10"
            />

            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-5">
              {heroStats.map((stat, i) => (
                <div key={stat.label}>
                  <p
                    ref={(el) => (statRefs.current[i] = el)}
                    className="font-display text-3xl sm:text-4xl font-black italic tabular-nums text-volt sm:text-5xl"
                    style={{ textShadow: '0 0 30px rgba(250,204,21,0.35)' }}
                  >
                    0
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
