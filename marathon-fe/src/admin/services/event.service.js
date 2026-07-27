import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const eventService = {
  async list(params = {}) {
    try {
      const q = new URLSearchParams({ all: 'true', ...params }).toString()
      const res = await api.get(`/marathons?${q}`)
      return res.data
    } catch {
      return silentFallback({ marathons: [], total: 0 })
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/marathons/${id}`)
      return res.data.marathon
    } catch {
      return silentFallback(null)
    }
  },

  async create(data) {
    const res = await api.post('/marathons', data)
    return res.data.marathon
  },

  async update(id, data) {
    const res = await api.put(`/marathons/${id}`, data)
    return res.data.marathon
  },

  async remove(id) {
    await api.delete(`/marathons/${id}`)
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/marathons/${id}/status`, { status })
    return res.data.marathon
  },
}
