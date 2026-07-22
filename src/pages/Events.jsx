import { FaArrowRight, FaCalendarDays, FaClock, FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/common/ScrollReveal'
import { events } from '../data/platform'

function Events({ mode }) {
  const title =
    mode === 'upcoming' ? 'Upcoming Events'
    : mode === 'past'   ? 'Past Events'
    :                     'All Events'

  const description =
    mode === 'past'
      ? 'A record of the routes, runners, and shared moments that define who we are.'
      : 'Thoughtfully designed endurance experiences for runners, teams, and communities.'

  const filteredEvents =
    mode === 'past'
      ? events.filter((e) => e.status === 'Past')
      : mode === 'upcoming'
      ? events.filter((e) => e.status !== 'Past')
      : events

  return (
    <main className="bg-obsidian py-20 sm:py-28">
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
        <div className="mt-10 flex gap-2">
          {[
            { label: 'All Events',      to: '/events' },
            { label: 'Upcoming',        to: '/events/upcoming' },
            { label: 'Past Events',     to: '/events/past' },
          ].map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                (tab.to === '/events' && !mode)
                || (tab.to === '/events/upcoming' && mode === 'upcoming')
                || (tab.to === '/events/past' && mode === 'past')
                  ? 'bg-ember text-white'
                  : 'border border-steel text-muted hover:border-ember/40 hover:text-sf-white'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="font-display text-4xl font-black italic text-sf-white/20">NO EVENTS YET.</p>
            <p className="mt-3 text-muted">Check back soon — new events are announced regularly.</p>
            <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white hover:bg-ember-deep" to="/events">
              View all events <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-3xl border border-steel bg-carbon transition-all duration-300 hover:-translate-y-1 hover:border-ember/40"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    alt={`${event.title} — race event`}
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    src={event.image}
                  />
                  <span className="absolute left-5 top-5 rounded-full border border-ember/30 bg-obsidian/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ember backdrop-blur-sm">
                    {event.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-7">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <FaCalendarDays className="text-ember" aria-hidden="true" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-ember" aria-hidden="true" /> Start {event.startTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaLocationDot className="text-ember" aria-hidden="true" /> {event.location}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-black italic text-sf-white">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{event.distance}</p>

                  {event.regDeadline && (
                    <p className="mt-3 text-xs text-muted-dim">
                      Registration closes: <span className="text-volt">{event.regDeadline}</span>
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-4">
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-semibold text-ember transition-colors hover:text-volt"
                      to={`/events/${event.id}`}
                    >
                      View details <FaArrowRight aria-hidden="true" />
                    </Link>
                    <Link
                      className="rounded-full border border-steel px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-ember/40 hover:text-sf-white"
                      to={`/register?event=${event.id}`}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Events
