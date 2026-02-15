import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
  Switch,
  Textarea,
} from "@heroui/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { ApiError } from "../auth/authClient";
import { getAuthToken } from "../auth/authStorage";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  companySettingsRequest,
  companySettingsUpdateRequest,
  type BusinessAccountType,
  type BusinessDaySchedule,
  type BusinessWeekDay,
  type CompanyBusinessProfile,
} from "../company/companySettingsClient";
import type { Messages } from "../i18n/messages";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type FormState = {
  name: string;
  shortDescription: string;
  industry: string;
  primaryGoal: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  accountType: BusinessAccountType;
  businessAddress: string;
  businessTimezone: string;
  businessCurrency: string;
  businessSchedule: Record<BusinessWeekDay, BusinessDaySchedule>;
  appointmentSlotMinutes: number;
  appointmentBufferMinutes: number;
  appointmentMaxDaysAhead: number;
  appointmentAutoConfirm: boolean;
  deliveryEnabled: boolean;
  deliveryRequireAddress: boolean;
  deliveryRequireDateTime: boolean;
  deliveryDefaultEtaMinutes: number;
  deliveryFee: string;
  deliveryFreeFromAmount: string;
  deliveryAvailableFrom: string;
  deliveryAvailableTo: string;
  deliveryNotes: string;
  orderRequiredFields: Array<
    "client_name" | "phone" | "service_name" | "address" | "amount" | "note"
  >;
  appointmentRequiredFields: Array<
    | "client_name"
    | "phone"
    | "service_name"
    | "address"
    | "appointment_date"
    | "appointment_time"
    | "appointment_duration_minutes"
    | "amount"
    | "note"
  >;
  aiResponseLanguages: Array<
    "ru" | "en" | "tg" | "uz" | "tr" | "fa" | "kk" | "ar"
  >;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

type ApiValidationError = {
  errors?: Record<string, string[]>;
};

type BusinessSettingsTabKey =
  | "profile"
  | "delivery"
  | "required"
  | "aiLanguages"
  | "schedule"
  | "booking";

const SLOT_OPTIONS = [15, 30, 45, 60, 90, 120];
const BUFFER_OPTIONS = [0, 5, 10, 15, 20, 30];
const WEEK_DAYS: BusinessWeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const COMMON_TIMEZONES = [
  "Asia/Dushanbe",
  "Asia/Tashkent",
  "Asia/Almaty",
  "Asia/Bishkek",
  "Asia/Samarkand",
  "Asia/Dubai",
  "Asia/Istanbul",
  "Europe/Moscow",
  "Europe/Berlin",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "UTC",
];

const BUSINESS_CURRENCY_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "TJS", label: "TJS" },
  { key: "USD", label: "USD" },
  { key: "EUR", label: "EUR" },
  { key: "RUB", label: "RUB" },
  { key: "UZS", label: "UZS" },
  { key: "KZT", label: "KZT" },
];

const ORDER_REQUIRED_OPTIONS: Array<{
  key: "client_name" | "phone" | "service_name" | "address" | "amount" | "note";
  labelKey:
    | "requiredFieldClientName"
    | "requiredFieldPhone"
    | "requiredFieldService"
    | "requiredFieldAddress"
    | "requiredFieldAmount"
    | "requiredFieldNote";
}> = [
  { key: "client_name", labelKey: "requiredFieldClientName" },
  { key: "phone", labelKey: "requiredFieldPhone" },
  { key: "service_name", labelKey: "requiredFieldService" },
  { key: "address", labelKey: "requiredFieldAddress" },
  { key: "amount", labelKey: "requiredFieldAmount" },
  { key: "note", labelKey: "requiredFieldNote" },
];

const APPOINTMENT_REQUIRED_OPTIONS: Array<{
  key:
    | "client_name"
    | "phone"
    | "service_name"
    | "address"
    | "appointment_date"
    | "appointment_time"
    | "appointment_duration_minutes"
    | "amount"
    | "note";
  labelKey:
    | "requiredFieldClientName"
    | "requiredFieldPhone"
    | "requiredFieldService"
    | "requiredFieldAddress"
    | "requiredFieldAppointmentDate"
    | "requiredFieldAppointmentTime"
    | "requiredFieldAppointmentDuration"
    | "requiredFieldAmount"
    | "requiredFieldNote";
}> = [
  { key: "client_name", labelKey: "requiredFieldClientName" },
  { key: "phone", labelKey: "requiredFieldPhone" },
  { key: "service_name", labelKey: "requiredFieldService" },
  { key: "address", labelKey: "requiredFieldAddress" },
  { key: "appointment_date", labelKey: "requiredFieldAppointmentDate" },
  { key: "appointment_time", labelKey: "requiredFieldAppointmentTime" },
  {
    key: "appointment_duration_minutes",
    labelKey: "requiredFieldAppointmentDuration",
  },
  { key: "amount", labelKey: "requiredFieldAmount" },
  { key: "note", labelKey: "requiredFieldNote" },
];

const AI_RESPONSE_LANGUAGE_OPTIONS: Array<{
  key: "ru" | "en" | "tg" | "uz" | "tr" | "fa" | "kk" | "ar";
  labelKey:
    | "aiLanguageRu"
    | "aiLanguageEn"
    | "aiLanguageTg"
    | "aiLanguageUz"
    | "aiLanguageTr"
    | "aiLanguageFa"
    | "aiLanguageKk"
    | "aiLanguageAr";
}> = [
  { key: "ru", labelKey: "aiLanguageRu" },
  { key: "en", labelKey: "aiLanguageEn" },
  { key: "tg", labelKey: "aiLanguageTg" },
  { key: "uz", labelKey: "aiLanguageUz" },
  { key: "tr", labelKey: "aiLanguageTr" },
  { key: "fa", labelKey: "aiLanguageFa" },
  { key: "kk", labelKey: "aiLanguageKk" },
  { key: "ar", labelKey: "aiLanguageAr" },
];

function defaultSchedule(): Record<BusinessWeekDay, BusinessDaySchedule> {
  return {
    monday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    tuesday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    wednesday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    thursday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    friday: { is_day_off: false, start_time: "09:00", end_time: "18:00" },
    saturday: { is_day_off: true, start_time: null, end_time: null },
    sunday: { is_day_off: true, start_time: null, end_time: null },
  };
}

function normalizeSchedule(
  value: Record<BusinessWeekDay, BusinessDaySchedule> | null | undefined,
): Record<BusinessWeekDay, BusinessDaySchedule> {
  const defaults = defaultSchedule();

  if (!value) {
    return defaults;
  }

  const normalized = { ...defaults };

  for (const day of WEEK_DAYS) {
    const dayValue = value[day];

    if (!dayValue || typeof dayValue !== "object") {
      normalized[day] = defaults[day];
      continue;
    }

    const isDayOff = Boolean(dayValue.is_day_off);

    normalized[day] = {
      is_day_off: isDayOff,
      start_time: isDayOff
        ? null
        : dayValue.start_time ?? defaults[day].start_time,
      end_time: isDayOff ? null : dayValue.end_time ?? defaults[day].end_time,
    };
  }

  return normalized;
}

