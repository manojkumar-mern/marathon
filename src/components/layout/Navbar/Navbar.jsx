import { useEffect, useRef, useState } from 'react'
import { FaArrowRight, FaBars, FaXmark } from 'react-icons/fa6'

const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeItem, setActiveItem] = useState('#home')
  const menuButtonRef = useRef(null)
  const firstDrawerLinkRef = useRef(null)

  useEffect(() => {
    const updateNavigationState = () => {
      setIsScrolled(window.scrollY > 24)
      setActiveItem(window.location.hash || '#home')
    }

    updateNavigationState()
    window.addEventListener('scroll', updateNavigationState, { passive: true })
    window.addEventListener('hashchange', updateNavigationState)

    return () => {
      window.removeEventListener('scroll', updateNavigationState)
      window.removeEventListener('hashchange', updateNavigationState)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    firstDrawerLinkRef.current?.focus()

    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleNavigation = (href) => {
    setActiveItem(href)
    closeMenu()
  }

  const headerClasses = isScrolled
    ? 'border-slate-200/10 bg-slate-950/85 text-white shadow-lg shadow-slate-950/15 backdrop-blur-xl'
    : 'border-transparent bg-transparent text-slate-950 shadow-none'

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,color] duration-300 ${headerClasses}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-10">
        <a
          className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
          href="#home"
          onClick={() => handleNavigation('#home')}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-orange-500 text-sm font-black tracking-tighter text-white transition-transform duration-300 group-hover:scale-105">
            KM
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-extrabold uppercase tracking-[0.2em]">Kauvery</span>
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] opacity-70">
              Marathon
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {navigationItems.map((item) => {
              const isActive = activeItem === item.href

              return (
                <li key={item.href}>
                  <a
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative py-2 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-orange-500 after:transition-transform after:duration-300 hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                      isActive ? 'text-orange-500 after:scale-x-100' : 'after:scale-x-0'
                    }`}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
            href="#register"
          >
            Register Now
            <FaArrowRight aria-hidden="true" className="text-xs" />
          </a>
        </div>

        <button
          ref={menuButtonRef}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="grid size-11 place-items-center rounded-full border border-current/15 text-xl transition-colors hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 lg:hidden"
          type="button"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </div>

      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
      />

      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-slate-950 px-6 pb-8 pt-6 text-white shadow-2xl transition-transform duration-300 ease-out sm:px-8 lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="mobile-navigation"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold uppercase tracking-[0.2em]">Kauvery Marathon</span>
          <button
            aria-label="Close navigation menu"
            className="grid size-11 place-items-center rounded-full border border-white/15 text-xl transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
            type="button"
            onClick={closeMenu}
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-16" aria-label="Mobile primary navigation">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = activeItem === item.href

              return (
                <li key={item.href}>
                  <a
                    ref={index === 0 ? firstDrawerLinkRef : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                      isActive ? 'bg-white/10 text-orange-400' : 'hover:bg-white/10 hover:text-orange-400'
                    }`}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                    <FaArrowRight aria-hidden="true" className="text-sm" />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <a
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
          href="#register"
          onClick={closeMenu}
        >
          Register Now
          <FaArrowRight aria-hidden="true" className="text-xs" />
        </a>
      </aside>
    </header>
  )
}

export default Navbar
