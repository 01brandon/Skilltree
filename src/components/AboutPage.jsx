// about page - mission, story, values
import { useEffect } from 'react'

function useReveal() {
  useEffect(function () {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible') })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { observer.observe(el) })
    return function () { observer.disconnect() }
  }, [])
}

export default function AboutPage() {
  useReveal()

  var values = [
    {
      icon:  'fa-solid fa-scale-balanced',
      title: 'Honest metrics',
      desc:  'We do not inflate progress or hand out certificates for watching a video. Every number in SkillTree reflects actual time and effort.',
    },
    {
      icon:  'fa-solid fa-lock-open',
      title: 'Your data, always',
      desc:  'Everything you log belongs to you. Export it, delete it, or just keep tracking. We do not sell it and we do not gate it.',
    },
    {
      icon:  'fa-solid fa-arrows-rotate',
      title: 'Built to iterate',
      desc:  'Learning is non-linear. SkillTree is designed for the reality of picking something back up after a break, not for streaks that shame you.',
    },
  ]

  return (
    <div className="bg-cream pt-28">

      {/* hero */}
      <section className="max-w-7xl mx-auto px-6 pb-24 border-b border-ash-dark">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-4">about skilltree</p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-ink leading-tight mb-6">
              We built this<br />for ourselves first.
            </h1>
            <p className="text-ink-soft leading-relaxed mb-4">
              SkillTree started as a spreadsheet. A single tab for tracking how many hours per week we
              were spending on things we actually wanted to get good at — not work deadlines, not
              coursework due dates, but deliberate practice on the things that mattered to us long term.
            </p>
            <p className="text-ink-soft leading-relaxed">
              The spreadsheet became a prototype. The prototype became something we kept opening every
              day. So we built it properly and now other people use it too.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="people collaborating around a table"
              className="w-full rounded-2xl object-cover"
              style={{ height: '420px' }}
            />
            <div
              className="absolute -bottom-6 -left-6 bg-forest text-cream rounded-2xl p-6 shadow-xl"
              style={{ maxWidth: '200px' }}
            >
              <p className="font-display text-3xl font-semibold">2023</p>
              <p className="text-sm text-cream/70 mt-1">Year we stopped using the spreadsheet</p>
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="reveal mb-16">
          <p className="text-xs uppercase tracking-widest text-ink-muted mb-3">what we stand for</p>
          <h2 className="font-display text-4xl font-semibold text-ink max-w-sm leading-tight">
            Three things we will not compromise on.
          </h2>
        </div>
        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(function (v) {
            return (
              <div key={v.title} className="pt-8 border-t border-ash-dark">
                <i className={v.icon + ' text-forest text-lg mb-5 block'}></i>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{v.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* image break with quote */}
      <section className="relative overflow-hidden h-96 reveal">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=80"
          alt="person coding at a desk"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-forest/60 flex items-center justify-center">
          <blockquote className="text-center text-cream max-w-2xl px-8">
            <p className="font-display text-3xl md:text-4xl font-semibold leading-snug mb-4">
              &ldquo;An hour logged is an hour that actually happened.&rdquo;
            </p>
            <cite className="text-sm text-cream/60 not-italic">The original SkillTree README</cite>
          </blockquote>
        </div>
      </section>

      {/* team note */}
      <section className="max-w-7xl mx-auto px-6 py-24 reveal">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-ink-muted mb-4">who builds this</p>
          <h2 className="font-display text-3xl font-semibold text-ink mb-6">
            A small team that uses the product every day.
          </h2>
          <p className="text-ink-soft leading-relaxed mb-4">
            We are not a VC-backed company with 60 engineers. We are a handful of people who care
            about learning tools that respect the user. Our roadmap is driven by what we need as
            learners ourselves and what users write in to ask for.
          </p>
          <p className="text-ink-soft leading-relaxed">
            If you have a thought, a bug, or a feature you really want — send us a note on the
            contact page. We read every message.
          </p>
        </div>
      </section>
    </div>
  )
}