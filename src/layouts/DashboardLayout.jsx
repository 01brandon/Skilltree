// dashboard layout - sidebar + main content area for all dashboard routes
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

var NAV_ITEMS = [
  { to: '/dashboard',  icon: 'fa-solid fa-gauge',   label: 'Overview'  },
  { to: '/skills',     icon: 'fa-solid fa-seedling', label: 'My Skills' },
  { to: '/skills/new', icon: 'fa-solid fa-plus',     label: 'Add Skill' },
  { to: '/profile',    icon: 'fa-solid fa-user',     label: 'Profile'   },
]

export default function DashboardLayout() {
  var { user, logout }              = useAuth()
  var [sidebarOpen, setSidebarOpen] = useState(true)
  var navigate                      = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg, #F2F2F0)' }}>

      <aside
        className={[
          'flex-shrink-0 border-r border-ash-dark flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16',
        ].join(' ')}
        style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#161616' : '#FAFAFA' }}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-ash-dark bg-cream dark:bg-[#161616]">
          {sidebarOpen && (
            <NavLink to="/" className="font-display font-semibold text-ink text-base">
              SkillTree
            </NavLink>
          )}
          <button
            onClick={function () { setSidebarOpen(!sidebarOpen) }}
            className="p-1.5 text-ink-muted hover:text-ink rounded-md hover:bg-ash transition-colors"
            aria-label="Toggle sidebar"
          >
            <i className={sidebarOpen ? 'fa-solid fa-chevron-left text-xs' : 'fa-solid fa-chevron-right text-xs'}></i>
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 bg-cream dark:bg-[#161616]">
          {NAV_ITEMS.map(function (item) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={function ({ isActive }) {
                  return [
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors',
                    isActive ? 'nav-link-active' : 'text-ink-soft hover:bg-ash hover:text-ink',
                  ].join(' ')
                }}
                title={!sidebarOpen ? item.label : ''}
              >
                <i className={item.icon + ' w-4 text-center flex-shrink-0'}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-ash-dark p-3 bg-cream dark:bg-[#161616]">
          {user && sidebarOpen && (
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-cream font-medium">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-ink-soft truncate">{user.displayName || user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-sm text-ink-muted hover:text-ink hover:bg-ash transition-colors"
            title="Sign out"
          >
            <i className="fa-solid fa-right-from-bracket w-4 text-center flex-shrink-0"></i>
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto bg-ash dark:bg-[#111111]">
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-cream dark:bg-[#161616] border-b border-ash-dark">
          <NavLink to="/" className="font-display font-semibold text-ink">SkillTree</NavLink>
          <button onClick={handleLogout} className="text-sm text-ink-muted">Sign out</button>
        </div>
        <div className="p-6 md:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}