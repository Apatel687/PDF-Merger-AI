import { createPortal } from 'react-dom'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useDropdown } from '../contexts/DropdownContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
]

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const { toggleDropdown, isOpen } = useDropdown()
  const isDropdownOpen = isOpen('language')

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode, e) => {
    e.stopPropagation()
    console.log('Language button clicked:', langCode)
    changeLanguage(langCode)
    toggleDropdown('language')
  }

  return (
    <div className="language-switcher" style={{ position: 'relative' }}>
      <button
        className="language-btn futuristic-btn"
        onClick={(e) => {
          e.stopPropagation()
          console.log('Language switcher clicked')
          toggleDropdown('language')
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 8px 28px rgba(59, 130, 246, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--ai-gradient-start), var(--ai-gradient-end))',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          minWidth: '100px',
          justifyContent: 'center',
          fontWeight: '500'
        }}
      >
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
      </button>

      {isDropdownOpen && createPortal(
        <div
          className="language-dropdown futuristic-card"
          style={{
            position: 'fixed',
            top: '70px',
            right: '140px',
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10000,
            padding: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            background: 'var(--card-background)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={(e) => handleLanguageChange(lang.code, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: language === lang.code ? 'var(--accent-color)' : 'transparent',
                color: 'inherit',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}