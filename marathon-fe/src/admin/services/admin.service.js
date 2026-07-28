import { api } from '../../services/api'
import { MOCK_DASHBOARD_DATA, MOCK_RECENT_PAYMENTS } from './mock.data'

// ─── Dashboard ────────────────────────────────────────────────────────
export const adminService = {
  /**
   * GET /api/admin/dashboard
   * Returns: { stats, trends, paymentStatus, categoryDistribution,
   *             genderDistribution, ageDistribution, recentRegistrations,
   *             recentPayments, upcomingEvents, notifications, systemHealth }
   * Falls back to rich mock data when the API is unavailable.
   */
  async getDashboard() {
    try {
      const res = await api.get('/admin/dashboard')
      // Backend wraps in { success, message, data } — unwrap here
      return { data: res.data }
    } catch {
      // API unavailable — return rich mock data so the dashboard is always useful
      return { data: MOCK_DASHBOARD_DATA }
    }
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
   * Falls back to mock payment data when the API is unavailable.
   */
  async list(params = {}) {
    try {
      const q = new URLSearchParams(params).toString()
      const res = await api.get(`/payments?${q}`)
      return res.data
    } catch {
      // Return mock payments as fallback
      const rows = MOCK_RECENT_PAYMENTS.map((p) => ({
        ...p,
        receipt: p.transactionId,
        gatewayOrderId: p.transactionId,
        user: { fullName: p.fullName, email: '' },
        marathon: null,
        gateway: 'razorpay',
        paidAt: p.status === 'paid' ? p.createdAt : null,
      }))
      return { payments: rows, total: rows.length, page: 1, limit: 20, totalPages: 1 }
    }
  },

  /**
   * GET /api/payments/:id
   */
  async getById(id) {
    const res = await api.get(`/payments/${id}`)
    return res.data.payment
  },
}
