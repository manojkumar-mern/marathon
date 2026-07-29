import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../common/ScrollReveal'

function About() {
  return (
    <section className="bg-carbon py-20 sm:py-28" aria-label="About us">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            About STRIDEFORGE
          </p>

          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl uppercase">
            BUILT FOR THOSE WHO PUSH FURTHER.
          </h2>

          <p className="mt-6 text-sm sm:text-base leading-7 sm:leading-8 text-muted">
            STRIDEFORGE is India's premium marathon event series. We create world-class endurance experiences built for runners, teams, and communities who push every limit. From precision wave starts to electric crowd corridors, we design moments that inspire.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-steel px-6 py-3 text-xs font-bold uppercase tracking-wider text-sf-white transition-all hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              to="/about"
            >
              Learn More <FaArrowRight aria-hidden="true" className="text-xs" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default About
