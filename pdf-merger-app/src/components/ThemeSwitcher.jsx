import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useDropdown } from '../contexts/DropdownContext'
import { Sun, Moon, Palette, Image, Settings, X } from 'lucide-react'
import './ThemeSwitcher.css'

const accentColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Teal', value: '#14b8a6' },
]

const backgroundThemes = [
  { name: 'Default', value: 'default' },
  { name: 'Gradient', value: 'gradient' },
  { name: 'Geometric', value: 'geometric' },
  { name: 'Wave', value: 'wave' },
  { name: 'Dots', value: 'dots' },
]

export default function ThemeSwitcher() {
  const { isDarkMode, accentColor, backgroundTheme, toggleDarkMode, setAccentColor, setBackgroundTheme } = useTheme()
  const { toggleDropdown, closeDropdown, isOpen } = useDropdown()
  const isDropdownOpen = isOpen('theme')

  const toggleMenu = () => toggleDropdown('theme')
  const closeMenu = () => closeDropdown()



  return (
    <div className="theme-switcher">
      <div className="theme-dropdown">
        <button className="settings-btn futuristic-btn" onClick={toggleMenu}>
          <Settings size={16} />
          <span style={{ marginLeft: '8px' }}>Settings</span>
        </button>
        
        {isDropdownOpen && createPortal(
          <div className="theme-menu" style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            background: 'var(--card-background)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.5rem',
            minWidth: '280px',
            boxShadow: 'var(--glass-shadow)',
            zIndex: 10001
          }}>
            <button className="close-btn" onClick={closeMenu}>
              <X size={16} />
            </button>
            
            <div className="theme-section">
              <div className="theme-toggle" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </div>

            <div className="theme-section">
              <div className="theme-header">
                <Palette size={16} />
                <span>Accent Color</span>
              </div>
              <div className="color-options">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    className={`color-option ${accentColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      setAccentColor(color.value)
                      closeMenu()
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="theme-section">
              <div className="theme-header">
                <Image size={16} />
                <span>Background</span>
              </div>
              <div className="background-options">
                {backgroundThemes.map((theme) => (
                  <button
                    key={theme.value}
                    className={`theme-option ${backgroundTheme === theme.value ? 'selected' : ''}`}
                    onClick={() => {
                      setBackgroundTheme(theme.value)
                      closeMenu()
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  )
}