import { Icon } from "@iconify/react";
import {
  Alert,
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
  ScrollShadow,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  calendarEventCreateRequest,
  calendarEventDeleteRequest,
  calendarEventsListRequest,
  calendarEventUpdateRequest,
  type CalendarAssistant,
  type CalendarDaySchedule,
  type CalendarEventItem,
  type CalendarEventStatus,
  type CalendarService,
  type CalendarWeekDay,
} from "../calendar/calendarClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type EventFormState = {
  title: string;
  description: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  time: string;
  durationMinutes: string;
  status: CalendarEventStatus;
  assistantId: string;
  serviceId: string;
  location: string;
  meetingLink: string;
};

type CalendarCell = {
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

const STATUS_OPTIONS: CalendarEventStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "canceled",
  "no_show",
];

const WEEK_DAY_KEYS: CalendarWeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function todayDateInput(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function monthBounds(dateKey: string): { from: string; to: string } {
  const [yearRaw, monthRaw] = dateKey.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const month = Number.parseInt(monthRaw ?? "", 10);

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    const today = todayDateInput();
    const monthKey = today.slice(0, 7);
    return monthBounds(monthKey);
  }

  const firstDay = `${year}-${pad(month)}-01`;
  const lastDayDate = new Date(year, month, 0);
  const lastDay = `${year}-${pad(month)}-${pad(lastDayDate.getDate())}`;

  return {
    from: firstDay,
    to: lastDay,
  };
}

function formatDayNumber(day: number): string {
  return String(day);
}

