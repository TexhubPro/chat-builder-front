import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import MessagingChatInbox, { type ChatListItem } from '../components/client-chats/messaging-chat-inbox';
import MessagingChatWindow, { type ChatMessage, type SelectedChat } from '../components/client-chats/messaging-chat-window';
import MessagingChatProfile from '../components/client-chats/messaging-chat-profile';

function useMediaQuery(query: string) {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia(query);
        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
        setMatches(mediaQuery.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

export default function ClientChats() {
    const { props } = usePage<{
        chats?: ChatListItem[];
        selectedChat?: (SelectedChat & { phone?: string | null; assistantEnabled?: boolean }) | null;
        messages?: ChatMessage[];
        csrf_token?: string;
    }>();
    const chats = props.chats ?? [];
    const selectedChat = props.selectedChat ?? null;
    const serverMessages = props.messages ?? [];
    const csrfToken = props.csrf_token ?? document.querySelector<HTMLMetaElement>('meta[name=\"csrf-token\"]')?.content ?? '';

    const [messages, setMessages] = React.useState<ChatMessage[]>(serverMessages);
    const [isTyping, setIsTyping] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const isCompact = useMediaQuery('(max-width: 1024px)');

    React.useEffect(() => {
        setMessages(serverMessages);
    }, [serverMessages]);
    React.useEffect(() => {
        if (isCompact && selectedChat) {
            setPage(1);
        }
    }, [isCompact, selectedChat]);
    React.useEffect(() => {
        setIsProfileOpen(false);
    }, [selectedChat?.id]);

    const paginate = React.useCallback((direction: number) => {
        setPage((prev) => {
            const next = prev + direction;
            if (next < 0 || next > 2) return prev;
            return next;
        });
    }, []);

    const onSelectChat = (chatId: number | string) => {
        router.get('/client-chats', { chat: chatId }, { preserveScroll: true });
    };

    const onSendMessage = async (message: string) => {
        if (!selectedChat) return;
        const optimisticMessage: ChatMessage = {
            id: `tmp-${Date.now()}`,
            direction: 'outgoing',
            text: message,
            mediaUrl: null,
            sentAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setIsTyping(true);

        try {
            const response = await fetch(`/client-chats/${selectedChat.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                const payload = await response.json();
                if (payload?.reply) {
                    setMessages((prev) => [...prev, payload.reply]);
                }
                router.reload({ only: ['chats'], preserveScroll: true });
            }
        } finally {
            setIsTyping(false);
        }
    };

    const onToggleAssistant = async (enabled: boolean) => {
        if (!selectedChat) return;
        try {
            await fetch(`/client-chats/${selectedChat.id}/assistant`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ enabled }),
            });
            router.reload({ only: ['selectedChat'], preserveScroll: true });
        } catch {
            // ignore for now
        }
    };

    const onCreateOrder = async (payload: {
        name: string;
        phone?: string | null;
        service?: string | null;
        amount?: number | null;
        source?: string | null;
        notes?: string | null;
        add_to_calendar?: boolean;
        date?: string | null;
        time?: string | null;
        duration?: string | null;
    }) => {
        if (!selectedChat) return;
        await fetch(`/client-chats/${selectedChat.id}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(payload),
        });
    };

    const content = React.useMemo(() => {
        if (isCompact) {
            if (page === 1) {
                return (
                    <MessagingChatWindow
                        paginate={paginate}
                        toggleMessagingProfileSidebar={() => setPage(2)}
                        messages={messages}
                        selectedChat={selectedChat}
                        onSend={onSendMessage}
                        isTyping={isTyping}
                    />
                );
            }
            if (page === 2) {
                return <MessagingChatProfile paginate={paginate} name={selectedChat?.name} />;
            }
            return <MessagingChatInbox page={page} paginate={paginate} chats={chats} onSelect={onSelectChat} />;
        }

        return (
            <>
                <MessagingChatInbox className="lg:col-span-3" chats={chats} onSelect={onSelectChat} />
                <MessagingChatWindow
                    className={isProfileOpen ? 'lg:col-span-6' : 'lg:col-span-9'}
                    messages={messages}
                    selectedChat={selectedChat}
                    onSend={onSendMessage}
                    isTyping={isTyping}
                    toggleMessagingProfileSidebar={() => setIsProfileOpen((prev) => !prev)}
                />
                {isProfileOpen ? (
                    <MessagingChatProfile
                        className="lg:col-span-3"
                        name={selectedChat?.name}
                        channel={selectedChat?.channel}
                        phone={selectedChat?.phone ?? undefined}
                        assistantEnabled={selectedChat?.assistantEnabled ?? true}
                        onToggleAssistant={onToggleAssistant}
                        onCreateOrder={onCreateOrder}
                        paginate={(direction) => {
                            if (direction < 0) {
                                setIsProfileOpen(false);
                            }
                        }}
                    />
                ) : null}
            </>
        );
    }, [isCompact, page, paginate, chats, selectedChat, messages, isTyping, isProfileOpen]);

    return (
        <>
            <Head title="Чаты клиентов" />
            <DashboardLayout title="Чаты клиентов" defaultSelectedKey="client-chats" fullBleed hideHeader>
                <div className="grid h-full min-h-0 grid-cols-1 gap-0 overflow-hidden rounded-large border-small border-default-200 bg-white/80 dark:bg-[#1f1f24]/90 lg:grid-cols-12">
                    {content}
                </div>
            </DashboardLayout>
        </>
    );
}