function dayLabel(day: BusinessWeekDay, messages: Messages): string {
  switch (day) {
    case "monday":
      return messages.businessSettings.mondayLabel;
    case "tuesday":
      return messages.businessSettings.tuesdayLabel;
    case "wednesday":
      return messages.businessSettings.wednesdayLabel;
    case "thursday":
      return messages.businessSettings.thursdayLabel;
    case "friday":
      return messages.businessSettings.fridayLabel;
    case "saturday":
      return messages.businessSettings.saturdayLabel;
    case "sunday":
      return messages.businessSettings.sundayLabel;
    default:
      return day;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function mapCompanyToForm(company: CompanyBusinessProfile): FormState {
  return {
    name: company.name ?? "",
    shortDescription: company.short_description ?? "",
    industry: company.industry ?? "",
    primaryGoal: company.primary_goal ?? "",
    contactEmail: company.contact_email ?? "",
    contactPhone: company.contact_phone ?? "",
    website: company.website ?? "",
    accountType: company.settings.account_type,
    businessAddress: company.settings.business.address ?? "",
    businessTimezone: company.settings.business.timezone ?? "UTC",
    businessCurrency: company.settings.business.currency ?? "TJS",
    businessSchedule: normalizeSchedule(company.settings.business.schedule),
    appointmentSlotMinutes: company.settings.appointment.slot_minutes,
    appointmentBufferMinutes: company.settings.appointment.buffer_minutes,
    appointmentMaxDaysAhead: company.settings.appointment.max_days_ahead,
    appointmentAutoConfirm: company.settings.appointment.auto_confirm,
    deliveryEnabled: company.settings.delivery.enabled,
    deliveryRequireAddress: company.settings.delivery.require_delivery_address,
    deliveryRequireDateTime:
      company.settings.delivery.require_delivery_datetime,
    deliveryDefaultEtaMinutes: company.settings.delivery.default_eta_minutes,
    deliveryFee: String(company.settings.delivery.fee ?? 0),
    deliveryFreeFromAmount:
      company.settings.delivery.free_from_amount === null
        ? ""
        : String(company.settings.delivery.free_from_amount),
    deliveryAvailableFrom: company.settings.delivery.available_from ?? "09:00",
    deliveryAvailableTo: company.settings.delivery.available_to ?? "21:00",
    deliveryNotes: company.settings.delivery.notes ?? "",
    orderRequiredFields: company.settings.crm.order_required_fields ?? [
      "phone",
      "service_name",
      "address",
    ],
    appointmentRequiredFields: company.settings.crm
      .appointment_required_fields ?? [
      "phone",
      "service_name",
      "address",
      "appointment_date",
      "appointment_time",
      "appointment_duration_minutes",
    ],
    aiResponseLanguages: company.settings.ai?.response_languages ?? ["ru"],
  };
}

function extractFieldErrors(error: ApiError): FieldErrors {
  const data = isObject(error.data)
    ? (error.data as ApiValidationError)
    : undefined;
  const validationErrors = data?.errors;

  if (!validationErrors) {
    return {};
  }

  const first = (key: string): string | undefined => {
    const value = validationErrors[key];

    if (!Array.isArray(value)) {
      return undefined;
    }

    const head = value[0];
    return typeof head === "string" ? head : undefined;
  };

  return {
    name: first("name"),
    shortDescription: first("short_description"),
    industry: first("industry"),
    primaryGoal: first("primary_goal"),
    contactEmail: first("contact_email"),
    contactPhone: first("contact_phone"),
    website: first("website"),
    businessTimezone: first("settings.business.timezone"),
    businessCurrency: first("settings.business.currency"),
    appointmentMaxDaysAhead: first("settings.appointment.max_days_ahead"),
  };
}

export default function BusinessSettingsPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<FormState | null>(null);
  const [activeTab, setActiveTab] = useState<BusinessSettingsTabKey>("profile");

  usePageSeo({
    title: `${messages.businessSettings.title} | ${messages.app.name}`,
    description: messages.businessSettings.subtitle,
    locale,
  });

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.businessSettings.unauthorized);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setGlobalError(null);

      try {
        const response = await companySettingsRequest(token);
        setForm(mapCompanyToForm(response.company));
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : messages.businessSettings.loadFailed;
        setGlobalError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [
    messages.businessSettings.loadFailed,
    messages.businessSettings.unauthorized,
  ]);

  const isAppointmentAccount = form?.accountType === "with_appointments";

  const timezoneOptions = useMemo(() => {
    const values = new Set(COMMON_TIMEZONES);

    if (form?.businessTimezone) {
      values.add(form.businessTimezone);
    }

    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [form?.businessTimezone]);

  const validateSchedule = (
    schedule: Record<BusinessWeekDay, BusinessDaySchedule>,
  ): boolean => {
    for (const day of WEEK_DAYS) {
      const row = schedule[day];

      if (row.is_day_off) {
        continue;
      }

      const start = row.start_time ?? "";
      const end = row.end_time ?? "";

      if (start === "" || end === "" || end <= start) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form) {
      return;
    }

    setGlobalError(null);
    setGlobalSuccess(null);
    setFieldErrors({});

    if (form.name.trim().length < 2) {
      setFieldErrors((prev) => ({
        ...prev,
        name: messages.businessSettings.nameValidation,
      }));
      return;
    }

    if (form.aiResponseLanguages.length === 0) {
      setGlobalError(messages.businessSettings.aiLanguageRequiredValidation);
      return;
    }

    if (!validateSchedule(form.businessSchedule)) {
      setGlobalError(messages.businessSettings.invalidScheduleRange);
      return;
    }

    if (
      form.deliveryEnabled &&
      form.deliveryAvailableTo <= form.deliveryAvailableFrom
    ) {
      setGlobalError(messages.businessSettings.invalidDeliveryRange);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.businessSettings.unauthorized);
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryFeeNumber = Number(form.deliveryFee);
      if (!Number.isFinite(deliveryFeeNumber) || deliveryFeeNumber < 0) {
        setGlobalError(messages.businessSettings.invalidDeliveryFee);
        setIsSubmitting(false);
        return;
      }

      const deliveryFreeFromRaw = form.deliveryFreeFromAmount.trim();
      const deliveryFreeFromNumber =
        deliveryFreeFromRaw === "" ? null : Number(deliveryFreeFromRaw);
      if (
        deliveryFreeFromRaw !== "" &&
        (!Number.isFinite(deliveryFreeFromNumber) ||
          (deliveryFreeFromNumber ?? 0) < 0)
      ) {
        setGlobalError(messages.businessSettings.invalidDeliveryFreeFromAmount);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        short_description: toNullable(form.shortDescription),
        industry: toNullable(form.industry),
        primary_goal: toNullable(form.primaryGoal),
        contact_email: toNullable(form.contactEmail),
        contact_phone: toNullable(form.contactPhone),
        website: toNullable(form.website),
        settings: {
          account_type: form.accountType,
          business: {
            address: toNullable(form.businessAddress),
            timezone: form.businessTimezone,
            currency: form.businessCurrency,
            schedule: form.businessSchedule,
          },
          appointment: {
            enabled: form.accountType === "with_appointments",
            slot_minutes: form.appointmentSlotMinutes,
            buffer_minutes: form.appointmentBufferMinutes,
            max_days_ahead: form.appointmentMaxDaysAhead,
            auto_confirm: form.appointmentAutoConfirm,
          },
          delivery: {
            enabled: form.deliveryEnabled,
            require_delivery_address: form.deliveryRequireAddress,
            require_delivery_datetime: form.deliveryRequireDateTime,
            default_eta_minutes: form.deliveryDefaultEtaMinutes,
            fee: Number(deliveryFeeNumber.toFixed(2)),
            free_from_amount:
              deliveryFreeFromNumber === null
                ? null
                : Number(deliveryFreeFromNumber.toFixed(2)),
            available_from: form.deliveryAvailableFrom,
            available_to: form.deliveryAvailableTo,
            notes: toNullable(form.deliveryNotes),
          },
          crm: {
            order_required_fields: form.orderRequiredFields,
            appointment_required_fields: form.appointmentRequiredFields,
          },
          ai: {
            response_languages: form.aiResponseLanguages,
          },
        },
      } as const;

      const response = await companySettingsUpdateRequest(token, payload);
      setForm(mapCompanyToForm(response.company));
      setGlobalSuccess(messages.businessSettings.saveSuccess);
    } catch (error) {
      if (error instanceof ApiError) {
        const nextFieldErrors = extractFieldErrors(error);

        if (Object.values(nextFieldErrors).some((value) => value)) {
          setFieldErrors(nextFieldErrors);
        } else {
          setGlobalError(error.message);
        }
      } else {
        setGlobalError(messages.businessSettings.saveFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title={messages.businessSettings.title}
      user={user}
      onLogout={logout}
      isLoggingOut={false}
      defaultSelectedKey="business-settings"
    >
      <div className="space-y-4">
        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.businessSettings.errorTitle}
            description={globalError}
          />
        ) : null}

        {globalSuccess ? (
          <Alert
            color="success"
            variant="faded"
            title={messages.businessSettings.successTitle}
            description={globalSuccess}
          />
        ) : null}

        {isLoading || !form ? (
          <div className="rounded-large border border-default-200 bg-white p-8">
            <Spinner label={messages.businessSettings.loading} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) =>
                setActiveTab(String(key) as BusinessSettingsTabKey)
              }
              size="sm"
              radius="sm"
              variant="light"
              classNames={{
                base: "w-full",
                tabList:
                  "w-full max-w-full overflow-x-auto rounded-full border border-default-200 bg-white p-1 flex-nowrap gap-1",
                tab: "flex-none shrink-0 w-auto px-4 rounded-full border-none data-[selected=true]:bg-primary data-[selected=true]:text-white data-[selected=true]:shadow-none",
                tabContent:
                  "text-default-600 group-data-[selected=true]:text-white",
                cursor: "hidden",
                panel: "w-full px-0 pt-4",
              }}
            >
              <Tab
                key="profile"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.profileTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-5 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.profileTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.subtitle}
                  </p>
                </div>

                <Select
                  label={messages.businessSettings.accountTypeLabel}
                  selectedKeys={[form.accountType]}
                  onSelectionChange={(keys) => {
                    const value = String(
                      Array.from(keys)[0] ?? "without_appointments",
                    );
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            accountType:
                              value === "with_appointments"
                                ? "with_appointments"
                                : "without_appointments",
                          }
                        : prev,
                    );
                  }}
                >
                  <SelectItem key="with_appointments">
                    {messages.businessSettings.accountTypeWithAppointments}
                  </SelectItem>
                  <SelectItem key="without_appointments">
                    {messages.businessSettings.accountTypeWithoutAppointments}
                  </SelectItem>
                </Select>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label={messages.businessSettings.nameLabel}
                    value={form.name}
                    onValueChange={(value) =>
                      setForm((prev) =>
                        prev ? { ...prev, name: value } : prev,
                      )
                    }
                    isRequired
                    isInvalid={Boolean(fieldErrors.name)}
                    errorMessage={fieldErrors.name}
                  />
                  <Input
                    label={messages.businessSettings.industryLabel}
                    value={form.industry}
                    onValueChange={(value) =>
                      setForm((prev) =>
                        prev ? { ...prev, industry: value } : prev,
                      )
                    }
                    isInvalid={Boolean(fieldErrors.industry)}
                    errorMessage={fieldErrors.industry}
                  />
                </div>

                <Textarea
                  label={messages.businessSettings.shortDescriptionLabel}
                  value={form.shortDescription}
                  onValueChange={(value) =>
                    setForm((prev) =>
                      prev ? { ...prev, shortDescription: value } : prev,
                    )
                  }
                  minRows={3}
                  isInvalid={Boolean(fieldErrors.shortDescription)}
                  errorMessage={fieldErrors.shortDescription}
                />

                <Textarea
                  label={messages.businessSettings.primaryGoalLabel}
                  value={form.primaryGoal}
                  onValueChange={(value) =>
                    setForm((prev) =>
                      prev ? { ...prev, primaryGoal: value } : prev,
                    )
                  }
                  minRows={3}
                  isInvalid={Boolean(fieldErrors.primaryGoal)}
                  errorMessage={fieldErrors.primaryGoal}
                />

                <Divider />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label={messages.businessSettings.contactEmailLabel}
                    type="email"
                    value={form.contactEmail}
                    onValueChange={(value) =>
                      setForm((prev) =>
                        prev ? { ...prev, contactEmail: value } : prev,
                      )
                    }
                    isInvalid={Boolean(fieldErrors.contactEmail)}
                    errorMessage={fieldErrors.contactEmail}
                  />
                  <Input
                    label={messages.businessSettings.contactPhoneLabel}
                    value={form.contactPhone}
                    onValueChange={(value) =>
                      setForm((prev) =>
                        prev ? { ...prev, contactPhone: value } : prev,
                      )
                    }
                    isInvalid={Boolean(fieldErrors.contactPhone)}
                    errorMessage={fieldErrors.contactPhone}
                  />
                </div>

                <Input
                  label={messages.businessSettings.websiteLabel}
                  type="url"
                  value={form.website}
                  onValueChange={(value) =>
                    setForm((prev) =>
                      prev ? { ...prev, website: value } : prev,
                    )
                  }
                  isInvalid={Boolean(fieldErrors.website)}
                  errorMessage={fieldErrors.website}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label={messages.businessSettings.addressLabel}
                    value={form.businessAddress}
                    onValueChange={(value) =>
                      setForm((prev) =>
                        prev ? { ...prev, businessAddress: value } : prev,
                      )
                    }
                  />
                  <Select
                    label={messages.businessSettings.timezoneLabel}
                    selectedKeys={[form.businessTimezone]}
                    onSelectionChange={(keys) => {
                      const value = String(Array.from(keys)[0] ?? "UTC");
                      setForm((prev) =>
                        prev ? { ...prev, businessTimezone: value } : prev,
                      );
                    }}
                    isInvalid={Boolean(fieldErrors.businessTimezone)}
                    errorMessage={fieldErrors.businessTimezone}
                  >
                    {timezoneOptions.map((timezone) => (
                      <SelectItem key={timezone}>{timezone}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label={messages.businessSettings.currencyLabel}
                    selectedKeys={[form.businessCurrency]}
                    onSelectionChange={(keys) => {
                      const value = String(Array.from(keys)[0] ?? "TJS");
                      setForm((prev) =>
                        prev ? { ...prev, businessCurrency: value } : prev,
                      );
                    }}
                    isInvalid={Boolean(fieldErrors.businessCurrency)}
                    errorMessage={fieldErrors.businessCurrency}
                  >
                    {BUSINESS_CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.key}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
            </Card>
              </Tab>

              <Tab
                key="delivery"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.deliveryTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-4 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.deliveryTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.deliverySubtitle}
                  </p>
                </div>

                <Switch
                  isSelected={form.deliveryEnabled}
                  onValueChange={(checked) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            deliveryEnabled: checked,
                          }
                        : prev,
                    )
                  }
                >
                  {messages.businessSettings.deliveryEnabledLabel}
                </Switch>

                {form.deliveryEnabled ? (
                  <>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Switch
                        size="sm"
                        isSelected={form.deliveryRequireAddress}
                        onValueChange={(checked) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryRequireAddress: checked,
                                }
                              : prev,
                          )
                        }
                      >
                        {messages.businessSettings.deliveryRequireAddressLabel}
                      </Switch>
                      <Switch
                        size="sm"
                        isSelected={form.deliveryRequireDateTime}
                        onValueChange={(checked) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryRequireDateTime: checked,
                                }
                              : prev,
                          )
                        }
                      >
                        {messages.businessSettings.deliveryRequireDateTimeLabel}
                      </Switch>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Input
                        type="number"
                        size="sm"
                        label={messages.businessSettings.deliveryEtaLabel}
                        value={String(form.deliveryDefaultEtaMinutes)}
                        min={15}
                        max={10080}
                        onValueChange={(value) =>
                          setForm((prev) => {
                            if (!prev) {
                              return prev;
                            }

                            const numeric = Number(value);
                            return {
                              ...prev,
                              deliveryDefaultEtaMinutes:
                                Number.isFinite(numeric) && numeric >= 15
                                  ? Math.min(Math.round(numeric), 10080)
                                  : 15,
                            };
                          })
                        }
                      />
                      <Input
                        type="number"
                        size="sm"
                        label={messages.businessSettings.deliveryFeeLabel}
                        value={form.deliveryFee}
                        min={0}
                        step={0.01}
                        onValueChange={(value) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryFee: value,
                                }
                              : prev,
                          )
                        }
                      />
                      <Input
                        type="number"
                        size="sm"
                        label={messages.businessSettings.deliveryFreeFromLabel}
                        value={form.deliveryFreeFromAmount}
                        min={0}
                        step={0.01}
                        onValueChange={(value) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryFreeFromAmount: value,
                                }
                              : prev,
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        type="time"
                        size="sm"
                        label={
                          messages.businessSettings.deliveryAvailableFromLabel
                        }
                        value={form.deliveryAvailableFrom}
                        onValueChange={(value) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryAvailableFrom: value,
                                }
                              : prev,
                          )
                        }
                      />
                      <Input
                        type="time"
                        size="sm"
                        label={
                          messages.businessSettings.deliveryAvailableToLabel
                        }
                        value={form.deliveryAvailableTo}
                        onValueChange={(value) =>
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  deliveryAvailableTo: value,
                                }
                              : prev,
                          )
                        }
                      />
                    </div>

                    <Textarea
                      label={messages.businessSettings.deliveryNotesLabel}
                      value={form.deliveryNotes}
                      onValueChange={(value) =>
                        setForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                deliveryNotes: value,
                              }
                            : prev,
                        )
                      }
                      minRows={2}
                    />
                  </>
                ) : null}
              </CardBody>
            </Card>
              </Tab>

              <Tab
                key="required"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.requiredFieldsTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-4 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.requiredFieldsTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.requiredFieldsSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-medium border border-default-200 p-3">
                    <h3 className="mb-2 text-sm font-semibold">
                      {messages.businessSettings.orderRequiredFieldsLabel}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ORDER_REQUIRED_OPTIONS.map((option) => (
                        <Checkbox
                          key={option.key}
                          size="sm"
                          isSelected={form.orderRequiredFields.includes(
                            option.key,
                          )}
                          onValueChange={(checked) =>
                            setForm((prev) => {
                              if (!prev) {
                                return prev;
                              }

                              const next = checked
                                ? [...prev.orderRequiredFields, option.key]
                                : prev.orderRequiredFields.filter(
                                    (item) => item !== option.key,
                                  );

                              return {
                                ...prev,
                                orderRequiredFields: Array.from(new Set(next)),
                              };
                            })
                          }
                        >
                          {messages.businessSettings[option.labelKey]}
                        </Checkbox>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-medium border border-default-200 p-3">
                    <h3 className="mb-2 text-sm font-semibold">
                      {messages.businessSettings.appointmentRequiredFieldsLabel}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {APPOINTMENT_REQUIRED_OPTIONS.map((option) => (
                        <Checkbox
                          key={option.key}
                          size="sm"
                          isSelected={form.appointmentRequiredFields.includes(
                            option.key,
                          )}
                          onValueChange={(checked) =>
                            setForm((prev) => {
                              if (!prev) {
                                return prev;
                              }

                              const next = checked
                                ? [
                                    ...prev.appointmentRequiredFields,
                                    option.key,
                                  ]
                                : prev.appointmentRequiredFields.filter(
                                    (item) => item !== option.key,
                                  );

                              return {
                                ...prev,
                                appointmentRequiredFields: Array.from(
                                  new Set(next),
                                ),
                              };
                            })
                          }
                        >
                          {messages.businessSettings[option.labelKey]}
                        </Checkbox>
                      ))}
                      <Checkbox
                        size="sm"
                        isSelected={form.appointmentAutoConfirm}
                        isDisabled={!isAppointmentAccount}
                        onValueChange={(checked) =>
                          setForm((prev) =>
                            prev
                              ? { ...prev, appointmentAutoConfirm: checked }
                              : prev,
                          )
                        }
                      >
                        {messages.businessSettings.autoConfirmLabel}
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
              </Tab>

              <Tab
                key="aiLanguages"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.aiLanguagesTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-4 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.aiLanguagesTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.aiLanguagesSubtitle}
                  </p>
                </div>

                <div className="rounded-medium border border-default-200 p-3">
                  <h3 className="mb-2 text-sm font-semibold">
                    {messages.businessSettings.aiLanguagesLabel}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {AI_RESPONSE_LANGUAGE_OPTIONS.map((option) => (
                      <Checkbox
                        key={option.key}
                        size="sm"
                        isSelected={form.aiResponseLanguages.includes(
                          option.key,
                        )}
                        onValueChange={(checked) =>
                          setForm((prev) => {
                            if (!prev) {
                              return prev;
                            }

                            const next = checked
                              ? [...prev.aiResponseLanguages, option.key]
                              : prev.aiResponseLanguages.filter(
                                  (item) => item !== option.key,
                                );

                            return {
                              ...prev,
                              aiResponseLanguages: Array.from(new Set(next)),
                            };
                          })
                        }
                      >
                        {messages.businessSettings[option.labelKey]}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
              </Tab>

              <Tab
                key="schedule"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.scheduleTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-4 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.scheduleTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.scheduleSubtitle}
                  </p>
                </div>

                <div className="space-y-2">
                  {WEEK_DAYS.map((day) => {
                    const schedule = form.businessSchedule[day];
                    const isDayOff = schedule.is_day_off;

                    return (
                      <div
                        key={day}
                        className="rounded-medium border border-default-200 px-3 py-2"
                      >
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center">
                          <p className="text-sm font-semibold leading-none">
                            {dayLabel(day, messages)}
                          </p>

                          {isDayOff ? (
                            <p className="text-sm text-default-500">
                              {messages.businessSettings.dayOffLabel}
                            </p>
                          ) : (
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                              <Input
                                type="time"
                                size="sm"
                                aria-label={`${dayLabel(day, messages)} ${
                                  messages.businessSettings.startTimeLabel
                                }`}
                                value={schedule.start_time ?? "09:00"}
                                onValueChange={(value) =>
                                  setForm((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          businessSchedule: {
                                            ...prev.businessSchedule,
                                            [day]: {
                                              ...prev.businessSchedule[day],
                                              start_time: value,
                                            },
                                          },
                                        }
                                      : prev,
                                  )
                                }
                              />
                              <span className="text-xs text-default-500">
                                -
                              </span>
                              <Input
                                type="time"
                                size="sm"
                                aria-label={`${dayLabel(day, messages)} ${
                                  messages.businessSettings.endTimeLabel
                                }`}
                                value={schedule.end_time ?? "18:00"}
                                onValueChange={(value) =>
                                  setForm((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          businessSchedule: {
                                            ...prev.businessSchedule,
                                            [day]: {
                                              ...prev.businessSchedule[day],
                                              end_time: value,
                                            },
                                          },
                                        }
                                      : prev,
                                  )
                                }
                              />
                            </div>
                          )}

                          <Switch
                            size="sm"
                            isSelected={isDayOff}
                            onValueChange={(checked) =>
                              setForm((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      businessSchedule: {
                                        ...prev.businessSchedule,
                                        [day]: {
                                          is_day_off: checked,
                                          start_time: checked
                                            ? null
                                            : prev.businessSchedule[day]
                                                .start_time ?? "09:00",
                                          end_time: checked
                                            ? null
                                            : prev.businessSchedule[day]
                                                .end_time ?? "18:00",
                                        },
                                      },
                                    }
                                  : prev,
                              )
                            }
                          >
                            {messages.businessSettings.dayOffLabel}
                          </Switch>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
              </Tab>

              <Tab
                key="booking"
                title={
                  <span className="whitespace-nowrap">
                    {messages.businessSettings.bookingTitle}
                  </span>
                }
              >
                <Card className="border border-default-200 shadow-none">
              <CardBody className="space-y-5 p-4 sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">
                    {messages.businessSettings.bookingTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.businessSettings.bookingSubtitle}
                  </p>
                </div>

                {!isAppointmentAccount ? (
                  <Alert
                    color="default"
                    variant="flat"
                    title={messages.businessSettings.bookingDisabledTitle}
                    description={
                      messages.businessSettings.bookingDisabledDescription
                    }
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Select
                        label={messages.businessSettings.slotLabel}
                        selectedKeys={[String(form.appointmentSlotMinutes)]}
                        onSelectionChange={(keys) => {
                          const raw = Number(Array.from(keys)[0] ?? "30");
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  appointmentSlotMinutes: SLOT_OPTIONS.includes(
                                    raw,
                                  )
                                    ? raw
                                    : 30,
                                }
                              : prev,
                          );
                        }}
                      >
                        {SLOT_OPTIONS.map((option) => (
                          <SelectItem key={String(option)}>
                            {`${option} ${messages.businessSettings.minutesUnit}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        label={messages.businessSettings.bufferLabel}
                        selectedKeys={[String(form.appointmentBufferMinutes)]}
                        onSelectionChange={(keys) => {
                          const raw = Number(Array.from(keys)[0] ?? "0");
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  appointmentBufferMinutes:
                                    BUFFER_OPTIONS.includes(raw) ? raw : 0,
                                }
                              : prev,
                          );
                        }}
                      >
                        {BUFFER_OPTIONS.map((option) => (
                          <SelectItem key={String(option)}>
                            {`${option} ${messages.businessSettings.minutesUnit}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        type="number"
                        label={messages.businessSettings.maxDaysAheadLabel}
                        value={String(form.appointmentMaxDaysAhead)}
                        onValueChange={(value) => {
                          const numeric = Number(value);
                          setForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  appointmentMaxDaysAhead:
                                    Number.isFinite(numeric) && numeric > 0
                                      ? numeric
                                      : 1,
                                }
                              : prev,
                          );
                        }}
                        min={1}
                        max={365}
                        isInvalid={Boolean(fieldErrors.appointmentMaxDaysAhead)}
                        errorMessage={fieldErrors.appointmentMaxDaysAhead}
                      />
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
              </Tab>
            </Tabs>

            <div className="flex justify-end">
              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                className="min-w-44"
              >
                {messages.businessSettings.saveButton}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
