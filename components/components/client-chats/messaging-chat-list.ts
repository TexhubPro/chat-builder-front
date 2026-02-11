export type MessagingChatListProps = {
  id: number;
  avatar: string;
  name: string;
  message: string;
  count: number;
  time: string;
  active?: boolean;
};

const messagingChatList: MessagingChatListProps[] = [
  {
    id: 1,
    name: "Алия Мирова",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/2222bfce7311f85ca51a6ffcf8bd3156.jpg",
    message: "Не могу войти в личный кабинет. Подскажите, что делать?",
    count: 3,
    time: "12:34",
  },
  {
    id: 2,
    name: "Мария Жукова",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/d958cf406bb83c3c0a93e2f03fcb0bef.jpg",
    message: "Ошибка при оплате заказа, код 5003.",
    count: 1,
    time: "18:40",
  },
  {
    id: 3,
    name: "Тайлер Смит",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg",
    message: "Списали деньги дважды, можете проверить?",
    count: 0,
    time: "12:19",
    active: true,
  },
  {
    id: 4,
    name: "Виктория Лебедева",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/f4d075c1fa8155478e5bb26aaae69fc1.jpg",
    message: "Не приходит письмо для сброса пароля.",
    count: 2,
    time: "22:04",
  },
  {
    id: 5,
    name: "Руслан Исаев",
    avatar: "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/6c4d4c601258595c0e575d384c091223.jpg",
    message: "Получил товар с браком. Как оформить возврат?",
    count: 4,
    time: "17:05",
  },
];

export default messagingChatList;
