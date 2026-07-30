import { useCallback, useEffect, useRef, useState } from 'react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { Link, NavLink } from 'react-router-dom'
import BrandMark from '../../common/BrandMark'
import Button from '../../common/Button'
import useEdgeSwipe from '../../../hooks/useEdgeSwipe'

const menuItems = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'About',
    to: '/about',
  },
  {
    label: 'Events',
    to: '/events',
  },
  {
    label: 'Gallery',
    submenu: [
      { label: 'Photos', to: '/gallery' },
      { label: 'Videos', to: '/gallery' },
    ],
  },
  {
    label: 'Results',
    submenu: [
      { label: 'Race Results', to: '/login' },
      { label: 'Leaderboard', to: '/login' },
    ],
  },
  {
    label: 'Certificates',
    submenu: [
      { label: 'Download Certificate', to: '/login' },
      { label: 'Verify Certificate', to: '/login' },
    ],
  },
  {
    label: 'Support',
    submenu: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

function Navbar() {
  const [isOpen, setIsOpen]       = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef             = useRef(null)
  const openNav  = useCallback(() => setIsOpen(true),  [])
  const closeNav = useCallback(() => setIsOpen(false), [])
  useEdgeSwipe(openNav, closeNav, isOpen)

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 20)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const scrollY = window.scrollY
    const style = document.body.style
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.overflow = ''
      window.scrollTo(0, scrollY)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'border-white/10 bg-obsidian/75 shadow-lg shadow-black/25 backdrop-blur-md'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-10">
          <BrandMark />

          {/* Desktop nav links */}
          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {menuItems.map((item) => {
                if (item.submenu) {
                  return (
                    <li key={item.label} className="group relative py-2">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-medium tracking-wide text-muted hover:text-sf-white transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                      >
                        {item.label}
                        <svg
                          className="size-3 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute left-1/2 top-full z-50 pt-2 w-52 -translate-x-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                        <div className="rounded-2xl border border-white/10 bg-obsidian/95 p-2 shadow-2xl backdrop-blur-xl">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.to}
                              className="block rounded-xl px-4 py-2.5 text-xs font-semibold text-muted hover:bg-white/5 hover:text-sf-white transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                }

                return (
                  <li key={item.label}>
                    <NavLink
                      className={({ isActive }) =>
                        `text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember ${
                          isActive
                            ? 'text-sf-white'
                            : 'text-muted hover:text-sf-white'
                        }`
                      }
                      to={item.to}
                      end
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Desktop CTA & Login */}
          <div className="hidden lg:flex items-center gap-6">
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
      </header>

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
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-carbon shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
        }`}
      >
        <div className="flex items-center justify-between border-b border-steel px-6 pb-6 pt-6">
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

        <nav className="flex-1 overflow-y-auto px-6 py-4 [touch-action:pan-y]" aria-label="Mobile primary navigation">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  <div>
                    <span className="block px-4 py-1 text-xs font-bold uppercase tracking-wider text-ember">
                      {item.label}
                    </span>
                    <ul className="mt-1 pl-4 space-y-1 border-l border-white/5">
                      {item.submenu.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            className="block rounded-xl px-4 py-2 text-sm font-medium text-sf-white/80 transition-colors hover:bg-steel hover:text-sf-white"
                            to={sub.to}
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-sf-white/90 transition-colors hover:bg-steel hover:text-sf-white"
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 p-6 mt-auto border-t border-steel">
          <Button
            to="/register"
            onClick={() => setIsOpen(false)}
          >
            Register Now
          </Button>
        </div>
      </aside>
    </>
  )
}

export default Navbar
