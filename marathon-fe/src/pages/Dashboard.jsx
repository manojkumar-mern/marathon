import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

const modules = [
  'Events',
  'Participants',
  'Payments',
  'Cities',
  'Race categories',
  'Sponsors',
  'Gallery',
  'Announcements',
  'Exports',
  'QR check-in',
]

function Dashboard() {
  return (
    <main className="bg-obsidian py-20 sm:py-28">
      <SEO title="Operator Dashboard" description="STRIDEFORGE event management dashboard — manage events, participants, payments, and race operations." url="/dashboard" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
          Operator dashboard
        </p>
        <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
          ONE VIEW.{' '}
          <span className="ember-gradient-text">EVERY EVENT.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          This secure workspace connects to the event management backend. Access controls
          and live data activate when authentication is enabled.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {modules.map((mod, i) => (
            <section
              key={mod}
              className="group rounded-2xl border border-steel bg-carbon p-6 transition-all duration-200 hover:border-ember/40 hover:bg-steel"
            >
              <span className="font-display text-4xl font-black italic text-ember/30 transition-colors group-hover:text-ember/55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-7 text-sm font-semibold text-sf-white">{mod}</h2>
            </section>
          ))}
        </div>

        <Link
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          to="/"
        >
          ← Return home
        </Link>
      </div>
    </main>
  )
}

export default Dashboard
