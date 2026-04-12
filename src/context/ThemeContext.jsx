// theme context - manages dark/light mode across the app
import { createContext, useContext, useEffect, useState } from 'react'

var ThemeContext = createContext(null)

export function useTheme() {
  var ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

export function ThemeProvider({ children }) {
  var [dark, setDark] = useState(function () {
    return localStorage.getItem('skilltree_theme') === 'dark'
  })

  useEffect(function () {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('skilltree_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('skilltree_theme', 'light')
    }
  }, [dark])

  function toggle() { setDark(function (d) { return !d }) }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}