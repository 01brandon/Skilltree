// weekly activity bar chart - pure css, no library
import { weeklyHours } from '../utils/streakUtils'

export default function WeeklyChart({ sessions }) {
  var data    = weeklyHours(sessions)
  var entries = Object.entries(data)
  var max     = Math.max(...entries.map(function (e) { return e[1] }), 1)
  var DAYS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-ash-dark p-6">
      <h3 className="font-display text-lg font-semibold text-ink mb-6">This week</h3>
      <div className="flex items-end gap-2 h-32">
        {entries.map(function (entry) {
          var date  = entry[0]
          var hrs   = entry[1]
          var pct   = Math.round((hrs / max) * 100)
          var day   = DAYS[new Date(date + 'T00:00:00').getDay()]
          var today = date === new Date().toISOString().slice(0, 10)
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                <div
                  className={['w-full rounded-t-md transition-all duration-500', today ? 'bg-forest' : 'bg-sage-light'].join(' ')}
                  style={{ height: pct + '%', minHeight: hrs > 0 ? '4px' : '0' }}
                  title={hrs.toFixed(1) + ' hrs'}
                ></div>
              </div>
              <span className={['text-xs', today ? 'text-forest font-medium' : 'text-ink-muted'].join(' ')}>{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}