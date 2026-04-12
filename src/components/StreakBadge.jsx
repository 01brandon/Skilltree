// streak badge - shows current study streak
export default function StreakBadge({ streak }) {
  if (streak === 0) return null
  return (
    <div className="flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full">
      <i className="fa-solid fa-fire text-sm"></i>
      <span className="text-sm font-medium">{streak} day streak</span>
    </div>
  )
}

