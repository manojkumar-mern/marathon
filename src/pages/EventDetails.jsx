import { FaArrowRight, FaCalendarDays, FaLocationDot, FaClock, FaRoute, FaFlag, FaMapPin } from "react-icons/fa6"
import { Link, useParams } from "react-router-dom"
import Button from "../components/common/Button"
import { events, raceCategories } from "../data/platform"

function EventDetails() {
  const { id } = useParams()
  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-obsidian px-5 text-center">
        <div>
          <p className="font-display text-8xl font-black italic ember-gradient-text">404</p>
          <h1 className="mt-4 font-display text-3xl font-black italic text-sf-white">EVENT NOT FOUND.</h1>
          <p className="mt-3 text-muted">This event may have ended or the link is incorrect.</p>
          <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-8 py-3 text-sm font-semibold text-white hover:bg-ember-deep transition-all hover:-translate-y-0.5" to="/events">
            View all events
          </Link>
        </div>
      </main>
    )
  }

  const eventFaq = [
    [`What time does the venue open for ${event.title}?`, `The venue opens at ${event.schedule?.[0]?.time ?? "4:00 AM"} for bib collection and baggage drop. We recommend arriving at least 60 minutes before your wave start.`],
    ["What should I bring on race day?", "Bring your QR ticket (digital or printed), a valid photo ID, and your race bib if collected at the expo. Wear comfortable, well-broken-in running shoes."],
    ["Is there a baggage storage facility?", "Yes. A secure, supervised baggage drop is available at the venue from opening time. Tagged bags are returned at the finish zone after your run."],
    ["Can family and friends come to cheer?", "Absolutely. The event is open to spectators. Share the official route map so your support crew can plan the best cheer spots."],
  ]

  return (
    <main className="bg-obsidian">
      {/* Hero */}
      <div className="relative min-h-[60vh] overflow-hidden">
        <img alt={`${event.title} marathon event`} className="absolute inset-0 size-full object-cover" src={event.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="relative flex min-h-[60vh] flex-col justify-end px-5 py-14 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <span className="inline-flex rounded-full border border-ember/30 bg-obsidian/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ember backdrop-blur-sm">
              {event.status}
            </span>
            <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl lg:text-7xl">
              {event.title.toUpperCase()}
            </h1>
            <div className="mt-5 flex flex-wrap gap-5 text-sm font-medium text-sf-white/70">
              <span className="flex items-center gap-2"><FaCalendarDays className="text-ember" aria-hidden="true" />{event.date}</span>
              <span className="flex items-center gap-2"><FaLocationDot className="text-ember" aria-hidden="true" />{event.location}</span>
              <span className="flex items-center gap-2"><FaClock className="text-ember" aria-hidden="true" />Start {event.startTime}</span>
              <span className="flex items-center gap-2"><FaFlag className="text-ember" aria-hidden="true" />Reg. deadline: {event.regDeadline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-16">
            {/* Overview */}
            <section aria-label="Event overview">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Overview
              </p>
              <h2 className="mt-4 font-display text-3xl font-black italic text-sf-white">ABOUT THIS RACE</h2>
              <p className="mt-5 text-base leading-8 text-muted">{event.description}</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-steel bg-carbon p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Distances</p>
                  <p className="mt-2 text-sm font-medium text-sf-white">{event.distance}</p>
                </div>
                <div className="rounded-2xl border border-steel bg-carbon p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Venue</p>
                  <p className="mt-2 text-sm font-medium text-sf-white">{event.venue ?? event.location}</p>
                </div>
              </div>
            </section>

            {/* Route */}
            {event.route && (
              <section aria-label="Route information">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Route
                </p>
                <h2 className="mt-4 font-display text-3xl font-black italic text-sf-white">COURSE DETAILS</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Terrain",   value: event.route.terrain },
                    { label: "Surface",   value: event.route.surface },
                    { label: "Elevation", value: event.route.elevation },
                    { label: "Certified", value: event.route.certified },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 rounded-2xl border border-steel bg-carbon p-5">
                      <FaRoute className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
                        <p className="mt-1 text-sm font-medium text-sf-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {event.route.highlights && (
                  <div className="mt-5 rounded-2xl border border-steel bg-carbon p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-ember">
                      <FaMapPin className="mr-1.5 inline" aria-hidden="true" />Route Highlights
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.route.highlights.map((h) => (
                        <span key={h} className="rounded-full border border-steel px-3 py-1 text-xs font-medium text-muted">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-5 flex min-h-[200px] items-center justify-center overflow-hidden rounded-2xl border border-steel bg-carbon">
                  <div className="text-center text-muted">
                    <FaMapPin className="mx-auto mb-3 text-3xl text-ember/40" aria-hidden="true" />
                    <p className="text-sm font-medium">Interactive map coming soon</p>
                    <p className="mt-1 text-xs text-muted-dim">{event.venue ?? event.location}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Schedule */}
            {event.schedule && (
              <section aria-label="Race day schedule">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Schedule
                </p>
                <h2 className="mt-4 font-display text-3xl font-black italic text-sf-white">RACE DAY TIMELINE</h2>
                <div className="mt-7 divide-y divide-steel rounded-3xl border border-steel bg-carbon">
                  {event.schedule.map((item, i) => (
                    <div key={i} className="flex items-start gap-6 px-6 py-5">
                      <span className="w-28 shrink-0 text-xs font-bold text-ember">{item.time}</span>
                      <p className="text-sm text-sf-white">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            <section aria-label="Event FAQ">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />FAQ
              </p>
              <h2 className="mt-4 font-display text-3xl font-black italic text-sf-white">COMMON QUESTIONS</h2>
              <div className="mt-7 divide-y divide-steel border-y border-steel">
                {eventFaq.map(([q, a]) => (
                  <details key={q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-sf-white transition-colors hover:text-ember">
                      {q}
                      <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full border border-steel text-lg text-ember transition-all duration-300 group-open:rotate-45 group-open:border-ember/50 group-open:bg-ember/10">+</span>
                    </summary>
                    <div className="grid transition-all duration-300 [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
                      <div className="overflow-hidden"><p className="pt-4 text-sm leading-7 text-muted">{a}</p></div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-ember/20 bg-carbon p-7 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-ember">Register Now</p>
              <p className="mt-3 font-display text-2xl font-black italic text-sf-white">{event.title}</p>
              <p className="mt-2 text-sm text-muted">{event.date} - {event.location}</p>
              <div className="my-6 border-t border-steel" />
              <div className="space-y-3 text-sm">
                {raceCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sf-white">{cat.title}</span>
                      <span className="ml-2 text-xs text-muted">{cat.distance}</span>
                    </div>
                    <span className="font-bold text-volt">{cat.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-xs text-muted">
                <p>Registration deadline: <span className="font-semibold text-sf-white">{event.regDeadline}</span></p>
                <p>First start: <span className="font-semibold text-sf-white">{event.startTime}</span></p>
              </div>
              <Button className="mt-7 w-full justify-center" to={`/register?event=${event.id}`}>Register for this event</Button>
              <Link to="/contact" className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-ember transition-colors">
                Have questions? <FaArrowRight className="text-[10px]" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-steel bg-carbon">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-12 sm:px-8 lg:px-10">
          <div>
            <p className="font-display text-2xl font-black italic text-sf-white">Ready to race?</p>
            <p className="mt-1 text-sm text-muted">Spots are limited. Secure your bib before the deadline.</p>
          </div>
          <Button to={`/register?event=${event.id}`}>Register Now <FaArrowRight aria-hidden="true" /></Button>
        </div>
      </div>
    </main>
  )
}

export default EventDetails
