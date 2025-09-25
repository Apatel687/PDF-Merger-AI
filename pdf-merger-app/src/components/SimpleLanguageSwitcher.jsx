import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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

export default function SimpleLanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState(null)
  const buttonRef = useRef(null)

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
    console.log('Language changed to:', langCode)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          if (!isOpen) {
            const rect = buttonRef.current.getBoundingClientRect()
            setButtonRect(rect)
          }
          setIsOpen(!isOpen)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <Globe size={16} />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
      </button>

      {isOpen && buttonRect && createPortal(
        <div style={{
          position: 'fixed',
          top: buttonRect.bottom + 8,
          right: window.innerWidth - buttonRect.right,
          background: 'var(--card-background)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 10000,
          minWidth: '150px'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={(e) => {
                e.stopPropagation()
                handleLanguageChange(lang.code)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: language === lang.code ? 'var(--accent-color)' : 'transparent',
                color: language === lang.code ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}