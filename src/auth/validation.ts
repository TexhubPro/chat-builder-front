const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_E164_REGEX = /^\+[1-9]\d{7,14}$/
const PASSWORD_LOWERCASE_REGEX = /[a-z]/
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/
const PASSWORD_NUMBER_REGEX = /\d/
const PASSWORD_SYMBOL_REGEX = /[^A-Za-z0-9]/

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizePhone(value: string): string {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (trimmed.startsWith('00')) {
    return `+${digits.slice(2)}`
  }

  if (trimmed.startsWith('+')) {
    return `+${digits}`
  }

  return digits
}

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function sanitizeLoginInput(value: string): string {
  return value.replace(/[^A-Za-z0-9@+._-]/g, '').slice(0, 255)
}

export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\s()-]/g, '').slice(0, 32)
}

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^\p{L}\p{N}\s.'-]/gu, '').slice(0, 255)
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(normalizeEmail(value))
}

export function isValidPhone(value: string): boolean {
  return PHONE_E164_REGEX.test(normalizePhone(value))
}

export function isEmailOrPhone(value: string): boolean {
  const normalized = value.trim()

  if (!normalized) {
    return false
  }

  return isValidEmail(normalized) || isValidPhone(normalized)
}

export function normalizeLoginIdentifier(value: string): string {
  const trimmed = value.trim()

  if (isValidEmail(trimmed)) {
    return normalizeEmail(trimmed)
  }

  if (isValidPhone(trimmed)) {
    return normalizePhone(trimmed)
  }

  return trimmed
}

export function hasStrongPassword(value: string): boolean {
  return (
    value.length >= 10 &&
    PASSWORD_LOWERCASE_REGEX.test(value) &&
    PASSWORD_UPPERCASE_REGEX.test(value) &&
    PASSWORD_NUMBER_REGEX.test(value) &&
    PASSWORD_SYMBOL_REGEX.test(value)
  )
}

export function isValidVerificationCode(value: string): boolean {
  return /^\d{6}$/.test(value.trim())
}

export function getAuthDeviceName(): string {
  return import.meta.env.VITE_DEVICE_NAME ?? 'frontend-web'
}
