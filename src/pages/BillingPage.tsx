import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Tab,
  Tabs,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  billingCheckoutRequest,
  billingInvoicesRequest,
  billingPayInvoiceRequest,
  billingPlansRequest,
  billingSubscriptionRequest,
  type BillingInvoice,
  type BillingPlan,
  type BillingSubscription,
  type BillingUsage,
} from "../billing/billingClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type ChipColor = "default" | "success" | "warning" | "danger" | "primary";
type BillingDurationTab = "30" | "90" | "180";

function resolveDurationTabByDays(days: number | null | undefined): BillingDurationTab {
  if (days === 90) {
    return "90";
  }

  if (days === 180) {
    return "180";
  }

  return "30";
}

function formatMoney(
  amount: string | number,
  currency: string,
  locale: "ru" | "en",
): string {
  const numericAmount = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(value: string | null, locale: "ru" | "en"): string {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
  }).format(parsedDate);
}

function formatCycle(days: number, locale: "ru" | "en"): string {
  if (days <= 0) {
    return locale === "ru" ? "30 дней" : "30 days";
  }

  return locale === "ru" ? `${days} дней` : `${days} days`;
}

function calculateUsagePercent(usage: BillingUsage | null): number {
  if (!usage) {
    return 0;
  }

  if (usage.included_chats <= 0) {
    return usage.used_chats > 0 ? 100 : 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((usage.used_chats / usage.included_chats) * 100)),
  );
}

function calculatePlanChangeCredit(
  selectedPlan: BillingPlan | null,
  currentPlan: BillingPlan | null,
  subscription: BillingSubscription | null,
  usage: BillingUsage | null,
): number {
  if (!selectedPlan || !currentPlan || !subscription || !usage) {
    return 0;
  }

  if (subscription.status !== "active") {
    return 0;
  }

  if (selectedPlan.currency !== currentPlan.currency) {
    return 0;
  }

  const includedChats = Math.max(usage.included_chats, 0);
  const usedChats = Math.max(usage.used_chats, 0);
  const remainingChats = Math.max(includedChats - usedChats, 0);

  if (includedChats <= 0 || remainingChats <= 0) {
    return 0;
  }

  const currentPlanPrice = Number(currentPlan.price);
  const currentQuantity = Math.max(subscription.quantity, 1);

  if (!Number.isFinite(currentPlanPrice) || currentPlanPrice <= 0) {
    return 0;
  }

  const credit =
    (currentPlanPrice * currentQuantity * remainingChats) / includedChats;

  if (!Number.isFinite(credit) || credit <= 0) {
    return 0;
  }

  const selectedPrice = Number(selectedPlan.price);

  if (!Number.isFinite(selectedPrice) || selectedPrice <= 0) {
    return 0;
  }

  return Math.min(credit, selectedPrice);
}

function calculatePlanChangeRawCredit(
  currentPlan: BillingPlan | null,
  subscription: BillingSubscription | null,
  usage: BillingUsage | null,
): number {
  if (!currentPlan || !subscription || !usage) {
    return 0;
  }

  if (subscription.status !== "active") {
    return 0;
  }

  const includedChats = Math.max(usage.included_chats, 0);
  const usedChats = Math.max(usage.used_chats, 0);
  const remainingChats = Math.max(includedChats - usedChats, 0);

  if (includedChats <= 0 || remainingChats <= 0) {
    return 0;
  }

  const currentPlanPrice = Number(currentPlan.price);
  const currentQuantity = Math.max(subscription.quantity, 1);

  if (!Number.isFinite(currentPlanPrice) || currentPlanPrice <= 0) {
    return 0;
  }

  const credit =
    (currentPlanPrice * currentQuantity * remainingChats) / includedChats;

  if (!Number.isFinite(credit) || credit <= 0) {
    return 0;
  }

  return credit;
}

