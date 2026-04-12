// signup page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  var { signup, loginWithGoogle } = useAuth()
  var navigate = useNavigate()

  var [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  var [loading, setLoading] = useState(false)
  var [err, setErr]         = useState('')

  function handleChange(e) {
    var { name, value } = e.target
    setForm(function (p) { return { ...p, [name]: value } })
    setErr('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim())              { setErr('Please enter your name.');                  return }
    if (!form.email)                    { setErr('Please enter your email.');                 return }
    if (form.password.length < 6)       { setErr('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setErr('Passwords do not match.');                 return }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.name.trim())
      navigate('/dashboard')
    } catch (fireErr) {
      setErr(fireErr.code === 'auth/email-already-in-use' ? 'That email is already registered.' : 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch {
      setErr('Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#111111] flex transition-colors duration-300">
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80" alt="person studying" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/40"></div>
        <div className="absolute top-12 left-10 right-10 text-cream">
          <p className="font-display text-xl font-semibold">SkillTree</p>
          <p className="text-sm text-cream/70 mt-2">Track every hour. Own every skill.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-xl font-semibold text-ink block mb-10 lg:hidden">SkillTree</Link>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">Create your account.</h1>
          <p className="text-ink-muted text-sm mb-8">Free, forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Your name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amara Osei" className="input" autoComplete="name" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" className="input" autoComplete="new-password" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Confirm password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat your password" className="input" autoComplete="new-password" />
            </div>
            {err && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{err}</p>}
            <button type="submit" className="btn btn-primary justify-center py-3" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-forest hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}