import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearAuthToken, getAuthToken, setAuthToken } from './authStorage'
import {
  ApiError,
  loginRequest,
  logoutRequest,
  meRequest,
  moderationStatusRequest,
  type AuthUser,
} from './authClient'

type AuthStatus = 'loading' | 'authenticated' | 'moderation' | 'unauthenticated'

type LoginPayload = {
  login: string
  password: string
  deviceName?: string
}

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  setSession: (token: string, user: AuthUser) => void
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)

  const setSession = useCallback((token: string, authUser: AuthUser) => {
    setAuthToken(token)
    setUser(authUser)
    setStatus(authUser.status ? 'authenticated' : 'moderation')
  }, [])

  const refreshSession = useCallback(async () => {
    const token = getAuthToken()

    if (!token) {
      setUser(null)
      setStatus('unauthenticated')
      return
    }

    try {
      const currentUser = await meRequest(token)
      setUser(currentUser)
      setStatus(currentUser.status ? 'authenticated' : 'moderation')
      return
    } catch (error) {
      if (error instanceof ApiError && isObject(error.data)) {
        const requiresModeration = error.data.requires_moderation === true

        if (requiresModeration) {
          try {
            const moderationData = await moderationStatusRequest(token)
            setUser(moderationData.user)
            setStatus(moderationData.user.status ? 'authenticated' : 'moderation')
            return
          } catch {
            // fallback to full logout below
          }
        }
      }

      clearAuthToken()
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const login = useCallback(
    async ({ login, password, deviceName }: LoginPayload) => {
      const response = await loginRequest({
        login,
        password,
        device_name: deviceName ?? 'frontend-web',
      })

      setSession(response.token, response.user)
    },
    [setSession],
  )

  const logout = useCallback(async () => {
    const token = getAuthToken()

    if (token) {
      try {
        await logoutRequest(token)
      } catch {
        // Intentionally ignored: token may already be expired or revoked.
      }
    }

    clearAuthToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      login,
      setSession,
      logout,
      refreshSession,
    }),
    [status, user, login, setSession, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
