import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('pdf-merger-language')
    if (saved) return saved
    
    // Auto-detect browser language
    const browserLang = navigator.language.split('-')[0]
    const supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi']
    return supportedLangs.includes(browserLang) ? browserLang : 'en'
  })

  useEffect(() => {
    localStorage.setItem('pdf-merger-language', language)
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}