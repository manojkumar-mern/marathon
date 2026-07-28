import { api } from '../../services/api'

export const settingsService = {
  async get() {
    const res = await api.get('/admin/settings')
    return res.data
  },

  async update(data) {
    const res = await api.put('/admin/settings', data)
    return res.data
  },
}
