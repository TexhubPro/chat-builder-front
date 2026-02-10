import { Button } from '@heroui/react'
import { useI18n } from '../i18n/useI18n'

function UsFlagIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="us-flag-circle">
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      <g clipPath="url(#us-flag-circle)">
        <rect width="64" height="64" fill="#FFFFFF" />
        <rect y="0" width="64" height="4.923" fill="#E31C3D" />
        <rect y="9.846" width="64" height="4.923" fill="#E31C3D" />
        <rect y="19.692" width="64" height="4.923" fill="#E31C3D" />
        <rect y="29.538" width="64" height="4.923" fill="#E31C3D" />
        <rect y="39.384" width="64" height="4.923" fill="#E31C3D" />
        <rect y="49.23" width="64" height="4.923" fill="#E31C3D" />
        <rect y="59.076" width="64" height="4.923" fill="#E31C3D" />
        <rect width="28" height="34.46" fill="#1A47B8" />
        <circle cx="4" cy="4" r="1.2" fill="#FFFFFF" />
        <circle cx="10" cy="4" r="1.2" fill="#FFFFFF" />
        <circle cx="16" cy="4" r="1.2" fill="#FFFFFF" />
        <circle cx="22" cy="4" r="1.2" fill="#FFFFFF" />
        <circle cx="7" cy="8.2" r="1.2" fill="#FFFFFF" />
        <circle cx="13" cy="8.2" r="1.2" fill="#FFFFFF" />
        <circle cx="19" cy="8.2" r="1.2" fill="#FFFFFF" />
        <circle cx="25" cy="8.2" r="1.2" fill="#FFFFFF" />
        <circle cx="4" cy="12.4" r="1.2" fill="#FFFFFF" />
        <circle cx="10" cy="12.4" r="1.2" fill="#FFFFFF" />
        <circle cx="16" cy="12.4" r="1.2" fill="#FFFFFF" />
        <circle cx="22" cy="12.4" r="1.2" fill="#FFFFFF" />
        <circle cx="7" cy="16.6" r="1.2" fill="#FFFFFF" />
        <circle cx="13" cy="16.6" r="1.2" fill="#FFFFFF" />
        <circle cx="19" cy="16.6" r="1.2" fill="#FFFFFF" />
        <circle cx="25" cy="16.6" r="1.2" fill="#FFFFFF" />
        <circle cx="4" cy="20.8" r="1.2" fill="#FFFFFF" />
        <circle cx="10" cy="20.8" r="1.2" fill="#FFFFFF" />
        <circle cx="16" cy="20.8" r="1.2" fill="#FFFFFF" />
        <circle cx="22" cy="20.8" r="1.2" fill="#FFFFFF" />
        <circle cx="7" cy="25" r="1.2" fill="#FFFFFF" />
        <circle cx="13" cy="25" r="1.2" fill="#FFFFFF" />
        <circle cx="19" cy="25" r="1.2" fill="#FFFFFF" />
        <circle cx="25" cy="25" r="1.2" fill="#FFFFFF" />
        <circle cx="4" cy="29.2" r="1.2" fill="#FFFFFF" />
        <circle cx="10" cy="29.2" r="1.2" fill="#FFFFFF" />
        <circle cx="16" cy="29.2" r="1.2" fill="#FFFFFF" />
        <circle cx="22" cy="29.2" r="1.2" fill="#FFFFFF" />
      </g>

      <circle cx="32" cy="32" r="30" fill="none" stroke="#D4D4D8" strokeWidth="1.5" />
    </svg>
  )
}

function RuFlagIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="ru-flag-circle">
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      <g clipPath="url(#ru-flag-circle)">
        <rect width="64" height="64" fill="#FFFFFF" />
        <rect y="21.33" width="64" height="21.33" fill="#0039A6" />
        <rect y="42.66" width="64" height="21.34" fill="#D52B1E" />
      </g>

      <circle cx="32" cy="32" r="30" fill="none" stroke="#D4D4D8" strokeWidth="1.5" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useI18n()
  const nextLocale = locale === 'ru' ? 'en' : 'ru'

  return (
    <Button
      isIconOnly
      radius="full"
      variant="bordered"
      aria-label={`Switch language to ${messages.common.language[nextLocale].toLowerCase()}`}
      className="h-9 w-9 min-w-9 border-2 border-primary bg-white p-0.5"
      onPress={() => setLocale(nextLocale)}
    >
      {nextLocale === 'en' ? <UsFlagIcon /> : <RuFlagIcon />}
    </Button>
  )
}
