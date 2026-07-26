import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaSpinner, FaCheck, FaCircleExclamation } from 'react-icons/fa6'
import SEO from '../components/common/SEO'
import BrandMark from '../components/common/BrandMark'
import { BRAND } from '../config/brand'
import { useAuth } from '../context/useAuth'

const iCls = 'mt-2 w-full rounded-xl border border-steel bg-obsidian px-4 py-3 text-sm text-sf-white outline-none transition-colors placeholder:text-muted-dim focus:border-ember'
const iECls = 'mt-2 w-full rounded-xl border border-red-500/60 bg-obsidian px-4 py-3 text-sm text-sf-white outline-none transition-colors placeholder:text-muted-dim focus:border-red-400'
const lCls = 'block text-sm font-medium text-muted'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, isAuthenticated } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const redirect = searchParams.get('redirect') || '/'

  if (isAuthenticated) {
    navigate(redirect, { replace: true })
    return null
  }

  const upd = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (mode === 'register') {
      if (!form.fullName.trim()) e.fullName = 'Full name is required'
      if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone number required'
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (mode === 'register' && form.password !== form.passwordConfirm) e.passwordConfirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccessMsg('')
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        navigate(redirect, { replace: true })
      } else {
        await register({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
        })
        setSuccessMsg('Registration successful! Redirecting...')
        setTimeout(() => navigate(redirect, { replace: true }), 1000)
      }
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-obsidian py-20 sm:py-28">
      <SEO title={mode === 'login' ? 'Sign In' : 'Create Account'} description={`${mode === 'login' ? 'Sign in' : 'Create an account'} for ${BRAND.name} events.`} url="/login" />
      <div className="mx-auto max-w-md px-5 sm:px-8">
        <div className="mb-8 text-center">
          <BrandMark />
          {mode === 'login' ? (
            <>
              <h1 className="mt-6 font-display text-4xl font-black italic text-sf-white">WELCOME BACK</h1>
              <p className="mt-2 text-sm text-muted">Sign in to manage your registrations.</p>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-4xl font-black italic text-sf-white">CREATE ACCOUNT</h1>
              <p className="mt-2 text-sm text-muted">Register to start your race journey.</p>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-steel bg-carbon p-8">
          {successMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <FaCheck aria-hidden="true" /> {successMsg}
            </div>
          )}

          {serverError && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
              <FaCircleExclamation aria-hidden="true" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <div className="mb-5">
                <label className={lCls}>Full name <span className="text-ember">*</span>
                  <input name="fullName" value={form.fullName} onChange={upd} className={errors.fullName ? iECls : iCls} placeholder="Arun Kumar" />
                </label>
                {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
              </div>
            )}

            <div className="mb-5">
              <label className={lCls}>Email address <span className="text-ember">*</span>
                <input name="email" type="email" value={form.email} onChange={upd} className={errors.email ? iECls : iCls} placeholder="arun@email.com" />
              </label>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {mode === 'register' && (
              <div className="mb-5">
                <label className={lCls}>Phone number <span className="text-ember">*</span>
                  <input name="phone" type="tel" value={form.phone} onChange={upd} className={errors.phone ? iECls : iCls} placeholder="98765 43210" />
                </label>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
            )}

            <div className="mb-5">
              <label className={lCls}>Password <span className="text-ember">*</span>
                <input name="password" type="password" value={form.password} onChange={upd} className={errors.password ? iECls : iCls} placeholder="At least 8 characters" />
              </label>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div className="mb-5">
                <label className={lCls}>Confirm password <span className="text-ember">*</span>
                  <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={upd} className={errors.passwordConfirm ? iECls : iCls} placeholder="Repeat your password" />
                </label>
                {errors.passwordConfirm && <p className="mt-1 text-xs text-red-400">{errors.passwordConfirm}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {loading ? <><FaSpinner className="animate-spin" aria-hidden="true" /> Processing...</> : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <FaArrowRight aria-hidden="true" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setErrors({}); setServerError('') }} className="font-semibold text-ember hover:text-volt transition-colors">
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setErrors({}); setServerError('') }} className="font-semibold text-ember hover:text-volt transition-colors">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted transition-colors hover:text-sf-white">
            ← Return home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Login
