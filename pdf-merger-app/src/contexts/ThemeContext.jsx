import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

// Apply theme to DOM immediately
const applyThemeToDOM = (themeMode, accentColor) => {
  const root = document.documentElement
  const body = document.body
  
  // Determine dark mode
  let isDark = false
  if (themeMode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  } else {
    isDark = themeMode === 'dark'
  }
  
  console.log('Applying theme:', { themeMode, isDark, accentColor })
  
  // Apply dark class to both html and body
  root.classList.toggle('dark', isDark)
  body.classList.toggle('dark', isDark)
  
  // Apply accent color
  root.style.setProperty('--accent-color', accentColor)
  root.style.setProperty('--ai-gradient-start', accentColor)
  
  // Calculate gradient end
  const hex = accentColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const newR = Math.max(0, Math.min(255, r * 0.8))
  const newG = Math.max(0, Math.min(255, g * 0.8))
  const newB = Math.max(0, Math.min(255, b * 0.8))
  
  const gradientEnd = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
  root.style.setProperty('--ai-gradient-end', gradientEnd)
  
  console.log('Theme applied successfully')
  return isDark
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'system'
  })
  
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#3b82f6'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode') || 'system'
    if (savedMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return savedMode === 'dark'
  })

  // Apply theme on mount
  useEffect(() => {
    const actualDark = applyThemeToDOM(themeMode, accentColor)
    setIsDarkMode(actualDark)
  }, [])

  const setTheme = (mode) => {
    setThemeMode(mode)
    localStorage.setItem('themeMode', mode)
    
    const actualDark = applyThemeToDOM(mode, accentColor)
    setIsDarkMode(actualDark)
  }
  
  const updateAccentColor = (color) => {
    setAccentColor(color)
    localStorage.setItem('accentColor', color)
    
    applyThemeToDOM(themeMode, color)
  }

  const toggleDarkMode = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark'
    setTheme(newMode)
  }

  const value = {
    isDarkMode,
    themeMode,
    accentColor,
    toggleDarkMode,
    setTheme,
    setAccentColor: updateAccentColor,
    theme: isDarkMode ? 'dark' : 'light'
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