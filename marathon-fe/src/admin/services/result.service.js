import { api } from '../../services/api'

export const resultService = {
  async list(params = {}) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
    )
    const q = new URLSearchParams(clean).toString()
    const res = await api.get(`/results${q ? `?${q}` : ''}`)
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/results/${id}`)
    return res.data.result
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

  async publish(marathonId) {
    const res = await api.post(`/results/publish/${marathonId}`)
    return res.data
  },

  async unpublish(marathonId) {
    const res = await api.post(`/results/unpublish/${marathonId}`)
    return res.data
  },
}
