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
          { icon: 'fa-solid fa-seedling',      label: 'Skills tracked',  value: skills.length,                                                          sub: 'total'      },
          { icon: 'fa-regular fa-clock',        label: 'Hours studied',   value: (totalMinutes / 60).toFixed(1),                                         sub: 'cumulative' },
          { icon: 'fa-solid fa-calendar-check', label: 'Sessions logged', value: totalSessions,                                                          sub: 'all time'   },
          { icon: 'fa-solid fa-chart-simple',   label: 'Avg. per skill',  value: skills.length ? Math.round(totalMinutes / skills.length) + ' min' : '—', sub: 'study time' },
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
                    {['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][skill.level] || 'Beginner'}
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