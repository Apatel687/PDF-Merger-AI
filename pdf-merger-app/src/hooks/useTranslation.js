import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation, getKeywords } from '../locales/translations'

export const useTranslation = () => {
  const { language } = useLanguage()

  const t = (key) => {
    return getTranslation(language, key)
  }

  const getLocalizedKeywords = () => {
    return getKeywords(language)
  }

  return { t, getLocalizedKeywords, language }
}