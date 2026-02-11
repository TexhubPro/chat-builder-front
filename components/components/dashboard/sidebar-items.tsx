import { type SidebarItem } from './Sidebar';

export const sidebarSections: SidebarItem[] = [
    {
        key: 'main',
        title: 'Основное',
        items: [
            {
                key: 'dashboard',
                href: '/dashboard',
                icon: 'solar:home-2-linear',
                title: 'Панель управления',
            },
        ],
    },
    {
        key: 'clients',
        title: 'Клиенты',
        items: [
            {
                key: 'client-requests',
                href: '/client-requests',
                icon: 'solar:inbox-archive-linear',
                title: 'Заявки клиентов',
            },
            {
                key: 'client-questions',
                href: '/client-questions',
                icon: 'solar:question-circle-linear',
                title: 'Вопросы клиентов',
            },
            {
                key: 'client-chats',
                href: '/client-chats',
                icon: 'solar:chat-round-line-outline',
                title: 'Чаты клиентов',
            },
            {
                key: 'client-base',
                href: '#',
                icon: 'solar:users-group-two-rounded-outline',
                title: 'База клиентов',
            },
        ],
    },
    {
        key: 'tools',
        title: 'Инструменты',
        items: [
            {
                key: 'calendar',
                href: '/calendar',
                icon: 'solar:calendar-linear',
                title: 'Календарь',
            },
            {
                key: 'integrations',
                href: '/integrations',
                icon: 'solar:link-minimalistic-2-linear',
                title: 'Интеграции',
            },
            {
                key: 'assistant-training',
                href: '/assistant/training',
                icon: 'solar:book-2-linear',
                title: 'Обучение ассистента',
            },
            {
                key: 'builder',
                href: '#',
                icon: 'solar:widget-2-outline',
                title: 'Конструктор',
            },
        ],
    },
    {
        key: 'business',
        title: 'Бизнес',
        items: [
            {
                key: 'catalog',
                href: '/catalog',
                icon: 'solar:shop-2-linear',
                title: 'Каталог и услуги',
            },
            {
                key: 'template-store',
                href: '#',
                icon: 'solar:bag-4-linear',
                title: 'Магазин шаблонов',
            },
            {
                key: 'integrations-store',
                href: '#',
                icon: 'solar:link-circle-linear',
                title: 'Магазин интеграций',
            },
            {
                key: 'billing',
                href: '#',
                icon: 'solar:card-outline',
                title: 'Подписка и платежи',
            },
        ],
    },
    {
        key: 'support',
        title: 'Поддержка',
        items: [
            {
                key: 'faq',
                href: '#',
                icon: 'solar:question-circle-linear',
                title: 'Часто задаваемые вопросы',
            },
            {
                key: 'support',
                href: '#',
                icon: 'solar:headphones-round-linear',
                title: 'Помощь и поддержка',
            },
        ],
    },
];
