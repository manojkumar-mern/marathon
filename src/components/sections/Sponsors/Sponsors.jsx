import { FaStar } from 'react-icons/fa6'
import { BRAND } from '../../../config/brand'
import Button from '../../common/Button'
import { testimonials } from '../../../data/platform'

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-volt text-xs" aria-hidden="true" />
      ))}
    </div>
  )
}

function Sponsors() {
  return (
    <>
      {/* ── Runner Testimonials ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-carbon py-24 sm:py-32"
        aria-label="Runner testimonials"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-14 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Runner Stories
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              TOLD BY THE
              <br />
              <span className="ember-gradient-text">RUNNERS THEMSELVES.</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col rounded-3xl border border-steel bg-obsidian/60 p-7 backdrop-blur-sm"
              >
                <StarRating count={t.rating} />
                <p className="mt-5 flex-1 text-sm leading-7 text-sf-white/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-steel pt-5">
                  <p className="font-semibold text-sf-white">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {t.city} · {t.category}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership CTA ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-obsidian py-24 sm:py-32"
        aria-label="Partnerships"
      >
        {/* Ember radial glow — top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 size-[500px] -translate-y-1/4 translate-x-1/4 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Partnerships
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl lg:text-6xl">
              MOVE A CITY.{' '}
              <span className="ember-gradient-text">
                BUILD REAL LOYALTY.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              {BRAND.name} creates purposeful opportunities for brands that
              want to meet communities through meaningful, active experiences
              that build genuine loyalty — not just impressions.
            </p>
          </div>

          <div className="shrink-0">
            <Button to="/sponsors" variant="light">
              Explore partnerships
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Sponsors

