// edit character page = add/edit skill form
// handles both creating a new skill and editing an existing one
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { upsertSkill } from '../utils/characterStorage'

var CATEGORIES = ['Programming', 'Design', 'Mathematics', 'Science', 'Language', 'Business', 'Music', 'Writing', 'Health', 'Other']
var LEVELS     = [
  { value: 1, label: 'Beginner'     },
  { value: 2, label: 'Elementary'   },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced'     },
  { value: 5, label: 'Expert'       },
]

// unsplash images keyed by category - set automatically on save
var CATEGORY_IMAGES = {
  'Programming': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=75',
  'Design':      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=75',
  'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=75',
  'Science':    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=75',
  'Language':    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=75',
  'Business':    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=75',
  'Music':       'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=75',
  'Writing':     'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=75',
  'Health':      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75',
  'Other':       'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=75',
}

var EMPTY_FORM = { name: '', category: 'Programming', level: 1, description: '', estimatedHours: '', progress: 0, resources: [] }

export default function EditCharacterPage() {
  var { id }                = useParams()
  var { user }              = useAuth()
  var navigate              = useNavigate()
  var isEdit                = Boolean(id && id !== 'new')

  var [form, setForm]       = useState(EMPTY_FORM)
  var [loading, setLoading] = useState(isEdit)
  var [saving, setSaving]   = useState(false)
  var [err, setErr]         = useState('')
  var [newRes, setNewRes]   = useState({ title: '', url: '', note: '' })

  // load existing skill data when in edit mode
  useEffect(function () {
    if (!isEdit || !user) return
    getDoc(doc(db, 'users', user.uid, 'skills', id)).then(function (snap) {
      if (snap.exists()) {
        var d = snap.data()
        setForm({
          name:           d.name           || '',
          category:       d.category       || 'Programming',
          level:          d.level          || 1,
          description:    d.description    || '',
          estimatedHours: d.estimatedHours || '',
          progress:       d.progress       || 0,
          resources:      d.resources      || [],
        })
      }
      setLoading(false)
    })
  }, [isEdit, user, id])

  function handleChange(e) {
    var { name, value, type } = e.target
    setForm(function (p) { return { ...p, [name]: type === 'number' ? Number(value) : value } })
    setErr('')
  }

  function handleResChange(e) {
    var { name, value } = e.target
    setNewRes(function (p) { return { ...p, [name]: value } })
  }

  function addResource() {
    if (!newRes.title.trim() && !newRes.url.trim()) return
    setForm(function (p) { return { ...p, resources: [...p.resources, { ...newRes }] } })
    setNewRes({ title: '', url: '', note: '' })
  }

  function removeResource(idx) {
    setForm(function (p) { return { ...p, resources: p.resources.filter(function (_, i) { return i !== idx }) } })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setErr('Skill name is required.'); return }
    setSaving(true)

    var payload = {
      name:           form.name.trim(),
      category:       form.category,
      level:          Number(form.level),
      description:    form.description.trim(),
      estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : null,
      progress:       Number(form.progress),
      resources:      form.resources,
      imageUrl:       CATEGORY_IMAGES[form.category] || CATEGORY_IMAGES['Other'],
      updatedAt:      serverTimestamp(),
    }

    try {
      if (isEdit) {
        await setDoc(doc(db, 'users', user.uid, 'skills', id), payload, { merge: true })
        upsertSkill(user.uid, { id, ...payload })
        navigate('/skills/' + id)
      } else {
        payload.createdAt = serverTimestamp()
        var ref = await addDoc(collection(db, 'users', user.uid, 'skills'), payload)
        upsertSkill(user.uid, { id: ref.id, ...payload })
        navigate('/skills/' + ref.id)
      }
    } catch {
      setErr('Could not save. Please try again.')
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>

  return (
    <div className="max-w-2xl">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
        <Link to="/skills" className="hover:text-ink">Skills</Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        {isEdit && <Link to={'/skills/' + id} className="hover:text-ink">{form.name || 'Skill'}</Link>}
        {isEdit && <i className="fa-solid fa-chevron-right text-[10px]"></i>}
        <span className="text-ink">{isEdit ? 'Edit' : 'Add skill'}</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        {isEdit ? 'Edit skill' : 'Add a skill'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Skill name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. React, Spanish, Music Theory" className="input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map(function (c) { return <option key={c} value={c}>{c}</option> })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Level</label>
            <select name="level" value={form.level} onChange={handleChange} className="input">
              {LEVELS.map(function (l) { return <option key={l.value} value={l.value}>{l.label}</option> })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="What are you learning and why?" rows={4} className="input resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Estimated hours</label>
            <input type="number" name="estimatedHours" value={form.estimatedHours} onChange={handleChange} placeholder="e.g. 50" min="0" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Current progress — {form.progress}%
            </label>
            <input type="range" name="progress" value={form.progress} onChange={handleChange} min="0" max="100" step="5" className="w-full accent-forest mt-2" />
          </div>
        </div>

        {/* resources section */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">Resources</label>
          {form.resources.map(function (r, i) {
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-ash rounded-xl mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{r.title || r.url}</p>
                  {r.url  && <p className="text-xs text-forest break-all">{r.url}</p>}
                  {r.note && <p className="text-xs text-ink-muted">{r.note}</p>}
                </div>
                <button type="button" onClick={function () { removeResource(i) }} className="text-ink-muted hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
            )
          })}
          <div className="bg-ash rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">Add a resource</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="title" value={newRes.title} onChange={handleResChange} placeholder="Title" className="input text-sm" />
              <input type="url"  name="url"   value={newRes.url}   onChange={handleResChange} placeholder="https://..." className="input text-sm" />
            </div>
            <input type="text" name="note" value={newRes.note} onChange={handleResChange} placeholder="Optional note" className="input text-sm" />
            <button type="button" onClick={addResource} className="btn btn-ghost self-start text-sm py-1.5">
              <i className="fa-solid fa-plus text-xs"></i>
              Add resource
            </button>
          </div>
        </div>

        {err && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{err}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add skill'}
            {!saving && <i className="fa-solid fa-check text-xs"></i>}
          </button>
          <button type="button" onClick={function () { navigate(-1) }} className="btn btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  )
}