function isDowngradePlan(
  selectedPlan: BillingPlan | null,
  currentPlan: BillingPlan | null,
  subscription: BillingSubscription | null,
): boolean {
  if (!selectedPlan || !currentPlan || !subscription) {
    return false;
  }

  if (subscription.status !== "active") {
    return false;
  }

  if (selectedPlan.code === currentPlan.code) {
    return false;
  }

  const selectedCycleMonths = Math.max(
    selectedPlan.billing_period_days / 30,
    1,
  );
  const currentCycleMonths = Math.max(currentPlan.billing_period_days / 30, 1);
  const selectedMonthly = Number(selectedPlan.price) / selectedCycleMonths;
  const currentMonthly = Number(currentPlan.price) / currentCycleMonths;

  const hasLowerLimits =
    selectedPlan.included_chats < currentPlan.included_chats ||
    selectedPlan.assistant_limit < currentPlan.assistant_limit ||
    selectedPlan.integrations_per_channel_limit <
      currentPlan.integrations_per_channel_limit;

  const hasLowerMonthlyPrice =
    Number.isFinite(selectedMonthly) &&
    Number.isFinite(currentMonthly) &&
    selectedMonthly < currentMonthly;

  return hasLowerLimits || hasLowerMonthlyPrice;
}

function getPlanDiscountPercent(plan: BillingPlan): number {
  if (!plan.features || typeof plan.features !== "object") {
    return 0;
  }

  const rawValue = (plan.features as Record<string, unknown>).discount_percent;
  const parsed = typeof rawValue === "number" ? rawValue : Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed);
}

function subscriptionStatus(
  status: string | null | undefined,
  billingMessages: ReturnType<typeof useI18n>["messages"]["billing"],
): { label: string; color: ChipColor } {
  switch (status) {
    case "active":
      return { label: billingMessages.statusActive, color: "success" };
    case "pending_payment":
      return { label: billingMessages.statusPendingPayment, color: "warning" };
    case "inactive":
      return { label: billingMessages.statusInactive, color: "default" };
    case "past_due":
      return { label: billingMessages.statusPastDue, color: "danger" };
    case "unpaid":
      return { label: billingMessages.statusUnpaid, color: "danger" };
    case "expired":
      return { label: billingMessages.statusExpired, color: "danger" };
    case "canceled":
      return { label: billingMessages.statusCanceled, color: "default" };
    default:
      return { label: billingMessages.statusUnknown, color: "default" };
  }
}

function invoiceStatus(
  status: string,
  billingMessages: ReturnType<typeof useI18n>["messages"]["billing"],
): { label: string; color: ChipColor } {
  switch (status) {
    case "pending":
      return { label: billingMessages.statusPending, color: "warning" };
    case "paid":
      return { label: billingMessages.statusPaid, color: "success" };
    case "issued":
      return { label: billingMessages.statusIssued, color: "warning" };
    case "overdue":
      return { label: billingMessages.statusOverdue, color: "danger" };
    case "failed":
      return { label: billingMessages.statusFailed, color: "danger" };
    case "void":
      return { label: billingMessages.statusVoid, color: "default" };
    default:
      return { label: billingMessages.statusUnknown, color: "default" };
  }
}

function localizeBillingMessage(
  rawMessage: string,
  billingMessages: ReturnType<typeof useI18n>["messages"]["billing"],
): string {
  const normalized = rawMessage.trim().toLowerCase();

  if (
    normalized ===
    "checkout created. complete payment to activate subscription."
  ) {
    return billingMessages.checkoutCreated;
  }

  if (normalized === "payment completed successfully.") {
    return billingMessages.paymentCompleted;
  }

  if (normalized === "payment session created. continue in alif.") {
    return billingMessages.paymentSessionCreated;
  }

  if (normalized === "invoice is already paid.") {
    return billingMessages.paymentAlreadyCompleted;
  }

  if (normalized === "unauthenticated.") {
    return billingMessages.unauthorized;
  }

  return rawMessage;
}

