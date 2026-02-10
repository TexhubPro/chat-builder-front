import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ModerationRoute, ProtectedRoute } from './auth/RouteGuards'
import EmailVerificationPage from './pages/EmailVerificationPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ModerationPage from './pages/ModerationPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<ModerationRoute />}>
        <Route path="/moderation" element={<ModerationPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
