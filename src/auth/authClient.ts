export type AuthUser = {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: string
  status: boolean
}

export type AuthSuccessResponse = {
  message?: string
  requires_moderation?: boolean
  token_type?: string
  token_expires_at?: string | null
  token: string
  user: AuthUser
}

type LoginResponse = AuthSuccessResponse

type MeResponse = {
  user: AuthUser
}

export type SocialProvider = 'google' | 'github'

type SocialRedirectResponse = {
  provider: SocialProvider
  authorization_url: string
  state_ttl_seconds: number
}

export type RegisterResponse = {
  message: string
  requires_email_verification: boolean
  email: string
  expires_in_seconds: number
  resend_available_in: number
}

export type VerifyEmailCodeResponse = AuthSuccessResponse & {
  message: string
}

export type ResendVerificationCodeResponse = {
  message: string
  expires_in_seconds?: number
  retry_after?: number
}

export type ModerationStatusResponse = {
  message: string
  requires_moderation: boolean
  user: AuthUser
}

export class ApiError extends Error {
  public readonly status: number
  public readonly data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const data = await parseJson(response)

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Request failed.'

    throw new ApiError(message, response.status, data)
  }

  return data as T
}

export async function loginRequest(payload: {
  login: string
  password: string
  device_name?: string
}): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerRequest(payload: {
  name: string
  email: string
  phone: string
  password: string
}): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function verifyEmailCodeRequest(payload: {
  email: string
  code: string
  device_name?: string
}): Promise<VerifyEmailCodeResponse> {
  return request<VerifyEmailCodeResponse>('/auth/verify-email-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function resendVerificationCodeRequest(payload: {
  email: string
}): Promise<ResendVerificationCodeResponse> {
  return request<ResendVerificationCodeResponse>('/auth/resend-verification-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function meRequest(token: string): Promise<AuthUser> {
  const data = await request<MeResponse>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data.user
}

export async function logoutRequest(token: string): Promise<void> {
  await request('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function moderationStatusRequest(
  token: string,
): Promise<ModerationStatusResponse> {
  return request<ModerationStatusResponse>('/auth/moderation-status', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function socialRedirectRequest(
  provider: SocialProvider,
): Promise<SocialRedirectResponse> {
  return request<SocialRedirectResponse>(`/auth/oauth/${provider}/redirect`, {
    method: 'GET',
  })
}
