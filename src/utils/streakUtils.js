// calculates current study streak from session array
export function calcStreak(sessions) {
  if (!sessions.length) return 0
  var dates = [...new Set(sessions.map(function (s) { return s.date }))].sort().reverse()
  var today     = new Date().toISOString().slice(0, 10)
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  var streak  = 0
  var current = new Date(dates[0])
  for (var i = 0; i < dates.length; i++) {
    var d    = new Date(dates[i])
    var diff = Math.round((current - d) / 86400000)
    if (diff === 0 || diff === 1) { streak++; current = d } else { break }
  }
  return streak
}

// returns hours per day for the last 7 days
export function weeklyHours(sessions) {
  var result = {}
  for (var i = 6; i >= 0; i--) {
    var d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    result[d] = 0
  }
  sessions.forEach(function (s) {
    if (result[s.date] !== undefined) result[s.date] += (s.duration || 0) / 60
  })
  return result
}