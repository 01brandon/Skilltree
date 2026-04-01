// skill card - used in the skills browse grid
import { Link } from 'react-router-dom'

// map category to font awesome icon class
var CATEGORY_ICONS = {
  'Programming': 'fa-solid fa-code',
  'Design':      'fa-solid fa-pen-nib',
  'Mathematics': 'fa-solid fa-square-root-variable',
  'Science':     'fa-solid fa-flask',
  'Language':    'fa-solid fa-language',
  'Business':    'fa-solid fa-chart-line',
  'Music':       'fa-solid fa-music',
  'Writing':     'fa-solid fa-feather',
  'Health':      'fa-solid fa-heart-pulse',
  'Other':       'fa-solid fa-layer-group',
}

// map difficulty level number to label
var LEVEL_LABELS = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

export default function SkillCard({ skill, showProgress }) {
  var icon  = CATEGORY_ICONS[skill.category] || CATEGORY_ICONS['Other']
  var level = LEVEL_LABELS[skill.level] || 'Beginner'

  return (
    <Link to={'/skills/' + skill.id} className="card block group">

      {/* card image strip - imageUrl already contains sizing params from EditCharacterPage */}
      {skill.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={skill.imageUrl}
            alt={skill.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">
        {/* category + level badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="badge badge-grey flex items-center gap-1.5">
            <i className={icon + ' text-xs'}></i>
            {skill.category}
          </span>
          <span className="badge badge-green">{level}</span>
        </div>

        {/* title */}
        <h3 className="font-display text-lg font-semibold text-ink mb-2 leading-snug group-hover:text-forest transition-colors">
          {skill.name}
        </h3>

        {/* description */}
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 mb-4">
          {skill.description || 'No description provided.'}
        </p>

        {/* progress bar - only shown when user owns this skill */}
        {showProgress && (
          <div>
            <div className="flex justify-between text-xs text-ink-muted mb-1.5">
              <span>Progress</span>
              <span>{skill.progress || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: (skill.progress || 0) + '%' }}></div>
            </div>
          </div>
        )}

        {/* footer row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ash">
          <span className="text-xs text-ink-muted flex items-center gap-1.5">
            <i className="fa-regular fa-clock"></i>
            {skill.estimatedHours || '—'} hrs
          </span>
          <span className="text-xs text-forest font-medium flex items-center gap-1">
            View skill
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </span>
        </div>
      </div>
    </Link>
  )
}