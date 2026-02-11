import { Alert, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

export default function ModerationPage() {
  const navigate = useNavigate();
  const { status, user, refreshSession, logout } = useAuth();
  const { locale, messages } = useI18n();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  usePageSeo({
    title: `${messages.auth.moderationTitle} | ${messages.app.name}`,
    description: messages.auth.moderationSubtitle,
    locale,
  });

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/", { replace: true });
      return;
    }

    if (status === "unauthenticated") {
      navigate("/login", { replace: true });
    }
  }, [navigate, status]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await refreshSession();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-72">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={BRANDING.logoUrl}
              alt={BRANDING.logoAlt}
              className="h-10 w-10 rounded-md object-contain"
            />
          </div>
          <LanguageSwitcher />
        </header>

        <div className="mb-5">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            {messages.auth.moderationTitle}
          </h1>
          <p className="mt-1 text-base text-default-600">
            {messages.auth.moderationSubtitle}
          </p>
        </div>

        <Alert
          color="warning"
          title={messages.auth.moderationAlertTitle}
          description={
            user?.email
              ? `${messages.auth.moderationAlertDescription} ${user.email}`
              : messages.auth.moderationAlertDescription
          }
          variant="flat"
          className="mb-4"
        />

        <div className="flex flex-col gap-3">
          <Button
            color="primary"
            isLoading={isRefreshing}
            onPress={handleRefresh}
            fullWidth
          >
            {messages.auth.moderationRefresh}
          </Button>

          <Button
            variant="bordered"
            color="danger"
            isLoading={isLoggingOut}
            onPress={handleLogout}
            fullWidth
          >
            {messages.auth.moderationLogout}
          </Button>
        </div>
      </div>
    </main>
  );
}
