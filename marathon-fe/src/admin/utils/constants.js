/**
 * PAGE_TITLES — keyed by canonical /admin/* path.
 * Used by Header.jsx and Breadcrumbs.jsx.
 */
export const PAGE_TITLES = {
  '/admin/dashboard':    'Dashboard',
  '/admin/events':       'Events',
  '/admin/events/new':   'Create Event',
  '/admin/participants': 'Participants',
  '/admin/payments':     'Payments',
  '/admin/results':      'Results',
  '/admin/certificates': 'Certificates',
  '/admin/reports':      'Reports',
  '/admin/cms':          'CMS',
  '/admin/settings':     'Settings',
}

/**
 * PAGE_DESCRIPTIONS — keyed by canonical /admin/* path.
 * Used by PageContainer subtitle.
 */
export const PAGE_DESCRIPTIONS = {
  '/admin/dashboard':    'Executive command centre for your marathon management platform',
  '/admin/events':       'Create and manage marathon events',
  '/admin/events/new':   'Fill in the details to create a new marathon event',
  '/admin/participants': 'View and manage participant registrations',
  '/admin/payments':     'Track and manage payment transactions',
  '/admin/results':      'Publish and manage race results',
  '/admin/certificates': 'Generate and manage participant certificates',
  '/admin/reports':      'View analytics and generate exportable reports',
  '/admin/cms':          'Manage website content, announcements, and pages',
  '/admin/settings':     'Configure platform settings and integrations',
}

/**
 * Derives a human-readable label for a dynamic event route.
 * e.g. /admin/events/abc123        → 'Event Detail'
 *      /admin/events/abc123/edit   → 'Edit Event'
 */
export function getPageTitleForPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]

  // Dynamic event paths
  const editMatch = pathname.match(/^\/admin\/events\/[^/]+\/edit$/)
  if (editMatch) return 'Edit Event'

  const detailMatch = pathname.match(/^\/admin\/events\/[^/]+$/)
  if (detailMatch) return 'Event Detail'

  // Dynamic participant path
  const participantMatch = pathname.match(/^\/admin\/participants\/[^/]+$/)
  if (participantMatch) return 'Participant Profile'

  return 'Admin'
}

/**
 * Computes a display status string from a marathon document.
 */
export function getComputedStatus(event) {
  if (!event) return '—'
  if (event.status === 'cancelled') return 'Cancelled'
  if (event.status === 'completed') return 'Completed'
  if (event.status === 'draft') return 'Draft'
  if (event.status !== 'published') return event.status

  const now = new Date()
  const start = event.registrationStartDate ? new Date(event.registrationStartDate) : null
  const end   = event.registrationEndDate   ? new Date(event.registrationEndDate)   : null

  if (start && now < start) return 'Published'
  if (end   && now > end)   return 'Registration Closed'
  return 'Registration Open'
}
