/**
 * STRIDEFORGE Admin Service Layer
 * ──────────────────────────────────────────────────────────────────────
 * Connects every admin page to the live backend APIs.
 * All backend responses have the shape: { success, message, data }
 * These helpers unwrap `.data` so callers work directly with payloads.
 *
 * Base URL: /api  (set via VITE_API_URL in .env, defaults to localhost:5000/api)
 * ──────────────────────────────────────────────────────────────────────
 */
import { api } from '../../services/api'

// ─── Dashboard ────────────────────────────────────────────────────────
export const adminService = {
  /**
   * GET /api/admin/dashboard
   * Returns: { stats, trends, paymentStatus, categoryDistribution,
   *             genderDistribution, ageDistribution, recentRegistrations,
   *             recentPayments, upcomingEvents, notifications, systemHealth }
   */
  async getDashboard() {
    const res = await api.get('/admin/dashboard')
    // Backend wraps in { success, message, data } — unwrap here
    return { data: res.data }
  },
}

// ─── Registrations (Participants) ────────────────────────────────────
export const registrationService = {
  /**
   * GET /api/registrations
   * Query params: page, limit, search, marathon, status, sort
   * Returns: { registrations, total, page, limit, totalPages }
   */
  async list(params = {}) {
    const q = new URLSearchParams(params).toString()
    const res = await api.get(`/registrations?${q}`)
    return res.data
  },

  /**
   * GET /api/registrations/:id
   */
  async getById(id) {
    const res = await api.get(`/registrations/${id}`)
    return res.data.registration
  },

  /**
   * PATCH /api/registrations/:id
   * Allowed fields: status, isCheckedIn, isCompleted, bibNumber
   */
  async update(id, data) {
    const res = await api.patch(`/registrations/${id}`, data)
    return res.data.registration
  },

  /**
   * DELETE /api/registrations/:id  (admin only)
   */
  async remove(id) {
    await api.delete(`/registrations/${id}`)
  },
}

// ─── Payments ─────────────────────────────────────────────────────────
export const paymentService = {
  /**
   * GET /api/payments
   * Query params: page, limit, status, gateway, marathon, sort
   * Returns: { payments, total, page, limit, totalPages }
   */
  async list(params = {}) {
    const q = new URLSearchParams(params).toString()
    const res = await api.get(`/payments?${q}`)
    return res.data
  },

  /**
   * GET /api/payments/:id
   */
  async getById(id) {
    const res = await api.get(`/payments/${id}`)
    return res.data.payment
  },
}
