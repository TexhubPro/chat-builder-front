import { createContext } from 'react'
import type { Locale, Messages } from './messages'

export type I18nContextValue = {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)
