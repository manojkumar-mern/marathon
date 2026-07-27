import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const certificateService = {
  async list(params = {}) {
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
      )
      const q = new URLSearchParams(clean).toString()
      const res = await api.get(`/certificates${q ? `?${q}` : ''}`)
      return res.data
    } catch {
      return silentFallback({ certificates: [], total: 0 })
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/certificates/${id}`)
      return res.data.certificate
    } catch {
      return silentFallback(null)
    }
  },

  async generate(data) {
    const res = await api.post('/certificates/generate', data)
    return res.data.certificate
  },

  async regenerate(id) {
    const res = await api.post(`/certificates/${id}/regenerate`)
    return res.data.certificate
  },

  async remove(id) {
    await api.delete(`/certificates/${id}`)
  },
}
