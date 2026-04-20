import moment from 'moment'
import 'moment/locale/zh-tw'
import { createContext, useEffect, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { useApp } from './AppContext'

const localeModules = import.meta.glob<{ default: Record<string, string> }>(
  '../../../ui/src/translations/locales/*.json',
  { eager: true },
)

function loadMessages(language: string): Record<string, string> {
  for (const [path, mod] of Object.entries(localeModules)) {
    if (path.endsWith(`/${language}.json`)) {
      return mod.default ?? mod as any
    }
  }
  return {}
}

const supportedLanguages = ['zh-tw', 'zh-cn', 'en-us', 'vi', 'acsi']

type LanguageProps = {
  currentLanguage: string
  locale: string
  setCurrentLanguage?: (language: string) => void
}
const defaultLanguage: LanguageProps = {
  currentLanguage: 'zh-tw',
  locale: 'zh-tw',
}

const LanguageContext = createContext<LanguageProps>(defaultLanguage)

export const LanguageProvider: React.FC = ({ children }) => {
  const { enabledModules, settings } = useApp()
  const [currentLanguage, setCurrentLanguage] = useState('zh-tw')
  const [locale, setLocale] = useState('zh-tw')
  moment.locale('zh-tw')

  useEffect(() => {
    const browserLanguage = settings['language'] || navigator.language.split('-')[0]
    const cachedLanguage = localStorage.getItem('kolable.app.language')
    setCurrentLanguage(
      enabledModules.locale
        ? typeof cachedLanguage === 'string' && supportedLanguages.includes(cachedLanguage)
          ? cachedLanguage
          : supportedLanguages.includes(browserLanguage)
          ? browserLanguage
          : 'zh-tw'
        : 'zh-tw',
    )
  }, [enabledModules, settings])

  useEffect(() => {
    switch (currentLanguage) {
      case 'zh-tw':
      case 'acsi':
        setLocale('zh-tw')
        moment.locale('zh-tw')
        break
      default:
        setLocale(currentLanguage)
        moment.locale(currentLanguage)
    }
  }, [currentLanguage])

  const messages = useMemo(() => {
    if (enabledModules.locale) {
      return loadMessages(currentLanguage)
    }
    return {}
  }, [enabledModules.locale, currentLanguage])

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        locale,
        setCurrentLanguage: (newLanguage: string) => {
          if (supportedLanguages.includes(newLanguage)) {
            localStorage.setItem('kolable.app.language', newLanguage)
            setCurrentLanguage(newLanguage)
          }
        },
      }}
    >
      <IntlProvider defaultLocale="zh-tw" locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
}

export default LanguageContext
