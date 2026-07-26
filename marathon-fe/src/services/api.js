const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
  } catch {
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
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
}

export { ApiError }
