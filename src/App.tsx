import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ModerationRoute, ProtectedRoute } from './auth/RouteGuards'

const EmailVerificationPage = lazy(() => import('./pages/EmailVerificationPage'))
const AssistantTrainingPage = lazy(() => import('./pages/AssistantTrainingPage'))
const BillingPage = lazy(() => import('./pages/BillingPage'))
const ClientChatsPage = lazy(() => import('./pages/ClientChatsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ModerationPage = lazy(() => import('./pages/ModerationPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/client-chats" element={<ClientChatsPage />} />
          <Route path="/assistant/training" element={<AssistantTrainingPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ModerationRoute />}>
          <Route path="/moderation" element={<ModerationPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
