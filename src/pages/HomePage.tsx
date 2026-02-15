import { Icon } from "@iconify/react";
import {
  Alert,
  Card,
  CardBody,
  Chip,
  Progress,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  dashboardOverviewRequest,
  type DashboardOverviewResponse,
} from "../dashboard/dashboardClient";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type RangeKey = "6m" | "3m" | "30d" | "7d" | "24h";

type SeriesPoint = {
  label: string;
  value: number;
};

const COPY = {
  ru: {
    pageTitle: "Панель управления",
    seoDescription:
      "Профессиональная аналитика: чаты, каналы, доход, лимиты и работа компании.",
    loadingFailed: "Не удалось загрузить аналитику. Попробуйте снова.",
    refresh: "Обновить",
    analytics: "ANALYTICS",
    subtitle:
      "Все ключевые метрики компании в одном месте: сообщения, каналы, доход, лимиты и эффективность ассистентов.",
    updatedAt: "Обновлено",
    chartTitle: "Общая динамика",
    range6m: "6 месяцев",
    range3m: "3 месяца",
    range30d: "30 дней",
    range7d: "7 дней",
    range24h: "24 часа",
    planNow: "Текущий тариф",
    noPlan: "Нет активного тарифа",
    limits: "Лимиты и нагрузка",
    channels: "Каналы",
    kpiChats: "Чаты",
    kpiMessages: "Сообщения",
    kpiClients: "Клиенты",
    kpiAutomation: "Авто-ответы",
    revenueNow: "Доход за месяц",
    revenuePending: "Ожидает оплаты",
    activeToday: "Активные чаты сегодня",
    unread: "Непрочитанные",
    includedChats: "Лимит чатов",
    usedChats: "Использовано",
    remainingChats: "Осталось",
    overageChats: "Сверх лимита",
    assistantLimit: "Лимит ассистентов",
    integrationLimit: "Лимит интеграций",
    overagePrice: "Цена сверх лимита",
    messagesLabel: "сообщений",
    chatsLabel: "чатов",
    usageLabel: "Использование лимита",
    operations: "Операционная сводка",
    ordersNew: "Новые заявки",
    ordersProgress: "В обработке",
    ordersDone: "Завершено/доставлено",
    appointments7d: "Записи на 7 дней",
    catalog: "Каталог и команда",
    assistants: "Ассистенты",
    services: "Услуги",
    products: "Продукты",
    avgServicePrice: "Средняя цена услуги",
    avgProductPrice: "Средняя цена продукта",
    topServices: "Топ услуг",
    noServiceStats: "Статистика по услугам пока пустая",
    activeShort: "активно",
    newRevenue: "Новая выручка",
  },
  en: {
    pageTitle: "Dashboard",
    seoDescription:
      "Professional analytics: chats, channels, revenue, limits, and company operations.",
    loadingFailed: "Failed to load analytics. Please try again.",
    refresh: "Refresh",
    analytics: "ANALYTICS",
    subtitle:
      "All key company metrics in one place: messages, channels, revenue, limits, and assistant efficiency.",
    updatedAt: "Updated",
    chartTitle: "Overall trend",
    range6m: "6 Months",
    range3m: "3 Months",
    range30d: "30 Days",
    range7d: "7 Days",
    range24h: "24 Hours",
    planNow: "Current plan",
    noPlan: "No active plan",
    limits: "Limits and load",
    channels: "Channels",
    kpiChats: "Chats",
    kpiMessages: "Messages",
    kpiClients: "Clients",
    kpiAutomation: "Automation",
    revenueNow: "Revenue this month",
    revenuePending: "Pending payment",
    activeToday: "Active chats today",
    unread: "Unread",
    includedChats: "Included chats",
    usedChats: "Used",
    remainingChats: "Remaining",
    overageChats: "Overage",
    assistantLimit: "Assistant limit",
    integrationLimit: "Integration limit",
    overagePrice: "Overage price",
    messagesLabel: "messages",
    chatsLabel: "chats",
    usageLabel: "Limit usage",
    operations: "Operations overview",
    ordersNew: "New requests",
    ordersProgress: "In progress",
    ordersDone: "Completed/delivered",
    appointments7d: "Appointments 7d",
    catalog: "Catalog and team",
    assistants: "Assistants",
    services: "Services",
    products: "Products",
    avgServicePrice: "Average service price",
    avgProductPrice: "Average product price",
    topServices: "Top services",
    noServiceStats: "No service stats yet",
    activeShort: "active",
    newRevenue: "New revenue",
  },
} as const;

