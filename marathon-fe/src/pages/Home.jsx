import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight, FaCalendarDays, FaLocationDot, FaFlag, FaClock,
  FaMedal, FaFileLines, FaStar, FaUsers, FaCity, FaHands,
  FaPersonRunning, FaHandshake, FaRegClock, FaCheck,
  FaBolt, FaMountain, FaHeart, FaBuilding, FaChildren,
} from 'react-icons/fa6'
import { gsap } from 'gsap'
import { BRAND } from '../config/brand'
import {
  events, raceCategories, galleryImages, testimonials,
  sponsors, statsData, newsletterData, ctaData,
} from '../data/platform'
import Button from '../components/common/Button'
import ScrollReveal from '../components/common/ScrollReveal'
import Hero from '../components/sections/Hero/Hero'
import About from '../components/sections/About/About'
import Faq from '../components/sections/Faq/Faq'

import SEO from '../components/common/SEO'

/* ─── StarRating ──────────────────────────────────────────────── */
function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-volt text-xs" aria-hidden="true" />
      ))}
    </div>
  )
}

/* ─── AnimatedCounter ─────────────────────────────────────────── */
function fmtStat(n, suffix) {
  const r = Math.round(n)
  if (r >= 1000) return (r / 1000).toFixed(r % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'K' + suffix
  return r + suffix
}

function AnimatedCounter({ endValue, suffix, label, icon, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: endValue,
          duration: 2.4,
          ease: 'power2.out',
          delay,
          onUpdate() {
            if (el) el.textContent = fmtStat(proxy.val, suffix)
          },
        })
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [endValue, suffix, delay])

  const iconMap = {
    users: FaUsers,
    city: FaCity,
    calendar: FaRegClock,
    hands: FaHands,
    runner: FaPersonRunning,
    handshake: FaHandshake,
  }
  const Icon = iconMap[icon] || FaUsers

  return (
    <div className="flex flex-col items-center py-8 sm:py-12">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-ember/20 bg-ember/10 text-ember">
        <Icon className="text-lg" aria-hidden="true" />
      </div>
      <p
        ref={ref}
        className="mt-5 font-display text-5xl font-black italic text-volt sm:text-6xl"
        style={{ textShadow: '0 0 40px rgba(250,204,21,0.3)' }}
      >
        0
      </p>
      <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-ember/40" />
      <p className="mt-3 text-sm font-semibold text-sf-white">{label}</p>
    </div>
  )
}

