import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const cmsService = {
  async listPages(params = {}) {
    try {
      const q = new URLSearchParams(params).toString()
      const res = await api.get(`/cms/pages${q ? `?${q}` : ''}`)
      return res.data
    } catch {
      return silentFallback({ pages: [], total: 0 })
    }
  },

  async getPage(id) {
    try {
      const res = await api.get(`/cms/pages/${id}`)
      return res.data.page
    } catch {
      return silentFallback(null)
    }
  },

  async updatePage(id, data) {
    const res = await api.put(`/cms/pages/${id}`, data)
    return res.data.page
  },

  async listAnnouncements() {
    try {
      const res = await api.get('/cms/announcements')
      return res.data
    } catch {
      return silentFallback({ announcements: [] })
    }
  },

  async createAnnouncement(data) {
    const res = await api.post('/cms/announcements', data)
    return res.data.announcement
  },

  async updateAnnouncement(id, data) {
    const res = await api.put(`/cms/announcements/${id}`, data)
    return res.data.announcement
  },

  async removeAnnouncement(id) {
    await api.delete(`/cms/announcements/${id}`)
  },
}