type Copy = (typeof COPY)["ru"];

function toLocale(locale: "ru" | "en"): string {
  return locale === "ru" ? "ru-RU" : "en-US";
}

function formatMoney(
  value: string | number,
  currency: string,
  locale: "ru" | "en",
): string {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat(toLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

function formatMonthLabel(monthValue: string, locale: "ru" | "en"): string {
  const date = new Date(`${monthValue}-01T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return monthValue;
  }

  return new Intl.DateTimeFormat(toLocale(locale), { month: "short" }).format(
    date,
  );
}

function formatDayLabel(dayValue: string, locale: "ru" | "en"): string {
  const date = new Date(`${dayValue}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return dayValue;
  }

  return new Intl.DateTimeFormat(toLocale(locale), { weekday: "short" }).format(
    date,
  );
}

function normalizeValues(values: number[]): number[] {
  if (values.length === 0) {
    return [0, 0];
  }

  if (values.length === 1) {
    return [values[0], values[0]];
  }

  return values;
}

function chartGeometry(
  valuesInput: number[],
  width: number,
  height: number,
  padding = 10,
) {
  const values = normalizeValues(valuesInput);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = values.map((value, index) => {
    const x = padding + (innerWidth * index) / Math.max(values.length - 1, 1);
    const y = padding + innerHeight - ((value - min) / range) * innerHeight;

    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const baseline = height - padding;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;

  return {
    linePath,
    areaPath,
    points,
    baseline,
  };
}

function channelIcon(channel: string): string {
  const normalized = channel.toLowerCase();

  const map: Record<string, string> = {
    assistant: "solar:stars-line-duotone",
    instagram: "ri:instagram-line",
    telegram: "solar:plain-2-linear",
    widget: "solar:widget-2-outline",
    webchat: "solar:chat-round-line-outline",
    api: "solar:code-square-linear",
    whatsapp: "ri:whatsapp-line",
  };

  return map[normalized] ?? "solar:chat-round-line-outline";
}

function channelLabel(channel: string, locale: "ru" | "en"): string {
  const normalized = channel.toLowerCase();
  const map: Record<string, { ru: string; en: string }> = {
    assistant: { ru: "Ассистент", en: "Assistant" },
    instagram: { ru: "Instagram", en: "Instagram" },
    telegram: { ru: "Telegram", en: "Telegram" },
    widget: { ru: "Веб-виджет", en: "Web widget" },
    webchat: { ru: "Веб-чат", en: "Web chat" },
    api: { ru: "API", en: "API" },
    whatsapp: { ru: "WhatsApp", en: "WhatsApp" },
    other: { ru: "Другое", en: "Other" },
  };

  return map[normalized]?.[locale] ?? channel;
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const copy = COPY[locale] as Copy;

  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("6m");

  usePageSeo({
    title: `${copy.pageTitle} | ${messages.app.name}`,
    description: copy.seoDescription,
    locale,
  });

  const loadOverview = async () => {
    const token = getAuthToken();

    if (!token) {
      setError(copy.loadingFailed);
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    try {
      const response = await dashboardOverviewRequest(token);
      setOverview(response);
      setError(null);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(copy.loadingFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const chartSeries = useMemo(() => {
    if (!overview) {
      return [] as SeriesPoint[];
    }

    const revenueData = overview.revenue.history_last_6_months.map((item) => ({
      label: formatMonthLabel(item.month, locale),
      value: Number(item.amount) || 0,
    }));
    const messageData = overview.chats.messages_last_7_days.map((item) => ({
      label: formatDayLabel(item.date, locale),
      value: item.count,
    }));

    if (range === "6m") {
      return revenueData;
    }

    if (range === "3m") {
      return revenueData.slice(-3);
    }

    if (range === "24h") {
      const today = overview.chats.messages_today;
      const yesterday =
        overview.chats.messages_last_7_days.at(-2)?.count ?? today;

      return [
        { label: locale === "ru" ? "Вчера" : "Yesterday", value: yesterday },
        { label: locale === "ru" ? "Сегодня" : "Today", value: today },
      ];
    }

    return messageData;
  }, [overview, locale, range]);

  const chartValues = chartSeries.map((item) => item.value);
  const chartData = chartGeometry(chartValues, 980, 280, 16);
  const currency = overview?.company.currency ?? "TJS";

  const maxChannelMessages = useMemo(() => {
    if (!overview || overview.chats.channel_breakdown.length === 0) {
      return 1;
    }

    return Math.max(
      ...overview.chats.channel_breakdown.map((item) => item.messages),
      1,
    );
  }, [overview]);

  const sparkRevenue = chartGeometry(
    (overview?.revenue.history_last_6_months ?? []).map(
      (item) => Number(item.amount) || 0,
    ),
    130,
    46,
    4,
  );
  const sparkMessages = chartGeometry(
    (overview?.chats.messages_last_7_days ?? []).map((item) => item.count),
    130,
    46,
    4,
  );

  const quickCards = overview
    ? [
        {
          key: "revenue-now",
          title: copy.revenueNow,
          value: formatMoney(
            overview.revenue.current_month_paid,
            currency,
            locale,
          ),
          icon: "solar:dollar-minimalistic-linear",
          surface: "bg-[#f8fafc]",
          iconTone: "bg-[#e2e8f0] text-[#0f172a]",
          stroke: "#0f172a",
          spark: sparkRevenue.linePath,
        },
        {
          key: "pending",
          title: copy.revenuePending,
          value: formatMoney(overview.revenue.pending_amount, currency, locale),
          icon: "solar:wallet-money-linear",
          surface: "bg-[#fff7ed]",
          iconTone: "bg-[#fed7aa] text-[#9a3412]",
          stroke: "#ea580c",
          spark: sparkRevenue.linePath,
        },
        {
          key: "active-today",
          title: copy.activeToday,
          value: overview.chats.active_chats_today,
          icon: "solar:chat-round-check-linear",
          surface: "bg-[#f0fdf4]",
          iconTone: "bg-[#dcfce7] text-[#166534]",
          stroke: "#16a34a",
          spark: sparkMessages.linePath,
        },
        {
          key: "unread",
          title: copy.unread,
          value: overview.chats.unread_messages,
          icon: "solar:inbox-unread-linear",
          surface: "bg-[#eff6ff]",
          iconTone: "bg-[#dbeafe] text-[#1d4ed8]",
          stroke: "#2563eb",
          spark: sparkMessages.linePath,
        },
      ]
    : [];

  return (
    <DashboardLayout
      title={copy.pageTitle}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="dashboard"
    >
      <div className="space-y-4">
        {error ? (
          <Alert
            color="danger"
            title={locale === "ru" ? "Ошибка" : "Error"}
            description={error}
          />
        ) : null}

        {isLoading && !overview ? (
          <div className="grid gap-4">
            <Card shadow="none" className="border border-default-200 bg-white">
              <CardBody className="space-y-3 p-5">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-9 w-64 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-40 w-full rounded-md" />
              </CardBody>
            </Card>
          </div>
        ) : null}

        {!isLoading && overview ? (
          <>
            <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-5 p-5 sm:p-6">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-default-500">
                      {copy.analytics}
                    </p>
                    <h2 className="text-2xl font-semibold text-foreground sm:text-[2rem]">
                      {overview.company.name}
                    </h2>
                    <p className="max-w-3xl text-sm leading-6 text-default-600">
                      {copy.subtitle}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {quickCards.map((card) => (
                      <div
                        key={card.key}
                        className="rounded-large border border-default-200 bg-default-50 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${card.iconTone}`}
                          >
                            <Icon icon={card.icon} width={16} />
                          </span>
                          <p className="text-[11px] text-default-500">
                            {card.title}
                          </p>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-large border border-default-200 bg-default-50 p-3">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-default-700">
                        {copy.chartTitle}
                      </p>
                      <Tabs
                        size="sm"
                        selectedKey={range}
                        onSelectionChange={(key) => {
                          const next = String(key) as RangeKey;
                          setRange(next);
                        }}
                        classNames={{
                          base: "max-w-full overflow-x-auto",
                          tabList: "bg-white border border-default-200 p-1",
                          cursor:
                            "bg-default-100 border border-default-200 shadow-none",
                          tab: "text-default-500 data-[selected=true]:text-foreground px-3",
                        }}
                      >
                        <Tab key="6m" title={copy.range6m} />
                        <Tab key="3m" title={copy.range3m} />
                        <Tab key="30d" title={copy.range30d} />
                        <Tab key="7d" title={copy.range7d} />
                        <Tab key="24h" title={copy.range24h} />
                      </Tabs>
                    </div>

                    <svg
                      viewBox="0 0 980 220"
                      className="h-[220px] w-full rounded-medium border border-default-200 bg-white"
                      role="img"
                      aria-label={copy.chartTitle}
                    >
                      <defs>
                        <linearGradient
                          id="dashboard-area"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#111827"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="#111827"
                            stopOpacity="0.02"
                          />
                        </linearGradient>
                      </defs>

                      {[0.2, 0.4, 0.6, 0.8].map((percent) => {
                        const y = 16 + (280 - 32) * percent;

                        return (
                          <line
                            key={percent}
                            x1={16}
                            x2={964}
                            y1={y}
                            y2={y}
                            stroke="rgba(148, 163, 184, 0.45)"
                            strokeDasharray="6 6"
                          />
                        );
                      })}

                      <path
                        d={chartData.areaPath}
                        fill="url(#dashboard-area)"
                      />
                      <path
                        d={chartData.linePath}
                        fill="none"
                        stroke="#111827"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                      />

                      {chartData.points.length > 0 ? (
                        <circle
                          cx={chartData.points[chartData.points.length - 1].x}
                          cy={chartData.points[chartData.points.length - 1].y}
                          r={5}
                          fill="#ffffff"
                          stroke="#111827"
                          strokeWidth={2.5}
                        />
                      ) : null}
                    </svg>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                      {chartSeries.slice(-6).map((point) => (
                        <div
                          key={point.label}
                          className="rounded-medium border border-default-200 bg-white px-2.5 py-1.5"
                        >
                          <p className="text-[11px] text-default-500">
                            {point.label}
                          </p>
                          <p className="text-xs font-semibold text-foreground">
                            {point.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-default-500">{copy.planNow}</p>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {overview.subscription.plan?.name ?? copy.noPlan}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-large border border-default-200 bg-default-50 p-3">
                    <div className="flex items-center justify-between text-xs text-default-500">
                      <span>{copy.usageLabel}</span>
                      <span>{overview.limits.usage_percent}%</span>
                    </div>
                    <Progress
                      value={overview.limits.usage_percent}
                      size="sm"
                      classNames={{
                        track: "bg-default-100",
                        indicator: "bg-foreground",
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="rounded-medium border border-default-200 bg-white p-2">
                        <p className="text-[11px] text-default-500">
                          {copy.usedChats}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {overview.limits.used_chats}
                        </p>
                      </div>
                      <div className="rounded-medium border border-default-200 bg-white p-2">
                        <p className="text-[11px] text-default-500">
                          {copy.remainingChats}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {overview.limits.remaining_chats}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      [copy.includedChats, overview.limits.included_chats],
                      [copy.overageChats, overview.limits.overage_chats],
                      [copy.assistantLimit, overview.limits.assistant_limit],
                      [
                        copy.integrationLimit,
                        overview.limits.integrations_per_channel_limit,
                      ],
                      [
                        copy.overagePrice,
                        formatMoney(
                          overview.limits.overage_chat_price,
                          currency,
                          locale,
                        ),
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        className="flex items-center justify-between rounded-medium border border-default-200 bg-default-50 px-3 py-2"
                      >
                        <p className="text-sm text-default-600">{label}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-medium border border-default-200 bg-default-50 p-3">
                      <p className="text-[11px] text-default-500">
                        {copy.activeToday}
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {overview.chats.active_chats_today}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-3">
                      <p className="text-[11px] text-default-500">
                        {copy.unread}
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {overview.chats.unread_messages}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.ordersNew}
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {overview.operations.orders.new}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.ordersProgress}
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {overview.operations.orders.in_progress +
                          overview.operations.orders.appointments}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.ordersDone}
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {overview.operations.orders.completed +
                          overview.operations.orders.delivered}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr_0.9fr]">
              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.channels}
                  </h3>
                  <div className="space-y-2.5">
                    {overview.chats.channel_breakdown.length > 0 ? (
                      overview.chats.channel_breakdown.map((item) => (
                        <div
                          key={item.channel}
                          className="rounded-medium border border-default-200 bg-default-50 px-3 py-2.5"
                        >
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon={channelIcon(item.channel)}
                                width={18}
                                className="text-default-700"
                              />
                              <p className="text-sm font-medium text-foreground">
                                {channelLabel(item.channel, locale)}
                              </p>
                            </div>
                            <p className="text-xs text-default-500">
                              {item.chats} {copy.chatsLabel}
                            </p>
                          </div>
                          <Progress
                            value={Math.round(
                              (item.messages / maxChannelMessages) * 100,
                            )}
                            size="sm"
                            color="primary"
                            classNames={{ track: "bg-default-100" }}
                          />
                          <p className="mt-1 text-[11px] text-default-500">
                            {item.messages} {copy.messagesLabel}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-medium border border-default-200 bg-default-50 p-3 text-sm text-default-500">
                        -
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.operations}
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        label: copy.ordersNew,
                        value: overview.operations.orders.new,
                        icon: "solar:clipboard-list-linear",
                        tone: "bg-[#eff6ff] text-[#1d4ed8]",
                      },
                      {
                        label: copy.ordersProgress,
                        value:
                          overview.operations.orders.in_progress +
                          overview.operations.orders.appointments +
                          overview.operations.orders.confirmed,
                        icon: "solar:clock-circle-linear",
                        tone: "bg-[#fff7ed] text-[#c2410c]",
                      },
                      {
                        label: copy.ordersDone,
                        value:
                          overview.operations.orders.completed +
                          overview.operations.orders.delivered,
                        icon: "solar:check-circle-linear",
                        tone: "bg-[#ecfdf5] text-[#047857] ",
                      },

                      {
                        label: copy.appointments7d,
                        value: overview.operations.upcoming_appointments_7d,
                        icon: "solar:calendar-mark-linear",
                        tone: "bg-[#f0f9ff] text-[#0369a1]",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-medium border border-default-200 bg-default-50 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${item.tone}`}
                          >
                            <Icon icon={item.icon} width={16} />
                          </span>
                          <p className="text-sm text-default-700">
                            {item.label}
                          </p>
                        </div>
                        <p className="text-xl font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-4 p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.catalog}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2.5 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.assistants}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {overview.catalog.assistants_total}
                      </p>
                      <p className="text-[11px] text-default-500">
                        {overview.catalog.assistants_active} {copy.activeShort}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2.5 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.services}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {overview.catalog.services_total}
                      </p>
                      <p className="text-[11px] text-default-500">
                        {overview.catalog.services_active} {copy.activeShort}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-2.5 text-center">
                      <p className="text-[11px] text-default-500">
                        {copy.products}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {overview.catalog.products_total}
                      </p>
                      <p className="text-[11px] text-default-500">
                        {overview.catalog.products_active} {copy.activeShort}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-medium border border-default-200 bg-default-50 p-3">
                      <p className="text-xs text-default-500">
                        {copy.avgServicePrice}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatMoney(
                          overview.catalog.average_service_price,
                          currency,
                          locale,
                        )}
                      </p>
                    </div>
                    <div className="rounded-medium border border-default-200 bg-default-50 p-3">
                      <p className="text-xs text-default-500">
                        {copy.avgProductPrice}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatMoney(
                          overview.catalog.average_product_price,
                          currency,
                          locale,
                        )}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {copy.topServices}
                    </h3>
                    <Chip size="sm" variant="flat" color="default">
                      {overview.catalog.top_services.length}
                    </Chip>
                  </div>
                  {overview.catalog.top_services.length > 0 ? (
                    <div className="space-y-2">
                      {overview.catalog.top_services.map((service, index) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between rounded-medium border border-default-200 bg-default-50 px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {index + 1}. {service.name}
                            </p>
                            <p className="text-xs text-default-500">
                              {formatMoney(service.revenue, currency, locale)}
                            </p>
                          </div>
                          <Chip size="sm" color="primary" variant="flat">
                            {service.orders_count}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-medium border border-default-200 bg-default-50 p-3 text-sm text-default-500">
                      {copy.noServiceStats}
                    </p>
                  )}
                </CardBody>
              </Card>

              <Card
                shadow="none"
                className="border border-default-200 bg-white"
              >
                <CardBody className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.limits}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: copy.kpiChats,
                        value: overview.kpis.total_chats,
                        icon: "solar:chat-round-line-outline",
                      },
                      {
                        label: copy.kpiMessages,
                        value: overview.kpis.total_messages,
                        icon: "solar:chat-dots-linear",
                      },
                      {
                        label: copy.kpiClients,
                        value: overview.kpis.total_clients,
                        icon: "solar:users-group-rounded-linear",
                      },
                      {
                        label: copy.kpiAutomation,
                        value: `${overview.kpis.automation_rate_percent}%`,
                        icon: "solar:stars-line-duotone",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-medium border border-default-200 bg-default-50 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <Icon
                            icon={item.icon}
                            width={16}
                            className="text-default-700"
                          />
                          <p className="text-lg font-semibold text-foreground">
                            {item.value}
                          </p>
                        </div>
                        <p className="text-xs text-default-500">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </section>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
