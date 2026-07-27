import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const resultService = {
  async list(params = {}) {
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
      )
      const q = new URLSearchParams(clean).toString()
      const res = await api.get(`/results${q ? `?${q}` : ''}`)
      return res.data
    } catch {
      return silentFallback({ results: [], total: 0 })
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/results/${id}`)
      return res.data.result
    } catch {
      return silentFallback(null)
    }
  },

  async create(data) {
    const res = await api.post('/results', data)
    return res.data.result
  },

  async update(id, data) {
    const res = await api.put(`/results/${id}`, data)
    return res.data.result
  },

  async remove(id) {
    await api.delete(`/results/${id}`)
  },
}
