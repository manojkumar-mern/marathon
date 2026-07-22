import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { FaArrowRight, FaCalendarDays, FaLocationDot, FaFlag } from 'react-icons/fa6'
import { gsap } from 'gsap'
import { BRAND } from '../../../config/brand'
import Button from '../../common/Button'

/* ─── Hero assets ─────────────────────────────────────────────────── */
const heroImage =
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=2400&q=90'

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
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
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

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-obsidian"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Cinematic background ── */}
      <img
        alt="Thousands of marathon runners charging through city streets at dawn"
        className="absolute inset-0 size-full object-cover object-[60%_20%]"
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
      {/* Top fade so navbar blends */}
      <div
        aria-hidden="true"
        style={{ height: '18%', background: 'linear-gradient(to bottom, rgba(8,12,16,0.55), transparent)' }}
        className="absolute inset-x-0 top-0"
      />

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative flex flex-col justify-end"
        style={{ minHeight: '100svh' }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">

          {/* Season eyebrow chip */}
          <p
            data-hero-item
            className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ember backdrop-blur-sm"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember animate-pulse" />
            {BRAND.name} · 2027 Season
          </p>

          {/* Main headline */}
          <h1
            id="hero-heading"
            data-hero-item
            className="mt-5 font-display font-black italic leading-[0.88] tracking-tight text-sf-white"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 9rem)' }}
          >
            ONE ROAD.
            <br />
            <span className="ember-gradient-text">THOUSANDS</span>
            <br />
            OF STORIES.
          </h1>

          {/* Sub-copy */}
          <p
            data-hero-item
            className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg"
          >
            India's premium marathon event series.{' '}
            <span className="text-sf-white/75">Run the city. Feel the crowd. Earn the medal.</span>
          </p>

          {/* Event info row */}
          <div
            data-hero-item
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
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

          {/* Race category pills */}
          <div data-hero-item className="mt-4 flex flex-wrap gap-2">
            {NEXT_EVENT.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-sf-white/70 backdrop-blur-sm"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div data-hero-item className="mt-8 flex flex-wrap gap-4">
            <Button to="/register">
              Register Now{' '}
              <FaArrowRight aria-hidden="true" className="text-xs" />
            </Button>
            <Button to="/events" variant="ghost">
              Explore Events
            </Button>
          </div>

          {/* Countdown + Animated Stats */}
          <div
            data-hero-item
            className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-start sm:justify-between"
          >
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

            {/* Vertical divider */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-px self-stretch bg-white/10"
            />

            {/* Animated stats */}
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              {heroStats.map((stat, i) => (
                <div key={stat.label}>
                  <p
                    ref={(el) => (statRefs.current[i] = el)}
                    className="font-display text-4xl font-black italic text-volt sm:text-5xl"
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
      </div>

      {/* ── Animated scroll indicator ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sf-white/25">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 w-full rounded-full bg-ember/60"
            style={{
              height: '40%',
              animation: 'heroScrollDrop 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Keyframe for scroll drop */}
      <style>{`
        @keyframes heroScrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(280%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}

export default Hero
