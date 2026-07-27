/**
 * Admin route redirect helpers.
 * Kept in a dedicated file so the routes file can safely export
 * both component functions and a default array (react-refresh rule).
 */
import { Navigate, useParams } from 'react-router-dom'

export function RedirectToDashboard() {
  return <Navigate to="/admin/dashboard" replace />
}

export function EventDetailsRedirect() {
  const { id } = useParams()
  return <Navigate to={`/admin/events/${id}`} replace />
}

export function EventFormRedirect() {
  const { id } = useParams()
  return <Navigate to={`/admin/events/${id}/edit`} replace />
}
