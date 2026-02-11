import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Card, CardBody, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '../components/dashboard/DashboardLayout';

type CalendarEvent = {
    id: number | string;
    type: 'appointment' | 'task';
    name: string;
    phone?: string | null;
    service?: string | null;
    amount?: number | null;
    currency?: string | null;
    status: string;
    source?: string | null;
    specialist?: string | null;
    scheduledAt?: string | null;
    createdAt?: string | null;
    notes?: string | null;
    chatId?: number | null;
    linkedOrderId?: number | null;
};

type EditForm = {
    name: string;
    phone: string;
    service: string;
    amount: string;
    status: string;
    source: string;
    specialist: string;
    scheduledAt: string;
    notes: string;
};

const WEEK_DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 21;
const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 36;

function pad2(value: number): string {
    return String(value).padStart(2, '0');
}

function toDateKey(date: Date): string {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function parseDate(value?: string | null): Date | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date;
}

function dateFromKey(key: string): Date {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function startOfWeek(value: Date): Date {
    const date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const weekDay = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - weekDay);
    return date;
}

function addDays(value: Date, amount: number): Date {
    const next = new Date(value);
    next.setDate(next.getDate() + amount);
    return next;
}

function formatWeekRangeTitle(weekStart: Date): string {
    const weekEnd = addDays(weekStart, 6);
    const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
    const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

    if (sameMonth && sameYear) {
        const monthYear = weekStart.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${monthYear}`;
    }

    const left = weekStart.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const right = weekEnd.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${left} - ${right}`;
}

function formatTime(value?: string | null): string {
    const date = parseDate(value);
    if (!date) return '--:--';
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(value?: string | null): string {
    const date = parseDate(value);
    if (!date) return '-';
    return `${date.toLocaleDateString('ru-RU')}, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatSlot(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${pad2(h)}:${pad2(m)}`;
}

function toInputDateTime(value?: string | null): string {
    const date = parseDate(value);
    if (!date) return '';
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function toPayloadDateTime(value: string): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}

function sourceIcon(source?: string | null): string {
    const value = (source ?? '').toLowerCase();
    if (value === 'instagram') return 'mdi:instagram';
    if (value === 'telegram') return 'mdi:telegram';
    if (value === 'whatsapp') return 'mdi:whatsapp';
    if (value === 'web') return 'solar:globe-linear';
    return 'solar:widget-5-linear';
}

function sourceLabel(source?: string | null): string {
    const value = (source ?? '').toLowerCase();
    if (value === 'instagram') return 'Instagram';
    if (value === 'telegram') return 'Telegram';
    if (value === 'whatsapp') return 'WhatsApp';
    if (value === 'web') return 'Веб-сайт';
    if (value === 'assistant') return 'Ассистент';
    if (value === 'internal') return 'Внутренний';
    return source || 'Веб-сайт';
}

function statusLabel(status: string): string {
    const value = status.toLowerCase();
    if (value === 'new') return 'Новый';
    if (value === 'scheduled') return 'Запланирован';
    if (value === 'processing') return 'В обработке';
    if (value === 'done') return 'Завершен';
    if (value === 'resolved') return 'Решен';
    if (value === 'open') return 'Открыт';
    return status;
}

function statusBadgeColor(status: string): 'default' | 'primary' | 'success' | 'warning' {
    const value = status.toLowerCase();
    if (value === 'done' || value === 'resolved') return 'success';
    if (value === 'processing') return 'primary';
    if (value === 'scheduled') return 'warning';
    return 'default';
}

function eventDateKey(event: CalendarEvent): string | null {
    const date = parseDate(event.scheduledAt);
    if (!date) return null;
    return toDateKey(date);
}

function getInitialForm(event: CalendarEvent | null): EditForm {
    return {
        name: event?.name ?? '',
        phone: event?.phone ?? '',
        service: event?.service ?? '',
        amount: String(event?.amount ?? 0),
        status: event?.status ?? 'new',
        source: event?.source ?? 'web',
        specialist: event?.specialist ?? '',
        scheduledAt: toInputDateTime(event?.scheduledAt),
        notes: event?.notes ?? '',
    };
}

export default function CalendarPage() {
    const { props } = usePage<{ events?: CalendarEvent[]; csrf_token?: string }>();
    const csrfToken = props.csrf_token ?? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
    const [events, setEvents] = React.useState<CalendarEvent[]>(props.events ?? []);
    const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
    const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [form, setForm] = React.useState<EditForm>(getInitialForm(null));
    const [isWideCalendar, setIsWideCalendar] = React.useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= 960;
    });

    const today = React.useMemo(() => new Date(), []);
    const [cursorDate, setCursorDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const [selectedDayKey, setSelectedDayKey] = React.useState(toDateKey(today));

    React.useEffect(() => {
        setEvents(props.events ?? []);
    }, [props.events]);

    React.useEffect(() => {
        const onResize = () => setIsWideCalendar(window.innerWidth >= 960);
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const weekStart = React.useMemo(() => startOfWeek(cursorDate), [cursorDate]);
    const weekDays = React.useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
    const weekDayKeys = React.useMemo(() => weekDays.map((day) => toDateKey(day)), [weekDays]);
    const todayKey = React.useMemo(() => toDateKey(today), [today]);

    React.useEffect(() => {
        if (!weekDayKeys.includes(selectedDayKey)) {
            setSelectedDayKey(weekDayKeys[0] ?? toDateKey(today));
        }
    }, [selectedDayKey, today, weekDayKeys]);

    const eventsByDate = React.useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach((event) => {
            const key = eventDateKey(event);
            if (!key) return;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)?.push(event);
        });

        map.forEach((items, key) => {
            map.set(
                key,
                [...items].sort((a, b) => {
                    const aTime = parseDate(a.scheduledAt)?.getTime() ?? 0;
                    const bTime = parseDate(b.scheduledAt)?.getTime() ?? 0;
                    return aTime - bTime;
                }),
            );
        });

        return map;
    }, [events]);

    const weekEventsByDate = React.useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        weekDayKeys.forEach((key) => map.set(key, eventsByDate.get(key) ?? []));
        return map;
    }, [eventsByDate, weekDayKeys]);

    const selectedDayEvents = React.useMemo(() => weekEventsByDate.get(selectedDayKey) ?? [], [selectedDayKey, weekEventsByDate]);
    const unscheduledEvents = React.useMemo(() => events.filter((event) => !eventDateKey(event)), [events]);

    const stats = React.useMemo(() => {
        const now = Date.now();
        const weekSet = new Set(weekDayKeys);
        const scheduled = events.filter((event) => !!event.scheduledAt);
        const todayCount = scheduled.filter((event) => eventDateKey(event) === todayKey).length;
        const weekCount = scheduled.filter((event) => {
            const key = eventDateKey(event);
            return key ? weekSet.has(key) : false;
        }).length;
        const upcoming = scheduled.filter((event) => {
            const date = parseDate(event.scheduledAt);
            if (!date) return false;
            if (date.getTime() <= now) return false;
            return !['done', 'resolved'].includes(event.status.toLowerCase());
        }).length;

        return {
            total: scheduled.length,
            today: todayCount,
            week: weekCount,
            upcoming,
        };
    }, [events, todayKey, weekDayKeys]);

    const laneMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60;
    const slotCount = laneMinutes / SLOT_MINUTES;
    const laneHeight = slotCount * SLOT_HEIGHT;
    const timeSlots = React.useMemo(() => Array.from({ length: slotCount }, (_, index) => DAY_START_HOUR * 60 + index * SLOT_MINUTES), [slotCount]);

    const getEventLayout = React.useCallback(
        (event: CalendarEvent) => {
            const date = parseDate(event.scheduledAt);
            if (!date) return null;
            const minutes = date.getHours() * 60 + date.getMinutes();
            const fromStart = minutes - DAY_START_HOUR * 60;
            if (fromStart < 0 || fromStart >= laneMinutes) return null;

            const top = (fromStart / SLOT_MINUTES) * SLOT_HEIGHT;
            const durationMinutes = event.type === 'appointment' ? 60 : 45;
            const rawHeight = (durationMinutes / SLOT_MINUTES) * SLOT_HEIGHT;
            const maxAvailable = laneHeight - top - 6;
            const height = Math.max(42, Math.min(rawHeight, maxAvailable));

            return { top, height };
        },
        [laneHeight, laneMinutes],
    );

    const openEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setForm(getInitialForm(event));
        setIsEditing(false);
        setIsEventModalOpen(true);
    };

    const upsertEvent = (event: CalendarEvent) => {
        setEvents((prev) => prev.map((item) => (item.id === event.id && item.type === event.type ? event : item)));
        setSelectedEvent(event);
        if (event.scheduledAt) {
            setSelectedDayKey(toDateKey(parseDate(event.scheduledAt) ?? today));
        }
    };

    const updateEvent = async () => {
        if (!selectedEvent) return;
        setProcessing(true);

        try {
            const endpoint =
                selectedEvent.type === 'appointment'
                    ? `/calendar/appointments/${selectedEvent.id}`
                    : `/calendar/tasks/${selectedEvent.id}`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone || null,
                    service: form.service || null,
                    amount: selectedEvent.type === 'appointment' ? Number(form.amount || 0) : null,
                    status: form.status,
                    source: form.source || null,
                    specialist: form.specialist || null,
                    scheduled_at: toPayloadDateTime(form.scheduledAt),
                    notes: form.notes || null,
                }),
            });

            if (!response.ok) return;
            const data = await response.json();
            if (!data?.item) return;

            const updated = data.item as CalendarEvent;
            upsertEvent(updated);
            setForm(getInitialForm(updated));
            setIsEditing(false);
        } finally {
            setProcessing(false);
        }
    };

    const deleteEvent = async () => {
        if (!selectedEvent) return;
        setProcessing(true);

        try {
            const endpoint =
                selectedEvent.type === 'appointment'
                    ? `/calendar/appointments/${selectedEvent.id}`
                    : `/calendar/tasks/${selectedEvent.id}`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (!response.ok) return;

            setEvents((prev) => prev.filter((item) => !(item.id === selectedEvent.id && item.type === selectedEvent.type)));
            setSelectedEvent(null);
            setIsDeleteModalOpen(false);
            setIsEventModalOpen(false);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Календарь" />
            <DashboardLayout title="Календарь" defaultSelectedKey="calendar">
                <div className="flex flex-col gap-4 pb-2">
                    <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                        <Card className="border border-blue-100 bg-white/95 shadow-sm dark:border-blue-500/20 dark:bg-[#181a21]">
                            <CardBody className="gap-0.5 px-3 py-2.5">
                                <span className="text-sm text-default-500">Всего записей</span>
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</span>
                            </CardBody>
                        </Card>
                        <Card className="border border-blue-100 bg-white/95 shadow-sm dark:border-blue-500/20 dark:bg-[#181a21]">
                            <CardBody className="gap-0.5 px-3 py-2.5">
                                <span className="text-sm text-default-500">Сегодня</span>
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.today}</span>
                            </CardBody>
                        </Card>
                        <Card className="border border-blue-100 bg-white/95 shadow-sm dark:border-blue-500/20 dark:bg-[#181a21]">
                            <CardBody className="gap-0.5 px-3 py-2.5">
                                <span className="text-sm text-default-500">На этой неделе</span>
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.week}</span>
                            </CardBody>
                        </Card>
                        <Card className="border border-blue-100 bg-white/95 shadow-sm dark:border-blue-500/20 dark:bg-[#181a21]">
                            <CardBody className="gap-0.5 px-3 py-2.5">
                                <span className="text-sm text-default-500">Предстоящие</span>
                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{stats.upcoming}</span>
                            </CardBody>
                        </Card>
                    </div>

                    <Card className="border border-default-200 bg-white/95 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                        <CardBody className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                            <div>
                                <h1 className="text-xl font-semibold text-default-900 dark:text-default-100">Календарь</h1>
                                <p className="text-sm text-default-500">Синхронный просмотр записей и задач по времени.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    onPress={() => setCursorDate((prev) => addDays(prev, -7))}
                                    aria-label="Предыдущая неделя"
                                >
                                    <Icon icon="solar:alt-arrow-left-linear" width={18} />
                                </Button>
                                <Button
                                    color="primary"
                                    variant="flat"
                                    onPress={() => {
                                        setCursorDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
                                        setSelectedDayKey(todayKey);
                                    }}
                                >
                                    Сегодня
                                </Button>
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    onPress={() => setCursorDate((prev) => addDays(prev, 7))}
                                    aria-label="Следующая неделя"
                                >
                                    <Icon icon="solar:alt-arrow-right-linear" width={18} />
                                </Button>
                                <div className="rounded-medium border border-default-200 px-3 py-2 text-sm font-semibold dark:border-[#2a2a32]">
                                    {formatWeekRangeTitle(weekStart)}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {isWideCalendar ? (
                        <Card className="border border-default-200 bg-white/95 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                            <CardBody className="overflow-x-auto p-0">
                                <div className="min-w-[980px]">
                                    <div className="grid grid-cols-[88px_repeat(7,minmax(148px,1fr))] border-b border-default-200 dark:border-[#2a2a32]">
                                        <div className="flex items-center justify-center bg-default-50 py-4 text-xs font-semibold uppercase tracking-wide text-default-500 dark:bg-[#1d1f27]">
                                            Время
                                        </div>
                                        {weekDays.map((day, index) => {
                                            const key = toDateKey(day);
                                            const selected = selectedDayKey === key;
                                            const isToday = key === todayKey;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setSelectedDayKey(key)}
                                                    className={`flex flex-col items-center justify-center gap-1 border-l border-default-200 py-3 transition dark:border-[#2a2a32] ${
                                                        selected
                                                            ? 'bg-blue-50 dark:bg-blue-500/10'
                                                            : 'bg-default-50 hover:bg-blue-50/70 dark:bg-[#1d1f27] dark:hover:bg-blue-500/10'
                                                    }`}
                                                >
                                                    <span className="text-xs font-medium text-default-500">{WEEK_DAY_SHORT[index]}</span>
                                                    <span className="text-lg font-semibold text-default-800 dark:text-default-100">{day.getDate()}</span>
                                                    {isToday ? (
                                                        <Chip size="sm" color="primary" variant="flat">
                                                            Сегодня
                                                        </Chip>
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-[88px_repeat(7,minmax(148px,1fr))]">
                                        <div className="border-r border-default-200 dark:border-[#2a2a32]">
                                            {timeSlots.map((minutes) => (
                                                <div
                                                    key={minutes}
                                                    className="border-b border-default-200/80 px-2 pt-1 text-xs text-default-500 dark:border-[#2a2a32]/80"
                                                    style={{ height: SLOT_HEIGHT }}
                                                >
                                                    {formatSlot(minutes)}
                                                </div>
                                            ))}
                                        </div>

                                        {weekDays.map((day) => {
                                            const key = toDateKey(day);
                                            const dayEvents = weekEventsByDate.get(key) ?? [];

                                            return (
                                                <div key={key} className="relative border-r border-default-200 dark:border-[#2a2a32]" style={{ height: laneHeight }}>
                                                    {timeSlots.map((minutes) => (
                                                        <div
                                                            key={`${key}-${minutes}`}
                                                            className="pointer-events-none absolute inset-x-0 border-t border-default-200/80 dark:border-[#2a2a32]/80"
                                                            style={{ top: ((minutes - DAY_START_HOUR * 60) / SLOT_MINUTES) * SLOT_HEIGHT }}
                                                        />
                                                    ))}

                                                    {dayEvents.map((event) => {
                                                        const layout = getEventLayout(event);
                                                        if (!layout) return null;

                                                        return (
                                                            <button
                                                                key={`${event.type}-${event.id}`}
                                                                type="button"
                                                                onClick={() => openEvent(event)}
                                                                className={`absolute left-1.5 right-1.5 rounded-medium border px-2 py-1 text-left shadow-sm transition hover:scale-[1.01] ${
                                                                    event.type === 'appointment'
                                                                        ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-100'
                                                                        : 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-100'
                                                                }`}
                                                                style={{ top: layout.top + 2, minHeight: layout.height }}
                                                            >
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="truncate text-[11px] font-semibold">{event.name}</span>
                                                                    <span className="text-[10px]">{formatTime(event.scheduledAt)}</span>
                                                                </div>
                                                                <p className="truncate text-[10px] opacity-80">{event.service || 'Без услуги'}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card className="border border-default-200 bg-white/95 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                            <CardBody className="gap-3 p-3">
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {weekDays.map((day, index) => {
                                        const key = toDateKey(day);
                                        const selected = selectedDayKey === key;
                                        const count = weekEventsByDate.get(key)?.length ?? 0;

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedDayKey(key)}
                                                className={`min-w-[88px] rounded-large border px-3 py-2 text-left transition ${
                                                    selected
                                                        ? 'border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200'
                                                        : 'border-default-200 bg-white text-default-700 dark:border-[#2a2a32] dark:bg-[#121217] dark:text-default-200'
                                                }`}
                                            >
                                                <p className="text-[11px] uppercase">{WEEK_DAY_SHORT[index]}</p>
                                                <p className="text-lg font-semibold">{day.getDate()}</p>
                                                <p className="text-[11px] text-default-500">{count} событий</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {selectedDayEvents.length === 0 ? (
                                        <div className="rounded-large border border-dashed border-default-200 px-4 py-8 text-center text-sm text-default-500 dark:border-[#2a2a32]">
                                            На выбранный день событий нет.
                                        </div>
                                    ) : (
                                        selectedDayEvents.map((event) => (
                                            <button
                                                key={`${event.type}-${event.id}`}
                                                type="button"
                                                onClick={() => openEvent(event)}
                                                className="rounded-large border border-default-200 bg-white px-3 py-3 text-left shadow-sm transition hover:border-blue-300 dark:border-[#2a2a32] dark:bg-[#121217]"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <p className="truncate text-sm font-semibold">{event.name}</p>
                                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{formatTime(event.scheduledAt)}</p>
                                                </div>
                                                <p className="mb-2 truncate text-xs text-default-500">{event.service || 'Без услуги'}</p>
                                                <div className="flex items-center justify-between gap-2">
                                                    <Chip size="sm" color={statusBadgeColor(event.status)} variant="flat">
                                                        {statusLabel(event.status)}
                                                    </Chip>
                                                    <div className="flex items-center gap-1 text-xs text-default-500">
                                                        <Icon icon={sourceIcon(event.source)} width={14} />
                                                        <span>{sourceLabel(event.source)}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
                        <Card className="border border-default-200 bg-white/95 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                            <CardBody className="gap-3 p-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold">События на {dateFromKey(selectedDayKey).toLocaleDateString('ru-RU')}</h2>
                                    <Chip size="sm" color="primary" variant="flat">
                                        {selectedDayEvents.length}
                                    </Chip>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {selectedDayEvents.length === 0 ? (
                                        <div className="rounded-medium border border-dashed border-default-200 px-4 py-6 text-center text-sm text-default-500 dark:border-[#2a2a32]">
                                            На эту дату событий нет.
                                        </div>
                                    ) : (
                                        selectedDayEvents.map((event) => (
                                            <button
                                                key={`${event.type}-${event.id}`}
                                                type="button"
                                                onClick={() => openEvent(event)}
                                                className="flex items-center justify-between rounded-large border border-default-200 px-3 py-3 text-left transition hover:border-blue-300 dark:border-[#2a2a32] dark:hover:border-blue-500/40"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">{event.name}</p>
                                                    <p className="truncate text-xs text-default-500">{event.service || 'Без услуги'}</p>
                                                </div>
                                                <div className="ml-2 text-right">
                                                    <p className="text-sm font-semibold">{formatTime(event.scheduledAt)}</p>
                                                    <p className="text-xs text-default-500">{statusLabel(event.status)}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="border border-default-200 bg-white/95 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                            <CardBody className="gap-3 p-4">
                                <h2 className="text-base font-semibold">Без даты и времени</h2>
                                <div className="flex flex-col gap-2">
                                    {unscheduledEvents.length === 0 ? (
                                        <div className="rounded-medium border border-dashed border-default-200 px-4 py-6 text-center text-sm text-default-500 dark:border-[#2a2a32]">
                                            Нет событий без даты.
                                        </div>
                                    ) : (
                                        unscheduledEvents.map((event) => (
                                            <button
                                                key={`${event.type}-${event.id}`}
                                                type="button"
                                                onClick={() => openEvent(event)}
                                                className="flex items-center justify-between rounded-large border border-default-200 px-3 py-3 text-left transition hover:border-blue-300 dark:border-[#2a2a32] dark:hover:border-blue-500/40"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">{event.name}</p>
                                                    <p className="truncate text-xs text-default-500">{event.service || 'Без услуги'}</p>
                                                </div>
                                                <Chip size="sm" variant="flat">
                                                    {sourceLabel(event.source)}
                                                </Chip>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>

            <Modal isOpen={isEventModalOpen} onOpenChange={setIsEventModalOpen} size="3xl">
                <ModalContent>
                    <ModalHeader className="text-3xl font-semibold">{selectedEvent?.name ?? 'Событие'}</ModalHeader>
                    <ModalBody className="gap-5">
                        {isEditing ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input
                                    label="Имя"
                                    value={form.name}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                                />
                                <Input
                                    label="Телефон"
                                    value={form.phone}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                                />
                                <Input
                                    label="Услуга"
                                    value={form.service}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, service: value }))}
                                />
                                <Input
                                    label="Статус"
                                    value={form.status}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                                />
                                <Input
                                    label="Источник"
                                    value={form.source}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, source: value }))}
                                />
                                <Input
                                    label="Специалист"
                                    value={form.specialist}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, specialist: value }))}
                                />
                                {selectedEvent?.type === 'appointment' ? (
                                    <Input
                                        label="Сумма"
                                        type="number"
                                        value={form.amount}
                                        onValueChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
                                    />
                                ) : null}
                                <Input
                                    label="Запись"
                                    type="datetime-local"
                                    value={form.scheduledAt}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, scheduledAt: value }))}
                                />
                                <Textarea
                                    label="Заметка"
                                    className="sm:col-span-2"
                                    value={form.notes}
                                    onValueChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-default-500">Телефон</p>
                                    <p className="text-xl font-semibold">{selectedEvent?.phone ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Услуга</p>
                                    <p className="text-xl font-semibold">{selectedEvent?.service ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Сумма</p>
                                    <p className="text-xl font-semibold">{Math.round(selectedEvent?.amount ?? 0)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Статус</p>
                                    <p className="text-xl font-semibold">{statusLabel(selectedEvent?.status ?? '-')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Источник</p>
                                    <div className="flex items-center gap-2 text-xl font-semibold">
                                        <Icon icon={sourceIcon(selectedEvent?.source)} width={20} />
                                        <span>{sourceLabel(selectedEvent?.source)}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Запись</p>
                                    <p className="text-xl font-semibold">{formatDateTime(selectedEvent?.scheduledAt)}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-default-500">Специалист</p>
                                    <p className="text-xl font-semibold">{selectedEvent?.specialist ?? '-'}</p>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        {isEditing ? (
                            <Button color="primary" onPress={updateEvent} isDisabled={processing}>
                                Сохранить
                            </Button>
                        ) : (
                            <Button color="primary" onPress={() => setIsEditing(true)}>
                                Редактировать
                            </Button>
                        )}
                        <Button
                            color="success"
                            onPress={() => {
                                if (!selectedEvent?.chatId) return;
                                router.get('/client-chats', { chat: selectedEvent.chatId });
                            }}
                            isDisabled={!selectedEvent?.chatId}
                        >
                            Открыть чат
                        </Button>
                        <Button color="danger" isIconOnly onPress={() => setIsDeleteModalOpen(true)}>
                            <Icon icon="solar:trash-bin-trash-linear" width={20} />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
                <ModalContent>
                    <ModalHeader>Подтвердите удаление</ModalHeader>
                    <ModalBody>
                        <p className="text-sm text-default-600">
                            Удалить запись <span className="font-semibold">{selectedEvent?.name ?? ''}</span>? Это действие необратимо.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setIsDeleteModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button color="danger" onPress={deleteEvent} isDisabled={processing}>
                            Удалить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