/* ─── StatSection ─────────────────────────────────────────────── */
function StatSection() {
  return (
    <section className="relative overflow-hidden bg-obsidian py-16 sm:py-24" aria-label="Event statistics">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            By the numbers
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
            BUILT BY RUNNERS,
            <br />
            <span className="ember-gradient-text">MEASURED IN MILES.</span>
          </h2>
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
          {statsData.map((stat, i) => (
            <AnimatedCounter key={stat.label} {...stat} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FeaturedEvents ──────────────────────────────────────────── */
function FeaturedEvents() {
  const statusColors = {
    'Registration Open': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Coming Soon': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Registration Opening Soon': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  }

  return (
    <section className="bg-carbon py-24 sm:py-32" aria-label="Featured events">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                Featured events
              </p>
              <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
                THIS SEASON'S
                <br />
                <span className="ember-gradient-text">LINEUP.</span>
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-steel px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              to="/events"
            >
              All events <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const slotsLeft = event.slotsRemaining
            const totalSlots = event.totalSlots
            const fillPercent = totalSlots ? Math.round((1 - slotsLeft / totalSlots) * 100) : 0
            return (
              <article key={event.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-steel bg-obsidian transition-all duration-300 hover:-translate-y-1 hover:border-ember/30 hover:shadow-xl">
                {/* Image */}
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img alt={event.title} src={event.image} loading="lazy" decoding="async"
                    className="size-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                  {/* Status badge */}
                  <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[event.status] || statusColors['Coming Soon']}`}>
                    {event.status}
                  </span>
                  {/* Price pill */}
                  {event.price && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-obsidian/80 px-3 py-1 text-xs font-bold text-volt backdrop-blur-sm">
                      {event.price}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-black italic leading-tight text-sf-white group-hover:text-ember transition-colors">
                    {event.title.toUpperCase()}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-muted">
                    <p className="flex items-center gap-2">
                      <FaCalendarDays className="text-ember text-[10px]" aria-hidden="true" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaLocationDot className="text-ember text-[10px]" aria-hidden="true" />
                      {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaFlag className="text-ember text-[10px]" aria-hidden="true" />
                      {event.distance}
                    </p>
                  </div>

                  {/* Slots bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-sf-white/70">{slotsLeft} spots left</span>
                      <span className="text-muted-dim">{fillPercent}% filled</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-steel/50">
                      <div className="h-full rounded-full bg-ember transition-all duration-700"
                        style={{ width: `${fillPercent}%` }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center gap-3">
                    <Button to={`/register?event=${event.id}`} className="flex-1 justify-center text-xs">
                      Register Now
                    </Button>
                    <Link to={`/events/${event.id}`}
                      className="rounded-full border border-steel px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── RacePath ────────────────────────────────────────────────── */
const categoryIconMap = {
  'Kids Run': FaChildren,
  '5K': FaBolt,
  '10K': FaMountain,
  'Half Marathon': FaHeart,
  'Full Marathon': FaMountain,
  'Corporate Challenge': FaBuilding,
}

const difficultyColor = {
  Beginner: 'text-emerald-400',
  Easy: 'text-sky-400',
  'Easy–Moderate': 'text-sky-400',
  Moderate: 'text-amber-400',
  Advanced: 'text-red-400',
  'All Levels': 'text-volt',
}

function RacePath() {
  return (
    <section className="bg-obsidian py-24 sm:py-32" aria-label="Race categories">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                Race categories
              </p>
              <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
                FIND YOUR
                <br />
                <span className="ember-gradient-text">DISTANCE.</span>
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-steel px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              to="/race-categories"
            >
              Full race guide <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {raceCategories.map((cat) => {
            const Icon = categoryIconMap[cat.title] || FaBolt
            return (
              <article key={cat.id}
                className={`relative flex flex-col overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  cat.featured
                    ? 'bg-gradient-to-br from-ember to-ember-deep text-white ember-glow'
                    : 'border border-steel bg-carbon hover:border-ember/40'
                }`}
              >
                {cat.featured && (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${
                      cat.featured ? 'text-white/70' : difficultyColor[cat.difficulty] ?? 'text-ember'
                    }`}>
                      {cat.difficulty}
                    </span>
                    <h3 className={`mt-2 text-xl font-semibold ${cat.featured ? 'text-white' : 'text-sf-white'}`}>
                      {cat.title}
                    </h3>
                  </div>
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${
                    cat.featured ? 'bg-white/15 text-white' : 'border border-steel bg-obsidian text-ember'
                  }`}>
                    <Icon className="text-lg" aria-hidden="true" />
                  </div>
                </div>

                {/* Giant distance */}
                <p className={`mt-4 font-display text-6xl font-black italic leading-none ${
                  cat.featured ? 'text-white' : 'text-sf-white'
                }`}>
                  {cat.distance}
                </p>

                <p className={`mt-4 flex-1 text-sm leading-6 ${
                  cat.featured ? 'text-white/80' : 'text-muted'
                }`}>
                  {cat.detail}
                </p>

                {/* Audience & Avg Time */}
                <div className={`mt-5 space-y-2 border-t pt-4 ${
                  cat.featured ? 'border-white/20' : 'border-steel'
                }`}>
                  {cat.audience && (
                    <p className={`flex items-start gap-2 text-xs leading-5 ${
                      cat.featured ? 'text-white/70' : 'text-muted'
                    }`}>
                      <span className="mt-0.5 size-1 shrink-0 rounded-full bg-ember/60" aria-hidden="true" />
                      {cat.audience}
                    </p>
                  )}
                  {cat.avgTime && (
                    <p className={`flex items-center gap-2 text-xs ${
                      cat.featured ? 'text-white/70' : 'text-muted'
                    }`}>
                      <FaClock aria-hidden="true" className="shrink-0" />
                      Avg. finish: {cat.avgTime}
                    </p>
                  )}
                </div>

                {/* Meta row */}
                <div className={`mt-4 flex flex-wrap items-center gap-4 text-xs ${
                  cat.featured ? 'text-white/60' : 'text-muted-dim'
                }`}>
                  {cat.startTime && <span className="flex items-center gap-1"><FaRegClock aria-hidden="true" />Start {cat.startTime}</span>}
                  {cat.medal && <span className="flex items-center gap-1"><FaMedal aria-hidden="true" />Medal</span>}
                  {cat.certificate && <span className="flex items-center gap-1"><FaFileLines aria-hidden="true" />Certificate</span>}
                </div>

                {/* Price + CTA */}
                <div className="mt-5 flex items-center justify-between">
                  {cat.price && (
                    <span className={`font-display text-xl font-black italic ${
                      cat.featured ? 'text-white' : 'text-volt'
                    }`}>
                      {cat.price}
                    </span>
                  )}
                  <Link to="/register"
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                      cat.featured ? 'text-white hover:text-white/70' : 'text-ember hover:text-volt'
                    }`}>
                    Register <FaArrowRight aria-hidden="true" className="text-xs" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ────────────────────────────────────────────── */
function TestimonialsSection() {
  const [visibleCount, setVisibleCount] = useState(6)

  const visible = testimonials.slice(0, visibleCount)
  const hasMore = visibleCount < testimonials.length

  return (
    <section className="relative overflow-hidden bg-carbon py-24 sm:py-32" aria-label="Runner testimonials">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-[400px] -translate-y-1/4 translate-x-1/4 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Runner stories
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              TOLD BY THE
              <br />
              <span className="ember-gradient-text">RUNNERS THEMSELVES.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <blockquote key={t.name}
              className="flex flex-col rounded-3xl border border-steel bg-obsidian/60 p-7 backdrop-blur-sm transition-all hover:border-ember/30 hover:-translate-y-0.5">
              <StarRating count={t.rating} />
              <p className="mt-5 flex-1 text-sm leading-7 text-sf-white/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-steel pt-5">
                <p className="font-semibold text-sf-white">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted">{t.city} &middot; {t.category}</p>
              </footer>
            </blockquote>
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button onClick={() => setVisibleCount(testimonials.length)}
              className="inline-flex items-center gap-2 rounded-full border border-steel px-6 py-3 text-sm font-semibold text-muted transition-colors hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
              Show all {testimonials.length} stories <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Sponsors ────────────────────────────────────────────────── */
const sponsorIcons = {
  'Title Sponsor': FaStar,
  'Hydration Partner': FaHands,
  'Medical Partner': FaHeart,
  'Fitness Partner': FaPersonRunning,
  'Technology Partner': FaBolt,
}

function SponsorsSection() {
  return (
    <section className="relative overflow-hidden bg-obsidian py-24 sm:py-32" aria-label="Sponsors">
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 size-[500px] -translate-x-1/4 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Our partners
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              BRANDS THAT
              <br />
              <span className="ember-gradient-text">MOVE WITH US.</span>
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-sm leading-7 text-muted">
              We partner with brands that share our commitment to quality, safety, and the runner experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => {
            const Icon = sponsorIcons[s.category] || FaHandshake
            return (
              <div key={s.name}
                className="group rounded-3xl border border-steel bg-carbon p-7 transition-all hover:-translate-y-1 hover:border-ember/30">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ember/20 bg-ember/10 text-ember transition-colors group-hover:bg-ember/20">
                    <Icon className="text-lg" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember">{s.category}</p>
                    <p className="mt-0.5 text-lg font-semibold text-sf-white">{s.name}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-muted">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── GallerySection (inline) ─────────────────────────────────── */
function GallerySection() {
  return (
    <section className="bg-carbon py-24 sm:py-32" aria-label="Community gallery">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                Race gallery
              </p>
              <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
                MOMENTS THAT
                <br />
                <span className="ember-gradient-text">DEFINE THE RACE.</span>
              </h2>
            </div>
            <Link className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember" to="/gallery">
              View all moments <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid auto-rows-[160px] gap-3 sm:auto-rows-[200px] sm:gap-4 grid-cols-2 md:grid-cols-4">
          {galleryImages.map((img) => (
            <figure key={img.alt}
              className={`group relative overflow-hidden rounded-2xl border border-steel/40 ${
                img.large ? 'col-span-2 row-span-2' : ''
              }`}>
              <img alt={img.alt} src={img.src} loading="lazy" decoding="async"
                className="size-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-4 pt-8 text-xs font-semibold uppercase tracking-widest text-sf-white/80 transition-transform duration-300 group-hover:translate-y-0">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Newsletter ──────────────────────────────────────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-obsidian py-24 sm:py-32" aria-label="Newsletter">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Stay connected
          </p>
          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
            {newsletterData.heading}
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            {newsletterData.subheading}
          </p>
        </ScrollReveal>

        <div className="mt-10">
          {subscribed ? (
            <div className="mx-auto max-w-md rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-8">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20">
                <FaCheck className="text-xl text-emerald-400" aria-hidden="true" />
              </div>
              <p className="mt-5 font-display text-xl font-black italic text-sf-white">YOU'RE ON THE LIST.</p>
              <p className="mt-2 text-sm text-muted">{newsletterData.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
              <div className="flex-1">
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input id="nl-email" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder={newsletterData.placeholder}
                  aria-invalid={!!error} aria-describedby={error ? 'nl-error' : undefined}
                  className={`w-full rounded-full border ${error ? 'border-red-500/60' : 'border-steel'} bg-carbon px-5 py-3 text-sm text-sf-white outline-none placeholder:text-muted-dim focus:border-ember transition-colors`}
                />
                {error && <p id="nl-error" className="mt-1.5 text-xs text-red-400 text-left" role="alert">{error}</p>}
              </div>
              <button type="submit"
                className="shrink-0 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {newsletterData.buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Section ─────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ember to-ember-deep py-24 sm:py-32" aria-label="Call to action">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white/60" />
            {BRAND.name} &middot; {BRAND.tagline}
          </p>
          <h2 className="mt-5 font-display text-5xl font-black italic leading-none tracking-tight text-white sm:text-7xl">
            {ctaData.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-white/80">
            {ctaData.subheading}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/register" variant="light">
              {ctaData.buttonText} <FaArrowRight aria-hidden="true" />
            </Button>
            <Link to="/events"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Explore events
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─── Home ────────────────────────────────────────────────────── */
function Home() {
  return (
    <main>
      <SEO
        title="Home"
        description={BRAND.description}
        url="/"
      />
      <Hero />
      <About />
      <StatSection />
      <FeaturedEvents />
      <RacePath />
      <TestimonialsSection />
      <SponsorsSection />
      <GallerySection />
      <NewsletterSection />
      <Faq />
      <CTASection />
    </main>
  )
}

export default Home