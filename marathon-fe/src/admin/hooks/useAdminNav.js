import {
  FaGaugeHigh,
  FaCalendarDays,
  FaUsers,
  FaCreditCard,
  FaTrophy,
  FaCertificate,
  FaChartBar,
  FaNewspaper,
  FaGear,
} from 'react-icons/fa6'
import { useLocation } from 'react-router-dom'

/**
 * Canonical admin navigation items.
 * Paths must match the route tree in admin.routes.jsx exactly.
 */
const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: FaGaugeHigh    },
  { label: 'Events',       path: '/admin/events',       icon: FaCalendarDays },
  { label: 'Participants', path: '/admin/participants', icon: FaUsers        },
  { label: 'Payments',     path: '/admin/payments',     icon: FaCreditCard   },
  { label: 'Results',      path: '/admin/results',      icon: FaTrophy       },
  { label: 'Certificates', path: '/admin/certificates', icon: FaCertificate  },
  { label: 'Reports',      path: '/admin/reports',      icon: FaChartBar     },
  { label: 'CMS',          path: '/admin/cms',          icon: FaNewspaper    },
  { label: 'Settings',     path: '/admin/settings',     icon: FaGear         },
]

export function useAdminNav() {
  const { pathname } = useLocation()

  const activeItem =
    NAV_ITEMS.find(
      (item) =>
        pathname === item.path ||
        (item.path !== '/admin/dashboard' && pathname.startsWith(item.path + '/')),
    ) || NAV_ITEMS[0]

  return { navItems: NAV_ITEMS, activeItem }
}
