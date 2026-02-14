import { Icon } from "@iconify/react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  clientBaseDetailsRequest,
  clientBaseListRequest,
  type ClientBaseDetails,
  type ClientBaseStatus,
  type ClientBaseStatusFilter,
  type ClientBaseTimelineItem,
} from "../clientBase/clientBaseClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type HistoryState = {
  orders: Array<{
    id: number;
    service_name: string;
    status: string;
    total_price: number;
    currency: string;
    ordered_at: string | null;
    notes: string | null;
  }>;
  appointments: Array<{
    id: number;
    title: string;
    status: string;
    starts_at: string | null;
    timezone: string;
  }>;
  tasks: Array<{
    id: number;
    description: string;
    status: string;
    priority: string;
    created_at: string | null;
  }>;
  questions: Array<{
    id: number;
    description: string;
    status: string;
    created_at: string | null;
  }>;
  timeline: ClientBaseTimelineItem[];
};

function initialsFromName(value: string): string {
  const safe = value.trim();

  if (safe === "") {
    return "?";
  }

  const chunks = safe.split(/\s+/u).filter(Boolean);
  const first = chunks[0]?.[0] ?? "";
  const second = chunks[1]?.[0] ?? "";
  const initials = `${first}${second}`.trim().toUpperCase();

  return initials === "" ? safe.slice(0, 1).toUpperCase() : initials;
}

function formatDateTime(value: string | null, locale: "ru" | "en"): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(
  value: number,
  currency: string,
  locale: "ru" | "en",
): string {
  return (
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value) + ` ${currency}`
  );
}

function timelineIcon(type: string): string {
  switch (type) {
    case "order":
      return "solar:cart-3-linear";
    case "appointment":
      return "solar:calendar-linear";
    case "task":
      return "solar:checklist-minimalistic-linear";
    case "question":
      return "solar:question-circle-linear";
    default:
      return "solar:history-linear";
  }
}

