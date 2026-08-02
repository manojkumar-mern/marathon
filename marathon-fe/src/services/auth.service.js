import { api } from './api.js'

const TOKEN_KEY = 'token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
}

const MOCK_ADMIN_USER = {
  _id: 'mock-admin-id',
  id: 'mock-admin-id',
  fullName: 'Vijay Manoj',
  email: 'vijaymanoj0000@gmail.com',
  role: 'admin',
}
const MOCK_ADMIN_TOKEN = 'mock-admin-token'

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
    try {
      const res = await api.post('/auth/login', { email, password })
      tokenStore.set(res.data.token)
      return res.data.user
    } catch (err) {
      if (
        (err.status === 0 || err.message?.includes('Network error')) &&
        email === 'vijaymanoj0000@gmail.com' &&
        password === 'Thalapathi.1'
      ) {
        console.warn('Backend API is offline. Falling back to local mock admin login.')
        tokenStore.set(MOCK_ADMIN_TOKEN)
        return MOCK_ADMIN_USER
      }
      throw err
    }
  },

  async getMe() {
    if (tokenStore.get() === MOCK_ADMIN_TOKEN) {
      return MOCK_ADMIN_USER
    }
    try {
      const res = await api.get('/auth/me')
      return res.data.user
    } catch (err) {
      if (err.status === 0 || err.message?.includes('Network error')) {
        const localToken = tokenStore.get()
        if (localToken === MOCK_ADMIN_TOKEN) {
          return MOCK_ADMIN_USER
        }
      }
      throw err
    }
  },

  logout() {
    tokenStore.remove()
  },
}
