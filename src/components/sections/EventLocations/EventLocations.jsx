import { FaArrowRight, FaCalendarDays } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../common/ScrollReveal'
import { locationCards } from '../../../data/platform'

function EventLocations() {
  return (
    <section className="bg-carbon py-24 sm:py-32" aria-label="Event locations">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Where we run
          </p>
          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl lg:text-6xl">
            THREE CITIES.
            <br />
            <span className="ember-gradient-text">ONE COMMUNITY.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Each city is chosen for its character. Each route is designed to
            challenge, inspire, and stay with you long after the finish arch.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {locationCards.map((location) => (
            <article
              key={location.city}
              className="group relative min-h-[420px] overflow-hidden rounded-3xl"
            >
              <img
                alt={`Marathon runners in ${location.city}`}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                src={location.image}
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />

              {/* Date badge — top right */}
              {location.date && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-obsidian/70 px-3 py-1.5 backdrop-blur-sm">
                  <FaCalendarDays
                    className="text-ember text-xs"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-sf-white/90">
                    {location.date}
                  </span>
                </div>
              )}

              {/* Coloured accent bar */}
              <div
                className="absolute inset-x-0 bottom-0 h-0.5"
                style={{ backgroundColor: location.accentColor }}
              />

              {/* Content */}
              <div className="relative flex min-h-[420px] flex-col justify-end p-7 text-sf-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sf-white/55">
                  {location.label}
                </p>
                <h3 className="mt-2 font-display text-5xl font-black italic">
                  {location.city}
                </h3>
                <Link
                  className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-sf-white/65 transition-all group-hover:translate-x-1 group-hover:text-sf-white"
                  to="/locations"
                >
                  Explore route <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventLocations

