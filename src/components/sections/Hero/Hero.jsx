const eventDetails = [
  { label: 'Next edition', value: 'Race date to be announced' },
  { label: 'Location', value: 'Tamil Nadu, India' },
]

const eventStats = [
  { value: '10K+', label: 'Participants' },
  { value: 'Multiple', label: 'Race categories' },
  { value: '10+', label: 'Years of excellence' },
]

function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative -mt-20 isolate min-h-screen overflow-hidden bg-slate-950 pt-20 lg:-mt-24 lg:pt-24"
      id="home"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=2400&q=85')] bg-cover bg-center transition-transform duration-700 motion-safe:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/65" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_44%,rgba(2,6,23,0.35)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/4 size-72 rounded-full border border-orange-300/20 sm:size-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 top-1/4 size-48 rounded-full border border-orange-300/15 sm:size-64"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:min-h-[calc(100svh-6rem)] lg:px-10 lg:pb-14 lg:pt-36">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-300 sm:text-sm">
            <span aria-hidden="true" className="h-px w-10 bg-orange-400" />
            Run with purpose
          </p>

          <h1
            className="max-w-2xl text-5xl font-black uppercase tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            id="hero-heading"
          >
            Kauvery
            <span className="block text-orange-400">Marathon</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            A landmark race-day experience that brings athletes, communities, and
            ambition to the same starting line.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-5 border-l border-orange-400/70 pl-5 sm:gap-x-12">
            {eventDetails.map((detail) => (
              <div key={detail.label}>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-white sm:text-base">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              href="#register"
            >
              Register Now
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/60 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              href="#about"
            >
              Learn More
            </a>
          </div>
        </div>

        <dl className="mt-12 grid max-w-4xl grid-cols-1 divide-y divide-white/15 border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {eventStats.map((stat) => (
            <div className="py-5 sm:px-6 sm:first:pl-0" key={stat.label}>
              <dd className="text-2xl font-black tracking-tight text-white sm:text-3xl">{stat.value}</dd>
              <dt className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Hero
