import { Spinner } from '@heroui/react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { useI18n } from '../i18n/useI18n'
import { firstAccessiblePath, hasPageAccess, type PageAccessKey } from './pageAccess'

function AuthScreenLoader() {
  const { messages } = useI18n()

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100">
      <Spinner label={messages.common.loadingSession} size="lg" />
    </div>
  )
}

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthScreenLoader />
  }

  if (status === 'moderation') {
    return <Navigate to="/moderation" replace />
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <AuthScreenLoader />
  }

  if (status === 'moderation') {
    return <Navigate to="/moderation" replace />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function ModerationRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <AuthScreenLoader />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

type PageAccessRouteProps = {
  pageKey: PageAccessKey
}

export function PageAccessRoute({ pageKey }: PageAccessRouteProps) {
  const { status, user } = useAuth()

  if (status === 'loading') {
    return <AuthScreenLoader />
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  if (hasPageAccess(user, pageKey)) {
    return <Outlet />
  }

  return <Navigate to={firstAccessiblePath(user)} replace />
}
