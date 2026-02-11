import React from 'react';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';

import MessagingChatMessage from './messaging-chat-message';
import MessagingChatInput from './messaging-chat-input';
import MessagingChatHeader from './messaging-chat-header';

export type ChatMessage = {
  id: number | string;
  direction: 'incoming' | 'outgoing';
  text: string;
  mediaUrl?: string | null;
  sentAt?: string | null;
};

export type SelectedChat = {
  id: number | string;
  name: string;
  channel: string;
  avatarUrl?: string | null;
};

export type MessagingChatWindowProps = React.HTMLAttributes<HTMLDivElement> & {
  paginate?: (page: number) => void;
  toggleMessagingProfileSidebar?: () => void;
  messages: ChatMessage[];
  selectedChat?: SelectedChat | null;
  onSend: (message: string) => void;
  isTyping?: boolean;
};

const MessagingChatWindow = React.forwardRef<HTMLDivElement, MessagingChatWindowProps>(
  ({ paginate, toggleMessagingProfileSidebar, messages, selectedChat, onSend, isTyping, className, ...props }, ref) => {
    const endRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (!endRef.current) return;
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages.length, isTyping, selectedChat?.id]);

    return (
      <div ref={ref} {...props} className={`flex h-full min-h-0 flex-col ${className ?? ''}`}>
        <div className="flex w-full min-h-0 flex-1 flex-col sm:border-default-200 lg:border-x-small">
          <MessagingChatHeader className="flex lg:hidden" paginate={paginate} page={1} />
          <div className="flex h-17 items-center gap-3 border-y-small border-default-200 p-3 sm:p-4 lg:border-t-0">
            <Avatar
              className="h-10 w-10"
              name={selectedChat?.name ?? 'К'}
              src={selectedChat?.avatarUrl ? selectedChat.avatarUrl : undefined}
            />
            <div className="flex w-full flex-col gap-1">
              <div className="text-small font-semibold">{selectedChat?.name ?? 'Выберите чат'}</div>
              <div className="flex flex-wrap items-center gap-2 text-small text-default-500">
                <span className="flex items-center gap-1 rounded-full bg-default-100 px-2 py-0.5 text-[11px] font-medium text-default-600">
                  <Icon
                    icon={
                      selectedChat?.channel === 'telegram'
                        ? 'mdi:telegram'
                        : selectedChat?.channel === 'instagram'
                          ? 'mdi:instagram'
                          : selectedChat?.channel === 'assistant'
                            ? 'solar:robot-2-linear'
                            : 'solar:globe-linear'
                    }
                    width={12}
                  />
                  {selectedChat?.channel === 'telegram'
                    ? 'Telegram'
                    : selectedChat?.channel === 'instagram'
                      ? 'Instagram'
                      : selectedChat?.channel === 'assistant'
                        ? 'Assistant'
                        : 'Web'}
                </span>
                <span className="text-[12px]">Онлайн</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                className="min-w-8 text-default-500"
                variant="light"
                onPress={() => {
                  if (toggleMessagingProfileSidebar) {
                    toggleMessagingProfileSidebar();
                  } else {
                    paginate?.(1);
                  }
                }}
                aria-label="Информация"
              >
                <Icon icon="solar:info-circle-linear" width={20} />
              </Button>
            </div>
          </div>
          <div className="flex min-h-0 w-full flex-1">
            <ScrollShadow className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-4 pb-10">
              {messages.length === 0 ? (
                <div className="rounded-medium border border-dashed border-default-200 px-4 py-6 text-center text-small text-default-400">
                  Сообщений пока нет
                </div>
              ) : (
                messages.map((message) => (
                  <MessagingChatMessage
                    key={message.id}
                    avatar={message.direction === 'outgoing' ? '' : selectedChat?.avatarUrl ?? ''}
                    message={message.text}
                    name={message.direction === 'outgoing' ? 'Вы' : selectedChat?.name ?? 'Клиент'}
                    time={message.sentAt ?? ''}
                    isRTL={message.direction === 'outgoing'}
                    imageUrl={message.mediaUrl ?? undefined}
                  />
                ))
              )}
              {isTyping ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9" name={selectedChat?.name ?? 'А'} src={selectedChat?.avatarUrl ?? undefined} />
                  <div className="flex items-center gap-1 rounded-medium bg-default-100 px-3 py-2 text-default-400">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-default-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-default-400" style={{ animationDelay: '120ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-default-400" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </ScrollShadow>
          </div>
          <div className="mx-2 mb-3 mt-auto flex flex-col">
            <MessagingChatInput onSend={onSend} />
          </div>
        </div>
      </div>
    );
  },
);

MessagingChatWindow.displayName = 'MessagingChatWindow';

export default MessagingChatWindow;
