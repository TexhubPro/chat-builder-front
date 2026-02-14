import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  ScrollShadow,
  Spinner,
  Switch,
  Textarea,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  clientRequestDeleteRequest,
  clientRequestsListRequest,
  clientRequestUpdateRequest,
  type ClientRequestBoard,
  type ClientRequestItem,
  type ClientRequestStatus,
} from "../clientRequests/clientRequestsClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type EditFormState = {
  clientName: string;
  phone: string;
  serviceName: string;
  address: string;
  amount: string;
  note: string;
  status: ClientRequestStatus;
  hasAppointment: boolean;
  appointmentDate: string;
  appointmentTime: string;
  appointmentDurationMinutes: string;
};

function formatAmount(value: number, currency: string, locale: "ru" | "en"): string {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
    + ` ${currency}`;
}

function datePartsInTimeZone(iso: string, timeZone: string): {
  date: string;
  time: string;
} {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "",
      time: "",
    };
  }

  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const dateParts = dateFormatter.formatToParts(date);
  const timeParts = timeFormatter.formatToParts(date);

  const year = dateParts.find((part) => part.type === "year")?.value ?? "";
  const month = dateParts.find((part) => part.type === "month")?.value ?? "";
  const day = dateParts.find((part) => part.type === "day")?.value ?? "";
  const hour = timeParts.find((part) => part.type === "hour")?.value ?? "";
  const minute = timeParts.find((part) => part.type === "minute")?.value ?? "";

  return {
    date: year && month && day ? `${year}-${month}-${day}` : "",
    time: hour && minute ? `${hour}:${minute}` : "",
  };
}

