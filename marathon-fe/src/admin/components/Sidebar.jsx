import { NavLink } from 'react-router-dom'
import { FaXmark, FaChevronLeft } from 'react-icons/fa6'
import { useAdminNav } from '../hooks/useAdminNav'
import { BRAND } from '../../config/brand'

function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { navItems } = useAdminNav()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-sidebar-dark transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        } ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className={`flex h-14 items-center border-b border-white/5 ${collapsed ? 'justify-center' : 'gap-3 px-4'}`}>
          {collapsed ? (
            <span className="font-display text-lg font-black italic text-ember">{BRAND.shortName}</span>
          ) : (
            <>
              <span className="font-display text-lg font-black italic text-white">{BRAND.shortName}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Admin</span>
            </>
          )}
          <button onClick={onClose} className={`ml-auto text-slate-400 hover:text-white lg:hidden ${collapsed ? 'hidden' : ''}`}>
            <FaXmark size={18} />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  collapsed ? 'justify-center px-2' : ''
                } ${
                  isActive
                    ? 'bg-ember/15 text-ember before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.5 before:rounded-full before:bg-ember'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-white/5 p-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FaChevronLeft size={12} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
