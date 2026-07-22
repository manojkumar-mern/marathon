import { FaArrowRight, FaMedal, FaFileLines, FaClock } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { raceCategories } from '../../../data/platform'

const difficultyColor = {
  Beginner: 'text-emerald-400',
  Easy:     'text-sky-400',
  Moderate: 'text-amber-400',
  Advanced: 'text-red-400',
}

function RaceCategories() {
  return (
    <section className="bg-obsidian py-24 sm:py-32" aria-label="Race categories">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header row */}
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
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-steel px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-ember hover:text-ember"
            to="/race-categories"
          >
            Full race guide <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        {/* Category cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {raceCategories.map((cat) => (
            <article
              key={cat.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                cat.featured
                  ? 'bg-gradient-to-br from-ember to-ember-deep text-white ember-glow'
                  : 'border border-steel bg-carbon hover:border-ember/40'
              }`}
            >
              {cat.featured && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}

              {/* Difficulty badge */}
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  cat.featured
                    ? 'text-white/70'
                    : (difficultyColor[cat.difficulty] ?? 'text-ember')
                }`}
              >
                {cat.difficulty ?? cat.pace}
              </span>

              {/* Giant distance number */}
              <p
                className={`mt-5 font-display text-7xl font-black italic leading-none ${
                  cat.featured ? 'text-white' : 'text-sf-white'
                }`}
              >
                {cat.distance}
              </p>

              <h3
                className={`mt-3 text-xl font-semibold ${
                  cat.featured ? 'text-white' : 'text-sf-white'
                }`}
              >
                {cat.title}
              </h3>

              <p
                className={`mt-3 flex-1 text-sm leading-6 ${
                  cat.featured ? 'text-white/80' : 'text-muted'
                }`}
              >
                {cat.detail}
              </p>

              {/* Meta row */}
              <div
                className={`mt-5 space-y-1.5 border-t pt-4 ${
                  cat.featured ? 'border-white/20' : 'border-steel'
                }`}
              >
                {cat.startTime && (
                  <p
                    className={`flex items-center gap-2 text-xs ${
                      cat.featured ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    <FaClock aria-hidden="true" className="shrink-0" />
                    Start {cat.startTime}
                  </p>
                )}
                {cat.medal && (
                  <p
                    className={`flex items-center gap-2 text-xs ${
                      cat.featured ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    <FaMedal aria-hidden="true" className="shrink-0" />
                    Finisher medal included
                  </p>
                )}
                {cat.certificate && (
                  <p
                    className={`flex items-center gap-2 text-xs ${
                      cat.featured ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    <FaFileLines aria-hidden="true" className="shrink-0" />
                    Digital certificate
                  </p>
                )}
              </div>

              {/* Price + CTA row */}
              <div className="mt-5 flex items-center justify-between">
                {cat.price && (
                  <span
                    className={`font-display text-xl font-black italic ${
                      cat.featured ? 'text-white' : 'text-volt'
                    }`}
                  >
                    {cat.price}
                  </span>
                )}
                <Link
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                    cat.featured
                      ? 'text-white hover:text-white/70'
                      : 'text-ember hover:text-volt'
                  }`}
                  to="/register"
                >
                  Register <FaArrowRight aria-hidden="true" className="text-xs" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RaceCategories

