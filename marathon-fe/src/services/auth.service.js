import { api } from './api.js'

const TOKEN_KEY = 'token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
}

export const authService = {
  async register({ fullName, email, password, passwordConfirm, phone }) {
    const res = await api.post('/auth/register', {
      fullName,
      email,
      password,
      passwordConfirm,
      phone,
    })
    tokenStore.set(res.data.token)
    return res.data.user
  },

  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password })
    tokenStore.set(res.data.token)
    return res.data.user
  },

  async getMe() {
    const res = await api.get('/auth/me')
    return res.data.user
  },

  logout() {
    tokenStore.remove()
  },
}
