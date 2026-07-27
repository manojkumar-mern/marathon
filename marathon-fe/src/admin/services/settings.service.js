import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const settingsService = {
  async get() {
    try {
      const res = await api.get('/admin/settings')
      return res.data
    } catch {
      return silentFallback(null)
    }
  },

  async update(data) {
    const res = await api.put('/admin/settings', data)
    return res.data
  },
}
