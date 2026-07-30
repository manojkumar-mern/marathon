import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../common/ScrollReveal'
import { aboutRunner } from '../../../assets/images/index.js'

function About() {
  return (
    <section className="bg-carbon py-20 sm:py-28" aria-label="About us">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Shoe tying image */}
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-steel/60 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <img
                alt="Runner tying shoe laces"
                src={aboutRunner}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Right: Heading + Description */}
          <ScrollReveal className="flex flex-col justify-center">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember mb-4">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              About STRIDEFORGE
            </p>

            <h2 className="font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl uppercase">
              BUILT FOR THOSE WHO PUSH FURTHER.
            </h2>

            <p className="mt-6 text-sm sm:text-base leading-7 sm:leading-8 text-muted">
              STRIDEFORGE is India's premium marathon event series. We create world-class endurance experiences built for runners, teams, and communities who push every limit. From precision wave starts to electric crowd corridors, we design moments that inspire.
            </p>

            <div className="mt-8">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-steel px-6 py-3 text-xs font-bold uppercase tracking-wider text-sf-white transition-all hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                to="/about"
              >
                Learn More <FaArrowRight aria-hidden="true" className="text-xs" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default About
