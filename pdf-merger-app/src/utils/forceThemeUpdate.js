// Force theme update utility
export const forceThemeUpdate = () => {
  const root = document.documentElement
  
  // Get current theme mode
  const themeMode = localStorage.getItem('themeMode') || 'system'
  const accentColor = localStorage.getItem('accentColor') || '#3b82f6'
  
  // Determine if dark mode should be active
  let isDark = false
  if (themeMode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  } else {
    isDark = themeMode === 'dark'
  }
  
  // Apply dark mode class
  root.classList.toggle('dark', isDark)
  
  // Apply accent color
  root.style.setProperty('--accent-color', accentColor)
  root.style.setProperty('--ai-gradient-start', accentColor)
  
  // Calculate darker gradient end
  const hex = accentColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const newR = Math.max(0, Math.min(255, r * 0.8))
  const newG = Math.max(0, Math.min(255, g * 0.8))
  const newB = Math.max(0, Math.min(255, b * 0.8))
  
  const gradientEnd = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
  root.style.setProperty('--ai-gradient-end', gradientEnd)
  
  // Force repaint
  root.style.display = 'none'
  root.offsetHeight // Trigger reflow
  root.style.display = ''
  
  console.log('Theme force updated:', { themeMode, isDark, accentColor })
}