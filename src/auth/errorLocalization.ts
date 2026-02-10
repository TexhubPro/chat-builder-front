import type { Messages } from '../i18n/messages'

type AuthResolver = (auth: Messages['auth']) => string

const EXACT_AUTH_MESSAGE_MAP: Record<string, AuthResolver> = {
  'too many registration attempts please try again later': (auth) =>
    auth.tooManyRegistrationAttempts,
  'too many verification attempts please try again later': (auth) =>
    auth.tooManyVerificationAttempts,
  'too many resend requests try again later': (auth) => auth.tooManyResendRequests,
  'too many login attempts please try again later': (auth) => auth.tooManyLoginAttempts,
  'too many password reset requests please try again later': (auth) =>
    auth.tooManyPasswordResetRequests,
  'verification code has expired request a new code': (auth) => auth.verificationCodeExpired,
  'verification attempts exceeded request a new code': (auth) =>
    auth.verificationAttemptsExceeded,
  'verification code is invalid or expired': (auth) => auth.verificationCodeInvalidOrExpired,
  'please wait before requesting a new code': (auth) => auth.waitBeforeNewCode,
  'invalid credentials': (auth) => auth.invalidCredentials,
  'user is inactive': (auth) => auth.userInactive,
  'email is not verified': (auth) => auth.emailNotVerified,
  'email is already verified': (auth) => auth.emailAlreadyVerified,
  'email is already verified please login': (auth) => auth.emailAlreadyVerifiedPleaseLogin,
  'verification code sent': (auth) => auth.verificationCodeSent,
  'if the account exists a verification code has been sent': (auth) =>
    auth.accountMayExistVerificationCodeSent,
  'registration created verification code sent to your email': (auth) =>
    auth.registrationCreatedVerificationCodeSent,
  'email verified successfully': (auth) => auth.emailVerifiedSuccessfully,
  'the email has already been taken': (auth) => auth.emailAlreadyTaken,
  'the phone has already been taken': (auth) => auth.phoneAlreadyTaken,
  'phone number format is invalid use international format like +12345678900': (auth) =>
    auth.invalidPhone,
  'invalid verification code': (auth) => auth.invalidVerificationCode,
  'the email field must be a valid email address': (auth) => auth.invalidEmail,
  'the phone field format is invalid': (auth) => auth.invalidPhone,
  'the code field must be 6 digits': (auth) => auth.invalidVerificationCode,
  'the password field confirmation does not match': (auth) => auth.passwordMismatch,
  'account is under moderation': (auth) => auth.accountUnderModeration,
  'if the account exists a temporary password has been sent': (auth) =>
    auth.forgotPasswordSuccess,
}

const PARTIAL_AUTH_MESSAGE_RULES: Array<{
  pattern: RegExp
  resolve: AuthResolver
}> = [
  {
    pattern: /too many.*login/,
    resolve: (auth) => auth.tooManyLoginAttempts,
  },
  {
    pattern: /too many.*registration/,
    resolve: (auth) => auth.tooManyRegistrationAttempts,
  },
  {
    pattern: /too many.*resend/,
    resolve: (auth) => auth.tooManyResendRequests,
  },
  {
    pattern: /too many.*verification/,
    resolve: (auth) => auth.tooManyVerificationAttempts,
  },
  {
    pattern: /(too many requests|too many attempts)/,
    resolve: (auth) => auth.tooManyVerificationAttempts,
  },
  {
    pattern: /(verification code).*(invalid)/,
    resolve: (auth) => auth.invalidVerificationCode,
  },
  {
    pattern: /(verification code).*(expired)/,
    resolve: (auth) => auth.verificationCodeExpired,
  },
  {
    pattern: /(verification attempts).*(exceeded)/,
    resolve: (auth) => auth.verificationAttemptsExceeded,
  },
  {
    pattern: /password.*(at least|uppercase|lowercase|symbol|number)/,
    resolve: (auth) => auth.weakPassword,
  },
  {
    pattern: /password.*(is required|required)/,
    resolve: (auth) => auth.requiredCredentials,
  },
  {
    pattern: /login.*(is required|required)/,
    resolve: (auth) => auth.requiredCredentials,
  },
  {
    pattern: /code.*(is required|required)/,
    resolve: (auth) => auth.verifyCodeRequired,
  },
  {
    pattern: /valid email address/,
    resolve: (auth) => auth.invalidEmail,
  },
  {
    pattern: /(phone|telephone).*(invalid|format)/,
    resolve: (auth) => auth.invalidPhone,
  },
  {
    pattern: /email.*already been taken/,
    resolve: (auth) => auth.emailAlreadyTaken,
  },
  {
    pattern: /phone.*already been taken/,
    resolve: (auth) => auth.phoneAlreadyTaken,
  },
  {
    pattern: /moderation/,
    resolve: (auth) => auth.accountUnderModeration,
  },
]

function normalizeAuthMessage(rawMessage: string): string {
  return rawMessage.trim().toLowerCase().replace(/[.,!?]+/g, '').replace(/\s+/g, ' ')
}

export function localizeAuthMessage(rawMessage: string, messages: Messages): string {
  if (!rawMessage.trim()) {
    return rawMessage
  }

  const normalized = normalizeAuthMessage(rawMessage)
  const exactResolver = EXACT_AUTH_MESSAGE_MAP[normalized]

  if (exactResolver) {
    return exactResolver(messages.auth)
  }

  for (const rule of PARTIAL_AUTH_MESSAGE_RULES) {
    if (rule.pattern.test(normalized)) {
      return rule.resolve(messages.auth)
    }
  }

  return rawMessage
}

export function localizeAuthFieldErrors<T extends string>(
  fieldErrors: Partial<Record<T, string>>,
  messages: Messages,
): Partial<Record<T, string>> {
  const localized: Partial<Record<T, string>> = {}

  for (const [field, rawMessage] of Object.entries(fieldErrors) as Array<[T, string]>) {
    localized[field] = localizeAuthMessage(rawMessage, messages)
  }

  return localized
}
