import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { BRAND } from '../../config/brand'

/**
 * DEV_BYPASS — set VITE_DEV_BYPASS_AUTH=true in .env.local to skip
 * the auth guard entirely during local development.
 * Never active in production (import.meta.env.DEV is false in prod builds).
 */
const DEV_BYPASS = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'

/* ── Inline admin login form ────────────────────────────────────── */
function AdminLoginGate() {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [promoting, setPromoting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('This account does not have admin access.')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  async function handlePromote() {
    setPromoting(true)
    setError(null)
    try {
      const { api } = await import('../../services/api')
      const res = await api.post('/auth/become-admin')
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
      }
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Failed to promote account')
    } finally {
      setPromoting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-black italic text-sf-white">
            {BRAND.name}
          </span>
          <p className="mt-1 text-sm text-muted-dim">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-steel/60 bg-carbon p-8 shadow-xl shadow-obsidian">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-ember/10">
              <FaLock className="size-4 text-ember" />
            </div>
            <div>
              <h1 className="text-base font-bold text-sf-white">Sign in to continue</h1>
              <p className="text-xs text-muted-dim">Admin credentials required</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              <p>{error}</p>
              {error === 'This account does not have admin access.' && (
                <button
                  onClick={handlePromote}
                  disabled={promoting}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {promoting ? 'Promoting…' : 'Promote this account to admin'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-muted-dim">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-steel/60 bg-obsidian px-4 py-3 text-sm text-sf-white placeholder-muted-dim/40 outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-muted-dim">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-steel/60 bg-obsidian px-4 py-3 pr-10 text-sm text-sf-white placeholder-muted-dim/40 outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-dim hover:text-sf-white"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <FaEyeSlash className="size-4" /> : <FaEye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-ember px-4 py-3 text-sm font-bold text-obsidian transition-colors hover:bg-ember-deep disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ── Main guard ─────────────────────────────────────────────────── */
function AdminProtectedRoute({ children }) {
  const { user, isLoading, logout } = useAuth()

  // Development escape hatch — renders children directly without auth
  if (DEV_BYPASS) {
    return children
  }

  // Show spinner while checking stored token
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="size-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
      </div>
    )
  }

  // Not logged in → show inline login form (no redirect, stays on /admin/*)
  if (!user) {
    return <AdminLoginGate />
  }

  // Logged in but not admin → 403 screen with sign-out option
  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6">
        <h1 className="font-display text-5xl font-black italic text-ember">403</h1>
        <p className="mt-3 text-sm text-muted">
          Your account (<strong className="text-sf-white">{user.email}</strong>) does not have admin access.
        </p>
        <p className="mt-2 text-xs text-muted-dim">
          If your role was recently updated, sign out and sign back in.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={logout}
            className="rounded-xl bg-ember px-5 py-2.5 text-sm font-bold text-obsidian transition-colors hover:bg-ember/80"
          >
            Sign out &amp; try again
          </button>
          <a href="/" className="text-sm text-muted hover:text-ember">
            Return to website
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default AdminProtectedRoute
