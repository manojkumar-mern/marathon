import { useEffect, useRef, useState } from 'react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { Link, NavLink } from 'react-router-dom'
import { navigationItems } from '../../../data/platform'
import BrandMark from '../../common/BrandMark'
import Button from '../../common/Button'

function Navbar() {
  const [isOpen, setIsOpen]       = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef             = useRef(null)

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 20)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.body.classList.add('overflow-hidden')
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('overflow-hidden')
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-steel bg-obsidian/95 shadow-2xl shadow-black/50 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-10">
        <BrandMark />

        {/* Desktop nav links */}
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember ${
                      isActive
                        ? 'text-sf-white'
                        : 'text-muted hover:text-sf-white'
                    }`
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button to="/register">Register Now</Button>
        </div>

        {/* Mobile burger button */}
        <button
          ref={menuButtonRef}
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className="grid size-10 place-items-center rounded-full border border-steel text-sf-white transition-colors hover:border-steel-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember lg:hidden"
          type="button"
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in drawer */}
      <aside
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-carbon px-6 py-6 shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-steel pb-6">
          <BrandMark />
          <button
            aria-label="Close navigation"
            className="grid size-10 place-items-center rounded-full border border-steel text-sf-white hover:border-steel-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-8 flex-1" aria-label="Mobile primary navigation">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link
                  className="block rounded-xl px-4 py-3.5 text-lg font-medium text-sf-white/80 transition-colors hover:bg-steel hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          className="mt-auto"
          to="/register"
          onClick={() => setIsOpen(false)}
        >
          Register for an Event
        </Button>
      </aside>
    </header>
  )
}

export default Navbar
