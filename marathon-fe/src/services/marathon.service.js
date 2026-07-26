import { api } from './api.js'

export const marathonService = {
  async getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)
    if (params.search) query.set('search', params.search)
    if (params.city) query.set('city', params.city)

    const qs = query.toString()
    const res = await api.get(`/marathons${qs ? `?${qs}` : ''}`)
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/marathons/${id}`)
    return res.data.marathon
  },

  async getBySlug(slug) {
    const res = await api.get(`/marathons/slug/${slug}`)
    return res.data.marathon
  },
}
