import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useDropdown } from '../contexts/DropdownContext'
import { getUserStats, updateUserStats } from '../utils/themeUtils'
import { forceThemeUpdate } from '../utils/forceThemeUpdate'
import SettingsNotification from './SettingsNotification'
import { 
  Settings, 
  X, 
  Sun, 
  Moon, 
  Palette, 
  Image, 
  Zap, 
  Shield, 
  Eye, 
  Volume2, 
  Download, 
  Cpu, 
  HardDrive,
  Wifi,
  Bell,
  Lock,
  Accessibility,
  Monitor,
  Smartphone,
  RotateCcw,
  Save,
  FileText,
  Globe,
  Sliders
} from 'lucide-react'
import './EnhancedSettings.css'

const accentColors = [
  { name: 'Ocean Blue', value: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { name: 'Emerald Green', value: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
  { name: 'Sunset Orange', value: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { name: 'Rose Pink', value: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
  { name: 'Royal Purple', value: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { name: 'Teal Cyan', value: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { name: 'Crimson Red', value: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)' },
  { name: 'Indigo Blue', value: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
]



const performanceSettings = [
  { key: 'animations', label: 'Smooth Animations', icon: Zap, default: true },
  { key: 'autoSave', label: 'Auto-save Progress', icon: Save, default: true }
]

const accessibilitySettings = [
  { key: 'reducedMotion', label: 'Reduce Motion', icon: Accessibility, default: false },
  { key: 'highContrast', label: 'High Contrast Mode', icon: Monitor, default: false }
]

export default function EnhancedSettings() {
  const { isDarkMode, themeMode, accentColor, toggleDarkMode, setTheme, setAccentColor } = useTheme()
  const { toggleDropdown, closeDropdown, isOpen } = useDropdown()
  const isDropdownOpen = isOpen('settings')
  
  const [activeTab, setActiveTab] = useState('appearance')
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings')
    return saved ? JSON.parse(saved) : {
      performance: {
        animations: true,
        autoSave: true
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false
      },
      privacy: {
        analytics: false,
        crashReports: true,
        localProcessing: true
      },
      notifications: {
        processComplete: true,
        errors: true,
        updates: false
      }
    }
  })

  const [stats, setStats] = useState(getUserStats())
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    // Refresh stats periodically
    const interval = setInterval(() => {
      setStats(getUserStats())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleMenu = () => toggleDropdown('settings')
  const closeMenu = () => closeDropdown()

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    
    // Show notification for setting change
    setNotification({
      message: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${value ? 'enabled' : 'disabled'}`,
      type: 'success'
    })
  }
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const resetSettings = () => {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      localStorage.removeItem('appSettings')
      localStorage.removeItem('darkMode')
      localStorage.removeItem('accentColor')
      localStorage.removeItem('themeMode')
      showNotification('Settings reset successfully', 'success')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const exportSettings = () => {
    const exportData = {
      theme: { isDarkMode, themeMode, accentColor },
      settings,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pdf-merger-settings.json'
    a.click()
    URL.revokeObjectURL(url)
    showNotification('Settings exported successfully', 'success')
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'about', label: 'About', icon: FileText }
  ]

  return (
    <div className="enhanced-settings">
      <button className="settings-trigger" onClick={toggleMenu}>
        <Settings size={18} />
        <span>Settings</span>
      </button>
      
      {isDropdownOpen && createPortal(
        <div className="settings-overlay" onClick={closeMenu}>
          <div className="settings-panel" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <div className="settings-title">
                <Settings size={24} />
                <h2>Settings & Preferences</h2>
              </div>
              <button className="close-settings" onClick={closeMenu}>
                <X size={20} />
              </button>
            </div>

            <div className="settings-content">
              <div className="settings-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="settings-body">
                {activeTab === 'appearance' && (
                  <div className="settings-section">
                    <div className="section-header">
                      <h3>Theme & Appearance</h3>
                      <p>Customize the look and feel of your workspace</p>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        Debug: Mode={themeMode}, Dark={isDarkMode ? 'Yes' : 'No'}
                      </div>
                    </div>

                    <div className="setting-group">
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-label">Theme Mode</div>
                          <div className="setting-description">Choose your preferred theme</div>
                        </div>
                        <div className="theme-options">
                          <button 
                            className={`theme-option-btn ${themeMode === 'light' ? 'active' : ''}`} 
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Light button clicked')
                              setTheme('light')
                              showNotification('Switched to light theme', 'success')
                            }}
                          >
                            <Sun size={16} />
                            <span>Light</span>
                          </button>
                          <button 
                            className={`theme-option-btn ${themeMode === 'dark' ? 'active' : ''}`} 
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Dark button clicked')
                              setTheme('dark')
                              showNotification('Switched to dark theme', 'success')
                            }}
                          >
                            <Moon size={16} />
                            <span>Dark</span>
                          </button>
                          <button 
                            className={`theme-option-btn ${themeMode === 'system' ? 'active' : ''}`} 
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('System button clicked')
                              setTheme('system')
                              showNotification('Theme set to follow system preference', 'info')
                            }}
                          >
                            <Monitor size={16} />
                            <span>System</span>
                          </button>
                        </div>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-label">Accent Color</div>
                          <div className="setting-description">Choose your preferred accent color</div>
                        </div>
                        <div className="color-grid">
                          {accentColors.map((color) => (
                            <button
                              key={color.value}
                              className={`color-swatch ${accentColor === color.value ? 'selected' : ''}`}
                              style={{ background: color.gradient }}
                              onClick={(e) => {
                              e.stopPropagation()
                              console.log('Color button clicked:', color.value)
                              setAccentColor(color.value)
                              showNotification(`Accent color changed to ${color.name}`, 'success')
                            }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>


                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="settings-section">
                    <div className="section-header">
                      <h3>Performance & Processing</h3>
                      <p>Optimize app performance for your device</p>
                    </div>

                    <div className="setting-group">
                      {performanceSettings.map(setting => (
                        <div key={setting.key} className="setting-item">
                          <div className="setting-info">
                            <div className="setting-label">
                              <setting.icon size={16} />
                              {setting.label}
                            </div>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={settings.performance[setting.key]}
                              onChange={(e) => updateSetting('performance', setting.key, e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="stats-section">
                      <h4>Usage Statistics</h4>
                      <div className="stats-grid">
                        <div className="stat-card">
                          <FileText size={20} />
                          <div className="stat-value">{stats.filesProcessed}</div>
                          <div className="stat-label">Files Processed</div>
                        </div>
                        <div className="stat-card">
                          <HardDrive size={20} />
                          <div className="stat-value">{(stats.totalSize / 1024 / 1024).toFixed(1)}MB</div>
                          <div className="stat-label">Data Processed</div>
                        </div>
                        <div className="stat-card">
                          <Save size={20} />
                          <div className="stat-value">{stats.timesSaved}</div>
                          <div className="stat-label">Files Saved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}





                {activeTab === 'about' && (
                  <div className="settings-section">
                    <div className="section-header">
                      <h3>About PDF Merger AI</h3>
                      <p>Version 2.0.0 - Professional Edition</p>
                    </div>

                    <div className="about-content">
                      <div className="app-info">
                        <div className="app-icon">
                          <FileText size={48} />
                        </div>
                        <div className="app-details">
                          <h4>PDF Merger AI</h4>
                          <p>Advanced PDF processing with AI capabilities</p>
                          <div className="version-info">
                            <span>Version 2.0.0</span>
                            <span>•</span>
                            <span>Built with React</span>
                          </div>
                        </div>
                      </div>

                      <div className="action-buttons">
                        <button className="action-btn" onClick={exportSettings}>
                          <Download size={16} />
                          Export Settings
                        </button>
                        <button className="action-btn danger" onClick={resetSettings}>
                          <RotateCcw size={16} />
                          Reset All Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {notification && createPortal(
        <SettingsNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />,
        document.body
      )}
    </div>
  )
}