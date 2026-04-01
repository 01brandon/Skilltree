// tabs component - info tab and progress tab used inside DetailPage
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// infoTab - skill description, metadata grid, and resources list
export function InfoTab({ skill }) {
  if (!skill) return null

  var resources = skill.resources || []

  return (
    <div className="animate-fade-in">

      {/* description */}
      <section className="mb-8">
        <h3 className="font-display text-xl font-semibold text-ink mb-3">About this skill</h3>
        <p className="text-ink-soft leading-relaxed">
          {skill.description || 'No description has been added for this skill yet.'}
        </p>
      </section>

      {/* metadata grid */}
      <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: 'fa-solid fa-layer-group',  label: 'Category',   value: skill.category || '—' },
          { icon: 'fa-solid fa-signal',        label: 'Level',      value: ['','Beginner','Elementary','Intermediate','Advanced','Expert'][skill.level] || '—' },
          { icon: 'fa-regular fa-clock',       label: 'Est. Hours', value: (skill.estimatedHours || '—') + (skill.estimatedHours ? ' hrs' : '') },
          { icon: 'fa-solid fa-calendar-days', label: 'Added',      value: skill.createdAt?.toDate ? skill.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
        ].map(function (item) {
          return (
            <div key={item.label} className="bg-ash rounded-xl p-4">
              <i className={item.icon + ' text-forest mb-2 block text-sm'}></i>
              <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-medium text-ink text-sm">{item.value}</p>
            </div>
          )
        })}
      </section>

      {/* resources */}
      <section>
        <h3 className="font-display text-xl font-semibold text-ink mb-4">Resources</h3>
        {resources.length === 0 ? (
          <p className="text-sm text-ink-muted">No resources added yet. Edit this skill to add links and notes.</p>
        ) : (
          <ul className="flex flex-col gap-3 list-none">
            {resources.map(function (r, i) {
              return (
                <li key={i} className="flex items-start gap-3 p-4 bg-ash rounded-xl">
                  <i className="fa-solid fa-link text-forest mt-0.5 text-sm flex-shrink-0"></i>
                  <div>
                    <p className="text-sm font-medium text-ink">{r.title || r.url}</p>
                    {r.url  && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest hover:underline break-all">{r.url}</a>}
                    {r.note && <p className="text-xs text-ink-muted mt-1">{r.note}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

// progressTab - study session log form and history list
export function ProgressTab({ skill }) {
  var { user }                        = useAuth()
  var { id: skillId }                 = useParams()
  var [sessions, setSessions]         = useState([])
  var [loading, setLoading]           = useState(true)
  var [form, setForm]                 = useState({ duration: '', notes: '', date: new Date().toISOString().slice(0, 10) })
  var [saving, setSaving]             = useState(false)
  var [msg, setMsg]                   = useState('')

  // realtime listener for study sessions subcollection
  useEffect(function () {
    if (!user) return
    var ref   = collection(db, 'users', user.uid, 'skills', skillId, 'sessions')
    var unsub = onSnapshot(ref, function (snap) {
      var data = []
      snap.forEach(function (d) { data.push({ id: d.id, ...d.data() }) })
      data.sort(function (a, b) { return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0) })
      setSessions(data)
      setLoading(false)
    })
    return function () { unsub() }
  }, [user, skillId])

  function handleChange(e) {
    var { name, value } = e.target
    setForm(function (prev) { return { ...prev, [name]: value } })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.duration || isNaN(Number(form.duration))) {
      setMsg('Please enter a valid duration in minutes.')
      return
    }
    setSaving(true)
    var ref = collection(db, 'users', user.uid, 'skills', skillId, 'sessions')
    await addDoc(ref, {
      duration:  Number(form.duration),
      notes:     form.notes.trim(),
      date:      form.date,
      createdAt: serverTimestamp(),
    })
    setForm({ duration: '', notes: '', date: new Date().toISOString().slice(0, 10) })
    setMsg('Session logged.')
    setSaving(false)
    setTimeout(function () { setMsg('') }, 3000)
  }

  var totalMin = sessions.reduce(function (acc, s) { return acc + (s.duration || 0) }, 0)
  var totalHrs = (totalMin / 60).toFixed(1)

  return (
    <div className="animate-fade-in">

      {/* stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Sessions logged',  value: sessions.length },
          { label: 'Total hours',      value: totalHrs        },
          { label: 'Current progress', value: (skill?.progress || 0) + '%' },
        ].map(function (s) {
          return (
            <div key={s.label} className="bg-ash rounded-xl p-4 text-center">
              <p className="font-display text-2xl font-semibold text-forest">{s.value}</p>
              <p className="text-xs text-ink-muted mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* log session form */}
      <div className="bg-ash rounded-2xl p-6 mb-8">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Log a study session</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Duration (minutes)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 45" min="1" className="input" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="What did you cover today?" rows={3} className="input resize-none" />
          </div>
          {msg && <p className="text-sm text-forest">{msg}</p>}
          <button type="submit" className="btn btn-primary self-start" disabled={saving}>
            {saving ? 'Saving...' : 'Log session'}
            <i className="fa-solid fa-plus text-xs"></i>
          </button>
        </form>
      </div>

      {/* session history */}
      <h3 className="font-display text-lg font-semibold text-ink mb-4">Session history</h3>
      {loading ? (
        <div className="flex justify-center py-8"><div className="spinner"></div></div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-ink-muted">No sessions yet. Log your first one above.</p>
      ) : (
        <ul className="flex flex-col gap-3 list-none">
          {sessions.map(function (s) {
            return (
              <li key={s.id} className="flex items-start justify-between p-4 bg-ash rounded-xl gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{s.date}</p>
                  {s.notes && <p className="text-xs text-ink-muted mt-1">{s.notes}</p>}
                </div>
                <span className="badge badge-green flex-shrink-0">{s.duration} min</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}