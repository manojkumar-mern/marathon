import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight, FaCalendarDays, FaLocationDot, FaFlag, FaCheck
} from 'react-icons/fa6'
import { BRAND } from '../config/brand'
import {
  events, galleryImages, newsletterData, ctaData
} from '../data/platform'
import Button from '../components/common/Button'
import ScrollReveal from '../components/common/ScrollReveal'
import Hero from '../components/sections/Hero/Hero'
import About from '../components/sections/About/About'
import SEO from '../components/common/SEO'

/* ─── FeaturedRegistration ─────────────────────────────────────── */
function FeaturedRegistration() {
  const statusColors = {
    'Registration Open': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Coming Soon': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Registration Opening Soon': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  }

  return (
    <section className="bg-obsidian py-24 sm:py-32 border-t border-white/5" aria-label="Featured Marathon Registration">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Featured Editions
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl uppercase">
              THIS SEASON'S LINEUP.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => {
            const slotsLeft = event.slotsRemaining
            const totalSlots = event.totalSlots
            const fillPercent = totalSlots ? Math.round((1 - slotsLeft / totalSlots) * 100) : 0

            return (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-steel bg-carbon transition-all duration-300 hover:-translate-y-1 hover:border-ember/40"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    alt={`${event.title} — race event`}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    src={event.image}
                  />
                  <span className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[event.status] || 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                    {event.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <FaCalendarDays className="text-ember text-[10px]" aria-hidden="true" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaLocationDot className="text-ember text-[10px]" aria-hidden="true" /> {event.location}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-black italic leading-tight text-sf-white uppercase">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{event.distance}</p>

                  {/* Slots/Progress bar (if available) */}
                  {totalSlots && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-sf-white/70">{slotsLeft} spots left</span>
                        <span className="text-muted-dim">{fillPercent}% filled</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-steel/50">
                        <div
                          className="h-full rounded-full bg-ember transition-all duration-700"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-6 flex items-center gap-3">
                    <Button to={`/register?event=${event.id}`} className="flex-1 justify-center text-xs">
                      Register Now
                    </Button>
                    <Link
                      to={`/events/${event.id}`}
                      className="rounded-full border border-steel px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-ember hover:text-ember"
                    >
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

/* ─── GallerySection (inline) ─────────────────────────────────── */
function GallerySection() {
  const images = galleryImages.slice(0, 6)

  return (
    <section className="bg-carbon py-24 sm:py-32 border-t border-white/5" aria-label="Community gallery">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-12">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                Race gallery
              </p>
              <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl uppercase">
                MOMENTS THAT DEFINE THE RACE.
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-steel px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted hover:border-ember hover:text-ember transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              to="/gallery"
            >
              View Gallery <FaArrowRight aria-hidden="true" className="text-xs" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {images.map((img) => (
            <figure
              key={img.alt}
              className="group relative overflow-hidden rounded-2xl border border-steel/40 aspect-[4/3]"
            >
              <img
                alt={img.alt}
                src={img.src}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              />
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
    <section className="relative overflow-hidden bg-obsidian py-24 sm:py-32 border-t border-white/5" aria-label="Newsletter">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Stay connected
          </p>
          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl uppercase">
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
                  className={`w-full rounded-full border ${error ? 'border-red-500/60' : 'border-steel'} bg-carbon px-5 py-3.5 text-sm text-sf-white outline-none placeholder:text-muted-dim focus:border-ember transition-colors`}
                />
                {error && <p id="nl-error" className="mt-1.5 text-xs text-red-400 text-left" role="alert">{error}</p>}
              </div>
              <button type="submit"
                className="shrink-0 rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer">
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
          <h2 className="mt-5 font-display text-5xl font-black italic leading-none tracking-tight text-white sm:text-7xl uppercase">
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
              className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
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
      <FeaturedRegistration />
      <GallerySection />
      <NewsletterSection />
      <CTASection />
    </main>
  )
}

export default Home