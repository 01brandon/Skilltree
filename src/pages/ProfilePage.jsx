// profile page - user stats and account info
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { calcStreak } from '../utils/streakUtils'
import WeeklyChart from '../components/WeeklyChart'

export default function ProfilePage() {
  var { user }                      = useAuth()
  var [allSessions, setAllSessions] = useState([])
  var [skillCount, setSkillCount]   = useState(0)
  var [loading, setLoading]         = useState(true)

  useEffect(function () {
    if (!user) return
    async function load() {
      var skillsRef  = collection(db, 'users', user.uid, 'skills')
      var skillsSnap = await getDocs(skillsRef)
      setSkillCount(skillsSnap.size)
      var sessions = []
      for (var s of skillsSnap.docs) {
        var sessSnap = await getDocs(collection(db, 'users', user.uid, 'skills', s.id, 'sessions'))
        sessSnap.forEach(function (d) { sessions.push(d.data()) })
      }
      setAllSessions(sessions)
      setLoading(false)
    }
    load()
  }, [user])

  var totalHrs = (allSessions.reduce(function (a, s) { return a + (s.duration || 0) }, 0) / 60).toFixed(1)
  var streak   = calcStreak(allSessions)

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Profile</h1>

      {/* user card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-ash-dark p-6 flex items-center gap-5 mb-6">
        <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
          <span className="text-xl text-cream font-semibold">
            {(user.displayName || user.email || '?')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">{user.displayName || 'No name set'}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Skills tracked', value: skillCount    },
          { label: 'Hours studied',  value: totalHrs      },
          { label: 'Day streak',     value: streak || '—' },
        ].map(function (s) {
          return (
            <div key={s.label} className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-ash-dark p-5 text-center">
              <p className="font-display text-3xl font-semibold text-forest">{s.value}</p>
              <p className="text-xs text-ink-muted mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      <WeeklyChart sessions={allSessions} />
    </div>
  )
}