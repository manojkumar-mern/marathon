import SEO from '../components/common/SEO'
import { FaArrowRight, FaCalendarDays, FaClock, FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ScrollReveal from '../components/common/ScrollReveal'
import { BRAND } from '../config/brand'
import { events } from '../data/platform'

/* ─── Countdown helper for event cards ─── */
function getCountdown(targetDateStr) {
  const diff = new Date(targetDateStr) - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(diff / 1000)
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function FeaturedCountdown({ targetDate }) {
  const [time, setTime] = useState(() => getCountdown(targetDate))

  useEffect(() => {
    const id = setInterval(() => setTime(getCountdown(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-sm mt-3">
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-3 shadow-lg">
        <span className="block font-display text-2xl font-black italic text-volt">{String(time.days).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Days</span>
      </div>
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-3 shadow-lg">
        <span className="block font-display text-2xl font-black italic text-volt">{String(time.hours).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Hrs</span>
      </div>
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-3 shadow-lg">
        <span className="block font-display text-2xl font-black italic text-volt">{String(time.minutes).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Mins</span>
      </div>
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-3 shadow-lg">
        <span className="block font-display text-2xl font-black italic text-volt">{String(time.seconds).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Secs</span>
      </div>
    </div>
  )
}

function Events({ mode }) {
  const title =
    mode === 'upcoming' ? 'Upcoming Events'
    : mode === 'past'   ? 'Past Events'
    :                     'All Events'

  const description =
    mode === 'past'
      ? 'A record of the routes, runners, and shared moments that define who we are.'
      : 'Thoughtfully designed endurance experiences for runners, teams, and communities.'

  const seoDesc = {
    all: `Browse all ${BRAND.name} marathon and running events across India. Register for upcoming races in ${BRAND.cities.join(', ')}.`,
    upcoming: `View upcoming ${BRAND.name} marathon events. Register early to secure your spot at our next race.`,
    past: `Relive past ${BRAND.name} marathon events. Results, finisher lists, and race galleries from previous editions.`,
  }

  const seoUrl = mode === 'upcoming' ? '/events/upcoming' : mode === 'past' ? '/events/past' : '/events'

  const filteredEvents =
    mode === 'past'
      ? events.filter((e) => e.status === 'Past')
      : mode === 'upcoming'
      ? events.filter((e) => e.status !== 'Past')
      : events

  const statusColors = {
    'Registration Open': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    'Coming Soon': 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    'Registration Opening Soon': 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    'Past': 'bg-steel-light text-muted-dim border-steel'
  }

  return (
    <main className="bg-obsidian py-20 sm:py-28">
      <SEO title={title} description={seoDesc[mode]} url={seoUrl} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <ScrollReveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Events
          </p>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            {title.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            {description}
          </p>
        </ScrollReveal>

        {/* Filter tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {[
            { label: 'All Events',      to: '/events' },
            { label: 'Upcoming',        to: '/events/upcoming' },
            { label: 'Past Events',     to: '/events/past' },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                (tab.to === '/events' && !mode)
                || (tab.to === '/events/upcoming' && mode === 'upcoming')
                || (tab.to === '/events/past' && mode === 'past')
                  ? 'bg-ember text-white'
                  : 'border border-steel text-muted hover:border-ember/40 hover:text-sf-white'
              }`}
              aria-current={((tab.to === '/events' && !mode) || (tab.to === '/events/upcoming' && mode === 'upcoming') || (tab.to === '/events/past' && mode === 'past')) ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="font-display text-4xl font-black italic text-sf-white/20">NO EVENTS YET.</p>
            <p className="mt-3 text-muted">Check back soon — new events are announced regularly.</p>
            <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white hover:bg-ember-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" to="/events">
              View all events <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-16">
            {filteredEvents.map((event) => {
              const slotsLeft = event.slotsRemaining
              const totalSlots = event.totalSlots
              const fillPercent = totalSlots ? Math.round((1 - slotsLeft / totalSlots) * 100) : 0
              const isPast = event.status === 'Past'

              return (
                <ScrollReveal key={event.id}>
                  <div className="bg-carbon/50 rounded-3xl border border-steel/60 p-6 sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                      {/* Left: Image (CSS Sticky relative to card container) */}
                      <div className="lg:sticky lg:top-[96px] z-0">
                        <div className="relative group overflow-hidden rounded-3xl border border-steel/60 bg-carbon aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                          <img
                            alt={event.title}
                            src={event.image}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition-all duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-85" />
                          <span className="absolute left-6 bottom-6 rounded-full bg-obsidian/85 px-4 py-2 text-sm font-bold text-volt backdrop-blur-md border border-white/10">
                            {event.price}
                          </span>
                        </div>
                      </div>

                      {/* Right: Content details */}
                      <div className="flex flex-col justify-center">
                        <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider mb-6 ${statusColors[event.status] || 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                          {event.status}
                        </div>

                        <h2 className="font-display text-4xl sm:text-5xl font-black italic leading-tight text-sf-white uppercase">
                          {event.title}
                        </h2>

                        <div className="mt-6 space-y-3 text-sm text-muted">
                          <p className="flex items-center gap-3">
                            <FaCalendarDays className="text-ember text-sm shrink-0" aria-hidden="true" />
                            <span className="text-sf-white/95 font-medium">{event.date}</span> at {event.startTime}
                          </p>
                          <p className="flex items-center gap-3">
                            <FaLocationDot className="text-ember text-sm shrink-0" aria-hidden="true" />
                            <span className="text-sf-white/95 font-medium">{event.location}</span>
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {event.distance && event.distance.split('·').map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full border border-steel bg-carbon/30 px-3 py-1.5 text-xs font-semibold text-sf-white/80"
                            >
                              {badge.trim()}
                            </span>
                          ))}
                        </div>

                        <p className="mt-6 text-sm sm:text-base leading-7 text-muted">
                          {event.description}
                        </p>

                        {/* Progress section (spots left bar) */}
                        {totalSlots && !isPast && (
                          <div className="mt-6">
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

                        {/* Countdown */}
                        {event.regDeadline && !isPast && (
                          <div className="mt-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-dim mb-3">Registration Closes In</p>
                            <FeaturedCountdown targetDate={event.regDeadline} />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap gap-4">
                          {!isPast ? (
                            <Link
                              to={`/register?event=${event.id}`}
                              className="inline-flex h-12 items-center justify-center rounded-full bg-ember px-8 text-xs font-bold uppercase tracking-wider text-white hover:bg-ember-deep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              Register Now
                            </Link>
                          ) : (
                            <span className="inline-flex h-12 items-center justify-center rounded-full bg-steel px-8 text-xs font-bold uppercase tracking-wider text-muted-dim cursor-not-allowed">
                              Closed
                            </span>
                          )}
                          <Link
                            to={`/events/${event.id}`}
                            className="inline-flex h-12 items-center justify-center rounded-full border border-steel px-6 text-xs font-bold uppercase tracking-wider text-muted hover:border-ember hover:text-ember transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default Events
