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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import {
  assistantIntegrationDisconnectRequest,
  assistantInstagramConnectRequest,
  assistantIntegrationsRequest,
  assistantTelegramConnectRequest,
  assistantIntegrationToggleRequest,
  type AssistantIntegrationChannel,
  type AssistantIntegrationLimits,
  type IntegrationAssistant,
} from "../integrations/integrationsClient";
import { usePageSeo } from "../seo/usePageSeo";

type ChannelKey = "instagram" | "telegram" | "widget" | "api";

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

export default function IntegrationsPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingAssistants, setIsLoadingAssistants] = useState(true);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  const [assistants, setAssistants] = useState<IntegrationAssistant[]>([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(
    null,
  );
  const [channels, setChannels] = useState<AssistantIntegrationChannel[]>([]);
  const [limits, setLimits] = useState<AssistantIntegrationLimits | null>(null);
  const [updatingChannelKeys, setUpdatingChannelKeys] = useState<
    Record<string, boolean>
  >({});
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [isTelegramConnecting, setIsTelegramConnecting] = useState(false);

  const [globalError, setGlobalError] = useState<string | null>(null);
  const callbackAssistantId = useMemo(() => {
    const raw = searchParams.get("assistant_id");
    if (!raw) {
      return null;
    }

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return parsed;
  }, [searchParams]);
  const callbackStatus = searchParams.get("instagram_status");
  const callbackError = searchParams.get("instagram_error");

  usePageSeo({
    title: `${messages.integrations.title} | ${messages.app.name}`,
    description: messages.integrations.subtitle,
    locale,
  });

  const selectedAssistant = useMemo(
    () =>
      selectedAssistantId !== null
        ? assistants.find((assistant) => assistant.id === selectedAssistantId)
          ?? null
        : null,
    [assistants, selectedAssistantId],
  );

  const channelMeta = useMemo(
    () => ({
      instagram: {
        title: messages.integrations.channelInstagram,
        description: messages.integrations.channelInstagramDescription,
        icon: "solar:instagram-linear",
        iconClass: "bg-pink-100 text-pink-600",
      },
      telegram: {
        title: messages.integrations.channelTelegram,
        description: messages.integrations.channelTelegramDescription,
        icon: "solar:plain-2-linear",
        iconClass: "bg-blue-100 text-blue-600",
      },
      widget: {
        title: messages.integrations.channelWidget,
        description: messages.integrations.channelWidgetDescription,
        icon: "solar:widget-2-outline",
        iconClass: "bg-violet-100 text-violet-600",
      },
      api: {
        title: messages.integrations.channelApi,
        description: messages.integrations.channelApiDescription,
        icon: "solar:code-square-linear",
        iconClass: "bg-emerald-100 text-emerald-600",
      },
    }),
    [
      messages.integrations.channelApi,
      messages.integrations.channelApiDescription,
      messages.integrations.channelInstagram,
      messages.integrations.channelInstagramDescription,
      messages.integrations.channelTelegram,
      messages.integrations.channelTelegramDescription,
      messages.integrations.channelWidget,
      messages.integrations.channelWidgetDescription,
    ],
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadAssistants = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.integrations.unauthorized);
      return;
    }

    setIsLoadingAssistants(true);

    try {
      const response = await assistantIntegrationsRequest(token);

      setAssistants(response.assistants);
      setLimits(response.limits);
      setChannels([]);
      setSelectedAssistantId(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setGlobalError(messages.integrations.unauthorized);
      } else {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.integrations.loadFailed,
        );
      }
    } finally {
      setIsLoadingAssistants(false);
    }
  }, [
    messages.integrations.loadFailed,
    messages.integrations.unauthorized,
  ]);

  const loadChannels = useCallback(
    async (assistantId: number) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.integrations.unauthorized);
        return;
      }

      setIsLoadingChannels(true);

      try {
        const response = await assistantIntegrationsRequest(token, assistantId);
        setAssistants(response.assistants);
        setLimits(response.limits);
        setChannels(response.channels);
        setSelectedAssistantId(response.selected_assistant_id ?? assistantId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setGlobalError(messages.integrations.unauthorized);
        } else {
          setGlobalError(
            error instanceof ApiError
              ? error.message
              : messages.integrations.loadFailed,
          );
        }
      } finally {
        setIsLoadingChannels(false);
      }
    },
    [
      messages.integrations.loadFailed,
      messages.integrations.unauthorized,
    ],
  );

  useEffect(() => {
    void loadAssistants();
  }, [loadAssistants]);

  useEffect(() => {
    if (isLoadingAssistants) {
      return;
    }

    const hasOauthParams =
      callbackStatus !== null || callbackError !== null || callbackAssistantId !== null;

    if (!hasOauthParams) {
      return;
    }

    if (callbackError && callbackError.trim() !== "") {
      setGlobalError(callbackError);
    } else {
      setGlobalError(null);
    }

    if (callbackStatus === "connected" && callbackAssistantId !== null) {
      setSelectedAssistantId(callbackAssistantId);
      setIsMobileDetailsOpen(true);
      void loadChannels(callbackAssistantId);
    }

    navigate("/integrations", { replace: true });
  }, [
    callbackAssistantId,
    callbackError,
    callbackStatus,
    isLoadingAssistants,
    loadChannels,
    navigate,
  ]);

  const handleAssistantSelect = useCallback(
    (assistantId: number) => {
      setGlobalError(null);
      setSelectedAssistantId(assistantId);
      setIsMobileDetailsOpen(true);
      void loadChannels(assistantId);
    },
    [loadChannels],
  );

  const handleBackToAssistants = useCallback(() => {
    setSelectedAssistantId(null);
    setChannels([]);
    setIsMobileDetailsOpen(false);
    setGlobalError(null);
  }, []);

  const handleToggleChannel = useCallback(
    async (channel: ChannelKey, enabled: boolean) => {
      if (!selectedAssistantId) {
        return;
      }

      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.integrations.unauthorized);
        return;
      }

      const rowKey = `${selectedAssistantId}:${channel}`;
      const previousChannels = channels;

      setUpdatingChannelKeys((previous) => ({
        ...previous,
        [rowKey]: true,
      }));
      setGlobalError(null);

      setChannels((previous) =>
        previous.map((item) =>
          item.channel === channel
            ? {
                ...item,
                is_connected: enabled ? true : item.is_connected,
                is_active: enabled,
              }
            : item,
        ),
      );

      try {
        const response = await assistantIntegrationToggleRequest(
          token,
          selectedAssistantId,
          channel,
          enabled,
        );

        setChannels((previous) =>
          previous.map((item) =>
            item.channel === channel ? response.channel : item,
          ),
        );
        setLimits(response.limits);
      } catch (error) {
        setChannels(previousChannels);
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.integrations.updateFailed,
        );
      } finally {
        setUpdatingChannelKeys((previous) => {
          const next = { ...previous };
          delete next[rowKey];
          return next;
        });
      }
    },
    [
      channels,
      messages.integrations.unauthorized,
      messages.integrations.updateFailed,
      selectedAssistantId,
    ],
  );

  const handleDisconnectChannel = useCallback(
    async (channel: ChannelKey) => {
      if (!selectedAssistantId) {
        return;
      }

      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.integrations.unauthorized);
        return;
      }

      const rowKey = `${selectedAssistantId}:${channel}`;
      const previousChannels = channels;

      setUpdatingChannelKeys((previous) => ({
        ...previous,
        [rowKey]: true,
      }));
      setGlobalError(null);

      setChannels((previous) =>
        previous.map((item) =>
          item.channel === channel
            ? {
                ...item,
                id: null,
                assistant_id: null,
                name: null,
                external_account_id: null,
                is_connected: false,
                is_active: false,
                settings: {},
                metadata: {},
                updated_at: null,
              }
            : item,
        ),
      );

      try {
        const response = await assistantIntegrationDisconnectRequest(
          token,
          selectedAssistantId,
          channel,
        );

        setChannels((previous) =>
          previous.map((item) =>
            item.channel === channel ? response.channel : item,
          ),
        );
        setLimits(response.limits);
      } catch (error) {
        setChannels(previousChannels);
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.integrations.updateFailed,
        );
      } finally {
        setUpdatingChannelKeys((previous) => {
          const next = { ...previous };
          delete next[rowKey];
          return next;
        });
      }
    },
    [
      channels,
      messages.integrations.unauthorized,
      messages.integrations.updateFailed,
      selectedAssistantId,
    ],
  );

  const handleInstagramConnect = useCallback(async () => {
    if (!selectedAssistantId) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.integrations.unauthorized);
      return;
    }

    const rowKey = `${selectedAssistantId}:instagram`;

    setUpdatingChannelKeys((previous) => ({
      ...previous,
      [rowKey]: true,
    }));
    setGlobalError(null);

    try {
      const response = await assistantInstagramConnectRequest(token, selectedAssistantId);

      if (!response.authorization_url) {
        throw new Error(messages.integrations.updateFailed);
      }

      window.location.assign(response.authorization_url);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : messages.integrations.updateFailed,
      );
      setUpdatingChannelKeys((previous) => {
        const next = { ...previous };
        delete next[rowKey];
        return next;
      });
    }
  }, [
    messages.integrations.unauthorized,
    messages.integrations.updateFailed,
    selectedAssistantId,
  ]);

  const openTelegramConnectModal = useCallback(() => {
    setTelegramBotToken("");
    setIsTelegramModalOpen(true);
  }, []);

  const closeTelegramConnectModal = useCallback(() => {
    if (isTelegramConnecting) {
      return;
    }

    setIsTelegramModalOpen(false);
    setTelegramBotToken("");
  }, [isTelegramConnecting]);

  const handleTelegramConnect = useCallback(async () => {
    if (!selectedAssistantId) {
      return;
    }

    const normalizedToken = telegramBotToken.trim();
    if (normalizedToken === "") {
      setGlobalError(messages.integrations.telegramTokenRequired);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.integrations.unauthorized);
      return;
    }

    const rowKey = `${selectedAssistantId}:telegram`;

    setUpdatingChannelKeys((previous) => ({
      ...previous,
      [rowKey]: true,
    }));
    setIsTelegramConnecting(true);
    setGlobalError(null);

    try {
      const response = await assistantTelegramConnectRequest(
        token,
        selectedAssistantId,
        normalizedToken,
      );

      setChannels((previous) =>
        previous.map((item) =>
          item.channel === "telegram" ? response.channel : item,
        ),
      );
      setLimits(response.limits);
      setIsTelegramModalOpen(false);
      setTelegramBotToken("");
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.integrations.updateFailed,
      );
    } finally {
      setIsTelegramConnecting(false);
      setUpdatingChannelKeys((previous) => {
        const next = { ...previous };
        delete next[rowKey];
        return next;
      });
    }
  }, [
    messages.integrations.telegramTokenRequired,
    messages.integrations.unauthorized,
    messages.integrations.updateFailed,
    selectedAssistantId,
    telegramBotToken,
  ]);

  return (
    <DashboardLayout
      title={messages.integrations.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="integrations"
    >
      <div className="space-y-4">
        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.integrations.errorTitle}
            description={globalError}
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              isMobileDetailsOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody className="space-y-4 p-4 sm:p-5">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {messages.integrations.assistantsTitle}
                </p>
                <p className="text-sm text-default-500">
                  {messages.integrations.assistantsSubtitle}
                </p>
              </div>

              {isLoadingAssistants ? (
                <div className="flex items-center justify-center py-10">
                  <Spinner size="sm" label={messages.integrations.loadingAssistants} />
                </div>
              ) : assistants.length === 0 ? (
                <p className="text-sm text-default-500">
                  {messages.integrations.noAssistants}
                </p>
              ) : (
                <div className="space-y-2">
                  {assistants.map((assistant) => {
                    const isSelected = assistant.id === selectedAssistantId;

                    return (
                      <button
                        key={assistant.id}
                        type="button"
                        onClick={() => {
                          handleAssistantSelect(assistant.id);
                        }}
                        className={`w-full rounded-large border px-3 py-3 text-left transition ${
                          isSelected
                            ? "border-primary-300 bg-primary-50"
                            : "border-default-200 bg-white hover:border-default-300 hover:bg-default-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar
                            name={assistant.name}
                            showFallback
                            fallback={
                              <span className="text-xs font-semibold text-default-700">
                                {initialsFromName(assistant.name)}
                              </span>
                            }
                            className="h-10 w-10 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {assistant.name}
                            </p>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={assistant.is_active ? "success" : "default"}
                              className="mt-1"
                            >
                              {assistant.is_active
                                ? messages.integrations.assistantRunning
                                : messages.integrations.assistantStopped}
                            </Chip>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              !isMobileDetailsOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody className="p-0">
              {selectedAssistant ? (
                <div className="flex h-full flex-col">
                  <div className="space-y-3 border-b border-default-200 px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={handleBackToAssistants}
                          aria-label={messages.integrations.backToAssistants}
                        >
                          <Icon icon="solar:alt-arrow-left-linear" width={18} />
                        </Button>
                        <p className="text-base font-semibold text-foreground">
                          {messages.integrations.channelsTitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-default-500">
                      {messages.integrations.channelsSubtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        {selectedAssistant.name}
                      </Chip>
                      <Chip size="sm" variant="flat" color="default">
                        {messages.integrations.activeIntegrationsLabel}:{" "}
                        {limits?.active_integrations ?? 0}
                      </Chip>
                      <Chip size="sm" variant="flat" color="default">
                        {messages.integrations.integrationLimitLabel}:{" "}
                        {limits?.integrations_per_channel_limit ?? 0}
                      </Chip>
                    </div>
                  </div>

                  {isLoadingChannels ? (
                    <div className="flex flex-1 items-center justify-center py-14">
                      <Spinner size="sm" label={messages.integrations.loadingChannels} />
                    </div>
                  ) : (
                    <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                      {channels.map((channelItem) => {
                        const channelKey = channelItem.channel as ChannelKey;
                        const meta = channelMeta[channelKey];
                        const loadingKey = `${selectedAssistant.id}:${channelItem.channel}`;
                        const isUpdating = Boolean(updatingChannelKeys[loadingKey]);
                        const accountPreview =
                          channelItem.external_account_id
                          ?? channelItem.name
                          ?? null;

                        return (
                          <Card
                            key={channelItem.channel}
                            shadow="none"
                            className="border border-default-200 bg-default-50"
                          >
                            <CardBody className="space-y-3 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta?.iconClass ?? "bg-default-200 text-default-700"}`}
                                  >
                                    <Icon
                                      icon={meta?.icon ?? "solar:link-linear"}
                                      width={22}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-base font-semibold text-foreground">
                                      {meta?.title ?? channelItem.channel}
                                    </p>
                                    <p className="text-sm text-default-500">
                                      {meta?.description ?? ""}
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  size="sm"
                                  isSelected={
                                    channelItem.is_connected && channelItem.is_active
                                  }
                                  isDisabled={
                                    isUpdating
                                    || !limits?.has_active_subscription
                                    || !channelItem.is_connected
                                  }
                                  onValueChange={(value) => {
                                    void handleToggleChannel(channelKey, value);
                                  }}
                                  aria-label={messages.integrations.toggleLabel}
                                />
                              </div>

                              <Divider />

                              <div className="space-y-2">
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={channelItem.is_active ? "success" : "default"}
                                >
                                  {channelItem.is_active
                                    ? messages.integrations.statusEnabled
                                    : messages.integrations.statusDisabled}
                                </Chip>

                                <p className="text-xs text-default-500">
                                  {messages.integrations.accountLabel}:{" "}
                                  <span className="text-default-700">
                                    {accountPreview ?? messages.integrations.noConnection}
                                  </span>
                                </p>
                              </div>

                              {channelItem.is_connected ? (
                                <Button
                                  color="danger"
                                  variant="solid"
                                  className="w-full"
                                  onPress={() => {
                                    void handleDisconnectChannel(channelKey);
                                  }}
                                  isLoading={isUpdating}
                                >
                                  {messages.integrations.disconnectButton}
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  variant="solid"
                                  className="w-full"
                                  onPress={() => {
                                    if (channelKey === "instagram") {
                                      void handleInstagramConnect();
                                      return;
                                    }

                                    if (channelKey === "telegram") {
                                      openTelegramConnectModal();
                                      return;
                                    }

                                    void handleToggleChannel(channelKey, true);
                                  }}
                                  isLoading={isUpdating}
                                  isDisabled={!limits?.has_active_subscription}
                                >
                                  {messages.integrations.connectButton}
                                </Button>
                              )}
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[calc(100vh-220px)] items-center justify-center px-6">
                  <div className="max-w-md space-y-2 text-center">
                    <Icon
                      icon="solar:link-circle-linear"
                      width={36}
                      className="mx-auto text-default-400"
                    />
                    <p className="text-base font-semibold text-foreground">
                      {messages.integrations.selectAssistantTitle}
                    </p>
                    <p className="text-sm text-default-500">
                      {messages.integrations.selectAssistantDescription}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isTelegramModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeTelegramConnectModal();
          }
        }}
      >
        <ModalContent>
          <ModalHeader>{messages.integrations.telegramTokenModalTitle}</ModalHeader>
          <ModalBody className="space-y-3">
            <p className="text-sm text-default-500">
              {messages.integrations.telegramTokenModalDescription}
            </p>
            <Input
              autoFocus
              type="password"
              label={messages.integrations.telegramTokenLabel}
              placeholder={messages.integrations.telegramTokenPlaceholder}
              value={telegramBotToken}
              onValueChange={setTelegramBotToken}
              autoComplete="off"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={closeTelegramConnectModal}
              isDisabled={isTelegramConnecting}
            >
              {messages.common.cancel}
            </Button>
            <Button
              color="primary"
              onPress={() => {
                void handleTelegramConnect();
              }}
              isLoading={isTelegramConnecting}
            >
              {messages.integrations.connectButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
