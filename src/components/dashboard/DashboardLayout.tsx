import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAuthToken } from "../../auth/authStorage";
import { companySettingsRequest } from "../../company/companySettingsClient";
import type { AuthUser } from "../../auth/authClient";
import { BRANDING } from "../../config/branding";
import { useI18n } from "../../i18n/useI18n";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar from "./Sidebar";
import SidebarDrawer from "./SidebarDrawer";
import { getSidebarSections } from "./sidebar-items";

type DashboardLayoutProps = {
  title: string;
  children: ReactNode;
  user: AuthUser | null;
  onLogout: () => void | Promise<void>;
  isLoggingOut: boolean;
  defaultSelectedKey?: string;
};

export default function DashboardLayout({
  title,
  children,
  user,
  onLogout,
  isLoggingOut,
  defaultSelectedKey = "dashboard",
}: DashboardLayoutProps) {
  const { locale } = useI18n();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedKey, setSelectedKey] = useState(defaultSelectedKey);
  const [showAppointmentItems, setShowAppointmentItems] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = getAuthToken();

    if (!token) {
      return;
    }

    void companySettingsRequest(token)
      .then((response) => {
        if (cancelled) {
          return;
        }

        setShowAppointmentItems(
          response.company.settings.account_type === "with_appointments",
        );
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setShowAppointmentItems(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sections = useMemo(
    () =>
      getSidebarSections(locale, {
        showAppointmentItems,
      }),
    [locale, showAppointmentItems],
  );

  const desktopSidebarContent = (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-16 items-center px-4">
        <img
          src={BRANDING.logoUrl}
          alt={BRANDING.logoAlt}
          className="h-9 w-9 rounded-md object-contain"
        />
      </div>
      <Sidebar
        sections={sections}
        selectedKey={selectedKey}
        onSelect={(key) => {
          setSelectedKey(key);
          onClose();
        }}
      />
    </div>
  );

  const mobileSidebarContent = (
    <div className="flex h-full w-full flex-col bg-white">
      <Sidebar
        sections={sections}
        selectedKey={selectedKey}
        onSelect={(key) => {
          setSelectedKey(key);
          onClose();
        }}
      />
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#f5f6f8]">
      <div className="flex h-full w-full">
        <aside className="hidden h-full w-[278px] shrink-0 border-r border-default-200 lg:flex">
          {desktopSidebarContent}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardNavbar
            user={user}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            onOpenSidebar={onOpen}
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <header className="mb-4 rounded-medium border border-default-200 bg-white px-4 py-3">
              <h1 className="text-base font-semibold text-foreground sm:text-lg">{title}</h1>
            </header>
            {children}
          </div>
        </div>
      </div>

      <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
        {mobileSidebarContent}
      </SidebarDrawer>
    </div>
  );
}
