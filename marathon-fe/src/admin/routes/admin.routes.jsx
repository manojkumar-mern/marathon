import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import {
  RedirectToDashboard,
  EventDetailsRedirect,
  EventFormRedirect,
} from './redirects'

// ─── Page imports ─────────────────────────────────────────────────
const Dashboard     = lazy(() => import('../pages/Dashboard'))
const Events        = lazy(() => import('../pages/Events'))
const EventForm     = lazy(() => import('../pages/EventForm'))
const EventDetails  = lazy(() => import('../pages/EventDetails'))
const Participants  = lazy(() => import('../pages/Participants'))
const Payments      = lazy(() => import('../pages/Payments'))
const Results       = lazy(() => import('../pages/Results'))
const Certificates  = lazy(() => import('../pages/Certificates'))
const CertificateGenerate = lazy(() => import('../pages/CertificateGenerate'))
const CertificateDetail  = lazy(() => import('../pages/CertificateDetail'))
const Reports       = lazy(() => import('../pages/Reports'))
const CMS              = lazy(() => import('../pages/CMS'))
const ParticipantProfile = lazy(() => import('../pages/ParticipantProfile'))
const Settings      = lazy(() => import('../pages/Settings'))

/**
 * STRIDEFORGE Admin Route Tree
 * ──────────────────────────────────────────────────────────────────
 * All routes are direct children of /admin — no double-prefix.
 *
 * /admin/dashboard          → analytics overview
 * /admin/events             → event list
 * /admin/events/new         → create event
 * /admin/events/:id         → event detail
 * /admin/events/:id/edit    → edit event
 * /admin/participants       → participant management
 * /admin/payments           → payment management
 * /admin/results            → race results
 * /admin/certificates       → certificate generation
 * /admin/reports            → analytics reports
 * /admin/cms                → content management
 * /admin/settings           → platform settings
 * ──────────────────────────────────────────────────────────────────
 */
const adminRoutes = [
  /* ── Dashboard ──────────────────────────────────────────── */
  { path: 'dashboard',       element: <Dashboard /> },

  /* ── Events ──────────────────────────────────────────────── */
  { path: 'events',          element: <Events /> },
  { path: 'events/new',      element: <EventForm /> },
  { path: 'events/:id',      element: <EventDetails /> },
  { path: 'events/:id/edit', element: <EventForm /> },

  /* ── Core management modules ─────────────────────────────── */
  { path: 'participants',    element: <Participants /> },
  { path: 'participants/:id', element: <ParticipantProfile /> },
  { path: 'payments',        element: <Payments /> },
  { path: 'results',         element: <Results /> },
  { path: 'certificates',         element: <Certificates /> },
  { path: 'certificates/generate', element: <CertificateGenerate /> },
  { path: 'certificates/:id',      element: <CertificateDetail /> },
  { path: 'reports',         element: <Reports /> },
  { path: 'cms',             element: <CMS /> },
  { path: 'settings',        element: <Settings /> },

  /* ── Backward-compat redirects (old /dashboard/* bookmarks) ─ */
  { path: 'dashboard/events',          element: <Navigate to="/admin/events" replace /> },
  { path: 'dashboard/events/new',      element: <Navigate to="/admin/events/new" replace /> },
  { path: 'dashboard/events/:id',      element: <EventDetailsRedirect /> },
  { path: 'dashboard/events/:id/edit', element: <EventFormRedirect /> },
  { path: 'dashboard/participants',    element: <Navigate to="/admin/participants" replace /> },
  { path: 'dashboard/payments',        element: <Navigate to="/admin/payments" replace /> },
  { path: 'dashboard/cities',          element: <RedirectToDashboard /> },
  { path: 'dashboard/categories',      element: <RedirectToDashboard /> },
  { path: 'dashboard/sponsors',        element: <RedirectToDashboard /> },
  { path: 'dashboard/gallery',         element: <RedirectToDashboard /> },
  { path: 'dashboard/announcements',   element: <RedirectToDashboard /> },
  { path: 'dashboard/exports',         element: <Navigate to="/admin/reports" replace /> },
  { path: 'dashboard/check-in',        element: <RedirectToDashboard /> },
  { path: 'dashboard/settings',        element: <Navigate to="/admin/settings" replace /> },
]

export default adminRoutes
