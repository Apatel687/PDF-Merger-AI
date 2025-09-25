import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

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
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="language-switcher" style={{ position: 'relative' }}>
      <button
        className="language-btn futuristic-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          fontSize: '14px'
        }}
      >
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
      </button>

      {isOpen && (
        <div
          className="language-dropdown futuristic-card"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '4px',
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            padding: '8px'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
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
        </div>
      )}
    </div>
  )
}