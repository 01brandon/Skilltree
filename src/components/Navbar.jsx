// navbar - fixed top, transparent then white on scroll, fully mobile responsive
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  var { user, logout }        = useAuth()
  var [scrolled, setScrolled] = useState(false)
  var [menuOpen, setMenuOpen] = useState(false)
  var navigate                = useNavigate()

  useEffect(function () {
    function onScroll() { setScrolled(window.scrollY > 24) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return function () { window.removeEventListener('scroll', onScroll) }
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        zIndex:     9999,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled
          ? (document.documentElement.classList.contains('dark') ? 'rgba(17,17,17,0.97)' : 'rgba(250,250,250,0.97)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* logo */}
        <Link to="/" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: '1.2rem', color: 'inherit', textDecoration: 'none' }}>
          SkillTree
        </Link>

        {/* desktop links - hidden below 768px */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }} className="desktop-nav">
          <li><a href="/#benefits"     style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>Benefits</a></li>
          <li><a href="/#how-it-works" style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>How It Works</a></li>
          <li><NavLink to="/skills" style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>Skills</NavLink></li>
          <li><NavLink to="/about"  style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>About</NavLink></li>
          {user && (
            <>
              <li><NavLink to="/dashboard" style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>Dashboard</NavLink></li>
              <li><NavLink to="/skills"    style={{ fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.7 }}>My Skills</NavLink></li>
            </>
          )}
        </ul>

        {/* desktop right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          <ThemeToggle />
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem', opacity: 0.6, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost"    style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>Sign in</Link>
              <Link to="/signup" className="btn btn-primary"  style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>
                Get Started
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }}></i>
              </Link>
            </>
          )}
        </div>

        {/* hamburger - always visible on mobile */}
        <button
          onClick={function () { setMenuOpen(!menuOpen) }}
          className="hamburger-btn"
          aria-label="Toggle menu"
          style={{
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            padding:     '8px',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            color:       'inherit',
          }}
        >
          <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} style={{ fontSize: '1.25rem' }}></i>
        </button>
      </nav>

      {/* mobile drawer */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: document.documentElement.classList.contains('dark') ? '#111111' : '#FAFAFA',
            borderTop:       '1px solid #E5E5E2',
            padding:         '1.5rem',
            display:         'flex',
            flexDirection:   'column',
            gap:             '1.25rem',
          }}
        >
          <a href="/#benefits"     style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>Benefits</a>
          <a href="/#how-it-works" style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>How It Works</a>
          <Link to="/skills" style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>Skills</Link>
          <Link to="/about"  style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>About</Link>
          {user && (
            <>
              <Link to="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>Dashboard</Link>
              <Link to="/profile"   style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', color: 'inherit', opacity: 0.8 }} onClick={function () { setMenuOpen(false) }}>Profile</Link>
            </>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #E5E5E2', margin: '0.25rem 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', opacity: 0.6 }}>Dark mode</span>
            <ThemeToggle />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E5E2', margin: '0.25rem 0' }} />

          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: '0.875rem' }}>
              Sign out
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login"  onClick={function () { setMenuOpen(false) }} className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: '0.875rem' }}>Sign in</Link>
              <Link to="/signup" onClick={function () { setMenuOpen(false) }} className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.875rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}