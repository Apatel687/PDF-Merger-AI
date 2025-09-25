// Theme utility functions
export const applyTheme = (isDarkMode, accentColor, backgroundTheme) => {
  const root = document.documentElement
  const body = document.body
  
  // Apply dark mode class to both html and body
  root.classList.toggle('dark', isDarkMode)
  body.classList.toggle('dark', isDarkMode)
  
  // Apply accent color with immediate effect
  root.style.setProperty('--accent-color', accentColor)
  root.style.setProperty('--ai-gradient-start', accentColor)
  
  // Calculate gradient end color (darker version)
  const gradientEnd = adjustColorBrightness(accentColor, -20)
  root.style.setProperty('--ai-gradient-end', gradientEnd)
  
  // Apply background theme
  root.setAttribute('data-background', backgroundTheme)
  
  // Force repaint to ensure immediate visual update
  root.style.display = 'none'
  root.offsetHeight // Trigger reflow
  root.style.display = ''
}

export const adjustColorBrightness = (hex, percent) => {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Adjust brightness
  const newR = Math.max(0, Math.min(255, r + (r * percent / 100)))
  const newG = Math.max(0, Math.min(255, g + (g * percent / 100)))
  const newB = Math.max(0, Math.min(255, b + (b * percent / 100)))
  
  // Convert back to hex
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
}

export const getSystemTheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const saveUserStats = (stats) => {
  localStorage.setItem('appStats', JSON.stringify(stats))
}

export const getUserStats = () => {
  const saved = localStorage.getItem('appStats')
  return saved ? JSON.parse(saved) : {
    filesProcessed: 0,
    totalSize: 0,
    timesSaved: 0
  }
}

export const updateUserStats = (type, value = 1) => {
  const stats = getUserStats()
  
  switch (type) {
    case 'fileProcessed':
      stats.filesProcessed += value
      break
    case 'sizeProcessed':
      stats.totalSize += value
      break
    case 'fileSaved':
      stats.timesSaved += value
      break
  }
  
  saveUserStats(stats)
  return stats
}