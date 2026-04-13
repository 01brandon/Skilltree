// characters page = skills browse page
// shows a searchable, filterable grid of the current user's skills
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import SkillCard from '../components/SkillCard'

var CATEGORIES = ['All', 'Programming', 'Design', 'Mathematics', 'Science', 'Language', 'Business', 'Music', 'Writing', 'Health', 'Other']

export default function CharactersPage() {
  var { user }                            = useAuth()
  var [skills, setSkills]                 = useState([])
  var [loading, setLoading]               = useState(true)
  var [search, setSearch]                 = useState('')
  var [activeCategory, setActiveCategory] = useState('All')

  // realtime listener for all user skills
  useEffect(function () {
    if (!user) return
    var ref   = collection(db, 'users', user.uid, 'skills')
    var q     = query(ref, orderBy('createdAt', 'desc'))
    var unsub = onSnapshot(q, function (snap) {
      var data = []
      snap.forEach(function (d) { data.push({ id: d.id, ...d.data() }) })
      setSkills(data)
      setLoading(false)
    })
    return function () { unsub() }
  }, [user])

  // filter by search text and active category
  // use (s.name || '') so a missing name field never throws on .includes()
  var filtered = skills.filter(function (s) {
    var matchesSearch   = (s.name || '').toLowerCase().includes(search.toLowerCase())
    var matchesCategory = activeCategory === 'All' || s.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">My Skills</h1>
          <p className="text-sm text-ink-muted mt-1">{skills.length} skill{skills.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <Link to="/skills/new" className="btn btn-primary self-start">
          <i className="fa-solid fa-plus text-xs"></i>
          Add skill
        </Link>
      </div>

      {/* search bar */}
      <div className="relative mb-5">

        <input
          type="text"
          value={search}
          onChange={function (e) { setSearch(e.target.value) }}
          placeholder="Search your skills..."
          className="input pl-10"
        />
        {search && (
          <button onClick={function () { setSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}
      </div>

      {/* category filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(function (cat) {
          return (
            <button
              key={cat}
              onClick={function () { setActiveCategory(cat) }}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 border',
                activeCategory === cat
                  ? 'bg-forest text-cream border-forest'
                  : 'bg-white text-ink-soft border-ash-dark hover:border-ink-muted',
              ].join(' ')}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* skill grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-solid fa-seedling text-4xl text-ash-dark mb-4 block"></i>
          <p className="text-ink-muted text-sm">
            {search || activeCategory !== 'All' ? 'No skills match your filter.' : 'No skills yet. Add one to get started.'}
          </p>
          {!search && activeCategory === 'All' && (
            <Link to="/skills/new" className="btn btn-primary mt-6 inline-flex">Add your first skill</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(function (skill) {
            return <SkillCard key={skill.id} skill={skill} showProgress={true} />
          })}
        </div>
      )}
    </div>
  )
}