function billingErrorMessage(
  error: unknown,
  billingMessages: ReturnType<typeof useI18n>["messages"]["billing"],
): string {
  if (error instanceof ApiError) {
    return localizeBillingMessage(error.message, billingMessages);
  }

  if (error instanceof Error) {
    return localizeBillingMessage(error.message, billingMessages);
  }

  return billingMessages.loadFailed;
}

function isPayableInvoice(status: string): boolean {
  return status === "issued" || status === "overdue" || status === "failed";
}

function submitPostForm(url: string, payload: Record<string, string>): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.style.display = "none";

  for (const [key, value] of Object.entries(payload)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export default function BillingPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<BillingSubscription | null>(
    null,
  );
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [selectedPlanCode, setSelectedPlanCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<number | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPlanUpdaterOpen, setIsPlanUpdaterOpen] = useState(false);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [selectedDurationTab, setSelectedDurationTab] =
    useState<BillingDurationTab>("30");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  usePageSeo({
    title: `${messages.billing.title} | ${messages.app.name}`,
    description: messages.billing.subtitle,
    locale,
  });

  const loadBillingData = async (showLoader: boolean): Promise<void> => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.billing.unauthorized);
      setIsLoading(false);
      return;
    }

    if (showLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [planList, subscriptionResponse, invoiceList] = await Promise.all([
        billingPlansRequest(token),
        billingSubscriptionRequest(token),
        billingInvoicesRequest(token),
      ]);

      setPlans(planList);
      setSubscription(subscriptionResponse.subscription);
      setUsage(subscriptionResponse.usage);
      setInvoices(invoiceList);

      const hasActiveSubscription =
        subscriptionResponse.subscription?.status === "active";
      setIsPlanUpdaterOpen((currentValue) =>
        hasActiveSubscription ? currentValue : true,
      );

      const currentSubscriptionPlanCode =
        subscriptionResponse.subscription?.plan?.code;

      const initialPlanCode =
        currentSubscriptionPlanCode &&
        planList.some((plan) => plan.code === currentSubscriptionPlanCode)
          ? currentSubscriptionPlanCode
          : planList[0]?.code ?? "";

      const initialPlan = planList.find((plan) => plan.code === initialPlanCode) ?? null;
      const initialTab = resolveDurationTabByDays(initialPlan?.billing_period_days);
      const plansForTab = planList.filter(
        (plan) => String(plan.billing_period_days) === initialTab,
      );
      const normalizedPlanCode = plansForTab.some((plan) => plan.code === initialPlanCode)
        ? initialPlanCode
        : plansForTab[0]?.code ?? initialPlanCode;

      setSelectedDurationTab(initialTab);
      setSelectedPlanCode(normalizedPlanCode);
    } catch (error) {
      setGlobalError(billingErrorMessage(error, messages.billing));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadBillingData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.code === selectedPlanCode) ?? null,
    [plans, selectedPlanCode],
  );

  const visiblePlans = useMemo(
    () =>
      plans.filter(
        (plan) => String(plan.billing_period_days) === selectedDurationTab,
      ),
    [plans, selectedDurationTab],
  );

  const currentPlan = useMemo(() => {
    const currentSubscriptionPlanCode = subscription?.plan?.code;

    if (currentSubscriptionPlanCode) {
      const match = plans.find(
        (plan) => plan.code === currentSubscriptionPlanCode,
      );

      if (match) {
        return match;
      }
    }

    return selectedPlan;
  }, [plans, selectedPlan, subscription?.plan?.code]);

  const rawPlanCredit = useMemo(
    () => calculatePlanChangeRawCredit(currentPlan, subscription, usage),
    [currentPlan, subscription, usage],
  );
  const planChangeCredit = useMemo(
    () =>
      calculatePlanChangeCredit(selectedPlan, currentPlan, subscription, usage),
    [selectedPlan, currentPlan, subscription, usage],
  );
  const forfeitedCredit = useMemo(() => {
    if (!selectedPlan) {
      return 0;
    }

    return Math.max(rawPlanCredit - Number(selectedPlan.price), 0);
  }, [rawPlanCredit, selectedPlan]);
  const totalToPay = selectedPlan
    ? Math.max(Number(selectedPlan.price) - planChangeCredit, 0)
    : 0;
  const usagePercent = calculateUsagePercent(usage);
  const hasActiveSubscription = subscription?.status === "active";
  const showPlanUpdater = !hasActiveSubscription || isPlanUpdaterOpen;
  const isDowngradeSelected = useMemo(
    () => isDowngradePlan(selectedPlan, currentPlan, subscription),
    [selectedPlan, currentPlan, subscription],
  );
  const requiresDowngradeConfirmation =
    isDowngradeSelected && forfeitedCredit > 0;

  const subscriptionStatusInfo = subscriptionStatus(
    subscription?.status,
    messages.billing,
  );

  const usageCards = [
    {
      key: "included",
      icon: "solar:chat-line-linear",
      label: messages.billing.includedChats,
      value: String(usage?.included_chats ?? 0),
    },
    {
      key: "used",
      icon: "solar:chat-round-dots-linear",
      label: messages.billing.usedChats,
      value: String(usage?.used_chats ?? 0),
    },
    {
      key: "remaining",
      icon: "solar:clock-circle-linear",
      label: messages.billing.remainingChats,
      value: String(usage?.remaining_chats ?? 0),
    },
    {
      key: "overage",
      icon: "solar:danger-triangle-linear",
      label: messages.billing.overageChats,
      value: String(usage?.overage_chats ?? 0),
    },
    {
      key: "assistants",
      icon: "solar:users-group-rounded-linear",
      label: messages.billing.assistantLimit,
      value: String(usage?.assistant_limit ?? 0),
    },
    {
      key: "integrations",
      icon: "solar:link-minimalistic-2-linear",
      label: messages.billing.integrationLimit,
      value: String(usage?.integrations_per_channel_limit ?? 0),
    },
  ];

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setGlobalError(null);
    setGlobalSuccess(null);
    await loadBillingData(false);
  };

  const performCheckout = async (): Promise<void> => {
    setGlobalError(null);
    setGlobalSuccess(null);

    if (!selectedPlanCode) {
      setGlobalError(messages.billing.checkoutFailed);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.billing.unauthorized);
      return;
    }

    setIsCheckingOut(true);

    try {
      const checkoutResponse = await billingCheckoutRequest(token, {
        plan_code: selectedPlanCode,
        quantity: 1,
      });

      setGlobalSuccess(
        localizeBillingMessage(checkoutResponse.message, messages.billing),
      );
      await loadBillingData(false);
    } catch (error) {
      setGlobalError(billingErrorMessage(error, messages.billing));
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async (): Promise<void> => {
    if (requiresDowngradeConfirmation) {
      setIsDowngradeModalOpen(true);
      return;
    }

    await performCheckout();
  };

  const handleConfirmDowngradeCheckout = async (): Promise<void> => {
    setIsDowngradeModalOpen(false);
    await performCheckout();
  };

  const handleDurationTabChange = (nextKey: string): void => {
    if (nextKey !== "30" && nextKey !== "90" && nextKey !== "180") {
      return;
    }

    const normalizedTab = nextKey as BillingDurationTab;
    const plansForTab = plans.filter(
      (plan) => String(plan.billing_period_days) === normalizedTab,
    );

    setSelectedDurationTab(normalizedTab);
    setSelectedPlanCode((currentCode) => {
      if (plansForTab.some((plan) => plan.code === currentCode)) {
        return currentCode;
      }

      return plansForTab[0]?.code ?? currentCode;
    });
  };

  const handlePayInvoice = async (invoiceId: number): Promise<void> => {
    setGlobalError(null);
    setGlobalSuccess(null);

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.billing.unauthorized);
      return;
    }

    setPayingInvoiceId(invoiceId);

    try {
      const paymentResponse = await billingPayInvoiceRequest(token, invoiceId);

      if (
        paymentResponse.payment?.provider === "alifbank" &&
        paymentResponse.payment.method === "post" &&
        paymentResponse.payment.checkout_url
      ) {
        setGlobalSuccess(
          localizeBillingMessage(paymentResponse.message, messages.billing),
        );
        submitPostForm(
          paymentResponse.payment.checkout_url,
          paymentResponse.payment.payload,
        );
        return;
      }

      setGlobalSuccess(
        localizeBillingMessage(paymentResponse.message, messages.billing),
      );
      setIsPlanUpdaterOpen(false);
      await loadBillingData(false);
    } catch (error) {
      setGlobalError(billingErrorMessage(error, messages.billing));
    } finally {
      setPayingInvoiceId(null);
    }
  };

  return (
    <DashboardLayout
      title={messages.billing.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="billing"
    >
      <div className="space-y-4">
        <Modal
          isOpen={isDowngradeModalOpen}
          onOpenChange={setIsDowngradeModalOpen}
          placement="center"
        >
          <ModalContent>
            <ModalHeader>{messages.billing.downgradeWarningTitle}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-default-700">
                {messages.billing.downgradeWarningDescription}
              </p>
              <p className="text-sm font-semibold text-danger-600">
                {messages.billing.downgradeWarningForfeit}:{" "}
                {selectedPlan
                  ? formatMoney(forfeitedCredit, selectedPlan.currency, locale)
                  : formatMoney("0", "USD", locale)}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setIsDowngradeModalOpen(false)}
                isDisabled={isCheckingOut}
              >
                {messages.billing.downgradeCancelButton}
              </Button>
              <Button
                color="danger"
                onPress={handleConfirmDowngradeCheckout}
                isLoading={isCheckingOut}
              >
                {messages.billing.downgradeConfirmButton}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {globalError ? (
          <Alert
            color="danger"
            title={messages.billing.errorTitle}
            description={globalError}
            variant="flat"
          />
        ) : null}

        {globalSuccess ? (
          <Alert
            color="success"
            title={messages.billing.successTitle}
            description={globalSuccess}
            variant="flat"
          />
        ) : null}

        <div
          className={`grid grid-cols-1 gap-4 ${
            hasActiveSubscription
              ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              : ""
          }`}
        >
          {hasActiveSubscription ? (
            <Card shadow="none" className="border border-default-200 bg-white">
              <CardBody className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-default-500">
                      {messages.billing.currentSubscriptionTitle}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    color={subscriptionStatusInfo.color}
                    variant="flat"
                  >
                    {subscriptionStatusInfo.label}
                  </Chip>
                </div>

                <div className="rounded-large bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">
                        {subscription?.plan?.name ?? "-"}
                      </p>
                    </div>
                    <p className="text-xl font-bold">
                      {currentPlan
                        ? formatMoney(
                            currentPlan.price,
                            currentPlan.currency,
                            locale,
                          )
                        : formatMoney("0", "TJS", locale)}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/90">
                    <p>
                      {messages.billing.cycleLabel}:{" "}
                      <strong>
                        {formatCycle(
                          subscription?.billing_cycle_days ?? 30,
                          locale,
                        )}
                      </strong>
                    </p>
                    <p>
                      {messages.billing.expiresLabel}:{" "}
                      <strong>
                        {formatDate(subscription?.expires_at ?? null, locale)}
                      </strong>
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-white/85">
                      <span>{messages.billing.usageProgress}</span>
                      <span className="font-semibold text-white">
                        {usagePercent}%
                      </span>
                    </div>
                    <Progress
                      aria-label={messages.billing.usageProgress}
                      value={usagePercent}
                      size="sm"
                      color="default"
                      classNames={{
                        track: "bg-white/25",
                        indicator: "bg-white",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="bordered"
                    onPress={handleRefresh}
                    isLoading={isRefreshing}
                  >
                    {messages.billing.refreshButton}
                  </Button>
                  <Button
                    color="primary"
                    variant={isPlanUpdaterOpen ? "solid" : "flat"}
                    onPress={() => setIsPlanUpdaterOpen((current) => !current)}
                  >
                    {isPlanUpdaterOpen
                      ? messages.billing.hidePlanUpdateButton
                      : messages.billing.updatePlanButton}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : null}

          {hasActiveSubscription ? (
            <Card shadow="none" className="border border-default-200 bg-white">
              <CardBody className="space-y-3 p-5">
                <p className="text-sm font-medium text-default-500">
                  {messages.billing.usageTitle}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {usageCards.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-medium border border-default-200 bg-default-50 p-3"
                    >
                      <div className="flex items-center gap-1.5 text-default-500">
                        <Icon icon={item.icon} width={14} />
                        <p className="text-[11px] leading-tight">
                          {item.label}
                        </p>
                      </div>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>

        {showPlanUpdater ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="space-y-4 p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {locale === "ru"
                    ? "Доступные тарифы для вас"
                    : "Available plans for you"}
                </h2>
                <p className="text-sm text-default-500">
                  {locale === "ru"
                    ? "Выберите подходящий тариф и выставьте счет."
                    : "Choose the right plan and create an invoice."}
                </p>
              </div>

              <Tabs
                aria-label={locale === "ru" ? "Период тарифа" : "Plan duration"}
                selectedKey={selectedDurationTab}
                onSelectionChange={(key) =>
                  handleDurationTabChange(String(key))
                }
                color="primary"
                variant="bordered"
                radius="full"
                size="sm"
                fullWidth
                disableAnimation
              >
                <Tab key="30" title={locale === "ru" ? "1 месяц" : "1 month"} />
                <Tab
                  key="90"
                  title={
                    <span
                      className={`inline-flex items-center gap-2 ${
                        selectedDurationTab === "90" ? "py-0.5 pr-0.5" : ""
                      }`}
                    >
                      <span>{locale === "ru" ? "3 месяца" : "3 months"}</span>
                      <span className="rounded-full bg-success-100 px-2 py-0 text-[11px] font-semibold text-success-700">
                        -10%
                      </span>
                    </span>
                  }
                />
                <Tab
                  key="180"
                  title={
                    <span
                      className={`inline-flex items-center gap-2 ${
                        selectedDurationTab === "180" ? "py-0.5 pr-0" : ""
                      }`}
                    >
                      <span>{locale === "ru" ? "6 месяцев" : "6 months"}</span>
                      <span className="rounded-full bg-success-100 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                        -20%
                      </span>
                    </span>
                  }
                />
              </Tabs>

              {visiblePlans.length === 0 ? (
                <p className="text-sm text-default-500">
                  {messages.billing.noPlansAvailable}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {visiblePlans.map((plan) => {
                    const isSelected = selectedPlanCode === plan.code;
                    const discountPercent = getPlanDiscountPercent(plan);

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanCode(plan.code)}
                        className={`rounded-large border p-4 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-default-200 bg-white hover:bg-default-50"
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-base font-semibold text-foreground">
                              {plan.name}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                              <p className="text-xs text-default-500">
                                {formatCycle(plan.billing_period_days, locale)}
                              </p>
                              {discountPercent > 0 ? (
                                <Chip size="sm" color="success" variant="flat">
                                  {locale === "ru"
                                    ? `Скидка ${discountPercent}%`
                                    : `Save ${discountPercent}%`}
                                </Chip>
                              ) : null}
                            </div>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {formatMoney(plan.price, plan.currency, locale)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon icon="solar:chat-line-linear" width={16} />
                            <span>
                              {messages.billing.includedChats}:{" "}
                              {plan.included_chats}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon
                              icon="solar:users-group-rounded-linear"
                              width={16}
                            />
                            <span>
                              {messages.billing.assistantLimit}:{" "}
                              {plan.assistant_limit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon
                              icon="solar:link-minimalistic-2-linear"
                              width={16}
                            />
                            <span>
                              {messages.billing.integrationLimit}:{" "}
                              {plan.integrations_per_channel_limit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon
                              icon="solar:dollar-minimalistic-linear"
                              width={16}
                            />
                            <span>
                              {locale === "ru"
                                ? `После исчерпания лимита: ${formatMoney(
                                    plan.overage_chat_price,
                                    plan.currency,
                                    locale,
                                  )} за 1 чат`
                                : `After included limit: ${formatMoney(
                                    plan.overage_chat_price,
                                    plan.currency,
                                    locale,
                                  )} per extra chat`}
                            </span>
                          </div>

                          <div className="pt-1 text-xs font-medium text-default-500">
                            {locale === "ru"
                              ? "Доступные каналы интеграции"
                              : "Available channels"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon icon="fa6-brands:instagram" width={15} />
                            <span>
                              {locale === "ru" ? "Instagram" : "Instagram"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon icon="solar:plain-2-linear" width={16} />
                            <span>
                              {locale === "ru" ? "Telegram" : "Telegram"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon icon="solar:widget-2-linear" width={16} />
                            <span>
                              {locale === "ru"
                                ? "Виджет чата для сайта"
                                : "Website chat widget"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-default-700">
                            <Icon icon="solar:code-square-linear" width={16} />
                            <span>
                              {locale === "ru"
                                ? "API интеграция"
                                : "API integration"}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-xs font-medium text-primary">
                            <Icon icon="solar:check-circle-linear" width={14} />
                            <span>{messages.billing.selectedPlan}</span>
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-medium border border-default-200 bg-default-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-default-500">
                    {messages.billing.totalToPayLabel}
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {selectedPlan
                      ? formatMoney(totalToPay, selectedPlan.currency, locale)
                      : formatMoney("0", "TJS", locale)}
                  </p>
                  {planChangeCredit > 0 && selectedPlan ? (
                    <p className="text-xs text-success-600">
                      {messages.billing.creditAppliedLabel}:{" "}
                      {formatMoney(
                        planChangeCredit,
                        selectedPlan.currency,
                        locale,
                      )}
                    </p>
                  ) : null}
                </div>

                <Button
                  color="primary"
                  isLoading={isCheckingOut}
                  onPress={handleCheckout}
                >
                  {isCheckingOut
                    ? messages.billing.checkoutProcessing
                    : messages.billing.checkoutButton}
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : null}

        <Card shadow="none" className="border border-default-200 bg-white">
          <CardBody className="space-y-3 p-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {messages.billing.invoicesTitle}
              </h2>
              <p className="text-sm text-default-500">
                {messages.billing.invoicesSubtitle}
              </p>
            </div>

            {isLoading ? (
              <p className="text-sm text-default-500">
                {messages.common.loadingSession}
              </p>
            ) : invoices.length === 0 ? (
              <p className="text-sm text-default-500">
                {messages.billing.noInvoices}
              </p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => {
                  const statusInfo = invoiceStatus(
                    invoice.status,
                    messages.billing,
                  );
                  const canPay = isPayableInvoice(invoice.status);

                  return (
                    <div
                      key={invoice.id}
                      className="flex flex-col gap-3 rounded-medium border border-default-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                          {invoice.number}
                        </p>
                        <p className="text-xs text-default-500">
                          {messages.billing.invoiceDate}:{" "}
                          {formatDate(invoice.created_at, locale)}
                        </p>
                        <p className="text-xs text-default-500">
                          {messages.billing.invoiceDue}:{" "}
                          {formatDate(invoice.due_at, locale)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {formatMoney(invoice.total, invoice.currency, locale)}
                        </p>
                        <Chip size="sm" color={statusInfo.color} variant="flat">
                          {statusInfo.label}
                        </Chip>
                        {canPay ? (
                          <Button
                            size="sm"
                            color="primary"
                            isLoading={payingInvoiceId === invoice.id}
                            onPress={() => handlePayInvoice(invoice.id)}
                          >
                            {payingInvoiceId === invoice.id
                              ? messages.billing.payingButton
                              : messages.billing.payButton}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
