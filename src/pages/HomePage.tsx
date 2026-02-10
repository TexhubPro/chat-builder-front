import { Button, Card, CardBody } from '@heroui/react'
import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n/useI18n'

export default function HomePage() {
  const { user, logout } = useAuth()
  const { messages } = useI18n()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-emerald-100 px-4 py-6 sm:px-6 sm:py-10">
      <Card className="mx-auto w-full max-w-4xl border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        <CardBody className="flex min-h-[70vh] items-center justify-center p-6 sm:p-10">
          <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              {messages.home.badge}
            </p>
            <h1 className="text-4xl font-black text-slate-900">{messages.home.title}</h1>
            <p className="text-sm text-slate-600">
              {messages.home.signedInAs}: <strong>{user?.name}</strong>
            </p>
            <Button
              color="danger"
              variant="flat"
              onPress={handleLogout}
              isLoading={isLoggingOut}
            >
              {messages.home.logout}
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  )
}
