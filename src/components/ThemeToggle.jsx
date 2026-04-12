// theme toggle button
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  var { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-ash-dark hover:bg-ash dark:hover:bg-ash transition-colors"
      aria-label="Toggle dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark
        ? <i className="fa-solid fa-sun text-sm text-sage"></i>
        : <i className="fa-solid fa-moon text-sm text-ink-muted"></i>
      }
    </button>
  )
}