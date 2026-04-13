// site footer
import { Link } from 'react-router-dom'

export default function Footer() {
  var year = new Date().getFullYear()

  var columns = [
    {
      heading: 'Product',
      links: [
        { to: '/#benefits',     label: 'Benefits'      },
        { to: '/#how-it-works', label: 'How It Works'  },
        { to: '/skills',        label: 'Browse Skills' },
        { to: '/dashboard',     label: 'Dashboard'     },
      ],
    },
    {
      heading: 'Company',
      links: [
        { to: '/about', label: 'About' },
      ],
    },
    {
      heading: 'Account',
      links: [
        { to: '/signup', label: 'Create account' },
        { to: '/login',  label: 'Sign in'        },
      ],
    },
  ]

  return (
    <footer className="bg-ink text-cream/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* brand */}
          <div className="max-w-xs">
            <Link to="/" className="font-display text-xl text-cream font-semibold">SkillTree</Link>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              Track every skill. Measure real progress. Build a learning practice that actually sticks.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="Twitter"  className="text-cream/50 hover:text-cream transition-colors"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="https://github.com/01brandon/Skilltree" aria-label="GitHub"   className="text-cream/50 hover:text-cream transition-colors"><i className="fa-brands fa-github"></i></a>
              <a href="#" aria-label="LinkedIn" className="text-cream/50 hover:text-cream transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {columns.map(function (col) {
              return (
                <div key={col.heading}>
                  <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-4">{col.heading}</h4>
                  <ul className="flex flex-col gap-3 list-none">
                    {col.links.map(function (l) {
                      return (
                        <li key={l.to}>
                          <Link to={l.to} className="text-sm text-cream/60 hover:text-cream transition-colors">
                            {l.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30">{year} SkillTree. All rights reserved.</p>
          <p className="text-xs text-cream/30">Built for learners who mean it.</p>
        </div>
      </div>
    </footer>
  )
}