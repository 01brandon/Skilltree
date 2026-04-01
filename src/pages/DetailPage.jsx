// detail page - single skill view with info and progress tabs
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { removeSkill } from '../utils/characterStorage'
import { InfoTab, ProgressTab } from '../components/Tabs'

export default function DetailPage() {
  var { id }                        = useParams()
  var { user }                      = useAuth()
  var navigate                      = useNavigate()
  var [skill, setSkill]             = useState(null)
  var [loading, setLoading]         = useState(true)
  var [activeTab, setActiveTab]     = useState('info')
  var [confirmDel, setConfirmDel]   = useState(false)
  var [deleting, setDeleting]       = useState(false)
  var [deleteErr, setDeleteErr]     = useState('')

  useEffect(function () {
    if (!user || !id) return
    getDoc(doc(db, 'users', user.uid, 'skills', id)).then(function (snap) {
      if (snap.exists()) setSkill({ id: snap.id, ...snap.data() })
      setLoading(false)
    })
  }, [user, id])

  // wrapped in try/catch so a network or permissions error doesn't
  // permanently lock the button with deleting=true and no feedback
  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    setDeleteErr('')
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'skills', id))
      removeSkill(user.uid, id)
      navigate('/skills')
    } catch (err) {
      setDeleteErr('Could not delete. Please try again.')
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>

  if (!skill) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted mb-4">Skill not found.</p>
        <Link to="/skills" className="btn btn-outline">Back to skills</Link>
      </div>
    )
  }

  var LEVEL_LABELS = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

  return (
    <div>
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
        <Link to="/skills" className="hover:text-ink transition-colors">Skills</Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-ink">{skill.name}</span>
      </nav>

      {/* header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge badge-grey">{skill.category}</span>
            <span className="badge badge-green">{LEVEL_LABELS[skill.level] || 'Beginner'}</span>
          </div>
          <h1 className="font-display text-4xl font-semibold text-ink leading-tight mb-3">{skill.name}</h1>
          <span className="text-sm text-ink-muted flex items-center gap-1.5">
            <i className="fa-regular fa-clock"></i>
            {skill.estimatedHours || '—'} hrs estimated
          </span>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link to={'/skills/' + id + '/edit'} className="btn btn-outline text-sm py-2">
              <i className="fa-solid fa-pen text-xs"></i>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn text-sm py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              disabled={deleting}
            >
              <i className="fa-solid fa-trash text-xs"></i>
              {confirmDel ? 'Confirm delete' : 'Delete'}
            </button>
          </div>
          {/* inline error shown if deleteDoc throws */}
          {deleteErr && (
            <p className="text-xs text-red-500">{deleteErr}</p>
          )}
        </div>
      </div>

      {/* overall progress bar */}
      <div className="bg-ash rounded-2xl p-6 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-ink">Overall progress</span>
          <span className="text-forest font-medium">{skill.progress || 0}%</span>
        </div>
        <div className="progress-bar" style={{ height: '10px' }}>
          <div className="progress-fill" style={{ width: (skill.progress || 0) + '%' }}></div>
        </div>
      </div>

      {/* tab navigation */}
      <div className="flex gap-1 border-b border-ash-dark mb-8">
        {[
          { key: 'info',     label: 'Overview',       icon: 'fa-solid fa-circle-info'    },
          { key: 'progress', label: 'Study sessions', icon: 'fa-solid fa-calendar-check' },
        ].map(function (tab) {
          var active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={function () { setActiveTab(tab.key) }}
              className={[
                'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                active ? 'border-forest text-forest' : 'border-transparent text-ink-muted hover:text-ink',
              ].join(' ')}
            >
              <i className={tab.icon + ' text-xs'}></i>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* tab content */}
      {activeTab === 'info'     && <InfoTab skill={skill} />}
      {activeTab === 'progress' && <ProgressTab skill={skill} />}
    </div>
  )
}