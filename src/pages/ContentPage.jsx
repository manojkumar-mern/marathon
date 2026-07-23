import { FaArrowRight, FaShield, FaPeopleGroup, FaFlag, FaLocationDot, FaClock, FaCalendarDays, FaEnvelope, FaPhone, FaInstagram, FaXTwitter, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa6'
import { useState } from 'react'
import chennaiImg from '../assets/images/locations/chennai.webp'
import salemImg from '../assets/images/locations/salem.webp'
import bengaluruImg from '../assets/images/locations/bengaluru.webp'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { faqItems, galleryImages, pageContent, raceCategories, runningClubs, upcomingMeetups, venueDetails, volunteerProgram, ambassadorProgram } from '../data/platform'

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
      'Event-specific participation, cancellation, and safety terms are published with each confirmed event. Participants are expected to review and accept the terms during registration.',
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

  const seo = {
    categories: { title: 'Race Categories', description: 'Explore STRIDEFORGE race categories — Kids Run, 5K, 10K, Half Marathon, Full Marathon, and Corporate Challenge. Find your distance.', url: '/race-categories' },
    gallery: { title: 'Community & Gallery', description: 'Join the STRIDEFORGE running community. Running clubs, volunteer programs, ambassador network, and race-day photo galleries.', url: '/gallery' },
    faq: { title: 'FAQ', description: 'Answers to common questions about STRIDEFORGE marathon events — registration, bib collection, race day, refunds, and more.', url: '/faq' },
    about: { title: 'About Us', description: pageContent.about.description, url: '/about' },
    contact: { title: 'Contact', description: 'Get in touch with the STRIDEFORGE team. Event collaboration, participant support, partnership opportunities.', url: '/contact' },
    locations: { title: 'Locations', description: 'STRIDEFORGE marathon venues across India — Chennai, Salem, and Bengaluru. Route highlights, parking, and travel info.', url: '/locations' },
    schedule: { title: 'Schedule', description: 'Full event schedules, race briefings, wave starts, and participant instructions for all STRIDEFORGE events.', url: '/schedule' },
    sponsors: { title: 'Sponsors & Partners', description: 'Brands that partner with STRIDEFORGE to deliver world-class marathon experiences — title, medical, hydration, and technology partners.', url: '/sponsors' },
    privacy: { title: 'Privacy Policy', description: genericPages.privacy.description, url: '/privacy' },
    terms: { title: 'Terms of Service', description: genericPages.terms.description, url: '/terms' },
  }

  const s = seo[type] || { title: content.title, description: content.description, url: `/${type}` }

  /* ── Race categories ──────────────────────────────── */
  if (type === 'categories') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <SEO title={s.title} description={s.description} url={s.url} />
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
                  {cat.difficulty ?? cat.audience ?? ''}
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

  /* ── Gallery / Community ──────────────────────────── */
  if (type === 'gallery') {
    const comm = pageContent.community
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <SEO title={s.title} description={s.description} url={s.url} />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Eyebrow>{comm.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            {comm.title.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{comm.description}</p>

          {/* Photo Gallery */}
          <div className="mt-14 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((img) => (
              <div
                key={img.alt}
                className={`group relative overflow-hidden rounded-2xl border border-steel/40 ${
                  img.large ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                style={{ aspectRatio: img.large ? '1/1' : '4/3' }}
              >
                <img
                  alt={img.alt}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  src={img.src}
                />
                {img.caption && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-3 pt-6 text-xs font-semibold uppercase tracking-widest text-sf-white/80 transition-transform duration-300 group-hover:translate-y-0">
                    {img.caption}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Running Clubs */}
          <div className="mt-20">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Running Clubs
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              RUN WITH YOUR CITY.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {runningClubs.map((club) => (
                <article key={club.name} className="group overflow-hidden rounded-3xl border border-steel bg-carbon transition-all duration-300 hover:-translate-y-1 hover:border-ember/30">
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      alt={club.name}
                      src={club.image}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-ember">{club.city}</p>
                    <h3 className="mt-1.5 font-semibold text-sf-white">{club.name}</h3>
                    <p className="mt-1 text-xs text-muted">{club.members} members</p>
                    <p className="mt-3 text-sm leading-6 text-muted">{club.description}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ember">
                      <FaClock aria-hidden="true" />{club.meets}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Volunteer Program */}
          <div className="mt-20 rounded-3xl border border-steel bg-carbon p-8 sm:p-10">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Volunteer Program
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              BE PART OF THE ACTION.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{volunteerProgram.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {volunteerProgram.roles.map((role) => (
                <div key={role} className="flex items-start gap-3 rounded-xl border border-steel bg-obsidian/60 p-4">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  <span className="text-sm leading-6 text-muted">{role}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex-1 rounded-xl border border-ember/20 bg-ember/5 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-ember">Perks</p>
                <ul className="mt-3 space-y-1.5">
                  {volunteerProgram.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-xs text-muted">
                      <span className="size-1 rounded-full bg-ember/60" aria-hidden="true" />{perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ambassador Program */}
          <div className="mt-16 rounded-3xl border border-ember/20 bg-ember/5 p-8 sm:p-10">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Ambassador Program
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              LEAD THE RUN.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{ambassadorProgram.description}</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ember">Benefits</p>
                <ul className="mt-4 space-y-3">
                  {ambassadorProgram.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-6 text-muted">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-volt" aria-hidden="true" />{b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ember">Expectations</p>
                <ul className="mt-4 space-y-3">
                  {ambassadorProgram.expectations.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-sm leading-6 text-muted">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />{e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Meetups */}
          <div className="mt-16">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />Community Meetups
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              SHOW UP. RUN TOGETHER.
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {upcomingMeetups.map((meetup) => (
                <article key={meetup.title} className="rounded-2xl border border-steel bg-carbon p-6 transition-all hover:border-ember/30 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-ember/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-ember">{meetup.type}</span>
                      <h3 className="mt-3 font-semibold text-sf-white">{meetup.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{meetup.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-dim">
                        <span className="flex items-center gap-1.5"><FaCalendarDays className="text-ember text-[10px]" aria-hidden="true" />{meetup.date}</span>
                        <span className="flex items-center gap-1.5"><FaClock className="text-ember text-[10px]" aria-hidden="true" />{meetup.time}</span>
                        <span className="flex items-center gap-1.5"><FaLocationDot className="text-ember text-[10px]" aria-hidden="true" />{meetup.location}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <Link
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            to="/contact"
          >
            Join our community <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </main>
    )
  }

  /* ── FAQ ──────────────────────────────────────────── */
  if (type === 'faq') {
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <SEO title={s.title} description={s.description} url={s.url} />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white">
              ANSWERS FOR RACE DAY.
            </h1>
            <Link
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-volt transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              to="/contact"
            >
              Still have questions? <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-steel border-y border-steel">
            {faqItems.map(([q, a]) => (
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

  /* ── About ─────────────────────────────────────────── */
  if (type === 'about') {
    const about = pageContent.about
    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <SEO title={s.title} description={s.description} url={s.url} />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
            {about.title.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted">{about.description}</p>

          {/* Story */}
          <div className="mt-14 max-w-3xl space-y-5">
            {about.story.map((p, i) => (
              <p key={i} className="text-sm leading-7 text-muted">{p}</p>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            <div className="rounded-3xl border border-steel bg-carbon p-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <FaFlag className="text-xs" aria-hidden="true" />{about.mission.heading}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">{about.mission.text}</p>
            </div>
            <div className="rounded-3xl border border-steel bg-carbon p-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                <FaFlag className="text-xs" aria-hidden="true" />{about.vision.heading}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">{about.vision.text}</p>
            </div>
          </div>

          {/* Why Participate */}
          <div className="mt-14">
            <h2 className="font-display text-3xl font-black italic text-sf-white">WHY PARTICIPATE</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {about.whyParticipate.map((item) => (
                <div key={item.title} className="rounded-2xl border border-steel bg-carbon p-6">
                  <h3 className="font-semibold text-sf-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Standards */}
          <div className="mt-14 rounded-3xl border border-steel bg-carbon p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <FaShield className="text-xs" aria-hidden="true" />{about.safety.heading}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {about.safety.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  <span className="text-sm leading-6 text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Impact */}
          <div className="mt-14 rounded-3xl border border-ember/20 bg-ember/5 p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <FaPeopleGroup className="text-xs" aria-hidden="true" />{about.communityImpact.heading}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{about.communityImpact.text}</p>
          </div>

          {/* Pillars */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {about.pillars.map((pillar) => (
              <div key={pillar.title} className="border-t border-ember/40 pt-5">
                <h3 className="font-semibold text-sf-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{pillar.detail}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="mt-14">
            <h2 className="font-display text-3xl font-black italic text-sf-white">OUR TEAM</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {about.team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-steel bg-carbon p-6">
                  <p className="font-semibold text-sf-white">{member.name}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">{member.role}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{member.note}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            to="/register"
          >
            Register now <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </main>
    )
  }

  /* ── Contact (with form) ──────────────────────────── */
  if (type === 'contact') {
    const contact = pageContent.contact
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [formErrors, setFormErrors] = useState({})
    const [formSubmitted, setFormSubmitted] = useState(false)

    const validateForm = () => {
      const e = {}
      if (!formData.name.trim()) e.name = 'Enter your full name'
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email address'
      if (!formData.subject.trim()) e.subject = 'Enter a subject for your message'
      if (!formData.message.trim()) e.message = 'Enter your message'
      return e
    }

    const handleSubmit = (event) => {
      event.preventDefault()
      const e = validateForm()
      setFormErrors(e)
      if (Object.keys(e).length === 0) {
        setFormSubmitted(true)
      }
    }

    const handleChange = (field) => (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const socialIconMap = { Instagram: FaInstagram, 'X / Twitter': FaXTwitter, Facebook: FaFacebook, YouTube: FaYoutube, LinkedIn: FaLinkedin }

    return (
      <main className="bg-obsidian py-20 sm:py-28">
        <SEO title={s.title} description={s.description} url={s.url} />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
            {/* Left — Contact Info */}
            <div>
              <Eyebrow>{contact.eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
                {contact.title.toUpperCase()}
              </h1>
              <p className="mt-5 text-base leading-7 text-muted">{contact.description}</p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-steel bg-carbon text-ember">
                    <FaEnvelope aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Email</p>
                    <a href={`mailto:${contact.email}`} className="mt-0.5 block text-sm font-medium text-sf-white transition-colors hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-steel bg-carbon text-ember">
                    <FaPhone aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Phone</p>
                    <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="mt-0.5 block text-sm font-medium text-sf-white transition-colors hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
                      {contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-steel bg-carbon text-ember">
                    <FaLocationDot aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Office</p>
                    <p className="mt-0.5 text-sm leading-6 text-sf-white">
                      {contact.office.line1}<br />{contact.office.line2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-steel bg-carbon text-ember">
                    <FaClock aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Support Hours</p>
                    <p className="mt-0.5 text-sm text-sf-white">{contact.supportTimings}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Follow us</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {contact.social.map((s) => {
                    const Icon = socialIconMap[s.platform]
                    return (
                      <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-steel px-4 py-2 text-sm text-muted transition-colors hover:border-ember/60 hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                        aria-label={s.platform}
                      >
                        {Icon && <Icon className="text-sm" aria-hidden="true" />}
                        {s.handle}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div>
              <div className="rounded-3xl border border-steel bg-carbon p-7 sm:p-10">
                <p className="font-display text-2xl font-black italic text-sf-white">SEND US A MESSAGE</p>
                <p className="mt-2 text-sm text-muted">We typically respond within 24 hours during business days.</p>

                {formSubmitted ? (
                  <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg className="size-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="mt-4 font-display text-xl font-black italic text-sf-white">MESSAGE SENT</p>
                    <p className="mt-2 text-sm text-muted">Thanks for reaching out — our team will get back to you shortly.</p>
                    <button onClick={() => { setFormSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }) }}
                      className="mt-6 rounded-full border border-steel px-6 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-ember/40 hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                    <div>
                      <label className="block text-sm font-medium text-muted" htmlFor="contact-name">Full name <span className="text-ember">*</span></label>
                      <input id="contact-name" className={formErrors.name ? inputCls.replace('border-steel', 'border-red-500/60') : inputCls}
                        placeholder="Your full name" type="text" value={formData.name} onChange={handleChange('name')}
                        aria-invalid={!!formErrors.name} aria-describedby={formErrors.name ? 'err-name' : undefined} />
                      {formErrors.name && <p id="err-name" className="mt-1 text-xs text-red-400" role="alert">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted" htmlFor="contact-email">Email address <span className="text-ember">*</span></label>
                      <input id="contact-email" className={formErrors.email ? inputCls.replace('border-steel', 'border-red-500/60') : inputCls}
                        placeholder="your@email.com" type="email" value={formData.email} onChange={handleChange('email')}
                        aria-invalid={!!formErrors.email} aria-describedby={formErrors.email ? 'err-email' : undefined} />
                      {formErrors.email && <p id="err-email" className="mt-1 text-xs text-red-400" role="alert">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted" htmlFor="contact-subject">Subject <span className="text-ember">*</span></label>
                      <input id="contact-subject" className={formErrors.subject ? inputCls.replace('border-steel', 'border-red-500/60') : inputCls}
                        placeholder="What is this about?" type="text" value={formData.subject} onChange={handleChange('subject')}
                        aria-invalid={!!formErrors.subject} aria-describedby={formErrors.subject ? 'err-subject' : undefined} />
                      {formErrors.subject && <p id="err-subject" className="mt-1 text-xs text-red-400" role="alert">{formErrors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted" htmlFor="contact-message">Message <span className="text-ember">*</span></label>
                      <textarea id="contact-message" className={`${formErrors.message ? inputCls.replace('border-steel', 'border-red-500/60') : inputCls} min-h-36 resize-none`}
                        placeholder="Tell us about your enquiry…" value={formData.message} onChange={handleChange('message')}
                        aria-invalid={!!formErrors.message} aria-describedby={formErrors.message ? 'err-message' : undefined} />
                      {formErrors.message && <p id="err-message" className="mt-1 text-xs text-red-400" role="alert">{formErrors.message}</p>}
                    </div>
                    <button type="submit"
                      className="w-full rounded-full bg-ember px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      Send message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── Locations ────────────────────────────────────── */
  if (type === 'locations') {
    const cityOrder = ['Chennai', 'Salem', 'Bengaluru']
    const cityData = {
      Chennai: { image: chennaiImg, tag: 'Marina Beach' },
      Salem: { image: salemImg, tag: 'Yercaud Hills' },
      Bengaluru: { image: bengaluruImg, tag: 'Cubbon Park · Vidhana Soudha' },
    }
    return (
      <main className="bg-obsidian">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SEO title={s.title} description={s.description} url={s.url} />
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
              {content.title.toUpperCase()}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">{content.description}</p>
          </div>
        </section>

        {/* City showcase */}
        <section className="bg-carbon pb-24 sm:pb-32" aria-label="Host cities">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-24">
              {cityOrder.map((cityName, idx) => {
                const info = cityData[cityName]
                return (
                  <article key={cityName} className={`group relative grid items-center gap-10 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-3xl border border-steel/40">
                      <img
                        alt={`${cityName} marathon route — ${info.tag}`}
                        src={info.image}
                        className="aspect-[4/3] w-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="absolute bottom-4 left-4 rounded-full bg-obsidian/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sf-white backdrop-blur-sm">
                        {info.tag}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                        {cityName}
                      </span>
                      <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
                        {cityName.toUpperCase()}
                      </h2>
                      <p className="mt-3 max-w-md text-base leading-7 text-muted">
                        {venueDetails[cityName.toLowerCase()]?.routeHighlights?.[0] ?? 'Explore the route through the heart of the city.'}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-steel bg-obsidian/60 px-4 py-2.5">
                          <FaLocationDot className="text-ember text-sm" aria-hidden="true" />
                          <span className="text-sm text-sf-white">{venueDetails[cityName.toLowerCase()]?.address ?? cityName}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Venue details */}
        <section className="bg-obsidian py-20 sm:py-28" aria-label="Venue details">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10">
              {cityOrder.map((cityName) => {
                const venue = venueDetails[cityName.toLowerCase()]
                if (!venue) return null
                return (
                <section key={cityName} className="rounded-3xl border border-steel bg-carbon p-6 sm:p-8 lg:p-10">
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                    {/* Left — venue info */}
                    <div>
                      <div className="mb-5 flex items-center gap-3">
                        <span className="size-2.5 rounded-full bg-ember" aria-hidden="true" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-ember">{cityName}</span>
                      </div>
                      <h2 className="font-display text-3xl font-black italic leading-none tracking-tight text-sf-white">
                        {venue.name}
                      </h2>
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                        <FaLocationDot className="text-ember" aria-hidden="true" />{venue.address}
                      </p>

                      {/* Route highlights */}
                      <div className="mt-7">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Route Highlights</p>
                        <ul className="mt-3 space-y-2">
                          {venue.routeHighlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-volt" aria-hidden="true" />{h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right — practical details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-steel bg-obsidian p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Parking</p>
                        <ul className="mt-2 space-y-1">
                          {venue.parking.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember/60" aria-hidden="true" />{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-steel bg-obsidian p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Public Transport</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{venue.publicTransport.nearestStation}</p>
                        {venue.publicTransport.busRoutes?.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {venue.publicTransport.busRoutes.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted">
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-volt/60" aria-hidden="true" />{r}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-1 text-sm leading-6 text-ember/80">{venue.publicTransport.info}</p>
                      </div>
                      <div className="rounded-xl border border-steel bg-obsidian p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Hotels</p>
                        <ul className="mt-2 space-y-1">
                          {venue.hotels.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember/60" aria-hidden="true" />{h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-steel bg-obsidian p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Medical Support</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{venue.medicalSupport}</p>
                      </div>
                      <div className="rounded-xl border border-steel bg-obsidian p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-ember">Water Stations</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{venue.waterStations}</p>
                      </div>
                      {venue.otherDetails && (
                        <div className="rounded-xl border border-steel bg-obsidian p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ember">Other Details</p>
                          <p className="mt-2 text-sm leading-6 text-muted">{venue.otherDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </section>
    </main>
    )
  }

  /* ── Default static page ──────────────────────────── */
  return (
    <main className="bg-obsidian py-20 sm:py-28">
      <SEO title={s.title} description={s.description} url={s.url} />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-display text-5xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl">
          {content.title.toUpperCase()}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">{content.description}</p>
        <Link
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          to="/register"
        >
          Register now <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}

export default ContentPage
