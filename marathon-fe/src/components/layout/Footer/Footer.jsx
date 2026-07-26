import { Link } from 'react-router-dom'
import { createElement } from 'react'
import { FaInstagram, FaXTwitter, FaFacebook } from 'react-icons/fa6'
import { BRAND } from '../../../config/brand'
import BrandMark from '../../common/BrandMark'

const quickLinks = [
  { label: 'About',      to: '/about' },
  { label: 'Events',     to: '/events' },
  { label: 'Locations',  to: '/locations' },
  { label: 'Community',  to: '/gallery' },
  { label: 'FAQ',        to: '/faq' },
]

const raceLinks = [
  { label: 'Race Guide',   to: '/race-categories' },
  { label: 'Schedule',     to: '/schedule' },
  { label: 'Register',     to: '/register' },
  { label: 'Partnerships', to: '/sponsors' },
  { label: 'Contact',      to: '/contact' },
]

const socialLinks = [
  { label: 'Instagram', href: BRAND.social.instagram.url, Icon: FaInstagram },
  { label: 'X / Twitter', href: BRAND.social.twitter.url, Icon: FaXTwitter },
  { label: 'Facebook', href: BRAND.social.facebook.url, Icon: FaFacebook },
]

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms',   to: '/terms' },
]

function Footer() {
  return (
    <footer className="border-t border-steel bg-[#050709] text-muted">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">

        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
              {BRAND.description}
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex size-9 items-center justify-center rounded-full border border-steel text-muted transition-colors hover:border-ember/60 hover:text-ember focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                >
                  {createElement(Icon, { className: 'text-sm', 'aria-hidden': true })}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              Navigation
            </p>
            <nav aria-label="Footer quick links">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      className="text-sm transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Race Info column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              Race Info
            </p>
            <nav aria-label="Footer race links">
              <ul className="space-y-3">
                {raceLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      className="text-sm transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${BRAND.supportEmail}`}
                  className="transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                >
                  {BRAND.supportEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.contactPhone.replace(/[^+\d]/g, '')}`}
                  className="transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                >
                  {BRAND.contactPhone}
                </a>
              </li>
              <li className="leading-6">
                {BRAND.cities.join(' · ')}
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter line */}
        <div className="mt-14 rounded-2xl border border-steel/50 bg-white/[0.02] px-6 py-5 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-sf-white">Stay race-ready.</span>{' '}
            Get event updates, training tips, and early registration access.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-ember-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-0 sm:shrink-0"
          >
            Get updates
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-steel pt-8">
          <p className="text-xs text-muted-dim">
            © {BRAND.year} {BRAND.name} Events. All rights reserved.
          </p>
          <div className="flex gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                className="text-xs text-muted-dim transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
