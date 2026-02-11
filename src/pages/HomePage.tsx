import { Card, CardBody } from "@heroui/react";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

export default function HomePage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  usePageSeo({
    title: `${messages.home.title} | ${messages.app.name}`,
    description:
      locale === "ru"
        ? "Главная страница дашборда и рабочей области."
        : "Main dashboard page and workspace.",
    locale,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const emptyText =
    locale === "ru"
      ? "Рабочая область дашборда готова. Подключим разделы и виджеты на следующем шаге."
      : "Dashboard workspace is ready. Sections and widgets can be connected next.";

  return (
    <DashboardLayout
      title={messages.home.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="dashboard"
    >
      <Card shadow="none" className="border border-default-200 bg-white">
        <CardBody className="min-h-[280px] p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-default-500">
              {messages.home.badge}
            </p>
            <p className="text-sm text-default-700">
              {messages.home.signedInAs}: <strong>{user?.name}</strong>
            </p>
            <p className="text-sm text-default-500">{emptyText}</p>
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
