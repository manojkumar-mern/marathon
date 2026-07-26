import { api } from './api.js'

export const registrationService = {
  async create(data) {
    const res = await api.post('/registrations', data)
    return res.data.registration
  },

  async getMyRegistrations(params = {}) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)

    const qs = query.toString()
    const res = await api.get(`/registrations/me${qs ? `?${qs}` : ''}`)
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/registrations/${id}`)
    return res.data.registration
  },
}
