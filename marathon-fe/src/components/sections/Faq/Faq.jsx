import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { faqItems } from '../../../data/platform'

function Faq() {
  return (
    <section className="bg-obsidian py-24 sm:py-32" aria-label="Frequently asked questions">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">

        {/* Left */}
        <div className="lg:sticky lg:top-28">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Helpful answers
          </p>
          <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
            QUESTIONS,{' '}
            <span className="ember-gradient-text">ANSWERED.</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            Everything you need to know before race day. Can't find what you're looking for?
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ember transition-colors hover:text-volt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            to="/faq"
          >
            View all FAQ <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        {/* Right: accordion */}
        <div className="divide-y divide-steel border-y border-steel">
          {faqItems.map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-sf-white transition-colors hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember rounded-lg">
                {question}
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-steel text-lg font-normal text-ember transition-all duration-300 group-open:rotate-45 group-open:border-ember/50 group-open:bg-ember/10"
                >
                  +
                </span>
              </summary>
              {/* Smooth reveal — grid rows trick */}
              <div className="grid transition-all duration-300 ease-in-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
                <div className="overflow-hidden">
                  <p className="pt-4 text-sm leading-7 text-muted">{answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq

