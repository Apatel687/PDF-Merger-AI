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
  const [language, setLanguage] = useState('en') // Default to English

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('pdf-merger-language')
    if (saved && saved !== language) {
      setLanguage(saved)
    }
  }, [])

  // Save language changes
  useEffect(() => {
    localStorage.setItem('pdf-merger-language', language)
    document.documentElement.lang = language
    console.log('Language applied:', language)
  }, [language])

  const changeLanguage = (newLanguage) => {
    console.log('Changing language to:', newLanguage)
    if (newLanguage !== language) {
      setLanguage(newLanguage)
      localStorage.setItem('pdf-merger-language', newLanguage)
      document.documentElement.lang = newLanguage
    }
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}