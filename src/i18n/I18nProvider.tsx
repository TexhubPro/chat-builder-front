import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  MESSAGES,
  SUPPORTED_LOCALES,
  type Locale,
} from './messages'
import { I18nContext, type I18nContextValue } from './I18nContext'

const LOCALE_STORAGE_KEY = 'chat_flow_locale'
const DEFAULT_LOCALE: Locale = 'ru'

function isLocale(value: string | null): value is Locale {
  if (!value) {
    return false
  }

  return SUPPORTED_LOCALES.includes(value as Locale)
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)

  if (isLocale(storedLocale)) {
    return storedLocale
  }

  return DEFAULT_LOCALE
}

type I18nProviderProps = {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: MESSAGES[locale],
      setLocale,
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
