import { Icon } from "@iconify/react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  ScrollShadow,
  Spinner,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  chatAssistantReplyRequest,
  chatDetailsRequest,
  chatMarkReadRequest,
  chatsListRequest,
  chatSendMessageRequest,
  type ChatFilterChannel,
  type ChatItem,
  type ChatMessageItem,
} from "../chats/chatClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type ChatTab = ChatFilterChannel;

const CHAT_TABS: ChatTab[] = [
  "all",
  "instagram",
  "telegram",
  "widget",
  "api",
  "assistant",
];

const MAX_CHAT_FILE_BYTES = 4 * 1024 * 1024;

function resolveMessageTypeFromFileMime(mimeType: string): ChatMessageItem["message_type"] {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  return "file";
}

function formatChatDate(value: string | null, locale: "ru" | "en"): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const sameDay = now.toDateString() === date.toDateString();

  if (sameDay) {
    return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function sortChatsByLastActivity(chats: ChatItem[]): ChatItem[] {
  const list = [...chats];
  list.sort((a, b) => {
    const aTime = Date.parse(
      a.last_message_at ?? a.updated_at ?? a.created_at ?? "",
    );
    const bTime = Date.parse(
      b.last_message_at ?? b.updated_at ?? b.created_at ?? "",
    );

    return bTime - aTime;
  });

  return list;
}

function initialsFromName(value: string | null | undefined): string {
  const safe = (value ?? "").trim();

  if (safe === "") {
    return "?";
  }

  const chunks = safe.split(/\s+/u).filter(Boolean);
  const first = chunks[0]?.[0] ?? "";
  const second = chunks[1]?.[0] ?? "";
  const initials = `${first}${second}`.trim().toUpperCase();

  return initials === "" ? safe.slice(0, 1).toUpperCase() : initials;
}

function messageTypePreview(message: ChatMessageItem): string | null {
  if (message.text && message.text.trim() !== "") {
    return message.text;
  }

  switch (message.message_type) {
    case "image":
      return "[Image]";
    case "video":
      return "[Video]";
    case "voice":
      return "[Voice]";
    case "audio":
      return "[Audio]";
    case "link":
      return "[Link]";
    case "file":
      return "[File]";
    default:
      return "[Message]";
  }
}

export default function ClientChatsPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [assistantRequestCount, setAssistantRequestCount] = useState(0);
  const [isMobileConversationOpen, setIsMobileConversationOpen] =
    useState(false);

  const [channelTab, setChannelTab] = useState<ChatTab>("all");
  const [search, setSearch] = useState("");
  const [replyAssistantKey, setReplyAssistantKey] = useState("auto");

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [assistants, setAssistants] = useState<
    Array<{ id: number; name: string; is_active: boolean }>
  >([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [composerValue, setComposerValue] = useState("");

  const [globalError, setGlobalError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const localMessageIdRef = useRef(0);
  const isAskingAssistant = assistantRequestCount > 0;

  usePageSeo({
    title: `${messages.clientChats.title} | ${messages.app.name}`,
    description: messages.clientChats.subtitle,
    locale,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const upsertChat = useCallback((chat: ChatItem) => {
    setChats((previous) => {
      const next = [chat, ...previous.filter((item) => item.id !== chat.id)];
      return sortChatsByLastActivity(next);
    });

    setSelectedChat((previous) => (previous?.id === chat.id ? chat : previous));
  }, []);

  const loadChatDetails = useCallback(
    async (chatId: number, markRead: boolean, silent = false) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientChats.unauthorized);
        return;
      }

      if (!silent) {
        setIsLoadingMessages(true);
      }

      try {
        const response = await chatDetailsRequest(token, chatId, 150);
        setSelectedChat(response.chat);
        setChatMessages(response.messages);
        setAssistants(
          response.assistants.map((assistant) => ({
            id: assistant.id,
            name: assistant.name,
            is_active: assistant.is_active,
          })),
        );
        setHasActiveSubscription(
          response.subscription?.has_active_subscription ?? true,
        );

        if (markRead && response.chat.unread_count > 0) {
          const readResponse = await chatMarkReadRequest(token, chatId);
          setSelectedChat(readResponse.chat);
          upsertChat(readResponse.chat);
        } else {
          upsertChat(response.chat);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setGlobalError(messages.clientChats.unauthorized);
          return;
        }

        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientChats.loadFailed,
        );
      } finally {
        if (!silent) {
          setIsLoadingMessages(false);
        }
      }
    },
    [
      messages.clientChats.loadFailed,
      messages.clientChats.unauthorized,
      upsertChat,
    ],
  );

  const loadChats = useCallback(
    async (preserveSelection = true, silent = false) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientChats.unauthorized);
        return;
      }

      if (!silent) {
        setIsLoadingChats(true);
      }

      try {
        const response = await chatsListRequest(token, {
          channel: channelTab,
          search: search.trim() === "" ? undefined : search.trim(),
          limit: 90,
        });

        setChats(sortChatsByLastActivity(response.chats));
        setAssistants(
          response.assistants.map((assistant) => ({
            id: assistant.id,
            name: assistant.name,
            is_active: assistant.is_active,
          })),
        );
        setHasActiveSubscription(
          response.subscription?.has_active_subscription ?? true,
        );

        setSelectedChatId((previous) => {
          if (
            preserveSelection &&
            previous !== null &&
            response.chats.some((chat) => chat.id === previous)
          ) {
            return previous;
          }

          return null;
        });

        if (response.chats.length === 0) {
          setSelectedChat(null);
          setChatMessages([]);
          setIsMobileConversationOpen(false);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setGlobalError(messages.clientChats.unauthorized);
          return;
        }

        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientChats.loadFailed,
        );
      } finally {
        if (!silent) {
          setIsLoadingChats(false);
        }
      }
    },
    [
      channelTab,
      messages.clientChats.loadFailed,
      messages.clientChats.unauthorized,
      search,
    ],
  );

  useEffect(() => {
    void loadChats(false);
  }, [loadChats]);

  useEffect(() => {
    if (selectedChatId === null) {
      setSelectedChat(null);
      setChatMessages([]);
      return;
    }

    void loadChatDetails(selectedChatId, true);
  }, [loadChatDetails, selectedChatId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadChats(true, true);

      if (selectedChatId !== null) {
        void loadChatDetails(selectedChatId, false, true);
      }
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadChatDetails, loadChats, selectedChatId]);

  useEffect(() => {
    if (!selectedChat) {
      setReplyAssistantKey("auto");
      return;
    }

    setReplyAssistantKey(
      selectedChat.assistant?.id ? String(selectedChat.assistant.id) : "auto",
    );
  }, [selectedChat]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatMessages]);

  const nextLocalMessageId = useCallback((): number => {
    localMessageIdRef.current += 1;

    return -localMessageIdRef.current;
  }, []);

  const appendLocalMessage = useCallback(
    (
      data: Partial<ChatMessageItem> & {
        sender_type: ChatMessageItem["sender_type"];
        direction: ChatMessageItem["direction"];
        text: string;
      },
    ): number => {
      const localId = nextLocalMessageId();
      const nowIso = new Date().toISOString();

      const localMessage: ChatMessageItem = {
        id: localId,
        chat_id: selectedChatId ?? 0,
        assistant_id: data.assistant_id ?? selectedChat?.assistant?.id ?? null,
        sender_type: data.sender_type,
        direction: data.direction,
        status: data.status ?? "sent",
        channel_message_id: data.channel_message_id ?? null,
        message_type: data.message_type ?? "text",
        text: data.text,
        media_url: data.media_url ?? null,
        media_mime_type: data.media_mime_type ?? null,
        media_size: data.media_size ?? null,
        link_url: data.link_url ?? null,
        attachments: data.attachments ?? null,
        payload: data.payload ?? null,
        sent_at: data.sent_at ?? nowIso,
        delivered_at: data.delivered_at ?? null,
        read_at: data.read_at ?? null,
        failed_at: data.failed_at ?? null,
        created_at: data.created_at ?? nowIso,
      };

      setChatMessages((previous) => [...previous, localMessage]);

      return localId;
    },
    [nextLocalMessageId, selectedChat?.assistant?.id, selectedChatId],
  );

  const handleSendMessage = async () => {
    if (!selectedChatId || isSendingMessage) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientChats.unauthorized);
      return;
    }

    const text = composerValue.trim();

    if (text === "") {
      return;
    }

    setGlobalError(null);
    setIsSendingMessage(true);

    try {
      const response = await chatSendMessageRequest(token, selectedChatId, {
        text,
        sender_type: "agent",
        direction: "outbound",
        message_type: "text",
      });

      setComposerValue("");
      if (response.chat_message) {
        setChatMessages((previous) => [
          ...previous,
          response.chat_message as ChatMessageItem,
        ]);
      }
      upsertChat(response.chat);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setGlobalError(messages.clientChats.unauthorized);
      } else {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientChats.sendFailed,
        );
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAskAssistant = async () => {
    if (!selectedChatId || isSendingMessage) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientChats.unauthorized);
      return;
    }

    const prompt = composerValue.trim();

    if (prompt === "") {
      return;
    }

    const assistantId =
      replyAssistantKey === "auto" ? undefined : Number(replyAssistantKey);

    setGlobalError(null);
    const selectedAssistant =
      assistantId !== undefined
        ? assistants.find((assistant) => assistant.id === assistantId) ?? null
        : (selectedChat?.assistant?.id
            ? assistants.find(
                (assistant) => assistant.id === selectedChat.assistant?.id,
              ) ?? null
            : null) ??
          assistants.find((assistant) => assistant.is_active) ??
          null;

    const localIncomingId = appendLocalMessage({
      sender_type: "customer",
      direction: "inbound",
      message_type: "text",
      text: prompt,
      assistant_id:
        selectedAssistant?.id ?? selectedChat?.assistant?.id ?? null,
      status: "read",
      read_at: new Date().toISOString(),
    });

    const nowIso = new Date().toISOString();
    setSelectedChat((previous) =>
      previous
        ? {
            ...previous,
            last_message_preview: prompt,
            last_message_at: nowIso,
          }
        : previous,
    );
    setChats((previous) =>
      sortChatsByLastActivity(
        previous.map((item) =>
          item.id === selectedChatId
            ? {
                ...item,
                last_message_preview: prompt,
                last_message_at: nowIso,
              }
            : item,
        ),
      ),
    );

    setComposerValue("");

    if (!hasActiveSubscription || !selectedAssistant?.is_active) {
      const disabledMessage = !hasActiveSubscription
        ? locale === "ru"
          ? "Подписка неактивна. Купите или продлите тариф, чтобы ассистент отвечал."
          : "Subscription is inactive. Purchase or renew a plan to get assistant replies."
        : locale === "ru"
        ? "Ассистент не запущен. Запустите ассистента, чтобы получить ответ."
        : "Assistant is not running. Start the assistant to get a reply.";

      appendLocalMessage({
        sender_type: "system",
        direction: "outbound",
        message_type: "text",
        text: disabledMessage,
        assistant_id:
          selectedAssistant?.id ?? selectedChat?.assistant?.id ?? null,
      });

      return;
    }

    setAssistantRequestCount((current) => current + 1);

    try {
      const response = await chatAssistantReplyRequest(token, selectedChatId, {
        prompt,
        assistant_id: selectedAssistant?.id,
      });

      setChatMessages((previous) => {
        const withoutLocalIncoming = previous.map((message) =>
          message.id === localIncomingId ? response.incoming_message : message,
        );

        return [...withoutLocalIncoming, response.assistant_message];
      });
      upsertChat(response.chat);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setGlobalError(messages.clientChats.unauthorized);
      } else {
        const fallbackText =
          error instanceof ApiError
            ? error.message
            : messages.clientChats.assistantReplyFailed;

        appendLocalMessage({
          sender_type: "system",
          direction: "outbound",
          message_type: "text",
          text: fallbackText,
          assistant_id:
            selectedAssistant?.id ?? selectedChat?.assistant?.id ?? null,
        });
      }
    } finally {
      setAssistantRequestCount((current) => Math.max(0, current - 1));
    }
  };

  const handleOpenFilePicker = useCallback(() => {
    if (isSendingMessage) {
      return;
    }

    fileInputRef.current?.click();
  }, [isSendingMessage]);

  const handleFileSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file || !selectedChatId || isSendingMessage) {
        return;
      }

      if (file.size > MAX_CHAT_FILE_BYTES) {
        setGlobalError(
          locale === "ru"
            ? "Размер файла должен быть не больше 4 MB."
            : "File size must be 4 MB or less.",
        );
        return;
      }

      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientChats.unauthorized);
        return;
      }

      setGlobalError(null);
      setIsSendingMessage(true);

      const isAssistantChat = selectedChat?.channel === "assistant";
      const localType = resolveMessageTypeFromFileMime(file.type);
      const localText =
        file.name.trim() !== ""
          ? file.name.trim()
          : localType === "image"
            ? "[Image]"
            : localType === "video"
              ? "[Video]"
              : localType === "audio"
                ? "[Audio]"
                : "[File]";
      const localMessageId = appendLocalMessage({
        sender_type: isAssistantChat ? "customer" : "agent",
        direction: isAssistantChat ? "inbound" : "outbound",
        message_type: localType,
        text: localText,
        assistant_id: selectedChat?.assistant?.id ?? null,
        status: isAssistantChat ? "read" : "sent",
        read_at: isAssistantChat ? new Date().toISOString() : null,
      });

      const nowIso = new Date().toISOString();
      setSelectedChat((previous) =>
        previous
          ? {
              ...previous,
              last_message_preview: localText,
              last_message_at: nowIso,
            }
          : previous,
      );
      setChats((previous) =>
        sortChatsByLastActivity(
          previous.map((item) =>
            item.id === selectedChatId
              ? {
                  ...item,
                  last_message_preview: localText,
                  last_message_at: nowIso,
                }
              : item,
          ),
        ),
      );

      if (isAssistantChat) {
        setAssistantRequestCount((current) => current + 1);
      }

      try {
        const response = await chatSendMessageRequest(token, selectedChatId, {
          text: composerValue.trim() === "" ? undefined : composerValue.trim(),
          sender_type: isAssistantChat ? "customer" : "agent",
          direction: isAssistantChat ? "inbound" : "outbound",
          message_type: "file",
          file,
        });

        setChatMessages((previous) => {
          const next = previous.map((message) =>
            message.id === localMessageId && response.chat_message
              ? (response.chat_message as ChatMessageItem)
              : message,
          );

          if (response.assistant_message) {
            next.push(response.assistant_message as ChatMessageItem);
          }

          return next;
        });

        setComposerValue("");
        upsertChat(response.chat);
      } catch (error) {
        setChatMessages((previous) =>
          previous.map((message) =>
            message.id === localMessageId
              ? {
                  ...message,
                  status: "failed",
                  failed_at: new Date().toISOString(),
                }
              : message,
          ),
        );

        if (error instanceof ApiError && error.status === 401) {
          setGlobalError(messages.clientChats.unauthorized);
        } else {
          setGlobalError(
            error instanceof ApiError
              ? error.message
              : messages.clientChats.sendFailed,
          );
        }
      } finally {
        if (isAssistantChat) {
          setAssistantRequestCount((current) => Math.max(0, current - 1));
        }
        setIsSendingMessage(false);
      }
    },
    [
      composerValue,
      isSendingMessage,
      locale,
      messages.clientChats.sendFailed,
      messages.clientChats.unauthorized,
      appendLocalMessage,
      selectedChat?.channel,
      selectedChat?.assistant?.id,
      selectedChatId,
      upsertChat,
    ],
  );

  const channelTitle = useCallback(
    (channel: string) => {
      switch (channel) {
        case "instagram":
          return messages.clientChats.instagramTab;
        case "telegram":
          return messages.clientChats.telegramTab;
        case "widget":
          return messages.clientChats.widgetTab;
        case "api":
          return messages.clientChats.apiTab;
        default:
          return channel;
      }
    },
    [
      messages.clientChats.apiTab,
      messages.clientChats.instagramTab,
      messages.clientChats.telegramTab,
      messages.clientChats.widgetTab,
    ],
  );

  const channelIcon = useCallback((channel: string): string => {
    switch (channel) {
      case "instagram":
        return "solar:instagram-linear";
      case "telegram":
        return "solar:plain-2-linear";
      case "widget":
        return "solar:widget-2-outline";
      case "api":
        return "solar:code-square-linear";
      default:
        return "solar:chat-round-line-outline";
    }
  }, []);

  const channelTabTitles = useMemo(
    () => ({
      all: messages.clientChats.allChatsTab,
      instagram: messages.clientChats.instagramTab,
      telegram: messages.clientChats.telegramTab,
      widget: messages.clientChats.widgetTab,
      api: messages.clientChats.apiTab,
      assistant: messages.clientChats.assistantTab,
    }),
    [
      messages.clientChats.allChatsTab,
      messages.clientChats.apiTab,
      messages.clientChats.assistantTab,
      messages.clientChats.instagramTab,
      messages.clientChats.telegramTab,
      messages.clientChats.widgetTab,
    ],
  );

  const isAssistantConversation = selectedChat?.channel === "assistant";
  const selectedAssistantName =
    selectedChat?.assistant?.name?.trim() ||
    selectedChat?.name?.trim() ||
    "Assistant";
  const selectedAssistantIsOnline = Boolean(selectedChat?.assistant?.is_active);

  return (
    <DashboardLayout
      title={messages.clientChats.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="client-chats"
    >
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            void handleFileSelected(event);
          }}
        />

        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.clientChats.errorTitle}
            description={globalError}
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              isMobileConversationOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody className="p-0">
              <div className="space-y-3 border-b border-default-200 px-4 py-4">
                <p className="text-sm text-default-500">
                  {messages.clientChats.subtitle}
                </p>

                <div className="max-w-full overflow-x-auto rounded-full bg-default-100 p-1">
                  <Tabs
                    selectedKey={channelTab}
                    onSelectionChange={(key) => {
                      setChannelTab(String(key) as ChatTab);
                      setGlobalError(null);
                    }}
                    size="sm"
                    radius="sm"
                    variant="light"
                    classNames={{
                      base: "min-w-max",
                      tabList: "bg-transparent p-0 flex-nowrap min-w-max gap-1",
                      tab: " px-4 rounded-full border-none data-[selected=true]:bg-white data-[selected=true]:border-default-300 data-[selected=true]:shadow-none",
                      tabContent:
                        "text-default-600 group-data-[selected=true]:text-foreground",
                      cursor: "hidden",
                    }}
                  >
                    {CHAT_TABS.map((tab) => (
                      <Tab
                        key={tab}
                        title={
                          <span className="whitespace-nowrap">
                            {channelTabTitles[tab]}
                          </span>
                        }
                      />
                    ))}
                  </Tabs>
                </div>

                <Input
                  size="sm"
                  value={search}
                  radius="full"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={messages.clientChats.searchPlaceholder}
                  startContent={
                    <Icon icon="solar:magnifer-linear" width={16} />
                  }
                />
              </div>

              <ScrollShadow className="">
                {isLoadingChats ? (
                  <div className="flex h-full items-center justify-center py-12">
                    <Spinner
                      size="sm"
                      label={messages.clientChats.loadingChats}
                    />
                  </div>
                ) : chats.length === 0 ? (
                  <div className="px-4 py-8 text-sm text-default-500">
                    {messages.clientChats.emptyChats}
                  </div>
                ) : (
                  <div className="divide-y divide-default-100">
                    {chats.map((chat) => {
                      const isActive = chat.id === selectedChatId;
                      const displayName = chat.name?.trim() || `#${chat.id}`;

                      return (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => {
                            setSelectedChatId(chat.id);
                            setIsMobileConversationOpen(true);
                            setGlobalError(null);
                          }}
                          className={`w-full px-4 py-3 text-left transition ${
                            isActive
                              ? "bg-primary-50"
                              : "bg-transparent hover:bg-default-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={
                                chat.channel === "assistant"
                                  ? undefined
                                  : chat.avatar ?? undefined
                              }
                              name={displayName}
                              showFallback
                              fallback={
                                <span className="text-xs font-semibold text-default-700">
                                  {initialsFromName(displayName)}
                                </span>
                              }
                              className="h-9 w-9 shrink-0"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-2">
                                <div className="min-w-0 flex items-center gap-1.5">
                                  <p className="truncate text-sm font-semibold text-foreground">
                                    {displayName}
                                  </p>
                                  {chat.unread_count > 0 ? (
                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
                                      {chat.unread_count > 99
                                        ? "99+"
                                        : chat.unread_count}
                                    </span>
                                  ) : null}
                                </div>
                                <span className="shrink-0 text-xs text-default-500">
                                  {formatChatDate(chat.last_message_at, locale)}
                                </span>
                              </div>

                              <p className="mb-2 truncate text-xs text-default-500">
                                {chat.last_message_preview ??
                                  messages.clientChats.noPreview}
                              </p>

                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollShadow>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              !isMobileConversationOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody className="p-0">
              {selectedChat ? (
                <div className="flex h-[calc(100vh-180px)] flex-col bg-white">
                  <div className="space-y-3 border-b border-default-200 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setSelectedChatId(null);
                            setIsMobileConversationOpen(false);
                          }}
                          aria-label={messages.clientChats.backToList}
                        >
                          <Icon icon="solar:alt-arrow-left-linear" width={18} />
                        </Button>

                        <Avatar
                          src={
                            isAssistantConversation
                              ? undefined
                              : selectedChat.avatar ?? undefined
                          }
                          name={selectedChat.name ?? `#${selectedChat.id}`}
                          showFallback
                          fallback={
                            <span className="text-xs font-semibold text-default-700">
                              {initialsFromName(
                                selectedChat.name ?? `#${selectedChat.id}`,
                              )}
                            </span>
                          }
                          className="h-9 w-9 shrink-0"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                            {selectedChat.name?.trim() || `#${selectedChat.id}`}
                          </p>
                          {isAssistantConversation ? (
                            <p className="text-xs text-default-500">
                              Assistant ·{" "}
                              {selectedAssistantIsOnline
                                ? locale === "ru"
                                  ? "Онлайн"
                                  : "Online"
                                : locale === "ru"
                                ? "Оффлайн"
                                : "Offline"}
                            </p>
                          ) : (
                            <p className="text-xs text-default-500">
                              {messages.clientChats.channelLabel}:{" "}
                              {channelTitle(selectedChat.channel)}
                            </p>
                          )}
                        </div>
                      </div>

                      {isAssistantConversation ? (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label="Chat info"
                        >
                          <Icon
                            icon="solar:info-circle-linear"
                            width={18}
                            className="text-default-500"
                          />
                        </Button>
                      ) : (
                        <Chip
                          size="sm"
                          variant="flat"
                          startContent={
                            <Icon
                              icon={channelIcon(selectedChat.channel)}
                              width={14}
                              className="text-default-600"
                            />
                          }
                        >
                          {channelTitle(selectedChat.channel)}
                        </Chip>
                      )}
                    </div>

                    {!isAssistantConversation ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-default-500">
                          {messages.clientChats.assistantTargetLabel}
                        </span>

                        <div className="max-w-full overflow-x-auto rounded-large bg-default-100 p-1">
                          <Tabs
                            selectedKey={replyAssistantKey}
                            onSelectionChange={(key) =>
                              setReplyAssistantKey(String(key))
                            }
                            size="sm"
                            radius="full"
                            variant="light"
                            classNames={{
                              base: "min-w-max",
                              tabList:
                                "bg-transparent p-0 flex-nowrap min-w-max gap-1",
                              tab: "h-8 px-3 rounded-[12px] border border-transparent data-[selected=true]:bg-white data-[selected=true]:border-default-300 data-[selected=true]:shadow-none",
                              tabContent:
                                "text-default-600 group-data-[selected=true]:text-foreground",
                              cursor: "hidden",
                            }}
                          >
                            <Tab
                              key="auto"
                              title={messages.clientChats.assistantAutoOption}
                            />
                            {assistants.map((assistant) => (
                              <Tab
                                key={String(assistant.id)}
                                title={assistant.name}
                              />
                            ))}
                          </Tabs>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <ScrollShadow
                    className={`flex-1 ${
                      isAssistantConversation
                        ? "bg-default-50 px-3 py-4 sm:px-4"
                        : "px-4 py-4"
                    }`}
                  >
                    {isLoadingMessages ? (
                      <div className="flex h-full items-center justify-center">
                        <Spinner
                          size="sm"
                          label={messages.clientChats.loadingMessages}
                        />
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <p className="text-sm text-default-500">
                        {messages.clientChats.emptyMessages}
                      </p>
                    ) : (
                      <div
                        className={
                          isAssistantConversation
                            ? "mx-auto w-full max-w-[980px] space-y-5"
                            : "space-y-3"
                        }
                      >
                        {chatMessages.map((message) => {
                          const isOutgoing = isAssistantConversation
                            ? message.sender_type === "customer" ||
                              message.sender_type === "agent"
                            : message.direction === "outbound";
                          const messageTime = formatChatDate(
                            message.sent_at ?? message.created_at,
                            locale,
                          );
                          const preview = messageTypePreview(message);

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isOutgoing ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex items-end gap-2 ${
                                  isOutgoing ? "flex-row-reverse" : "flex-row"
                                }`}
                              >
                                {isAssistantConversation && !isOutgoing ? (
                                  <Avatar
                                    src={undefined}
                                    name={selectedAssistantName}
                                    showFallback
                                    fallback={
                                      <span className="text-[11px] font-semibold text-default-700">
                                        {initialsFromName(
                                          selectedAssistantName,
                                        )}
                                      </span>
                                    }
                                    className="h-8 w-8 shrink-0"
                                  />
                                ) : null}

                                <div
                                  className={`rounded-2xl border px-3 py-2 ${
                                    isAssistantConversation
                                      ? isOutgoing
                                        ? "max-w-[88%] min-w-[148px] border-default-200 bg-default-100 sm:max-w-[74%]"
                                        : "max-w-[88%] min-w-[148px] border-default-200 bg-default-100 sm:max-w-[74%]"
                                      : isOutgoing
                                      ? "max-w-[86%] border-primary-200 bg-primary-50"
                                      : "max-w-[86%] border-default-200 bg-default-50"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                                    {preview}
                                  </p>

                                  {message.media_url ? (
                                    <a
                                      href={message.media_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-2 block text-xs text-primary hover:underline"
                                    >
                                      {message.media_url}
                                    </a>
                                  ) : null}

                                  {message.link_url ? (
                                    <a
                                      href={message.link_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-2 block text-xs text-primary hover:underline"
                                    >
                                      {message.link_url}
                                    </a>
                                  ) : null}

                                  <p className="mt-1 text-right text-[11px] leading-none text-default-500">
                                    {messageTime}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {isAssistantConversation && isAskingAssistant ? (
                          <div className="flex justify-start">
                            <div className="flex items-end gap-2">
                              <Avatar
                                src={undefined}
                                name={selectedAssistantName}
                                showFallback
                                fallback={
                                  <span className="text-[11px] font-semibold text-default-700">
                                    {initialsFromName(selectedAssistantName)}
                                  </span>
                                }
                                className="h-8 w-8 shrink-0"
                              />

                              <div className="inline-flex w-auto rounded-2xl border border-default-200 bg-default-100 px-3 py-2">
                                <div className="flex items-center gap-1.5 py-1">
                                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-default-400" />
                                  <span
                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-default-400"
                                    style={{ animationDelay: "120ms" }}
                                  />
                                  <span
                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-default-400"
                                    style={{ animationDelay: "240ms" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <div ref={bottomRef} />
                      </div>
                    )}
                  </ScrollShadow>

                  <Divider />

                  {isAssistantConversation ? (
                    <div className="border-t border-default-200 bg-white px-2 pt-2 pb-1 sm:px-2 sm:pb-2">
                      <div className="mx-auto w-full max-w-full">
                        <div className="flex items-center gap-2 rounded-xl border border-default-200 bg-white px-2 py-0.5">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={handleOpenFilePicker}
                          isDisabled={isSendingMessage}
                          aria-label="Attach file"
                        >
                          <Icon icon="solar:paperclip-linear" width={17} />
                          </Button>

                          <Input
                            value={composerValue}
                            onValueChange={setComposerValue}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void handleAskAssistant();
                              }
                            }}
                            placeholder={
                              messages.clientChats.messagePlaceholder
                            }
                            variant="flat"
                            className="flex-1 bg-transparent hover:bg-transparent focus:bg-transparent"
                            classNames={{
                              inputWrapper: "bg-transparent shadow-none",
                            }}
                          />

                          <Button
                            isIconOnly
                            size="sm"
                            color="primary"
                            radius="md"
                            onPress={handleAskAssistant}
                            isDisabled={
                              isSendingMessage || composerValue.trim() === ""
                            }
                            aria-label={messages.clientChats.askAssistantButton}
                          >
                            <Icon icon="solar:arrow-up-linear" width={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4 py-3">
                      <Textarea
                        minRows={2}
                        maxRows={6}
                        value={composerValue}
                        onValueChange={setComposerValue}
                        placeholder={messages.clientChats.messagePlaceholder}
                        variant="bordered"
                      />

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          color="primary"
                          className="sm:flex-1"
                          onPress={handleAskAssistant}
                          isLoading={isAskingAssistant}
                          isDisabled={
                            isSendingMessage || composerValue.trim() === ""
                          }
                          startContent={
                            !isAskingAssistant ? (
                              <Icon
                                icon="solar:stars-line-duotone"
                                width={16}
                              />
                            ) : null
                          }
                        >
                          {messages.clientChats.askAssistantButton}
                        </Button>

                        <Button
                          variant="bordered"
                          className="sm:flex-1"
                          onPress={handleSendMessage}
                          isLoading={isSendingMessage}
                          isDisabled={
                            isAskingAssistant || composerValue.trim() === ""
                          }
                          startContent={
                            !isSendingMessage ? (
                              <Icon icon="solar:plain-2-linear" width={16} />
                            ) : null
                          }
                        >
                          {messages.clientChats.sendButton}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[calc(100vh-180px)] items-center justify-center px-6">
                  <div className="max-w-sm space-y-2 text-center">
                    <Icon
                      icon="solar:chat-round-line-outline"
                      width={34}
                      className="mx-auto text-default-400"
                    />
                    <p className="text-sm font-semibold text-foreground">
                      {messages.clientChats.selectChatTitle}
                    </p>
                    <p className="text-sm text-default-500">
                      {messages.clientChats.selectChatDescription}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
