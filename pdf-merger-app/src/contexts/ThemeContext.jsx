import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false // Default to light mode
  })
  
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#3b82f6'
  })
  
  const [backgroundTheme, setBackgroundTheme] = useState(() => {
    return localStorage.getItem('backgroundTheme') || 'default'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor)
    document.documentElement.style.setProperty('--accent-color', accentColor)
  }, [accentColor])

  useEffect(() => {
    localStorage.setItem('backgroundTheme', backgroundTheme)
    document.documentElement.setAttribute('data-background', backgroundTheme)
  }, [backgroundTheme])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  
  const value = {
    isDarkMode,
    accentColor,
    backgroundTheme,
    toggleDarkMode,
    setAccentColor,
    setBackgroundTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}