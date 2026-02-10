import type { Locale } from "../../i18n/messages";

export type SidebarItem = {
  key: string;
  title: string;
  icon: string;
  href?: string;
};

export type SidebarSection = {
  key: string;
  title: string;
  items: SidebarItem[];
};

const RU_SECTIONS: SidebarSection[] = [
  {
    key: "main",
    title: "Основное",
    items: [
      {
        key: "dashboard",
        href: "/",
        icon: "solar:home-2-linear",
        title: "Панель управления",
      },
    ],
  },
  {
    key: "clients",
    title: "Клиенты",
    items: [
      {
        key: "client-requests",
        href: "/client-requests",
        icon: "solar:inbox-archive-linear",
        title: "Заявки клиентов",
      },
      {
        key: "client-questions",
        href: "/client-questions",
        icon: "solar:question-circle-linear",
        title: "Вопросы клиентов",
      },
      {
        key: "client-chats",
        href: "/client-chats",
        icon: "solar:chat-round-line-outline",
        title: "Чаты клиентов",
      },
      {
        key: "client-base",
        href: "/client-base",
        icon: "solar:users-group-two-rounded-outline",
        title: "База клиентов",
      },
    ],
  },
  {
    key: "tools",
    title: "Инструменты",
    items: [
      {
        key: "calendar",
        href: "/calendar",
        icon: "solar:calendar-linear",
        title: "Календарь",
      },
      {
        key: "integrations",
        href: "/integrations",
        icon: "solar:link-minimalistic-2-linear",
        title: "Интеграции",
      },
      {
        key: "assistant-training",
        href: "/assistant/training",
        icon: "solar:book-2-linear",
        title: "Обучение ассистента",
      },
      {
        key: "builder",
        href: "/builder",
        icon: "solar:widget-2-outline",
        title: "Конструктор",
      },
    ],
  },
  {
    key: "business",
    title: "Бизнес",
    items: [
      {
        key: "billing",
        href: "/billing",
        icon: "solar:card-outline",
        title: "Подписка и платежи",
      },
      {
        key: "template-store",
        href: "/template-store",
        icon: "solar:bag-4-linear",
        title: "Маркетплейс шаблонов",
      },
      {
        key: "integrations-marketplace",
        href: "/integrations-marketplace",
        icon: "solar:star-rainbow-linear",
        title: "Маркетплейс интеграций",
      },
      {
        key: "business-settings",
        href: "/business-settings",
        icon: "solar:settings-linear",
        title: "Настройка бизнеса",
      },
    ],
  },
  {
    key: "support",
    title: "Поддержка",
    items: [
      {
        key: "faq",
        href: "/faq",
        icon: "solar:question-circle-linear",
        title: "Часто задаваемые вопросы",
      },
      {
        key: "support",
        href: "/support",
        icon: "solar:headphones-round-linear",
        title: "Помощь и поддержка",
      },
    ],
  },
];

const EN_SECTIONS: SidebarSection[] = [
  {
    key: "main",
    title: "Main",
    items: [
      {
        key: "dashboard",
        href: "/",
        icon: "solar:home-2-linear",
        title: "Dashboard",
      },
    ],
  },
  {
    key: "clients",
    title: "Clients",
    items: [
      {
        key: "client-requests",
        href: "/client-requests",
        icon: "solar:inbox-archive-linear",
        title: "Client requests",
      },
      {
        key: "client-questions",
        href: "/client-questions",
        icon: "solar:question-circle-linear",
        title: "Client questions",
      },
      {
        key: "client-chats",
        href: "/client-chats",
        icon: "solar:chat-round-line-outline",
        title: "Client chats",
      },
      {
        key: "client-base",
        href: "/client-base",
        icon: "solar:users-group-two-rounded-outline",
        title: "Client base",
      },
    ],
  },
  {
    key: "tools",
    title: "Tools",
    items: [
      {
        key: "calendar",
        href: "/calendar",
        icon: "solar:calendar-linear",
        title: "Calendar",
      },
      {
        key: "integrations",
        href: "/integrations",
        icon: "solar:link-minimalistic-2-linear",
        title: "Integrations",
      },
      {
        key: "assistant-training",
        href: "/assistant/training",
        icon: "solar:book-2-linear",
        title: "Assistant training",
      },
      {
        key: "builder",
        href: "/builder",
        icon: "solar:widget-2-outline",
        title: "Builder",
      },
    ],
  },
  {
    key: "business",
    title: "Business",
    items: [
      {
        key: "billing",
        href: "/billing",
        icon: "solar:card-outline",
        title: "Subscription and billing",
      },
      {
        key: "template-store",
        href: "/template-store",
        icon: "solar:bag-4-linear",
        title: "Template marketplace",
      },
      {
        key: "integrations-marketplace",
        href: "/integrations-marketplace",
        icon: "solar:star-rainbow-linear",
        title: "Integrations marketplace",
      },
      {
        key: "business-settings",
        href: "/business-settings",
        icon: "solar:settings-linear",
        title: "Business settings",
      },
    ],
  },
  {
    key: "support",
    title: "Support",
    items: [
      {
        key: "faq",
        href: "/faq",
        icon: "solar:question-circle-linear",
        title: "Frequently asked questions",
      },
      {
        key: "support",
        href: "/support",
        icon: "solar:headphones-round-linear",
        title: "Help and support",
      },
    ],
  },
];

export function getSidebarSections(locale: Locale): SidebarSection[] {
  return locale === "en" ? EN_SECTIONS : RU_SECTIONS;
}
