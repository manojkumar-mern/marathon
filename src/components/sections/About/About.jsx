import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../common/ScrollReveal'

const pillars = [
  {
    title: 'Race-day precision',
    detail:
      'Wave starts, bib collection, QR check-in, volunteer logistics — every operation built for the pressure of 18,000 runners on the line.',
  },
  {
    title: 'Runner-first design',
    detail:
      'Seamless registration, digital tickets, live results, and real-time updates — built around the runner, not the organiser.',
  },
  {
    title: 'Community at the core',
    detail:
      'Every finish line is a community moment. We build races that bring families, friends, and strangers together through shared miles.',
  },
]

const aboutImage =
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=900&q=85'

function About() {
  return (
    <section className="bg-carbon py-24 sm:py-32" aria-label="About us">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">

        {/* Left: image with overlaid pull quote */}
        <ScrollReveal className="relative">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              alt="Elite athletes racing through a city course"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              src={aboutImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
            <blockquote className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-display text-3xl font-black italic leading-tight text-sf-white sm:text-4xl">
                "We don't just organise races.{' '}
                <span className="ember-gradient-text">We create the moment you'll talk about for years."</span>
              </p>
            </blockquote>
          </div>
        </ScrollReveal>

        {/* Right: mission copy */}
        <ScrollReveal className="flex flex-col justify-center">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            What drives us
          </p>

          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
            BUILT FOR THOSE
            <br />
            <span className="ember-gradient-text">WHO PUSH FURTHER.</span>
          </h2>

          <p className="mt-6 text-base leading-7 text-muted">
            Every city we run through is chosen deliberately. Every route is
            mapped for drama and character. From the opening gun to the final
            medal ceremony — every detail of a STRIDEFORGE race is built
            around the runners who've earned the right to be there.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-steel pt-5">
                <h3 className="font-semibold text-sf-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{pillar.detail}</p>
              </div>
            ))}
          </div>

          <Link
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ember transition-colors hover:text-volt"
            to="/about"
          >
            Our full story <FaArrowRight aria-hidden="true" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default About
