// home page - marketing landing page
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// intersection observer - adds .visible to elements with .reveal class
function useReveal() {
  useEffect(function () {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12 }
    )
    var els = document.querySelectorAll('.reveal, .reveal-stagger')
    els.forEach(function (el) { observer.observe(el) })
    return function () { observer.disconnect() }
  }, [])
}

// animates number counters when they scroll into view
function useCounters() {
  useEffect(function () {
    var els = document.querySelectorAll('[data-count]')
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        var el     = entry.target
        var target = parseInt(el.dataset.count, 10)
        var suffix = el.dataset.suffix || ''
        var start  = 0
        var step   = Math.ceil(target / 60)
        var timer  = setInterval(function () {
          start += step
          if (start >= target) {
            el.textContent = target + suffix
            clearInterval(timer)
          } else {
            el.textContent = start + suffix
          }
        }, 20)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })
    els.forEach(function (el) { observer.observe(el) })
    return function () { observer.disconnect() }
  }, [])
}

export default function HomePage() {
  useReveal()
  useCounters()

  var features = [
    {
      icon:  'fa-solid fa-seedling',
      title: 'Build at your own pace',
      desc:  'No rigid schedules. Log sessions when you have time, track streaks when you want to. SkillTree fits around your life, not the other way around.',
    },
    {
      icon:  'fa-solid fa-chart-line',
      title: 'See real progress',
      desc:  'Hours logged, milestones reached, skills levelled up. The data is yours and it is honest. No inflated completion certificates.',
    },
    {
      icon:  'fa-solid fa-layer-group',
      title: 'Organise your learning',
      desc:  'Group skills by category, set difficulty levels, attach resources. Everything in one place so you stop losing track of what you were studying.',
    },
  ]

  var steps = [
    { num: '01', title: 'Pick a skill',      desc: 'Add any subject you want to learn or improve. Programming, a language, a craft — anything.' },
    { num: '02', title: 'Log your sessions', desc: 'After each study session, record how long you spent and what you covered. Takes under a minute.' },
    { num: '03', title: 'Track the growth',  desc: 'Watch your progress bars move, your total hours accumulate, and your skill level climb over time.' },
  ]

  var testimonials = [
    {
      name:  'Amara Osei',
      role:  'Software engineering student',
      quote: 'I have tried every productivity app. SkillTree is the only one where I can actually see myself getting better over weeks, not just check boxes.',
      img:   'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&q=80',
    },
    {
      name:  'Theo Richter',
      role:  'Self-taught designer',
      quote: 'The session log changed how I study. Writing a two-line note after each session makes me retain so much more.',
      img:   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80',
    },
    {
      name:  'Priya Nair',
      role:  'Medical student',
      quote: 'Tracking anatomy alongside biochemistry alongside Swahili. SkillTree handles all of it without feeling cluttered.',
      img:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
    },
  ]

  return (
    <div className="bg-cream overflow-x-hidden">

      {/* hero */}
      <section className="relative pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted mb-6 animate-fade-in">
            Study analytics for serious learners
          </p>
          <h1
            className="font-display font-semibold text-ink leading-none mb-8"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
          >
            Track everything.
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <p className="text-lg text-ink-soft max-w-md leading-relaxed">
              Log study sessions, measure skill progress, and build a learning habit that holds.
              SkillTree puts your growth on record.
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/signup" className="btn btn-primary">
                Start for free
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
              <a href="#how-it-works" className="btn btn-outline">See how it works</a>
            </div>
          </div>

          {/* dashboard mockup with fake browser chrome */}
          <div className="relative z-10">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl border border-ash-dark"
              style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.14)' }}
            >
              <div className="bg-ash-dark flex items-center gap-2 px-4 py-3">
                <span className="w-3 h-3 rounded-full bg-red-300"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-300"></span>
                <span className="w-3 h-3 rounded-full bg-green-300"></span>
                <div className="flex-1 mx-4 bg-ash rounded-full h-5 text-xs text-ink-muted flex items-center px-3">
                  skilltree.app/dashboard
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80"
                alt="SkillTree dashboard showing skill progress"
                className="w-full object-cover object-top"
                style={{ height: '420px' }}
              />
            </div>
          </div>
        </div>

        {/* dark green stats strip */}
        <div className="bg-forest mt-[-60px] pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="reveal-stagger grid grid-cols-2 md:grid-cols-4 gap-8 text-cream">
              {[
                { count: 12000,  suffix: '+', label: 'Active learners' },
                { count: 340,    suffix: '+', label: 'Skills tracked'  },
                { count: 94,     suffix: '%', label: 'Retention rate'  },
                { count: 280000, suffix: '+', label: 'Sessions logged' },
              ].map(function (stat) {
                return (
                  <div key={stat.label} className="text-center md:text-left">
                    <p className="font-display font-semibold text-4xl md:text-5xl text-sage-light mb-1">
                      <span data-count={stat.count} data-suffix={stat.suffix}>0{stat.suffix}</span>
                    </p>
                    <p className="text-sm text-cream/60">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* features - asymmetric grid */}
      <section id="benefits" className="py-24 max-w-7xl mx-auto px-6">
        <div className="reveal mb-16">
          <p className="text-xs uppercase tracking-widest text-ink-muted mb-3">why skilltree</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink max-w-lg leading-tight">
            Learning should leave a record.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="reveal md:col-span-3 bg-ash rounded-2xl p-8 flex flex-col justify-between min-h-64 overflow-hidden relative group">
            <div>
              <i className={features[0].icon + ' text-forest text-xl mb-5 block'}></i>
              <h3 className="font-display text-2xl font-semibold text-ink mb-3">{features[0].title}</h3>
              <p className="text-ink-muted leading-relaxed max-w-sm">{features[0].desc}</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=75"
              alt="person studying"
              className="absolute right-0 bottom-0 w-48 h-48 object-cover opacity-20 group-hover:opacity-30 transition-opacity rounded-tl-2xl"
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-6">
            {[features[1], features[2]].map(function (f) {
              return (
                <div key={f.title} className="reveal card p-6 flex-1">
                  <i className={f.icon + ' text-forest text-base mb-4 block'}></i>
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" className="py-24 bg-forest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal mb-16">
            <p className="text-xs uppercase tracking-widest text-sage mb-3">the process</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream max-w-md leading-tight">
              Three steps. That is genuinely it.
            </h2>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(function (step) {
              return (
                <div key={step.num} className="border-t border-sage/30 pt-8">
                  <span className="font-display text-5xl font-semibold text-sage/40 block mb-6">{step.num}</span>
                  <h3 className="font-display text-2xl font-semibold text-cream mb-3">{step.title}</h3>
                  <p className="text-cream/60 leading-relaxed text-sm">{step.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="reveal mt-14">
            <Link to="/signup" className="btn btn-primary bg-sage-light text-forest hover:bg-cream">
              Start tracking today
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* category grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 reveal">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-3">what people track</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
              Every skill has a home.
            </h2>
          </div>
          <Link to="/skills" className="btn btn-outline flex-shrink-0">
            Browse all skills
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
        <div className="reveal-stagger grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: 'fa-solid fa-code',                 label: 'Programming' },
            { icon: 'fa-solid fa-pen-nib',              label: 'Design'      },
            { icon: 'fa-solid fa-language',             label: 'Languages'   },
            { icon: 'fa-solid fa-square-root-variable', label: 'Mathematics' },
            { icon: 'fa-solid fa-music',                label: 'Music'       },
            { icon: 'fa-solid fa-flask',                label: 'Science'     },
          ].map(function (cat) {
            return (
              <Link
                key={cat.label}
                to={'/skills?category=' + cat.label}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-ash-dark hover:border-forest hover:bg-ash transition-all duration-200"
              >
                <i className={cat.icon + ' text-xl text-ink-muted group-hover:text-forest transition-colors'}></i>
                <span className="text-sm font-medium text-ink">{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* testimonials */}
      <section className="py-24 bg-ash">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal mb-16">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-3">what learners say</p>
            <h2 className="font-display text-4xl font-semibold text-ink max-w-sm leading-tight">
              Real people. Real hours.
            </h2>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(function (t) {
              return (
                <div key={t.name} className="bg-cream rounded-2xl p-7 border border-ash-dark">
                  <p className="text-ink-soft leading-relaxed text-sm mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="text-sm font-medium text-ink">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="py-28 max-w-7xl mx-auto px-6 text-center reveal">
        <p className="text-xs uppercase tracking-widest text-ink-muted mb-4">ready when you are</p>
        <h2 className="font-display text-5xl md:text-6xl font-semibold text-ink mb-8 leading-tight">
          Your next skill<br />starts here.
        </h2>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="btn btn-primary text-base px-8 py-4">
            Create free account
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <Link to="/skills" className="btn btn-outline text-base px-8 py-4">Browse skills</Link>
        </div>
      </section>
    </div>
  )
}