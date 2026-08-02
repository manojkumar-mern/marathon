const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

import {
  MOCK_DASHBOARD_DATA,
  MOCK_UPCOMING_EVENTS,
  MOCK_PARTICIPANTS,
  MOCK_RECENT_PAYMENTS
} from '../admin/services/mock.data.js'

function handleMockResponse(endpoint, method, body) {
  const path = endpoint.split('?')[0]

  if (path === '/admin/dashboard') {
    return { data: MOCK_DASHBOARD_DATA }
  }
  if (path === '/marathons') {
    return { data: { marathons: MOCK_UPCOMING_EVENTS, total: MOCK_UPCOMING_EVENTS.length } }
  }
  if (path.startsWith('/marathons/')) {
    const id = path.split('/')[2]
    const marathon = MOCK_UPCOMING_EVENTS.find(e => e._id === id) || MOCK_UPCOMING_EVENTS[0]
    return { data: { marathon } }
  }
  if (path === '/registrations') {
    return {
      data: {
        registrations: MOCK_PARTICIPANTS,
        total: MOCK_PARTICIPANTS.length,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  }
  if (path.startsWith('/registrations/')) {
    const id = path.split('/')[2]
    const registration = MOCK_PARTICIPANTS.find(p => p._id === id) || MOCK_PARTICIPANTS[0]
    return { data: { registration } }
  }
  if (path === '/payments') {
    const rows = MOCK_RECENT_PAYMENTS.map((p) => ({
      ...p,
      receipt: p.transactionId,
      gatewayOrderId: p.transactionId,
      user: { fullName: p.fullName, email: 'user@example.com' },
      marathon: MOCK_UPCOMING_EVENTS[0],
      gateway: 'razorpay',
      paidAt: p.status === 'paid' ? p.createdAt : null,
    }))
    return {
      data: {
        payments: rows,
        total: rows.length,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    }
  }
  if (path.startsWith('/payments/')) {
    const id = path.split('/')[2]
    const payment = MOCK_RECENT_PAYMENTS.find(p => p._id === id) || MOCK_RECENT_PAYMENTS[0]
    return { data: { payment } }
  }
  if (path === '/results') {
    return {
      data: {
        results: [],
        total: 0
      }
    }
  }
  if (path === '/cms/pages') {
    return {
      data: {
        pages: [],
        total: 0
      }
    }
  }
  if (path === '/cms/announcements') {
    return {
      data: {
        announcements: [],
        total: 0
      }
    }
  }
  if (path === '/admin/settings') {
    return {
      data: {
        settings: {
          brandName: 'STRIDEFORGE',
          shortName: 'SF',
          companyName: 'STRIDEFORGE Events Pvt. Ltd.',
          tagline: 'Forged in Motion',
          supportEmail: 'hello@strideforge.in',
          contactPhone: '+91 80000 00000',
          officeAddress: 'No. 42, Mount Road, Chennai',
        }
      }
    }
  }
  return null
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request(endpoint, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const token = localStorage.getItem('token')

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config)
  } catch (err) {
    const mockData = handleMockResponse(endpoint, method, body)
    if (mockData !== null) {
      console.warn(`Local Mock Interceptor: returning offline fallback data for ${method} ${endpoint}`)
      return mockData
    }
    throw new ApiError('Network error. Please check your connection.', 0, null)
  }

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, data)
  }

  return data
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
}

export { ApiError }