export default function ClientBasePage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ClientBaseStatusFilter>("all");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [clients, setClients] = useState<ReturnType<typeof useMemoClients>>([]);
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    archived: 0,
    blocked: 0,
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<ClientBaseDetails | null>(null);
  const [history, setHistory] = useState<HistoryState>({
    orders: [],
    appointments: [],
    tasks: [],
    questions: [],
    timeline: [],
  });

  usePageSeo({
    title: `${messages.clientBase.title} | ${messages.app.name}`,
    description: messages.clientBase.subtitle,
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

  const loadClients = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientBase.unauthorized);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      const response = await clientBaseListRequest(token, {
        search: search.trim() === "" ? undefined : search.trim(),
        status,
        limit: 120,
      });

      setClients(useMemoClients(response.clients));
      setCounts(response.counts);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientBase.loadFailed,
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    messages.clientBase.loadFailed,
    messages.clientBase.unauthorized,
    search,
    status,
  ]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadClients();
    }, 220);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loadClients]);

  const openHistory = useCallback(
    async (clientId: number) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientBase.unauthorized);
        return;
      }

      setIsHistoryOpen(true);
      setIsLoadingHistory(true);
      setGlobalError(null);

      try {
        const response = await clientBaseDetailsRequest(token, clientId);
        setSelectedClient(response.client);
        setHistory({
          orders: response.history.orders.map((item) => ({
            id: item.id,
            service_name: item.service_name,
            status: item.status,
            total_price: item.total_price,
            currency: item.currency,
            ordered_at: item.ordered_at,
            notes: item.notes,
          })),
          appointments: response.history.appointments.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            starts_at: item.starts_at,
            timezone: item.timezone,
          })),
          tasks: response.history.tasks.map((item) => ({
            id: item.id,
            description: item.description,
            status: item.status,
            priority: item.priority,
            created_at: item.created_at,
          })),
          questions: response.history.questions.map((item) => ({
            id: item.id,
            description: item.description,
            status: item.status,
            created_at: item.created_at,
          })),
          timeline: response.history.timeline,
        });
      } catch (error) {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientBase.detailsFailed,
        );
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [messages.clientBase.detailsFailed, messages.clientBase.unauthorized],
  );

  const statusCounts = useMemo(
    () => ({
      all: counts.all,
      active: counts.active,
      archived: counts.archived,
    }),
    [counts],
  );

  const statusLabel = useCallback(
    (value: ClientBaseStatus): string => {
      switch (value) {
        case "archived":
          return messages.clientBase.statusArchived;
        case "blocked":
          return messages.clientBase.statusBlocked;
        default:
          return messages.clientBase.statusActive;
      }
    },
    [
      messages.clientBase.statusActive,
      messages.clientBase.statusArchived,
      messages.clientBase.statusBlocked,
    ],
  );

  const timelineTypeLabel = useCallback(
    (type: string): string => {
      switch (type) {
        case "order":
          return messages.clientBase.historyTypeOrder;
        case "appointment":
          return messages.clientBase.historyTypeAppointment;
        case "task":
          return messages.clientBase.historyTypeTask;
        case "question":
          return messages.clientBase.historyTypeQuestion;
        default:
          return type;
      }
    },
    [
      messages.clientBase.historyTypeAppointment,
      messages.clientBase.historyTypeOrder,
      messages.clientBase.historyTypeQuestion,
      messages.clientBase.historyTypeTask,
    ],
  );

  return (
    <DashboardLayout
      title={messages.clientBase.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="client-base"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-default-500">
            {messages.clientBase.subtitle}
          </p>
          <Button
            size="sm"
            variant="flat"
            onPress={() => {
              void loadClients();
            }}
          >
            {messages.clientBase.refreshButton}
          </Button>
        </div>

        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.clientBase.errorTitle}
            description={globalError}
          />
        ) : null}

        <Card shadow="none" className="border border-default-200 bg-white">
          <CardBody className="gap-3 sm:flex-row sm:items-center">
            <Input
              value={search}
              onValueChange={setSearch}
              placeholder={messages.clientBase.searchPlaceholder}
              startContent={<Icon icon="solar:magnifer-linear" width={16} />}
            />

            <Tabs
              selectedKey={status}
              onSelectionChange={(key) => {
                setStatus(String(key) as ClientBaseStatusFilter);
              }}
              size="sm"
              radius="full"
              color="primary"
              variant="solid"
              classNames={{
                tabList: "bg-default-100",
              }}
            >
              <Tab
                key="all"
                title={`${messages.clientBase.statusAll} (${statusCounts.all})`}
              />
              <Tab
                key="active"
                title={`${messages.clientBase.statusActive} (${statusCounts.active})`}
              />
              <Tab
                key="archived"
                title={`${messages.clientBase.statusArchived} (${statusCounts.archived})`}
              />
            </Tabs>
          </CardBody>
        </Card>

        {isLoading ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="flex min-h-[240px] items-center justify-center">
              <Spinner label={messages.clientBase.loading} size="sm" />
            </CardBody>
          </Card>
        ) : clients.length === 0 ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="flex min-h-[220px] items-center justify-center text-sm text-default-500">
              {messages.clientBase.empty}
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <Card
                key={client.id}
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-2.5 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={client.avatar ?? undefined}
                      name={client.name}
                      showFallback
                      fallback={
                        <span className="text-xs font-semibold text-default-700">
                          {initialsFromName(client.name)}
                        </span>
                      }
                      className="h-10 w-10 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-foreground">
                        {client.name}
                      </p>
                      <p className="truncate text-sm text-default-500">
                        {client.phone}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          client.status === "blocked"
                            ? "danger"
                            : client.status === "archived"
                            ? "default"
                            : "success"
                        }
                      >
                        {statusLabel(client.status)}
                      </Chip>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        radius="full"
                        aria-label={messages.clientBase.viewHistoryButton}
                        onPress={() => {
                          void openHistory(client.id);
                        }}
                      >
                        <Icon icon="solar:history-linear" width={18} />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-large bg-default-100 px-3 py-2 text-sm">
                    <p className="text-default-500">
                      {messages.clientBase.totalSpent}
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatAmount(
                        client.stats.total_spent,
                        client.stats.currency,
                        locale,
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isHistoryOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsHistoryOpen(false);
            setSelectedClient(null);
            setHistory({
              orders: [],
              appointments: [],
              tasks: [],
              questions: [],
              timeline: [],
            });
          }
        }}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div>
              <p className="text-base font-semibold">
                {messages.clientBase.modalTitle}
              </p>
              <p className="text-sm font-normal text-default-500">
                {messages.clientBase.modalSubtitle}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="pb-5">
            {isLoadingHistory ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <Spinner label={messages.clientBase.modalLoading} size="sm" />
              </div>
            ) : selectedClient ? (
              <div className="space-y-4">
                <Card
                  shadow="none"
                  className="border border-default-200 bg-default-50"
                >
                  <CardBody className="gap-3 sm:flex-row sm:items-center">
                    <Avatar
                      src={selectedClient.avatar ?? undefined}
                      name={selectedClient.name}
                      showFallback
                      fallback={
                        <span className="text-xs font-semibold text-default-700">
                          {initialsFromName(selectedClient.name)}
                        </span>
                      }
                      className="h-12 w-12"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold">
                        {selectedClient.name}
                      </p>
                      <p className="truncate text-sm text-default-600">
                        {messages.clientBase.phoneLabel}: {selectedClient.phone}
                      </p>
                      {selectedClient.email ? (
                        <p className="truncate text-sm text-default-600">
                          {messages.clientBase.emailLabel}:{" "}
                          {selectedClient.email}
                        </p>
                      ) : null}
                      {selectedClient.notes ? (
                        <p className="line-clamp-2 text-sm text-default-500">
                          {messages.clientBase.notesLabel}:{" "}
                          {selectedClient.notes}
                        </p>
                      ) : null}
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        selectedClient.status === "blocked"
                          ? "danger"
                          : selectedClient.status === "archived"
                          ? "default"
                          : "success"
                      }
                    >
                      {messages.clientBase.statusLabel}:{" "}
                      {statusLabel(selectedClient.status)}
                    </Chip>
                  </CardBody>
                </Card>

                <Tabs size="sm" radius="full" variant="bordered">
                  <Tab key="timeline" title={messages.clientBase.timelineTab}>
                    {history.timeline.length === 0 ? (
                      <p className="py-5 text-sm text-default-500">
                        {messages.clientBase.noTimeline}
                      </p>
                    ) : (
                      <ScrollShadow className="max-h-[420px]">
                        <div className="space-y-2 py-1 pr-2">
                          {history.timeline.map((item) => (
                            <Card
                              key={`${item.type}-${item.id}`}
                              shadow="none"
                              className="border border-default-200 bg-white"
                            >
                              <CardBody className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="flex items-center gap-1.5 text-xs text-default-500">
                                      <Icon
                                        icon={timelineIcon(item.type)}
                                        width={14}
                                      />
                                      {timelineTypeLabel(item.type)}
                                    </p>
                                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                                      {item.title}
                                    </p>
                                    {item.description ? (
                                      <p className="line-clamp-2 text-xs text-default-500">
                                        {item.description}
                                      </p>
                                    ) : null}
                                  </div>
                                  <span className="shrink-0 text-xs text-default-500">
                                    {formatDateTime(item.happened_at, locale)}
                                  </span>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </ScrollShadow>
                    )}
                  </Tab>

                  <Tab key="orders" title={messages.clientBase.ordersTab}>
                    {history.orders.length === 0 ? (
                      <p className="py-5 text-sm text-default-500">
                        {messages.clientBase.noOrders}
                      </p>
                    ) : (
                      <ScrollShadow className="max-h-[420px]">
                        <div className="space-y-2 py-1 pr-2">
                          {history.orders.map((item) => (
                            <Card
                              key={item.id}
                              shadow="none"
                              className="border border-default-200 bg-white"
                            >
                              <CardBody className="space-y-1 p-3">
                                <p className="text-sm font-semibold text-foreground">
                                  {messages.clientBase.orderServiceLabel}:{" "}
                                  {item.service_name}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.orderAmountLabel}:{" "}
                                  {formatAmount(
                                    item.total_price,
                                    item.currency,
                                    locale,
                                  )}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.orderStatusLabel}:{" "}
                                  {item.status}
                                </p>
                                <p className="text-xs text-default-500">
                                  {formatDateTime(item.ordered_at, locale)}
                                </p>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </ScrollShadow>
                    )}
                  </Tab>

                  <Tab
                    key="appointments"
                    title={messages.clientBase.appointmentsTab}
                  >
                    {history.appointments.length === 0 ? (
                      <p className="py-5 text-sm text-default-500">
                        {messages.clientBase.noAppointments}
                      </p>
                    ) : (
                      <ScrollShadow className="max-h-[420px]">
                        <div className="space-y-2 py-1 pr-2">
                          {history.appointments.map((item) => (
                            <Card
                              key={item.id}
                              shadow="none"
                              className="border border-default-200 bg-white"
                            >
                              <CardBody className="space-y-1 p-3">
                                <p className="text-sm font-semibold text-foreground">
                                  {item.title}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.appointmentDateLabel}:{" "}
                                  {formatDateTime(item.starts_at, locale)}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.appointmentStatusLabel}:{" "}
                                  {item.status}
                                </p>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </ScrollShadow>
                    )}
                  </Tab>

                  <Tab key="tasks" title={messages.clientBase.tasksTab}>
                    {history.tasks.length === 0 ? (
                      <p className="py-5 text-sm text-default-500">
                        {messages.clientBase.noTasks}
                      </p>
                    ) : (
                      <ScrollShadow className="max-h-[420px]">
                        <div className="space-y-2 py-1 pr-2">
                          {history.tasks.map((item) => (
                            <Card
                              key={item.id}
                              shadow="none"
                              className="border border-default-200 bg-white"
                            >
                              <CardBody className="space-y-1 p-3">
                                <p className="text-sm font-medium text-foreground">
                                  {item.description}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.taskStatusLabel}:{" "}
                                  {item.status}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.taskPriorityLabel}:{" "}
                                  {item.priority}
                                </p>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </ScrollShadow>
                    )}
                  </Tab>

                  <Tab key="questions" title={messages.clientBase.questionsTab}>
                    {history.questions.length === 0 ? (
                      <p className="py-5 text-sm text-default-500">
                        {messages.clientBase.noQuestions}
                      </p>
                    ) : (
                      <ScrollShadow className="max-h-[420px]">
                        <div className="space-y-2 py-1 pr-2">
                          {history.questions.map((item) => (
                            <Card
                              key={item.id}
                              shadow="none"
                              className="border border-default-200 bg-white"
                            >
                              <CardBody className="space-y-1 p-3">
                                <p className="text-sm font-medium text-foreground">
                                  {item.description}
                                </p>
                                <p className="text-xs text-default-600">
                                  {messages.clientBase.questionStatusLabel}:{" "}
                                  {item.status}
                                </p>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </ScrollShadow>
                    )}
                  </Tab>
                </Tabs>
              </div>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}

function useMemoClients(
  clients: Array<{
    id: number;
    name: string;
    phone: string;
    email: string | null;
    notes: string | null;
    status: ClientBaseStatus;
    avatar: string | null;
    stats: {
      orders_count: number;
      appointments_count: number;
      tasks_count: number;
      questions_count: number;
      total_spent: number;
      currency: string;
    };
    activity: {
      last_ordered_at: string | null;
      last_appointment_at: string | null;
      last_task_at: string | null;
      last_question_at: string | null;
      last_contact_at: string | null;
    };
    created_at: string | null;
    updated_at: string | null;
  }>,
): Array<{
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: ClientBaseStatus;
  avatar: string | null;
  stats: {
    orders_count: number;
    appointments_count: number;
    tasks_count: number;
    questions_count: number;
    total_spent: number;
    currency: string;
  };
  activity: {
    last_ordered_at: string | null;
    last_appointment_at: string | null;
    last_task_at: string | null;
    last_question_at: string | null;
    last_contact_at: string | null;
  };
  created_at: string | null;
  updated_at: string | null;
}> {
  return clients.map((client) => ({
    ...client,
    stats: {
      ...client.stats,
      currency:
        client.stats.currency.trim() === "" ? "TJS" : client.stats.currency,
    },
  }));
}
