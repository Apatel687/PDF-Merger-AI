// Initialize theme immediately to prevent flash
(function() {
  const savedDarkMode = localStorage.getItem('darkMode')
  const savedAccentColor = localStorage.getItem('accentColor')
  const savedBackgroundTheme = localStorage.getItem('backgroundTheme')
  
  const root = document.documentElement
  
  // Apply dark mode immediately
  if (savedDarkMode !== null) {
    const isDark = JSON.parse(savedDarkMode)
    root.classList.toggle('dark', isDark)
  } else {
    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
  
  // Apply accent color immediately
  if (savedAccentColor) {
    root.style.setProperty('--accent-color', savedAccentColor)
    root.style.setProperty('--ai-gradient-start', savedAccentColor)
    
    // Calculate darker gradient end
    const hex = savedAccentColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.max(0, Math.min(255, r * 0.8))
    const newG = Math.max(0, Math.min(255, g * 0.8))
    const newB = Math.max(0, Math.min(255, b * 0.8))
    
    const gradientEnd = `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
    root.style.setProperty('--ai-gradient-end', gradientEnd)
  }
  
  // Apply background theme immediately
  if (savedBackgroundTheme) {
    root.setAttribute('data-background', savedBackgroundTheme)
  }
})()