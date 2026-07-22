import ScrollReveal from '../../common/ScrollReveal'
import { raceDayJourney } from '../../../data/platform'

function EventHighlights() {
  return (
    <section className="bg-carbon py-24 sm:py-32" aria-label="Race day journey">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                Race Day Journey
              </p>
              <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
                FROM SIGN-UP
                <br />
                <span className="ember-gradient-text">TO MEDAL.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted sm:text-right">
              Everything you need to know about race day — from the moment you register to the moment you cross the finish arch.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {raceDayJourney.map((item, index) => (
            <div
              key={item.step}
              className="relative flex flex-col"
            >
              {/* Connector line (horizontal on lg, right of each step except last) */}
              {index < raceDayJourney.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-[calc(theme(spacing.7)+10px)] top-[18px] hidden h-px w-[calc(100%-theme(spacing.7)-26px)] border-t border-dashed border-ember/20 lg:block"
                />
              )}

              <div className="flex items-start gap-4 pb-10 pr-6">
                {/* Step circle */}
                <div
                  className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-xs font-black italic text-ember"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.step}
                </div>

                <div>
                  <h3 className="text-sm font-semibold leading-snug text-sf-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventHighlights

