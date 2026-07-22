import { BRAND } from '../../../config/brand'
import Button from '../../common/Button'

function Contact() {
  return (
    <section
      className="relative overflow-hidden bg-obsidian py-24 sm:py-32"
      aria-label="Contact"
    >
      {/* Volt glow — top-left accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-[400px] -translate-x-1/3 -translate-y-1/3 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Stay connected
          </p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
            LET'S MAKE RACE DAY{' '}
            <span className="ember-gradient-text">WORK BETTER.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">
            Ask about an upcoming event, a new city, or how{' '}
            {BRAND.name} can support your next endurance experience.
          </p>
        </div>
        <div className="shrink-0">
          <Button to="/contact" variant="light">
            Contact the team
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Contact
