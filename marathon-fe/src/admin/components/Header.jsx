import { useState, useRef, useEffect, useCallback } from 'react'
import { FaBars, FaBell, FaChevronDown, FaGear, FaArrowRightFromBracket, FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa6'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import Breadcrumbs from './Breadcrumbs'
import NotificationPanel from './NotificationPanel'
import { adminService } from '../services/admin.service'
import { getPageTitleForPath } from '../utils/constants'

function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin-theme') || 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('admin-theme', theme)
  }, [theme])

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true)
    try {
      const res = await adminService.getDashboard()
      setNotifications(res.data?.notifications || [])
    } catch {
      setNotifications([])
    } finally {
      setNotifLoading(false)
    }
  }, [])

  useEffect(() => {
    if (notifOpen && notifications.length === 0) {
      fetchNotifications()
    }
  }, [notifOpen, notifications.length, fetchNotifications])

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
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
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
          title="Back to main website"
        >
          <FaArrowLeft size={12} />
          Website
        </Link>
        <div className="hidden sm:block">
          <h2 className="font-display text-base font-bold italic text-sf-white">{pageTitle}</h2>
        </div>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          className="flex size-8 items-center justify-center rounded-lg text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative flex size-8 items-center justify-center rounded-lg text-muted-dim hover:bg-steel/40 hover:text-sf-white transition-colors"
            aria-label="Notifications"
          >
            <FaBell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-ember text-[9px] font-bold text-obsidian ring-2 ring-obsidian">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="fixed left-4 right-4 top-14 sm:absolute sm:left-auto sm:right-0 sm:top-full mt-1.5 w-auto sm:w-80 rounded-xl border border-steel/60 bg-carbon p-3 shadow-2xl shadow-black/30">
              <div className="mb-2 flex items-center justify-between border-b border-steel/60 pb-2">
                <h3 className="text-sm font-semibold text-sf-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-ember/10 px-2 py-0.5 text-[11px] font-medium text-ember">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <NotificationPanel notifications={notifications} loading={notifLoading} />
            </div>
          )}
        </div>

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
