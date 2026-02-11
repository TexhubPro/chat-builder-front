import React from 'react';
import { Badge, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';

export interface MessagingChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    page?: number;
    onOpen?: () => void;
    paginate?: (direction: number) => void;
    chats?: { unread?: number }[];
}

const MessagingChatHeader = React.forwardRef<HTMLInputElement, MessagingChatHeaderProps>(
    ({ page, paginate, onOpen, chats = [], className, ...props }, ref) => {
    return (
        <header className={cn('flex w-full items-center justify-between px-3 py-3 sm:px-6', className)} {...props} ref={ref}>
            {page === 0 ? (
                <Button
                    isIconOnly
                    className={cn('flex text-default-500', {
                        'sm:hidden': page === 0,
                    })}
                    size="sm"
                    variant="light"
                    onPress={onOpen}
                >
                    <Icon height={24} icon="solar:hamburger-menu-outline" width={24} />
                </Button>
            ) : (
                <Button isIconOnly className="flex text-default-500 lg:hidden" size="sm" variant="light" onPress={() => paginate?.(-1)}>
                    <Icon height={24} icon="solar:arrow-left-outline" width={24} />
                </Button>
            )}

            <div
                className={cn('flex w-full items-center text-large font-bold text-foreground lg:justify-start', {
                    'sm:justify-start': page === 0,
                })}
            >
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-large font-bold text-foreground">Чаты клиентов</h2>
                    <div className="flex items-center justify-between">
                        {chats.some((chat) => (chat.unread ?? 0) > 0) ? (
                            <Badge
                                color="primary"
                                content={chats.reduce((total, chat) => total + (chat.unread ?? 0), 0)}
                                size="sm"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
});

MessagingChatHeader.displayName = 'MessagingChatHeader';

export default MessagingChatHeader;
