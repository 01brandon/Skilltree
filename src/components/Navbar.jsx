// navbar - fixed top, transparent then white on scroll
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  var { user, logout }        = useAuth()
  var [scrolled, setScrolled] = useState(false)
  var [menuOpen, setMenuOpen] = useState(false)
  var navigate                = useNavigate()

  // detect scroll to add background
  useEffect(function () {
    function onScroll() { setScrolled(window.scrollY > 24) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return function () { window.removeEventListener('scroll', onScroll) }
  }, [])

  // logout is async - must be awaited before navigating so auth state clears first
  async function handleLogout() {
    await logout()
    navigate('/')
  }

  var publicLinks = [
    { to: '/#benefits',     label: 'Benefits'     },
    { to: '/#how-it-works', label: 'How It Works' },
    { to: '/skills',        label: 'Skills'       },
    { to: '/about',         label: 'About'        },
  ]

  var authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/skills',    label: 'Skills'    },
  ]

  var links = user ? authLinks : publicLinks

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-cream/95 backdrop-blur-sm nav-scrolled' : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* logo */}
        <Link to="/" className="font-display font-semibold text-xl text-ink tracking-tight">
          SkillTree
        </Link>

        {/* desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {links.map(function (link) {
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={function ({ isActive }) {
                    return [
                      'text-sm font-medium transition-colors duration-200',
                      isActive && link.to !== '/#benefits' && link.to !== '/#how-it-works'
                        ? 'text-forest'
                        : 'text-ink-soft hover:text-ink',
                    ].join(' ')
                  }}
                >
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        {/* right actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-ink-muted truncate max-w-[140px]">
                {user.displayName || user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-outline text-sm py-2">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost text-sm py-2">Sign in</Link>
              <Link to="/signup" className="btn btn-primary text-sm py-2">
                Get Started
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={function () { setMenuOpen(!menuOpen) }}
          aria-label="Toggle menu"
        >
          <i className={menuOpen ? 'fa-solid fa-xmark text-lg' : 'fa-solid fa-bars text-lg'}></i>
        </button>
      </nav>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-ash-dark px-6 py-6 flex flex-col gap-5">
          {links.map(function (link) {
            return (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-ink-soft hover:text-ink"
                onClick={function () { setMenuOpen(false) }}
              >
                {link.label}
              </Link>
            )
          })}
          <hr className="border-ash-dark" />
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline text-sm self-start">Sign out</button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login"  onClick={function () { setMenuOpen(false) }} className="btn btn-outline text-sm self-start">Sign in</Link>
              <Link to="/signup" onClick={function () { setMenuOpen(false) }} className="btn btn-primary text-sm self-start">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}