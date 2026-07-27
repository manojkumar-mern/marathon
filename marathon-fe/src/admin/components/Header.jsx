import { useState, useRef, useEffect } from 'react'
import { FaBars, FaBell, FaChevronDown, FaGear, FaArrowRightFromBracket } from 'react-icons/fa6'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import Breadcrumbs from './Breadcrumbs'
import { getPageTitleForPath } from '../utils/constants'

function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const pageTitle = getPageTitleForPath(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-steel/60 bg-obsidian/90 px-4 backdrop-blur-lg lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex size-8 items-center justify-center rounded-lg text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <FaBars size={16} />
        </button>
        <div className="hidden sm:block">
          <h2 className="font-display text-base font-bold italic text-sf-white">{pageTitle}</h2>
        </div>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex size-8 items-center justify-center rounded-lg text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
          aria-label="Notifications"
        >
          <FaBell size={16} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-ember ring-2 ring-obsidian" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
            aria-label="Profile menu"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-ember/10 text-xs font-bold text-ember">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="hidden text-xs font-medium sm:inline">{user?.fullName}</span>
            <FaChevronDown size={10} className={`transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-steel/60 bg-carbon p-1 shadow-2xl shadow-black/30">
              <div className="border-b border-steel/60 px-3 py-2.5">
                <p className="text-sm font-medium text-sf-white">{user?.fullName}</p>
                <p className="text-xs text-muted-dim">{user?.email}</p>
              </div>
              <div className="mt-1">
                <Link
                  to="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
                >
                  <FaGear size={14} />
                  Settings
                </Link>
                <button
                  onClick={() => { logout(); setDropdownOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-dim hover:bg-steel/40 hover:text-red-400 transition-colors"
                >
                  <FaArrowRightFromBracket size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