function formatAppointment(iso: string, timeZone: string, locale: "ru" | "en"): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export default function ClientRequestsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [appointmentsEnabled, setAppointmentsEnabled] = useState(false);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [requests, setRequests] = useState<ClientRequestItem[]>([]);
  const [editingRequest, setEditingRequest] = useState<ClientRequestItem | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<ClientRequestItem | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  usePageSeo({
    title: `${messages.clientRequests.title} | ${messages.app.name}`,
    description: messages.clientRequests.subtitle,
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

  const loadRequests = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientRequests.unauthorized);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await clientRequestsListRequest(token);
      setAppointmentsEnabled(response.appointments_enabled);
      setDeliveryEnabled(response.delivery_enabled);
      setRequests(response.requests);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientRequests.updateFailed,
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages.clientRequests.unauthorized, messages.clientRequests.updateFailed]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const boardItems = useMemo(() => {
    const columns: Array<{ key: ClientRequestBoard; label: string }> = [
      {
        key: "new",
        label: messages.clientRequests.columnNew,
      },
      {
        key: "in_progress",
        label: messages.clientRequests.columnInProgress,
      },
    ];

    if (appointmentsEnabled) {
      columns.push({
        key: "appointments",
        label: messages.clientRequests.columnAppointments,
      });
    }

    columns.push({
      key: "completed",
      label: messages.clientRequests.columnCompleted,
    });

    return columns;
  }, [
    appointmentsEnabled,
    messages.clientRequests.columnAppointments,
    messages.clientRequests.columnCompleted,
    messages.clientRequests.columnInProgress,
    messages.clientRequests.columnNew,
  ]);

  const groupedRequests = useMemo(() => {
    const map = new Map<ClientRequestBoard, ClientRequestItem[]>();

    boardItems.forEach((item) => {
      map.set(item.key, []);
    });

    requests.forEach((item) => {
      const list = map.get(item.board);
      if (list) {
        list.push(item);
      }
    });

    return map;
  }, [boardItems, requests]);

  const statusOptions = useMemo(
    () => {
      if (deliveryEnabled) {
        return [
          { key: "new" as ClientRequestStatus, label: messages.clientRequests.statusNew },
          { key: "confirmed" as ClientRequestStatus, label: messages.clientRequests.statusConfirmed },
          { key: "handed_to_courier" as ClientRequestStatus, label: messages.clientRequests.statusHandedToCourier },
          { key: "delivered" as ClientRequestStatus, label: messages.clientRequests.statusDelivered },
          { key: "canceled" as ClientRequestStatus, label: messages.clientRequests.statusCanceled },
        ];
      }

      const options: Array<{ key: ClientRequestStatus; label: string }> = [
        { key: "new", label: messages.clientRequests.statusNew },
        { key: "in_progress", label: messages.clientRequests.statusInProgress },
      ];

      if (appointmentsEnabled) {
        options.push({
          key: "appointments",
          label: messages.clientRequests.statusAppointments,
        });
      }

      options.push({
        key: "completed",
        label: messages.clientRequests.statusCompleted,
      });

      return options;
    },
    [
      appointmentsEnabled,
      deliveryEnabled,
      messages.clientRequests.statusAppointments,
      messages.clientRequests.statusCanceled,
      messages.clientRequests.statusCompleted,
      messages.clientRequests.statusConfirmed,
      messages.clientRequests.statusDelivered,
      messages.clientRequests.statusHandedToCourier,
      messages.clientRequests.statusInProgress,
      messages.clientRequests.statusNew,
    ],
  );

  const upsertRequest = useCallback((next: ClientRequestItem) => {
    setRequests((previous) =>
      previous.map((item) => (item.id === next.id ? next : item)),
    );
  }, []);

  const openEditModal = useCallback((item: ClientRequestItem) => {
    setEditingRequest(item);
    const hasAppointment = Boolean(item.appointment);
    const appointmentParts = hasAppointment && item.appointment
      ? datePartsInTimeZone(item.appointment.starts_at, item.appointment.timezone)
      : { date: "", time: "" };

    setEditForm({
      clientName: item.client.name,
      phone: item.client.phone,
      serviceName: item.service_name,
      address: item.address,
      amount: item.amount > 0 ? String(item.amount) : "",
      note: item.note,
      status: item.status,
      hasAppointment,
      appointmentDate: appointmentParts.date,
      appointmentTime: appointmentParts.time,
      appointmentDurationMinutes: item.appointment?.duration_minutes
        ? String(item.appointment.duration_minutes)
        : "",
    });
    setGlobalError(null);
  }, []);

  const closeEditModal = () => {
    if (isSaving) {
      return;
    }

    setEditingRequest(null);
    setEditForm(null);
  };

  const saveEditModal = async () => {
    if (!editingRequest || !editForm || isSaving) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientRequests.unauthorized);
      return;
    }

    const clientName = editForm.clientName.trim();
    const phone = editForm.phone.trim();
    const serviceName = editForm.serviceName.trim();
    const address = editForm.address.trim();
    const amountRaw = editForm.amount.trim();
    const note = editForm.note.trim();

    if (clientName === "" || phone === "" || serviceName === "") {
      setGlobalError(messages.clientRequests.requiredFields);
      return;
    }

    let amount: number | undefined;
    if (amountRaw !== "") {
      const parsed = Number(amountRaw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setGlobalError(messages.clientRequests.invalidAmount);
        return;
      }
      amount = parsed;
    }

    const payload: Parameters<typeof clientRequestUpdateRequest>[2] = {
      status: editForm.status,
      client_name: clientName,
      phone,
      service_name: serviceName,
      address: address === "" ? undefined : address,
      amount,
      note: note === "" ? undefined : note,
    };

    const hadAppointment = Boolean(editingRequest.appointment);

    if (appointmentsEnabled) {
      if (editForm.hasAppointment) {
        const appointmentDate = editForm.appointmentDate.trim();
        const appointmentTime = editForm.appointmentTime.trim();
        const appointmentDurationRaw = editForm.appointmentDurationMinutes.trim();

        if (
          appointmentDate === ""
          || appointmentTime === ""
          || appointmentDurationRaw === ""
        ) {
          setGlobalError(messages.clientRequests.appointmentRequired);
          return;
        }

        const duration = Number(appointmentDurationRaw);
        if (!Number.isFinite(duration) || duration < 15 || duration > 720) {
          setGlobalError(messages.clientRequests.invalidDuration);
          return;
        }

        payload.book_appointment = true;
        payload.appointment_date = appointmentDate;
        payload.appointment_time = appointmentTime;
        payload.appointment_duration_minutes = Math.round(duration);
      } else if (hadAppointment) {
        payload.clear_appointment = true;
      }
    }

    setGlobalError(null);
    setIsSaving(true);

    try {
      const response = await clientRequestUpdateRequest(
        token,
        editingRequest.id,
        payload,
      );
      upsertRequest(response.request);
      setGlobalSuccess(messages.clientRequests.updateSuccess);
      setEditingRequest(null);
      setEditForm(null);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientRequests.updateFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const moveRequestStatus = useCallback(
    async (item: ClientRequestItem, status: ClientRequestStatus) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientRequests.unauthorized);
        return;
      }

      setGlobalError(null);

      try {
        const response = await clientRequestUpdateRequest(token, item.id, {
          status,
        });

        upsertRequest(response.request);
      } catch (error) {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientRequests.updateFailed,
        );
      }
    },
    [
      messages.clientRequests.unauthorized,
      messages.clientRequests.updateFailed,
      upsertRequest,
    ],
  );

  const archiveRequest = useCallback(
    async (item: ClientRequestItem) => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientRequests.unauthorized);
        return;
      }

      setGlobalError(null);

      try {
        await clientRequestUpdateRequest(token, item.id, {
          archived: true,
        });

        setRequests((previous) => previous.filter((request) => request.id !== item.id));
        setGlobalSuccess(messages.clientRequests.updateSuccess);
      } catch (error) {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientRequests.updateFailed,
        );
      }
    },
    [messages.clientRequests.unauthorized, messages.clientRequests.updateFailed, messages.clientRequests.updateSuccess],
  );

  const handleDelete = async () => {
    if (!deletingRequest || isDeleting) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientRequests.unauthorized);
      return;
    }

    setGlobalError(null);
    setIsDeleting(true);

    try {
      await clientRequestDeleteRequest(token, deletingRequest.id);
      setRequests((previous) =>
        previous.filter((item) => item.id !== deletingRequest.id),
      );
      setGlobalSuccess(messages.clientRequests.deleteSuccess);
      setDeletingRequest(null);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientRequests.deleteFailed,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const statusChipLabel = useCallback(
    (status: ClientRequestStatus): string => {
      switch (status) {
        case "confirmed":
          return messages.clientRequests.statusConfirmed;
        case "canceled":
          return messages.clientRequests.statusCanceled;
        case "handed_to_courier":
          return messages.clientRequests.statusHandedToCourier;
        case "delivered":
          return messages.clientRequests.statusDelivered;
        case "appointments":
          return messages.clientRequests.statusAppointments;
        case "in_progress":
          return messages.clientRequests.statusInProgress;
        case "completed":
          return messages.clientRequests.statusCompleted;
        default:
          return messages.clientRequests.statusNew;
      }
    },
    [
      messages.clientRequests.statusAppointments,
      messages.clientRequests.statusCanceled,
      messages.clientRequests.statusCompleted,
      messages.clientRequests.statusConfirmed,
      messages.clientRequests.statusDelivered,
      messages.clientRequests.statusHandedToCourier,
      messages.clientRequests.statusInProgress,
      messages.clientRequests.statusNew,
    ],
  );

  const channelLabel = useCallback(
    (channel: string | null): string => {
      if (!channel) {
        return "-";
      }

      switch (channel) {
        case "instagram":
          return "Instagram";
        case "telegram":
          return "Telegram";
        case "widget":
          return locale === "ru" ? "Веб виджет" : "Web widget";
        case "api":
          return "API";
        case "assistant":
          return locale === "ru" ? "Ассистент" : "Assistant";
        default:
          return channel;
      }
    },
    [locale],
  );

  return (
    <DashboardLayout
      title={messages.clientRequests.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="client-requests"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-default-500">{messages.clientRequests.subtitle}</p>
          <Button
            variant="flat"
            size="sm"
            onPress={() => {
              void loadRequests();
            }}
          >
            {messages.clientRequests.refreshButton}
          </Button>
        </div>

        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.clientRequests.errorTitle}
            description={globalError}
          />
        ) : null}
        {globalSuccess ? (
          <Alert
            color="success"
            variant="faded"
            title={messages.clientRequests.successTitle}
            description={globalSuccess}
            onClose={() => setGlobalSuccess(null)}
          />
        ) : null}

        {isLoading ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="flex min-h-[240px] items-center justify-center">
              <Spinner label={messages.clientRequests.loading} size="sm" />
            </CardBody>
          </Card>
        ) : requests.length === 0 ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="min-h-[200px]">
              <div className="flex h-full items-center justify-center text-sm text-default-500">
                {messages.clientRequests.empty}
              </div>
            </CardBody>
          </Card>
        ) : (
          <div
            className={`grid gap-4 ${
              boardItems.length === 4
                ? "xl:grid-cols-4 md:grid-cols-2"
                : "xl:grid-cols-3 md:grid-cols-2"
            }`}
          >
            {boardItems.map((column) => {
              const items = groupedRequests.get(column.key) ?? [];

              return (
                <Card key={column.key} shadow="none" className="border border-default-200 bg-white">
                  <CardBody className="p-0">
                    <div className="border-b border-default-200 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {column.label}
                        </p>
                        <Chip size="sm" variant="flat">
                          {items.length}
                        </Chip>
                      </div>
                    </div>

                    <ScrollShadow className="max-h-[calc(100vh-290px)] p-3">
                      <div className="space-y-3">
                        {items.map((item) => {
                          const hasAppointment = Boolean(item.appointment);
                          const isAppointmentsBoard = item.board === "appointments";
                          const isDeliveryFlow = deliveryEnabled && !hasAppointment;
                          const visualStatus: ClientRequestStatus =
                            isAppointmentsBoard && item.status !== "completed"
                              ? "appointments"
                              : item.status;
                          const appointmentText = hasAppointment && item.appointment
                            ? formatAppointment(
                                item.appointment.starts_at,
                                item.appointment.timezone,
                                locale,
                              )
                            : "";

                          const nextStatus: ClientRequestStatus | null =
                            isDeliveryFlow
                              ? item.status === "new"
                                ? "confirmed"
                                : item.status === "confirmed" || item.status === "in_progress"
                                  ? "handed_to_courier"
                                  : item.status === "handed_to_courier"
                                    ? "delivered"
                                    : null
                              : item.status === "completed"
                                ? null
                                : isAppointmentsBoard
                                  ? "completed"
                                  : item.status === "new"
                                    ? "in_progress"
                                    : item.status === "in_progress"
                                      ? (appointmentsEnabled && hasAppointment ? "appointments" : "completed")
                                      : item.status === "appointments"
                                        ? "completed"
                                        : null;

                          const canCancelDelivery =
                            isDeliveryFlow
                            && !["canceled", "delivered", "completed"].includes(item.status);

                          const nextStatusButtonLabel =
                            isDeliveryFlow
                              ? item.status === "new"
                                ? messages.clientRequests.moveToConfirmedButton
                                : item.status === "confirmed" || item.status === "in_progress"
                                  ? messages.clientRequests.moveToCourierButton
                                  : item.status === "handed_to_courier"
                                    ? messages.clientRequests.moveToDeliveredButton
                                    : messages.clientRequests.reopenButton
                              : isAppointmentsBoard && item.status !== "completed"
                                ? messages.clientRequests.moveToCompletedButton
                                : item.status === "new"
                                  ? messages.clientRequests.moveToProgressButton
                                  : item.status === "in_progress"
                                    ? (appointmentsEnabled && hasAppointment
                                      ? messages.clientRequests.moveToAppointmentsButton
                                      : messages.clientRequests.moveToCompletedButton)
                                    : item.status === "appointments"
                                      ? messages.clientRequests.moveToCompletedButton
                                      : messages.clientRequests.reopenButton;

                          return (
                            <Card
                              key={item.id}
                              shadow="none"
                              className="border border-default-200 bg-default-50"
                            >
                              <CardBody className="space-y-3 p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                      {item.client.name}
                                    </p>
                                    <p className="truncate text-xs text-default-500">
                                      {messages.clientRequests.serviceLabel}: {item.service_name}
                                    </p>
                                  </div>

                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color={
                                      visualStatus === "completed" || visualStatus === "delivered"
                                        ? "success"
                                        : visualStatus === "canceled"
                                          ? "danger"
                                        : visualStatus === "appointments"
                                          ? "warning"
                                        : visualStatus === "in_progress"
                                          || visualStatus === "confirmed"
                                          || visualStatus === "handed_to_courier"
                                          ? "primary"
                                          : "default"
                                    }
                                  >
                                    {statusChipLabel(visualStatus)}
                                  </Chip>
                                </div>

                                <div className="space-y-1 text-xs text-default-600">
                                  <p className="flex items-center gap-1.5">
                                    <Icon icon="solar:phone-linear" width={14} />
                                    <span>{item.client.phone || messages.clientRequests.noPhone}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Icon icon="solar:map-point-linear" width={14} />
                                    <span className="truncate">
                                      {item.address || messages.clientRequests.noAddress}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Icon icon="solar:money-bag-linear" width={14} />
                                    <span>
                                      {messages.clientRequests.amountLabel}:{" "}
                                      {formatAmount(item.amount, item.currency, locale)}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Icon icon="solar:chat-round-line-outline" width={14} />
                                    <span>
                                      {messages.clientRequests.chatChannelLabel}:{" "}
                                      {channelLabel(item.source_channel)}
                                    </span>
                                  </p>
                                </div>

                                {hasAppointment ? (
                                  <div className="rounded-large bg-success-50 px-2.5 py-2 text-xs text-success-700">
                                    <span className="inline-flex items-center gap-1.5 font-medium">
                                      <Icon icon="solar:calendar-linear" width={14} />
                                      {messages.clientRequests.appointmentLabel}: {appointmentText}
                                    </span>
                                  </div>
                                ) : null}

                                {item.note.trim() !== "" ? (
                                  <p className="line-clamp-3 text-xs text-default-600">
                                    {messages.clientRequests.noteLabel}: {item.note}
                                  </p>
                                ) : null}

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    className="flex-1"
                                    onPress={() => {
                                      if (item.source_chat_id) {
                                        navigate("/client-chats");
                                      }
                                    }}
                                    isDisabled={!item.source_chat_id}
                                  >
                                    {messages.clientRequests.openChatButton}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    isIconOnly
                                    onPress={() => openEditModal(item)}
                                  >
                                    <Icon icon="solar:pen-linear" width={18} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="danger"
                                    isIconOnly
                                    onPress={() => setDeletingRequest(item)}
                                  >
                                    <Icon icon="solar:trash-bin-trash-linear" width={18} />
                                  </Button>
                                </div>

                                {["completed", "delivered", "canceled"].includes(item.status) ? (
                                  <Button
                                    size="sm"
                                    color="warning"
                                    variant="flat"
                                    onPress={() => {
                                      void archiveRequest(item);
                                    }}
                                  >
                                    {messages.clientRequests.archiveButton}
                                  </Button>
                                ) : (
                                  <div className="space-y-2">
                                    {nextStatus ? (
                                      <Button
                                        size="sm"
                                        color={nextStatus === "completed" || nextStatus === "delivered" ? "success" : "primary"}
                                        className="w-full"
                                        onPress={() => {
                                          void moveRequestStatus(item, nextStatus);
                                        }}
                                      >
                                        {nextStatusButtonLabel}
                                      </Button>
                                    ) : null}

                                    {canCancelDelivery ? (
                                      <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        onPress={() => {
                                          void moveRequestStatus(item, "canceled");
                                        }}
                                      >
                                        {messages.clientRequests.markCanceledButton}
                                      </Button>
                                    ) : null}
                                  </div>
                                )}

                              </CardBody>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollShadow>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={Boolean(editingRequest && editForm)} onOpenChange={closeEditModal} size="2xl">
        <ModalContent>
          <ModalHeader>{messages.clientRequests.editModalTitle}</ModalHeader>
          <ModalBody className="space-y-3">
            {editForm ? (
              <>
                <Input
                  label={messages.clientRequests.editClientNameLabel}
                  value={editForm.clientName}
                  onValueChange={(value) => {
                    setEditForm((previous) =>
                      previous
                        ? {
                            ...previous,
                            clientName: value,
                          }
                        : previous,
                    );
                  }}
                  variant="bordered"
                />
                <Select
                  label={messages.clientRequests.editStatusLabel}
                  selectedKeys={[editForm.status]}
                  onSelectionChange={(keys) => {
                    const value = String(Array.from(keys)[0] ?? "new") as ClientRequestStatus;
                    setEditForm((previous) =>
                      previous
                        ? {
                            ...previous,
                            status: value,
                          }
                        : previous,
                    );
                  }}
                  variant="bordered"
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label={messages.clientRequests.editPhoneLabel}
                    value={editForm.phone}
                    onValueChange={(value) => {
                      setEditForm((previous) =>
                        previous
                          ? {
                              ...previous,
                              phone: value,
                            }
                          : previous,
                      );
                    }}
                    variant="bordered"
                  />
                  <Input
                    label={messages.clientRequests.editServiceLabel}
                    value={editForm.serviceName}
                    onValueChange={(value) => {
                      setEditForm((previous) =>
                        previous
                          ? {
                              ...previous,
                              serviceName: value,
                            }
                          : previous,
                      );
                    }}
                    variant="bordered"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label={messages.clientRequests.editAddressLabel}
                    value={editForm.address}
                    onValueChange={(value) => {
                      setEditForm((previous) =>
                        previous
                          ? {
                              ...previous,
                              address: value,
                            }
                          : previous,
                      );
                    }}
                    variant="bordered"
                  />
                  <Input
                    label={messages.clientRequests.editAmountLabel}
                    value={editForm.amount}
                    inputMode="decimal"
                    onValueChange={(value) => {
                      setEditForm((previous) =>
                        previous
                          ? {
                              ...previous,
                              amount: value,
                            }
                          : previous,
                      );
                    }}
                    variant="bordered"
                  />
                </div>
                {appointmentsEnabled ? (
                  <div className="space-y-3 rounded-large border border-default-200 px-3 py-3">
                    <Switch
                      isSelected={editForm.hasAppointment}
                      onValueChange={(value) => {
                        setEditForm((previous) =>
                          previous
                            ? {
                                ...previous,
                                hasAppointment: value,
                              }
                            : previous,
                        );
                      }}
                      size="sm"
                    >
                      {messages.clientRequests.editBookingSwitch}
                    </Switch>

                    {editForm.hasAppointment ? (
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Input
                          type="date"
                          label={messages.clientRequests.editAppointmentDateLabel}
                          value={editForm.appointmentDate}
                          onValueChange={(value) => {
                            setEditForm((previous) =>
                              previous
                                ? {
                                    ...previous,
                                    appointmentDate: value,
                                  }
                                : previous,
                            );
                          }}
                          variant="bordered"
                        />
                        <Input
                          type="time"
                          label={messages.clientRequests.editAppointmentTimeLabel}
                          value={editForm.appointmentTime}
                          onValueChange={(value) => {
                            setEditForm((previous) =>
                              previous
                                ? {
                                    ...previous,
                                    appointmentTime: value,
                                  }
                                : previous,
                            );
                          }}
                          variant="bordered"
                        />
                        <Input
                          type="number"
                          label={messages.clientRequests.editAppointmentDurationLabel}
                          placeholder={
                            messages.clientRequests.editAppointmentDurationPlaceholder
                          }
                          value={editForm.appointmentDurationMinutes}
                          onValueChange={(value) => {
                            setEditForm((previous) =>
                              previous
                                ? {
                                    ...previous,
                                    appointmentDurationMinutes: value,
                                  }
                                : previous,
                            );
                          }}
                          variant="bordered"
                          min={15}
                          max={720}
                          step={5}
                          inputMode="numeric"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <Textarea
                  label={messages.clientRequests.editNoteLabel}
                  value={editForm.note}
                  onValueChange={(value) => {
                    setEditForm((previous) =>
                      previous
                        ? {
                            ...previous,
                            note: value,
                          }
                        : previous,
                    );
                  }}
                  variant="bordered"
                  minRows={3}
                />
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeEditModal}>
              {messages.clientRequests.editModalCancel}
            </Button>
            <Button color="primary" isLoading={isSaving} onPress={() => void saveEditModal()}>
              {messages.clientRequests.editModalSave}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={Boolean(deletingRequest)} onOpenChange={() => setDeletingRequest(null)}>
        <ModalContent>
          <ModalHeader>{messages.clientRequests.deleteButton}</ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600">
              {deletingRequest?.client.name}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setDeletingRequest(null)}>
              {messages.clientRequests.editModalCancel}
            </Button>
            <Button color="danger" isLoading={isDeleting} onPress={() => void handleDelete()}>
              {messages.clientRequests.deleteButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
