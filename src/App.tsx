import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ModerationRoute, PageAccessRoute, ProtectedRoute } from './auth/RouteGuards'

const EmailVerificationPage = lazy(() => import('./pages/EmailVerificationPage'))
const AssistantTrainingPage = lazy(() => import('./pages/AssistantTrainingPage'))
const BillingPage = lazy(() => import('./pages/BillingPage'))
const BusinessSettingsPage = lazy(() => import('./pages/BusinessSettingsPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const ClientBasePage = lazy(() => import('./pages/ClientBasePage'))
const ClientRequestsPage = lazy(() => import('./pages/ClientRequestsPage'))
const ClientQuestionsPage = lazy(() => import('./pages/ClientQuestionsPage'))
const ClientChatsPage = lazy(() => import('./pages/ClientChatsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ModerationPage = lazy(() => import('./pages/ModerationPage'))
const EmployeesPage = lazy(() => import('./pages/EmployeesPage'))
const ProductsServicesPage = lazy(() => import('./pages/ProductsServicesPage'))
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
          <Route element={<PageAccessRoute pageKey="dashboard" />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="client-requests" />}>
            <Route path="/client-requests" element={<ClientRequestsPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="client-questions" />}>
            <Route path="/client-questions" element={<ClientQuestionsPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="client-base" />}>
            <Route path="/client-base" element={<ClientBasePage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="calendar" />}>
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="client-chats" />}>
            <Route path="/client-chats" element={<ClientChatsPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="assistant-training" />}>
            <Route path="/assistant/training" element={<AssistantTrainingPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="integrations" />}>
            <Route path="/integrations" element={<IntegrationsPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="products-services" />}>
            <Route path="/products-services" element={<ProductsServicesPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="billing" />}>
            <Route path="/billing" element={<BillingPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="business-settings" />}>
            <Route path="/business-settings" element={<BusinessSettingsPage />} />
          </Route>
          <Route element={<PageAccessRoute pageKey="employees" />}>
            <Route path="/employees" element={<EmployeesPage />} />
          </Route>
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
