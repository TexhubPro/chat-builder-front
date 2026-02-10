import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { BRANDING } from "../../config/branding";
import type { AuthUser } from "../../auth/authClient";
import { useI18n } from "../../i18n/useI18n";

type DashboardNavbarProps = {
  user: AuthUser | null;
  onLogout: () => void | Promise<void>;
  isLoggingOut: boolean;
  onOpenSidebar: () => void;
};

function getUserInitials(name: string | null | undefined, fallback: string): string {
  const normalized = (name ?? "").trim().replace(/\s+/g, " ");

  if (!normalized) {
    return fallback;
  }

  const parts = normalized.split(" ").filter(Boolean);

  if (parts.length === 1) {
    const chars = [...parts[0]];
    return (chars[0] ?? fallback).toUpperCase();
  }

  const first = [...parts[0]][0] ?? "";
  const second = [...parts[1]][0] ?? "";
  const combined = `${first}${second}`.toUpperCase();

  return combined || fallback;
}

export default function DashboardNavbar({
  user,
  onLogout,
  isLoggingOut,
  onOpenSidebar,
}: DashboardNavbarProps) {
  const { locale, messages } = useI18n();
  const navigate = useNavigate();
  const userInitials = getUserInitials(user?.name, locale === "ru" ? "П" : "U");

  return (
    <Navbar
      maxWidth="full"
      className="border-b border-default-200 bg-white"
      classNames={{
        wrapper: "w-full max-w-none justify-between px-3 sm:px-4",
      }}
      height="64px"
    >
      <NavbarBrand className="lg:hidden">
        <img
          src={BRANDING.logoUrl}
          alt={BRANDING.logoAlt}
          className="h-9 w-9 rounded-md object-contain"
        />
      </NavbarBrand>

      <NavbarContent justify="end">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                radius="full"
                variant="bordered"
                className="h-9 w-9 min-w-9 border-2 border-primary/80 bg-white p-0"
                aria-label="User menu"
              >
                {user?.avatar ? (
                  <Avatar src={user.avatar} className="h-8 w-8" />
                ) : (
                  <span className="text-[11px] font-semibold uppercase text-foreground">
                    {userInitials}
                  </span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User menu"
              disabledKeys={isLoggingOut ? ["logout"] : []}
              itemClasses={{
                base: "text-default-700",
              }}
              onAction={(key) => {
                if (key === "profile") {
                  navigate("/profile");
                  return;
                }

                if (key === "logout") {
                  void onLogout();
                }
              }}
            >
              <DropdownItem key="user" isReadOnly className="h-14 cursor-default opacity-100">
                <div className="flex flex-col">
                  <span className="text-small font-medium">
                    {user?.name ?? (locale === "ru" ? "Пользователь" : "User")}
                  </span>
                  <span className="text-tiny text-default-500">{user?.email ?? ""}</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="profile"
                startContent={<Icon icon="solar:user-linear" width={18} />}
              >
                {messages.home.profile}
              </DropdownItem>
              <DropdownItem
                key="notifications"
                showDivider
                startContent={<Icon icon="solar:bell-linear" width={18} />}
              >
                {messages.home.notifications}
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                startContent={<Icon icon="solar:logout-2-linear" width={18} />}
              >
                {messages.home.logout}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button
            isIconOnly
            className="lg:hidden"
            variant="light"
            size="sm"
            onPress={onOpenSidebar}
            aria-label={locale === "ru" ? "Открыть меню" : "Open menu"}
          >
            <Icon icon="solar:hamburger-menu-outline" width={22} />
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
