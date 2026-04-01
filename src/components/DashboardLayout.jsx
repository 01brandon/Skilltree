// dashboard layout - sidebar + main content area for all dashboard routes
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// sidebar navigation items
var NAV_ITEMS = [
  { to: '/dashboard',  icon: 'fa-solid fa-gauge',   label: 'Overview'  },
  { to: '/skills',     icon: 'fa-solid fa-seedling', label: 'My Skills' },
  { to: '/skills/new', icon: 'fa-solid fa-plus',     label: 'Add Skill' },
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
    <div className="flex min-h-screen bg-ash">

      {/* sidebar */}
      <aside
        className={[
          'flex-shrink-0 bg-cream border-r border-ash-dark flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16',
        ].join(' ')}
      >
        {/* sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-ash-dark">
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

        {/* nav links */}
        <nav className="flex-1 py-4 px-2">
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

        {/* user section */}
        <div className="border-t border-ash-dark p-3">
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

      {/* main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-cream border-b border-ash-dark">
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
// dashboard overview - user stats, recent skills, quick actions
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  var { user }                          = useAuth()
  var [skills, setSkills]               = useState([])
  var [totalSessions, setTotalSessions] = useState(0)
  var [totalMinutes, setTotalMinutes]   = useState(0)
  var [loading, setLoading]             = useState(true)

  // realtime listener for user skills ordered by last updated
  useEffect(function () {
    if (!user) return
    var ref   = collection(db, 'users', user.uid, 'skills')
    var q     = query(ref, orderBy('updatedAt', 'desc'), limit(6))
    var unsub = onSnapshot(q, async function (snap) {
      var data = []
      snap.forEach(function (d) { data.push({ id: d.id, ...d.data() }) })
      setSkills(data)

      // aggregate session totals across all skills
      var sessMin   = 0
      var sessCount = 0
      for (var i = 0; i < data.length; i++) {
        var sessRef  = collection(db, 'users', user.uid, 'skills', data[i].id, 'sessions')
        var sessSnap = await getDocs(sessRef)
        sessCount += sessSnap.size
        sessSnap.forEach(function (s) { sessMin += s.data().duration || 0 })
      }
      setTotalSessions(sessCount)
      setTotalMinutes(sessMin)
      setLoading(false)
    })
    return function () { unsub() }
  }, [user])

  var greetHour = new Date().getHours()
  var greet     = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening'
  var name      = user?.displayName?.split(' ')[0] || 'there'

  var CATEGORY_ICONS = {
    'Programming': 'fa-solid fa-code',
    'Design':      'fa-solid fa-pen-nib',
    'Mathematics': 'fa-solid fa-square-root-variable',
    'Science':     'fa-solid fa-flask',
    'Language':    'fa-solid fa-language',
    'Business':    'fa-solid fa-chart-line',
    'Music':       'fa-solid fa-music',
    'Writing':     'fa-solid fa-feather',
    'Health':      'fa-solid fa-heart-pulse',
    'Other':       'fa-solid fa-layer-group',
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><div className="spinner"></div></div>
  }

  return (
    <div>
      {/* greeting */}
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-1">
          {greet}, {name}.
        </h1>
        <p className="text-ink-muted text-sm">
          {skills.length === 0 ? 'Add your first skill to get started.' : 'Here is where things stand today.'}
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: 'fa-solid fa-seedling',       label: 'Skills tracked',  value: skills.length,                                                                       sub: 'total'      },
          { icon: 'fa-regular fa-clock',         label: 'Hours studied',   value: (totalMinutes / 60).toFixed(1),                                                      sub: 'cumulative' },
          { icon: 'fa-solid fa-calendar-check',  label: 'Sessions logged', value: totalSessions,                                                                       sub: 'all time'   },
          { icon: 'fa-solid fa-chart-simple',    label: 'Avg. per skill',  value: skills.length ? Math.round(totalMinutes / skills.length) + ' min' : '—',             sub: 'study time' },
        ].map(function (s) {
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-ash-dark p-5">
              <i className={s.icon + ' text-forest text-sm mb-3 block'}></i>
              <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
              <p className="text-xs text-ink-muted mt-1">{s.label}</p>
              <p className="text-xs text-ink-muted/60">{s.sub}</p>
            </div>
          )
        })}
      </div>

      {/* recent skills header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Recent skills</h2>
        <div className="flex items-center gap-3">
          <Link to="/skills" className="text-sm text-forest hover:underline">View all</Link>
          <Link to="/skills/new" className="btn btn-primary text-sm py-2">
            <i className="fa-solid fa-plus text-xs"></i>
            Add skill
          </Link>
        </div>
      </div>

      {/* empty state */}
      {skills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ash-dark p-12 text-center">
          <i className="fa-solid fa-seedling text-4xl text-ash-dark mb-5 block"></i>
          <h3 className="font-display text-xl font-semibold text-ink mb-2">Nothing tracked yet</h3>
          <p className="text-sm text-ink-muted mb-6">Add a skill to start measuring your progress.</p>
          <Link to="/skills/new" className="btn btn-primary">
            Add your first skill
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map(function (skill) {
            var icon = CATEGORY_ICONS[skill.category] || CATEGORY_ICONS['Other']
            return (
              <Link key={skill.id} to={'/skills/' + skill.id} className="card block group p-5">
                <div className="flex items-start justify-between mb-4">
                  <span className="badge badge-grey flex items-center gap-1.5">
                    <i className={icon + ' text-xs'}></i>
                    {skill.category}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {['','Beginner','Elementary','Intermediate','Advanced','Expert'][skill.level] || 'Beginner'}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2 group-hover:text-forest transition-colors leading-snug">
                  {skill.name}
                </h3>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-ink-muted mb-1.5">
                    <span>Progress</span>
                    <span>{skill.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: (skill.progress || 0) + '%' }}></div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}