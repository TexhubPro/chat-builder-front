import type { MessagingChatMessageProps } from './types';

const messagingChatConversations: MessagingChatMessageProps[] = [
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg",
    message: "Здравствуйте! Программа вылетает при запуске. Помогите, пожалуйста.",
    name: "Тайлер Смит",
    time: "14:31",
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg",
    message: "Вот скриншот ошибки.",
    name: "Тайлер Смит",
    time: "14:35",
    imageUrl: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/dummy/screenshot-1.png",
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg",
    message: "Спасибо! Уточните, какая версия и какая ОС?",
    name: "Кейт Мор (Поддержка)",
    time: "14:39",
    isRTL: true,
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg",
    message: "Версия 5.2, Windows 10.",
    name: "Тайлер Смит",
    time: "15:20",
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg",
    message: "Похоже на .NET Framework. Проверьте обновления, пожалуйста.",
    name: "Кейт Мор (Поддержка)",
    time: "15:23",
    isRTL: true,
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg",
    message: "Обновил, но ошибка осталась.",
    name: "Тайлер Смит",
    time: "16:01",
  },
  {
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg",
    message: "Давайте попробуем переустановить приложение.",
    name: "Кейт Мор (Поддержка)",
    time: "16:05",
    isRTL: true,
  },
];

export default messagingChatConversations;