function parseTimeToMinutes(value: string): number | null {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatMinutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${pad(hours)}:${pad(minutes)}`;
}

function dateKeyFromIsoInTimezone(iso: string | null, timeZone: string): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function timeKeyFromIsoInTimezone(iso: string | null, timeZone: string): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";

  return hour && minute ? `${hour}:${minute}` : "";
}

function weekdayFromDate(dateKey: string, timeZone: string): CalendarWeekDay {
  const date = new Date(`${dateKey}T12:00:00`);
  const dayName = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone,
  }).format(date).toLowerCase();

  if (WEEK_DAY_KEYS.includes(dayName as CalendarWeekDay)) {
    return dayName as CalendarWeekDay;
  }

  return "monday";
}

function displayDateTime(
  iso: string | null,
  timeZone: string,
  locale: "ru" | "en",
): string {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    timeZone,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function initialsFromName(name: string): string {
  const safe = name.trim();

  if (safe === "") {
    return "?";
  }

  const parts = safe.split(/\s+/u).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";

  return `${first}${second}`.trim().toUpperCase() || safe.slice(0, 1).toUpperCase();
}

function statusColor(status: CalendarEventStatus): "primary" | "success" | "danger" | "warning" | "default" {
  switch (status) {
    case "confirmed":
      return "primary";
    case "completed":
      return "success";
    case "canceled":
    case "no_show":
      return "danger";
    case "scheduled":
      return "warning";
    default:
      return "default";
  }
}

function buildCalendarCells(monthKey: string): CalendarCell[] {
  const [yearRaw, monthRaw] = monthKey.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const monthIndex = Number.parseInt(monthRaw ?? "", 10) - 1;

  if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) {
    return [];
  }

  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const previousMonthLastDay = new Date(year, monthIndex, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - startOffset + 1;

    if (dayOffset < 1) {
      const previousDay = previousMonthLastDay + dayOffset;
      const date = new Date(year, monthIndex - 1, previousDay);
      cells.push({
        dateKey: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(previousDay)}`,
        dayNumber: previousDay,
        isCurrentMonth: false,
      });
      continue;
    }

    if (dayOffset > daysInMonth) {
      const nextDay = dayOffset - daysInMonth;
      const date = new Date(year, monthIndex + 1, nextDay);
      cells.push({
        dateKey: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(nextDay)}`,
        dayNumber: nextDay,
        isCurrentMonth: false,
      });
      continue;
    }

    cells.push({
      dateKey: `${year}-${pad(monthIndex + 1)}-${pad(dayOffset)}`,
      dayNumber: dayOffset,
      isCurrentMonth: true,
    });
  }

  return cells;
}

function monthTitle(monthKey: string, locale: "ru" | "en", timeZone: string): string {
  const [yearRaw, monthRaw] = monthKey.split("-");
  const year = Number.parseInt(yearRaw ?? "", 10);
  const month = Number.parseInt(monthRaw ?? "", 10);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return monthKey;
  }

  const date = new Date(`${monthKey}-01T12:00:00`);

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    timeZone,
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateLabel(dateKey: string, locale: "ru" | "en", timeZone: string): string {
  const date = new Date(`${dateKey}T12:00:00`);

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function emptyForm(
  defaults: {
    date: string;
    time: string;
    slotMinutes: number;
  },
): EventFormState {
  return {
    title: "",
    description: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    date: defaults.date,
    time: defaults.time,
    durationMinutes: String(defaults.slotMinutes),
    status: "scheduled",
    assistantId: "none",
    serviceId: "none",
    location: "",
    meetingLink: "",
  };
}

function sortEventsByStart(events: CalendarEventItem[]): CalendarEventItem[] {
  return [...events].sort((left, right) => {
    const leftTime = left.starts_at ? new Date(left.starts_at).getTime() : 0;
    const rightTime = right.starts_at ? new Date(right.starts_at).getTime() : 0;

    return leftTime - rightTime;
  });
}

export default function CalendarPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const eventModal = useDisclosure();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingEventId, setIsDeletingEventId] = useState<number | null>(null);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [assistants, setAssistants] = useState<CalendarAssistant[]>([]);
  const [services, setServices] = useState<CalendarService[]>([]);
  const [appointmentsEnabled, setAppointmentsEnabled] = useState(true);
  const [calendarTimezone, setCalendarTimezone] = useState("UTC");
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [businessSchedule, setBusinessSchedule] = useState<
    Record<CalendarWeekDay, CalendarDaySchedule>
  >({
    monday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    tuesday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    wednesday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    thursday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    friday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    saturday: { is_day_off: true, start_time: null, end_time: null },
    sunday: { is_day_off: true, start_time: null, end_time: null },
  });

  const [selectedDate, setSelectedDate] = useState(todayDateInput());
  const [assistantFilterId, setAssistantFilterId] = useState<string>("all");

  const [editingEvent, setEditingEvent] = useState<CalendarEventItem | null>(null);
  const [viewingEvent, setViewingEvent] = useState<CalendarEventItem | null>(null);
  const [formState, setFormState] = useState<EventFormState>(
    emptyForm({
      date: todayDateInput(),
      time: "09:00",
      slotMinutes: 30,
    }),
  );

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  usePageSeo({
    title: `${messages.calendar.title} | ${messages.app.name}`,
    description: messages.calendar.subtitle,
    locale,
  });

  const selectedMonth = selectedDate.slice(0, 7);

  const loadEvents = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.calendar.unauthorized);
      setIsLoading(false);
      return;
    }

    const bounds = monthBounds(selectedMonth);
    const parsedAssistantFilter = Number.parseInt(assistantFilterId, 10);
    const assistantId = Number.isFinite(parsedAssistantFilter)
      ? parsedAssistantFilter
      : undefined;

    setIsLoading(true);
    setGlobalError(null);

    try {
      const response = await calendarEventsListRequest(token, {
        from: bounds.from,
        to: bounds.to,
        assistant_id: assistantId,
      });

      setEvents(sortEventsByStart(response.events));
      setAssistants(response.assistants);
      setServices(response.services);
      setAppointmentsEnabled(response.appointments_enabled);
      setCalendarTimezone(response.timezone);
      setSlotMinutes(response.slot_minutes);
      setBusinessSchedule(response.business_schedule);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.calendar.loadFailed,
      );
    } finally {
      setIsLoading(false);
    }
  }, [assistantFilterId, messages.calendar.loadFailed, messages.calendar.unauthorized, selectedMonth]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const monthCells = useMemo(
    () => buildCalendarCells(selectedMonth),
    [selectedMonth],
  );

  const eventsCountByDate = useMemo(() => {
    const map = new Map<string, number>();

    events.forEach((event) => {
      const key = dateKeyFromIsoInTimezone(event.starts_at, calendarTimezone);

      if (!key) {
        return;
      }

      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return map;
  }, [calendarTimezone, events]);

  const selectedDateEvents = useMemo(() => {
    return sortEventsByStart(
      events.filter(
        (event) => dateKeyFromIsoInTimezone(event.starts_at, calendarTimezone) === selectedDate,
      ),
    );
  }, [calendarTimezone, events, selectedDate]);

  const selectedDaySchedule = useMemo(() => {
    const dayKey = weekdayFromDate(selectedDate, calendarTimezone);
    return businessSchedule[dayKey] ?? {
      is_day_off: true,
      start_time: null,
      end_time: null,
    };
  }, [businessSchedule, calendarTimezone, selectedDate]);

  const selectedAssistantId = useMemo(() => {
    const parsed = Number.parseInt(formState.assistantId, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }, [formState.assistantId]);

  const serviceOptions = useMemo(() => {
    if (!selectedAssistantId) {
      return services;
    }

    return services.filter((service) => {
      if (service.assistant_id === null) {
        return true;
      }

      return service.assistant_id === selectedAssistantId;
    });
  }, [selectedAssistantId, services]);

  useEffect(() => {
    const parsed = Number.parseInt(formState.serviceId, 10);

    if (!Number.isFinite(parsed)) {
      return;
    }

    if (serviceOptions.some((service) => service.id === parsed)) {
      return;
    }

    setFormState((previous) => ({
      ...previous,
      serviceId: "none",
    }));
  }, [formState.serviceId, serviceOptions]);

  const busyRanges = useMemo(() => {
    return selectedDateEvents
      .filter((event) => event.status === "scheduled" || event.status === "confirmed")
      .map((event) => {
        const start = parseTimeToMinutes(timeKeyFromIsoInTimezone(event.starts_at, calendarTimezone));
        const endFromIso = parseTimeToMinutes(timeKeyFromIsoInTimezone(event.ends_at, calendarTimezone));
        const eventDuration = event.duration_minutes ?? slotMinutes;

        if (start === null) {
          return null;
        }

        return {
          start,
          end: endFromIso ?? start + eventDuration,
          eventId: event.id,
        };
      })
      .filter((item): item is { start: number; end: number; eventId: number } => item !== null);
  }, [calendarTimezone, selectedDateEvents, slotMinutes]);

  const slotOptions = useMemo(() => {
    if (selectedDaySchedule.is_day_off) {
      return [];
    }

    const startMinutes = parseTimeToMinutes(selectedDaySchedule.start_time ?? "");
    const endMinutes = parseTimeToMinutes(selectedDaySchedule.end_time ?? "");

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      return [];
    }

    const options: Array<{ time: string; disabled: boolean }> = [];
    for (let cursor = startMinutes; cursor + slotMinutes <= endMinutes; cursor += slotMinutes) {
      const slotEnd = cursor + slotMinutes;
      const hasConflict = busyRanges.some((busy) => busy.start < slotEnd && busy.end > cursor);

      options.push({
        time: formatMinutesToTime(cursor),
        disabled: hasConflict,
      });
    }

    return options;
  }, [busyRanges, selectedDaySchedule, slotMinutes]);

  const openCreateModal = useCallback((prefilledTime?: string) => {
    setEditingEvent(null);
    setGlobalError(null);
    setFormState(
      emptyForm({
        date: selectedDate,
        time: prefilledTime ?? "09:00",
        slotMinutes,
      }),
    );
    eventModal.onOpen();
  }, [eventModal, selectedDate, slotMinutes]);

  const openEditModal = useCallback((event: CalendarEventItem) => {
    const startsDate = dateKeyFromIsoInTimezone(event.starts_at, event.timezone || calendarTimezone) || selectedDate;
    const startsTime = timeKeyFromIsoInTimezone(event.starts_at, event.timezone || calendarTimezone) || "09:00";

    setEditingEvent(event);
    setGlobalError(null);
    setFormState({
      title: event.title,
      description: event.description ?? "",
      clientName: event.client?.name ?? "",
      clientPhone: event.client?.phone ?? "",
      clientEmail: event.client?.email ?? "",
      date: startsDate,
      time: startsTime,
      durationMinutes: String(event.duration_minutes ?? slotMinutes),
      status: event.status,
      assistantId: event.assistant?.id ? String(event.assistant.id) : "none",
      serviceId: event.service?.id ? String(event.service.id) : "none",
      location: event.location ?? "",
      meetingLink: event.meeting_link ?? "",
    });

    eventModal.onOpen();
  }, [calendarTimezone, eventModal, selectedDate, slotMinutes]);

  const openDetailsModal = useCallback((event: CalendarEventItem) => {
    setViewingEvent(event);
    setIsEventDetailsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isSaving) {
      return;
    }

    eventModal.onClose();
    setEditingEvent(null);
  }, [eventModal, isSaving]);

  const saveEvent = async () => {
    if (isSaving) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.calendar.unauthorized);
      return;
    }

    const title = formState.title.trim();
    const clientName = formState.clientName.trim();
    const clientPhone = formState.clientPhone.trim();
    const duration = Number.parseInt(formState.durationMinutes, 10);

    if (
      title.length < 2
      || clientName.length < 2
      || clientPhone === ""
      || formState.date === ""
      || formState.time === ""
      || !Number.isFinite(duration)
      || duration < 15
      || duration > 720
    ) {
      setGlobalError(messages.calendar.requiredFields);
      return;
    }

    if (formState.meetingLink.trim() !== "") {
      try {
        const link = new URL(formState.meetingLink.trim());

        if (link.protocol !== "http:" && link.protocol !== "https:") {
          setGlobalError(messages.calendar.invalidMeetingLink);
          return;
        }
      } catch {
        setGlobalError(messages.calendar.invalidMeetingLink);
        return;
      }
    }

    const assistantIdParsed = Number.parseInt(formState.assistantId, 10);
    const serviceIdParsed = Number.parseInt(formState.serviceId, 10);

    setIsSaving(true);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title,
        description: formState.description.trim() === "" ? undefined : formState.description.trim(),
        date: formState.date,
        time: formState.time,
        duration_minutes: duration,
        timezone: calendarTimezone,
        status: formState.status,
        location: formState.location.trim() === "" ? undefined : formState.location.trim(),
        meeting_link: formState.meetingLink.trim() === "" ? undefined : formState.meetingLink.trim(),
        assistant_id: formState.assistantId === "none"
          ? null
          : (Number.isFinite(assistantIdParsed) ? assistantIdParsed : undefined),
        assistant_service_id: formState.serviceId === "none"
          ? null
          : (Number.isFinite(serviceIdParsed) ? serviceIdParsed : undefined),
        company_client_id: editingEvent?.client?.id,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: formState.clientEmail.trim() === "" ? undefined : formState.clientEmail.trim(),
      };

      if (editingEvent) {
        await calendarEventUpdateRequest(token, editingEvent.id, payload);
        setSuccessMessage(messages.calendar.updatedSuccess);
      } else {
        await calendarEventCreateRequest(token, payload);
        setSuccessMessage(messages.calendar.createdSuccess);
      }

      eventModal.onClose();
      setEditingEvent(null);
      await loadEvents();
      setSelectedDate(formState.date);
      setIsMobileDetailsOpen(true);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.calendar.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvent = async (event: CalendarEventItem) => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.calendar.unauthorized);
      return;
    }

    setIsDeletingEventId(event.id);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      await calendarEventDeleteRequest(token, event.id);
      setSuccessMessage(messages.calendar.deletedSuccess);
      await loadEvents();
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.calendar.deleteFailed,
      );
    } finally {
      setIsDeletingEventId(null);
    }
  };

  const previousMonth = () => {
    const [yearRaw, monthRaw] = selectedMonth.split("-");
    const year = Number.parseInt(yearRaw ?? "", 10);
    const month = Number.parseInt(monthRaw ?? "", 10);

    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return;
    }

    const date = new Date(year, month - 2, 1);
    const nextKey = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
    setSelectedDate(nextKey);
  };

  const nextMonth = () => {
    const [yearRaw, monthRaw] = selectedMonth.split("-");
    const year = Number.parseInt(yearRaw ?? "", 10);
    const month = Number.parseInt(monthRaw ?? "", 10);

    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return;
    }

    const date = new Date(year, month, 1);
    const nextKey = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
    setSelectedDate(nextKey);
  };

  const dayLabelByKey = (key: CalendarWeekDay): string => {
    const labels: Record<CalendarWeekDay, string> = {
      monday: messages.businessSettings.mondayLabel,
      tuesday: messages.businessSettings.tuesdayLabel,
      wednesday: messages.businessSettings.wednesdayLabel,
      thursday: messages.businessSettings.thursdayLabel,
      friday: messages.businessSettings.fridayLabel,
      saturday: messages.businessSettings.saturdayLabel,
      sunday: messages.businessSettings.sundayLabel,
    };

    return labels[key];
  };

  const statusLabel = (status: CalendarEventStatus): string => {
    switch (status) {
      case "scheduled":
        return messages.calendar.statusScheduled;
      case "confirmed":
        return messages.calendar.statusConfirmed;
      case "completed":
        return messages.calendar.statusCompleted;
      case "canceled":
        return messages.calendar.statusCanceled;
      case "no_show":
        return messages.calendar.statusNoShow;
      default:
        return status;
    }
  };

  const assistantFilterOptions = useMemo(() => {
    return [
      {
        id: "all",
        name: messages.calendar.allAssistants,
      },
      ...assistants.map((assistant) => ({
        id: String(assistant.id),
        name: assistant.name,
      })),
    ];
  }, [assistants, messages.calendar.allAssistants]);

  const assistantSelectionOptions = useMemo(
    () => [
      {
        id: "none",
        name: messages.calendar.noAssistant,
      },
      ...assistants.map((assistant) => ({
        id: String(assistant.id),
        name: assistant.name,
      })),
    ],
    [assistants, messages.calendar.noAssistant],
  );

  const serviceSelectionOptions = useMemo(
    () => [
      {
        id: "none",
        name: messages.calendar.noService,
      },
      ...serviceOptions.map((service) => ({
        id: String(service.id),
        name: service.name,
      })),
    ],
    [messages.calendar.noService, serviceOptions],
  );

  return (
    <DashboardLayout
      title={messages.calendar.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="calendar"
    >
      <div className="space-y-4">
        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.calendar.errorTitle}
            description={globalError}
          />
        ) : null}

        {successMessage ? (
          <Alert
            color="success"
            variant="faded"
            title={messages.calendar.successTitle}
            description={successMessage}
          />
        ) : null}

        {!appointmentsEnabled ? (
          <Alert
            color="warning"
            variant="faded"
            title={messages.calendar.appointmentsDisabledTitle}
            description={messages.calendar.appointmentsDisabledDescription}
          />
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              isMobileDetailsOpen ? "hidden xl:flex" : "flex"
            }`}
          >
            <CardBody className="gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{messages.calendar.monthTitle}</p>
                  <p className="text-xs text-default-500">{monthTitle(selectedMonth, locale, calendarTimezone)}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={previousMonth}
                    aria-label={messages.calendar.prevMonthButton}
                  >
                    <Icon icon="solar:alt-arrow-left-linear" width={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={nextMonth}
                    aria-label={messages.calendar.nextMonthButton}
                  >
                    <Icon icon="solar:alt-arrow-right-linear" width={18} />
                  </Button>
                </div>
              </div>

              <Select
                label={messages.calendar.assistantFilterLabel}
                selectedKeys={[assistantFilterId]}
                onSelectionChange={(keys) => {
                  const selected = String(Array.from(keys)[0] ?? "all");
                  setAssistantFilterId(selected);
                }}
                disallowEmptySelection
                size="sm"
              >
                {assistantFilterOptions.map((item) => (
                  <SelectItem key={item.id}>{item.name}</SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-default-500">
                {WEEK_DAY_KEYS.map((dayKey) => (
                  <div key={dayKey} className="truncate">
                    {dayLabelByKey(dayKey).slice(0, 2)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthCells.map((cell) => {
                  const isSelected = cell.dateKey === selectedDate;
                  const count = eventsCountByDate.get(cell.dateKey) ?? 0;

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      onClick={() => {
                        setSelectedDate(cell.dateKey);
                        setIsMobileDetailsOpen(true);
                      }}
                      className={`relative rounded-medium border px-1 py-2 text-center text-xs transition ${
                        isSelected
                          ? "border-primary bg-primary-50 text-primary"
                          : cell.isCurrentMonth
                            ? "border-default-200 bg-default-50 text-foreground hover:bg-default-100"
                            : "border-default-100 bg-default-100/60 text-default-400"
                      }`}
                    >
                      <span className="font-medium">{formatDayNumber(cell.dayNumber)}</span>
                      {count > 0 ? (
                        <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                          {count > 9 ? "9+" : count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <Divider />

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-default-500">
                  {messages.calendar.quickCreateTitle}
                </p>

                {selectedDaySchedule.is_day_off ? (
                  <p className="rounded-medium border border-warning-200 bg-warning-50 px-3 py-2 text-xs text-warning-700">
                    {messages.calendar.dayOffMessage}
                  </p>
                ) : slotOptions.length === 0 ? (
                  <p className="rounded-medium border border-default-200 bg-default-100 px-3 py-2 text-xs text-default-500">
                    {messages.calendar.noSlots}
                  </p>
                ) : (
                  <ScrollShadow className="max-h-[188px]">
                    <div className="grid grid-cols-3 gap-2">
                      {slotOptions.map((slot) => (
                        <Button
                          key={slot.time}
                          size="sm"
                          variant={slot.disabled ? "bordered" : "flat"}
                          color={slot.disabled ? "default" : "primary"}
                          isDisabled={slot.disabled || !appointmentsEnabled}
                          onPress={() => {
                            openCreateModal(slot.time);
                          }}
                          className="h-8 min-w-0"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </ScrollShadow>
                )}
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              !isMobileDetailsOpen ? "hidden xl:flex" : "flex"
            }`}
          >
            <CardBody className="gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setIsMobileDetailsOpen(false);
                    }}
                    className="xl:hidden"
                    aria-label={messages.calendar.backToMonthButton}
                  >
                    <Icon icon="solar:alt-arrow-left-linear" width={18} />
                  </Button>

                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {formatDateLabel(selectedDate, locale, calendarTimezone)}
                    </p>
                    <p className="text-xs text-default-500">{messages.calendar.timezoneLabel}: {calendarTimezone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<Icon icon="solar:refresh-linear" width={16} />}
                    onPress={() => {
                      void loadEvents();
                    }}
                  >
                    {messages.calendar.refreshButton}
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<Icon icon="solar:add-circle-linear" width={16} />}
                    onPress={() => {
                      openCreateModal();
                    }}
                    isDisabled={!appointmentsEnabled}
                  >
                    {messages.calendar.addEventButton}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex min-h-[280px] items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-large border border-dashed border-default-300 bg-default-50 px-4 text-center text-sm text-default-500">
                  {messages.calendar.emptyForDay}
                </div>
              ) : (
                <ScrollShadow className="max-h-[560px]">
                  <div className="grid gap-2.5 pr-1 xl:grid-cols-2">
                    {selectedDateEvents.map((event) => (
                      <Card
                        key={event.id}
                        shadow="none"
                        className="border border-default-200 bg-white"
                      >
                        <CardBody className="p-3">
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 space-y-0.5">
                                <p className="truncate text-sm font-semibold leading-5 text-foreground">
                                  {event.title}
                                </p>
                                <p className="text-xs text-default-500">
                                  {displayDateTime(
                                    event.starts_at,
                                    event.timezone || calendarTimezone,
                                    locale,
                                  )}
                                  {event.ends_at
                                    ? ` - ${timeKeyFromIsoInTimezone(
                                        event.ends_at,
                                        event.timezone || calendarTimezone,
                                      )}`
                                    : ""}
                                </p>
                              </div>

                              <Chip
                                size="sm"
                                variant="flat"
                                color={statusColor(event.status)}
                                className="shrink-0"
                              >
                                {statusLabel(event.status)}
                              </Chip>
                            </div>

                            {event.client ? (
                              <div className="flex items-center gap-2 rounded-medium bg-default-50 px-2.5 py-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-default-200 text-xs font-semibold text-default-700">
                                  {initialsFromName(event.client.name)}
                                </div>
                                <div className="min-w-0 leading-tight">
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {event.client.name}
                                  </p>
                                  <p className="truncate text-xs text-default-500">
                                    {event.client.phone}
                                  </p>
                                </div>
                              </div>
                            ) : null}

                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-default-600">
                              {event.assistant ? (
                                <Chip size="sm" variant="flat">
                                  {event.assistant.name}
                                </Chip>
                              ) : null}
                              {event.service ? (
                                <Chip size="sm" variant="flat">
                                  {event.service.name}
                                </Chip>
                              ) : null}
                              {event.location ? (
                                <Chip size="sm" variant="flat">
                                  {event.location}
                                </Chip>
                              ) : null}
                            </div>

                            <div className="grid w-full grid-cols-3 gap-2 pt-1">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                fullWidth
                                onPress={() => {
                                  openDetailsModal(event);
                                }}
                                aria-label={messages.calendar.viewDetailsButton}
                              >
                                {messages.calendar.viewDetailsButton}
                              </Button>
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                fullWidth
                                onPress={() => {
                                  openEditModal(event);
                                }}
                                aria-label={messages.calendar.editButton}
                              >
                                {messages.calendar.editButton}
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                fullWidth
                                isLoading={isDeletingEventId === event.id}
                                onPress={() => {
                                  void deleteEvent(event);
                                }}
                                aria-label={messages.calendar.deleteButton}
                              >
                                {messages.calendar.deleteButton}
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </ScrollShadow>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isEventDetailsOpen}
        onOpenChange={(open) => {
          setIsEventDetailsOpen(open);
          if (!open) {
            setViewingEvent(null);
          }
        }}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>{messages.calendar.viewDetailsButton}</ModalHeader>
          <ModalBody className="space-y-3">
            {viewingEvent ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {viewingEvent.title}
                  </p>
                  <p className="text-xs text-default-500">
                    {displayDateTime(
                      viewingEvent.starts_at,
                      viewingEvent.timezone || calendarTimezone,
                      locale,
                    )}
                    {viewingEvent.ends_at
                      ? ` - ${timeKeyFromIsoInTimezone(
                          viewingEvent.ends_at,
                          viewingEvent.timezone || calendarTimezone,
                        )}`
                      : ""}
                  </p>
                </div>

                <Chip size="sm" variant="flat" color={statusColor(viewingEvent.status)}>
                  {statusLabel(viewingEvent.status)}
                </Chip>

                {viewingEvent.client ? (
                  <div className="rounded-medium bg-default-50 p-3 text-sm">
                    <p className="font-medium text-foreground">{viewingEvent.client.name}</p>
                    <p className="text-default-600">{viewingEvent.client.phone}</p>
                    {viewingEvent.client.email ? (
                      <p className="text-default-500">{viewingEvent.client.email}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  {viewingEvent.assistant ? (
                    <Chip size="sm" variant="flat">
                      {viewingEvent.assistant.name}
                    </Chip>
                  ) : null}
                  {viewingEvent.service ? (
                    <Chip size="sm" variant="flat">
                      {viewingEvent.service.name}
                    </Chip>
                  ) : null}
                  {viewingEvent.location ? (
                    <Chip size="sm" variant="flat">
                      {viewingEvent.location}
                    </Chip>
                  ) : null}
                </div>

                {viewingEvent.description ? (
                  <p className="rounded-medium bg-default-50 p-3 text-sm text-default-700">
                    {viewingEvent.description}
                  </p>
                ) : null}
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setIsEventDetailsOpen(false);
                setViewingEvent(null);
              }}
            >
              {messages.calendar.cancelButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={eventModal.isOpen}
        onOpenChange={eventModal.onOpenChange}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader>
            {editingEvent ? messages.calendar.editModalTitle : messages.calendar.createModalTitle}
          </ModalHeader>
          <ModalBody className="gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={messages.calendar.titleLabel}
                value={formState.title}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    title: value,
                  }));
                }}
              />
              <Select
                label={messages.calendar.statusLabel}
                selectedKeys={[formState.status]}
                onSelectionChange={(keys) => {
                  const selected = String(Array.from(keys)[0] ?? "scheduled") as CalendarEventStatus;
                  setFormState((previous) => ({
                    ...previous,
                    status: selected,
                  }));
                }}
                disallowEmptySelection
              >
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status}>{statusLabel(status)}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                type="date"
                label={messages.calendar.dateLabel}
                value={formState.date}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    date: value,
                  }));
                }}
              />
              <Input
                type="time"
                label={messages.calendar.timeLabel}
                value={formState.time}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    time: value,
                  }));
                }}
              />
              <Select
                label={messages.calendar.durationLabel}
                selectedKeys={[formState.durationMinutes]}
                onSelectionChange={(keys) => {
                  const selected = String(Array.from(keys)[0] ?? slotMinutes);
                  setFormState((previous) => ({
                    ...previous,
                    durationMinutes: selected,
                  }));
                }}
                disallowEmptySelection
              >
                {Array.from(new Set([...DURATION_OPTIONS, slotMinutes]))
                  .sort((left, right) => left - right)
                  .map((value) => (
                    <SelectItem key={String(value)}>{`${value} ${messages.businessSettings.minutesUnit}`}</SelectItem>
                  ))}
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label={messages.calendar.clientNameLabel}
                value={formState.clientName}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    clientName: value,
                  }));
                }}
              />
              <Input
                label={messages.calendar.clientPhoneLabel}
                value={formState.clientPhone}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    clientPhone: value,
                  }));
                }}
              />
              <Input
                label={messages.calendar.clientEmailLabel}
                value={formState.clientEmail}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    clientEmail: value,
                  }));
                }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label={messages.calendar.assistantLabel}
                selectedKeys={[formState.assistantId]}
                items={assistantSelectionOptions}
                onSelectionChange={(keys) => {
                  const selected = String(Array.from(keys)[0] ?? "none");
                  setFormState((previous) => ({
                    ...previous,
                    assistantId: selected === "none" ? "none" : selected,
                    serviceId: "none",
                  }));
                }}
                disallowEmptySelection
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>

              <Select
                label={messages.calendar.serviceLabel}
                selectedKeys={[formState.serviceId]}
                items={serviceSelectionOptions}
                onSelectionChange={(keys) => {
                  const selected = String(Array.from(keys)[0] ?? "none");
                  setFormState((previous) => ({
                    ...previous,
                    serviceId: selected === "none" ? "none" : selected,
                  }));
                }}
                disallowEmptySelection
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={messages.calendar.locationLabel}
                value={formState.location}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    location: value,
                  }));
                }}
              />
              <Input
                label={messages.calendar.meetingLinkLabel}
                value={formState.meetingLink}
                onValueChange={(value) => {
                  setFormState((previous) => ({
                    ...previous,
                    meetingLink: value,
                  }));
                }}
              />
            </div>

            <Textarea
              label={messages.calendar.descriptionLabel}
              minRows={3}
              value={formState.description}
              onValueChange={(value) => {
                setFormState((previous) => ({
                  ...previous,
                  description: value,
                }));
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeModal} isDisabled={isSaving}>
              {messages.calendar.cancelButton}
            </Button>
            <Button color="primary" onPress={saveEvent} isLoading={isSaving}>
              {editingEvent ? messages.calendar.saveButton : messages.calendar.createButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
