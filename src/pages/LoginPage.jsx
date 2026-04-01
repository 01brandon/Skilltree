// login page
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  var { login, loginWithGoogle, error, setError } = useAuth()
  var navigate   = useNavigate()
  var location   = useLocation()
  var from       = location.state?.from?.pathname || '/dashboard'

  var [form, setForm]         = useState({ email: '', password: '' })
  var [loading, setLoading]   = useState(false)
  var [localErr, setLocalErr] = useState('')

  function handleChange(e) {
    var { name, value } = e.target
    setForm(function (p) { return { ...p, [name]: value } })
    setLocalErr('')
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setLocalErr('Please fill in both fields.'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setLocalErr(
        err.code === 'auth/invalid-credential'
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch {
      setLocalErr('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  var displayErr = localErr || error

  return (
    <div className="min-h-screen bg-cream flex">

      {/* left panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-xl font-semibold text-ink block mb-10">
            SkillTree
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">Welcome back.</h1>
          <p className="text-ink-muted text-sm mb-8">Sign in to pick up where you left off.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input" autoComplete="current-password" />
            </div>
            {displayErr && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{displayErr}</p>
            )}
            <button type="submit" className="btn btn-primary justify-center py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-6 flex items-center gap-3">
            <hr className="flex-1 border-ash-dark" />
            <span className="text-xs text-ink-muted">or</span>
            <hr className="flex-1 border-ash-dark" />
          </div>

          <button onClick={handleGoogle} className="btn btn-outline justify-center w-full py-3" disabled={loading}>
            <i className="fa-brands fa-google text-sm"></i>
            Continue with Google
          </button>

          <p className="text-sm text-ink-muted text-center mt-8">
            No account?{' '}
            <Link to="/signup" className="text-forest hover:underline font-medium">
              Create one — it is free.
            </Link>
          </p>
        </div>
      </div>

      {/* right panel - image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1000&q=80"
          alt="books on a shelf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/50"></div>
        <div className="absolute bottom-12 left-10 right-10 text-cream">
          <p className="font-display text-2xl font-semibold leading-snug">
            &ldquo;The best time to track your learning was a year ago. The second best time is now.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}