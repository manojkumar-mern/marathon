import { FaArrowRight } from 'react-icons/fa6'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { galleryImages, pageContent, raceCategories } from '../data/platform'

const genericPages = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Your information, handled with care.',
    description:
      'This platform is designed to handle event registration data responsibly. This development version does not collect or submit personal data.',
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Clear expectations for every event.',
    description:
      'Event-specific participation, cancellation, and safety terms are published with each confirmed event.',
  },
  locations: {
    eyebrow: 'Locations',
    title: 'Routes with a reason to run.',
    description:
      'Each city edition is chosen for its character — routes that challenge, inspire, and stay with you long after the finish line.',
  },
}

/* Shared form input style */
const inputCls =
  'mt-2 w-full rounded-xl border border-steel bg-obsidian px-4 py-3 text-sm text-sf-white outline-none placeholder:text-muted-dim focus:border-ember transition-colors'

/* Reusable eyebrow */
function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
      {children}
    </p>
  )
}

function ContentPage({ type }) {
  const content = pageContent[type] || genericPages[type]
  const [isMessageSent, setIsMessageSent] = useState(false)

  /* ── Race categories ──────────────────────────────── */
  if (type === 'categories') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Eyebrow>Race categories</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            FIND YOUR STARTING POINT.
          </h1>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {raceCategories.map((cat) => (
              <article
                key={cat.id}
                className={`rounded-3xl border p-7 ${
                  cat.featured ? 'border-ember bg-ember/10' : 'border-steel bg-carbon'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">
                  {cat.pace}
                </p>
                <p className="mt-6 font-display text-7xl font-black italic text-sf-white">
                  {cat.distance}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-sf-white">{cat.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{cat.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    )
  }

  /* ── Gallery ──────────────────────────────────────── */
  if (type === 'gallery') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Eyebrow>Community gallery</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            ON THE MOVE, TOGETHER.
          </h1>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((img) => (
              <img
                alt={img.alt}
                className="aspect-square rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                key={img.alt}
                loading="lazy"
                src={img.src}
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  /* ── FAQ ──────────────────────────────────────────── */
  if (type === 'faq') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white">
              ANSWERS FOR RACE DAY.
            </h1>
            <Link
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-volt transition-colors"
              to="/contact"
            >
              Still have questions? <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-steel border-y border-steel">
            {[
              [
                'How will I receive event updates?',
                'Confirmed event communications are shared through your registered channels — email, WhatsApp, and SMS.',
              ],
              [
                'What happens after registration?',
                'Your confirmation, payment receipt, QR ticket, and race information are prepared through the registration workflow and available in your dashboard.',
              ],
              [
                'Can I change my race category?',
                'Category changes can be requested before the registration cutoff date. Contact our team with your registration ID.',
              ],
              [
                'What is the cancellation policy?',
                'Cancellation and refund terms are specific to each event edition and published with registration details.',
              ],
            ].map(([q, a]) => (
              <details key={q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-sf-white">
                  {q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl font-normal text-ember transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
    )
  }

  /* ── Contact (with form) ──────────────────────────── */
  if (type === 'contact') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            {content.title.toUpperCase()}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted">{content.description}</p>

          <form
            className="mt-12 grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              setIsMessageSent(true)
            }}
          >
            <label className="text-sm font-medium text-muted">
              Name
              <input className={inputCls} placeholder="Your full name" type="text" />
            </label>
            <label className="text-sm font-medium text-muted">
              Email
              <input className={inputCls} placeholder="your@email.com" type="email" />
            </label>
            <label className="col-span-full text-sm font-medium text-muted">
              Message
              <textarea
                className={`${inputCls} min-h-36 resize-none`}
                placeholder="Tell us about your enquiry…"
              />
            </label>
            <div className="col-span-full">
              <button
                className="rounded-full bg-ember px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95"
                type="submit"
              >
                Send message
              </button>
              {isMessageSent ? (
                <p className="mt-3 text-sm text-volt" role="status">
                  Thanks — your message is ready for the support team.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </main>
    )
  }

  /* ── Default static page ──────────────────────────── */
  return (
    <main className="bg-obsidian py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
          {content.title.toUpperCase()}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">{content.description}</p>
        <Link
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95"
          to="/register"
        >
          Register now <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}

export default ContentPage
