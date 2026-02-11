import React from 'react';
import { Avatar, Badge, ScrollShadow, Listbox, ListboxItem, Input, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';

import MessagingChatHeader from './messaging-chat-header';

export type ChatListItem = {
    id: number | string;
    name: string;
    channel: string;
    lastMessage: string;
    lastMessageAt: string;
    unread: number;
    avatarUrl?: string | null;
    active?: boolean;
};

export type MessageChatInboxProps = React.HTMLAttributes<HTMLDivElement> & {
    page?: number;
    paginate?: (direction: number) => void;
    chats: ChatListItem[];
    onSelect: (chatId: number | string) => void;
};

const channelIcon = (channel: string) => {
    switch (channel) {
        case 'instagram':
            return 'mdi:instagram';
        case 'telegram':
            return 'mdi:telegram';
        case 'assistant':
            return 'solar:robot-2-linear';
        default:
            return 'solar:chat-round-line-outline';
    }
};

const MessageChatInbox = React.forwardRef<HTMLDivElement, MessageChatInboxProps>(({ page, paginate, chats, onSelect, className, ...props }, ref) => {
    return (
        <div ref={ref} {...props} className={cn('flex h-full min-h-0 flex-col', className)}>
            <div className="flex h-full w-full flex-col overflow-visible border-r-small border-default-200">
                <MessagingChatHeader className="hidden sm:flex" page={page} paginate={paginate} />
                <div className="mb-6 flex flex-col gap-4 px-3 sm:px-6">
                    <div>
              <div className="mb-4 mt-2">
                            <Input
                                aria-label="Search"
                                labelPlacement="outside"
                                placeholder="Поиск по чатам"
                                radius="md"
                                startContent={<Icon className="text-default-500 [&>g]:stroke-[2px]" icon="solar:magnifer-linear" width={18} />}
                                variant="bordered"
                            />
                        </div>
                        <div className="mt-4">
                            <Tabs
                                fullWidth
                                classNames={{
                                    cursor: 'group-data-[selected=true]:bg-content1',
                                }}
                            >
                                <Tab
                                    key="inbox"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <Icon icon="solar:chat-round-line-outline" width={14} /> Все
                                        </span>
                                    }
                                />
                                <Tab
                                    key="unread"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <Icon icon="solar:bell-linear" width={14} /> Непрочитанные
                                        </span>
                                    }
                                />
                                <Tab
                                    key="instagram"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <Icon icon="mdi:instagram" width={14} /> Instagram
                                        </span>
                                    }
                                />
                                <Tab
                                    key="telegram"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <Icon icon="mdi:telegram" width={14} /> Telegram
                                        </span>
                                    }
                                />
                                <Tab
                                    key="web"
                                    title={
                                        <span className="flex items-center gap-1">
                                            <Icon icon="solar:globe-linear" width={14} className="text-default-500" /> Web
                                        </span>
                                    }
                                />
                            </Tabs>
                        </div>
                    </div>
                </div>
                <ScrollShadow className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3">
                    <Listbox
                        classNames={{
                            base: 'p-0',
                        }}
                        items={chats}
                        variant="flat"
                    >
                        {(item: ChatListItem) => (
                            <ListboxItem
                                key={item.id}
                                className={cn('mb-2 px-4', {
                                    'bg-default-100': item.active,
                                })}
                                textValue={item.name}
                                onPress={() => {
                                    onSelect(item.id);
                                    paginate?.(1);
                                }}
                            >
                                <div className="flex items-center gap-2 py-1">
                                    <div className="relative flex-shrink-0">
                      <Avatar name={item.name} className="flex-shrink-0" size="sm" src={item.avatarUrl ? item.avatarUrl : undefined} />
                                    </div>
                                    <div className="ml-2 min-w-0 flex-1">
                                        <div className="text-small font-semibold text-default-foreground">{item.name}</div>
                                        <div className="truncate text-small text-default-500">{item.lastMessage}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Icon className="text-default-400" icon={channelIcon(item.channel)} width={18} />
                                        <div className="text-[11px] text-default-400">{item.lastMessageAt}</div>
                                        {item.unread > 0 ? <Badge color="primary" content={item.unread} size="sm" /> : null}
                                    </div>
                                </div>
                            </ListboxItem>
                        )}
                    </Listbox>
                </ScrollShadow>
            </div>
        </div>
    );
});

MessageChatInbox.displayName = 'MessageChatInbox';

export default MessageChatInbox;
